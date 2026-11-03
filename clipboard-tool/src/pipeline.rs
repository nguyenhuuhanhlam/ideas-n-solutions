use crate::config::AppConfig;
use crate::modules::find_module;

/// Outcome of one pipeline run. `output` is the text to write back
/// (at most once, by the caller) only when `changed` is true.
#[derive(Debug, Clone)]
pub struct PipelineResult {
    pub output: String,
    pub changed: bool,
    /// Ids of modules that actually changed the text, in run order.
    pub applied: Vec<String>,
    /// If set, the pipeline stopped here and `output` is the original text.
    pub error: Option<String>,
}

/// Run the enabled modules in settings order.
///
/// Guarantees:
/// - If `auto_run` is off, or the text is empty / over `max_chars`,
///   the input passes through untouched.
/// - On a module error, the original text is returned untouched and
///   `error` is set. No half-processed text is ever returned as a
///   successful result.
/// - Unknown module ids in settings are skipped, not fatal: settings
///   from a newer version must not break an older build.
pub fn run_pipeline(input: &str, config: &AppConfig) -> PipelineResult {
    let original = input.to_string();
    if !config.auto_run || input.is_empty() || input.chars().count() > config.max_chars {
        return PipelineResult {
            output: original,
            changed: false,
            applied: Vec::new(),
            error: None,
        };
    }

    let mut ordered: Vec<_> = config.modules.iter().filter(|m| m.enabled).collect();
    ordered.sort_by_key(|m| m.order);

    let mut current = original.clone();
    let mut applied = Vec::new();

    for entry in ordered {
        let Some(module) = find_module(&entry.id) else {
            continue;
        };
        match module.process(&current, &entry.params) {
            Ok(next) => {
                if next != current {
                    applied.push(entry.id.clone());
                    current = next;
                }
            }
            Err(err) => {
                return PipelineResult {
                    output: original,
                    changed: false,
                    applied,
                    error: Some(format!("{}: {}", entry.id, err)),
                };
            }
        }
    }

    PipelineResult {
        changed: current != original,
        output: current,
        applied,
        error: None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::config::AppConfig;

    #[test]
    fn link_then_fbclid_pipeline() {
        let config = AppConfig::default();
        // Missing scheme + fbclid: detector normalises, stripper cleans.
        let r = run_pipeline("www.example.com/bai-viet?a=1&fbclid=XYZ&b=2", &config);
        assert!(r.changed, "expected a change, got {:?}", r);
        assert_eq!(
            r.output,
            "https://www.example.com/bai-viet?a=1&b=2"
        );
        assert_eq!(r.applied, vec!["link_detector", "fbclid_stripper"]);
    }

    #[test]
    fn plain_text_passes_through_unchanged() {
        let config = AppConfig::default();
        let r = run_pipeline("hello world, not a link", &config);
        assert!(!r.changed);
        assert_eq!(r.output, "hello world, not a link");
        assert!(r.applied.is_empty());
    }

    #[test]
    fn clean_link_without_fbclid_is_not_rewritten_by_stripper() {
        let config = AppConfig::default();
        // Neither module changes this link, so it passes through as-is.
        let r = run_pipeline("https://example.com/bai-viet?a=1", &config);
        assert_eq!(r.output, "https://example.com/bai-viet?a=1");
        assert_eq!(r.applied, Vec::<String>::new());
    }

    #[test]
    fn auto_run_off_passes_through() {
        let mut config = AppConfig::default();
        config.auto_run = false;
        let r = run_pipeline("www.example.com/?fbclid=XYZ", &config);
        assert!(!r.changed);
        assert_eq!(r.output, "www.example.com/?fbclid=XYZ");
    }

    #[test]
    fn overwrite_off_is_still_reported_by_pipeline() {
        // The pipeline reports what *would* change; the Windows caller
        // is the one that honours `overwrite_clipboard` and skips the
        // actual clipboard write. This separation keeps the core testable
        // without Windows.
        let mut config = AppConfig::default();
        config.overwrite_clipboard = false;
        let r = run_pipeline("https://example.com/?fbclid=XYZ", &config);
        assert!(r.changed);
        assert_eq!(r.output, "https://example.com/");
    }
}
