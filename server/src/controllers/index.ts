import { Application } from 'express';
import App from '../app';
import AuthController from './Auth';

const authController = new AuthController();

export default (app: App) => {
  const _app: Application = app.getApp();

  _app.use('/auth', authController.getRouter());
}