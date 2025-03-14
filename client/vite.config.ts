import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-components': ['@radix-ui/react-toast', '@radix-ui/react-dialog'],
          'icons': ['lucide-react'],
        }
      },
    },
    chunkSizeWarningLimit: 1000,
    // Skip TypeScript type checking
    minify: true,
    sourcemap: false
  },
  // Explicitly set to ignore TypeScript errors during build
  optimizeDeps: {
    esbuildOptions: {
      // NodeJS adapters for various libraries
      define: {
        global: 'globalThis',
      },
      target: ['es2020'],
    },
  },
}); 