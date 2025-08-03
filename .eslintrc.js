module.exports = {
  extends: ['next', 'next/core-web-vitals'],
  env: {
    node: true
  },
  rules: {
    '@next/next/no-img-element': 0,
    'react/display-name': 0,
    'no-unused-vars': 1,
    'react/no-unknown-property': 0,
    'linebreak-style': 'off',  // Fix line ending errors
    'import/no-commonjs': 'off',  // Allow CommonJS modules
    'indent': 'off',  // Disable indentation rules for styled-jsx
    'quotes': 'off'  // Disable quote rules for styled-jsx
  },
};
