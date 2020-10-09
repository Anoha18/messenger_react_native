import { Router, Request, Response, NextFunction } from 'express';
import BaseController from './BaseController';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { UserInterface } from '../interfaces/user';
import { JWT } from '../config';

const generateAccessJWT = (payload: any) => jwt
  .sign(payload, JWT.ACCESS_JWT_SECRET, { expiresIn: JWT.ACCESS_JWT_LIFE });

const generateRefreshJWT = (payload: any) => jwt
  .sign(payload, JWT.REFRESH_JWT_SECRET, { expiresIn: JWT.REFRESH_JWT_LIFE });

export default class AuthController extends BaseController {
  constructor() {
    super();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post('/login', this.login);
  }

  private login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', { session: false }, async (error: string, user: UserInterface, info: string) => {
      console.log('LOCAL AUTH ERROR: ', error);
      console.log('LOCAL AUTH INFO: ', info);

      if (error) { return res.json({ error }) }

      if (info) { return res.json({ error: info }) }

      if (!user) { return res.json({ error: 'Логин или пароль неверный' }) }

      const tokenPayload = { id: user.id };
      const accessToken = generateAccessJWT(tokenPayload);
      const refreshToken = generateRefreshJWT(tokenPayload);

      res.json({ result: {
        accessToken,
        refreshToken,
        user
      } });
    }) (req, res, next)
  }
}
