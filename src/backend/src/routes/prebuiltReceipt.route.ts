import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ReceiptController from '@controllers/prebuiltReceipt.controller';


class ReceiptRoute implements Routes {
  public path = '/formrecognizer/v2.1/prebuilt/receipt/analyze';
  public responsePath = '/formrecognizer/v2.1/prebuilt/receipt/analyzeResults/:id'
  public router = Router();
  public receiptController = new ReceiptController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.receiptController.index);
    this.router.post(`${this.path}`, this.receiptController.index);
    this.router.get(`${this.responsePath}`,this.receiptController.getResponse);
  }
}

export default ReceiptRoute;