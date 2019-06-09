import socketIO from 'socket.io-client';

// TODO: Figure out socket re-connection (mainly it's gonna
// be about state maintaining on the server).
export function connect(...args) {
  const socket = socketIO(...args);
  socket.on('@fullstack-system::reconnect', () => {
    // eslint-disable-next-line
    console.error('Re-connection after a server reload not implemented. For now you have to reload this page for socket re-connection.');
  });
  return socket;
}
