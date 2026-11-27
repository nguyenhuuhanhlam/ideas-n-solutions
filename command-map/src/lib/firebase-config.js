// Cấu hình web CÔNG KHAI của project Firebase dev-lab-vm — dùng chung với
// app Ahri và TuTi (user chốt dùng chung project). apiKey của Firebase web
// chỉ là định danh client, không phải bí mật: quyền truy cập dữ liệu do
// Firestore Rules quyết định (mỗi tài khoản chỉ đọc/ghi được dữ liệu của mình).
export const firebaseConfig = {
  apiKey: 'AIzaSyBzQoJ3znj7X0tm1n4n7xZMjXxet5z8_qg',
  authDomain: 'dev-lab-vm.firebaseapp.com',
  projectId: 'dev-lab-vm',
  storageBucket: 'dev-lab-vm.firebasestorage.app',
  messagingSenderId: '1044735325101',
  appId: '1:1044735325101:web:a3da8c2ddff52833dfe724',
}
