import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.railway.app', // Allow all Railway subdomains
      '.vercel.app' // Allow all Vercel subdomains
    ]
  },
  server: {
    host: true, // Allow external connections
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
