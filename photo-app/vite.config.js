import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Base cố định trong config (không chỉ dựa vào flag --base khi build):
// app deploy ở project site /ideas-n-solutions/photo-app/ trên GitHub Pages.
export default defineConfig({
  base: '/ideas-n-solutions/photo-app/',
  plugins: [react()],
})
