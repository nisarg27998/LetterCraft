import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      external: [
        'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.23.0/firebase-app-compat.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.23.0/firebase-auth-compat.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/firebase/9.23.0/firebase-firestore-compat.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/docx/7.8.2/docx.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js'
      ]
    }
  }
});