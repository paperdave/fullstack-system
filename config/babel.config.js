const SOURCE_DIR = process.cwd();
const deepmerge = require('deepmerge');
const fs = require('fs');
const path = require('path');

let custom = {};
if (fs.existsSync(path.join(SOURCE_DIR, 'babel.config.js'))) {
  custom = deepmerge(custom, require(path.join(SOURCE_DIR, 'babel.config.js')));
}

module.exports = deepmerge({
  presets: [
    ['@babel/env', { 'modules': false }],
    '@babel/react',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import'
  ]
}, custom);
