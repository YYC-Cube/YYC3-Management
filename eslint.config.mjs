// Minimal ESLint flat config - avoids typescript-eslint compatibility issues with TS 7
// Full type checking is handled by `tsc --noEmit`

import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = [
  // Next.js recommended rules (flat config object)
  nextPlugin.configs["recommended"],
  // Ignore build artifacts
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "core/**",
    ],
  },
];

export default eslintConfig;
