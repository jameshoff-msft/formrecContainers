import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import fs from "fs"

class FileController {
  public download = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`download /shared/public`)
     res.download('/shared/public/' + req.params["filename"])
     
    } catch (error) {
      next(error);
    }
  };
  public writeText = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const publicDir ='/shared/public/'
      fs.writeFileSync(publicDir + req.body["filename"], req.body["content"]);
      logger.info(`write /shared/public`)
     //res.download( __dirname + '../../../public/' + req.params["filename"])
      res.json({
        status : "success"
      })
    } catch (error) {
      next(error);
    }

  };
  public readText = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`write /shared/public`)
      const publicDir = '/shared/public/'
      const content = fs.readFileSync(publicDir + req.params["filename"]);
     //res.download( __dirname + '../../../public/' + req.params["filename"])
      res.json({
        status : "success",
        content : content.toString('utf8')
      })
    } catch (error) {
      next(error);
    }
  };
  public getFilenames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`getfilenames /shared/public`)
      const publicDir = '/shared/public/'
      const out : string[] = []
      fs.readdirSync(publicDir).forEach(file => {
        out.push(file)
      });
     //res.download( __dirname + '../../../public/' + req.params["filename"])
      res.json({
        status : "success",
        content : out
      })
    } catch (error) {
      next(error);
    }
  };
  
}

export default FileController;