import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, includeIgnoreFile } from 'eslint/config';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
// @ts-expect-error ignore errors
import jsxA11y from 'eslint-plugin-jsx-a11y';
import { importX, createNodeResolver } from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
// @ts-expect-error ignore errors
import pluginPromise from 'eslint-plugin-promise';
// eslint-disable-next-line import-x/no-named-as-default
import reactRefresh from 'eslint-plugin-react-refresh';

import { configs, parser } from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, './.gitignore');

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  {
    ignores: [
      '*.d.ts',
      '*.{js,jsx}',
      'src/tsconfig.json',
      '*.css',
      'node_modules/**/*',
      '.next',
      'out',
    ],
  },
  eslint.configs.recommended,
  ...configs.strict,
  ...configs.stylistic,
  pluginPromise.configs['flat/recommended'],
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
      parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      react: {
        version: '19.2',
      },
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
      'import-x/internal-regex': '^~/',
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
        createNodeResolver(),
      ],
    },
    plugins: {
      '@stylistic': stylistic,
      react,
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
    },
  },
);
