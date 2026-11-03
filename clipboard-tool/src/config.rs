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
}

fn default_max_chars() -> usize {
    1_000_000
}

fn default_modules() -> Vec<ModuleConfig> {
    vec![
        ModuleConfig {
            id: "link_detector".to_string(),
            enabled: true,
            order: 1,
            params: serde_json::json!({
                "allow_missing_scheme": true,
                "default_scheme": "https",
                "allow_localhost": true,
                "allow_ip": true,
                "max_len": 2048,
            }),
        },
        ModuleConfig {
            id: "fbclid_stripper".to_string(),
            enabled: true,
            order: 2,
            params: serde_json::json!({
                "strip": ["fbclid"],
                "case_insensitive": true,
            }),
        },
    ]
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            auto_run: true,
            overwrite_clipboard: true,
            max_chars: default_max_chars(),
            modules: default_modules(),
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
            Ok(text) => serde_json::from_str(&text).map_err(|e| e.to_string()),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(Self::default()),
            Err(e) => Err(e.to_string()),
        }
    }
}
