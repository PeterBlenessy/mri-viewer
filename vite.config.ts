import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Default port for web mode is 3001
    // Tauri dev will override to 5173 via CLI flag
    port: 3001,
    // Only auto-open browser in pure web mode, not when Tauri launches it
    open: !process.env.TAURI_ENV_PLATFORM,
    watch: {
      ignored: ['**/node_modules/**'],
    },
  },
  logLevel: 'warn', // Suppress source map warnings in dev
  optimizeDeps: {
    exclude: [],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  worker: {
    format: 'es',
  },
})
