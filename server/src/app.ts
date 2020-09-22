import express from 'express';

export default class App {
  private host:string;
  private port:number;
  private app:express.Application;

  constructor(host:string, port:number) {
    this.host = host || 'localhost';
    this.port = port || 3000;
    this.app = express();
  }

  start():void {
    this.app.listen(this.port, this.host, () => {
      console.log(`Server is running on http://${this.host}:${this.port}`);
    })
  }
};
