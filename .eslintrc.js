module.exports = {

  extends: 'eslint-config-airbnb',

  plugins: [
    'react',
    'jsx-a11y',
    'import'
  ],

  parserOptions: {
    // This is to avoid eslint complaining:
    //    'use strict' is unnecessary inside of modules
    // we need 'use strict' on node4 because only in strict mode do
    // block-scoped let/const operate.
    sourceType: 'script',
  },

  rules: {
    // Again, override airbnb so that it allows a use strict in node4
    strict: ['error', 'safe'],

    // Allow 'use strict' to have the shebang line for bin/cli.js
    'lines-around-directive': ['error', { before: 'never', after: 'always' }]
  }

}
