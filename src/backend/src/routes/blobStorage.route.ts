import { Router } from 'express';
import BlobController from '@controllers/blob.controller';
import { Routes } from '@interfaces/routes.interface';

class FileRoute implements Routes {
  public path = '/blob';
  public router = Router();
  public blobController = new BlobController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.blobController.get);
    this.router.head(`${this.path}/:filename`, this.blobController.headBlob);
    this.router.get(`${this.path}/:filename`, this.blobController.getBlob);
    this.router.put(`${this.path}/:filename`, this.blobController.putBlob);

    this.router.post(`${this.path}`, this.blobController.uploadFile)
    //this.router.all(`${this.path}`,this.blobController.all)
    
    // this.router.get(`${this.path}/download/:filename`, this.fileController.download);
    // this.router.get(`${this.path}/:filename`, this.fileController.readText);
    // this.router.post(`${this.path}`, this.fileController.writeText);
  }
}

export default FileRoute;