import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: true,  // Add source maps for better debugging
    rollupOptions: {
      external: [
        'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.23.0/firebase-app-compat.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.23.0/firebase-auth-compat.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.23.0/firebase-firestore-compat.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js'
      ]
    }
  },
  server: {
    port: 3000,
    open: true,    // Automatically open browser
    cors: true     // Enable CORS for development
  },
  preview: {
    port: 4173     // Set preview server port
  },
  optimizeDeps: {
    exclude: ['firebase']  // Exclude Firebase from optimization
  }
});