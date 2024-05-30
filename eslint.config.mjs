import globals from "globals";
import js from "@eslint/js";
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.node }},
  {ignores: ['dist/*']},
  js.configs.recommended,
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      'no-trailing-spaces': 'error',
      'no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
      }]
    }
  },
];

