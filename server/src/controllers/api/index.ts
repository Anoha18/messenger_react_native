import BaseController from '../BaseController';
import UserController from './User';
import ChatRoomController from './ChatRoom';
import FileController from './File';

const userController = new UserController();
const chatRoomController = new ChatRoomController();
const fileController = new FileController();

export default class ApiController extends BaseController {
  constructor() {
    super();
    this.initControllers();
  }

  private initControllers():void {
    this.router.use('/user', userController.getRouter());
    this.router.use('/chat', chatRoomController.getRouter());
    this.router.use('/file', fileController.getRouter());
  }
}