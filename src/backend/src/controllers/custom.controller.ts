import { NextFunction, Request, Response } from 'express';
import axios, { AxiosRequestConfig } from "axios"
import envConfig from "../configs/config"
import { logger } from '@utils/logger';

class CustomController {

  public postModels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("in postModels")
      const url : string = `http://${envConfig.CUSTOM_HOSTNAME}:${envConfig.CUSTOM_PORT}/formrecognizer/v2.1/custom/models`
      const config = {
        headers : {
          accept : "application/json",
          content : "application/json",
        }
      }

      const body = JSON.parse(req.body)
      body['source'] = '/shared'
      const resp = await axios.post(url, body, config)
      
      const resultLocation = resp.headers["location"]
      const resultPathSplit = resultLocation.split('/formrecognizer')
      let outUrl = ''
      if(process.env.HTTPS === "true"){
        outUrl = `https://${req.headers.host}/formrecognizer${resultPathSplit[1]}`
      } else {
        outUrl = `http://${req.headers.host}/formrecognizer${resultPathSplit[1]}`
      }

      res.setHeader("location",outUrl)
      res.json(resp.data)
    } catch (error) {
      logger.error(error)
      next(error);
    }
  };

  public getModels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url : string = `http://${envConfig.CUSTOM_HOSTNAME}:${envConfig.CUSTOM_PORT}/formrecognizer/v2.1/custom/models`
      const config = {
        headers : {
          accept : "application/json",
          content : "application/json",
        }
      }

      const resp = await axios.get(url)
      //const resultUrl = resp.headers["operation-location"]

      //res.setHeader("operation-location",resultUrl)
      res.json(resp.data)
    } catch (error) {
      logger.error(error)
      next(error);
    }
  };
  public getModel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url : string = `http://${envConfig.CUSTOM_HOSTNAME}:${envConfig.CUSTOM_PORT}/formrecognizer/v2.1/custom/models/${req.params["modelID"]}`
      const config = {
        headers : {
          accept : "application/json",
          content : "application/json",
        }
      }

      const resp = await axios.get(url)
      //const resultUrl = resp.headers["operation-location"]

      //res.setHeader("operation-location",resultUrl)
      res.json(resp.data)
    } catch (error) {
      logger.error(error)
      next(error);
    }
  };
  public customAnalyze = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url : string = `http://${envConfig.CUSTOM_HOSTNAME}:${envConfig.CUSTOM_PORT}/formrecognizer/v2.1/custom/models/${req.params["modelID"]}/analyze`
      logger.info(url)
      const config = {
        headers : {
          accept : req.headers.accept,
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


      res.setHeader("operation-location",outUrl)
      res.json(resp.data)

      // const resp = await axios.post(url, req.body, config)
      // res.json(resp.data)
    } catch (error) {
      logger.error(error)
      next(error);
    }
  };
  public customAnalyzeResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url : string = `http://${envConfig.CUSTOM_HOSTNAME}:${envConfig.CUSTOM_PORT}/formrecognizer/v2.1/custom/models/${req.params["modelID"]}/analyzeresults/${req.params["resultID"]}`
      const config = {
        headers : {
          accept : "application/json",
        }
      }

      const resp = await axios.get(url, config)
      res.json(resp.data)
    } catch (error) {
      logger.error(error)
      next(error);
    }
  };
  
}

export default CustomController;