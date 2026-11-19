// Cấu hình Cloudinary — cloud name và preset unsigned đều là thông tin public
// (nằm trong mọi URL ảnh), không chứa secret.
export const CLOUD_NAME = 'dpomchruf'
export const UPLOAD_PRESET = 'photo_app'
export const TAG = 'photo_app'

// Nén trước khi up để tiết kiệm credit bản free: cạnh dài tối đa 1600px,
// JPEG chất lượng 82%. Ảnh nhỏ hơn vẫn giữ nguyên kích thước.
export const MAX_DIMENSION = 1600
export const JPEG_QUALITY = 0.82
