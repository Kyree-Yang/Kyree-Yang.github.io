import { execSync } from 'node:child_process';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const sha = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'local';
  }
})();

// User page (kyree-yang.github.io) is served from the domain root, so base stays '/'.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    __BUILD_SHA__: JSON.stringify(sha),
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/]react(-dom|-router|-router-dom)?[\\/]/.test(id)) return 'react';
            if (id.includes('lucide-react')) return 'icons';
            return undefined;
          }
          // The visualizations are shared across routes and are the single
          // largest body of app code; splitting them keeps the entry small and
          // lets the browser cache them once for the whole site.
          if (id.includes('/src/components/viz/')) return 'viz';
          if (id.includes('/src/content/')) return 'content';
          return undefined;
        },
      },
    },
  },
});
