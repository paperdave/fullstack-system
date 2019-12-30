import io from 'socket.io-client';

export function connect(...args) {
  const socket = io(...args);
  socket.on('@fullstack-system::reconnect', () => {
    location.reload();
  });
  return socket;
}
