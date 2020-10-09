import BaseController from '../BaseController';
import { Request, Response } from 'express';
import { User } from '../../models';
import { UserInterface } from '../../interfaces/user';

export default class UserController extends BaseController {
  constructor() {
    super();
    this.initRoutes();
  }

  private initRoutes():void {
    this.router.get('/by', this.getUserBy)
  }

  private async getUserBy(req: Request, res: Response):Promise<void> {
    const { user } = req;
    const { error, userList } = await User.searchUser({
      searchText: req.query.searchText as string,
      limit: req.query.limit && (req.query as any).limit,
      offset: req.query.offset && (req.query as any).offset,
      userId: (user as UserInterface).id
    })
    if (error) res.json({ error });
    else res.json({ result: userList });
  }
}