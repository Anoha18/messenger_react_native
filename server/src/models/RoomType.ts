import { singleQuery } from '../db';
import { RoomType } from '../interfaces/roomType';

export default class RoomTypeModel {
  static async getByBrief(brief: string): Promise<RoomType> {
    const roomType = (await singleQuery(`
      select * from room_types where brief = $1
    `, [brief])).row as RoomType;

    return roomType;
  }
}