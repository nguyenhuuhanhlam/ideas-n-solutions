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
//! The sample dictionary below is sorted by key so lookup is a binary
//! search; the full kaikki.org dictionary (measured later) will use
//! the same shape, generated as a PHF map if it grows large enough
//! to justify it. The sample data is a placeholder, not the real
//! dictionary, and must be replaced by the measured dataset.

/// Sample dictionary: (english, vietnamese gloss), sorted by key.
/// Keep glosses short: a tray balloon only fits ~256 chars, and the
/// caller truncates anyway. Multiple meanings are separated by "; ".
static SAMPLE_DICT: &[(&str, &str)] = &[
    ("account", "tài khoản"),
    ("apple", "quả táo"),
    ("book", "cuốn sách; sách"),
    ("bridge", "cây cầu"),
    ("computer", "máy tính"),
    ("dog", "con chó"),
    ("door", "cánh cửa"),
    ("dream", "giấc mơ; mơ"),
    ("friend", "người bạn"),
    ("garden", "khu vườn"),
    ("hello", "xin chào"),
    ("house", "ngôi nhà"),
    ("journey", "chuyến đi; hành trình"),
    ("language", "ngôn ngữ"),
    ("library", "thư viện"),
    ("machine learning", "học máy"),
    ("market", "chợ; thị trường"),
    ("morning", "buổi sáng"),
    ("mountain", "ngọn núi"),
    ("newspaper", "báo; tờ báo"),
    ("river", "dòng sông"),
    ("school", "trường học"),
    ("search", "tìm kiếm"),
    ("software", "phần mềm"),
    ("sun", "mặt trời"),
    ("table", "cái bàn"),
    ("take off", "cất cánh; cởi ra"),
    ("teacher", "giáo viên"),
    ("thank you", "cảm ơn"),
    ("time", "thời gian"),
    ("travel", "du lịch; đi lại"),
    ("water", "nước"),
    ("window", "cửa sổ"),
    ("work", "công việc; làm việc"),
    ("world", "thế giới"),
    ("write", "viết"),
];

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
    SAMPLE_DICT
        .binary_search_by(|(key, _)| key.cmp(&normalized))
        .ok()
        .map(|idx| SAMPLE_DICT[idx].1)
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
    fn sample_dict_is_sorted_for_binary_search() {
        for pair in SAMPLE_DICT.windows(2) {
            assert!(pair[0].0 < pair[1].0, "unsorted keys: {:?} >= {:?}", pair[0].0, pair[1].0);
        }
    }

    #[test]
    fn lookup_is_case_insensitive_via_translate() {
        assert_eq!(translate("Hello", 3, 40).map(|(_, g)| g), Some("xin chào".to_string()));
        assert_eq!(translate("HELLO", 3, 40).map(|(_, g)| g), Some("xin chào".to_string()));
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
