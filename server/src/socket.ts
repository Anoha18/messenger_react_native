import io, { Server, ServerOptions } from 'socket.io';
import MainServer from './server';

export default class {
  private io:Server;

  constructor(server:MainServer, options?: ServerOptions) {
    this.io = io(server.getServer(), options);
    this.connection();
    console.log('Socket is start');
  }

  private connection():void {
    this.io.on('connection', socket => {
      console.log('Connect new socket: ', socket);
    })
  }
}