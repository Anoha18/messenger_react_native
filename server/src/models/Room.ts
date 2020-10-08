import { multiQuery } from '../db';

export class Room {
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
}
