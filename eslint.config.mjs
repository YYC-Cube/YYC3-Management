/**
 * @fileoverview ESLint flat config for YYC³-Management
 * @description Replaces .eslintrc.json for ESLint 10+ compatibility
 * @author YYC³
 * @version 3.0.0
 * @created 2026-07-12
 * @license MIT
 */

import nextConfig from 'eslint-config-next';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // Next.js default config (includes core-web-vitals + typescript)
  ...nextConfig,

  // Global ignores
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'core/**',
      'docs/**',
      'scripts/**',
      'migrations/**',
      'public/**',
      'templates/**',
      'next-env.d.ts',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
    ],
  },

  // Custom rules
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unescaped-entities': 'off',
      // 禁止使用硬编码 red/green 颜色，强制使用语义 token
      // 替代映射：text-red-* → text-destructive, bg-red-* → bg-destructive/10,
      //          border-red-* → border-destructive/20, text-green-* → text-success,
      //          bg-green-* → bg-success/10, border-green-* → border-success/20
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/\\b(text|bg|border|ring|fill|stroke)-(red|green)-\\d/]',
          message:
            '禁止使用硬编码 red/green 颜色类名。请改用语义 token：destructive（错误/危险）或 success（成功）。例如 text-red-600 → text-destructive，bg-green-50 → bg-success/10。',
        },
      ],
    },
  },
];

export default eslintConfig;
