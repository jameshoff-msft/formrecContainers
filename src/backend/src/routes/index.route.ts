import { Router } from 'express';
import IndexController from '@controllers/index.controller';
import { Routes } from '@interfaces/routes.interface';

class IndexRoute implements Routes {
  public path = '/formrecognizer/v2.1/prebuilt/invoice/analyze';
  public responsePath = '/formrecognizer/v2.1/prebuilt/invoice/analyzeResults/:id'
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.index);
    this.router.post(`${this.path}`, this.indexController.index);
    this.router.get(`${this.responsePath}`,this.indexController.getResponse);
  }
}

export default IndexRoute;