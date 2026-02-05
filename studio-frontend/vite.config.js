import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [vue()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['vue'],
    },

    envPrefix: 'VUE_APP_',

    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },

    css: {
      preprocessorOptions: {
        scss: {
          // Global SCSS imports if needed
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router', 'vuex', 'vue-i18n'],
            'vendor-editor': ['yjs', 'wavesurfer.js', 'socket.io-client'],
            'vendor-utils': ['axios', 'debug', 'uuid'],
          },
        },
      },
    },

    server: {
      port: 8080,
      host: true,
    },

    preview: {
      port: 80,
    },

    worker: {
      format: 'es',
    },

    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'vuex',
        'vue-i18n',
        'axios',
        'socket.io-client',
        'yjs',
        'wavesurfer.js',
        'debug',
        'uuid',
      ],
    },
})
