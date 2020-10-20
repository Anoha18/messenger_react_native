import { singleQuery, multiQuery } from '../db';
import { SaveFileParams, FileById } from '../interfaces/file';

export default class File {
  static async saveFile(params: SaveFileParams): Promise<{ file?: FileById, error?: string }> {
    // TODO: реализовать сохранение файла
    // return this.getFileById()
  }

  static async getFileById(fileId: number): Promise<{ file?: FileById, error?: string }> {
    // TODO: реализовать получение файла по id
  }
}