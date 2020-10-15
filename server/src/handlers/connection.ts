import { SocketUser } from '../interfaces/socket';
import { multiQuery } from '../db';
import updateChatRoomList from './updateChatRoomList';

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

  await joinSocketToRoom(socket);

  await updateChatRoomList({ userId: socket.handshake.user.id });
}
