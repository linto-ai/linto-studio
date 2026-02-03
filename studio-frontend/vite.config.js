import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VUE_APP_')

  return {
    plugins: [vue()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Use pre-built version to avoid parcel-specific imports in source
        '@linto-ai/webvoicesdk': path.resolve(__dirname, './node_modules/@linto-ai/webvoicesdk/dist/webVoiceSDK-linto.min.js'),
      },
      dedupe: ['vue'],
    },

    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      'process.env': Object.fromEntries(
        Object.entries(env)
          .filter(([key]) => key.startsWith('VUE_APP_'))
          .map(([key, value]) => [key, JSON.stringify(value)])
      ),
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
        'chart.js',
        'vue-chartjs',
        'moment',
        'jspdf',
        'debug',
        'uuid',
      ],
    },
  }
})
