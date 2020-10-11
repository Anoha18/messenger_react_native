import { SocketUser } from '../interfaces/socket';
import { Message, MessageView } from '../models';

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
    return console.error(error);
  }

  if (!message) return console.error('Message not saved');
  
  const { messageView, error: saveMessageViewError } = await MessageView.saveMessageView({
    messageId: message.id,
    userId: user.id
  })

  if (saveMessageViewError) console.error(saveMessageViewError);
  
  if (messageView) {
    message.views = [{
      user_id: messageView.user_id,
      id: messageView.id
    }]
  }

  const socketParams = {
    action: 'addedNewMessage',
    params: {
      message
    }
  }
  socket.to(`chat-${params.room_id}`).emit('event', socketParams);
  socket.emit('event', socketParams);
}
