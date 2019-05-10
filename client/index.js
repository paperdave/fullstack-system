import socketIO from 'socket.io-client';

export function io(...args) {
  const socket = socketIO(...args);
  socket.on('magic::reconnect', () => {
    console.error('TODO: re-connection after a Server reload. For now reload this page');
  });
  return socket;
}
