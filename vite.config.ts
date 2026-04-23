import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api/zai': {
          target: 'https://api.ilmu.ai',
          changeOrigin: true,
          secure: false,
          rewrite: () => '/v1/chat/completions',
          timeout: 180000,
          proxyTimeout: 180000,
          headers: {
            'Origin': 'https://api.ilmu.ai',
          },
        },
      },
    },
  };
});
