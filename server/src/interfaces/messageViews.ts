export interface MessageView {
  id: number,
  message_id: number,
  user_id: number,
  created_date: string,
  created_time: string
}

export interface SaveMessageViewParams {
  userId: number,
  messageId: number
}

export interface MessageViewByRoomIdReturn {
  id: number,
  message_id: number,
  user_id: number,
}