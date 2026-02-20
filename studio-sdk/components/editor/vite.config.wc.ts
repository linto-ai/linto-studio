import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue({ customElement: true }),
  ],
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/webcomponent.ts'),
      formats: ['es', 'iife'],
      fileName: 'linto-editor',
      name: 'LintoEditor',
    },
  },
})
