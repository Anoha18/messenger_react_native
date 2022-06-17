import http, { Server } from 'http';
import App from './app';

export default class {
  private host:string;
  private port:number;
  private server:Server;

  constructor(host:string, port:number, app:App) {
    this.host = host;
    this.port = port;
    this.server = http.createServer(app.getApp());
  }

  public listen():void {
    this.server.listen(this.port, () =>{
      console.log(`Server is running on http://${this.host}:${this.port}`);
    })
  }

  public getServer():Server {
    return this.server;
  }
}