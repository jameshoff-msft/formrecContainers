import { Router } from 'express';
import FileController from '@controllers/file.controller';
import { Routes } from '@interfaces/routes.interface';

class FileRoute implements Routes {
  public path = '/docs';
  public router = Router();
  public fileController = new FileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.fileController.getFilenames);
    this.router.get(`${this.path}/download/:filename`, this.fileController.download);
    this.router.get(`${this.path}/:filename`, this.fileController.readText);
    this.router.post(`${this.path}`, this.fileController.writeText);
  }
}

export default FileRoute;