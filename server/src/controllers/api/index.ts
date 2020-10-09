import BaseController from '../BaseController';
import UserController from './User';

const userController = new UserController();

export default class ApiController extends BaseController {
  constructor() {
    super();
    this.initControllers();
  }

  private initControllers():void {
    this.router.use('/user', userController.getRouter());
  }
}