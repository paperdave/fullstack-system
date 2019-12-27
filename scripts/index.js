#!/usr/bin/env node
const cli = require('cli');

process.versions.fullstack_system = require('../package.json').version;
process.versions.webpack = require('webpack/package.json').version;
process.versions.express = require('express/package.json').version;
process.versions.socketio = require('socket.io/package.json').version;
try {
  process.versions.react = require('react/package.json').version;
} catch (error) {
  process.versions.react = 'N/A';
}

cli.setApp('fullstack-system', process.versions.fullstack_system);
cli.enable('version');

const params = cli.parse({
  port: ['p', 'The port to run the server on.', 'NUMBER'],
}, ['dev', 'build', 'new', 'production', 'clean']);

global.port = params.port;

require('./' + cli.command);
