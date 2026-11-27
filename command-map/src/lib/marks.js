// Đánh dấu màu cho node — dùng để lưu ý các lệnh hay dùng.
// Node lưu `mark` là key dưới đây (hoặc null). Màu lấy theo token của kit
// (biến CSS cho giao diện DOM, cặp hex sáng/tối cho canvas).
export const MARK_OPTIONS = [
  { key: 'red', label: 'Đỏ', varName: '--red', light: '#dc2626', dark: '#f87171' },
  { key: 'orange', label: 'Cam', varName: '--orange', light: '#ea580c', dark: '#fb923c' },
  { key: 'amber', label: 'Vàng', varName: '--amber', light: '#d97706', dark: '#fbbf24' },
  { key: 'green', label: 'Lục', varName: '--green', light: '#16a34a', dark: '#4ade80' },
  { key: 'blue', label: 'Dương', varName: '--blue', light: '#2563eb', dark: '#60a5fa' },
  { key: 'purple', label: 'Tím', varName: '--purple', light: '#9333ea', dark: '#c084fc' },
]

export const markHex = (key, dark) => {
  const m = MARK_OPTIONS.find((x) => x.key === key)
  return m ? (dark ? m.dark : m.light) : null
}
