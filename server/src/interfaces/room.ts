export interface RoomById {
  id: number,
  name: string,
  type: string,
  created_time: string,
  created_date: string,
  updated_time: string,
  updated_date: string,
  users: null | Array<RoomByIdUser>,
}

export interface RoomCreateParams {
  name?: string,
  type_id?: number,
  creator_id: number,
}

export interface RoomByIdUser {
  id: number,
  name: string,
  lastname: string,
  login: string,
}
