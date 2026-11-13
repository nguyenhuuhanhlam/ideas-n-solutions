/* Hairline UI — shared JS helpers (starter kit, from File Watcher 0.7–0.9 behaviour)
   Plain vanilla, no framework. Call Hairline.init({...}) or use pieces.
   Spec: hairline-ui/README.md */
(function (global) {
  "use strict";
  var LS_W = "hairline-side-w", LS_C = "hairline-side-collapsed", LS_T = "hairline-tint", LS_TO = "hairline-tint-opacity";
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
     Sidebar fades are blended (tint over bg, light/dark aware) so no white seam. */
  var TINTS = { gray: "#787878", blue: "#2563eb", green: "#16a34a", amber: "#d97706", red: "#dc2626", purple: "#9333ea" };
  function hexRgb(hex) { return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)]; }
  function initTint(app, swatchEls, opacityEl, opacityValEl) {
    var name = lsGet(LS_T, ""), op = parseInt(lsGet(LS_TO, "8"), 10); if (isNaN(op)) op = 8;
    function isDark() { return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches); }
    function apply() {
      var rgb = TINTS[name], bg = isDark() ? [11,11,12] : [255,255,255];
      if (!rgb) { app.style.removeProperty("--tint"); app.style.removeProperty("--side-fade-solid"); app.style.removeProperty("--side-fade-from"); }
      else {
        var c = hexRgb(rgb), a = op / 100;
        app.style.setProperty("--tint", "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")");
        var m = bg.map(function (b, i) { return Math.round(c[i] * a + b * (1 - a)); });
        app.style.setProperty("--side-fade-solid", "rgb(" + m.join(",") + ")");
        app.style.setProperty("--side-fade-from", "rgba(" + m.join(",") + ",0)");
      }
      if (opacityEl) { opacityEl.disabled = !rgb; opacityEl.value = op; }
      if (opacityValEl) opacityValEl.textContent = op + "%";
      var holder = opacityEl && opacityEl.closest(".tint-opacity"); if (holder) holder.classList.toggle("disabled", !rgb);
      swatchEls.forEach(function (el) { el.classList.toggle("selected", (el.getAttribute("data-tint") || "") === name); });
    }
    swatchEls.forEach(function (el) { el.addEventListener("click", function () { name = el.getAttribute("data-tint") || ""; lsSet(LS_T, name); apply(); }); });
    if (opacityEl) opacityEl.addEventListener("input", function () { op = parseInt(opacityEl.value, 10) || 0; lsSet(LS_TO, op); apply(); });
    if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", apply);
    apply(); return apply;
  }

  function toast(el, msg, ms) {
    el.textContent = msg; el.classList.add("show");
    clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("show"); }, ms || 1600);
  }

  global.Hairline = { initSidebar: initSidebar, initFades: initFades, initTint: initTint, toast: toast, DEFAULT_W: DEFAULT_W };
})(typeof window !== "undefined" ? window : this);
