import { multiQuery, singleQuery } from '../db';
import { RoomById, RoomCreateParams } from '../interfaces/room';

export default class Room {
  static async getRoomList(userId:number, limit?: number, offset?: number): Promise<{ roomList?: any, error?: string }> {
    const { rows, error } = await multiQuery(`
      select
        r.id,
        r.name,
        to_char(r.created_at, 'DD.MM.YYYY') created_date,
        to_char(r.created_at, 'HH24:MI') created_time,
        rt.name type_name,
        rt.brief type_brief,
        rt.id type_id,
        (
          select count(*) from messages m
          where m.room_id = r.id
          and m.deleted = false
          and m.id not in (
              select mv.message_id from message_views mv
              where mv.message_id = m.id
              and mv.user_id = ${userId}
              )
        ) not_view_count ,
        (
          select row_to_json(t) from (
            select
              m.id,
              sender_id,
              text,
              to_char(m.created_at, 'DD.MM.YYYY') created_date,
              to_char(m.created_at, 'HH24:MI') created_time,
              to_char(m.updated_at, 'DD.MM.YYYY') updated_date,
              to_char(m.updated_at, 'HH24:MI') updated_time,
              m.created_at,
              m.updated_at,
              (
                select row_to_json(t) from (
                  select u.id, u.name, u.lastname, u.login from users u
                  where u.id = m.sender_id
                  and u.deleted = false
                ) t
              ) sender,
              (
                select json_agg(t) from (
                  select
                    mv.id,
                    mv.user_id
                  from message_views mv
                  where mv.message_id = m.id
                ) as t
              ) as views,
              (
                select row_to_json(t) from (
                  select
                    f.id,
                    f.file_path,
                    f.file_name,
                    f.mime_type,
                    f.type,
                    f.creator_id,
                    to_char(f.created_at, 'DD.MM.YYYY') created_date,
                    to_char(f.created_at, 'HH24:MI') created_time,
                    (
                      select row_to_json(t) from (
                        select
                          u.id,
                          u.name,
                          u.lastname,
                          u.login
                        from users u
                        where u.id = f.creator_id
                        and u.deleted = false
                      ) t
                    ) creator
                  from files f
                  where exists (
                    select 1 from message_files mf
                    where mf.message_id = m.id
                    and mf.file_id = f.id
                  )
                  and f.deleted = false
                  limit 1
                ) t
              ) as file
            from messages m
            where m.room_id = r.id
            and m.deleted = false
            order by created_at desc
            limit 1
          ) t
        ) last_message,
        (
          select row_to_json(t) from (
            select
              u.id,
              u.name,
              u.lastname,
              u.login,
              (
                select row_to_json(t) from (
                  select
                    ua.id,
                    ua.file_id,
                    f.file_path
                  from user_avatar ua
                  inner join files f on f.id = ua.file_id
                  where ua.user_id = u.id
                  and f.deleted = false
                  limit 1
                ) t
              ) avatar
            from users u
            where exists (
              select 1 from room_users ru
              where ru.room_id = r.id
              and u.id != ${userId}
              and ru.user_id = u.id
              and u.deleted = false
              limit 1
            )
          ) t
        ) recipient
      from rooms r
      inner join room_types rt on rt.id = r.type_id
      where exists (
        select 1 from room_users ru
        where ru.room_id = r.id
        and ru.user_id = ${userId}
      )
      and r.deleted = false
      order by (
        select m.created_at from messages m
        where m.room_id = r.id
        and m.deleted = false
        order by m.created_at desc
        limit 1
      ) desc
    `);

    if (error) return { error }
    
    return { roomList: rows }
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
        to_char(r.updated_at, 'DD.MM.YYYY') updated_date,
        (
          select json_agg(t) from (
            select
              u.id,
              u.name,
              u.lastname,
              u.login,
              (
                select row_to_json(t) from (
                  select
                    ua.id,
                    ua.file_id,
                    f.file_path
                  from user_avatar ua
                  inner join files f on f.id = ua.file_id
                  where ua.user_id = u.id
                  and f.deleted = false
                ) t
              ) avatar
            from users u
            where exists (
              select 1 from room_users ru
              where ru.user_id = u.id
              and ru.room_id = r.id
            )
          ) t
        ) users
      from rooms r
      inner join room_types rt on rt.id = r.type_id
      where r.deleted = false
      and r.id = ${roomId}
    `);
    if (error) return { error }
    return { room: row }
  }

  static async createRoom(params: RoomCreateParams): Promise<{ roomId?: number, error?: string }> {
    const { name, creator_id, type_id } = params;
    const { row, error } = await singleQuery(`
      insert into rooms(name, type_id, creator_id)
      values ($1, $2, $3)
      returning id
    `, [name, type_id, creator_id]);

    if (error) return { error };
    if (!row) return { error: 'Room not created' }

    return { roomId: row.id };
  }
}
