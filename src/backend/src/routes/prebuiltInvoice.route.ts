import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import InvoiceController from '@controllers/prebuiltInvoice.controller';


class InvoiceRoute implements Routes {
  public path = '/formrecognizer/v2.1/prebuilt/invoice/analyze';
  public responsePath = '/formrecognizer/v2.1/prebuilt/invoice/analyzeResults/:id'
  public router = Router();
  public invoiceController = new InvoiceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.invoiceController.index);
    this.router.post(`${this.path}`, this.invoiceController.index);
    this.router.get(`${this.responsePath}`,this.invoiceController.getResponse);
  }
}

export default InvoiceRoute;