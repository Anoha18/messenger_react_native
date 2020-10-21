import { FileById } from './file';

export interface MessageById {
  id: number,
  text: string,
  room_id: number,
  parent_id: number,
  created_date: string,
  created_time: string,
  updated_date: string,
  updated_time: string,
  created_at: string,
  updated_at: string,
  views: Array<{ user_id: number, id: number }>,
  sender_id: number,
  sender: {
    id: number,
    name: string,
    lastname: string,
    login: string
  },
  file?: FileById
}

export interface MessageByRoomIdParams {
  roomId: number,
  limit?: number,
  offset?: number
}

export interface SaveMessageParams {
  text: string,
  room_id: number,
  sender_id: number,
  parent_id?: number,
}