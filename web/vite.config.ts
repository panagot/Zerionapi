import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  build: { outDir: 'dist', sourcemap: true },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
});

