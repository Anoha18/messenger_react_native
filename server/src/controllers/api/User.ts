import BaseController from '../BaseController';
import { Request, Response } from 'express';
import { User, File } from '../../models';
import { UserInterface } from '../../interfaces/user';

interface UserUpdateBody {
  name: string,
  lastname?: string | null | undefined,
  file_id?: number | null | undefined
}

export default class UserController extends BaseController {
  constructor() {
    super();
    this.initRoutes();
  }

  private initRoutes():void {
    this.router.get('/by', this.getUserBy);
    this.router.get('/logout', this.logout);
    this.router.get('/:id', this.getUserById);
    this.router.post('/update', this.updateUser);
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

  private async updateUser(req: Request, res: Response) {
    const user: UserInterface = req.user as UserInterface;
    const body:UserUpdateBody = req.body as UserUpdateBody;

    if (!user) return res.json({ error: 'Not found user' });

    try {
      if (body.file_id) {
        const { error } = await File.saveUserAvatar(user.id, body.file_id);
        if (error) {
          console.error('SAVE USER AVATAR ERRROR: ', error);
        }
      }
  
      const { user: updatedUser, error } = await User.updateUserById(user.id, { name: body.name, lastname: body.lastname });
      if (error) return res.json({ error });
  
      res.json({ result: updatedUser });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Update user ', error.message);
        res.json({ error: error.message });
      } else {
        console.error(error)
        res.json({ error });
      }
    }
  }
}