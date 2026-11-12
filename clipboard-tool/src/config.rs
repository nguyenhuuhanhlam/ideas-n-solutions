use serde::{Deserialize, Serialize};

/// One module entry in settings. `params` is deliberately untyped here:
/// each module parses only the keys it knows, with defaults, and ignores
/// the rest. That keeps the core decoupled from module-specific settings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModuleConfig {
    pub id: String,
    #[serde(default = "default_true")]
    pub enabled: bool,
    #[serde(default)]
    pub order: u32,
    #[serde(default)]
    pub params: serde_json::Value,
}

fn default_true() -> bool {
    true
}

/// Global settings. This is the only thing that may be persisted to disk,
/// and it must never contain clipboard text.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    /// Master switch for the auto pipeline. Tray Pause flips this at runtime.
    #[serde(default = "default_true")]
    pub auto_run: bool,
    /// Master switch for writing the pipeline result back to the clipboard.
    /// Off = dry-run mode: modules still run, nothing is written back.
    #[serde(default = "default_true")]
    pub overwrite_clipboard: bool,
    /// Texts longer than this (in chars) skip the pipeline entirely.
    #[serde(default = "default_max_chars")]
    pub max_chars: usize,
    #[serde(default = "default_modules")]
    pub modules: Vec<ModuleConfig>,
    /// Translator balloon settings. `#[serde(default)]` keeps old
    /// config.json files (without this section) loading fine.
    #[serde(default)]
    pub translator: TranslatorConfig,
}

fn default_max_chars() -> usize {
    1_000_000
}

/// Translator (balloon notifier) settings. This is NOT a pipeline
/// module: it never transforms text or writes the clipboard, so it
/// does not appear in `modules[]` or in the order listbox.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TranslatorConfig {
    #[serde(default = "default_true")]
    pub enabled: bool,
    /// Maximum words in a copied phrase to attempt a lookup.
    #[serde(default = "default_translator_max_words")]
    pub max_words: usize,
    /// Maximum chars in a copied phrase to attempt a lookup.
    #[serde(default = "default_translator_max_len")]
    pub max_len: usize,
}

fn default_translator_max_words() -> usize {
    3
}

fn default_translator_max_len() -> usize {
    40
}

impl Default for TranslatorConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            max_words: default_translator_max_words(),
            max_len: default_translator_max_len(),
        }
    }
}

/// Default config entry for one built-in module id. `None` for
/// unknown ids (e.g. from a newer version's settings file).
pub fn default_module_config(id: &str) -> Option<ModuleConfig> {
    let (order, params) = match id {
        "link_detector" => (
            1,
            serde_json::json!({
                "allow_missing_scheme": true,
                "default_scheme": "https",
                "allow_localhost": true,
                "allow_ip": true,
                "max_len": 2048,
            }),
        ),
        "fbclid_stripper" => (
            2,
            serde_json::json!({
                "strip": ["fbclid"],
                "case_insensitive": true,
            }),
        ),
        "query_stripper" => (
            3,
            serde_json::json!({
                "hosts": ["shopee.vn"],
            }),
        ),
        _ => return None,
    };
    Some(ModuleConfig {
        id: id.to_string(),
        enabled: true,
        order,
        params,
    })
}

fn default_modules() -> Vec<ModuleConfig> {
    ["link_detector", "fbclid_stripper", "query_stripper"]
        .iter()
        .filter_map(|id| default_module_config(id))
        .collect()
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            auto_run: true,
            overwrite_clipboard: true,
            max_chars: default_max_chars(),
            modules: default_modules(),
            translator: TranslatorConfig::default(),
        }
    }
}

impl AppConfig {
    /// Load `config.json` next to the executable / working directory if it
    /// exists, otherwise fall back to defaults. A malformed file is NOT
    /// silently ignored by the caller: this returns the error so the tray
    /// can report it instead of running with surprise settings.
    pub fn load_or_default(path: &std::path::Path) -> Result<Self, String> {
        match std::fs::read_to_string(path) {
            Ok(text) => {
                let mut config: Self =
                    serde_json::from_str(&text).map_err(|e| e.to_string())?;
                config.ensure_known_modules();
                Ok(config)
            }
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(Self::default()),
            Err(e) => Err(e.to_string()),
        }
    }

    /// Add config entries for built-in modules missing from this config
    /// (e.g. a `config.json` written before the module existed), so an
    /// upgrade never silently leaves a new module off. Entries already
    /// present are left untouched, including a user-disabled module.
    /// New entries go after the current highest order.
    pub fn ensure_known_modules(&mut self) {
        let mut next_order = self.modules.iter().map(|m| m.order).max().unwrap_or(0) + 1;
        for module in crate::modules::all_modules() {
            let id = module.id();
            if self.modules.iter().any(|m| m.id == id) {
                continue;
            }
            if let Some(mut entry) = default_module_config(id) {
                entry.order = next_order;
                next_order += 1;
                self.modules.push(entry);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn old_config_without_query_stripper_gets_it_on_ensure() {
        let text = r#"{"auto_run":true,"max_chars":1000000,"modules":[
            {"enabled":true,"id":"link_detector","order":1,"params":{}},
            {"enabled":true,"id":"fbclid_stripper","order":2,"params":{}}
        ],"overwrite_clipboard":true}"#;
        let mut config: AppConfig = serde_json::from_str(text).unwrap();
        assert_eq!(config.modules.len(), 2);
        config.ensure_known_modules();
        assert_eq!(config.modules.len(), 3);
        let qs = config
            .modules
            .iter()
            .find(|m| m.id == "query_stripper")
            .expect("query_stripper entry");
        assert!(qs.enabled);
        assert_eq!(qs.order, 3);
        assert_eq!(qs.params["hosts"][0], "shopee.vn");
        // Idempotent: a second call adds nothing.
        config.ensure_known_modules();
        assert_eq!(config.modules.len(), 3);
    }

    #[test]
    fn ensure_does_not_touch_existing_entries() {
        let mut config = AppConfig::default();
        config.modules[1].enabled = false;
        config.ensure_known_modules();
        assert_eq!(config.modules.len(), 3);
        assert!(!config.modules[1].enabled);
    }
}
