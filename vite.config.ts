import { defineConfig } from 'vite';

// GitHub Pages 프로젝트 경로(/CodeMaster/) 기준. 추후 Cloudflare Pages 전환 시 '/'로 변경.
export default defineConfig({
  base: '/CodeMaster/',
  build: {
    outDir: 'dist',
    target: 'es2022',
    sourcemap: false,
  },
});
