import express, { Router } from 'express';
import { testConnection } from './db';

interface AppRoute {
  route: string,
  router: Router
}

export default class App {
  private app:express.Application;

  constructor() {
    this.app = express();
    this.testConnectionToDb();
  }

  private async testConnectionToDb() {
    const { error } = await testConnection();
    if (error) {
      throw new Error(error);
    }
  }

  public middlewares(middlewares: Array<any>):void {
    middlewares.forEach(middleware => this.app.use(middleware));
  }

  public routes(routes: Array<AppRoute>):void {
    routes.forEach(router => this.app.use(router.route, router.router));
  }

  public getApp():express.Application {
    return this.app;
  }
}
