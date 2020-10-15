import App from './app';
import { SERVER, SOCKET } from './config';
import middlewares from './middlewares';
import Server from './server';
import Socket from './socket';

const app = new App();
const server = new Server(SERVER.HOST, SERVER.PORT, app);
const socketServer = new Socket(server, { path: SOCKET.PATH });
middlewares(app);
server.listen();

export {
  socketServer,
  server,
  app
}
