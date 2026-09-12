import nextConfig from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";

const eslintConfig = [
  ...nextConfig,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
];

export default eslintConfig;
