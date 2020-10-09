export interface SearchUserParam {
  searchText: string,
  limit?: number,
  offset?: number
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
}