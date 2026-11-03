use super::TextModule;
use serde_json::Value;
use std::net::IpAddr;
use url::Url;

/// Options for web-address detection. All of them are exposed through the
/// module's settings entry, so changing behaviour never needs a code change.
#[derive(Debug, Clone)]
pub struct LinkOptions {
    pub allow_missing_scheme: bool,
    pub default_scheme: String,
    pub allow_localhost: bool,
    pub allow_ip: bool,
    pub max_len: usize,
}

impl Default for LinkOptions {
    fn default() -> Self {
        Self {
            allow_missing_scheme: true,
            default_scheme: "https".to_string(),
            allow_localhost: true,
            allow_ip: true,
            max_len: 2048,
        }
    }
}

fn is_valid_host(host: &str, allow_localhost: bool, allow_ip: bool) -> bool {
    if host == "localhost" {
        return allow_localhost;
    }
    if host.parse::<IpAddr>().is_ok() {
        return allow_ip;
    }
    if host.contains('_') || host.len() > 253 {
        return false;
    }
    let labels: Vec<&str> = host.split('.').collect();
    if labels.len() < 2 {
        return false;
    }
    for label in &labels {
        if label.is_empty()
            || label.len() > 63
            || label.starts_with('-')
            || label.ends_with('-')
            || !label.chars().all(|c| c.is_ascii_alphanumeric() || c == '-')
        {
            return false;
        }
    }
    let tld = labels[labels.len() - 1];
    // After Url parsing, a unicode TLD arrives as punycode (xn--...).
    tld.len() >= 2
        && (tld.chars().all(|c| c.is_ascii_alphabetic())
            || (tld.starts_with("xn--") && tld.len() > 4))
}

/// Detect whether the whole trimmed text is a single web address.
///
/// Returns the parsed URL on success, `None` otherwise. This checks
/// syntax only: it never does DNS or a network fetch, so it is fast
/// enough for the auto-overwrite pipeline and never leaks clipboard
/// text to the network.
///
/// Accepted: `http://` / `https://` URLs, and (when enabled) scheme-less
/// `www.example.com` / `example.com` / `localhost:3000` / IP forms,
/// which are normalised to `default_scheme://...`.
/// Rejected, among others: `javascript:`, `data:`, `mailto:`, `file:`,
/// userinfo (`https://user@host`), bare words without a dot, Windows
/// paths, e-mails, and any text containing internal whitespace.
pub fn detect_web_address(input: &str) -> Option<Url> {
    detect_web_address_with_options(input, &LinkOptions::default())
}

pub fn detect_web_address_with_options(input: &str, opts: &LinkOptions) -> Option<Url> {
    let trimmed = input.trim_matches(|c: char| c.is_whitespace() || c == '\u{feff}');
    if trimmed.is_empty() || trimmed.chars().count() > opts.max_len {
        return None;
    }
    if trimmed.chars().any(|c| c.is_control() || c.is_whitespace()) {
        return None;
    }
    if trimmed.contains('\\') {
        return None;
    }

    // `<https://...>` wrapping, common when copying from mail / markdown.
    let mut s = trimmed.to_string();
    if s.len() > 2 && s.starts_with('<') && s.ends_with('>') {
        s = s[1..s.len() - 1].to_string();
        if s.chars().any(|c| c.is_control() || c.is_whitespace()) {
            return None;
        }
    }

    // Trailing sentence punctuation. Brackets are only stripped when
    // unbalanced, so `https://en.wikipedia.org/wiki/Rust_(programming_language)`
    // keeps its closing parenthesis.
    loop {
        let Some(last) = s.chars().last() else { break };
        if matches!(last, '.' | ',' | ';' | ':' | '!' | '?') {
            s.pop();
        } else if matches!(last, ')' | ']' | '}') {
            let open = match last {
                ')' => '(',
                ']' => '[',
                _ => '{',
            };
            let opens = s.chars().filter(|&c| c == open).count();
            let closes = s.chars().filter(|&c| c == last).count();
            if closes > opens {
                s.pop();
            } else {
                break;
            }
        } else {
            break;
        }
    }
    if s.is_empty() {
        return None;
    }

    let mut candidates: Vec<String> = Vec::new();
    if s.contains("://") {
        candidates.push(s.to_string());
    } else if s.starts_with("//") {
        if opts.allow_missing_scheme {
            candidates.push(format!("{}:{}", opts.default_scheme, s));
        }
    } else if opts.allow_missing_scheme {
        candidates.push(format!("{}://{}", opts.default_scheme, s));
    } else {
        return None;
    }

    for candidate in candidates {
        let Ok(url) = Url::parse(&candidate) else {
            continue;
        };
        if url.scheme() != "http" && url.scheme() != "https" {
            continue;
        }
        if !url.username().is_empty() || url.password().is_some() {
            continue;
        }
        let Some(host) = url.host_str() else {
            continue;
        };
        if !is_valid_host(host, opts.allow_localhost, opts.allow_ip) {
            continue;
        }
        return Some(url);
    }
    None
}

/// Module 1: detect a web address and normalise it, otherwise pass through.
pub struct LinkDetector;

impl TextModule for LinkDetector {
    fn id(&self) -> &'static str {
        "link_detector"
    }

    fn name(&self) -> &str {
        "Link detector"
    }

    fn process(&self, input: &str, params: &Value) -> Result<String, String> {
        let opts = LinkOptions {
            allow_missing_scheme: params
                .get("allow_missing_scheme")
                .and_then(|v| v.as_bool())
                .unwrap_or(true),
            default_scheme: match params.get("default_scheme").and_then(|v| v.as_str()) {
                Some("http") => "http".to_string(),
                _ => "https".to_string(),
            },
            allow_localhost: params
                .get("allow_localhost")
                .and_then(|v| v.as_bool())
                .unwrap_or(true),
            allow_ip: params
                .get("allow_ip")
                .and_then(|v| v.as_bool())
                .unwrap_or(true),
            max_len: params
                .get("max_len")
                .and_then(|v| v.as_u64())
                .unwrap_or(2048) as usize,
        };
        if input.chars().count() > opts.max_len {
            return Ok(input.to_string());
        }
        match detect_web_address_with_options(input, &opts) {
            Some(url) => Ok(url.to_string()),
            None => Ok(input.to_string()),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn is_link(s: &str) -> bool {
        detect_web_address(s).is_some()
    }

    #[test]
    fn http_and_https_are_links() {
        assert!(is_link("https://example.com/path?q=1"));
        assert!(is_link("http://example.com/"));
        assert_eq!(
            detect_web_address("https://example.com").unwrap().to_string(),
            "https://example.com/"
        );
    }

    #[test]
    fn missing_scheme_is_normalised_to_https() {
        assert_eq!(
            detect_web_address("www.example.com").unwrap().to_string(),
            "https://www.example.com/"
        );
        assert_eq!(
            detect_web_address("example.com").unwrap().to_string(),
            "https://example.com/"
        );
    }

    #[test]
    fn localhost_and_ip_are_links() {
        assert!(is_link("http://localhost:3000"));
        assert!(is_link("http://192.168.1.1:8080/a"));
    }

    #[test]
    fn trailing_sentence_punctuation_is_stripped() {
        assert_eq!(
            detect_web_address("https://example.com.").unwrap().to_string(),
            "https://example.com/"
        );
        assert_eq!(
            detect_web_address("https://example.com,").unwrap().to_string(),
            "https://example.com/"
        );
    }

    #[test]
    fn balanced_parentheses_are_kept() {
        assert!(is_link(
            "https://en.wikipedia.org/wiki/Rust_(programming_language)"
        ));
    }

    #[test]
    fn non_links_are_rejected() {
        assert!(!is_link("hello world"));
        assert!(!is_link("Check link này https://example.com nhé"));
        assert!(!is_link("C:\\Users\\file.txt"));
        assert!(!is_link("a@gmail.com"));
        assert!(!is_link("https://exa mple.com"));
        assert!(!is_link("https://"));
        assert!(!is_link("example"));
        assert!(!is_link("javascript:alert(1)"));
        assert!(!is_link("mailto:a@example.com"));
        assert!(!is_link("https://user@example.com/"));
    }
}
