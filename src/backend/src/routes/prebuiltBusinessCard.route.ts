import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import BusinessCardController from '@controllers/prebuiltBusinessCard.controller';


class BusinessCardRoute implements Routes {
  public path = '/formrecognizer/v2.1/prebuilt/businessCard/analyze';
  public responsePath = '/formrecognizer/v2.1/prebuilt/businessCard/analyzeResults/:id'
  public router = Router();
  public receiptController = new BusinessCardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.receiptController.index);
    this.router.post(`${this.path}`, this.receiptController.index);
    this.router.get(`${this.responsePath}`,this.receiptController.getResponse);
  }
}

export default BusinessCardRoute;