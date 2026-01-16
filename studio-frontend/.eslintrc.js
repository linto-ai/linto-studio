module.exports = {
  env: {
    node: true,
  },
  globals: {
    __APP_VERSION__: "readonly",
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/base",
    "plugin:vue/essential",
    "prettier",
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
};
