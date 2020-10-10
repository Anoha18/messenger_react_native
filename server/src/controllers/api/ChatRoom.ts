import { Request, Response } from 'express';
import BaseController from '../BaseController';
import { Room } from '../../models';
import { UserInterface } from '../../interfaces/user';

export default class ChatRoomController extends BaseController {
  constructor() {
    super();
    this.initRoute();
  }

  private initRoute():void {
    this.router.use('/with', this.getWith);
  }

  private async getWith(req: Request, res: Response) {
    const { query, user } = req;
    const userIdList = [(query as any).userId as number, (user as UserInterface).id];
    const { roomId, error } = await Room.getRoomIdByUsers({ userIdList });

    if (error) return res.json({ error });
    if (!roomId) return res.json({ result: roomId })

    const { room, error: getRoomByIdError } = await Room.getRoomById(roomId);
    if (getRoomByIdError) return res.json({ error: getRoomByIdError });

    res.json({ result: room });
  }
}