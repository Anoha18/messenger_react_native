import io, { Server, ServerOptions } from 'socket.io';
import jwt from 'jsonwebtoken';
import MainServer from './server';
import { JWT } from './config';
import { User } from './models';
import { ConnectedUser, SocketUser, RequestEventPayload } from './interfaces/socket';
import { UserInterface } from './interfaces/user';
import handlers from './handlers';

export default class {
  private io:Server;
  private users:Array<ConnectedUser> = [];
  private sockets:Array<SocketUser> = [];

  constructor(server:MainServer, options?: ServerOptions) {
    this.io = io(server.getServer(), options);
    this.checkAuthorization();
    this.connection();
    console.log('Socket is start');
  }

  private connection():void {
    this.io.on('connection', (socket:SocketUser) => {
      socket.on('disconnect', (reason) => this.disconnect(socket, reason));
      socket.on('request', (args) => this.request(socket, args))
    })
  }

  private checkAuthorization():void {
    this.io.use(async(socket: SocketUser, next) => {
      try {
        if (!socket.handshake.headers.authorization) { return next(new Error('Authorization error: Not authorization header')) }
        const { authorization }: { authorization: string } = socket.handshake.headers;
  
        if (!authorization.includes('Bearer')) { return next(new Error('Authorization error: Invalid Access Token')) }
        const token: string = authorization.split(' ')[1];
        
        if (!token) { return next(new Error('Authorization error: Invalid Access Token')) }
        const { tokenData, error } = this.decodeToken(token);
  
        if (error) { return next(new Error(`Authorization error: ${error}`)) }
        const { id } = tokenData;
  
        const { user, error: getUserError }: { user?: UserInterface | undefined, error?: string | undefined } = await User.getUserById(id);
        if (getUserError) { return next(new Error(`Authorization error: ${getUserError}`)) }
  
        if (!user) { return next(new Error(`Authorization error: User not found`)) }
  
        if (this.users.find(_user => _user.user_id === user.id)) {
          this.users[this.users.findIndex(_user => _user.user_id === user.id)].socket_id = socket.id;
        } else {
          this.users.push({
            user_id: user.id,
            socket_id: socket.id
          })
        }

        if (!this.sockets.find(_socket => _socket.id === socket.id)) {
          this.sockets.push(socket);
        }

        socket.handshake.user = user;
        next();
      } catch (error) {
        console.error(error);
        next(error);
      }
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

  private disconnect(socket:SocketUser, reason:string) {
    const { handshake: { user } } = socket;
    console.log('Disconnect user reason: ', reason);
    console.log('Disconnected socket: ', socket.id);
    console.log('Disconnected user id: ', user && user.id);
    this.users.splice(this.users.findIndex(_user => _user.user_id === (user && user.id)), 1);
    this.sockets.splice(this.sockets.findIndex(_socket => _socket.id === socket.id));
  }

  private request(socket:SocketUser, payload:RequestEventPayload) {
    console.log('HERE PAYLOAD: ', payload);
    console.log('HERE USERS: ', this.users);
    console.log('HERE SOCKET: ', socket);
    if (!(handlers as any)[payload.action]) return;
    (handlers as any)[payload.action](socket, payload.params);
  }

  public getSocket():Server { return this.io; }
}