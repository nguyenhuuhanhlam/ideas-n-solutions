// Firebase cho TuTi: dùng lại project dev-lab-vm của app Ahri (user chốt
// 2026-11-09). Chỉ dùng Auth (Google) + Firestore; dữ liệu TuTi nằm riêng
// trong collection `tuti_sync`, 1 doc / 1 tài khoản (id = uid).
// File này được import động (import()) nên Firebase chỉ tải khi cần đồng bộ,
// không làm nặng bundle lúc mở app.
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from './firebase-config.js'
import { SYNC_COLLECTION, packSync, unpackSync } from './sync.js'

let app = null
let auth = null
let db = null

export function initFirebase() {
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  }
  return { app, auth, db }
}

// Lắng nghe trạng thái đăng nhập; callback nhận null hoặc {uid, email, displayName}.
export function listenAuth(onChange) {
  const { auth: a } = initFirebase()
  return onAuthStateChanged(a, (user) => {
    onChange(user ? { uid: user.uid, email: user.email || '', displayName: user.displayName || '' } : null)
  })
}

export async function signInWithGoogle() {
  const { auth: a } = initFirebase()
  const cred = await signInWithPopup(a, new GoogleAuthProvider())
  const u = cred.user
  return { uid: u.uid, email: u.email || '', displayName: u.displayName || '' }
}

export async function signOutUser() {
  const { auth: a } = initFirebase()
  await signOut(a)
}

// Đọc tài liệu đồng bộ của tài khoản; null nếu chưa có gì trên mây.
export async function fetchCloud(uid) {
  const { db: d } = initFirebase()
  const snap = await getDoc(doc(d, SYNC_COLLECTION, uid))
  return snap.exists() ? unpackSync(snap.data()) : null
}

// Ghi đè toàn bộ tài liệu đồng bộ bằng dữ liệu hiện tại của máy.
export async function pushCloud(uid, data) {
  const { db: d } = initFirebase()
  await setDoc(doc(d, SYNC_COLLECTION, uid), packSync(data))
}

// Dịch mã lỗi Firebase/Auth/Firestore sang tiếng Việt dễ hiểu.
export function syncErrorText(e) {
  const code = (e && e.code) || ''
  if (code === 'auth/popup-closed-by-user') return 'Bạn đã đóng cửa sổ đăng nhập — bấm lại để thử.'
  if (code === 'auth/popup-blocked') return 'Trình duyệt đã chặn cửa sổ đăng nhập — hãy cho phép popup cho trang này rồi thử lại.'
  if (code === 'auth/cancelled-popup-request') return 'Cửa sổ đăng nhập đã bị hủy — bấm lại để thử.'
  if (code === 'auth/unauthorized-domain') return 'Tên miền này chưa được cho phép đăng nhập trong Firebase — cần thêm nguyenhuuhanhlam.github.io vào Authorized domains của project dev-lab-vm.'
  if (code === 'auth/network-request-failed') return 'Không có mạng — dữ liệu vẫn lưu trên máy, kiểm tra mạng rồi thử lại.'
  if (code === 'auth/user-disabled') return 'Tài khoản này đã bị vô hiệu hóa trong Firebase.'
  if (code === 'permission-denied') return 'Tài khoản chưa có quyền ghi dữ liệu đồng bộ — kiểm tra lại Firestore Rules cho collection tuti_sync.'
  if (code === 'unavailable' || code === 'failed-precondition') return 'Không kết nối được Firebase lúc này — dữ liệu vẫn lưu trên máy, sẽ thử lại sau.'
  return 'Đồng bộ chưa được — dữ liệu vẫn lưu trên máy. Thử lại sau.'
}
