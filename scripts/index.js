#!/usr/bin/env node
console.log('DEVELOPMENT');

const cli = require('cli');

cli.parse(null, ['dev', 'build', 'new', 'production']);

require('./' + cli.command);
