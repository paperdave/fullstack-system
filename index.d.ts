/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PRODUCTION: boolean;
    readonly IS_CLIENT: boolean;
    readonly IS_SERVER: boolean;
    readonly VERSION: string;
  }
  interface ProcessVersions {
    readonly fullstack_system: string;
    readonly express: string;
    readonly webpack: string;
    readonly socketio: string;
    readonly react: string;
  }
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// declare module '*.svg' {
//   import * as React from 'react';

//   export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

//   const src: string;
//   export default src;
// }

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'fullstack-system' {
  import { Router } from 'express';
  import { Server as SocketServer } from 'socket.io';

  export const io: SocketServer;
  export const app: Router;
  export const appStart: Router;
  export const rootRouter: Router;
  export const connect: SocketIOClientStatic;

  export function disableSocketServer(): void;
}
