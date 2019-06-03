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

app.use((...args) => {
  return clientRouter(...args);
});

require('{SERVER_ENTRY}');

// eslint-disable-next-line no-console
http.listen(8000, () => console.log('[Production] Running on http://localhost:8000/'));
