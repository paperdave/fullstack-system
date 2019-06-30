const webpack = require('webpack');
const path = require('path');
const log = require('../log');
const fs = require('fs-extra');

const start = Date.now();

// Clear Temp
fs.removeSync(path.join(__dirname, '../.temp'));
fs.mkdirsSync(path.join(__dirname, '../.temp'));

// Generate Entry File
const SERVER_ENTRY = path.join(process.cwd(), './src/server').replace(/\\/g, '\\\\');

fs.writeFileSync(
  path.join(__dirname, '../.temp/webpack-server-entry.js'),
  fs.readFileSync(path.join(__dirname, '../server/server-entry.prod.js'))
    .toString()
    // Replace to make webpack happy!
    .replace(/'\{SERVER_ENTRY\}'/g, `'${SERVER_ENTRY}'`),
);

process.env.NODE_ENV = 'production';
// eslint-disable-next-line no-underscore-dangle
process.env.__SYSTEM_DIR = path.join(__dirname, '..');

function doClient() {
  return new Promise((done) => {
    const clientCompiler = webpack(require('../config/client.webpack.config'));
    clientCompiler.run((err, stats) => {
      log.info('Client Compiled!');
      log.info('Client Compile Time ' + (stats.endTime - stats.startTime) + 'ms');
      if (stats.hasWarnings()) {
        log.warn('Warnings during client compilation.');
      }
      if (stats.compilation.warnings) {
        stats.compilation.warnings.forEach((warn) => {
          log.warn(warn);
        });
      }
      if (stats.hasErrors()) {
        log.error('Errors during client compilation.');
      }
      if (stats.compilation.errors) {
        stats.compilation.errors.forEach((err) => {
          log.error(err);
        });
      }
      done();
    });
  });
}

function doServer() {
  return new Promise((done) => {
    const serverCompiler = webpack(require('../config/server.webpack.config'));
    serverCompiler.run((err, stats) => {
      log.info('Server Compiled!');
      log.info('Server Compile Time ' + (stats.endTime - stats.startTime) + 'ms');
      if (stats.hasWarnings()) {
        log.warn('Warnings during server compilation.');
      }
      if (stats.compilation.warnings) {
        stats.compilation.warnings.forEach((warn) => {
          log.warn(warn);
        });
      }
      if (stats.hasErrors()) {
        log.error('Errors during server compilation.');
      }
      if (stats.compilation.errors) {
        stats.compilation.errors.forEach((err) => {
          log.error(err);
        });
      }
      done();
    });
  });
}

Promise.all([
  doServer(),
  doClient(),
]).then(() => {
  log.done(`Build Completed. Took ${Date.now() - start}ms`);
});
