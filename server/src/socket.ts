import io, { Server, ServerOptions, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import MainServer from './server';
import { JWT } from '../config';
import { User, UserInterface } from './models';

export default class {
  private io:Server;
  private users:any = {};
  private sockets:any = {};

  constructor(server:MainServer, options?: ServerOptions) {
    this.io = io(server.getServer(), options);
    this.checkAuthorization();
    this.connection();
    // this.
    console.log('Socket is start');
  }

  private connection():void {
    this.io.on('connection', (socket:Socket) => {
      console.log('Connect new socket: ', socket.id);
      console.log('Headers: ', socket.handshake.headers);
      socket.on('disconnect', () => {
        const userId = this.users[socket.id];
        console.log('Disconnected socket: ', socket.id);
        console.log('Disconnected user id: ', userId);
        delete this.sockets[socket.id];
        delete this.users[socket.id];
      })
    })
  }

  private checkAuthorization():void {
    this.io.use(async(socket, next) => {
      if (!socket.handshake.headers.authorization) { return next('Authorization error: Not authorization header') }
      const { authorization }: { authorization: string } = socket.handshake.headers;

      if (!authorization.includes('Bearer')) { return next('Authorization error: Invalid Access Token') }
      const token: string = authorization.split(' ')[1];
      
      if (!token) { return next('Authorization error: Invalid Access Token') }
      const { tokenData, error } = this.decodeToken(token);

      if (error) { return next(`Authorization error: ${error}`) }
      const { id } = tokenData;

      const { user, error: getUserError }: { user?: UserInterface | undefined, error?: string | undefined } = await User.getUserById(id);
      if (getUserError) { return next(`Authorization error: ${getUserError}`)}

      if (!user) { return next(`Authorization error: User not found`) }

      this.users[socket.id] = socket.id;
      this.sockets[socket.id] = socket;
    })
  }

  private decodeToken(token:string):any {
    try {
      const tokenData = jwt.verify(token, JWT.ACCESS_JWT_SECRET);
      return { tokenData }
    } catch (error) {
      console.error(error);
      return { error: error.message }
    }
  }

  public getSocket():Server { return this.io; }
}