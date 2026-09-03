import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node', // 純 redux 夠用
    // globals: true,         // 可直接用 describe/it/expect
  },
});
