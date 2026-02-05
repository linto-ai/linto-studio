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
      },
      dedupe: ['vue'],
    },

    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      // For dynamic access (process.env[key]), we need a real object with stringified values
      'process.env': JSON.stringify(
        Object.fromEntries(
          Object.entries(env)
            .filter(([key]) => key.startsWith('VUE_APP_'))
        )
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
