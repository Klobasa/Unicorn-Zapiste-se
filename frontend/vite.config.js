import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  css: {
     preprocessorOptions: {
        scss: {
          silenceDeprecations: [
            'import',
            'color-functions',
            'global-builtin',
            'if-function',
          ],
        },
     },
  },

  server: {
    proxy: {
      '/participant': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          // Let browser page navigations (HTML requests) fall through to the SPA
          if (req.headers.accept?.includes('text/html')) return '/index.html'
        },
      },
      '/lesson': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) return '/index.html'
        },
      },
      '/lesson-participant': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) return '/index.html'
        },
      },
    },
  },
})
