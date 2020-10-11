import { singleQuery } from '../db';
import { RoomUser as RoomUserInterface } from '../interfaces/roomUser';

export default class RoomUser {
  static async saveUsersByRoom(userIdList: Array<number>, roomId: number): Promise<{ roomUserList?: Array<RoomUserInterface>, error?: string }> {
    if (!roomId) return { error: 'Room id was not passed to function parameters' }
  
    const roomUserList: Array<RoomUserInterface> = []
    for (const userId of userIdList) {
      const { row, error } = await singleQuery(`
        insert into room_users (room_id, user_id)
        values ($1, $2)
        returning id, room_id, user_id
      `, [roomId, userId]);

      if (error) return { error }
      roomUserList.push(row);
    }

    return { roomUserList }
  }
}