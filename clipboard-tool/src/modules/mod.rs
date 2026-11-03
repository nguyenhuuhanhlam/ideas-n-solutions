use serde_json::Value;

pub mod fbclid_stripper;
pub mod link_detector;
/// Translator: a *notifier*, not a `TextModule`. It lives here for
/// organisation, but it is deliberately absent from `all_modules()`:
/// it must never transform text or write the clipboard, only return
/// a gloss for the tray balloon. See `translator.rs`.
pub mod translator;

pub use fbclid_stripper::FbclidStripper;
pub use link_detector::LinkDetector;

/// The single contract every module implements.
///
/// - Pure transformation: input text in, output text out.
/// - No clipboard access, no UI, no network. The core owns all of that,
///   so a module can never create a clipboard feedback loop by itself.
/// - On `Err`, the core stops the pipeline for that copy and keeps the
///   original text. A module error must never produce a half-processed
///   clipboard write.
pub trait TextModule: Send + Sync {
    fn id(&self) -> &'static str;
    fn name(&self) -> &str;
    fn process(&self, input: &str, params: &Value) -> Result<String, String>;
}

/// All built-in modules. Adding a new module = a new file + one line here.
/// Modules never import each other; shared detection helpers live in the
/// module that owns them and are reused by callers, not by coupling.
pub fn all_modules() -> Vec<Box<dyn TextModule>> {
    vec![
        Box::new(LinkDetector),
        Box::new(FbclidStripper),
    ]
}

/// Find a module implementation by its settings id.
pub fn find_module(id: &str) -> Option<Box<dyn TextModule>> {
    all_modules().into_iter().find(|m| m.id() == id)
}
