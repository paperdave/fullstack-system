const SOURCE_DIR = process.cwd();
const deepmerge = require('deepmerge');
const fs = require('fs');
const path = require('path');

const tsEnabled = fs.existsSync(path.join(SOURCE_DIR, './tsconfig.json'));

let custom = {};
if (fs.existsSync(path.join(SOURCE_DIR, 'babel.config.js'))) {
  custom = deepmerge(custom, require(path.join(SOURCE_DIR, 'babel.config.js')));
}

let enableReactDom = true;
try {
  eval('require.resolve("react-dom")');
} catch (error) {
  enableReactDom = false;
}


module.exports = deepmerge({
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        targets: {
          node: 8,
        },
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/react',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    ...enableReactDom ? [
      'react-hot-loader/babel',
    ] : [],
    ...tsEnabled ? [
      ['@babel/plugin-transform-typescript', { isTSX: true }],
    ] : [],
  ],
}, custom);
