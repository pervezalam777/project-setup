import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows the dev server to be accessible from outside the container
    port: 5173, // Vite's default dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Proxy API requests to the backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
      },
    },
    watch: {
      usePolling: true, // Required for HMR to work reliably in Docker on some OS
    },
  },
  build: {
    outDir: '../server/public', // Output frontend build to server's public folder
    emptyOutDir: true, // Clear the output directory before building
  },
});