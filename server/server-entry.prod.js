import { __update as update } from 'fullstack-system';

const fs = require('fs');
const path = require('path');
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
const port = params.port || process.env.PORT || 8000;

const clientStartRouter = express.Router();
update('appStart', clientStartRouter);
app.use(clientStartRouter);

// If theres a static folder, express.static() it
const staticFolder = path.join(process.cwd(), 'src/static');
if(fs.existsSync(staticFolder)) {
  app.use(
    express.static(staticFolder)
  );
}

const s = express.static(eval('__dirname'));
app.use(
  (req, res, next) => {
    if(req.url !== '/server.js') {
      s(req, res, next);
    } else {
      next();
    }
  }
);

const ioEventHandlers = {};
update('io', {
  ...io,
  on: (ev, handler) => {
    if(!ioEventHandlers[ev]) {
      ioEventHandlers[ev] = new Set();
    }
    ioEventHandlers[ev].add(handler);
    io.on(ev, handler);
  },
  removeListener: (ev, handler) => {
    if (ioEventHandlers[ev]) {
      ioEventHandlers[ev].delete(handler);
    }
    io[ev].removeListener(ev, handler);
  },
});

const clientRouter = express.Router();
update('app', clientRouter);
app.use(clientRouter);

require('{SERVER_ENTRY}');

http.listen(port, () => log.name('Running production server on http://localhost:' + port + '/'));
