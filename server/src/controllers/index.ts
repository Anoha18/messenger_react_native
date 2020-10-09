import { Application } from 'express';
import passport from 'passport';
import App from '../app';
import AuthController from './Auth';
import ApiController from './api';

const authController = new AuthController();
const apiController = new ApiController();

export default (app: App) => {
  const _app: Application = app.getApp();

  _app.use('/auth', authController.getRouter());
  _app.use('/api', passport.authenticate('jwt', { session: false }) , apiController.getRouter());
}