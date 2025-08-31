module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:vue/vue3-recommended", "eslint:recommended"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  rules: {
    semi: ["error", "never"],
    camelcase: [
      "error",
      { properties: "never", ignoreDestructuring: true, ignoreImports: true },
    ],
    "arrow-parens": ["error", "as-needed"],
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    "vue/max-len": [
      "error",
      {
        code: 120,
        ignoreHTMLTextContents: false,
      },
    ],
    "vue/no-setup-props-destructure": "off",
    "vue/multi-word-component-names": "off",
  },
  plugins: ["vue", "@typescript-eslint"],
};
