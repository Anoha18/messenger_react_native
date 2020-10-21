import multer from 'multer';
import path from 'path';
import fs from 'fs';
import BaseController from '../BaseController';
import { Request, Response } from 'express';
import { File } from '../../models';
import { UserInterface } from '../../interfaces/user';

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

  private async uploadFile(req: Request, res: Response) {
    const { file, user } = req;
    if (!user) return res.json({ error: 'User not found' });


    const { file: savedFile, error } = await File.saveFile({
      file_name: file.filename,
      file_path: `/uploads/${file.filename}`,
      mime_type: file.mimetype,
      creator_id: (user as UserInterface).id,
      type: (file.mimetype.split('/'))[0]
    });

    if (error) return res.json({ error });

    res.json({ result: savedFile });
  }
}