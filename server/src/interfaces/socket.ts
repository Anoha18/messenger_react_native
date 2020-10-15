import io, { Handshake, Socket } from 'socket.io';
import { UserInterface } from './user';

interface HandshakeUser extends Handshake {
  user?: UserInterface
}

interface SocketUser extends Socket {
  handshake: HandshakeUser
}

interface RequestEventPayload {
  action: string,
  params?: any,
}

export {
  HandshakeUser,
  SocketUser,
  RequestEventPayload
}