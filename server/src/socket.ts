import io, { Server, ServerOptions, Socket } from 'socket.io';
import MainServer from './server';

export default class {
  private io:Server;

  constructor(server:MainServer, options?: ServerOptions) {
    this.io = io(server.getServer(), options);
    this.connection();
    console.log('Socket is start');
  }

  private connection():void {
    this.io.on('connection', (socket:Socket) => {
      console.log('Connect new socket: ', socket.id);
    })
  }
}