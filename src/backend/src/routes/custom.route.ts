import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import CustomController from '@/controllers/custom.controller';

class CustomRoute implements Routes {
  public path = '/formrecognizer/v2.1/custom/models';
  public path2 = `/formrecognizer/v2.1/custom/models/:modelID/analyze`
  public responsePath = `/formrecognizer/v2.1/custom/models/:modelID/analyzeresults/:resultID`
  public router = Router();
  public customController = new CustomController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.customController.postModels);
    this.router.get(`${this.path}`, this.customController.getModels);
    this.router.get(`${this.path}/:modelID`, this.customController.getModel); 
    this.router.post(`${this.path2}`,this.customController.customAnalyze);
    this.router.get(`${this.responsePath}`, this.customController.customAnalyzeResults)
  }
}

export default CustomRoute;