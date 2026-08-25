import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import { resolve } from "node:path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      // core/ui/i18n stay real dependencies of the published package rather
      // than being inlined — npm installs them transitively, so a consumer
      // who also depends on @linto/transcript-ui-core directly (e.g. to add
      // a plugin) doesn't end up with two copies of it.
      external: [
        "vue",
        "yjs",
        "@linto/transcript-ui-core",
        "@linto/transcript-ui-ui",
        "@linto/transcript-ui-i18n",
      ],
      output: {
        globals: { vue: "Vue" },
      },
    },
  },
})
