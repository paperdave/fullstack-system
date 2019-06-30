import { Router } from 'express';
import { Server as SocketServer } from 'socket.io';
import * as SocketClient from 'socket.io-client';

export const io: SocketServer;
export const app: Router;
export const appStart: Router;
export const connect: typeof SocketClient;
