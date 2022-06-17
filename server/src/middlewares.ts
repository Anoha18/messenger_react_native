import App from './app';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import requestIp from 'request-ip';
import { jwt, local } from './auth_strategies';
import controllers from './controllers';
import { Request, Response, NextFunction } from 'express';
import { UserInterface } from './interfaces/user';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  if (user) {
    done(null, user as UserInterface);
  }
});

passport.use(jwt);
passport.use(local);

const getClientIp = (req: Request, res: Response, next: NextFunction) => {
  req.clientIp = requestIp.getClientIp(req) || undefined;
  next();
}

export default (app: App):void => {
  app.middlewares([
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true
    }),
    bodyParser.json({
      limit: '50mb',
    }),
    cookieParser(),
    passport.initialize(),
    { path: '*', func: getClientIp }
  ]);

  controllers(app);
};
