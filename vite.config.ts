import path from "path"
import fs from 'fs';

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import legacy from '@vitejs/plugin-legacy'

// Caminho para os arquivos de certificado
const certPath = path.resolve(__dirname, 'certificates/certificate.crt');
const keyPath = path.resolve(__dirname, 'certificates/giganet.key');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), legacy({
    targets: ['defaults', 'not IE 11'],
  })],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendors: ['lodash', 'moment', 'axios'],
        },
      },
    },
  },

  server: {
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
    host: '0.0.0.0',
  },
})
