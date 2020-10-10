import { multiQuery, singleQuery } from '../db';
import { RoomById } from '../interfaces/room';

export default class Room {
  static async getRoomList(userId:number, limit: number, offset: number) {
    // TODO: dont working
    const { rows } = await multiQuery(`
      select
        r.id,
        r.name,
        to_char(r.created_at, 'DD.MM.YYYY') created_date,
        to_char(r.created_at, 'HH24:MI') created_time,
        (
          select
            m.id,
            sender_id,
            text
          from messages m
          where m.room_id = r.id
          and m.deleted = false
          order by created_at desc
          limit 1
        )
      from rooms r
      inner join room_users ru on ru.room_id = r.id
      where r.user_id = ${userId}
      order by 
    `)
  }

  static async getRoomIdByUsers({ userIdList } : {userIdList: Array<number>}): Promise<{ roomId?: number, error?: string }> {
    const { row, error } = await singleQuery(`
      select r.id
      from rooms r
      inner join room_types rt on rt.id = r.type_id
      where r.deleted = false
      and rt.brief = 'PRIVATE'
      and exists (
        select 1 from room_users ru
        where ru.room_id = r.id
        and ${userIdList.map(userId => `ru.user_id = ${userId}`).join(' and ')}
      )
    `);
    
    if (error) { return { error } }

    return { roomId: row.id }
  }

  static async getRoomById(roomId: number): Promise<{ room?: RoomById, error?: string }> {
    const { row, error } = await singleQuery(`
      select
        r.id,
        r.name,
        rt.name type,
        to_char(r.created_at, 'DD.MM.YYYY') created_date,
        to_char(r.created_at, 'HH24:MI') created_time,
        to_char(r.updated_at, 'HH24:MI') updated_time,
        to_char(r.updated_at, 'DD.MM.YYYY') updated_date
      from rooms r
      inner join room_types rt on rt.id = r.type_id
      where r.deleted = false
      and r.id = ${roomId}
    `);
    if (error) return { error }
    return { room: row }
  }
}
