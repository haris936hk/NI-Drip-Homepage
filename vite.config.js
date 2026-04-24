// vite.config.js
// Outputs a single bundle.js + bundle.css for WordPress enqueue

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Change this to match your child theme path on the server
  base: '/wp-content/themes/your-child-theme/dist/',

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
})
