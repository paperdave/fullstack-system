const path = require('path');
const fs = require('fs-extra');
const log = require('../log');

process.env.NODE_GLOBAL_PORT = global.port;

// Clear Temp
fs.removeSync(path.join(__dirname, '../.temp'));
fs.mkdirsSync(path.join(__dirname, '../.temp'));

// Generate Entry File
const SERVER_ENTRY = path.join(process.cwd(), './src/server').replace(/\\/g, '\\\\');

fs.writeFileSync(
  path.join(__dirname, '../.temp/webpack-server-entry.js'),
  fs.readFileSync(path.join(__dirname, '../server/server-entry.dev.js'))
    .toString()
    // Replace to make webpack happy!
    .replace(/'\{SERVER_ENTRY\}'/g, `'${SERVER_ENTRY}'`),
);

// Webpack Watch It
const webpack = require('webpack');
const compiler = webpack(require('../config/server.webpack.config'));

let first = true;

compiler.watch(
  {
    aggregateTimeout: 200,
  },
  (err, stats) => {
    if(first) {
      first = false;
      return;
    }
    if (err) {
      log.server('Compiled with errors');
    } else {
      log.server('Compiled Successfully');
    }

    if (stats.compilation.warnings) {
      stats.compilation.warnings.forEach((warn) => {
        log.serverWarn(warn);
      });
    }
    if (stats.compilation.errors) {
      stats.compilation.errors.forEach((err) => {
        log.serverError(err);
      });
    }
  }
);
