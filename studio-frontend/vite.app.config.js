// Build of the mobile front embedded in the native app (Capacitor, see
// capacitor.config.json): `npm run build:app`, mode "app". Same entry as the
// web mobile build (mobile.html -> src/mobile/main.js), but served from the
// app's own root, without service worker or install offer
// (src/mobile/const/appTarget.js), and with only the public/ files the
// mobile front uses. Runtime values come from the frontend .env at build time.
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue2"
import path from "path"
import { fileURLToPath } from "url"
import {
  renameEntryPage,
  copyReferencedPublicFiles,
} from "./config/vite/nativeAppPlugins.js"
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    renameEntryPage({ from: "mobile.html", to: "index.html" }),
    copyReferencedPublicFiles({
      publicDir: path.resolve(__dirname, "public"),
      // Runtime configuration hook loaded by mobile.html.
      alwaysCopy: ["config.js"],
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["vue"],
  },

  envPrefix: "VUE_APP_",

  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  build: {
    // public/ stays known to Vite (components quote "/img/…"), but only the
    // files the mobile front uses are copied (copyReferencedPublicFiles).
    copyPublicDir: false,
    outDir: "dist-app",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, "mobile.html"),
    },
  },

  worker: {
    format: "es",
  },
})
