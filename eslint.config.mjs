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
    },
  },
];

export default eslintConfig;
