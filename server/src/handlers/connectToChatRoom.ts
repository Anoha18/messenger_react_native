import { SocketUser } from '../interfaces/socket';
import { Message, Room, MessageView } from '../models'
import updateChatRoomList from './updateChatRoomList';

interface ConnectToChatRoomParams {
  roomId: number
}

export default async (socket:SocketUser, params: ConnectToChatRoomParams) => {
  socket.join(`chat-${params.roomId}`);
  const { user } = socket.handshake;
  if (user) {
    const { error } = await MessageView.viewMessageByRoomId(params.roomId, user.id);
    if (error) {
      console.error(error);
      socket.emit('event', { action: 'serverError', params: { error }});
    }
  }
  const { messageList, error } = await Message.getMessageListByRoomId({ roomId: params.roomId });
  const { room, error: getRoomByIdError } = await Room.getRoomById(params.roomId);

  if (error) {
    console.error(error);
    return socket.emit('event', { action: 'serverError', params: { error }});
  }

  if (getRoomByIdError) {
    console.error(getRoomByIdError);
    return socket.emit('event', { action: 'serverError', params: { error: getRoomByIdError }});
  }

  socket.emit('event', { action: 'connectedToChatRoom',
    params: {
      messageList,
      chatRoom: room
    }
  })
  return updateChatRoomList({ roomId: params.roomId })
}
