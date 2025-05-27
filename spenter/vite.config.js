import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // React 개발 서버 포트(선택사항 — 5173이 기본)
    port: 5173,
    // “/api” 요청을 백엔드(5000번)로 전달
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});