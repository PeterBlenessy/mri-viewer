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
    // Configure headers for Tauri to allow workers
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  logLevel: 'warn', // Suppress source map warnings in dev
  optimizeDeps: {
    exclude: [],
    // Include cornerstone-wado-image-loader to ensure proper bundling
    include: ['cornerstone-wado-image-loader'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Ensure workers are bundled as separate files with proper naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Exclude source maps for workers to avoid Tauri errors
        sourcemapExcludeSources: true,
      }
    }
  },
  worker: {
    format: 'es',
    rollupOptions: {
      output: {
        // Ensure worker files are properly named and accessible
        entryFileNames: 'worker-[name]-[hash].js',
      }
    }
  },
})
