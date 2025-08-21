import react from '@vitejs/plugin-react';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';
import path from "path"
import { fileURLToPath, URL } from 'url';
import { defineConfig, loadEnv } from 'vite';

dotenv.config({ path: path.resolve(__dirname, "../..", ".env") });

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
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
        "/service": {
          target: env.VITE_SERVICE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/service/, ""),
        }
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
          find: "declarations",
          replacement: fileURLToPath(
            new URL("../declarations", import.meta.url)
          ),
        },
        {
          find: '@',
          replacement: fileURLToPath(
            new URL('./src', import.meta.url)
          ),
        },
      ],
      dedupe: ['@dfinity/agent'],
    },
  }
});
