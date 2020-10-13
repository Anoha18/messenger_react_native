import { multiQuery, singleQuery } from '../db';
import {
  MessageById,
  MessageByRoomIdParams,
  SaveMessageParams
} from '../interfaces/message';

export default class Message {
  static async getMessageListByRoomId({ roomId, limit, offset } : MessageByRoomIdParams): Promise<{ messageList?: Array<MessageById>, error?: string }> {
    const { rows, error } = await multiQuery(`
      select
        m.id,
        m.text,
        m.room_id,
        m.parent_id,
        to_char(m.created_at, 'DD.MM.YYYY') created_date,
        to_char(m.created_at, 'HH24:MI') created_time,
        to_char(m.updated_at, 'DD.MM.YYYY') updated_date,
        to_char(m.updated_at, 'HH24:MI') updated_time,
        m.created_at,
        m.updated_at,
        (
          select json_agg(t) from (
            select
              mv.id,
              mv.user_id
            from message_views mv
            where mv.message_id = m.id
          ) as t
        ) as views,
        m.sender_id,
        (
          select row_to_json(t) from (
            select
              u.name,
              u.lastname,
              u.login,
              u.id
            from users u
            where u.id = m.sender_id
          ) t
        ) as sender
      from messages m
      where m.room_id = ${roomId}
      and m.deleted = false
      order by m.created_at desc
      ${(limit && `limit ${limit}`) || ''} ${(offset && `offset ${offset}`) || ''}
    `);

    if (error) return { error }

    return { messageList: rows }
  }

  static async getMessageById(messageId: number): Promise<{ message?: MessageById, error?: string }> {
    const { row, error } = await singleQuery(`
      select
        m.id,
        m.text,
        m.room_id,
        m.parent_id,
        to_char(m.created_at, 'DD.MM.YYYY') created_date,
        to_char(m.created_at, 'HH24:MI') created_time,
        to_char(m.updated_at, 'DD.MM.YYYY') updated_date,
        to_char(m.updated_at, 'HH24:MI') updated_time,
        m.created_at,
        m.updated_at,
        (
          select json_agg(t) from (
            select
              mv.id,
              mv.user_id
            from message_views mv
            where mv.message_id = m.id
          ) as t
        ) as views,
        m.sender_id,
        (
          select row_to_json(t) from (
            select
              u.name,
              u.lastname,
              u.login,
              u.id
            from users u
            where u.id = m.sender_id
          ) t
        ) as sender
      from messages m
      where m.id = ${messageId}
      and m.deleted = false
    `)

    if (error) return { error };

    return { message: row }
  }

  static async saveMessage(params: SaveMessageParams): Promise<{ message?: MessageById, error?: string }> {
    const { text, parent_id, sender_id, room_id } = params;
    const { row, error } = await singleQuery(`
      insert into messages (text, parent_id, sender_id, room_id)
      values ($1, $2, $3, $4)
      returning id
    `, [text, parent_id, sender_id, room_id]);

    if (error) return { error }

    return this.getMessageById(row.id);
  }
}
