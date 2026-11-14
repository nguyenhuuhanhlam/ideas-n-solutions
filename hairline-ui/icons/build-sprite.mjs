// Hairline UI — build the Lucide icon sprite (subset, pinned version).
// Usage: node icons/build-sprite.mjs   (run from hairline-ui/ or anywhere;
// writes lucide-sprite.svg next to this script)
// To add an icon: append its Lucide name to ICONS below and re-run.
//
// Source: lucide-static (ISC licence), one SVG per icon, 24x24 grid.
// The sprite keeps fill/stroke/linecap/linejoin on each <symbol> but
// deliberately OMITS stroke-width: line weight comes from CSS (.hl-icon)
// so it always renders exactly 1 physical px (stroke-width = 24 / size).
// Any per-path stroke/fill attribute in the source fails the build, so a
// Lucide update can never silently break that rule.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = "1.73.0";
const DIR = dirname(fileURLToPath(import.meta.url));
// name -> where it is used (kit demo / File Watcher adoption)
const ICONS = [
  ["pin", "pin/unpin button on log rows; Pinned tab"],
  ["search", "filter input; search actions"],
  ["pause", "Pause button (toolbar)"],
  ["play", "Resume button (toolbar, when paused)"],
  ["trash-2", "Clear log; Deleted tab"],
  ["folder", "watched directory rows"],
  ["file", "file rows"],
  ["settings", "Settings section"],
  ["copy", "copy full path (path badge)"],
  ["refresh-cw", "reload / retry actions"],
  ["x", "remove directory; unpin; dismiss"],
  ["plus", "Add directory"],
  ["check", "Apply; success states"],
  ["chevron-left", "collapse sidebar toggle"],
  ["chevron-right", "collapsed group caret"],
  ["chevron-down", "expanded group caret"],
  ["list", "All tab"],
  ["layout-grid", "Icons tab (gallery)"],
  ["circle-alert", "error messages"],
  ["circle-check", "success messages"],
  ["info", "hints"],
];

const innerOf = (svg) => {
  const m = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!m) throw new Error("no <svg> wrapper");
  return m[1].trim();
};

const symbols = [];
for (const [name] of ICONS) {
  const url = `https://unpkg.com/lucide-static@${VERSION}/icons/${name}.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed (${res.status}): ${url}`);
  const inner = innerOf(await res.text());
  // Guard: nothing inside may set its own stroke/fill, or CSS control breaks.
  if (/stroke-width|stroke=|fill=/.test(inner)) {
    throw new Error(`${name}: inner content sets stroke/fill, refusing to inline`);
  }
  symbols.push(
    `  <symbol id="hl-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">\n` +
      inner.split("\n").map((l) => "    " + l.trim()).join("\n") + "\n  </symbol>"
  );
  console.log(`ok ${name}`);
}

const out = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Hairline UI icon sprite — Lucide ${VERSION} subset (${ICONS.length} icons), ISC licence.
     Source: https://unpkg.com/lucide-static@${VERSION}/icons/<name>.svg
     Rebuild: node icons/build-sprite.mjs (see that file for the icon list).
     No stroke-width anywhere in this file: weight comes from .hl-icon CSS. -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
${symbols.join("\n")}
</svg>
`;
const target = join(DIR, "lucide-sprite.svg");
writeFileSync(target, out);
console.log(`wrote ${target} (${ICONS.length} symbols, ${Buffer.byteLength(out)} bytes)`);
