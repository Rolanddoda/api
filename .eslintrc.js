module.exports = {
  root: true,

  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],

  plugins: ['@typescript-eslint', 'prettier'],

  env: {
    es2021: true,
    browser: true
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },

  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        singleQuote: true,
        semi: false,
        trailingComma: 'none'
      }
    ]
  }
}
