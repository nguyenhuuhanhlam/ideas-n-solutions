use super::TextModule;
use serde_json::Value;

/// Remove query parameters from an http/https URL string, keeping
/// everything else verbatim.
///
/// Rules locked in discussion (2026-11-03):
/// - Only exact parameter names match: `xfbclid` is NOT `fbclid`.
/// - A `fbclid` inside another parameter's percent-encoded value is NOT
///   a real parameter and is left alone. This is why the query is split
///   on raw `&` instead of doing a string search/replace.
/// - Order, encoding and duplicates of the remaining parameters are
///   preserved: the remaining query is rejoined, never re-encoded.
/// - The fragment (`#...`) is preserved untouched.
/// - If nothing remains in the query, the `?` is removed entirely.
/// - This function does NOT validate the URL beyond requiring an
///   http/https scheme; validation/normalisation is the link detector's
///   job and it runs first in the pipeline.
pub fn strip_query_params(input: &str, remove: &[String], case_insensitive: bool) -> String {
    let trimmed = input.trim_matches(|c: char| c.is_whitespace() || c == '\u{feff}');
    // Scheme check, case-insensitive, before the "://".
    let Some(scheme_end) = trimmed.find("://") else {
        return input.to_string();
    };
    let scheme = &trimmed[..scheme_end];
    if !scheme.eq_ignore_ascii_case("http") && !scheme.eq_ignore_ascii_case("https") {
        return input.to_string();
    }

    // Fragment first, so a `?` inside a fragment is never treated as query.
    let (before_fragment, fragment) = match trimmed.split_once('#') {
        Some((before, after)) => (before, Some(after)),
        None => (trimmed, None),
    };
    let Some((base, query)) = before_fragment.split_once('?') else {
        return trimmed.to_string();
    };

    let kept: Vec<&str> = query
        .split('&')
        .filter(|segment| {
            let key = segment.split('=').next().unwrap_or("");
            !remove.iter().any(|name| {
                if case_insensitive {
                    key.eq_ignore_ascii_case(name)
                } else {
                    key == name
                }
            })
        })
        .collect();

    let mut out = String::new();
    out.push_str(base);
    if !kept.is_empty() {
        out.push('?');
        out.push_str(&kept.join("&"));
    }
    if let Some(frag) = fragment {
        out.push('#');
        out.push_str(frag);
    }
    out
}

/// Convenience wrapper for the default configuration: strip `fbclid` only.
pub fn strip_fbclid(input: &str) -> String {
    strip_query_params(input, &["fbclid".to_string()], true)
}

/// Module 2: strip tracking query parameters (default: `fbclid` only).
///
/// Settings keys:
/// - `strip`: array of parameter names, default `["fbclid"]`.
/// - `case_insensitive`: bool, default `true`.
pub struct FbclidStripper;

impl TextModule for FbclidStripper {
    fn id(&self) -> &'static str {
        "fbclid_stripper"
    }

    fn name(&self) -> &str {
        "FBCLID stripper"
    }

    fn process(&self, input: &str, params: &Value) -> Result<String, String> {
        let strip: Vec<String> = params
            .get("strip")
            .and_then(|v| v.as_array())
            .map(|arr| {
                arr.iter()
                    .filter_map(|v| v.as_str().map(|s| s.to_string()))
                    .collect()
            })
            .filter(|v: &Vec<String>| !v.is_empty())
            .unwrap_or_else(|| vec!["fbclid".to_string()]);
        let case_insensitive = params
            .get("case_insensitive")
            .and_then(|v| v.as_bool())
            .unwrap_or(true);
        Ok(strip_query_params(input, &strip, case_insensitive))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fbclid_only_is_removed_with_question_mark() {
        assert_eq!(
            strip_fbclid("https://example.com/bai-viet?fbclid=IwARxxx"),
            "https://example.com/bai-viet"
        );
    }

    #[test]
    fn other_params_are_kept_in_order() {
        assert_eq!(
            strip_fbclid("https://example.com/?a=1&fbclid=xxx&b=2"),
            "https://example.com/?a=1&b=2"
        );
        assert_eq!(
            strip_fbclid("https://example.com/?fbclid=xxx&a=1"),
            "https://example.com/?a=1"
        );
        assert_eq!(
            strip_fbclid("https://example.com/?a=1&fbclid=xxx"),
            "https://example.com/?a=1"
        );
    }

    #[test]
    fn fragment_is_preserved() {
        assert_eq!(
            strip_fbclid("https://example.com/?fbclid=xxx#tieu-de"),
            "https://example.com/#tieu-de"
        );
    }

    #[test]
    fn multiple_fbclid_and_no_value_are_removed() {
        assert_eq!(
            strip_fbclid("https://example.com/?fbclid=xxx&fbclid=yyy"),
            "https://example.com/"
        );
        assert_eq!(
            strip_fbclid("https://example.com/?fbclid"),
            "https://example.com/"
        );
    }

    #[test]
    fn similar_names_and_encoded_values_are_kept() {
        assert_eq!(
            strip_fbclid("https://example.com/?xfbclid=1"),
            "https://example.com/?xfbclid=1"
        );
        assert_eq!(
            strip_fbclid(
                "https://example.com/?redirect=https%3A%2F%2Fother.com%2F%3Ffbclid%3Dxxx"
            ),
            "https://example.com/?redirect=https%3A%2F%2Fother.com%2F%3Ffbclid%3Dxxx"
        );
    }

    #[test]
    fn non_http_urls_and_no_query_pass_through() {
        assert_eq!(
            strip_fbclid("https://example.com/bai-viet"),
            "https://example.com/bai-viet"
        );
        assert_eq!(
            strip_fbclid("ftp://example.com/?fbclid=xxx"),
            "ftp://example.com/?fbclid=xxx"
        );
        assert_eq!(strip_fbclid("hello world"), "hello world");
    }

    #[test]
    fn case_insensitive_by_default() {
        assert_eq!(
            strip_fbclid("https://example.com/?FBCLID=xxx&a=1"),
            "https://example.com/?a=1"
        );
    }
}
