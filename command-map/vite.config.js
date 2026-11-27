import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Base ghi cố định trong config (không truyền qua CLI --base, đã có bài học
// flag qua `npm run` không đáng tin — xem photo-app 2026-11-20).
export default defineConfig({
  plugins: [react()],
  base: '/ideas-n-solutions/command-map/',
})
