//! Build script: embed the Common Controls v6 manifest so the Settings
//! dialog uses the Windows 10/11 visual styles (flat, themed controls)
//! instead of the classic Windows 2000 look. Build-time only: the
//! `embed-resource` crate runs the resource compiler and links the
//! resulting `.res` into the exe, so distribution stays a single file.
//!
//! `embed-resource` returns `NotWindows` on non-Windows targets and
//! `NotAttempted` when no resource compiler is available, so this
//! never breaks a Linux build or a `cargo check` cross-compile: the
//! manifest is simply skipped there. A cosmetic feature must never
//! fail the build, so a real failure only prints a warning and the
//! app keeps building with classic controls.

fn main() {
    match embed_resource::compile("clipboard-tool.rc", embed_resource::NONE) {
        embed_resource::CompilationResult::Ok
        | embed_resource::CompilationResult::NotWindows => {}
        embed_resource::CompilationResult::NotAttempted(reason) => {
            println!(
                "cargo:warning=Manifest resource not embedded (no resource compiler available: {reason}); the Settings dialog will use classic controls."
            );
        }
        embed_resource::CompilationResult::Failed(reason) => {
            println!(
                "cargo:warning=Failed to embed the manifest resource ({reason}); the Settings dialog will use classic controls."
            );
        }
    }
}
