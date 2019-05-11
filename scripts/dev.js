const npmRunScript = require('npm-run-script');
const path = require('path');
const fs = require('fs-extra');

// Clear Temp
fs.removeSync(path.join(__dirname, '../.temp'));
fs.mkdirsSync(path.join(__dirname, '../.temp'));

// Generate Entry File
const SERVER_ENTRY = path.join(process.cwd(), './src/server').replace(/\\/g, '\\\\');

fs.writeFileSync(
  path.join(__dirname, '../.temp/webpack-server-entry.js'),
  fs.readFileSync(path.join(__dirname, '../server/server-entry.js'))
    .toString()
    .replace(/\'\{SERVER_ENTRY\}\'/g, `'${SERVER_ENTRY}'`), // Replace to make webpack happy!
);

// Webpack Watch It
npmRunScript(
  `webpack --config "${path.join(__dirname, '../config/server.webpack.config.js')}"`
);
