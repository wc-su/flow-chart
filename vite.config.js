import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node', // 預設 node；要畫元件的測試檔在第一行加 @vitest-environment jsdom
    // globals: true,       // 可直接用 describe/it/expect
    setupFiles: ['./src/setupTests.js'],
  },
});
