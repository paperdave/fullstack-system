const path = require('path');
const log = require('../log');
const fs = require('fs-extra');

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
  if (pkg.isFullstackSystemBuild) { throw 0; }
  if (pkg.name === 'server') {
    log.error('Your package name cannot be "server", please change it.');
    return;
  }
} catch (error) {
  log.error('Cannot read project\'s package.json file. Does it exist?');
  return;
}

const dist = pkg['fullstack-system'] && pkg['fullstack-system'].dist || 'dist';

const serverFile = path.join(process.cwd(), dist, 'server.js');
if (!fs.existsSync(serverFile)) {
  log.error('Could not find a compiled server program here.');
  log.error('You probably forgot to run `fullstack-system build` first');
} else {
  require(serverFile);
}
