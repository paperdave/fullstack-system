const { __update: update } = require('fullstack-system');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const log = require('../log');
const cli = require('cli');

const packageJSON = eval('require("../package.json")');

cli.setApp(packageJSON.name, packageJSON.version);
cli.enable('version');

const params = cli.parse({ port: ['p', 'The port to run the server on.', 'NUMBER'] });
const port = params.port || process.env.PORT || SERVER_PORT;

const clientStartRouter = express.Router();
update('appStart', clientStartRouter);
app.use(clientStartRouter);

const s = express.static(eval('__dirname'));
app.use(
  (req, res, next) => {
    if (req.url !== '/server.js' || req.url !== '/server.js.map') {
      s(req, res, next);
    } else {
      next();
    }
  }
);

update('io', io);

const clientRouter = express.Router();
update('app', clientRouter);
app.use(clientRouter);

require('{SERVER_ENTRY}');

http.listen(port, () => log.info('Running {SERVER_NAME} on http://localhost:' + port + '/'));
