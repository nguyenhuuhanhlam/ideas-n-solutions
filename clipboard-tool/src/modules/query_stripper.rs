use super::TextModule;
use serde_json::Value;

/// Remove the ENTIRE query string from an http/https URL, but only
/// for hosts on the configured list (default: `shopee.vn`).
///
/// Why host-scoped instead of all URLs: stripping the query from
/// every URL would break links that need it (e.g. YouTube
/// `watch?v=...`, search results). Shopee product links carry only
/// tracking parameters after the `?`, so for those hosts the clean
/// link is the part before it.
///
/// Rules:
/// - Host match is case-insensitive, exact or by parent domain:
///   `shopee.vn` matches `shopee.vn` and `www.shopee.vn`, but NOT
///   `notshopee.vn` or `shopee.vn.evil.com`.
/// - Everything from the first `?` is removed, including the `?`
///   itself and anything after it (so a trailing bare `?` is also
///   cleaned, and a fragment after the query goes with it).
/// - A `?` inside a fragment (`#...?...`) is NOT a query and is left
///   alone, same as the fbclid stripper: the fragment is split off
///   before looking for `?`.
/// - Non-http(s) text and URLs without a query pass through unchanged.
/// - This function does NOT validate the URL beyond requiring an
///   http/https scheme; validation/normalisation is the link
///   detector's job and it runs first in the pipeline.
pub fn strip_query_for_hosts(input: &str, hosts: &[String]) -> String {
    let trimmed = input.trim_matches(|c: char| c.is_whitespace() || c == '\u{feff}');
    let Some(scheme_end) = trimmed.find("://") else {
        return input.to_string();
    };
    let scheme = &trimmed[..scheme_end];
    if !scheme.eq_ignore_ascii_case("http") && !scheme.eq_ignore_ascii_case("https") {
        return input.to_string();
    }

    // Host: after "://", up to the first '/', '?' or '#'. Strip any
    // userinfo and port before comparing.
    let rest = &trimmed[scheme_end + 3..];
    let host_end = rest
        .find(|c| c == '/' || c == '?' || c == '#')
        .unwrap_or(rest.len());
    let host_port = &rest[..host_end];
    let host_no_userinfo = host_port.rsplit('@').next().unwrap_or("");
    let host = host_no_userinfo.split(':').next().unwrap_or("");
    let host_lower = host.to_ascii_lowercase();
    let matched = hosts.iter().any(|h| {
        let h = h.trim().to_ascii_lowercase();
        !h.is_empty() && (host_lower == h || host_lower.ends_with(&format!(".{h}")))
    });
    if !matched {
        return trimmed.to_string();
    }

    // Fragment first, so a `?` inside a fragment is never treated as query.
    let (before_fragment, _) = match trimmed.split_once('#') {
        Some((before, _)) => (before, ()),
        None => (trimmed, ()),
    };
    let Some((base, _query)) = before_fragment.split_once('?') else {
        return trimmed.to_string();
    };
    base.to_string()
}

/// Module 3: strip the whole query string for configured hosts
/// (default: `shopee.vn` only).
///
/// Settings keys:
/// - `hosts`: array of host names, default `["shopee.vn"]`.
pub struct QueryStripper;

impl TextModule for QueryStripper {
    fn id(&self) -> &'static str {
        "query_stripper"
    }

    fn name(&self) -> &str {
        "Query stripper"
    }

    fn process(&self, input: &str, params: &Value) -> Result<String, String> {
        let hosts: Vec<String> = params
            .get("hosts")
            .and_then(|v| v.as_array())
            .map(|arr| {
                arr.iter()
                    .filter_map(|v| v.as_str().map(|s| s.to_string()))
                    .collect()
            })
            .filter(|v: &Vec<String>| !v.is_empty())
            .unwrap_or_else(|| vec!["shopee.vn".to_string()]);
        Ok(strip_query_for_hosts(input, &hosts))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn shopee() -> Vec<String> {
        vec!["shopee.vn".to_string()]
    }

    #[test]
    fn shopee_product_link_loses_query() {
        assert_eq!(
            strip_query_for_hosts(
                "https://shopee.vn/product/110272203/27608833519?sp_atk=abc&xptdk=xyz",
                &shopee()
            ),
            "https://shopee.vn/product/110272203/27608833519"
        );
    }

    #[test]
    fn trailing_bare_question_mark_is_removed() {
        assert_eq!(
            strip_query_for_hosts(
                "https://shopee.vn/product/110272203/27608833519?",
                &shopee()
            ),
            "https://shopee.vn/product/110272203/27608833519"
        );
    }

    #[test]
    fn subdomain_matches_but_lookalikes_do_not() {
        assert_eq!(
            strip_query_for_hosts("https://www.shopee.vn/product/1/2?a=1", &shopee()),
            "https://www.shopee.vn/product/1/2"
        );
        assert_eq!(
            strip_query_for_hosts("https://notshopee.vn/product/1/2?a=1", &shopee()),
            "https://notshopee.vn/product/1/2?a=1"
        );
        assert_eq!(
            strip_query_for_hosts("https://shopee.vn.evil.com/product/1/2?a=1", &shopee()),
            "https://shopee.vn.evil.com/product/1/2?a=1"
        );
    }

    #[test]
    fn other_hosts_keep_their_query() {
        assert_eq!(
            strip_query_for_hosts("https://www.youtube.com/watch?v=dQw4w9WgXcQ", &shopee()),
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        );
        assert_eq!(
            strip_query_for_hosts("https://example.com/?a=1&fbclid=xxx", &shopee()),
            "https://example.com/?a=1&fbclid=xxx"
        );
    }

    #[test]
    fn no_query_and_non_urls_pass_through() {
        assert_eq!(
            strip_query_for_hosts("https://shopee.vn/product/1/2", &shopee()),
            "https://shopee.vn/product/1/2"
        );
        assert_eq!(strip_query_for_hosts("hello world", &shopee()), "hello world");
        assert_eq!(
            strip_query_for_hosts("ftp://shopee.vn/product/1/2?a=1", &shopee()),
            "ftp://shopee.vn/product/1/2?a=1"
        );
    }

    #[test]
    fn question_mark_in_fragment_is_not_a_query() {
        assert_eq!(
            strip_query_for_hosts("https://shopee.vn/x#frag?ment", &shopee()),
            "https://shopee.vn/x#frag?ment"
        );
        // But a real query before the fragment removes the fragment too:
        // everything after the `?` goes.
        assert_eq!(
            strip_query_for_hosts("https://shopee.vn/x?a=1#frag", &shopee()),
            "https://shopee.vn/x"
        );
    }

    #[test]
    fn host_match_is_case_insensitive() {
        assert_eq!(
            strip_query_for_hosts("https://SHOPEE.VN/product/1/2?a=1", &shopee()),
            "https://SHOPEE.VN/product/1/2"
        );
    }
}
