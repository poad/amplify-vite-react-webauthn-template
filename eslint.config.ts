import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import reactRefresh from "eslint-plugin-react-refresh";

import { configs, parser } from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';

import { includeIgnoreFile } from '@eslint/compat';
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, "./.gitignore");

const compat = new FlatCompat();

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
  // @ts-ignore
  pluginPromise.configs['flat/recommended'],
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.recommended,
  jsxA11y.flatConfigs.recommended,
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
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    settings: {
      react: {
        version: 'detect',
      },
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
      'import/internal-regex': '^~/',
      'import/resolver': {
        node: true,
        typescript: true,
      },
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
