import { useEffect, useRef } from "react";
import Konva from "konva";
import { TODAY, DATA_MIN, DATA_MAX, fmtDay, personById } from "./data";

// Timeline 1 trục thời gian — bản mẫu test cảm giác zoom / kéo.
// - Zoom: liên tục, chỉ giãn trục X, luôn về điểm dưới con trỏ, kẹp [MIN_PPD, MAX_PPD]
// - Pan: kéo nền, có quán tính khi thả
// - LOD: mức chi tiết đổi theo ngưỡng zoom (0: tổng quan, 1: task theo người,
//        2: + nhãn & tiến độ, 3: + task con). Chiều cao lane nới/giãn có animation.
// - Render: Konva Stage/Layer + 1 Shape tùy biến vẽ gộp toàn bộ (batch draw) để
//   giữ 60fps khi pan/zoom; hit-test thủ công trên các thanh đang hiển thị.

const AXIS_H = 46;
const MIN_PPD = 0.55; // thu nhỏ nhất: ~11 năm nếu màn rộng 1900px... thực tế bị kẹp bởi fit
const MAX_PPD = 110; // phóng to nhất: màn hình chỉ còn ~17 ngày
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function lodOf(ppd) {
  if (ppd < 1.5) return 0;
  if (ppd < 7) return 1;
  if (ppd < 25) return 2;
  return 3;
}
export const LOD_NAMES = ["0 · Tổng quan project", "1 · Task theo người", "2 · Task chi tiết", "3 · Task con"];

function rrect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

// Đổi một màu hsl(...) thành sắc xám tương ứng (giữ nguyên độ sáng) cho chế độ
// làm mờ các project xung quanh khi một project đang được nổi bật.
const grayCache = new Map();
function grayOf(color) {
  if (!grayCache.has(color)) {
    const m = /hsl\([\d.]+ ([\d.]+)% ([\d.]+)%\)/.exec(color);
    grayCache.set(color, m ? `hsl(0 0% ${m[2]}%)` : "#7d8590");
  }
  return grayCache.get(color);
}

export default function Timeline({ projects, selectedId, onSelect, hudRef, controlsRef, focusedId, onLabelClick, onClearFocus, onEditTask, dataVersion, filterPersonId, onPersonFilter, onEscape, soloProjectId, onProjectSolo }) {
  const hostRef = useRef(null);
  const tipRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  const focusedRef = useRef(focusedId);
  focusedRef.current = focusedId;
  const onLabelClickRef = useRef(onLabelClick);
  onLabelClickRef.current = onLabelClick;
  const onClearFocusRef = useRef(onClearFocus);
  onClearFocusRef.current = onClearFocus;
  const onEditTaskRef = useRef(onEditTask);
  onEditTaskRef.current = onEditTask;
  const filterRef = useRef(filterPersonId);
  filterRef.current = filterPersonId;
  const onPersonFilterRef = useRef(onPersonFilter);
  onPersonFilterRef.current = onPersonFilter;
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;
  const soloRef = useRef(soloProjectId);
  soloRef.current = soloProjectId;
  const onProjectSoloRef = useRef(onProjectSolo);
  onProjectSoloRef.current = onProjectSolo;
  const redrawRef = useRef(null);
  // Khi focus/chọn/dữ liệu/lọc/tập trung thay đổi từ bên ngoài, báo vòng lặp vẽ lại ngay
  useEffect(() => { if (redrawRef.current) redrawRef.current(); }, [focusedId, selectedId, dataVersion, filterPersonId, soloProjectId]);

  useEffect(() => {
    const host = hostRef.current;
    let W = host.clientWidth, H = host.clientHeight;
    const stage = new Konva.Stage({ container: host, width: W, height: H });
    const layer = new Konva.Layer({ listening: false });
    stage.add(layer);

    const cam = { ppd: 2.6, leftDay: TODAY - (W / 2.6) * 0.35, scrollY: 0 };
    const heights = new Float64Array(projects.length).fill(30);
    const state = {
      dirty: true, vel: { x: 0, y: 0 }, drag: null, hoverId: null, lastTap: null,
      tween: null, frame: 0, lastLod: -1, hits: [],
    };
    const xOf = (day) => (day - cam.leftDay) * cam.ppd;
    const dayAt = (x) => cam.leftDay + x / cam.ppd;

    function rowH(lod) { return lod === 0 ? 30 : lod === 1 ? 19 : lod === 2 ? 28 : 47; }
    // Danh sách project đang hiển thị: chế độ tập trung -> chỉ 1 project đó;
    // lọc theo 1 nhân viên -> chỉ các project mà nhân viên đó có task.
    function visibleList() {
      const solo = soloRef.current;
      let list = solo ? projects.filter((p) => p.id === solo) : projects;
      const fp = filterRef.current;
      if (fp) list = list.filter((p) => p.tasks.some((t) => t.assigneeId === fp));
      return list;
    }
    function targetHeight(p, lod) {
      if (lod === 0) return 30;
      const rows = filterRef.current ? 1 : p.members.length;
      return 26 + rows * rowH(lod); // 26px chừa dải tiêu đề lane, tránh đè hàng đầu
    }
    function layout(list) {
      const out = new Array(list.length);
      let y = AXIS_H - cam.scrollY;
      for (let i = 0; i < list.length; i++) {
        const h = heights[projects.indexOf(list[i])];
        out[i] = { y, h }; y += h;
      }
      return out;
    }
    function totalHeight() { return visibleList().reduce((a, p) => a + heights[projects.indexOf(p)], 0); }
    function clampScroll() {
      cam.scrollY = clamp(cam.scrollY, 0, Math.max(0, totalHeight() - (H - AXIS_H) + 24));
    }

    // ---------- VẼ ----------
    function draw(ctx) {
      const lod = lodOf(cam.ppd);
      state.hits = [];
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#11141a"; ctx.fillRect(0, 0, W, H);

      // lưới dọc theo tick
      const intervals = [1, 2, 3, 7, 14, 30, 61, 91, 182, 365];
      const interval = intervals.find((iv) => iv * cam.ppd >= 64) || 365;
      const firstTick = Math.ceil(cam.leftDay / interval) * interval;
      const rightDay = dayAt(W);
      // tô cuối tuần khi zoom đủ sâu
      if (cam.ppd >= 4) {
        ctx.fillStyle = "rgba(255,255,255,0.035)";
        for (let d = Math.floor(cam.leftDay); d <= rightDay; d++) {
          const dow = new Date(d * 86400000).getUTCDay();
          if (dow === 0 || dow === 6) ctx.fillRect(xOf(d), AXIS_H, cam.ppd, H - AXIS_H);
        }
      }
      ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 1; ctx.beginPath();
      for (let d = firstTick; d <= rightDay; d += interval) {
        const x = Math.round(xOf(d)) + 0.5;
        ctx.moveTo(x, AXIS_H); ctx.lineTo(x, H);
      }
      ctx.stroke();

      const filterNow = filterRef.current;
      const list = visibleList();
      const lay = layout(list);
      const dragTask = state.drag && state.drag.kind === "task" ? state.drag : null;

      const focusedIdNow = focusedRef.current;
      for (let vi = 0; vi < list.length; vi++) {
        const p = list[vi]; const { y, h } = lay[vi];
        const i = projects.indexOf(p); // số thứ tự gốc cho nhãn, không đổi khi lọc
        if (y + h < AXIS_H || y > H) continue;
        const isFocused = !!focusedIdNow && focusedIdNow === p.id;
        const isDim = !!focusedIdNow && !isFocused;
        const pColor = isDim ? grayOf(p.color) : p.color;
        ctx.fillStyle = isFocused ? "rgba(255,255,255,0.075)" : vi % 2 ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.018)";
        ctx.fillRect(0, y, W, h);
        if (isFocused) { ctx.fillStyle = p.color; ctx.fillRect(0, y, 3, h); }
        ctx.strokeStyle = "rgba(255,255,255,0.09)";
        ctx.beginPath(); ctx.moveTo(0, y + h - 0.5); ctx.lineTo(W, y + h - 0.5); ctx.stroke();

        if (lod === 0) {
          // thanh tổng của project + tiến độ + mốc kết thúc từng task.
          // Đang lọc theo nhân viên: thanh tổng chỉ tính trên task của người đó.
          // Đang kéo thanh tổng: kéo thân = dời (shift), kéo mép = co/giãn theo tỉ lệ (map).
          const sumTasks = filterNow ? p.tasks.filter((t) => t.assigneeId === filterNow) : p.tasks;
          const dSum = state.drag && (state.drag.kind === "summary-move" || state.drag.kind === "summary-scale") && state.drag.project.id === p.id ? state.drag : null;
          const mapDay = (d) => dSum && dSum.kind === "summary-scale" ? dSum.anchor + (d - dSum.anchor) * dSum.factor : dSum ? d + dSum.deltaDays : d;
          const sStart = sumTasks.length ? Math.min(...sumTasks.map((t) => t.start)) : p.start;
          const sEnd = sumTasks.length ? Math.max(...sumTasks.map((t) => t.end)) : p.end;
          const x1 = xOf(mapDay(sStart)), x2 = xOf(mapDay(sEnd));
          if (x2 > -4 && x1 < W + 4) {
            const by = y + h / 2 - 7, bh = 14;
            ctx.fillStyle = "rgba(255,255,255,0.14)"; rrect(ctx, x1, by, Math.max(3, x2 - x1), bh, 7); ctx.fill();
            const prog = sumTasks.reduce((a, t) => a + t.progress, 0) / Math.max(1, sumTasks.length);
            ctx.fillStyle = pColor; rrect(ctx, x1, by, Math.max(3, (x2 - x1) * prog), bh, 7); ctx.fill();
            if (dSum) { ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 1.6; rrect(ctx, x1 - 1, by - 1, (x2 - x1) + 2, bh + 2, 8); ctx.stroke(); }
            ctx.fillStyle = isDim ? "#8f97a5" : "#e8ecf3";
            for (const t of sumTasks) {
              const mx = xOf(mapDay(t.end));
              ctx.beginPath(); ctx.moveTo(mx, by + bh / 2 - 4); ctx.lineTo(mx + 4, by + bh / 2); ctx.lineTo(mx, by + bh / 2 + 4); ctx.lineTo(mx - 4, by + bh / 2); ctx.closePath(); ctx.fill();
            }
            state.hits.push({ kind: "project", project: p, x: Math.max(0, x1), y: by, w: Math.min(W, x2) - Math.max(0, x1), h: bh, sx1: x1, sx2: x2 });
          }
        } else {
          const rh = rowH(lod);
          const memberList = filterNow ? p.members.filter((m) => m === filterNow) : p.members;
          memberList.forEach((pid, row) => {
            const ry = y + 24 + row * rh;
            let rowHasVisible = false;
            for (const t of p.tasks) {
              if (t.assigneeId !== pid) continue;
              const shift = dragTask && dragTask.task.id === t.id ? dragTask.deltaDays : 0;
              // Đang kéo mép task tổng: đầu mép di chuyển, task con co/giãn theo tỉ lệ (subMap)
              const dRes = state.drag && state.drag.kind === "task-resize" && state.drag.task.id === t.id ? state.drag : null;
              let effS = t.start + shift, effE = t.end + shift, subMap = null;
              if (dRes) {
                // Kéo mép cũng bị chặn bởi task kề của cùng người
                const { prevEnd, nextStart } = personBounds(p, t);
                if (dRes.edge === "end") { effE = Math.max(t.start + 1, nextStart != null ? Math.min(dRes.day, nextStart) : dRes.day); effS = t.start; }
                else { effS = Math.min(t.end - 1, prevEnd != null ? Math.max(dRes.day, prevEnd) : dRes.day); effE = t.end; }
                const anchor = dRes.edge === "end" ? t.start : t.end;
                const f = (effE - effS) / (t.end - t.start);
                subMap = (d) => anchor + (d - anchor) * f;
              }
              const x1 = xOf(effS), x2 = xOf(effE);
              if (x2 < -4 || x1 > W + 4) continue;
              rowHasVisible = true;
              const person = personById(pid);
              const personColor = isDim ? grayOf(person.color) : person.color;
              const th = lod === 1 ? 13 : lod === 2 ? 20 : 22;
              const ty = ry + (rh - (lod === 3 ? 38 : th)) / 2;
              // thanh task
              ctx.globalAlpha = isDim ? 0.5 : state.hoverId === t.id || selectedRef.current === t.id ? 1 : 0.88;
              ctx.fillStyle = personColor; rrect(ctx, x1, ty, Math.max(3, x2 - x1), th, 5); ctx.fill();
              ctx.globalAlpha = 1;
              // tiến độ
              if (t.progress > 0) {
                ctx.fillStyle = "rgba(0,0,0,0.32)";
                rrect(ctx, x1, ty + th - 4, Math.max(3, (x2 - x1) * t.progress), 4, 2); ctx.fill();
              }
              if (selectedRef.current === t.id) {
                ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 2; rrect(ctx, x1 - 1.5, ty - 1.5, (x2 - x1) + 3, th + 3, 6); ctx.stroke();
              }
              state.hits.push({ kind: "task", project: p, task: t, x: Math.max(0, x1), y: ty, w: Math.min(W, x2) - Math.max(0, x1), h: th, sx1: x1, sx2: x2 });
              // nhãn trong thanh khi đủ rộng & đủ sâu; thanh tràn mép trái thì
              // nhãn bắt đầu sau nhãn người làm để không bị cắt mất đầu chữ
              if (lod >= 2 && x2 - x1 > 74) {
                const lx = x1 < 130 ? Math.max(x1 + 7, 132) : x1 + 7;
                if (x2 - lx > 46) {
                  ctx.save(); ctx.beginPath(); ctx.rect(lx, ty, x2 - lx - 4, th); ctx.clip();
                  ctx.fillStyle = "rgba(10,12,16,0.85)"; ctx.font = "600 11px Inter, system-ui, sans-serif";
                  ctx.textAlign = "left"; ctx.textBaseline = "middle";
                  ctx.fillText(t.name, lx, ty + th / 2 + 0.5);
                  ctx.restore();
                }
              }
              // task con ở LOD 3
              if (lod === 3) {
                const sy = ty + th + 3, sh = 12;
                for (const s of t.subtasks) {
                  const sx1 = xOf(subMap ? subMap(s.start) : s.start + shift), sx2 = xOf(subMap ? subMap(s.end) : s.end + shift);
                  if (sx2 < -2 || sx1 > W + 2) continue;
                  const subW = Math.max(2, sx2 - sx1 - 1.5);
                  ctx.fillStyle = personColor; ctx.globalAlpha = isDim ? 0.18 : 0.3;
                  rrect(ctx, sx1, sy, subW, sh, 3); ctx.fill();
                  // phần đã xong của task con đậm hơn (tiến độ riêng của task con)
                  const doneW = subW * (s.progress || 0);
                  if (doneW > 1) { ctx.globalAlpha = isDim ? 0.3 : 0.85; rrect(ctx, sx1, sy, doneW, sh, 3); ctx.fill(); }
                  ctx.globalAlpha = 1;
                  state.hits.push({ kind: "subtask", project: p, task: t, sub: s, x: Math.max(0, sx1), y: sy, w: Math.min(W, sx2) - Math.max(0, sx1), h: sh });
                  if (sx2 - sx1 > 56) {
                    ctx.save(); ctx.beginPath(); ctx.rect(sx1 + 4, sy, sx2 - sx1 - 6, sh); ctx.clip();
                    ctx.fillStyle = "rgba(232,236,243,0.9)"; ctx.font = "10px Inter, system-ui, sans-serif";
                    ctx.textAlign = "left"; ctx.textBaseline = "middle";
                    ctx.fillText(s.name, sx1 + 4, sy + sh / 2 + 0.5); ctx.restore();
                  }
                }
              }
            }
            // nhãn người làm — dính mép trái, chỉ hiện khi hàng có task trong
            // khung nhìn (đang lọc thì luôn hiện). Cuối nhãn có icon phễu lọc:
            // bấm vào để chỉ xem nhân viên này và các task của họ.
            if (lod >= 2 && (rowHasVisible || filterNow)) {
              const person = personById(pid);
              const isFilterTarget = filterNow === pid;
              ctx.fillStyle = "rgba(24,28,37,0.92)"; rrect(ctx, 6, ry + 2, 118, 16, 8); ctx.fill();
              if (isFilterTarget) { ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 1.3; rrect(ctx, 6, ry + 2, 118, 16, 8); ctx.stroke(); }
              ctx.fillStyle = isDim ? grayOf(person.color) : person.color; ctx.beginPath(); ctx.arc(15, ry + 10, 4.5, 0, Math.PI * 2); ctx.fill();
              ctx.fillStyle = isDim ? "#79828f" : "#cfd6e4"; ctx.font = "10.5px Inter, system-ui, sans-serif";
              ctx.textAlign = "left"; ctx.textBaseline = "middle";
              ctx.fillText(person.name, 23, ry + 10.5);
              // icon phễu lọc
              ctx.fillStyle = isFilterTarget ? "#ffd166" : "rgba(203,211,224,0.8)";
              ctx.beginPath();
              ctx.moveTo(108, ry + 5.5); ctx.lineTo(119, ry + 5.5); ctx.lineTo(115.2, ry + 9.8);
              ctx.lineTo(115.2, ry + 14); ctx.lineTo(111.8, ry + 14); ctx.lineTo(111.8, ry + 9.8);
              ctx.closePath(); ctx.fill();
              state.hits.push({ kind: "personFilter", personId: pid, project: p, x: 103, y: ry + 2, w: 21, h: 16 });
            }
          });
        }
        // nhãn project — dính mép trái, bấm vào để nổi bật project này.
        // Cuối nhãn có nút "tập trung" (icon khung ngắm): mở chế độ chia đôi
        // màn hình, timeline chỉ còn project này + panel chi tiết bên phải.
        const label = `${String(i + 1).padStart(3, "0")} · ${p.name}`;
        const isSolo = soloRef.current === p.id;
        ctx.fillStyle = "rgba(18,21,28,0.94)"; rrect(ctx, 6, y + 3, 196, 17, 8.5); ctx.fill();
        if (isFocused || isSolo) { ctx.strokeStyle = isSolo ? "#8ab8ff" : p.color; ctx.lineWidth = 1.6; rrect(ctx, 6, y + 3, 196, 17, 8.5); ctx.stroke(); }
        ctx.fillStyle = pColor; ctx.beginPath(); ctx.arc(15, y + 11.5, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = isDim ? "#98a1b1" : "#eef1f7"; ctx.font = "600 11px Inter, system-ui, sans-serif";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(label, 23, y + 12);
        state.hits.push({ kind: "projectLabel", project: p, x: 6, y: y + 3, w: 196, h: 17 });
        // nút tập trung: 4 góc khung ngắm ở cuối nhãn
        const bx = 182, byy = y + 6.5, s = 10, c = 3.6;
        ctx.strokeStyle = isSolo ? "#8ab8ff" : "rgba(203,211,224,0.85)"; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(bx, byy + c); ctx.lineTo(bx, byy); ctx.lineTo(bx + c, byy);
        ctx.moveTo(bx + s - c, byy); ctx.lineTo(bx + s, byy); ctx.lineTo(bx + s, byy + c);
        ctx.moveTo(bx + s, byy + s - c); ctx.lineTo(bx + s, byy + s); ctx.lineTo(bx + s - c, byy + s);
        ctx.moveTo(bx + c, byy + s); ctx.lineTo(bx, byy + s); ctx.lineTo(bx, byy + s - c);
        ctx.stroke();
        state.hits.push({ kind: "projectSolo", project: p, x: 174, y: y + 3, w: 28, h: 17 });
      }

      // đường hôm nay
      const tx = xOf(TODAY);
      if (tx >= 0 && tx <= W) {
        ctx.strokeStyle = "#ff5d5d"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(tx, AXIS_H); ctx.lineTo(tx, H); ctx.stroke();
      }
      // trục thời gian (vẽ cuối, cố định trên cùng)
      ctx.fillStyle = "#171b23"; ctx.fillRect(0, 0, W, AXIS_H);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath(); ctx.moveTo(0, AXIS_H - 0.5); ctx.lineTo(W, AXIS_H - 0.5); ctx.stroke();
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (let d = firstTick; d <= rightDay; d += interval) {
        const x = xOf(d);
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.beginPath(); ctx.moveTo(x, AXIS_H - 9); ctx.lineTo(x, AXIS_H); ctx.stroke();
        const dt = new Date(d * 86400000);
        if (interval >= 182) {
          ctx.fillStyle = "#aeb8c8"; ctx.font = "11px Inter, system-ui, sans-serif";
          ctx.fillText(`${dt.getUTCFullYear()}`, x, 27);
          continue;
        }
        // Nhãn tick = ô nhỏ ghi tên tắt của thứ (Mon/Tue/Wed/Thu/Fri/Sat/Sun)
        // + ngày tháng. Cách ghi số 2..7/N trước đây gây nhầm (N giống 5 khi
        // thu nhỏ, các số thứ khó liên tưởng) nên đổi hẳn sang tên tắt tiếng Anh.
        // Cuối tuần tô màu riêng (Sat cam, Sun đỏ) cho dễ cảm nhận nhịp tuần.
        const DOW_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dow = dt.getUTCDay();
        const dowAbbr = DOW_ABBR[dow];
        const dateText = interval >= 30
          ? `${dt.getUTCDate()}/${dt.getUTCMonth() + 1}/${dt.getUTCFullYear()}`
          : `${dt.getUTCDate()}/${dt.getUTCMonth() + 1}`;
        ctx.font = "11px Inter, system-ui, sans-serif";
        const textW = ctx.measureText(dateText).width;
        ctx.font = "700 8.5px Inter, system-ui, sans-serif";
        const badgeW = ctx.measureText(dowAbbr).width + 10, badgeH = 15, gap = 4;
        const startX = x - (badgeW + gap + textW) / 2;
        const bcy = 27;
        ctx.fillStyle = dow === 0 ? "#e5534b" : dow === 6 ? "#d9932c" : "rgba(255,255,255,0.16)";
        rrect(ctx, startX, bcy - badgeH / 2, badgeW, badgeH, badgeH / 2); ctx.fill();
        if (d === TODAY) { ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 1.6; rrect(ctx, startX - 0.8, bcy - badgeH / 2 - 0.8, badgeW + 1.6, badgeH + 1.6, badgeH / 2); ctx.stroke(); }
        ctx.fillStyle = dow === 0 || dow === 6 ? "#ffffff" : "#dfe5ef";
        ctx.fillText(dowAbbr, startX + badgeW / 2, bcy + 0.5);
        ctx.fillStyle = "#aeb8c8"; ctx.font = "11px Inter, system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(dateText, startX + badgeW + gap, bcy);
        ctx.textAlign = "center";
      }
      ctx.fillStyle = "#8b95a9"; ctx.font = "600 10px Inter, system-ui, sans-serif"; ctx.textAlign = "left";
      ctx.fillText(interval >= 30 ? "THÁNG" : interval >= 7 ? "TUẦN" : "NGÀY", 8, 11);
      if (tx >= 0 && tx <= W) {
        ctx.fillStyle = "#ff5d5d"; ctx.font = "700 10px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("HÔM NAY", clamp(tx, 34, W - 34), 11);
      }
      if (lod !== state.lastLod) state.lastLod = lod;
    }

    const shape = new Konva.Shape({ sceneFunc: (ctx) => draw(ctx), hitFunc: () => {} });
    shape.listening(false);
    layer.add(shape);
    redrawRef.current = () => { state.dirty = true; };

    // ---------- VÒNG LẶP ----------
    let raf = 0;
    function tick() {
      raf = requestAnimationFrame(tick);
      state.frame++;
      // tween camera (nút bấm / double-click / fit)
      if (state.tween) {
        const tw = state.tween;
        const k = clamp((performance.now() - tw.t0) / tw.dur, 0, 1);
        const e = 1 - Math.pow(1 - k, 3);
        cam.ppd = tw.fromPpd + (tw.toPpd - tw.fromPpd) * e;
        if (tw.anchor) cam.leftDay = tw.anchor.day - tw.anchor.x / cam.ppd;
        else cam.leftDay = tw.fromLeft + (tw.toLeft - tw.fromLeft) * e;
        if (tw.toScrollY != null) cam.scrollY = tw.fromScrollY + (tw.toScrollY - tw.fromScrollY) * e;
        if (k >= 1) state.tween = null;
        state.dirty = true;
      } else if (!state.drag && (Math.abs(state.vel.x) > 0.08 || Math.abs(state.vel.y) > 0.08)) {
        cam.leftDay -= state.vel.x / cam.ppd;
        cam.scrollY -= state.vel.y;
        state.vel.x *= 0.93; state.vel.y *= 0.93;
        state.dirty = true;
      }
      // chiều cao lane đuổi theo target của LOD hiện tại (chỉ các project đang hiển thị)
      const lod = lodOf(cam.ppd);
      let moving = false;
      for (const p of visibleList()) {
        const i = projects.indexOf(p);
        const target = targetHeight(p, lod);
        const diff = target - heights[i];
        if (Math.abs(diff) > 0.4) { heights[i] += diff * 0.18; moving = true; }
        else if (diff !== 0) heights[i] = target;
      }
      if (moving) state.dirty = true;
      clampScroll();
      if (state.dirty) { layer.batchDraw(); state.dirty = false; }
      // HUD cập nhật ở vòng lặp chính (không để trong draw — nhịp batchDraw của
      // Konva có thể lệch pha cố định với bộ đếm frame này khiến HUD không bao giờ chạy)
      if (hudRef && hudRef.current && state.frame % 10 === 0) {
        hudRef.current.textContent = `${cam.ppd.toFixed(2)} px/ngày · ${LOD_NAMES[lodOf(cam.ppd)]} · ${state.hits.length} thanh`;
      }
    }
    tick();

    function startTween(toPpd, opts = {}) {
      state.tween = {
        t0: performance.now(), dur: opts.dur || 480,
        fromPpd: cam.ppd, toPpd: clamp(toPpd, MIN_PPD, MAX_PPD),
        fromLeft: cam.leftDay, toLeft: opts.toLeft != null ? opts.toLeft : cam.leftDay,
        fromScrollY: cam.scrollY, toScrollY: opts.toScrollY != null ? opts.toScrollY : null,
        anchor: opts.anchor || null,
      };
      state.vel = { x: 0, y: 0 };
    }
    if (controlsRef) {
      controlsRef.current = {
        zoomStep: (f) => startTween(cam.ppd * f, { anchor: { day: dayAt(W / 2), x: W / 2 } }),
        fit: () => {
          const span = DATA_MAX - DATA_MIN;
          startTween(W / (span * 1.02), { toLeft: DATA_MIN - span * 0.01, toScrollY: 0, dur: 650 });
        },
        today: () => startTween(Math.max(cam.ppd, 3), { anchor: { day: TODAY, x: W * 0.4 }, dur: 650 }),
      };
    }

    // ---------- TƯƠNG TÁC (native events trên container) ----------
    const el = stage.container();
    el.style.cursor = "grab";
    el.style.touchAction = "none";

    function hitAt(x, y) {
      const hits = state.hits;
      for (let i = hits.length - 1; i >= 0; i--) {
        const r = hits[i];
        // Thanh task/thanh tổng cho bắt chuột nới 6px hai đầu cho dễ nắm mép kéo
        const pad = r.kind === "task" || r.kind === "project" ? 6 : 0;
        if (x >= r.x - pad && x <= r.x + r.w + pad && y >= r.y && y <= r.y + r.h) return r;
      }
      return null;
    }
    function onWheel(e) {
      e.preventDefault();
      state.tween = null; state.vel = { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const delta = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
      const factor = Math.exp(-delta * 0.0024);
      const cursorDay = dayAt(mx);
      cam.ppd = clamp(cam.ppd * factor, MIN_PPD, MAX_PPD);
      cam.leftDay = cursorDay - mx / cam.ppd; // điểm dưới con trỏ đứng yên — chỉ trục X đổi
      state.dirty = true;
    }
    // Giới hạn không-trùng của một task: task chính của cùng 1 người trong
    // cùng 1 project không được đè lên nhau — trả về cuối task trước gần nhất
    // và đầu task sau gần nhất của chính người đó.
    function personBounds(p, t) {
      let prevEnd = null, nextStart = null;
      for (const o of p.tasks) {
        if (o.id === t.id || o.assigneeId !== t.assigneeId) continue;
        if (o.end <= t.start) prevEnd = prevEnd == null ? o.end : Math.max(prevEnd, o.end);
        if (o.start >= t.end) nextStart = nextStart == null ? o.start : Math.min(nextStart, o.start);
      }
      return { prevEnd, nextStart };
    }
    // Con trỏ nằm sát mép trái/phải của thanh (task hoặc thanh tổng) -> kéo mép
    function edgeOf(hit, x) {
      if (!hit || (hit.kind !== "task" && hit.kind !== "project") || hit.sx1 == null) return null;
      if (hit.sx2 - hit.sx1 < 30) return null;
      if (Math.abs(x - hit.sx1) <= 8) return "start";
      if (Math.abs(x - hit.sx2) <= 8) return "end";
      return null;
    }
    function onDown(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const hit = y > AXIS_H ? hitAt(x, y) : null;
      // Nhận diện bấm đúp vào task bằng tay (không phụ thuộc sự kiện dblclick
      // của trình duyệt, vốn chập chờn với pointer capture): 2 lần nhấn vào
      // cùng 1 task trong 350ms và lệch < 8px -> mở form sửa.
      if (hit && hit.task) {
        const now = performance.now();
        const lt = state.lastTap;
        if (lt && lt.id === (hit.sub ? hit.sub.id : hit.task.id) && now - lt.t < 350 && Math.abs(x - lt.x) < 8 && Math.abs(y - lt.y) < 8) {
          state.lastTap = null;
          if (onEditTaskRef.current) onEditTaskRef.current(hit.project, hit.task, hit.sub || null);
          return;
        }
        state.lastTap = { t: now, x, y, id: hit.sub ? hit.sub.id : hit.task.id };
      }
      const isTask = hit && (hit.kind === "task" || hit.kind === "subtask");
      const isSummary = hit && hit.kind === "project";
      state.drag = {
        kind: isTask ? "maybe-task" : isSummary ? "maybe-summary" : "pan",
        hit, startX: x, startY: y, lastX: x, lastY: y,
        deltaDays: 0, moved: false, task: hit ? hit.task : null,
        project: hit ? hit.project : null,
        edge: isTask && hit.kind === "task" ? edgeOf(hit, x) : isSummary ? edgeOf(hit, x) : null,
        day: 0, anchor: 0, factor: 1,
      };
      state.vel = { x: 0, y: 0 }; state.tween = null;
      el.setPointerCapture(e.pointerId);
    }
    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const d = state.drag;
      if (d) {
        const dx = x - d.lastX, dy = y - d.lastY;
        d.lastX = x; d.lastY = y;
        if (Math.abs(x - d.startX) + Math.abs(y - d.startY) > 4) d.moved = true;
        if (d.kind === "maybe-task" && d.moved && Math.abs(x - d.startX) > Math.abs(y - d.startY)) { d.kind = d.edge ? "task-resize" : "task"; state.lastTap = null; }
        if (d.kind === "maybe-summary" && d.moved && Math.abs(x - d.startX) > Math.abs(y - d.startY)) { d.kind = d.edge ? "summary-scale" : "summary-move"; state.lastTap = null; }
        if (d.kind === "pan") {
          cam.leftDay -= dx / cam.ppd; cam.scrollY -= dy;
          state.vel.x = state.vel.x * 0.6 + dx * 0.4;
          state.vel.y = state.vel.y * 0.6 + dy * 0.4;
          el.style.cursor = "grabbing";
        } else if (d.kind === "task" || d.kind === "summary-move") {
          d.deltaDays = Math.round((x - d.startX) / cam.ppd);
          // Kéo task không được đè lên task kề trước/sau của cùng người
          if (d.kind === "task" && d.task && d.hit) {
            const { prevEnd, nextStart } = personBounds(d.hit.project, d.task);
            if (prevEnd != null) d.deltaDays = Math.max(d.deltaDays, prevEnd - d.task.start);
            if (nextStart != null) d.deltaDays = Math.min(d.deltaDays, nextStart - d.task.end);
          }
          el.style.cursor = "ew-resize";
        } else if (d.kind === "task-resize") {
          d.day = Math.round(dayAt(x));
          el.style.cursor = "ew-resize";
        } else if (d.kind === "summary-scale") {
          const p = d.project, span = p.end - p.start, pd = dayAt(x);
          d.anchor = d.edge === "end" ? p.start : p.end;
          const newSpan = d.edge === "end" ? pd - d.anchor : d.anchor - pd;
          d.factor = clamp(newSpan / span, Math.max(0.3, 20 / span), 2.5);
          el.style.cursor = "ew-resize";
        }
        state.dirty = true;
        return;
      }
      // hover
      const hit = y > AXIS_H ? hitAt(x, y) : null;
      const id = hit && hit.task ? hit.task.id : hit && hit.kind === "project" ? hit.project.id : null;
      if (id !== state.hoverId) { state.hoverId = id; state.dirty = true; }
      el.style.cursor = edgeOf(hit, x) ? "ew-resize" : hit ? "pointer" : "grab";
      const tip = tipRef.current;
      if (tip) {
        if (hit && hit.task) {
          const t = hit.task, person = personById(t.assigneeId);
          tip.textContent = hit.kind === "subtask"
            ? `${t.name} › ${hit.sub.name}\n${person.name} · ${fmtDay(hit.sub.start)} → ${fmtDay(hit.sub.end)} · xong ${Math.round((hit.sub.progress || 0) * 100)}%`
            : `${t.name}\n${person.name} · ${fmtDay(t.start)} → ${fmtDay(t.end)} · xong ${Math.round(t.progress * 100)}%`;
          tip.style.display = "block";
          tip.style.left = `${Math.min(x + 14, W - 240)}px`;
          tip.style.top = `${y + 16}px`;
        } else if (hit && hit.kind === "project") {
          const p = hit.project;
          tip.textContent = `${p.name} (thanh tổng)\n${fmtDay(p.start)} → ${fmtDay(p.end)} · Kéo thân: dời cả project · Kéo mép: co/giãn thời gian`;
          tip.style.display = "block";
          tip.style.left = `${Math.min(x + 14, W - 240)}px`;
          tip.style.top = `${y + 16}px`;
        } else if (hit && hit.kind === "personFilter") {
          const person = personById(hit.personId);
          tip.textContent = filterRef.current === hit.personId ? `Bỏ lọc — hiện tất cả nhân viên` : `Lọc riêng ${person.name}: chỉ hiện các project và task của nhân viên này`;
          tip.style.display = "block";
          tip.style.left = `${Math.min(x + 14, W - 240)}px`;
          tip.style.top = `${y + 16}px`;
        } else if (hit && hit.kind === "projectSolo") {
          tip.textContent = soloRef.current === hit.project.id
            ? `Thoát chế độ tập trung dự án`
            : `Tập trung vào ${hit.project.name}: chia đôi màn hình — timeline bên trái, chi tiết dự án bên phải`;
          tip.style.display = "block";
          tip.style.left = `${Math.min(x + 14, W - 240)}px`;
          tip.style.top = `${y + 16}px`;
        } else tip.style.display = "none";
      }
    }
    function onUp(e) {
      const d = state.drag; state.drag = null;
      el.style.cursor = "grab";
      if (!d) return;
      if (d.kind === "task" && d.deltaDays !== 0 && d.task) {
        const t = d.task, dd = d.deltaDays;
        t.start += dd; t.end += dd;
        t.subtasks.forEach((s) => { s.start += dd; s.end += dd; });
        const p = d.hit.project;
        p.start = Math.min(p.start, ...p.tasks.map((t2) => t2.start));
        p.end = Math.max(p.end, ...p.tasks.map((t2) => t2.end));
        if (selectedRef.current === t.id) onSelectRef.current({ project: p, task: t });
      } else if (d.kind === "task-resize" && d.task) {
        // Kéo mép task tổng: đổi thời lượng task, task con co/giãn theo tỉ lệ
        const t = d.task, p = d.hit.project;
        const anchor = d.edge === "end" ? t.start : t.end;
        const { prevEnd, nextStart } = personBounds(p, t);
        let effS = t.start, effE = t.end;
        if (d.edge === "end") effE = Math.max(t.start + 1, nextStart != null ? Math.min(d.day, nextStart) : d.day);
        else effS = Math.min(t.end - 1, prevEnd != null ? Math.max(d.day, prevEnd) : d.day);
        const f = (effE - effS) / (t.end - t.start);
        const mapR = (v) => Math.round(anchor + (v - anchor) * f);
        t.subtasks.forEach((s) => {
          let ns = Math.max(effS, Math.min(effE - 1, mapR(s.start)));
          let ne = Math.max(ns + 1, Math.min(effE, mapR(s.end)));
          if (ne > effE) { ne = effE; ns = ne - 1; }
          s.start = ns; s.end = ne;
        });
        t.start = effS; t.end = effE;
        p.start = Math.min(p.start, ...p.tasks.map((t2) => t2.start));
        p.end = Math.max(p.end, ...p.tasks.map((t2) => t2.end));
        if (selectedRef.current === t.id) onSelectRef.current({ project: p, task: t });
      } else if (d.kind === "summary-move" && d.deltaDays !== 0 && d.project) {
        // Kéo thân thanh tổng: dời toàn bộ project (mọi task + task con)
        const p = d.project, dd = d.deltaDays;
        p.tasks.forEach((t) => { t.start += dd; t.end += dd; t.subtasks.forEach((s) => { s.start += dd; s.end += dd; }); });
        p.start += dd; p.end += dd;
        onSelectRef.current({ project: p, task: null });
      } else if (d.kind === "summary-scale" && d.project && Math.abs(d.factor - 1) > 0.001) {
        // Kéo mép thanh tổng: co/giãn toàn bộ timeline project theo tỉ lệ quanh mép cố định
        const p = d.project, anchor = d.anchor, f = d.factor;
        const mapR = (v) => Math.round(anchor + (v - anchor) * f);
        p.tasks.forEach((t) => {
          t.subtasks.forEach((s) => { s.start = mapR(s.start); s.end = Math.max(s.start + 1, mapR(s.end)); });
          const ns = mapR(t.start);
          t.end = Math.max(ns + 1, mapR(t.end)); t.start = ns;
        });
        // Làm tròn khi co/giãn có thể tạo trùng nhẹ giữa 2 task liên tiếp của
        // cùng 1 người — đẩy dồn về sau để giữ quy tắc không-trùng.
        const byPerson = {};
        p.tasks.forEach((t) => { (byPerson[t.assigneeId] = byPerson[t.assigneeId] || []).push(t); });
        Object.values(byPerson).forEach((list) => {
          list.sort((a, b) => a.start - b.start);
          let lastEnd = null;
          for (const t of list) {
            if (lastEnd != null && t.start < lastEnd) {
              const sh = lastEnd - t.start;
              t.start += sh; t.end += sh;
              t.subtasks.forEach((s) => { s.start += sh; s.end += sh; });
            }
            lastEnd = t.end;
          }
        });
        p.start = Math.min(...p.tasks.map((t) => t.start));
        p.end = Math.max(...p.tasks.map((t) => t.end));
        onSelectRef.current({ project: p, task: null });
      } else if (!d.moved) {
        // click chọn; click đúng nhãn tên project = bật/tắt nổi bật project đó
        const rect = el.getBoundingClientRect();
        const hit = hitAt(e.clientX - rect.left, e.clientY - rect.top);
        if (hit && hit.kind === "projectSolo") onProjectSoloRef.current && onProjectSoloRef.current(hit.project);
        else if (hit && hit.kind === "projectLabel") onLabelClickRef.current && onLabelClickRef.current(hit.project);
        else if (hit && hit.kind === "personFilter") onPersonFilterRef.current && onPersonFilterRef.current(hit.personId);
        else if (hit && hit.task) onSelectRef.current({ project: hit.project, task: hit.task, sub: hit.sub || null });
        else if (hit && hit.kind === "project") onSelectRef.current({ project: hit.project, task: null });
        else { onSelectRef.current(null); if (onClearFocusRef.current) onClearFocusRef.current(); }
      }
      state.dirty = true;
    }
    function onKey(e) {
      if (e.key === "Escape") {
        if (onEscapeRef.current) onEscapeRef.current();
        else if (onClearFocusRef.current) onClearFocusRef.current();
        onSelectRef.current(null);
        state.dirty = true;
      }
    }
    function onDbl(e) {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      // Bấm đúp trúng task/task con -> mở form sửa task đó; bấm đúp vùng trống -> phóng to
      const hit = my > AXIS_H ? hitAt(mx, my) : null;
      if (hit && hit.task) {
        if (onEditTaskRef.current) onEditTaskRef.current(hit.project, hit.task);
        return;
      }
      startTween(cam.ppd * 1.8, { anchor: { day: dayAt(mx), x: mx }, dur: 380 });
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("dblclick", onDbl);
    window.addEventListener("keydown", onKey);

    const ro = new ResizeObserver(() => {
      W = host.clientWidth; H = host.clientHeight;
      stage.width(W); stage.height(H);
      state.dirty = true;
    });
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("dblclick", onDbl);
      window.removeEventListener("keydown", onKey);
      stage.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={hostRef} style={{ position: "absolute", inset: 0 }}>
      <div ref={tipRef} style={{
        display: "none", position: "absolute", zIndex: 5, pointerEvents: "none",
        background: "rgba(16,19,26,0.96)", border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: 8, padding: "6px 9px", fontSize: 11.5, lineHeight: 1.5,
        color: "#e8ecf3", whiteSpace: "pre-line", maxWidth: 230,
      }} />
    </div>
  );
}
