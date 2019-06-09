const path = require('path');
const log = require('../log');
const fs = require('fs-extra');

const serverFile = path.join(process.cwd(), 'dist/server.js');
if(!fs.existsSync(serverFile)) {
  log.error('Could not find a compiled server program here.');
  log.error('You probably forgot to run `fullstack-system build` first');
} else {
  require(serverFile);
}
