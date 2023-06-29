import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3100,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
