// @ts-check
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import templateParser from '@angular-eslint/template-parser';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettier from 'eslint-config-prettier';

export default [
  // Ignore build and tooling dirs
  { ignores: ['dist/', 'node_modules/', '.angular/', 'coverage/', '.vscode/', '.idea/'] },

  // TypeScript source files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true, // use your tsconfig.*.json automatically
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angular,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Angular style
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],

      // TS hygiene
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports', fixStyle: 'separate-type-imports' }],

      // Imports
      'import/newline-after-import': ['error', { count: 1 }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // note: we intentionally don't enable import/no-unresolved to avoid resolver setup churn
    },
  },

  // Angular templates (*.html)
  {
    files: ['**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { '@angular-eslint/template': angularTemplate },
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/no-any': 'warn',
      '@angular-eslint/template/eqeqeq': 'error',
    },
  },

  // Keep stylistic rules off; Prettier is the formatter
  prettier,
];
