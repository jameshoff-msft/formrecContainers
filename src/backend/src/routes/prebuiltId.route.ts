import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import IdController from '@controllers/prebuiltId.controller';


class IdRoute implements Routes {
  public path = '/formrecognizer/v2.1/prebuilt/idDocument/analyze';
  public responsePath = '/formrecognizer/v2.1/prebuilt/idDocument/analyzeResults/:id'
  public router = Router();
  public idController = new IdController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.idController.index);
    this.router.post(`${this.path}`, this.idController.index);
    this.router.get(`${this.responsePath}`,this.idController.getResponse);
  }
}

export default IdRoute;