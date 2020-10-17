import { SocketUser } from '../interfaces/socket';
import { MessageView } from '../models';
import { socketServer } from '../index';
import updateChatRoomList from './updateChatRoomList';

interface ViewMessagesParams {
  roomId: number,
}

export default async(socket: SocketUser, params: ViewMessagesParams) => {
  if (!socket.handshake.user) return;
  const { user } = socket.handshake;
  const { roomId } = params;

  const { viewedMessages, error } = await MessageView.viewMessageByRoomId(roomId, user.id);
  if (error) {
    console.error(error);
    return socket.emit('event', { action: 'serverError', params: { error }});
  }

  socketServer.getSocket().to(`chat-${roomId}`).emit('event', { action: 'viewedMessages', params: {
    viewedMessages
  }});
  await updateChatRoomList({ roomId });
}
