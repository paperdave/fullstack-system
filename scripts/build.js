const webpack = require('webpack');
const path = require('path');
const cli = require('cli');
const fs = require('fs-extra');

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
process.env.__SYSTEM_DIR = path.join(__dirname, '../');

function doClient() {
  return new Promise((done) => {
    const clientCompiler = webpack(require('../config/client.webpack.config'));
    clientCompiler.run((err, stats) => {
      cli.info('Client Compiled!');
      cli.info('Client Compile Time ' + (stats.endTime - stats.startTime) + 'ms');
      cli.info('Client Hash: ' + stats.hash);
      if (stats.hasWarnings()) {
        cli.warn('Warnings during client compilation.');
      }
      if (stats.hasErrors()) {
        cli.error('Errors during client compilation.');
      }
      done();
    });
  });
}

function doServer() {
  return new Promise((done) => {
    const serverCompiler = webpack(require('../config/server.webpack.config'));
    serverCompiler.run((err, stats) => {
      cli.info('Server Compiled!');
      cli.info('Server Compile Time ' + (stats.endTime - stats.startTime) + 'ms');
      cli.info('Server Hash: ' + stats.hash);
      if (stats.hasWarnings()) {
        cli.warn('Warnings during server compilation.');
      }
      if (stats.hasErrors()) {
        cli.error('Errors during server compilation.');
      }
      done();
    });
  });
}

Promise.all([
  doServer(),
  doClient(),
]).then(() => {
  cli.info('Complete.');
});
