module.exports = {
  extends: ["next", "prettier"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
  settings: {
    next: {
      rootDir: true,
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
    },
  ],
};
