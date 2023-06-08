import { NextFunction, Request, Response } from 'express';
import axios from "axios"
import envConfig from "../configs/config"
import { logger } from '@/utils/logger';

class InvoiceController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("entering analyze in invoicecontroller")
      const url : string = `http://${envConfig.INVOICE_HOSTNAME}:${envConfig.INVOICE_PORT}/formrecognizer/v2.1/prebuilt/invoice/analyze?includeTextDetails=false&pages=1`
      logger.info(url)
      const config = {
        headers : {

          accept : "*/*",
          "content-type" : req.headers["content-type"],
        }
      }

      const resp = await axios.post(url, req.body, config)
      const resultUrl = resp.headers["operation-location"]
      const resultPath = resultUrl.split('/formrecognizer')
      let outUrl = ''
      if(process.env.HTTPS === "true"){
        outUrl = `https://${req.headers.host}/formrecognizer${resultPath[1]}`
      } else {
        outUrl = `http://${req.headers.host}/formrecognizer${resultPath[1]}`
      }
      logger.info(`returning: ${outUrl}`)
      res.setHeader("operation-location",outUrl)
      res.json(resp.data)
    } catch (error) {
      logger.error(error)
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

export default InvoiceController;