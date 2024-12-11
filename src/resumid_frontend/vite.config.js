import react from '@vitejs/plugin-react';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';
import path from "path"
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: [
      {
        "@": path.resolve(__dirname, "./src"),
      },
    ],
    dedupe: ['@dfinity/agent'],
  },
});
