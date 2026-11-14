/* Hairline UI — shared JS helpers (starter kit, synced with File Watcher 0.9.7;
   tinted hover 2026-11-14 is kit-only until File Watcher adopts it)
   Plain vanilla, no framework. Call Hairline.init({...}) or use pieces.
   Spec: hairline-ui/README.md */
(function (global) {
  "use strict";
  var LS_W = "hairline-side-w", LS_C = "hairline-side-collapsed", LS_T = "hairline-tint", LS_TO = "hairline-tint-opacity", LS_HL = "hairline-hover-lift";
  var DEFAULT_W = 320, MIN_W = 160, MAX_W = 480;
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* Resizable + collapsible sidebar. opts: {app, resizer, toggle, onChange}
     Drag the handle (160–480px, max half screen), double-click -> 320px,
     arrows with handle focused (Shift = 50px), toggle button collapses. */
  function initSidebar(opts) {
    var app = opts.app, resizer = opts.resizer, toggle = opts.toggle;
    var w = parseInt(lsGet(LS_W, DEFAULT_W), 10) || DEFAULT_W;
    function clamp(x) { return Math.max(MIN_W, Math.min(MAX_W, Math.floor(window.innerWidth / 2), x)); }
    function apply(nw, save) { w = clamp(nw); app.style.setProperty("--side-w", w + "px"); if (save) lsSet(LS_W, w); if (opts.onChange) opts.onChange(w); }
    apply(w, false);
    if (lsGet(LS_C, "") === "1") app.classList.add("collapsed");
    if (toggle) toggle.addEventListener("click", function () {
      app.classList.toggle("collapsed");
      lsSet(LS_C, app.classList.contains("collapsed") ? "1" : "0");
    });
    if (resizer) {
      var dragging = false;
      resizer.addEventListener("pointerdown", function (e) { dragging = true; resizer.classList.add("dragging"); resizer.setPointerCapture(e.pointerId); });
      resizer.addEventListener("pointermove", function (e) { if (dragging) apply(e.clientX, true); });
      function up() { dragging = false; resizer.classList.remove("dragging"); }
      resizer.addEventListener("pointerup", up); resizer.addEventListener("pointercancel", up);
      resizer.addEventListener("dblclick", function () { apply(DEFAULT_W, true); });
      resizer.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault(); apply(w + (e.key === "ArrowRight" ? 1 : -1) * (e.shiftKey ? 50 : 10), true);
      });
    }
    return { getWidth: function () { return w; }, setWidth: apply };
  }

  /* Hidden-scrollbar fade indicators: fades show only when content exists above/below. */
  function initFades(scroller, topFade, botFade) {
    function update() {
      var max = scroller.scrollHeight - scroller.clientHeight;
      topFade.classList.toggle("show", scroller.scrollTop > 2);
      botFade.classList.toggle("show", scroller.scrollTop < max - 2);
    }
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    if (window.ResizeObserver) new ResizeObserver(update).observe(scroller);
    update(); return update;
  }

  /* Tint picker: swatches + opacity 0–50% (default 8%). Sets --tint on .app.
     Sidebar fades are blended (tint over bg, light/dark aware) so no white seam.
     Lines inside tinted regions (from 0.9.3) shift a fixed lightness delta from
     the effective tinted bg, keeping the tint's hue/saturation. Button/tab
     hover inside tinted regions (kit 2026-11-14) shifts by the adjustable
     Hover lift (0–12pts, default 6), in the tint's hue. */
  var TINTS = { gray: "#787878", blue: "#2563eb", green: "#16a34a", amber: "#d97706", red: "#dc2626", purple: "#9333ea" };
  function hexRgb(hex) { return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)]; }
  /* RGB [0-255] -> HSL [h 0-360, s 0-1, l 0-1]. */
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return [h, s, l];
  }
  /* HSL -> RGB [0-255] (rounded). */
  function hslToRgb(h, s, l) {
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }
  /* Shift a colour's lightness by deltaPoints (HSL, hue/saturation kept),
     clamped to 0–100. Shared by the tinted line and hover colours. */
  function shiftLightness(bg, deltaPoints) {
    var hsl = rgbToHsl(bg[0], bg[1], bg[2]);
    var l = Math.max(0, Math.min(1, hsl[2] + deltaPoints / 100));
    return hslToRgb(hsl[0], hsl[1], l);
  }
  /* Fixed lightness offset of tinted-region lines from their effective bg:
     14 points — slightly more than the default gap (white bg 100 -> line
     #e5e5e5 ~90) so lines stay visible on a coloured bg. Darker in light
     theme, lighter in dark theme; hue/saturation untouched. */
  var LINE_LIGHTNESS_DELTA = 14;
  function adaptLineColor(bg, dark) {
    return shiftLightness(bg, (dark ? 1 : -1) * LINE_LIGHTNESS_DELTA);
  }
  /* Hover lift inside tinted regions: a lightness shift from the effective
     tinted bg, hue/saturation kept — darker in light theme, lighter in
     dark theme (same direction as the lines). Adjustable 0–12 points via
     the Hover lift slider (default 6). History: the first version used the
     stock --hover token's own delta (light -1.96, dark +3.33, measured
     from #ffffff->#fafafa and #0b0b0c->#131315), but on a tinted bg that
     was too subtle to see, so the lift became a parameter instead. */
  var HOVER_LIFT_DEFAULT = 6, HOVER_LIFT_MIN = 0, HOVER_LIFT_MAX = 12;
  function adaptHoverColor(bg, dark, lift) {
    return shiftLightness(bg, (dark ? 1 : -1) * lift);
  }
  function initTint(app, swatchEls, opacityEl, opacityValEl, hoverEl, hoverValEl) {
    var name = lsGet(LS_T, ""), op = parseInt(lsGet(LS_TO, "8"), 10); if (isNaN(op)) op = 8;
    var lift = parseInt(lsGet(LS_HL, String(HOVER_LIFT_DEFAULT)), 10);
    if (isNaN(lift)) lift = HOVER_LIFT_DEFAULT;
    lift = Math.max(HOVER_LIFT_MIN, Math.min(HOVER_LIFT_MAX, lift));
    function isDark() { return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches); }
    /* Per-region --line override for the 6 tinted regions (same list as the
       --tint backgrounds in CSS); log region and app outer border keep the
       stock --line. No tint selected -> overrides removed. */
    function updateLineColors(tintedBg) {
      var val = "";
      if (tintedBg) {
        var c = adaptLineColor(tintedBg, isDark());
        val = "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
      }
      app.querySelectorAll(".brand, .topbar, .sidewrap, .stats, .toolbar, .tabs").forEach(function (el) {
        if (tintedBg) el.style.setProperty("--line", val);
        else el.style.removeProperty("--line");
      });
    }
    /* Same 6 regions, --hover override: buttons/tabs hovered inside a
       tinted region show the tint's hue instead of neutral grey. The log
       region is untinted, so log-row hover keeps the stock --hover. */
    function updateHoverColors(tintedBg) {
      var val = "";
      if (tintedBg) {
        var c = adaptHoverColor(tintedBg, isDark(), lift);
        val = "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
      }
      app.querySelectorAll(".brand, .topbar, .sidewrap, .stats, .toolbar, .tabs").forEach(function (el) {
        if (tintedBg) el.style.setProperty("--hover", val);
        else el.style.removeProperty("--hover");
      });
    }
    function apply() {
      var rgb = TINTS[name], bg = isDark() ? [11,11,12] : [255,255,255];
      var tinted = null;
      if (!rgb) { app.style.removeProperty("--tint"); app.style.removeProperty("--side-fade-solid"); app.style.removeProperty("--side-fade-from"); }
      else {
        var c = hexRgb(rgb), a = op / 100;
        app.style.setProperty("--tint", "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")");
        tinted = bg.map(function (b, i) { return Math.round(c[i] * a + b * (1 - a)); });
        app.style.setProperty("--side-fade-solid", "rgb(" + tinted.join(",") + ")");
        app.style.setProperty("--side-fade-from", "rgba(" + tinted.join(",") + ",0)");
      }
      updateLineColors(tinted);
      updateHoverColors(tinted);
      if (opacityEl) { opacityEl.disabled = !rgb; opacityEl.value = op; }
      if (opacityValEl) opacityValEl.textContent = op + "%";
      var holder = opacityEl && opacityEl.closest(".tint-opacity"); if (holder) holder.classList.toggle("disabled", !rgb);
      if (hoverEl) { hoverEl.disabled = !rgb; hoverEl.value = lift; }
      if (hoverValEl) hoverValEl.textContent = lift + " pts";
      var hoverHolder = hoverEl && hoverEl.closest(".tint-opacity"); if (hoverHolder) hoverHolder.classList.toggle("disabled", !rgb);
      swatchEls.forEach(function (el) { el.classList.toggle("selected", (el.getAttribute("data-tint") || "") === name); });
    }
    swatchEls.forEach(function (el) { el.addEventListener("click", function () { name = el.getAttribute("data-tint") || ""; lsSet(LS_T, name); apply(); }); });
    if (opacityEl) opacityEl.addEventListener("input", function () { op = parseInt(opacityEl.value, 10) || 0; lsSet(LS_TO, op); apply(); });
    if (hoverEl) hoverEl.addEventListener("input", function () { lift = parseInt(hoverEl.value, 10) || 0; lift = Math.max(HOVER_LIFT_MIN, Math.min(HOVER_LIFT_MAX, lift)); lsSet(LS_HL, lift); apply(); });
    if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", apply);
    apply(); return apply;
  }

  function toast(el, msg, ms) {
    el.textContent = msg; el.classList.add("show");
    clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("show"); }, ms || 1600);
  }

  global.Hairline = { initSidebar: initSidebar, initFades: initFades, initTint: initTint, toast: toast, DEFAULT_W: DEFAULT_W };
})(typeof window !== "undefined" ? window : this);
