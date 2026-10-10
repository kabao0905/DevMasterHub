import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const tai = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: tai('.'),
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': tai('./src') } },
  build: { outDir: tai('../dist'), emptyOutDir: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false
  }
});
