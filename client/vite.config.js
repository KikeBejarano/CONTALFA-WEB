import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    // El build SSR (dist-server) es un artefacto intermedio del prerender que se borra
    // al final: no necesita la copia de public/.
    copyPublicDir: !isSsrBuild,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
}))
