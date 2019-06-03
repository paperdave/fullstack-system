#!/usr/bin/env node
const cli = require('cli');

cli.setApp('fullstack-system', require('../package.json').version)
cli.enable('version');

cli.parse(null, ['dev', 'build', 'new', 'production']);

require('./' + cli.command);
