export interface RoomById {
  id: number,
  name: string,
  type: string,
  created_time: string,
  created_date: string,
  updated_time: string,
  updated_date: string
}

export interface RoomCreateParams {
  name?: string,
  type_id?: number,
  creator_id: number,
}
