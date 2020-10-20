export interface SaveFileParams {
  file_name: string,
  file_path: string,
  mime_type: string,
  type: string,
  creator_id: number,
  deleted?: boolean,
}

export interface FileById {
  file_name: string,
  file_path: string,
  mime_type: string,
  type: string,
  creator_id: number,
  created_date: string,
  created_time: string,
  creator: {
    id: number,
    name: string,
    lastname: string,
    login: string
  }
}