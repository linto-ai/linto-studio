import { defineConfig } from "eslint/config"
import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import eslintConfigPrettier from "eslint-config-prettier"
import globals from "globals"

export default defineConfig([
  js.configs.recommended,
  pluginVue.configs["flat/vue2-essential"],
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        __APP_VERSION__: "readonly",
      },
    },
    rules: {
      // Table components expose dynamic slot names containing dots
      // (e.g. #cell-config.type), which the rule would flag as modifiers.
      "vue/valid-v-slot": ["error", { allowModifiers: true }],
    },
  },
])
