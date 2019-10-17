# Sockets
Sockets are used to communicate to the server from the client using a web socket. In Fullstack System, Socket.IO is used.

- [Sockets](#sockets)
  - [Client Use](#client-use)
  - [Server Use](#server-use)
    - [Advanced Setup](#advanced-setup)
  - [TypeScript](#typescript)

## Client Use
By default, the template you get when you start a new project connects you to the server automatically using the `socket.js` file. You can, *optionally*, make it connect when you want it to. This is not reccommended, as you may be handling many connect and disconnect events.

In any React component, add the `useEffect` hook from importing it from `react`. Also import `socket` from the main socket file or wherever you have your socket exported from.

Inside the `useEffect`, you can listen for events using `socket.on()`;
```jsx
import React, { useEffect } from 'react';
import socket from './socket';

function App() {
  useEffect(() => {
    function handlePong(value) {
      setValue(value);
    }

    socket.on('pong', handlePong);
    return () => {
      socket.removeListener('handlePong', handlePong);
    };
  }, []);

  return (
    <div>
      <p>Hello World!</p>
    </div>
  );
}

export default App;
```

Be sure to remove the listener by returning a function that has `socket.removeListener(eventName, callbackFunction)`.

---

## Server Use
To get started you must import `io` from `fullstack-system`.
```js
import { io } from 'fullstack-system';
```

To start accepting connections. you must use `io.on()`, listening for the `connection` event.

```js
import { io } from 'fullstack-system';

io.on('connection', (socket) => {
});
```

From here you can either use `io.sockets.emit()` or `socket.emit` to send events back.

- **`io.sockets.emit()`**: Emits the event to all connected sockets.
- **`socket.emit()`**: Emits the event to the socket that sent the recieved event.

> *Learn more about Socket.IO's emit features at [https://socket.io/docs/#Sending-and-receiving-events](https://socket.io/docs/#Sending-and-receiving-events)*

```js
import { io } from 'fullstack-system';

io.on('connection', (socket) => {
  socket.on('ping', (username) => {
    io.sockets.emit('pong');
    socket.emit('pong');
  });
});
```

### Advanced Setup
You can optionally, setup multiple files to recieve events rather than having a huge file handling *all* of the events. This generally makes it easier to manage things in the future.

Below is a basic setup of that.

```js
// src/server/index.js

import { io } from 'fullstack-system';

import setupExampleHandler from './handlers/example';

io.on('connection', (socket: any) => {
  setupExampleHandler(socket);
});
```

```js
// src/server/handlers/example.js

import { io } from 'fullstack-system';

export default function(socket) {
  socket.on('ping', (username: string, callback: (loginResult: boolean) => void) => {
    io.sockets.emit('pong');
    socket.emit('pong');
  });
}
```

## TypeScript
If you are using TypeScript for your project, you should probably install `@types/socket.io` to give you typings for the Socket.IO library.
