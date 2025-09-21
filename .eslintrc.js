module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  
  rules: {
    // Best Practices
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    
    // ES6+
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'prefer-template': 'error',
    
    // Code Style
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    
    // Functions
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'no-var': 'error',
    
    // Objects
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    
    // Arrays
    'array-bracket-spacing': ['error', 'never'],
    
    // Performance
    'no-loop-func': 'error',
    'no-inner-declarations': 'error'
  },
  
  globals: {
    // Game globals
    'gameState': 'readonly',
    'canvas': 'readonly',
    'ctx': 'readonly',
    
    // Browser APIs
    'requestAnimationFrame': 'readonly',
    'cancelAnimationFrame': 'readonly',
    'performance': 'readonly'
  },
  
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      },
      rules: {
        'no-console': 'off'
      }
    },
    {
      files: ['webpack.config.js', '.eslintrc.js'],
      env: {
        node: true,
        browser: false
      }
    }
  ]
};