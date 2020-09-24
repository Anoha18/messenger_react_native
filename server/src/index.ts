import App from './app';
import * as config from '../config';
import middlewares from './middlewares';

const app = new App(config.SERVER.HOST, config.SERVER.PORT);
middlewares(app);
app.start();
