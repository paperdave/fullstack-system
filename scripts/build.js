const webpack = require('webpack');
const path = require('path');
const log = require('../log');
const fs = require('fs-extra');

const start = Date.now();

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
  if (pkg.isFullstackSystemBuild) {throw 0;}
  if (pkg.name === 'server') {
    log.error('Your package name cannot be "server", please change it.');
    return;
  }
} catch (error) {
  log.error('Cannot read project\'s package.json file. Does it exist?');
  return;
}

// Clear Temp
fs.removeSync(path.join(__dirname, '../.temp'));
fs.mkdirsSync(path.join(__dirname, '../.temp'));

const root = pkg['fullstack-system'] && pkg['fullstack-system'].root || 'src';
const server = pkg['fullstack-system'] && pkg['fullstack-system'].server || 'server';
const staticFolder = pkg['fullstack-system'] && pkg['fullstack-system'].static || 'static';
const dist = pkg['fullstack-system'] && pkg['fullstack-system'].dist || 'dist';
const port = pkg['fullstack-system'] && pkg['fullstack-system'].dist || 'port';

fs.removeSync(path.join(process.cwd(), dist));
fs.mkdirsSync(path.join(process.cwd(), dist));

// Generate Entry File
const SERVER_ENTRY = path.join(process.cwd(), root, server).replace(/\\/g, '\\\\');
const SERVER_NAME = pkg.name;
const SERVER_PORT = port || 8000;

log.name('Building ' + SERVER_NAME + '.');

fs.writeFileSync(
  path.join(__dirname, '../.temp/webpack-server-entry.js'),
  fs.readFileSync(path.join(__dirname, '../server/server-entry.prod.js'))
    .toString()
    // Replace to make webpack happy!
    .replace(/\{SERVER_ENTRY\}/g, `${SERVER_ENTRY}`)
    .replace(/\{SERVER_NAME\}/g, `${SERVER_NAME}`)
    .replace(/SERVER_PORT/g, `${SERVER_PORT}`)
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

async function doStatic() {
  const STATIC_FOLDER = path.join(process.cwd(), root, staticFolder);
  const DIST = path.join(process.cwd(), dist);

  await fs.writeFile(
    path.join(DIST, 'package.json'),
    {
      name: pkg.name,
      description: pkg.description,
      author: pkg.author,
      contributors: pkg.contributors,
      version: pkg.version,
      homepage: pkg.homepage,
      dependencies: pkg.dependencies,
      main: 'server.js',
      isFullstackSystem: true,
    }
  );

  if (await fs.exists(STATIC_FOLDER)) {
    await Promise.all((await fs.readdir(STATIC_FOLDER)).map(async(file) => {
      await fs.copyFile(
        path.join(STATIC_FOLDER, file),
        path.join(DIST, file)
      );
    }));
    log.info('Static Files Copied!');
  }
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
  doStatic(),
]).then(() => {
  log.done(`Build Completed. Took ${Date.now() - start}ms`);
});
