// Production build of the mobile app (mobile.html -> src/mobile/main.js).
// It is a separate build on purpose: the classic bundle stays byte-identical
// whatever the mobile app imports. Both outputs land in dist/ (hashed
// names never collide) and nginx serves /m/* from mobile.html.
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue2"
import path from "path"
import { fileURLToPath } from "url"
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],

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
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, "mobile.html"),
    },
  },

  worker: {
    format: "es",
  },
})
