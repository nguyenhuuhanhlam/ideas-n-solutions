use clipboard_tool::config::AppConfig;
use std::path::PathBuf;

fn config_path() -> PathBuf {
    // Argument 1, if given, is the settings file. Otherwise `config.json`
    // next to the working directory. This file holds settings only,
    // never clipboard text.
    std::env::args()
        .nth(1)
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("config.json"))
}

fn main() {
    let path = config_path();
    let config = match AppConfig::load_or_default(&path) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("clipboard-tool: bad config {}: {}", path.display(), e);
            eprintln!("clipboard-tool: falling back to defaults.");
            AppConfig::default()
        }
    };

    #[cfg(windows)]
    {
        if let Err(e) = clipboard_tool::win::run(config, path) {
            eprintln!("clipboard-tool: {}", e);
            std::process::exit(1);
        }
    }

    #[cfg(not(windows))]
    {
        // Non-Windows build: the tray / clipboard listener is Windows-only.
        // This path exists so the core (modules, pipeline, config) can be
        // developed and tested on Linux. On Windows, `win::run` above is
        // the real entry point.
        println!("clipboard-tool: Windows-only tray app.");
        println!("This non-Windows build only demonstrates the pipeline.");
        println!("Config: auto_run={}, overwrite={}, modules={:?}",
            config.auto_run,
            config.overwrite_clipboard,
            config.modules.iter().map(|m| &m.id).collect::<Vec<_>>());
        // Demo: read stdin lines, print pipeline output. Useful for
        // smoke-testing the two modules without a Windows machine.
        use clipboard_tool::pipeline::run_pipeline;
        use std::io::BufRead;
        let stdin = std::io::stdin();
        for line in stdin.lock().lines() {
            let Ok(line) = line else { break };
            let line = line.trim_end_matches(['\r', '\n']);
            if line.is_empty() {
                continue;
            }
            let result = run_pipeline(line, &config);
            println!("{} -> {}", line, result.output);
            if let Some(err) = result.error {
                eprintln!("pipeline error: {}", err);
            }
            // Balloon demo: on Linux there is no tray, so print what
            // the balloon would show on Windows.
            if config.translator.enabled {
                if let Some((word, gloss)) = clipboard_tool::modules::translator::translate(
                    line,
                    config.translator.max_words,
                    config.translator.max_len,
                ) {
                    println!("balloon: {} -> {}", word, gloss);
                }
            }
        }
    }
}
