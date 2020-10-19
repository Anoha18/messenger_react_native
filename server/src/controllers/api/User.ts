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
    this.router.get('/by', this.getUserBy);
    this.router.get('/logout', this.logout);
    this.router.get('/:id', this.getUserById);
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

  private async getUserById(req: Request, res: Response) {
    const { id } = (req.params as any) as { id: number };
    if (!id) return res.json({ error: 'User id not found' });

    const { user, error } = await User.getUserById(id);
    if (error) return res.json({ error });

    res.json({ result: user });
  }

  private async logout(req: Request, res: Response) {
    res.status(200).json({ result: true });
  }
}