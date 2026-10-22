import { useRef, useState } from "react";
import Timeline from "./Timeline";
import { PROJECTS, fmtDay, personById } from "./data";

export default function App() {
  const [sel, setSel] = useState(null);
  const hudRef = useRef(null);
  const controlsRef = useRef(null);

  const btn = {
    background: "#232936", color: "#e8ecf3", border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#11141a", color: "#e8ecf3" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.09)", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Timeline Projects — bản mẫu test</div>
          <div style={{ fontSize: 12, color: "#8b95a9" }}>100 project xếp lớp trên 1 trục thời gian · dữ liệu giả · task song song theo người làm</div>
        </div>
        <span ref={hudRef} style={{ fontSize: 12, color: "#aeb8c8", whiteSpace: "nowrap", marginLeft: "auto" }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={btn} onClick={() => controlsRef.current?.zoomStep(1.5)}>Phóng to</button>
          <button style={btn} onClick={() => controlsRef.current?.zoomStep(1 / 1.5)}>Thu nhỏ</button>
          <button style={btn} onClick={() => controlsRef.current?.today()}>Về hôm nay</button>
          <button style={btn} onClick={() => controlsRef.current?.fit()}>Toàn cảnh</button>
        </div>
      </header>

      <main style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <Timeline projects={PROJECTS} selectedId={sel?.task?.id || null} onSelect={setSel} hudRef={hudRef} controlsRef={controlsRef} />

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
              </div>
            )}
          </aside>
        )}

        <footer style={{
          position: "absolute", left: 14, bottom: 12, zIndex: 6, pointerEvents: "none",
          background: "rgba(16,19,26,0.9)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#aeb8c8",
        }}>
          Lăn chuột: zoom về con trỏ · Kéo nền: pan (thả ra có quán tính) · Kéo thanh task: dời task · Double-click: phóng to · Click: xem chi tiết
        </footer>
      </main>
    </div>
  );
}
