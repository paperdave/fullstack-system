import { useState, useEffect } from 'react';
import { io } from '@fullstack-system';

function reconnectWarning() {
  console.error('Server HMR! You need to reload the page to reconnect the Socket.IO.');
}

export default function useSocket(callback, memo) {
  const [socket, setSocket] = useState(() => {
    const socket = io();
    callback(socket);
    socket.on('magic-loading::reconnect', reconnectWarning)
    return socket;
  });

  useEffect(() => {
    if(!socket) {
      const socket = io();
      callback(socket);
      socket.on('magic-loading::reconnect', reconnectWarning)
      setSocket(socket);
    }
    return () => {
      if(socket) {
        socket.disconnect()
      }
      setSocket(null);
    }
  }, memo);

  return socket;
}
