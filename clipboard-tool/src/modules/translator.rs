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
//! first. Wiktionary's translation tables sit on lemmas, so inflected
//! forms (`books`, `worked`, `working`) are usually not dictionary
//! keys at all; for a single word with no exact hit, a lemma fallback
//! tries suffix rules (plural, -ed, -ing, possessive) plus a small
//! irregular table, and returns the FIRST candidate that is actually
//! a dictionary key. Because every candidate must hit the dictionary,
//! a wrong guess can never produce a wrong gloss: at worst it stays
//! a silent miss, exactly as before. Phrases keep exact match only.
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

/// Common irregular inflections (word -> lemma). Kept small on purpose:
/// regular forms are handled by the suffix rules below, and every
/// candidate is verified against the dictionary anyway.
static IRREGULAR: &[(&str, &str)] = &[
    ("went", "go"), ("gone", "go"),
    ("took", "take"), ("taken", "take"),
    ("ate", "eat"), ("eaten", "eat"),
    ("saw", "see"), ("seen", "see"),
    ("gave", "give"), ("given", "give"),
    ("made", "make"),
    ("found", "find"), ("thought", "think"),
    ("brought", "bring"), ("bought", "buy"), ("caught", "catch"),
    ("taught", "teach"), ("told", "tell"), ("sold", "sell"),
    ("sent", "send"), ("spent", "spend"), ("built", "build"),
    ("won", "win"), ("wrote", "write"), ("written", "write"),
    ("spoke", "speak"), ("spoken", "speak"),
    ("broke", "break"), ("broken", "break"),
    ("chose", "choose"), ("chosen", "choose"),
    ("drove", "drive"), ("driven", "drive"),
    ("rode", "ride"), ("ridden", "ride"),
    ("rose", "rise"), ("risen", "rise"),
    ("fell", "fall"), ("fallen", "fall"),
    ("began", "begin"), ("begun", "begin"),
    ("drank", "drink"), ("drunk", "drink"),
    ("sang", "sing"), ("sung", "sing"),
    ("rang", "ring"), ("rung", "ring"),
    ("swam", "swim"), ("swum", "swim"),
    ("kept", "keep"), ("slept", "sleep"), ("swept", "sweep"),
    ("wept", "weep"), ("left", "leave"), ("felt", "feel"),
    ("meant", "mean"), ("dreamt", "dream"), ("burnt", "burn"),
    ("learnt", "learn"),
    ("children", "child"), ("men", "man"), ("women", "woman"),
    ("feet", "foot"), ("teeth", "tooth"), ("geese", "goose"),
    ("mice", "mouse"), ("people", "person"), ("oxen", "ox"),
];

fn push_candidate(out: &mut Vec<String>, word: &str, cand: &str) {
    if !cand.is_empty() && cand != word && !out.iter().any(|c| c == cand) {
        out.push(cand.to_string());
    }
}

fn undoubled(base: &str) -> Option<String> {
    let mut chars = base.chars();
    let last = chars.next_back()?;
    let prev = chars.next_back()?;
    if last == prev && !matches!(last, 'a' | 'e' | 'i' | 'o' | 'u') {
        let mut s = base.to_string();
        s.pop();
        Some(s)
    } else {
        None
    }
}

/// Lemma candidates for a single normalised word, in priority order.
/// The caller tries them in order and takes the first dictionary hit.
pub fn lemma_candidates(word: &str) -> Vec<String> {
    let mut out: Vec<String> = Vec::new();
    for (inflected, lemma) in IRREGULAR {
        if *inflected == word {
            push_candidate(&mut out, word, lemma);
        }
    }
    // Possessive: book's -> book.
    if let Some(base) = word.strip_suffix("'s") {
        push_candidate(&mut out, word, base);
    }
    // Plural / 3rd person: -ies -> -y, -s, -es (strip "s" first, so
    // houses -> house hits before houses -> hous is even tried, while
    // boxes still reaches box via the -es candidate).
    if word.len() > 3 {
        if let Some(base) = word.strip_suffix("ies") {
            push_candidate(&mut out, word, &format!("{base}y"));
        }
    }
    if word.ends_with('s') && word.len() > 2 {
        push_candidate(&mut out, word, &word[..word.len() - 1]);
        if let Some(base) = word.strip_suffix("es") {
            push_candidate(&mut out, word, base);
        }
    }
    // -ing: making -> mak, make; running -> runn, run; lying -> ly, lie.
    // The y -> ie candidate must come before base + "e": otherwise
    // lying would hit "lye" (nước tro) instead of "lie" (nằm), and
    // dying would hit "dye" (thuốc nhuộm) instead of "die" (chết).
    if let Some(base) = word.strip_suffix("ing") {
        if base.len() >= 2 {
            push_candidate(&mut out, word, base);
            if let Some(stem) = base.strip_suffix('y') {
                push_candidate(&mut out, word, &format!("{stem}ie"));
            }
            push_candidate(&mut out, word, &format!("{base}e"));
            if let Some(u) = undoubled(base) {
                push_candidate(&mut out, word, &u);
                let u2 = u.clone();
                push_candidate(&mut out, word, &format!("{u2}e"));
            }
        }
    }
    // -ed: tried -> try; worked -> work; liked -> lik, like;
    // stopped -> stopp, stop.
    if word.len() > 3 {
        if let Some(base) = word.strip_suffix("ied") {
            push_candidate(&mut out, word, &format!("{base}y"));
        } else if let Some(base) = word.strip_suffix("ed") {
            if !base.is_empty() {
                push_candidate(&mut out, word, base);
                push_candidate(&mut out, word, &format!("{base}e"));
                if let Some(u) = undoubled(base) {
                    push_candidate(&mut out, word, &u);
                    let u2 = u.clone();
                    push_candidate(&mut out, word, &format!("{u2}e"));
                }
            }
        }
    }
    out
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
    // Exact hit first; for a single word with no exact hit, try the
    // lemma candidates in order and take the first dictionary hit.
    // The display word stays the word as copied.
    let gloss = match lookup(&normalized) {
        Some(g) => g,
        None => {
            if normalized.split_whitespace().count() != 1 {
                return None;
            }
            lemma_candidates(&normalized)
                .iter()
                .find_map(|c| lookup(c))?
        }
    };
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
    fn lemma_fallback_plural_and_inflected() {
        // Plural / 3rd person.
        assert!(translate("books", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("sách"));
        assert!(translate("boxes", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("hộp"));
        assert!(translate("babies", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("bé"));
        assert!(translate("houses", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("nhà"));
        assert!(translate("watches", 3, 40).map(|(_, g)| g).unwrap_or_default().contains("xem"));
        // -ed / -ing, including doubled consonants and dropped "e".
        assert!(translate("worked", 3, 40).map(|(_, g)| g).unwrap_or_default().contains("công việc"));
        assert!(translate("working", 3, 40).map(|(_, g)| g).unwrap_or_default().contains("công việc"));
        assert!(translate("stopped", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("dừng"));
        assert!(translate("making", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("làm"));
        assert!(translate("tried", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("cố gắng"));
        assert!(translate("lying", 3, 40).map(|(_, g)| g).unwrap_or_default().contains("nằm"));
        assert!(translate("playing", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("chơi"));
        assert!(translate("dancing", 3, 40).map(|(_, g)| g).unwrap_or_default().contains("nhảy"));
        assert!(translate("book's", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("sách"));
        // Irregulars.
        assert!(translate("went", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("đi"));
        assert!(translate("children", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("đứa bé"));
        assert!(translate("feet", 3, 40).map(|(_, g)| g).unwrap_or_default().contains("chân"));
        assert!(translate("ate", 3, 40).map(|(_, g)| g).unwrap_or_default().starts_with("ăn"));
        assert!(translate("took", 3, 40).map(|(_, g)| g).unwrap_or_default().contains("lấy"));
        // Display word stays the word as copied, not the lemma.
        assert_eq!(translate("books", 3, 40).map(|(w, _)| w), Some("books".to_string()));
    }

    #[test]
    fn miss_and_non_candidates_return_none() {
        assert_eq!(translate("xyzabc", 3, 40), None);
        // Stripping must not invent a hit: these nonsense words strip
        // to nothing in the dictionary. (gas/yes/this would be bad
        // guards: they are real dictionary lemmas themselves.)
        assert_eq!(translate("quuxes", 3, 40), None);
        assert_eq!(translate("wuging", 3, 40), None);
        assert_eq!(translate("blorped", 3, 40), None);
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
