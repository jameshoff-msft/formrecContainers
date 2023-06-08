import { Router } from 'express';
import layoutController from '@controllers/layout.controller';
import { Routes } from '@interfaces/routes.interface';
import LayoutController from '@controllers/layout.controller';

class LayoutRoute implements Routes {
  public path = '/formrecognizer/v2.1/layout/analyze';
  public responsePath = '/formrecognizer/v2.1/layout/analyzeResults/:id'
  public router = Router();
  public layoutController = new LayoutController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.layoutController.index);
    this.router.post(`${this.path}`, this.layoutController.index);
    this.router.get(`${this.responsePath}`,this.layoutController.getResponse);
  }
}

export default LayoutRoute;