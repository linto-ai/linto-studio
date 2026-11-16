const { defineConfig } = require("eslint/config")
const js = require("@eslint/js")
const eslintConfigPrettier = require("eslint-config-prettier")
const globals = require("globals")

module.exports = defineConfig([
  { ignores: ["config/seeds/"] },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          args: "none",
          caughtErrors: "none",
          ignoreRestSiblings: true,
          // Unused debug loggers are tolerated, they document the namespace
          varsIgnorePattern: "^(_|debug$)",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      // Pending error handling cleanup, reported as warnings until then
      "no-useless-catch": "warn",
      "no-empty": "warn",
      "no-async-promise-executor": "warn",
      "preserve-caught-error": "warn",
    },
  },
  {
    files: ["tests/**"],
    languageOptions: {
      globals: globals.jest,
    },
  },
])
