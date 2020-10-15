import { multiQuery, singleQuery } from '../db';
import {
  MessageView,
  SaveMessageViewParams,
  MessageViewByRoomIdReturn
} from '../interfaces/messageViews';

export default class MessageViews {
  static async saveMessageView(params: SaveMessageViewParams): Promise<{ messageView?: MessageView, error?: string }> {
    const { row, error } = await singleQuery(`
      insert into message_views(message_id, user_id)
      values ($1, $2)
      returning id
    `, [params.messageId, params.userId]);

    if (error) return { error }

    return MessageViews.getMessageViewById(row.id);
  }

  static async getMessageViewById(messageViewId: number): Promise<{ messageView?: MessageView, error?: string }> {
    const { row, error } = await singleQuery(`
      select
        mv.id,
        mv.message_id,
        mv.user_id,
        to_char(mv.created_at, 'DD.MM.YYYY') created_date,
        to_char(mv.created_at, 'HH24:MI') created_time
      from message_views mv
      where mv.id = ${messageViewId}
    `);

    if (error) return { error }

    return { messageView: row }
  }

  static async viewMessageByRoomId(roomId: number, userId: number): Promise<{ viewedMessages?: Array<MessageViewByRoomIdReturn>, error?: string }> {
    const { error, rows } = await multiQuery(`
      insert into message_views(message_id, user_id)
      select
        m.id,
        $2
      from messages m
      where m.room_id = $1
      and not exists (
        select 1 from message_views mv
        where mv.message_id = m.id
        and mv.user_id = $2
      )
      returning id, message_id, user_id
    `, [roomId, userId]);
    if (error) return { error }

    return { viewedMessages: rows };
  }
}