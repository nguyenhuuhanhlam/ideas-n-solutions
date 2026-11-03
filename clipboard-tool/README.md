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

## Translator (skeleton, notifier only)

`translator` is a second kind of module: a notifier, not a
transformer. It is deliberately outside the `TextModule` registry
and outside the overwrite pipeline.

- On every copy it reads the *original* text (not pipeline output).
- It only attempts a lookup when the text looks like one English
  word or a short phrase: 1–3 words, at most 40 chars, ASCII
  letters / spaces / hyphens / apostrophes only. Links, sentences,
  code, numbers and Vietnamese text are ignored silently.
- On a dictionary hit it shows a tray balloon: the copied word as
  the title, the Vietnamese gloss as the body. Clicking the balloon
  does nothing and the clipboard is left untouched, so the English
  word is never lost. On a miss it shows nothing.
- Lookup is exact-match only (no stemming in the skeleton), in a
  hash map built once from `assets/dictionary.tsv` (one entry per
  line: `english<TAB>vietnamese gloss`), embedded into the binary at
  compile time, so there is no runtime file to ship and no network.
  A balloon that is still on screen is replaced immediately: the old
  balloon is dismissed first, then the new one is shown.

The dictionary is the full filtered dataset: 16,092 English words and
short phrases from English Wiktionary via kaikki.org (dump 2026-10-01,
filtered 2026-11-03 from 11,121,531 dump lines, keeping only entries
with a Vietnamese translation that the app can trigger). Meanings are
kept in Wiktionary sense order (main sense first) up to the 240-char
balloon limit, so `hello` opens with `xin chào` and `time` with `thời
gian`. Dictionary data: Wiktionary, CC-BY-SA 4.0, via kaikki.org.
Settings: `translator.enabled` in `config.json`, plus the
"Show translation balloon" checkbox in the Settings window.

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

## Settings window

Right-click the tray icon and choose Settings (or double-click the
tray icon). The settings window is a native Win32 window on the same
thread as the tray, so it needs no GPU / extra UI runtime, clipboard
handling keeps running while it is open, and only one settings window
can be open at a time (a second click brings the open one forward).

It edits: auto-run, overwrite-clipboard, max chars, each module's
enabled flag and order (↑ / ↓), and each module's own parameters
(link detector: missing scheme / localhost / IP / default scheme /
max length; fbclid stripper: strip list / case-insensitive), plus
the translator balloon toggle on the Save row.
Unknown modules show their params as raw JSON.

Save writes `config.json` (settings only, never clipboard text) and
the core reloads it immediately, without a restart. Closing the
window without saving discards the changes. Editing `config.json`
by hand still works: copy `config.example.json` to `config.json`
next to the exe (or pass its path as the first argument). Adding a
new Rust module still needs a rebuild; changing settings does not.

Autostart and single-instance (named mutex) are not implemented yet.

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
- `src/modules/translator.rs` — translator notifier (dictionary data
  lives separately in `assets/dictionary.tsv`)
- `src/win.rs` — Windows-only hidden window, tray, clipboard listener
- `src/settings_ui.rs` — Windows-only native Win32 settings window
- `src/main.rs` — entry point, config loading
