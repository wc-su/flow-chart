import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintReact from '@eslint-react/eslint-plugin';
import testingLibrary from 'eslint-plugin-testing-library';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: { '@eslint-react': eslintReact }, // 沒有用推薦設定，只使用一條規則，所以要自己註冊
    rules: { '@eslint-react/dom-no-unsafe-target-blank': 'error' },
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['**/*.test.{js,jsx}'], // 只套用在測試檔
    extends: [testingLibrary.configs['flat/react']],
  },
]);
