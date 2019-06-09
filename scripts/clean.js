const log = require('../log');
const fs = require('fs-extra');
const path = require('path');

fs.removeSync(path.join(__dirname, '../.temp'));

log.done('Cleaned Cache Folder');
