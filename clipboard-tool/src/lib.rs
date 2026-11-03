//! Core library for the clipboard tool.
//!
//! Design locked in discussion (2026-11-03):
//! - Tray-resident on Windows, plain text only, no highlight (for now).
//! - Clipboard text is NEVER written to disk. Only the current text and
//!   the hash of the last self-written result live in RAM, and both are
//!   gone when the app exits / the machine shuts down.
//! - The only file that may persist is the *settings* file (which modules
//!   are on, their order, their parameters). It never contains clipboard text.
//! - Modules are decoupled Rust modules behind one trait. They run
//!   automatically on every copy, in the order set in settings, and the
//!   final result is written back to the clipboard at most once.
//! - A module must be pure, fast and local. No network in the
//!   auto-overwrite pipeline: a slow module makes the user paste the
//!   original text before the overwrite lands.
//! - The translator is a second kind of module, a *notifier*, not a
//!   transformer: it reads the copied text, looks it up in an offline
//!   dictionary, and shows the gloss in a tray balloon. It never
//!   writes the clipboard, so the English word the user copied is
//!   never lost. It is therefore outside the `TextModule` registry
//!   and outside the overwrite pipeline.

pub mod config;
pub mod modules;
pub mod pipeline;

#[cfg(windows)]
pub mod settings_ui;
#[cfg(windows)]
pub mod win;
