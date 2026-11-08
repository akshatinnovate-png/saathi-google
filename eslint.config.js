import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/**', 'target/**', 'core/**', 'broker/**', 'data/**', 'build/**', 'launcher/**'] },
  js.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2025, sourceType: 'module', globals: { ...globals.node } },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none', ignoreRestSiblings: true }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-proto': 'error',
      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
      'no-var': 'error',
    },
  },
  {
    files: ['public/**/*.js'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: ['public/pcm-worklet.js'],
    languageOptions: { globals: { ...globals.audioWorklet } },
  },
  {
    files: ['public/firebase-messaging-sw.js'],
    languageOptions: { sourceType: 'script', globals: { ...globals.serviceworker } },
  },
  {
    files: ['scripts/a11y.js', 'scripts/e2e.js', 'test/**/*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
