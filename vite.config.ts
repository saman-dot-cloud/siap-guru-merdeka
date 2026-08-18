import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  // KUNCI UTAMA: Memaksa semua aset tombol dan CSS menggunakan jalur relatif yang dikenal Netlify
  base: './', 
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
