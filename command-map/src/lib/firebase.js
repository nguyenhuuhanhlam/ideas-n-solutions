// Firebase cho Command Map (bản chính): dùng chung project dev-lab-vm với
// Ahri và TuTi. Đăng nhập Google (Auth) + Firestore theo TỪNG TÀI KHOẢN,
// nằm trong namespace apps/command-map như quy ước chung của project:
//   apps/command-map/users/{uid}/roots/{rootId}
//   apps/command-map/users/{uid}/nodes/{nodeId}
// File này được import động (import()) nên Firebase chỉ tải khi đăng nhập,
// không làm nặng bundle lúc mở app. Firestore Rules cần có:
//   match /apps/command-map/users/{userId}/{document=**} {
//     allow read, write: if request.auth != null && request.auth.uid == userId;
//   }
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore, collection, doc, onSnapshot, writeBatch,
} from 'firebase/firestore'
import { firebaseConfig } from './firebase-config.js'
import { diffLibraries, packRoot, packNode } from './syncdiff.js'

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

const rootsCol = (d, uid) => collection(d, 'apps', 'command-map', 'users', uid, 'roots')
const nodesCol = (d, uid) => collection(d, 'apps', 'command-map', 'users', uid, 'nodes')

// Lắng nghe dữ liệu của 1 tài khoản theo thời gian thực. onData chỉ được gọi
// khi CẢ 2 collection đã có snapshot đầu tiên. Trả hàm huỷ lắng nghe.
export function subscribeLibrary(uid, onData, onError) {
  const { db: d } = initFirebase()
  let roots = null
  let nodes = null
  const emit = () => { if (roots !== null && nodes !== null) onData({ roots, nodes }) }
  const unsubRoots = onSnapshot(rootsCol(d, uid),
    (snap) => { roots = snap.docs.map((x) => ({ id: x.id, ...x.data() })); emit() },
    onError)
  const unsubNodes = onSnapshot(nodesCol(d, uid),
    (snap) => {
      nodes = snap.docs.map((x) => ({ id: x.id, ...x.data() }))
      emit()
    },
    onError)
  return () => { unsubRoots(); unsubNodes() }
}

// Ghi phần khác nhau giữa trạng thái mây đã biết (prev) và trạng thái mới
// (next) lên Firestore bằng batch. Trả số thay đổi đã ghi.
export async function pushDiff(uid, prev, next) {
  const { db: d } = initFirebase()
  const diff = diffLibraries(prev, next)
  const total = diff.roots.sets.length + diff.roots.deletes.length
    + diff.nodes.sets.length + diff.nodes.deletes.length
  if (!total) return 0
  const batch = writeBatch(d)
  for (const { id, data } of diff.roots.sets) batch.set(doc(rootsCol(d, uid), id), data)
  for (const id of diff.roots.deletes) batch.delete(doc(rootsCol(d, uid), id))
  for (const { id, data } of diff.nodes.sets) batch.set(doc(nodesCol(d, uid), id), data)
  for (const id of diff.nodes.deletes) batch.delete(doc(nodesCol(d, uid), id))
  await batch.commit()
  return total
}

export { packRoot, packNode }

// Dịch mã lỗi Firebase sang tiếng Việt dễ hiểu.
export function syncErrorText(e) {
  const code = (e && e.code) || ''
  if (code === 'auth/popup-closed-by-user') return 'Bạn đã đóng cửa sổ đăng nhập — bấm lại để thử.'
  if (code === 'auth/popup-blocked') return 'Trình duyệt đã chặn cửa sổ đăng nhập — hãy cho phép popup cho trang này rồi thử lại.'
  if (code === 'auth/cancelled-popup-request') return 'Cửa sổ đăng nhập đã bị hủy — bấm lại để thử.'
  if (code === 'auth/unauthorized-domain') return 'Tên miền này chưa được cho phép đăng nhập — cần thêm nguyenhuuhanhlam.github.io vào Authorized domains trong Firebase Console (Authentication → Settings).'
  if (code === 'auth/network-request-failed') return 'Không có mạng — dữ liệu vẫn lưu trên máy này, kiểm tra mạng rồi thử lại.'
  if (code === 'auth/user-disabled') return 'Tài khoản này đã bị vô hiệu hóa trong Firebase.'
  if (code === 'permission-denied' || code === 'firestore/permission-denied') return 'Chưa có quyền ghi dữ liệu — cần dán đoạn Rules cho apps/command-map/users/{uid} vào Firestore Rules trong Firebase Console.'
  if (code === 'unavailable' || code === 'failed-precondition') return 'Không kết nối được Firebase lúc này — dữ liệu vẫn lưu trên máy này, sẽ đồng bộ lại sau.'
  return 'Đồng bộ chưa được — dữ liệu vẫn lưu trên máy này. Thử lại sau.'
}
