import { useEffect } from 'react';
import { io } from '@fullstack-system';

let socket;

export default function useGlobalSocket(callback = null, memo = []) {
  if(!socket) {
    socket = io();
  }

  useEffect(() => {
    if (callback) {
      const ioEventHandlers = {};
      const publicIo = {
        ...io,
        on: (ev, handler) => {
          if (!ioEventHandlers[ev]) {
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
      };

      callback(publicIo);

      return () => {
        Object.keys(ioEventHandlers).forEach((ev) => {
          ioEventHandlers[ev].forEach((x) => io.removeListener(ev, x));
        });
      };
    }
  }, [ callback ].concat(memo));

  return socket;
}
