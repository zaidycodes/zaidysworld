import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Keep the heavy 3D stack out of the critical path: it is only
        // fetched by the lazily-loaded <Universe /> chunk.
        manualChunks(id) {
          if (id.includes('node_modules/three/')) return 'three'
          if (id.includes('@react-three')) return 'r3f'
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('framer-motion') || id.includes('node_modules/motion')) return 'motion'
        },
      },
    },
  },
})
