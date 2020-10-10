import BaseController from '../BaseController';
import UserController from './User';
import ChatRoomController from './ChatRoom';

const userController = new UserController();
const chatRoomController = new ChatRoomController();

export default class ApiController extends BaseController {
  constructor() {
    super();
    this.initControllers();
  }

  private initControllers():void {
    this.router.use('/user', userController.getRouter());
    this.router.use('/chat', chatRoomController.getRouter());
  }
}