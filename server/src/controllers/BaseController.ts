import { Router } from 'express';

export default class BaseController {
  protected router!: Router;

  constructor() {
    this.router = Router();
  }

  public getRouter():Router { return this.router; }
}