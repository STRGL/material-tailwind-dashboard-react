module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "airbnb", "prettier"],
  plugins: ["react", "prettier"],
  rules: {
    indent: ["error", 2],
    "spaced-comment": 0,
    "react/react-in-jsx-scope": 0,
    "prettier/prettier": [
      "error",
      {
        trailingComma: "all",
        tabWidth: 2,
        semi: false,
        bracketSpacing: true,
        eslintIntegration: true,
        printWidth: 120,
      },
    ],
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "/src"]],
      },
    },
  },
}
