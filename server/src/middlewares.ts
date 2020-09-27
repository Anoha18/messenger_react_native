import App from './app';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { jwt, local } from './auth_strategies';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(jwt);
passport.use(local);

export default (app: App):void => {
  app.middlewares([
    bodyParser.urlencoded({
      extended: true
    }),
    bodyParser.json(),
    cookieParser(),
    passport.initialize()
  ])
};