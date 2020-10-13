import { SocketUser } from '../interfaces/socket';
import { Room } from '../models';
import { multiQuery } from '../db';

const joinSocketToRoom = async (socket: SocketUser) => {
  if (!socket.handshake.user) return;

  const { rows, error } = await multiQuery(`
    select
      r.id
    from rooms r
    where r.deleted = false
    and exists (
      select 1 from room_users ru
      where ru.room_id = r.id
      and ru.user_id = ${socket.handshake.user.id}
    )
  `);

  if (error) {
    console.error(error);
    return socket.emit('event', { action: 'serverError', params: { error }});
  }

  if (rows) {
    for (const room of rows) {
      socket.join(`chat-${room.id}`);
    }
  }
}

export default async (socket:SocketUser) => {
  if (!socket.handshake.user) return;

  const { roomList, error } = await Room.getRoomList(socket.handshake.user.id);
  if (error) {
    console.error(error);
    return socket.emit('event', { action: 'serverError', params: { error }});
  }

  await joinSocketToRoom(socket);

  socket.emit('event', { action: 'updateChatRoomList', params: {
    chatRoomList: roomList,
  }});
}
