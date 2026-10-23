import { useRef, useState } from "react";
import Timeline from "./Timeline";
import ProjectWorkspace from "./ProjectWorkspace";
import { PROJECTS, fmtDay, personById } from "./data";

const DAY_MS = 86400000;
const isoOf = (day) => {
  const d = new Date(day * DAY_MS);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
};
const dayOfISO = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  return m ? Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY_MS) : null;
};

const fieldStyle = {
  width: "100%", boxSizing: "border-box", background: "#0f1218", color: "#e8ecf3",
  border: "1px solid rgba(255,255,255,0.16)", borderRadius: 8, padding: "8px 10px", fontSize: 13.5,
  colorScheme: "dark",
};
const labelStyle = { display: "block", fontSize: 11.5, color: "#8b95a9", margin: "12px 0 5px", textTransform: "uppercase", letterSpacing: 0.5 };

// Form sửa task — mở bằng bấm đúp vào thanh task (hoặc nút Sửa trong panel)
function TaskForm({ project, task, onClose, onSave }) {
  const [name, setName] = useState(task.name);
  const [assigneeId, setAssigneeId] = useState(task.assigneeId);
  const [startISO, setStartISO] = useState(isoOf(task.start));
  const [endISO, setEndISO] = useState(isoOf(task.end));
  const [progress, setProgress] = useState(Math.round(task.progress * 100));
  const [error, setError] = useState(null);

  const submit = () => {
    const s = dayOfISO(startISO), e = dayOfISO(endISO);
    if (s == null || e == null) { setError("Ngày chưa hợp lệ."); return; }
    if (e <= s) { setError("Ngày kết thúc phải sau ngày bắt đầu."); return; }
    if (!name.trim()) { setError("Tên task không được để trống."); return; }
    // Quy tắc: task chính của cùng 1 người không được trùng nhau
    const clash = project.tasks.find((o) => o.id !== task.id && o.assigneeId === assigneeId && s < o.end && o.start < e);
    if (clash) {
      setError(`Trùng với task "${clash.name}" (${fmtDay(clash.start)} → ${fmtDay(clash.end)}) của ${personById(assigneeId).name} — một người không thể làm 2 task chính cùng lúc.`);
      return;
    }
    onSave({ name: name.trim(), assigneeId, start: s, end: e, progress: progress / 100 });
  };

  return (
    <div onClick={(ev) => { if (ev.target === ev.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 20, background: "rgba(4,6,10,0.62)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400, maxWidth: "92vw", background: "#171b24", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: 18, boxShadow: "0 18px 48px rgba(0,0,0,0.55)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Sửa task</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8b95a9", fontSize: 17, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ fontSize: 12, color: "#8b95a9", marginTop: 2 }}>Project: {project.name}</div>

        <label style={labelStyle}>Tên task</label>
        <input style={fieldStyle} value={name} onChange={(ev) => setName(ev.target.value)} />
        <label style={labelStyle}>Người làm</label>
        <select style={fieldStyle} value={assigneeId} onChange={(ev) => setAssigneeId(ev.target.value)}>
          {project.members.map((pid) => (
            <option key={pid} value={pid}>{personById(pid).name}</option>
          ))}
        </select>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={labelStyle}>Bắt đầu</label>
            <input style={fieldStyle} type="date" value={startISO} onChange={(ev) => setStartISO(ev.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Kết thúc</label>
            <input style={fieldStyle} type="date" value={endISO} onChange={(ev) => setEndISO(ev.target.value)} />
          </div>
        </div>
        <label style={labelStyle}>Tiến độ: {progress}%</label>
        <input type="range" min="0" max="100" value={progress} onChange={(ev) => setProgress(+ev.target.value)} style={{ width: "100%", accentColor: "#ffd166" }} />
        <div style={{ fontSize: 12, color: "#8b95a9", marginTop: 8 }}>Task con sẽ tự co/giãn theo khoảng thời gian mới của task.</div>
        {error && (
          <div style={{ marginTop: 12, background: "rgba(255,93,93,0.12)", border: "1px solid rgba(255,93,93,0.45)", color: "#ffb3b3", borderRadius: 8, padding: "8px 10px", fontSize: 12.5, lineHeight: 1.5 }}>{error}</div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <button onClick={onClose} style={{ background: "#232936", color: "#e8ecf3", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Hủy</button>
          <button onClick={submit} style={{ background: "#ffd166", color: "#16181d", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Lưu</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sel, setSel] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const [filterPersonId, setFilterPersonId] = useState(null);
  const [soloId, setSoloId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);
  const hudRef = useRef(null);
  const controlsRef = useRef(null);
  const focusedProject = PROJECTS.find((p) => p.id === focusId) || null;
  const soloProject = PROJECTS.find((p) => p.id === soloId) || null;
  // Chế độ tập trung vào 1 dự án: chia đôi màn hình (timeline | chi tiết)
  const enterSolo = (p) => {
    setSoloId(p.id);
    setSel({ project: p, task: null });
    setFocusId(null);
    if (filterPersonId && !p.tasks.some((t) => t.assigneeId === filterPersonId)) setFilterPersonId(null);
  };
  const handleProjectSolo = (p) => { if (soloId === p.id) setSoloId(null); else enterSolo(p); };
  const filterPerson = filterPersonId ? personById(filterPersonId) : null;
  // Bấm icon phễu trên nhãn tên nhân viên: lọc riêng nhân viên đó (chỉ còn các
  // project họ tham gia và các task của họ); bấm lại vào icon của chính họ thì bỏ lọc.
  const handlePersonFilter = (pid) => {
    setFilterPersonId((prev) => (prev === pid ? null : pid));
    if (sel && sel.task && sel.task.assigneeId !== pid) setSel(null);
  };
  // Bấm tên project: nổi bật project đó (xung quanh chuyển xám); bấm lại thì bỏ.
  const handleLabelClick = (p) => {
    setSel({ project: p, task: null });
    setFocusId((prev) => (prev === p.id ? null : p.id));
  };
  // Lưu form sửa task: đổi ngày -> task con co/giãn theo tỉ lệ quanh điểm neo là
  // ngày bắt đầu mới; project tự nới span nếu task vượt ra ngoài.
  const handleSaveEdit = ({ name, assigneeId, start, end, progress }) => {
    const { project, task } = editing;
    const oldStart = task.start, oldSpan = task.end - task.start;
    const f = (end - start) / oldSpan;
    task.subtasks.forEach((s) => {
      const ns = start + Math.round((s.start - oldStart) * f);
      const ne = start + Math.round((s.end - oldStart) * f);
      s.start = ns; s.end = Math.min(end, Math.max(ns + 1, ne));
    });
    Object.assign(task, { name, assigneeId, start, end, progress });
    project.start = Math.min(project.start, ...project.tasks.map((t) => t.start));
    project.end = Math.max(project.end, ...project.tasks.map((t) => t.end));
    setSel({ project, task });
    setDataVersion((v) => v + 1);
    setEditing(null);
  };

  const btn = {
    background: "#232936", color: "#e8ecf3", border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#11141a", color: "#e8ecf3" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.09)", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Timeline Projects — bản mẫu test</div>
          <div style={{ fontSize: 12, color: "#8b95a9" }}>25 project xếp lớp trên 1 trục thời gian · 15 nhân viên · dữ liệu giả · task song song theo người làm</div>
        </div>
        {(focusedProject || filterPerson || soloProject) && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {soloProject && (
              <button onClick={() => setSoloId(null)} title="Thoát chế độ tập trung"
                style={{ background: "#2b3242", color: "#8ab8ff", border: "1px solid rgba(138,184,255,0.5)", borderRadius: 999, padding: "5px 12px", fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap" }}>
                Đang tập trung: {soloProject.name} ×
              </button>
            )}
            {focusedProject && (
              <button onClick={() => setFocusId(null)} title="Bỏ nổi bật"
                style={{ background: "#2b3242", color: "#ffd166", border: "1px solid rgba(255,209,102,0.5)", borderRadius: 999, padding: "5px 12px", fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap" }}>
                Đang nổi bật: {focusedProject.name} ×
              </button>
            )}
            {filterPerson && (
              <button onClick={() => setFilterPersonId(null)} title="Bỏ lọc nhân viên"
                style={{ background: "#2b3242", color: "#7ee2a8", border: "1px solid rgba(126,226,168,0.5)", borderRadius: 999, padding: "5px 12px", fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap" }}>
                Đang lọc: {filterPerson.name} ×
              </button>
            )}
          </div>
        )}
        <span ref={hudRef} style={{ fontSize: 12, color: "#aeb8c8", whiteSpace: "nowrap", marginLeft: focusedProject || filterPerson || soloProject ? 0 : "auto" }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={btn} onClick={() => controlsRef.current?.zoomStep(1.5)}>Phóng to</button>
          <button style={btn} onClick={() => controlsRef.current?.zoomStep(1 / 1.5)}>Thu nhỏ</button>
          <button style={btn} onClick={() => controlsRef.current?.today()}>Về hôm nay</button>
          <button style={btn} onClick={() => controlsRef.current?.fit()}>Toàn cảnh</button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <main style={{ position: "relative", flex: 1, minWidth: 0 }}>
        <Timeline projects={PROJECTS} selectedId={sel?.task?.id || null} onSelect={setSel} hudRef={hudRef} controlsRef={controlsRef}
          focusedId={focusId} onLabelClick={handleLabelClick} onClearFocus={() => setFocusId(null)}
          onEditTask={(p, t) => setEditing({ project: p, task: t })} dataVersion={dataVersion}
          filterPersonId={filterPersonId} onPersonFilter={handlePersonFilter}
          soloProjectId={soloId} onProjectSolo={handleProjectSolo}
          onEscape={() => { setFocusId(null); setFilterPersonId(null); setSoloId(null); }} />

        {sel && (
          <aside style={{
            position: "absolute", top: 58, right: 14, width: 302, zIndex: 6,
            background: "rgba(20,24,33,0.97)", border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 12, padding: 14, boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
          }}>
            <button onClick={() => setSel(null)} style={{ float: "right", background: "none", border: "none", color: "#8b95a9", fontSize: 16, cursor: "pointer" }}>×</button>
            <div style={{ fontSize: 11, color: "#8b95a9", textTransform: "uppercase", letterSpacing: 0.6 }}>{sel.project.name}</div>
            {sel.task ? (
              <>
                <div style={{ fontWeight: 700, fontSize: 15, margin: "4px 0 8px" }}>{sel.task.name}{sel.sub ? ` › ${sel.sub.name}` : ""}</div>
                <div style={{ fontSize: 13, lineHeight: 1.9 }}>
                  <div>Người làm: <b>{personById(sel.task.assigneeId).name}</b></div>
                  <div>Thời gian: {fmtDay(sel.task.start)} → {fmtDay(sel.task.end)}</div>
                  <div>Tiến độ: {Math.round(sel.task.progress * 100)}%</div>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.12)", margin: "8px 0 12px" }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${sel.task.progress * 100}%`, background: personById(sel.task.assigneeId).color }} />
                </div>
                <button onClick={() => setEditing({ project: sel.project, task: sel.task })}
                  style={{ background: "#2b3242", color: "#ffd166", border: "1px solid rgba(255,209,102,0.45)", borderRadius: 8, padding: "5px 12px", fontSize: 12.5, cursor: "pointer", margin: "2px 0 10px" }}>
                  Sửa task… <span style={{ color: "#8b95a9" }}>(hoặc bấm đúp vào thanh)</span>
                </button>
                <div style={{ fontSize: 11, color: "#8b95a9", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Task con ({sel.task.subtasks.length})</div>
                {sel.task.subtasks.map((s) => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "3px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span>{s.name}</span><span style={{ color: "#8b95a9" }}>{fmtDay(s.start)} → {fmtDay(s.end)}</span>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ fontSize: 13, lineHeight: 1.9, marginTop: 4 }}>
                <div>Thời gian: {fmtDay(sel.project.start)} → {fmtDay(sel.project.end)}</div>
                <div>Số task: {sel.project.tasks.length} · Số người: {sel.project.members.length}</div>
                <div style={{ color: "#8b95a9" }}>Phóng to thêm để xem từng task của project này.</div>
                <button onClick={() => enterSolo(sel.project)}
                  style={{ background: "#2b3242", color: "#8ab8ff", border: "1px solid rgba(138,184,255,0.45)", borderRadius: 8, padding: "6px 12px", fontSize: 12.5, cursor: "pointer", marginTop: 8 }}>
                  Tập trung vào dự án này — mở chi tiết
                </button>
              </div>
            )}
          </aside>
        )}

        <footer style={{
          position: "absolute", left: 14, bottom: 12, zIndex: 6, pointerEvents: "none",
          background: "rgba(16,19,26,0.9)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#aeb8c8",
        }}>
          Lăn chuột: zoom về con trỏ · Kéo nền: pan (có quán tính) · Kéo thanh task: dời task · Kéo mép thanh task: đổi thời lượng (task con co/giãn theo) · Kéo thanh tổng ở mức thu nhỏ: dời cả project, kéo mép của nó: co/giãn cả project · Click tên project: nổi bật (xung quanh chuyển xám) · Bấm đúp vào task: mở form sửa · Icon phễu cạnh tên nhân viên: lọc riêng nhân viên đó · Icon khung ngắm ở cuối tên công trình: tập trung vào dự án, chia đôi màn hình xem chi tiết
        </footer>
      </main>

      {soloProject && (
        <ProjectWorkspace key={soloProject.id} project={soloProject}
          selectedTaskId={sel?.task?.id || null}
          onClose={() => setSoloId(null)}
          onSelectTask={(t) => setSel({ project: soloProject, task: t })}
          onFilterPerson={handlePersonFilter} filterPersonId={filterPersonId} />
      )}
      </div>

      {editing && (
        <TaskForm key={editing.task.id} project={editing.project} task={editing.task}
          onClose={() => setEditing(null)} onSave={handleSaveEdit} />
      )}
    </div>
  );
}
