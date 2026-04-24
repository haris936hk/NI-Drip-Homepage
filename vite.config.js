// vite.config.js
// Outputs a single bundle.js + bundle.css for WordPress enqueue

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production' && !process.env.WP_BUILD;

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    // Use '/' for Vercel/Netlify, but the specific path for WordPress
    base: isVercel ? '/' : '/wp-content/themes/your-child-theme/dist/',

    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          entryFileNames: 'bundle.js',
          chunkFileNames: 'bundle.js',
          assetFileNames: 'bundle.[ext]', // bundle.css
        },
      },
    },
  }
})
