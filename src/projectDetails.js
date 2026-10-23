// Dữ liệu chi tiết giả cho panel "không gian dự án" (chia đôi màn hình).
// Sinh tất định theo từng project (seed từ mã project) để mỗi lần mở giống nhau:
// thông tin tổng quan, danh sách hồ sơ/file và chuỗi tiến độ theo tháng cho biểu đồ.
import { TODAY, fmtDay, personById } from "./data";

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const INVESTORS = [
  "Ban QLDA Đầu tư Xây dựng tỉnh", "Sở Nông nghiệp & Phát triển Nông thôn",
  "UBND huyện Châu Thành", "Công ty TNHH Đầu tư Hạ tầng Mekong",
  "Ban QLDA Khu công nghiệp", "Sở Giao thông Vận tải",
  "Bệnh viện Đa khoa tỉnh", "Sở Giáo dục & Đào tạo", "Sở Tài nguyên & Môi trường",
];
const CONTRACTORS = [
  "Công ty CP Xây dựng Miền Tây", "Công ty TNHH Xây lắp Số 9",
  "Tổng công ty Xây dựng Thủy lợi 4", "Công ty CP Đầu tư Xây dựng 246",
  "Công ty TNHH Cơ điện & Xây dựng An Phát",
];
const SUPERVISORS = [
  "Công ty CP Tư vấn Giám sát ĐBSCL", "Công ty TNHH Tư vấn Thiết kế Phương Nam",
  "Viện Kỹ thuật Xây dựng Miền Nam",
];

const cache = new Map();

export function projectStatus(p) {
  if (p.end < TODAY) return { key: "done", label: "Đã hoàn thành", color: "#7ee2a8" };
  if (p.start > TODAY) return { key: "todo", label: "Chưa bắt đầu", color: "#8b95a9" };
  return { key: "doing", label: "Đang thực hiện", color: "#ffd166" };
}
export function taskStatus(t) {
  if (t.progress >= 1) return { label: "Hoàn thành", color: "#7ee2a8" };
  if (t.progress > 0) return { label: "Đang làm", color: "#ffd166" };
  return { label: "Chưa bắt đầu", color: "#8b95a9" };
}
export const overallProgress = (p) =>
  p.tasks.length ? p.tasks.reduce((a, t) => a + t.progress, 0) / p.tasks.length : 0;

export function getProjectDetail(p) {
  if (cache.has(p.id)) return cache.get(p.id);
  const seq = parseInt(p.id.replace(/\D/g, ""), 10) || 1;
  const rand = mulberry32(77000 + seq * 131);
  const ri = (min, max) => min + Math.floor(rand() * (max - min + 1));
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];

  const detail = {
    investor: pick(INVESTORS),
    contractor: pick(CONTRACTORS),
    supervisor: pick(SUPERVISORS),
    contractValue: `${ri(18, 460)}${rand() > 0.5 ? ",5" : ""} tỷ đồng`,
    contractNo: `HĐ-${String(seq).padStart(3, "0")}/2026/XD`,
    description:
      `Dự án ${p.name} thuộc chương trình đầu tư hạ tầng giai đoạn 2026–2027, gồm ${p.tasks.length} hạng mục công việc chính ` +
      `do ${p.members.length} cán bộ phụ trách. Công trình khởi công ngày ${fmtDay(p.start)}, dự kiến hoàn thành ${fmtDay(p.end)}. ` +
      `Đến nay khối lượng thực hiện đạt khoảng ${Math.round(overallProgress(p) * 100)}% so với kế hoạch, các hạng mục chính đang được ` +
      `theo dõi trực tiếp trên trục thời gian ở phía bên trái.`,
  };

  // Hồ sơ / file đính kèm — tên file suy từ chính các task của project
  const size = (min, max, unit) => `${(min + rand() * (max - min)).toFixed(1).replace(".", ",")} ${unit}`;
  const fileDay = () => p.start + Math.floor(rand() * Math.max(1, Math.min(p.end, TODAY + 45) - p.start));
  const files = [
    { name: `Hop_dong_thi_cong_${String(seq).padStart(3, "0")}.pdf`, kind: "PDF", size: size(2, 9, "MB"), day: p.start + ri(0, 6), by: p.members[0] },
    { name: "Ho_so_thiet_ke_co_so.pdf", kind: "PDF", size: size(6, 22, "MB"), day: fileDay(), by: p.members[ri(0, p.members.length - 1)] },
    { name: "Ban_ve_thi_cong_tong_the.dwg", kind: "DWG", size: size(8, 42, "MB"), day: fileDay(), by: p.members[ri(0, p.members.length - 1)] },
    { name: "Du_toan_chi_tiet.xlsx", kind: "XLSX", size: size(0.4, 3, "MB"), day: fileDay(), by: p.members[ri(0, p.members.length - 1)] },
    { name: "Ke_hoach_tien_do.docx", kind: "DOCX", size: size(0.2, 1.2, "MB"), day: fileDay(), by: p.members[0] },
  ];
  p.tasks.slice(0, 3).forEach((t, i) => {
    files.push({
      name: `Bien_ban_${t.name.toLowerCase().replaceAll(" ", "_")}.pdf`,
      kind: "PDF", size: size(0.5, 4, "MB"), day: Math.min(t.end, TODAY), by: t.assigneeId,
    });
    if (i === 0) files.push({ name: `Anh_hien_truong_${fmtDay(t.start).replaceAll("-", "")}.jpg`, kind: "JPG", size: size(2, 6, "MB"), day: t.start + 3, by: t.assigneeId });
  });
  detail.files = files
    .map((f) => ({ ...f, byName: personById(f.by)?.name || "" }))
    .sort((a, b) => b.day - a.day);

  // Chuỗi tiến độ theo tháng cho biểu đồ S-curve: kế hoạch = % task đã đến hạn
  // kết thúc; thực tế = kế hoạch x hệ số bám tiến độ hiện tại (chỉ tới hôm nay)
  const months = [];
  {
    const d0 = new Date(p.start * 86400000);
    let cur = Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth(), 1) / 86400000;
    const plannedNow = p.tasks.filter((t) => t.end <= TODAY).length / Math.max(1, p.tasks.length);
    const ratio = plannedNow > 0 ? Math.min(1.05, Math.max(0.55, overallProgress(p) / plannedNow)) : 1;
    while (cur <= p.end + 31) {
      const monthEnd = cur + 30;
      const planned = p.tasks.filter((t) => t.end <= monthEnd).length / Math.max(1, p.tasks.length);
      months.push({
        day: cur,
        planned,
        actual: monthEnd <= TODAY ? Math.min(1, planned * ratio) : null,
      });
      const nd = new Date(cur * 86400000);
      cur = Date.UTC(nd.getUTCFullYear(), nd.getUTCMonth() + 1, 1) / 86400000;
      if (months.length > 30) break;
    }
  }
  detail.months = months;

  // Khối lượng theo nhân viên: tổng số ngày task được giao
  detail.workload = p.members
    .map((pid) => {
      const ts = p.tasks.filter((t) => t.assigneeId === pid);
      return {
        person: personById(pid),
        count: ts.length,
        days: ts.reduce((a, t) => a + (t.end - t.start), 0),
        progress: ts.length ? ts.reduce((a, t) => a + t.progress, 0) / ts.length : 0,
      };
    })
    .sort((a, b) => b.days - a.days);

  detail.statusCounts = {
    done: p.tasks.filter((t) => t.progress >= 1).length,
    doing: p.tasks.filter((t) => t.progress > 0 && t.progress < 1).length,
    todo: p.tasks.filter((t) => t.progress <= 0).length,
  };

  cache.set(p.id, detail);
  return detail;
}
