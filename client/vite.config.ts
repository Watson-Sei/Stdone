import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  server: {
    open: true,
  },
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  plugins: [react()]
})
