import App from './app';
import config from './config';

const app = new App(config.SERVER.HOST, config.SERVER.PORT);
app.start();
