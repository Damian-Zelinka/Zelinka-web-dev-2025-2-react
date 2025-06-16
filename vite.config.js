import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Zelinka-web-dev-2025-2-react',
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
  },
})
