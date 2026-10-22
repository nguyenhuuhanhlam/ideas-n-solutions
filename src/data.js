// Dữ liệu giả cho bản mẫu timeline — 100 project, mỗi project <= 20 task,
// task chạy song song, mỗi task giao cho 1 người trong nhóm của project.
// Thời gian được giữ dạng "số ngày" (ngày Julian rút gọn = UTC day number) để
// phép biến đổi zoom/pan chỉ là toán số học đơn giản.

export const DAY_MS = 86400000;
export const dayNum = (y, m, d) => Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
export const TODAY = dayNum(2026, 10, 22);

export function fmtDay(day) {
  const dt = new Date(day * DAY_MS);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(dt.getUTCDate())}-${p(dt.getUTCMonth() + 1)}-${dt.getUTCFullYear()}`;
}
export function fmtDayShort(day) {
  const dt = new Date(day * DAY_MS);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(dt.getUTCDate())}/${p(dt.getUTCMonth() + 1)}`;
}

// RNG có seed cố định để dữ liệu ổn định giữa các lần tải
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261022);
const ri = (min, max) => min + Math.floor(rand() * (max - min + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
function sample(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
}

export const PEOPLE = [
  "Nguyễn Văn An", "Trần Thị Bình", "Lê Hoàng Cường", "Phạm Thu Dung",
  "Hoàng Văn Đức", "Võ Thị Hà", "Đặng Minh Hải", "Bùi Ngọc Hạnh",
  "Đỗ Văn Hùng", "Ngô Thị Hương", "Vũ Đình Khánh", "Lý Thị Lan",
  "Trịnh Văn Long", "Phan Thị Mai", "Dương Văn Nam", "Chu Thị Nga",
  "Huỳnh Văn Phát", "Tạ Thị Phương", "Lương Minh Quân", "Đinh Thị Sen",
].map((name, i) => ({ id: `p${i + 1}`, name, color: `hsl(${Math.round((i * 137.5) % 360)} 65% 58%)` }));

const TASK_NAMES = [
  "Khảo sát hiện trạng", "Thiết kế cơ sở", "Thiết kế kỹ thuật", "Lập dự toán",
  "Thẩm tra hồ sơ", "Xin phép xây dựng", "Thi công móng", "Thi công kết cấu",
  "Lắp đặt thiết bị", "Đấu nối điện - nước", "Hoàn thiện nội thất", "Chạy thử hệ thống",
  "Nghiệm thu từng phần", "Bàn giao hồ sơ", "Đào tạo vận hành", "Bảo trì định kỳ",
  "Giám sát hiện trường", "Kiểm định chất lượng", "Xử lý sự cố", "Tổng kết dự án",
];
const SUB_NAMES = ["Chuẩn bị", "Thực hiện chính", "Kiểm tra", "Hoàn thiện", "Bàn giao"];

const PROJ_TYPES = ["Cấp nước", "Xử lý nước thải", "Khu dân cư", "Nhà máy", "Trường học", "Bệnh viện", "Cầu đường", "Khu công nghiệp", "Chung cư", "Trạm bơm"];
const PROJ_LOCS = ["An Bình", "Sông Hậu", "Long An", "Tiền Giang", "Vĩnh Long", "Cần Thơ", "Đồng Tháp", "Hậu Giang", "Sóc Trăng", "Bến Tre"];

const BASE = dayNum(2026, 1, 5); // Thứ Hai

function makeSubtasks(task) {
  const n = ri(2, 5);
  const weights = Array.from({ length: n }, () => 0.6 + rand());
  const total = weights.reduce((a, b) => a + b, 0);
  const dur = task.end - task.start;
  let cursor = task.start;
  return weights.map((w, i) => {
    const len = i === n - 1 ? task.end - cursor : Math.max(1, Math.round((dur * w) / total));
    const sub = { id: `${task.id}s${i + 1}`, name: SUB_NAMES[i % SUB_NAMES.length], start: cursor, end: Math.min(task.end, cursor + len) };
    cursor = sub.end;
    return sub;
  });
}

export const PROJECTS = [];
let seq = 0;
for (const type of PROJ_TYPES) {
  for (const loc of PROJ_LOCS) {
    seq += 1;
    const start = BASE + ri(0, 290);
    const duration = ri(70, 240);
    const end = start + duration;
    const members = sample(PEOPLE, ri(3, 6));
    const taskCount = ri(10, 20);
    const names = sample(TASK_NAMES, taskCount);
    const tasks = names.map((name, ti) => {
      // Phân tầng đều theo thời lượng project để giai đoạn nào cũng có task,
      // zoom vào khoảng thời gian nào trong project cũng thấy việc.
      const seg = duration / taskCount;
      const tStart = start + Math.floor(ti * seg) + ri(0, Math.max(1, Math.floor(seg) - 8));
      const tEnd = Math.min(end, tStart + ri(10, 42));
      const task = {
        id: `pr${seq}t${ti + 1}`,
        name,
        start: tStart,
        end: tEnd,
        assigneeId: pick(members).id,
        progress:
          tEnd <= TODAY ? ri(88, 100) / 100 :
          tStart >= TODAY ? 0 :
          Math.round(((TODAY - tStart) / (tEnd - tStart)) * 100) / 100,
      };
      task.subtasks = makeSubtasks(task);
      return task;
    });
    tasks.sort((a, b) => a.start - b.start);
    PROJECTS.push({
      id: `pr${seq}`,
      name: `${type} ${loc}`,
      color: `hsl(${Math.round(((seq * 47) % 360))} 55% 52%)`,
      start, end, members: members.map((m) => m.id), tasks,
    });
  }
}
// Sắp xếp để lần mở đầu nhìn thấy ngay các project đang chạy quanh hôm nay:
// đang hoạt động (bao hôm nay) trước -> sắp diễn ra -> đã kết thúc.
PROJECTS.sort((a, b) => {
  const rank = (p) => (p.start <= TODAY && TODAY <= p.end ? 0 : p.start > TODAY ? 1 : 2);
  const ra = rank(a), rb = rank(b);
  if (ra !== rb) return ra - rb;
  if (ra === 1) return a.start - b.start;
  if (ra === 2) return b.end - a.end;
  return a.end - b.end;
});

export const personById = (id) => PEOPLE.find((p) => p.id === id);
export const DATA_MIN = Math.min(...PROJECTS.map((p) => p.start));
export const DATA_MAX = Math.max(...PROJECTS.map((p) => p.end));
