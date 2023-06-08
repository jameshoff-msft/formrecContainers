import { NextFunction, Request, Response } from 'express';
import axios, { AxiosRequestConfig } from "axios"
import envConfig from "../configs/config"
import { logger } from '@/utils/logger';

class LayoutController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("entering analyze")
      let bodyString : string = req.body.toString()
      let isUrl = false
      if(bodyString.includes("https://demo.azure.com")){
        isUrl = true
        bodyString = bodyString.replace("https://demo.azure.com",`http://backend:8080`)
      }
      const url : string = `http://${envConfig.LAYOUT_HOSTNAME}:${envConfig.LAYOUT_PORT}/formrecognizer/v2.1/layout/analyze?includeTextDetails=false&pages=1`
      logger.info(url)
      const config = {
        headers : {

          accept : "*/*",
          "content-type" : req.headers["content-type"],
        }
      }

      let resp
      if(isUrl){
        resp = await axios.post(url, Buffer.from(bodyString,"utf-8"), config)
      } else{
        resp = await axios.post(url, req.body, config)
      }     
      const resultUrl = resp.headers["operation-location"]
      const resultPath = resultUrl.split('/formrecognizer')
      let outUrl = ''
      if(process.env.HTTPS === "true"){
        outUrl = `https://${req.headers.host}/formrecognizer${resultPath[1]}`
      } else {
        outUrl = `http://${req.headers.host}/formrecognizer${resultPath[1]}`
      }
      res.setHeader("operation-location",outUrl)
      res.json(resp.data)
    } catch (error) {
      logger.error(error)
      next(error);
    }
  };
  

  public getResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url : string = `http://${envConfig.LAYOUT_HOSTNAME}:${envConfig.LAYOUT_PORT}/formrecognizer/v2.1/layout/analyzeResults/${req.params.id}?includeTextDetails=false&pages=1`

      const resp = await axios.get(url)
      res.json(resp.data)
    } catch (error) {
      next(error);
    }
  }
}

export default LayoutController;