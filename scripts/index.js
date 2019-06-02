#!/usr/bin/env node
const cli = require('cli');

cli.parse(null, ['dev', 'build', 'new', 'production']);

require('./' + cli.command);
