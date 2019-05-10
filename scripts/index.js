#!/usr/bin/env node

var cli = require('cli');

cli.parse(null, ['dev', 'build', 'new', 'production']);

require('./' + cli.command);
