import { Request, Response } from 'express';
import BaseController from '../BaseController';
import { Room, Message, RoomUser } from '../../models';
import { UserInterface } from '../../interfaces/user';
import { singleQuery } from '../../db';

interface NewRoomBody {
  userId: number | string,
}

export default class ChatRoomController extends BaseController {
  constructor() {
    super();
    this.initRoute();
  }

  private initRoute():void {
    this.router.get('/with', this.getWith);
    this.router.put('/new', this.putNew);
  }

  private async getWith(req: Request, res: Response) {
    const { query, user } = req;
    const userIdList = [+(query as any).userId as number, (user as UserInterface).id];
    const { roomId, error } = await Room.getRoomIdByUsers({ userIdList });

    if (error) return res.json({ error });
    if (!roomId) return res.json({ result: roomId })

    const { room, error: getRoomByIdError } = await Room.getRoomById(roomId);
    if (getRoomByIdError) return res.json({ error: getRoomByIdError });

    const { messageList, error: getMessageListError } = await Message.getMessageListByRoomId({ roomId });
    if (getMessageListError) res.json({ error: getMessageListError })

    res.json({ result: { room, messageList } });
  }

  private async putNew(req: Request, res: Response) {
    const body: NewRoomBody = req.body as NewRoomBody;
    const user: UserInterface = req.user as UserInterface;
    const userIdList: Array<number> = [body.userId as number, user.id];
    const { roomId, error } = await Room.getRoomIdByUsers({ userIdList });

    if (error) return res.json({ error });
    if (roomId) {
      const { room, error: getRoomByIdError } = await Room.getRoomById(roomId);
      if (getRoomByIdError) return res.json({ error: getRoomByIdError });
      return res.json({ result: room });
    }

    const { row } = await singleQuery('select id from room_types where brief = $1', ['PRIVATE'])

    const { room, error: createRoomError } = await Room.createRoom({
      creator_id: user.id,
      type_id: row.id
    });
    if (createRoomError) return res.json({ error: createRoomError });
    if (!room) return res.json({ error: 'Room not created' });

    const { error: saveUsersListError } = await RoomUser.saveUsersByRoom(userIdList, room.id);
    if (saveUsersListError) return res.json({ error: saveUsersListError });

    res.json({ result: room });
  }
}