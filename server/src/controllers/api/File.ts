import multer from 'multer';
import path from 'path';
import fs from 'fs';
import BaseController from '../BaseController';
import { Request, Response } from 'express';

export default class FileController extends BaseController {
  private uploadPath = path.join(__dirname + '../../../../uploads');
  private storageConfig = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname + '../../../../uploads'))
    },
    filename(req: Request, file: Express.Multer.File, cb) {
      cb(null, `${+new Date()}_${file.originalname}`);
    }
  })
  private upload = multer({
    storage: this.storageConfig
  });

  constructor() {
    super();
    this.checkFolder();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/upload', multer({ storage: this.storageConfig }).single('file'), this.uploadFile);
  }

  private checkFolder() {
    if (fs.existsSync(this.uploadPath)) {
      return;
    }

    fs.mkdirSync(this.uploadPath);
  }

  private uploadFile(req: Request, res: Response) {
    console.log(req);
    console.log(req.file);
    res.json({ result: true });
  }
}