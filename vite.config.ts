import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "https://kusa.trap.show/game/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15']
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022'
    }
  }
})
