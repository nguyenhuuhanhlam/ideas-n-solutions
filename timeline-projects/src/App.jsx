import { useRef, useState } from "react";
import Timeline from "./Timeline";
import ProjectWorkspace from "./ProjectWorkspace";
import {
  PEOPLE, PROJECTS, TODAY, fmtDay, personById, saveData, clearData,
  buildDemoData, nextPersonId, nextProjectId, nextPersonColor, nextTaskId,
  nextSubtaskId,
} from "./data";

// Panel quản lý dữ liệu: thêm/xóa nhân viên và dự án, nạp lại dữ liệu demo,
// xóa toàn bộ. Mọi thay đổi ghi thẳng vào localStorage qua saveData().
function ManageModal({ onClose, onChanged, onAddTask }) {
  const [tab, setTab] = useState("people");
  const [personName, setPersonName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [pStart, setPStart] = useState(isoOf(TODAY));
  const [pEnd, setPEnd] = useState(isoOf(TODAY + 30));
  const [error, setError] = useState(null);
  const [arming, setArming] = useState(null);
  // Nút xóa 2 bước: bấm lần 1 chuyển sang "Chắc chắn?", bấm lần 2 mới xóa.
  const arm = (key, fn) => {
    if (arming === key) { setArming(null); fn(); }
    else { setArming(key); setTimeout(() => setArming((a) => (a === key ? null : a)), 3000); }
  };

  const addPerson = () => {
    const name = personName.trim();
    if (!name) { setError("Tên nhân viên không được để trống."); return; }
    PEOPLE.push({ id: nextPersonId(), name, color: nextPersonColor() });
    saveData(); setPersonName(""); setError(null); onChanged();
  };
  const deletePerson = (p) => {
    const taskCount = PROJECTS.reduce((n, pr) => n + pr.tasks.filter((t) => t.assigneeId === p.id).length, 0);
    if (taskCount > 0) {
      setError(`Không xóa được ${p.name}: còn ${taskCount} task đang giao cho người này. Xóa hoặc đổi người làm của các task đó trước.`);
      return;
    }
    PROJECTS.forEach((pr) => { pr.members = pr.members.filter((m) => m !== p.id); });
    PEOPLE.splice(PEOPLE.findIndex((o) => o.id === p.id), 1);
    saveData(); setError(null); onChanged();
  };
  const addProject = () => {
    const name = projectName.trim();
    const s = dayOfISO(pStart), e = dayOfISO(pEnd);
    if (!name) { setError("Tên dự án không được để trống."); return; }
    if (s == null || e == null) { setError("Ngày chưa hợp lệ."); return; }
    if (e <= s) { setError("Ngày kết thúc phải sau ngày bắt đầu."); return; }
    PROJECTS.push({
      id: nextProjectId(), name,
      color: `hsl(${Math.round((PROJECTS.length * 47) % 360)} 55% 52%)`,
      start: s, end: e, members: [], tasks: [],
    });
    saveData(); setProjectName(""); setError(null); onChanged();
  };
  const deleteProject = (pr) => {
    PROJECTS.splice(PROJECTS.findIndex((o) => o.id === pr.id), 1);
    saveData(); setError(null); onChanged();
  };

  const tabBtn = (active) => ({
    background: active ? "#2b3242" : "transparent", color: active ? "#ffd166" : "#aeb8c8",
    border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, padding: "6px 14px",
    fontSize: 13, cursor: "pointer", fontWeight: active ? 700 : 400,
  });
  const delBtn = (key) => ({
    background: arming === key ? "#ff5d5d" : "#232936", color: arming === key ? "#fff" : "#ff8a8a",
    border: "1px solid rgba(255,93,93,0.45)", borderRadius: 7, padding: "4px 10px",
    fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
  });

  return (
    <div onClick={(ev) => { if (ev.target === ev.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 20, background: "rgba(4,6,10,0.62)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 520, maxWidth: "92vw", maxHeight: "88vh", overflowY: "auto", background: "#171b24", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: 18, boxShadow: "0 18px 48px rgba(0,0,0,0.55)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Quản lý dữ liệu</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8b95a9", fontSize: 17, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ fontSize: 12, color: "#8b95a9", marginTop: 2 }}>
          {PEOPLE.length} nhân viên · {PROJECTS.length} dự án · Lưu trong trình duyệt (localStorage)
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button style={tabBtn(tab === "people")} onClick={() => setTab("people")}>Nhân viên</button>
          <button style={tabBtn(tab === "projects")} onClick={() => setTab("projects")}>Dự án</button>
        </div>

        {tab === "people" && (
          <>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input style={fieldStyle} value={personName} placeholder="Tên nhân viên mới…"
                onChange={(ev) => setPersonName(ev.target.value)}
                onKeyDown={(ev) => { if (ev.key === "Enter") addPerson(); }} />
              <button onClick={addPerson} style={{ background: "#ffd166", color: "#16181d", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Thêm</button>
            </div>
            {PEOPLE.length === 0 && <div style={{ fontSize: 13, color: "#8b95a9", marginTop: 12 }}>Chưa có nhân viên nào.</div>}
            {PEOPLE.map((p) => {
              const inProjects = PROJECTS.filter((pr) => pr.members.includes(p.id)).length;
              const taskCount = PROJECTS.reduce((n, pr) => n + pr.tasks.filter((t) => t.assigneeId === p.id).length, 0);
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13.5 }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: "#8b95a9" }}>{inProjects} dự án · {taskCount} task</span>
                  <button style={delBtn(`person:${p.id}`)} onClick={() => arm(`person:${p.id}`, () => deletePerson(p))}>
                    {arming === `person:${p.id}` ? "Chắc chắn xóa?" : "Xóa"}
                  </button>
                </div>
              );
            })}
          </>
        )}

        {tab === "projects" && (
          <>
            <label style={labelStyle}>Tên dự án</label>
            <input style={fieldStyle} value={projectName} placeholder="Tên dự án mới…"
              onChange={(ev) => setProjectName(ev.target.value)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Bắt đầu</label>
                <input style={fieldStyle} type="date" value={pStart} onChange={(ev) => setPStart(ev.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Kết thúc</label>
                <input style={fieldStyle} type="date" value={pEnd} onChange={(ev) => setPEnd(ev.target.value)} />
              </div>
            </div>
            <button onClick={addProject} style={{ background: "#ffd166", color: "#16181d", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 12 }}>Thêm dự án</button>
            <div style={{ fontSize: 12, color: "#8b95a9", marginTop: 6 }}>Dự án mới chưa có task; thêm task cho dự án ở bước tiếp theo.</div>
            {PROJECTS.length === 0 && <div style={{ fontSize: 13, color: "#8b95a9", marginTop: 12 }}>Chưa có dự án nào.</div>}
            {PROJECTS.map((pr) => (
              <div key={pr.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ width: 4, height: 26, borderRadius: 2, background: pr.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13.5 }}>
                  {pr.name}
                  <span style={{ display: "block", fontSize: 12, color: "#8b95a9" }}>{fmtDay(pr.start)} → {fmtDay(pr.end)} · {pr.tasks.length} task · {pr.members.length} người</span>
                </span>
                <button onClick={() => onAddTask(pr)} title="Thêm task cho dự án này" aria-label="Thêm task cho dự án này"
                  style={{ ...iconAddBtn, width: 26, height: 26 }}>
                  <PlusIcon size={13} />
                </button>
                <button style={delBtn(`project:${pr.id}`)} onClick={() => arm(`project:${pr.id}`, () => deleteProject(pr))}>
                  {arming === `project:${pr.id}` ? "Chắc chắn xóa?" : "Xóa"}
                </button>
              </div>
            ))}
          </>
        )}

        {error && (
          <div style={{ marginTop: 12, background: "rgba(255,93,93,0.12)", border: "1px solid rgba(255,93,93,0.45)", color: "#ffb3b3", borderRadius: 8, padding: "8px 10px", fontSize: 12.5, lineHeight: 1.5 }}>{error}</div>
        )}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 16, paddingTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={delBtn("demo")} onClick={() => arm("demo", () => { buildDemoData(); setError(null); onChanged(); })}>
            {arming === "demo" ? "Ghi đè dữ liệu hiện tại bằng demo?" : "Nạp dữ liệu demo"}
          </button>
          <button style={delBtn("clear")} onClick={() => arm("clear", () => { clearData(); setError(null); onChanged(); })}>
            {arming === "clear" ? "Xóa hết, chắc chắn?" : "Xóa toàn bộ dữ liệu"}
          </button>
          <span style={{ fontSize: 12, color: "#8b95a9", alignSelf: "center" }}>Demo cũ (25 dự án, 15 người) vẫn nạp lại được bất cứ lúc nào.</span>
        </div>
      </div>
    </div>
  );
}

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

// Nút thêm (task / task con) dạng icon dấu cộng — tiết kiệm chỗ so với nút
// chữ, nhãn đầy đủ nằm trong title + aria-label (tooltip khi rê chuột).
const PlusIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
const iconAddBtn = {
  background: "#ffd166", color: "#16181d", border: "none", borderRadius: 8,
  width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", flexShrink: 0, padding: 0,
};
// Nút sửa (task / task con) cũng dạng icon — bút chì, nền tối viền vàng để
// phân biệt với nút thêm vàng đặc; gợi ý bấm đúp giữ trong title.
const PencilIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M11.2 2.3a1.6 1.6 0 0 1 2.3 2.3L5.9 12.2 2.5 13.5l1.3-3.4L11.2 2.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const iconEditBtn = {
  background: "#2b3242", color: "#ffd166", border: "1px solid rgba(255,209,102,0.45)", borderRadius: 8,
  width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", flexShrink: 0, padding: 0,
};
const fieldStyle = {
  width: "100%", boxSizing: "border-box", background: "#0f1218", color: "#e8ecf3",
  border: "1px solid rgba(255,255,255,0.16)", borderRadius: 8, padding: "8px 10px", fontSize: 13.5,
  colorScheme: "dark",
};
const labelStyle = { display: "block", fontSize: 11.5, color: "#8b95a9", margin: "12px 0 5px", textTransform: "uppercase", letterSpacing: 0.5 };

// Form sửa task — mở bằng bấm đúp vào thanh task (hoặc nút Sửa trong panel).
// Chế độ tạo mới (isNew): cùng form nhưng tiêu đề "Thêm task", chọn người làm
// trong toàn bộ nhân viên (người chưa trong nhóm sẽ tự được thêm vào project
// khi lưu), task mới bắt đầu với 0 task con.
function TaskForm({ project, task, isNew, onClose, onSave }) {
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
    if (isNew && !PEOPLE.length) { setError("Chưa có nhân viên nào — thêm nhân viên ở Quản lý trước."); return; }
    if (!assigneeId) { setError("Chưa chọn người làm."); return; }
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
          <div style={{ fontWeight: 700, fontSize: 15 }}>{isNew ? "Thêm task" : "Sửa task"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8b95a9", fontSize: 17, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ fontSize: 12, color: "#8b95a9", marginTop: 2 }}>Project: {project.name}</div>

        <label style={labelStyle}>Tên task</label>
        <input style={fieldStyle} value={name} onChange={(ev) => setName(ev.target.value)} placeholder="Tên công việc…" />
        <label style={labelStyle}>Người làm</label>
        <select style={fieldStyle} value={assigneeId} onChange={(ev) => setAssigneeId(ev.target.value)}>
          {isNew && !PEOPLE.length && <option value="">Chưa có nhân viên — thêm ở Quản lý</option>}
          {(isNew ? PEOPLE : project.members.map((pid) => personById(pid))).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
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
        {!isNew && <div style={{ fontSize: 12, color: "#8b95a9", marginTop: 8 }}>Task con sẽ tự co/giãn theo khoảng thời gian mới của task.</div>}
        {isNew && <div style={{ fontSize: 12, color: "#8b95a9", marginTop: 8 }}>Task mới bắt đầu với 0 task con; thêm task con ở bước tiếp theo. Người làm chưa trong nhóm sẽ tự được thêm vào dự án.</div>}
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

// Form sửa task con — mở bằng bấm đúp vào thanh task con (hoặc nút Sửa
// task con trong panel). Task con có nội dung riêng: tên đầu việc, mô tả
// chi tiết, khoảng ngày, tiến độ. Ràng buộc: phải nằm gọn trong task chính
// và không được chồng lên task con khác của cùng task chính.
function SubtaskForm({ project, task, sub, isNew, onClose, onSave }) {
  const [name, setName] = useState(sub.name);
  const [note, setNote] = useState(sub.note || "");
  const [startISO, setStartISO] = useState(isoOf(sub.start));
  const [endISO, setEndISO] = useState(isoOf(sub.end));
  const [progress, setProgress] = useState(Math.round((sub.progress || 0) * 100));
  const [error, setError] = useState(null);

  const submit = () => {
    const s = dayOfISO(startISO), e = dayOfISO(endISO);
    if (s == null || e == null) { setError("Ngày chưa hợp lệ."); return; }
    if (e <= s) { setError("Ngày kết thúc phải sau ngày bắt đầu."); return; }
    if (!name.trim()) { setError("Tên task con không được để trống."); return; }
    if (s < task.start || e > task.end) {
      setError(`Task con phải nằm trong khoảng của task chính "${task.name}" (${fmtDay(task.start)} → ${fmtDay(task.end)}).`);
      return;
    }
    const clash = task.subtasks.find((o) => o.id !== sub.id && s < o.end && o.start < e);
    if (clash) {
      setError(`Chồng lên task con "${clash.name}" (${fmtDay(clash.start)} → ${fmtDay(clash.end)}) — các đầu việc của cùng một task không được trùng nhau.`);
      return;
    }
    onSave({ name: name.trim(), note: note.trim(), start: s, end: e, progress: progress / 100 });
  };

  // Số ngày hoàn thành — tính sống theo 2 ô ngày đang nhập
  const sDay = dayOfISO(startISO), eDay = dayOfISO(endISO);
  const durDays = sDay != null && eDay != null ? eDay - sDay : null;

  return (
    <div onClick={(ev) => { if (ev.target === ev.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 20, background: "rgba(4,6,10,0.62)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 483, maxWidth: "92vw", background: "#171b24", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: 18, boxShadow: "0 18px 48px rgba(0,0,0,0.55)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{isNew ? "Thêm task con" : "Sửa task con"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8b95a9", fontSize: 17, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ fontSize: 12, color: "#8b95a9", marginTop: 2 }}>{project.name} › {task.name} · Người làm: {personById(task.assigneeId).name}</div>

        <label style={labelStyle}>Tên đầu việc</label>
        <input style={fieldStyle} value={name} onChange={(ev) => setName(ev.target.value)} placeholder="Tên đầu việc…" />
        <label style={labelStyle}>Nội dung chi tiết</label>
        <textarea style={{ ...fieldStyle, resize: "vertical", minHeight: 64, fontFamily: "inherit", lineHeight: 1.5 }} rows={3}
          value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="Mô tả nội dung công việc, yêu cầu, sản phẩm bàn giao…" />
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, background: "rgba(126,226,168,0.08)", border: "1px solid rgba(126,226,168,0.35)", borderRadius: 8, padding: "7px 10px", fontSize: 13 }}>
          <span style={{ color: "#8b95a9" }}>Số ngày hoàn thành:</span>
          <b style={{ color: "#7ee2a8", fontSize: 15 }}>{durDays != null && durDays > 0 ? `${durDays} ngày` : "—"}</b>
          {durDays != null && durDays > 0 && <span style={{ color: "#8b95a9" }}>({fmtDay(sDay)} → {fmtDay(eDay)})</span>}
        </div>
        <div style={{ fontSize: 12, color: "#8b95a9", marginTop: 6 }}>Phải nằm trong task chính: {fmtDay(task.start)} → {fmtDay(task.end)}</div>
        <label style={labelStyle}>Tiến độ: {progress}%</label>
        <input type="range" min="0" max="100" value={progress} onChange={(ev) => setProgress(+ev.target.value)} style={{ width: "100%", accentColor: "#ffd166" }} />
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
  const [creating, setCreating] = useState(null);
  const [creatingSub, setCreatingSub] = useState(null);
  const [managing, setManaging] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  // Dữ liệu thay đổi từ panel Quản lý (hoặc form sửa): lưu bền + dọn các
  // lựa chọn đang trỏ tới dữ liệu không còn tồn tại.
  const handleDataChanged = () => {
    setDataVersion((v) => v + 1);
    setSel((cur) => (cur && PROJECTS.some((p) => p.id === cur.project.id) ? cur : null));
    setFocusId((cur) => (PROJECTS.some((p) => p.id === cur) ? cur : null));
    setSoloId((cur) => (PROJECTS.some((p) => p.id === cur) ? cur : null));
    setFilterPersonId((cur) => (PEOPLE.some((p) => p.id === cur) ? cur : null));
  };
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
    saveData();
    setSel({ project, task });
    setDataVersion((v) => v + 1);
    setEditing(null);
  };
  // Lưu form thêm task: task mới vào project, người làm chưa trong nhóm thì
  // tự thêm vào nhóm; project tự nới span nếu task vượt ra ngoài.
  const handleCreateTask = ({ name, assigneeId, start, end, progress }) => {
    const { project } = creating;
    const task = {
      id: nextTaskId(project), name, assigneeId, start, end, progress, subtasks: [],
    };
    project.tasks.push(task);
    if (!project.members.includes(assigneeId)) project.members.push(assigneeId);
    project.start = Math.min(project.start, start);
    project.end = Math.max(project.end, end);
    saveData();
    setSel({ project, task });
    setDataVersion((v) => v + 1);
    setCreating(null);
  };
  // Khe trống đầu tiên đủ len ngày cho task con mới (khoảng nửa-mở [start, end)
  // như quy tắc chồng lấn hiện tại): quét các task con đã xếp theo thời gian.
  const firstFreeSubtaskSlot = (task, len = 3) => {
    const sorted = [...task.subtasks].sort((a, b) => a.start - b.start);
    let cursor = task.start;
    for (const s of sorted) {
      if (s.start - cursor >= len) return [cursor, cursor + len];
      cursor = Math.max(cursor, s.end);
    }
    if (task.end - cursor >= len) return [cursor, cursor + len];
    return [task.start, Math.min(task.end, task.start + 2)];
  };
  // Lưu form thêm task con: task con mới vào task chính, lưu bền ngay.
  const handleCreateSub = ({ name, note, start, end, progress }) => {
    const { project, task } = creatingSub;
    const sub = { id: nextSubtaskId(task), name, note, start, end, progress };
    task.subtasks.push(sub);
    saveData();
    setSel({ project, task, sub });
    setDataVersion((v) => v + 1);
    setCreatingSub(null);
  };
  // Lưu form sửa task con: ghi thẳng vào subtask đang chọn
  const handleSaveSub = ({ name, note, start, end, progress }) => {
    const { project, task, sub } = editing;
    Object.assign(sub, { name, note, start, end, progress });
    saveData();
    setSel({ project, task, sub });
    setDataVersion((v) => v + 1);
    setEditing(null);
  };

  const btn = {
    background: "#232936", color: "#e8ecf3", border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer",
  };
  // Nút icon cho thanh menu trên — nhãn đầy đủ nằm trong tooltip
  const I = ({ children }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>{children}</svg>
  );
  const iconBtn = {
    ...btn, width: 34, height: 34, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 9,
  };
  const ZoomInIcon = () => (<I><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></I>);
  const ZoomOutIcon = () => (<I><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /><line x1="8" y1="11" x2="14" y2="11" /></I>);
  const TodayIcon = () => (<I><rect x="3" y="5" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="16" y1="3" x2="16" y2="7" /><circle cx="12" cy="15.5" r="1.5" fill="currentColor" stroke="none" /></I>);
  const FitIcon = () => (<I><path d="M9 4H5a1 1 0 0 0-1 1v4" /><path d="M15 4h4a1 1 0 0 1 1 1v4" /><path d="M20 15v4a1 1 0 0 1-1 1h-4" /><path d="M4 15v4a1 1 0 0 0 1 1h4" /></I>);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#11141a", color: "#e8ecf3" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.09)", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Timeline Projects</div>
          <div style={{ fontSize: 12, color: "#8b95a9" }}>{PROJECTS.length} dự án · {PEOPLE.length} nhân viên · dữ liệu lưu ở trình duyệt</div>
        </div>
        <button onClick={() => setManaging(true)} title="Thêm/xóa nhân viên và dự án"
          style={{ background: "#2b3242", color: "#ffd166", border: "1px solid rgba(255,209,102,0.5)", borderRadius: 9, padding: "0 14px", height: 34, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
          Quản lý
        </button>
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
          <button style={iconBtn} title="Phóng to" aria-label="Phóng to" onClick={() => controlsRef.current?.zoomStep(1.5)}><ZoomInIcon /></button>
          <button style={iconBtn} title="Thu nhỏ" aria-label="Thu nhỏ" onClick={() => controlsRef.current?.zoomStep(1 / 1.5)}><ZoomOutIcon /></button>
          <button style={iconBtn} title="Về hôm nay" aria-label="Về hôm nay" onClick={() => controlsRef.current?.today()}><TodayIcon /></button>
          <button style={iconBtn} title="Toàn cảnh" aria-label="Toàn cảnh" onClick={() => controlsRef.current?.fit()}><FitIcon /></button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <main style={{ position: "relative", flex: 1, minWidth: 0 }}>
        <Timeline projects={PROJECTS} selectedId={sel?.task?.id || null} onSelect={setSel} hudRef={hudRef} controlsRef={controlsRef}
          focusedId={focusId} onLabelClick={handleLabelClick} onClearFocus={() => setFocusId(null)}
          onEditTask={(p, t, s) => setEditing(s ? { kind: "sub", project: p, task: t, sub: s } : { kind: "task", project: p, task: t })} dataVersion={dataVersion}
          filterPersonId={filterPersonId} onPersonFilter={handlePersonFilter}
          soloProjectId={soloId} onProjectSolo={handleProjectSolo}
          onEscape={() => { setFocusId(null); setFilterPersonId(null); setSoloId(null); }} />

        {PROJECTS.length === 0 && (
          <div style={{
            position: "absolute", top: "38%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 5,
            background: "rgba(20,24,33,0.97)", border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 14, padding: "22px 26px", textAlign: "center", boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
          }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Chưa có dự án nào</div>
            <div style={{ fontSize: 13, color: "#aeb8c8", margin: "8px 0 14px", lineHeight: 1.6 }}>
              Dữ liệu demo đã được reset. Thêm nhân viên và dự án để bắt đầu quản lý thật.
            </div>
            <button onClick={() => setManaging(true)}
              style={{ background: "#ffd166", color: "#16181d", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Mở Quản lý
            </button>
          </div>
        )}

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
                <div style={{ fontWeight: 700, fontSize: 15, margin: "4px 0 0" }}>{sel.task.name}{sel.sub ? ` › ${sel.sub.name}` : ""}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "1.5rem 0 6px" }}>
                  <div style={{ fontSize: 11, color: "#8b95a9", textTransform: "uppercase", letterSpacing: 0.6 }}>Task con ({sel.task.subtasks.length}) — bấm để chọn</div>
                  <button onClick={() => setCreatingSub({ project: sel.project, task: sel.task })}
                    title="Thêm task con" aria-label="Thêm task con" style={iconAddBtn}>
                    <PlusIcon />
                  </button>
                </div>
                {sel.task.subtasks.map((s) => (
                  <div key={s.id} onClick={() => setSel({ project: sel.project, task: sel.task, sub: s })} title="Bấm để chọn task con này"
                    style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "3px 4px", borderTop: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", borderRadius: 4, background: sel.sub?.id === s.id ? "rgba(255,209,102,0.1)" : "transparent", color: sel.sub?.id === s.id ? "#ffd166" : "inherit" }}>
                    <span>{s.name} · {Math.round((s.progress || 0) * 100)}%</span><span style={{ color: "#8b95a9" }}>{fmtDay(s.start)} → {fmtDay(s.end)}</span>
                  </div>
                ))}
                {sel.sub && (
                  <div style={{ background: "rgba(255,209,102,0.07)", border: "1px solid rgba(255,209,102,0.3)", borderRadius: 10, padding: "10px 12px", margin: "1.5rem 0 0" }}>
                    <div style={{ fontSize: 11, color: "#ffd166", textTransform: "uppercase", letterSpacing: 0.6 }}>Task con đang chọn</div>
                    <div style={{ fontWeight: 700, fontSize: 14, margin: "3px 0 4px" }}>{sel.sub.name}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.7 }}>
                      <div>Thời gian: {fmtDay(sel.sub.start)} → {fmtDay(sel.sub.end)} · {sel.sub.end - sel.sub.start} ngày</div>
                      <div>Tiến độ: {Math.round((sel.sub.progress || 0) * 100)}%</div>
                      {sel.sub.note && <div style={{ color: "#c6cdd9" }}>Nội dung: {sel.sub.note}</div>}
                    </div>
                    <button onClick={() => setEditing({ kind: "sub", project: sel.project, task: sel.task, sub: sel.sub })}
                      title="Sửa task con (hoặc bấm đúp vào thanh task con)" aria-label="Sửa task con"
                      style={{ ...iconEditBtn, marginTop: 8 }}>
                      <PencilIcon />
                    </button>
                  </div>
                )}
                <div style={{ fontSize: 11, color: "#8b95a9", textTransform: "uppercase", letterSpacing: 0.6, margin: "1.5rem 0 6px" }}>Nội dung task</div>
                <div style={{ fontSize: 13, lineHeight: 1.9 }}>
                  <div>Người làm: <b>{personById(sel.task.assigneeId).name}</b></div>
                  <div>Thời gian: {fmtDay(sel.task.start)} → {fmtDay(sel.task.end)}</div>
                  <div>Tiến độ: {Math.round(sel.task.progress * 100)}%</div>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.12)", margin: "8px 0 12px" }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${sel.task.progress * 100}%`, background: personById(sel.task.assigneeId).color }} />
                </div>
                <button onClick={() => setEditing({ kind: "task", project: sel.project, task: sel.task })}
                  title="Sửa task (hoặc bấm đúp vào thanh task)" aria-label="Sửa task"
                  style={{ ...iconEditBtn, margin: "2px 8px 4px 0" }}>
                  <PencilIcon />
                </button>
                <button onClick={() => setCreating({ project: sel.project })}
                  title="Thêm task mới" aria-label="Thêm task mới" style={{ ...iconAddBtn, margin: "2px 0 4px" }}>
                  <PlusIcon />
                </button>
              </>
            ) : (
              <div style={{ fontSize: 13, lineHeight: 1.9, marginTop: 4 }}>
                <div>Thời gian: {fmtDay(sel.project.start)} → {fmtDay(sel.project.end)}</div>
                <div>Số task: {sel.project.tasks.length} · Số người: {sel.project.members.length}</div>
                <div style={{ color: "#8b95a9" }}>Phóng to thêm để xem từng task của project này.</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <button onClick={() => setCreating({ project: sel.project })}
                    title="Thêm task" aria-label="Thêm task" style={iconAddBtn}>
                    <PlusIcon />
                  </button>
                  <button onClick={() => enterSolo(sel.project)}
                    style={{ background: "#2b3242", color: "#8ab8ff", border: "1px solid rgba(138,184,255,0.45)", borderRadius: 8, padding: "6px 12px", fontSize: 12.5, cursor: "pointer" }}>
                    Tập trung vào dự án này — mở chi tiết
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}

        <footer style={{
          position: "absolute", left: 14, bottom: 12, zIndex: 6, pointerEvents: "none",
          background: "rgba(16,19,26,0.9)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#aeb8c8",
        }}>
          Lăn chuột: zoom về con trỏ · Kéo nền: pan (có quán tính) · Kéo thanh task: dời task · Kéo mép thanh task: đổi thời lượng (task con co/giãn theo) · Kéo thanh tổng ở mức thu nhỏ: dời cả project, kéo mép của nó: co/giãn cả project · Click tên project: nổi bật (xung quanh chuyển xám) · Bấm đúp vào task/task con: mở form sửa nội dung · Nút ＋ trong panel dự án: thêm task mới, gán người làm · Icon phễu cạnh tên nhân viên: lọc riêng nhân viên đó · Icon khung ngắm ở cuối tên công trình: tập trung vào dự án, chia đôi màn hình xem chi tiết
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

      {editing?.kind === "task" && (
        <TaskForm key={editing.task.id} project={editing.project} task={editing.task}
          onClose={() => setEditing(null)} onSave={handleSaveEdit} />
      )}
      {creating && (
        <TaskForm key="new-task" project={creating.project} isNew
          task={{
            id: "__new__", name: "", assigneeId: PEOPLE[0]?.id || "",
            start: creating.project.start, end: Math.min(creating.project.end, creating.project.start + 13),
            progress: 0, subtasks: [],
          }}
          onClose={() => setCreating(null)} onSave={handleCreateTask} />
      )}
      {editing?.kind === "sub" && (
        <SubtaskForm key={editing.sub.id} project={editing.project} task={editing.task} sub={editing.sub}
          onClose={() => setEditing(null)} onSave={handleSaveSub} />
      )}
      {creatingSub && (() => {
        const [s, e] = firstFreeSubtaskSlot(creatingSub.task);
        return (
          <SubtaskForm key="new-sub" project={creatingSub.project} task={creatingSub.task} isNew
            sub={{ id: "__new__", name: "", note: "", start: s, end: e, progress: 0 }}
            onClose={() => setCreatingSub(null)} onSave={handleCreateSub} />
        );
      })()}
      {managing && (
        <ManageModal onClose={() => setManaging(false)} onChanged={handleDataChanged}
          onAddTask={(pr) => { setManaging(false); setCreating({ project: pr }); }} />
      )}
    </div>
  );
}
