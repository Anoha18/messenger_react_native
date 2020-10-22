export interface SearchUserParam {
  searchText: string,
  limit?: number,
  offset?: number,
  userId: number
}

export interface UserInterface {
  id: number,
  login: string,
  name?: string,
  lastname?: string,
  deleted?: boolean,
  created_date?: string,
  created_time?: string,
  updated_date?: string,
  updated_time?: string,
  avatar?: {
    id: number,
    file_id: number,
    file_path: string
  }
}

export interface UserRegisterData {
  name: string,
  login: string,
  password: string
}

export interface UserUpdateParams {
  name: string,
  lastname?: string | null | undefined,
}