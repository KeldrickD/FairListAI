import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, '../shared'),
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
        // Exclude server-side code from client bundle
        external: [
          'express', 
          'http', 
          'fs', 
          'path', 
          'bcrypt', 
          'stripe', 
          'openai',
          'express-session',
          'drizzle-orm'
        ]
      },
      chunkSizeWarningLimit: 1000,
      minify: true,
      sourcemap: false
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        target: ['es2020'],
      },
    },
    define: {
      // Provide fallback env variables at build time
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || '/api'),
    }
  };
}); 