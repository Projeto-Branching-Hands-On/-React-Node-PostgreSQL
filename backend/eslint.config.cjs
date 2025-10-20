const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        require: "readonly",
        process: "readonly",
        console: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off", // desativa esse erro porque definimos os globals
      "semi": ["error", "always"],
      "quotes": ["error", "double"]
    }
  }
];
