# clipboard-tool

Windows tray clipboard tool, in Rust. Plain text only, for now.

## Locked spec (2026-11-03 discussion)

- Resident tray app, one user session. Not a Windows Service (a service
  in session 0 cannot see the desktop clipboard).
- Plain text only. Highlight / system-wide selection is explicitly
  out of scope for now.
- No clipboard storage at all: no file, no database. The current text
  and the hash of the last self-written result live in RAM only and
  are gone on exit / shutdown.
- The only file that may persist is `config.json` (settings). It
  never contains clipboard text.
- Modules are decoupled Rust modules behind one trait. They run
  automatically on every copy, in settings order, and the final
  result is written back to the clipboard at most once.
- Modules must be pure, fast and local. No network in the
  auto-overwrite pipeline.

## Pipeline (module 1 and 2)

1. `link_detector`: if the whole trimmed text is a single web address,
   normalise it. `http` / `https` only. Scheme-less `www.example.com`
   and `example.com` are normalised to `https://...`. Trailing
   sentence punctuation is stripped, balanced parentheses are kept.
   Non-links pass through unchanged. Syntax only, no DNS / fetch.
2. `fbclid_stripper`: if the (now normalised) URL is `http` / `https`,
   remove the exact `fbclid` query parameter and keep every other
   parameter, in order, with its original encoding, plus the fragment.
   If there is no `fbclid`, the text passes through unchanged.

Example: `www.example.com/bai-viet?a=1&fbclid=XYZ&b=2`
becomes `https://www.example.com/bai-viet?a=1&b=2`.

Loop protection: the hash of the last text we wrote is kept in RAM;
a clipboard update matching it is ignored, so the pipeline never
re-processes its own output. Stale results are discarded by sequence
number, so a slow pipeline run cannot overwrite a newer copy.

## Build on Windows

```powershell
cargo build --release
.\target\release\clipboard-tool.exe
# optional: .\target\release\clipboard-tool.exe .\config.json
```

Copy `config.example.json` to `config.json` next to the exe (or pass
its path as the first argument) to change module order, toggles and
parameters without rebuilding. Adding a new Rust module still needs
a rebuild; changing settings does not.

Autostart and single-instance (named mutex) are not in this skeleton
yet; they belong in the tray step, together with the settings window.
The tray Settings item currently shows a placeholder message.

## Develop / test on Linux

The tray and clipboard listener are `cfg(windows)` only, so a Linux
build runs the pipeline in demo mode instead: it reads lines from
stdin and prints `input -> output`. This is how the core is tested
without a Windows machine.

```sh
cargo test
echo 'www.example.com/?fbclid=XYZ' | cargo run
```

## Layout

- `src/lib.rs` — crate root, design notes
- `src/config.rs` — settings only, never clipboard text
- `src/pipeline.rs` — ordered run, error = keep original
- `src/modules/mod.rs` — the `TextModule` trait and registry
- `src/modules/link_detector.rs` — module 1
- `src/modules/fbclid_stripper.rs` — module 2
- `src/win.rs` — Windows-only hidden window, tray, clipboard listener
- `src/main.rs` — entry point, config loading
