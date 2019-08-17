#!/usr/bin/env node
const cli = require('cli');

cli.setApp('fullstack-system', require('../package.json').version);
cli.enable('version');

const params = cli.parse({
  port: ['p', 'The port to run the server on.', 'NUMBER'],
}, ['dev', 'build', 'new', 'production', 'clean']);

global.port = params.port;

require('./' + cli.command);
