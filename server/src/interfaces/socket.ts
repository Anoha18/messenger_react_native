import io, { Handshake, Socket } from 'socket.io';
import { UserInterface } from '../models';

interface HandshakeUser extends Handshake {
  user?: UserInterface
}

interface SocketUser extends Socket {
  handshake: HandshakeUser
}

interface ConnectedUser {
  user_id: number,
  socket_id: string
}

interface RequestEventPayload {
  action: string,
  params?: any,
}

export {
  HandshakeUser,
  SocketUser,
  ConnectedUser,
  RequestEventPayload
}