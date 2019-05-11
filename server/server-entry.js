import { __update as update } from '@fullstack-system';

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// If theres a static folder, express.static() it
const staticFolder = path.join(process.cwd(), 'src/static');
if(fs.existsSync(staticFolder)) {
  app.use(
    express.static(staticFolder)
  );
}

// Create Client Compiler
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const compiler = webpack(require('../config/client.webpack.config'));

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/',
  })
);
app.use(
  webpackHotMiddleware(compiler, {
    log: console.log, // eslint-disable-line no-console
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  })
);

let ioEventHandlers = {};
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

let clientRouter = express.Router();
update('app', clientRouter);

app.use((...args) => {
  return clientRouter(...args);
});

require('{SERVER_ENTRY}');

if(module.hot) {
  module.hot.accept('{SERVER_ENTRY}', () => {
    Object.keys(ioEventHandlers).forEach((ev) => {
      ioEventHandlers[ev].forEach((x) => io.removeListener(ev, x));
    });
    ioEventHandlers = {};

    io.emit('@fullstack-system::reconnect');
    Object.values(io.of('/').connected).forEach(function (s) {
      s.disconnect(true);
    });

    clientRouter = express.Router();
    update('app', clientRouter);

    require('{SERVER_ENTRY}');
  });
}

// eslint-disable-next-line no-console
http.listen(8000, () => console.log('Running on http://localhost:8000/'));
