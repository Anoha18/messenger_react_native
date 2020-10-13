import { SocketUser } from '../interfaces/socket';
import { Message, MessageView, Room } from '../models';

interface NewMessageParams {
  text: string,
  parent_id?: number,
  room_id: number
}

const sendToUsersRoom = async(socket: SocketUser) => {
  if (!socket.handshake.user) return;

  await Promise.all([Object.keys(socket.server.sockets.connected).forEach(async key => {
    const _socket:SocketUser = socket.server.sockets.connected[key];
    if (!_socket.handshake.user) return;

    const { roomList, error: getRoomListError } = await Room.getRoomList(_socket.handshake.user.id);
    if (getRoomListError) {
      console.error(getRoomListError);
      return _socket.emit('event', { action: 'serverError', params: { error: getRoomListError }});
    }

    _socket.emit('event', { action: 'updateChatRoomList', params: {
      chatRoomList: roomList,
    }});
  })])
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
      message
    }
  }
  socket.to(`chat-${params.room_id}`).emit('event', socketParams);
  socket.emit('event', socketParams);

  await sendToUsersRoom(socket);
}
