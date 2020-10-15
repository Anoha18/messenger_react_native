import { Room } from '../models';
import { socketServer } from '../index';
import { multiQuery } from '../db';

interface UpdateChatRoomParams {
  userId?: number,
  roomId?: number
}

const sendToUserId = async (userId: number) => {
  const socketIds = socketServer.getUsers().get(userId);
  const { roomList, error } = await Room.getRoomList(userId);
  if (error) {
    console.error(error);
    return socketIds?.forEach(socketId => socketServer.getSocket().to(socketId).emit('event', { action: 'serverError', params: { error }}))
  }

  socketIds?.forEach(socketId => socketServer.getSocket().to(socketId).emit('event', { action: 'updateChatRoomList', params: {
    chatRoomList: roomList,
  }}))
}

const sendToRoomId = async (roomId: number) => {
  const { rows, error } = await multiQuery(`
    select
      ru.user_id
    from room_users ru
    where ru.room_id = $1
  `, [roomId]);

  if (error) {
    return console.error(error);
  }

  if (rows && rows.length) {
    await Promise.all([rows.map(async row => {
      const { user_id }:{ user_id: number } = row;
      await sendToUserId(user_id)
    })])
  }
}

export default (params: UpdateChatRoomParams) => {
  if (params.userId) {
    return sendToUserId(params.userId);
  } else if (params.roomId) {
    return sendToRoomId(params.roomId)
  }
}
