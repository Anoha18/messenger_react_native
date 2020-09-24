import express, { Router } from 'express';
import { testConnection } from './db';

interface AppRoute {
  route: string,
  router: Router
}

export default class App {
  private host:string;
  private port:number;
  private app:express.Application;

  constructor(host:string, port:number) {
    this.host = host || 'localhost';
    this.port = port || 3000;
    this.app = express();
    this.testConnectionToDb();
  }

  private async testConnectionToDb() {
    const { error } = await testConnection();
    if (error) {
      throw new Error(error);
    }
  }

  public start():void {
    this.app.listen(this.port, this.host, () => {
      console.log(`Server is running on http://${this.host}:${this.port}`);
    });
  }

  public middlewares(middlewares: Array<any>):void {
    middlewares.forEach(middleware => this.app.use(middleware));
  }

  public routes(routes: Array<AppRoute>):void {
    routes.forEach(router => this.app.use(router.route, router.router));
  }
}
