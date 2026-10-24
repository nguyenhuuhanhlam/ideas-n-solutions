import { useState } from "react";
import { fmtDay, fmtDayShort, personById } from "./data";
import { getProjectDetail, projectStatus, taskStatus, overallProgress } from "./projectDetails";

// Panel chi tiết dự án — nửa phải màn hình trong chế độ tập trung vào 1 dự án.
// Nhiều kiểu dữ liệu: văn bản tổng quan, bảng công việc, bảng nhân sự,
// danh sách hồ sơ/file và biểu đồ (đường cong tiến độ, khối lượng, trạng thái).

const TABS = [
  { id: "overview", label: "Tổng quan" },
  { id: "tasks", label: "Công việc" },
  { id: "people", label: "Nhân sự" },
  { id: "files", label: "Hồ sơ" },
  { id: "charts", label: "Biểu đồ" },
];

const th = { textAlign: "left", fontSize: 11, color: "#8b95a9", textTransform: "uppercase", letterSpacing: 0.5, padding: "7px 8px", borderBottom: "1px solid rgba(255,255,255,0.12)", whiteSpace: "nowrap" };
const td = { fontSize: 12.5, padding: "7px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", verticalAlign: "middle" };

function Chip({ color, children }) {
  return (
    <span style={{ color, border: `1px solid ${color}66`, background: `${color}1a`, borderRadius: 999, padding: "2px 9px", fontSize: 11.5, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function SCurve({ months }) {
  const W = 520, H = 190, PL = 34, PR = 8, PT = 10, PB = 22;
  const iw = W - PL - PR, ih = H - PT - PB;
  const n = Math.max(1, months.length - 1);
  const X = (i) => PL + (i / n) * iw;
  const Y = (v) => PT + (1 - v) * ih;
  const line = (key) => months.map((m, i) => (m[key] == null ? null : `${X(i)},${Y(m[key])}`)).filter(Boolean).join(" ");
  const actualPts = months.map((m, i) => (m.actual == null ? null : [X(i), Y(m.actual)])).filter(Boolean);
  const area = actualPts.length ? `${PL},${Y(0)} ${actualPts.map((p) => p.join(",")).join(" ")} ${actualPts[actualPts.length - 1][0]},${Y(0)}` : "";
  const step = Math.max(1, Math.ceil(months.length / 6));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={PL} x2={W - PR} y1={Y(v)} y2={Y(v)} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 4" />
          <text x={PL - 5} y={Y(v) + 3} fill="#8b95a9" fontSize="9.5" textAnchor="end">{Math.round(v * 100)}%</text>
        </g>
      ))}
      {months.map((m, i) => (i % step === 0 ? (
        <text key={i} x={X(i)} y={H - 6} fill="#8b95a9" fontSize="9.5" textAnchor="middle">{fmtDayShort(m.day)}</text>
      ) : null))}
      <polyline points={line("planned")} fill="none" stroke="#8b95a9" strokeWidth="1.6" strokeDasharray="5 4" />
      {area && <polygon points={area} fill="rgba(255,209,102,0.13)" />}
      {actualPts.length > 0 && <polyline points={line("actual")} fill="none" stroke="#ffd166" strokeWidth="2.2" />}
    </svg>
  );
}

function Donut({ counts }) {
  const total = Math.max(1, counts.done + counts.doing + counts.todo);
  const R = 52, C = 2 * Math.PI * R;
  const parts = [
    { v: counts.done, color: "#7ee2a8", label: "Hoàn thành" },
    { v: counts.doing, color: "#ffd166", label: "Đang làm" },
    { v: counts.todo, color: "#5b6577", label: "Chưa bắt đầu" },
  ];
  let acc = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <svg viewBox="0 0 130 130" style={{ width: 118, flexShrink: 0 }}>
        <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="15" />
        {parts.map((p) => {
          const frac = p.v / total;
          const el = (
            <circle key={p.label} cx="65" cy="65" r={R} fill="none" stroke={p.color} strokeWidth="15"
              strokeDasharray={`${Math.max(0, frac * C - 2)} ${C}`}
              strokeDashoffset={-acc * C} transform="rotate(-90 65 65)" />
          );
          acc += frac;
          return el;
        })}
        <text x="65" y="61" fill="#e8ecf3" fontSize="19" fontWeight="700" textAnchor="middle">{total}</text>
        <text x="65" y="78" fill="#8b95a9" fontSize="9.5" textAnchor="middle">công việc</text>
      </svg>
      <div style={{ fontSize: 12.5, lineHeight: 2 }}>
        {parts.map((p) => (
          <div key={p.label}><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 2, background: p.color, marginRight: 7 }} />{p.label}: <b>{p.v}</b></div>
        ))}
      </div>
    </div>
  );
}

const KIND_COLORS = { PDF: "#e5534b", DWG: "#8ab8ff", XLSX: "#46c07a", DOCX: "#5aa2ff", JPG: "#e2b93d" };

export default function ProjectWorkspace({ project: p, selectedTaskId, onClose, onSelectTask, onFilterPerson, filterPersonId }) {
  const [tab, setTab] = useState("overview");
  const d = getProjectDetail(p);
  const st = projectStatus(p);
  const prog = overallProgress(p);

  const infoRow = (k, v) => (
    <div style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
      <span style={{ width: 128, flexShrink: 0, color: "#8b95a9" }}>{k}</span><span>{v}</span>
    </div>
  );

  return (
    <aside style={{
      width: "min(600px, 47%)", minWidth: 430, flexShrink: 0, height: "100%", overflowY: "auto",
      background: "#14181f", borderLeft: "1px solid rgba(255,255,255,0.12)", padding: "16px 18px 28px",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "#8b95a9", textTransform: "uppercase", letterSpacing: 0.6 }}>Không gian dự án</div>
          <div style={{ fontWeight: 700, fontSize: 19, margin: "3px 0 6px" }}>{p.name}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Chip color={st.color}>{st.label}</Chip>
            <span style={{ fontSize: 12.5, color: "#aeb8c8" }}>{fmtDay(p.start)} → {fmtDay(p.end)}</span>
            <span style={{ fontSize: 12.5, color: "#aeb8c8" }}>· {p.tasks.length} công việc · {p.members.length} nhân viên · {d.files.length} hồ sơ</span>
          </div>
        </div>
        <button onClick={onClose} title="Thoát chế độ tập trung"
          style={{ background: "#232936", border: "1px solid rgba(255,255,255,0.14)", color: "#e8ecf3", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 15, flexShrink: 0 }}>×</button>
      </div>

      <div style={{ margin: "14px 0 4px", display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#aeb8c8" }}>
        <span>Tiến độ tổng thể</span><b style={{ color: "#e8ecf3" }}>{Math.round(prog * 100)}%</b>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)" }}>
        <div style={{ height: "100%", width: `${prog * 100}%`, borderRadius: 4, background: p.color }} />
      </div>

      <div style={{ display: "flex", gap: 4, margin: "16px 0 6px", borderBottom: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? "#232936" : "transparent", color: tab === t.id ? "#ffd166" : "#aeb8c8",
              border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none", borderRadius: "8px 8px 0 0",
              padding: "7px 13px", fontSize: 13, cursor: "pointer",
            }}>
            {t.label}{t.id === "tasks" ? ` (${p.tasks.length})` : t.id === "people" ? ` (${p.members.length})` : t.id === "files" ? ` (${d.files.length})` : ""}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "#d5dbe6", margin: "10px 0 6px" }}>{d.description}</p>
          {infoRow("Số hợp đồng", d.contractNo)}
          {infoRow("Chủ đầu tư", d.investor)}
          {infoRow("Nhà thầu chính", d.contractor)}
          {infoRow("Tư vấn giám sát", d.supervisor)}
          {infoRow("Giá trị hợp đồng", d.contractValue)}
          {infoRow("Khởi công", fmtDay(p.start))}
          {infoRow("Hoàn thành dự kiến", fmtDay(p.end))}
          <div style={{ fontSize: 11.5, color: "#8b95a9", textTransform: "uppercase", letterSpacing: 0.6, margin: "16px 0 6px" }}>Các mốc chính</div>
          {[...p.tasks].sort((a, b) => a.end - b.end).slice(0, 4).map((t) => {
            const ts = taskStatus(t);
            return (
              <div key={t.id} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 13, padding: "5px 0" }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: ts.color, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{t.name}</span>
                <span style={{ color: "#8b95a9" }}>{fmtDay(t.end)}</span>
              </div>
            );
          })}
        </div>
      )}

      {tab === "tasks" && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 6 }}>
          <thead><tr><th style={th}>Công việc</th><th style={th}>Người làm</th><th style={th}>Bắt đầu</th><th style={th}>Kết thúc</th><th style={th}>Tiến độ</th><th style={th}>Trạng thái</th></tr></thead>
          <tbody>
            {[...p.tasks].sort((a, b) => a.start - b.start).map((t) => {
              const ts = taskStatus(t);
              const active = t.id === selectedTaskId;
              return (
                <tr key={t.id} onClick={() => onSelectTask(t)} title="Bấm để chọn task này trên timeline"
                  style={{ cursor: "pointer", background: active ? "rgba(255,209,102,0.09)" : "transparent" }}>
                  <td style={td}>{t.name}</td>
                  <td style={{ ...td, whiteSpace: "nowrap" }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: personById(t.assigneeId).color, marginRight: 6 }} />{personById(t.assigneeId).name}</td>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>{fmtDay(t.start)}</td>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>{fmtDay(t.end)}</td>
                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 52, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.12)" }}>
                        <div style={{ height: "100%", width: `${t.progress * 100}%`, borderRadius: 3, background: personById(t.assigneeId).color }} />
                      </div>
                      <span style={{ fontSize: 11.5, color: "#aeb8c8" }}>{Math.round(t.progress * 100)}%</span>
                    </div>
                  </td>
                  <td style={td}><Chip color={ts.color}>{ts.label}</Chip></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {tab === "people" && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 6 }}>
          <thead><tr><th style={th}>Nhân viên</th><th style={th}>Số task</th><th style={th}>Tổng ngày</th><th style={th}>Tiến độ TB</th><th style={th}></th></tr></thead>
          <tbody>
            {d.workload.map((w) => (
              <tr key={w.person.id}>
                <td style={td}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: w.person.color, marginRight: 6 }} />{w.person.name}</td>
                <td style={td}>{w.count}</td>
                <td style={td}>{w.days} ngày</td>
                <td style={td}>{Math.round(w.progress * 100)}%</td>
                <td style={{ ...td, textAlign: "right" }}>
                  <button onClick={() => onFilterPerson(w.person.id)}
                    style={{
                      background: filterPersonId === w.person.id ? "rgba(126,226,168,0.15)" : "#232936",
                      color: filterPersonId === w.person.id ? "#7ee2a8" : "#aeb8c8",
                      border: "1px solid rgba(255,255,255,0.14)", borderRadius: 7, padding: "4px 10px", fontSize: 12, cursor: "pointer",
                    }}>
                    {filterPersonId === w.person.id ? "Bỏ lọc" : "Lọc người này"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "files" && (
        <div style={{ marginTop: 6 }}>
          {d.files.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 2px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{
                width: 40, height: 32, borderRadius: 7, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: `${KIND_COLORS[f.kind] || "#666"}22`, color: KIND_COLORS[f.kind] || "#aaa", fontSize: 10.5, fontWeight: 700, border: `1px solid ${KIND_COLORS[f.kind] || "#666"}55`,
              }}>{f.kind}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                <div style={{ fontSize: 11.5, color: "#8b95a9" }}>{f.size} · {fmtDay(f.day)} · {f.byName}</div>
              </div>
              <span title="Bản mẫu — chưa tải thật" style={{ fontSize: 12, color: "#8ab8ff", border: "1px solid rgba(138,184,255,0.4)", borderRadius: 7, padding: "4px 10px", cursor: "pointer" }}>Tải</span>
            </div>
          ))}
          <div style={{ fontSize: 12, color: "#8b95a9", marginTop: 10 }}>Danh sách hồ sơ là dữ liệu mẫu minh họa cho bản demo.</div>
        </div>
      )}

      {tab === "charts" && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Đường cong tiến độ (S-curve)</div>
          <div style={{ fontSize: 12, color: "#8b95a9", marginBottom: 6 }}>
            <span style={{ color: "#ffd166" }}>—</span> Thực tế &nbsp; <span style={{ color: "#8b95a9" }}>- -</span> Kế hoạch (% khối lượng lũy kế theo tháng)
          </div>
          <SCurve months={d.months} />
          <div style={{ fontSize: 13, fontWeight: 600, margin: "18px 0 8px" }}>Khối lượng theo nhân viên (tổng ngày task)</div>
          {d.workload.map((w) => (
            <div key={w.person.id} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, margin: "5px 0" }}>
              <span style={{ width: 118, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.person.name}</span>
              <div style={{ flex: 1, height: 13, borderRadius: 4, background: "rgba(255,255,255,0.07)" }}>
                <div style={{ height: "100%", width: `${(w.days / Math.max(1, d.workload[0].days)) * 100}%`, borderRadius: 4, background: w.person.color }} />
              </div>
              <span style={{ width: 62, textAlign: "right", color: "#aeb8c8" }}>{w.days} ngày</span>
            </div>
          ))}
          <div style={{ fontSize: 13, fontWeight: 600, margin: "18px 0 8px" }}>Trạng thái công việc</div>
          <Donut counts={d.statusCounts} />
        </div>
      )}
    </aside>
  );
}
