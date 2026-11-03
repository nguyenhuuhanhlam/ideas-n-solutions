//! English -> Vietnamese translator (skeleton, notifier only).
//!
//! This is deliberately NOT a `TextModule`: it never transforms text
//! and never writes the clipboard. It only reads the text that was
//! just copied, and, when it looks like a single English word or a
//! short phrase and is found in the dictionary, it returns the
//! Vietnamese gloss for the caller to show in a tray balloon.
//!
//! Gating (anti-spam): the trimmed text must be 1..=max_words words,
//! at most max_len chars, and contain only ASCII letters, spaces,
//! hyphens and apostrophes. Links, sentences, code, numbers and
//! Vietnamese text (non-ASCII) are all rejected silently: no balloon
//! for a miss, no balloon for a non-candidate.
//!
//! Lookup: exact match on the lowercased, whitespace-normalised form
//! only. No stemming in the skeleton: `books` does not match `book`.
//! That is a deliberate choice against guessing a wrong meaning.
//!
//! The dictionary lives in its own file, `assets/dictionary.tsv`
//! (one entry per line: `english<TAB>vietnamese gloss`, multiple
//! meanings separated by "; "), and is embedded into the binary at
//! compile time with `include_str!`. Editing the dictionary therefore
//! means editing that file and rebuilding, and distribution stays a
//! single exe: no separate dictionary file needs to ship with it.
//!
//! Data source: English Wiktionary via kaikki.org (dump 2026-10-01,
//! CC-BY-SA 4.0, see README). Meanings are kept in Wiktionary sense
//! order (main sense first), up to what fits in a 240-char balloon,
//! and affix keys (starting/ending with '-') are excluded. The file
//! only holds keys the app can actually trigger (1-3 words, at most
//! 40 chars, ASCII letters/spaces/hyphens/apostrophes).

use std::collections::HashMap;
use std::sync::LazyLock;

/// The dictionary, parsed once from `assets/dictionary.tsv`.
/// Keys are already lowercased and whitespace-normalised in the file.
static DICTIONARY: LazyLock<HashMap<&'static str, &'static str>> = LazyLock::new(|| {
    include_str!("../../assets/dictionary.tsv")
        .lines()
        .filter(|line| !line.trim().is_empty())
        .filter_map(|line| line.split_once('\t'))
        .collect()
});

/// Normalise for lookup: trim, lowercase, collapse whitespace.
pub fn normalize(text: &str) -> String {
    text.split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
        .to_ascii_lowercase()
}

/// True when the text is a plausible English word / short phrase.
pub fn is_candidate(text: &str, max_words: usize, max_len: usize) -> bool {
    let trimmed = text.trim();
    if trimmed.is_empty() || trimmed.chars().count() > max_len {
        return false;
    }
    if !trimmed
        .chars()
        .all(|c| c.is_ascii_alphabetic() || c == ' ' || c == '-' || c == '\'')
    {
        return false;
    }
    let words = trimmed.split_whitespace().count();
    words >= 1 && words <= max_words && trimmed.chars().any(|c| c.is_ascii_alphabetic())
}

/// Look up an already-normalised key. Returns the gloss, if found.
pub fn lookup(normalized: &str) -> Option<&'static str> {
    DICTIONARY.get(normalized).copied()
}

/// Translate copied text. Returns (display word, gloss) on a hit,
/// where the display word is the text as copied (trimmed), and the
/// gloss is truncated to fit a tray balloon body (~240 chars).
/// Returns None for a non-candidate or a dictionary miss: the caller
/// shows nothing in both cases.
pub fn translate(text: &str, max_words: usize, max_len: usize) -> Option<(String, String)> {
    if !is_candidate(text, max_words, max_len) {
        return None;
    }
    let normalized = normalize(text);
    let gloss = lookup(&normalized)?;
    let mut gloss: String = gloss.chars().take(240).collect();
    // Avoid a dangling half-word at the cut: trim back to the last
    // space only when we actually truncated.
    if gloss.chars().count() == 240 {
        if let Some(pos) = gloss.rfind(' ') {
            gloss.truncate(pos);
        }
    }
    // Display word: as copied, but with runs of whitespace collapsed,
    // so the balloon title never shows a gap from a sloppy copy.
    let display = text.split_whitespace().collect::<Vec<_>>().join(" ");
    Some((display, gloss))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dictionary_file_parses_with_unique_keys() {
        let lines: Vec<&str> = include_str!("../../assets/dictionary.tsv")
            .lines()
            .filter(|line| !line.trim().is_empty())
            .collect();
        assert!(lines.len() > 10_000, "full dictionary unexpectedly small: {}", lines.len());
        for line in &lines {
            assert!(line.contains('\t'), "entry without a tab separator: {line:?}");
            let (key, gloss) = line.split_once('\t').unwrap();
            assert!(!key.starts_with('-') && !key.ends_with('-'), "affix key: {key:?}");
            assert!(gloss.chars().count() <= 240, "gloss over balloon limit: {key:?}");
        }
        // No duplicate keys: the map must hold exactly one entry per line.
        assert_eq!(DICTIONARY.len(), lines.len(), "duplicate dictionary key");
        // Sense order: the main sense comes first, not a short secondary one.
        let hello = DICTIONARY.get("hello").copied().unwrap_or("");
        assert!(hello.starts_with("xin chào"), "hello gloss: {hello:?}");
        assert!(DICTIONARY.get("time").copied().unwrap_or("").contains("thời gian"));
    }

    #[test]
    fn lookup_is_case_insensitive_via_translate() {
        // Full dictionary: the gloss has several senses, main sense first.
        assert!(translate("Hello", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("xin chào"));
        assert!(translate("HELLO", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("xin chào"));
        assert_eq!(
            translate("Machine Learning", 3, 40).map(|(_, g)| g),
            Some("học máy".to_string())
        );
        assert_eq!(
            translate("  take   off  ", 3, 40).map(|(w, _)| w),
            Some("take off".to_string())
        );
    }

    #[test]
    fn miss_and_non_candidates_return_none() {
        assert_eq!(translate("xyzabc", 3, 40), None);
        // Exact match only: no stemming in the skeleton.
        assert_eq!(translate("books", 3, 40), None);
        // Sentence: too many words.
        assert_eq!(translate("hello world this is", 3, 40), None);
        // Link, code, numbers, Vietnamese diacritics: not candidates.
        assert_eq!(translate("https://example.com", 3, 40), None);
        assert_eq!(translate("hello123", 3, 40), None);
        assert_eq!(translate("xin chào", 3, 40), None);
        assert_eq!(translate("", 3, 40), None);
        assert_eq!(translate("a very long phrase that exceeds the limit here", 3, 40), None);
    }

    #[test]
    fn candidate_gating() {
        assert!(is_candidate("hello", 3, 40));
        assert!(is_candidate("machine learning", 3, 40));
        assert!(is_candidate("take-off", 3, 40));
        assert!(!is_candidate("one two three four", 3, 40));
        assert!(!is_candidate("hello!", 3, 40));
    }
}
