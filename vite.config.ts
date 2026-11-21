import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/public': {
        target: 'https://villa-penas-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
      '/uploads': {
        target: 'https://villa-penas-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
