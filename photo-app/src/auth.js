// Đăng nhập tạm thời cho bản kiểm tra lưu trữ ảnh.
//
// Cơ chế: so sánh tên đăng nhập + hash SHA-256 của mật khẩu, hoàn toàn ở
// phía trình duyệt; đăng nhập xong thì nhớ trong localStorage.
// Đây KHÔNG phải bảo mật thật: app là trang tĩnh, ai đọc code cũng có thể
// qua được cổng này và gọi thẳng API Cloudinary. Nó chỉ chặn người lạ
// tình cờ mở link. Khi cần bảo mật thật thì phải có backend + đăng nhập
// phía server, và chuyển sang upload có chữ ký.
//
// Đổi mật khẩu: tính hash mới bằng `printf '%s' 'mat-khau-moi' | sha256sum`
// rồi thay AUTH_PASS_HASH dưới đây.
export const AUTH_USER = 'admin'
export const AUTH_PASS_HASH =
  '038d1698d8df09e2fe204f41194ca1cf1957807461f877186488197ca733cc83'

const KEY = 'photo-app-auth-v1'

export function isAuthed() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function setAuthed(value) {
  try {
    if (value) localStorage.setItem(KEY, '1')
    else localStorage.removeItem(KEY)
  } catch {
    // Bỏ qua khi trình duyệt chặn storage.
  }
}

export async function verifyCredentials(user, pass) {
  if (user.trim() !== AUTH_USER) return false
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(pass),
  )
  const hex = [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return hex === AUTH_PASS_HASH
}
