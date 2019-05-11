import { useEffect } from 'react';
import { io } from '@fullstack-system';

let socket;

export default function useSocket(callback = null, memo = []) {
  if(!socket) {
    socket = io();
  }

  useEffect(() => {
    if (callback) {
      const ioEventHandlers = {};
      const publicIo = {
        ...socket,
        on: (ev, handler) => {
          if (!ioEventHandlers[ev]) {
            ioEventHandlers[ev] = new Set();
          }
          ioEventHandlers[ev].add(handler);
          socket.on(ev, handler);
        },
        removeListener: (ev, handler) => {
          if (ioEventHandlers[ev]) {
            ioEventHandlers[ev].delete(handler);
          }
          socket[ev].removeListener(ev, handler);
        },
      };

      callback(publicIo);

      return () => {
        Object.keys(ioEventHandlers).forEach((ev) => {
          ioEventHandlers[ev].forEach((x) => socket.removeListener(ev, x));
        });
      };
    }
  }, [ callback ].concat(memo));

  return socket;
}
