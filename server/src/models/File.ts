import { singleQuery, multiQuery } from '../db';
import { SaveFileParams, FileById } from '../interfaces/file';

export default class File {
  static async saveFile(params: SaveFileParams): Promise<{ file?: FileById, error?: string }> {
    const { row, error } = await singleQuery(`
      insert into files(file_name, file_path, mime_type, type, creator_id)
      values ($1, $2, $3, $4, $5)
      returning id
    `, [params.file_name, params.file_path, params.mime_type, params.type, params.creator_id])
    if (error) return { error }

    return File.getFileById(row.id);
  }

  static async getFileById(fileId: number): Promise<{ file?: FileById, error?: string }> {
    const { row, error } = await singleQuery(`
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
      where f.id = $1
      and f.deleted = false
    `, [fileId])
    if (error) return { error }

    return { file: row }
  }

  static async appendFileToMessage(messageId: number, fileId: number): Promise<{ error?: string }> {
    const { error } = await singleQuery(`
      insert into message_files(message_id, file_id)
      values ($1, $2)
    `, [messageId, fileId])

    return { error }
  }

  static async saveUserAvatar(userId: number, fileId: number): Promise<{ error?: string }> {
    const { row } = await singleQuery(`
      select ua.id from user_avatar ua
      where ua.user_id = $1
    `, [userId]);

    if (row && row.id) {
      const { error: updatedError } = await singleQuery(`
        update user_avatar set file_id = $2
        where user_id = $1
      `, [userId, fileId])

      return { error: updatedError };
    }

    const { error } = await singleQuery(`
      insert into user_avatar(user_id, file_id)
      values ($1, $2)
    `, [userId, fileId]);

    return { error };
  }
}