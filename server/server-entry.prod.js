const { __update: update } = require('fullstack-system');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const log = require('../log');
const cli = require('cli');

const packageJSON = eval('require("./package.json")');

process.versions.fullstack_system = require('fullstack-system').version;
process.versions.webpack = require('webpack/package.json').version;
process.versions.express = require('express/package.json').version;
process.versions.socketio = require('socket.io/package.json').version;
try {
  process.versions.react = require('react/package.json').version;
} catch (error) {
  process.versions.react = 'N/A';
}

cli.setApp(packageJSON.name, packageJSON.version);
cli.enable('version');

const params = cli.parse({ port: ['p', 'The port to run the server on.', 'NUMBER'] });
const port = params.port || process.env.PORT || SERVER_PORT;

const clientStartRouter = express.Router();
update('appStart', clientStartRouter);
app.use(clientStartRouter);

const s = express.static(eval('__dirname'));
app.use((req, res, next) => {
  if (req.url.toLowerCase() !== '/server.js' && req.url.toLowerCase() !== '/server.js.map') {
    s(req, res, next);
  } else {
    next();
  }
});

let io;
function getIo() {
  if(!io) {
    io = require('socket.io')(http);
  }
  return io;
}
update('io', getIo);

const clientRouter = express.Router();
update('app', clientRouter);
app.use(clientRouter);

require('{SERVER_ENTRY}');

http.listen(port, () => log.info('Running {SERVER_NAME} on http://localhost:' + port + '/'));
