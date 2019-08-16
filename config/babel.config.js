const SOURCE_DIR = process.cwd();
const deepmerge = require('deepmerge');
const fs = require('fs');
const path = require('path');

let custom = {};
if (fs.existsSync(path.join(SOURCE_DIR, 'babel.config.js'))) {
  custom = deepmerge(custom, require(path.join(SOURCE_DIR, 'babel.config.js')));
}

let enableReact = true;
try {
  eval('require.resolve("react")');
} catch (error) {
  enableReact = false;
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
    ...enableReact ? [
      'react-hot-loader/babel',
    ] : [],
  ],
}, custom);
