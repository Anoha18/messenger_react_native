import { multiQuery, singleQuery } from '../db';
import { RoomById, RoomCreateParams } from '../interfaces/room';

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

  static async getRoomIdByUsers({ userIdList } : {userIdList: Array<number>}): Promise<{ roomId?: number | null, error?: string }> {
    const { row, error } = await singleQuery(`
      select r.id
      from rooms r
      inner join room_types rt on rt.id = r.type_id
      where r.deleted = false
      and rt.brief = 'PRIVATE'
      and exists ${userIdList.map(userId => `(
        select 1 from room_users ru
        where ru.room_id = r.id
        and ru.user_id = ${userId}
      )`).join(' and exists ')}
    `);
    
    if (error) { return { error } }

    return { roomId: (row && row.id) || null }
  }

  static async getRoomById(roomId: number): Promise<{ room?: RoomById, error?: string }> {
    const { row, error } = await singleQuery(`
      select
        r.id,
        r.name,
        rt.name as type,
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

  static async createRoom(params: RoomCreateParams): Promise<{ room?: RoomById, error?: string }> {
    const { name, creator_id, type_id } = params;
    const { row, error } = await singleQuery(`
      insert into rooms(name, type_id, creator_id)
      values ($1, $2, $3)
      returning id
    `, [name, type_id, creator_id]);

    if (error) return { error };
    if (!row) return { error: 'Room not created' }

    return this.getRoomById(row.id);
  }
}
