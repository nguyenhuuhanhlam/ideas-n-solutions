// Mã bảo mật TẠM THỜI để xác nhận khi xoá root ở sidebar (user đặt 2026-11-27).
// Đây chỉ là chốt chặn phía client cho đỡ bấm nhầm / người lạ nghịch máy:
// mã nằm trong mã nguồn công khai nên KHÔNG phải bảo mật thật. Hàng rào thật
// là đăng nhập Google + Firestore Rules theo tài khoản. Khi nào bỏ chốt này
// thì xoá hằng số và hộp thoại nhập mã trong App.
export const DELETE_ROOT_CODE = 'meocondihoc'
