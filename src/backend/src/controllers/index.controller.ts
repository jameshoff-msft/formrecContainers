import { NextFunction, Request, Response } from 'express';
import axios, { AxiosRequestConfig } from "axios"
import envConfig from "../configs/config"
import { logger } from '@/utils/logger';

class IndexController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url : string = `http://${envConfig.INVOICE_HOSTNAME}:${envConfig.INVOICE_PORT}/formrecognizer/v2.1/prebuilt/invoice/analyze?includeTextDetails=false&pages=1`
      const config = {
        headers : {
          accept : "application/json",
          content : "application/json",
        }
      }

      const resp = await axios.post(url, {"source": req.body["url"] }, config)
      logger.info(`got ${resp.headers["operation-location"]}`)
      
      const resultUrl = resp.headers["operation-location"].replace("http","https")
      logger.info(`returning: ${resultUrl}`)
      res.setHeader("operation-location",resultUrl)
      res.json(resp.data)
    } catch (error) {
      next(error);
    }
  };
  

  public getResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url : string = `http://${envConfig.INVOICE_HOSTNAME}:${envConfig.INVOICE_PORT}/formrecognizer/v2.1/prebuilt/invoice/analyzeResults/${req.params.id}?includeTextDetails=false&pages=1`

      const resp = await axios.get(url)
      res.json(resp.data)
    } catch (error) {
      next(error);
    }
  }
}

export default IndexController;