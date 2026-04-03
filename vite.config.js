import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ─────────────────────────────────────────────────────────────
//  PASTE YOUR APPS SCRIPT URL HERE (just this one place)
// ─────────────────────────────────────────────────────────────
const APPS_SCRIPT_URL = 'AKfycbw__O7Tt_Ti2W2SUZb-iyqv-Kl_dvGZCXTtYF9a-zyVPVEmfm97Uzc_4xQO9QdsWVEs'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api/sheets': {
        target:       'https://script.google.com',
        changeOrigin: true,
        rewrite:      () => `/macros/s/${APPS_SCRIPT_URL}/exec`,
        followRedirects: true,
        // configure: (proxy) => {
        //   proxy.on('proxyReq', (proxyReq) => {
        //     proxyReq.removeHeader('origin')
        //     proxyReq.removeHeader('referer')
        //   })
        // },
      },
      // Any request to /api/sheets gets forwarded to Apps Script
      // Vite handles it server-side so there's no browser CORS issue
      // '/api/sheets': {
      //   target:       APPS_SCRIPT_URL,
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api\/sheets/, ''),
      //   followRedirects: true,      // follow the 302 to googleusercontent
      //   configure: (proxy) => {
      //     proxy.on('proxyReq', (proxyReq) => {
      //       proxyReq.removeHeader('origin')
      //       proxyReq.removeHeader('referer')
      //     })
      //   },
      // },
    },
  },
})
