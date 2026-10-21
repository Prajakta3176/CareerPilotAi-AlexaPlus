import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to the backend server
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      // Proxy MCP calls to the MCP server
      '/mcp': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
});
