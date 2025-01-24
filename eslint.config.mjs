import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config} */
export default {
  globals: {
    process: 'readonly',
    ...globals.browser,
    sourceType: 'module', 
  },
  extends: [
    pluginJs.configs.recommended,
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
  },
};
