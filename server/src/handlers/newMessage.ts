import { SocketUser } from '../interfaces/socket';
import { Message, MessageView, Room } from '../models';
import { socketServer } from '../index';
import updateChatRoomList from './updateChatRoomList';

interface NewMessageParams {
  text: string,
  parent_id?: number,
  room_id: number
}

export default async (socket: SocketUser, params: NewMessageParams) => {
  const { user } = socket.handshake;
  if (!user) return;

  const _message = {
    ...params,
    sender_id: user.id
  }

  const { message, error } = await Message.saveMessage(_message);
  if (error) {
    console.error(error);
    return socket.emit('event', { action: 'serverError', params: { error }});
  }

  if (!message) {
    const err = 'Message not saved'
    console.error(err);
    return socket.emit('event', { action: 'serverError', params: { error: err }});
  }
  
  const { messageView, error: saveMessageViewError } = await MessageView.saveMessageView({
    messageId: message.id,
    userId: user.id
  })

  if (saveMessageViewError) {
    console.error(saveMessageViewError);
    return socket.emit('event', { action: 'serverError', params: { error: saveMessageViewError }});
  }
  
  if (messageView) {
    message.views = [{
      user_id: messageView.user_id,
      id: messageView.id
    }]
  }

  const socketParams = {
    action: 'addedNewMessage',
    params: {
      message,
      roomId: params.room_id
    }
  }

  socketServer.getSocket().to(`chat-${params.room_id}`).emit('event', socketParams);
  await updateChatRoomList({ roomId: params.room_id })
}
