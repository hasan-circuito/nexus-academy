import nextConfig from "eslint-config-next/core-web-vitals";

const nextTsConfig = nextConfig.find((c) => c.name === "next/typescript");

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "scratch/**", "scripts/**", "out/**", "public/**"],
  },
  ...nextConfig,
  {
    plugins: {
      ...(nextTsConfig ? nextTsConfig.plugins : {}),
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "warn",
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
];

export default eslintConfig;
