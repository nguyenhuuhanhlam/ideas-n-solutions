// Cấu hình Cloudinary — cloud name và preset unsigned đều là thông tin public
// (nằm trong mọi URL ảnh), không chứa secret.
export const CLOUD_NAME = 'dpomchruf'
export const UPLOAD_PRESET = 'photo_app'
export const TAG = 'photo_app'

// Tag + tiền tố public_id cho ảnh mốc "ẩn ảnh": mỗi lần ẩn, app up 1 ảnh
// 1×1 mang tag HIDDEN_TAG, public_id = MARKER_PREFIX + public_id ảnh gốc.
// Mốc chỉ mang tag ẩn (không mang tag photo_app) nên không hiện trong
// lưới chính. Ảnh gốc vẫn còn trên Cloudinary — ẩn chỉ là lọc ở client.
export const HIDDEN_TAG = 'photo_app_hidden'
export const MARKER_PREFIX = 'hidden--'

// Nén trước khi up để tiết kiệm credit bản free: cạnh dài tối đa 1600px,
// JPEG chất lượng 82%. Ảnh nhỏ hơn vẫn giữ nguyên kích thước.
export const MAX_DIMENSION = 1600
export const JPEG_QUALITY = 0.82
