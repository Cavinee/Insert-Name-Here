/// <reference types="vitest" />
import path from "path";
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';

dotenv.config();

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
  cacheDir: '../node_modules/.vite',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // test: {
  //   environment: 'jsdom',
  //   setupFiles: 'setupTests.ts',
  // },
});
