import { SocketUser } from '../interfaces/socket';
import { Message } from '../models'

interface ConnectToChatRoomParams {
  roomId: number
}

export default async (socket:SocketUser, params: ConnectToChatRoomParams) => {
  socket.join(`chat-${params.roomId}`);
  const { messageList, error } = await Message.getMessageListByRoomId({ roomId: params.roomId });

  if (error) {
    console.error(error);
  }

  try {
    socket.emit('event', {
      action: 'connectedToChatRoom',
      params: {
        messageList
      }
    })
  } catch (error) {
    console.error(error);
  }
}
