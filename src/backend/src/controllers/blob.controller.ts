import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import fs from "fs"

const publicDir = '/shared'

class BlobController {
  public get = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("in get")
    try {
      res.set('Content-Type', 'application/xml');
      res.set('x-ms-request-id', 'abcd')
      res.set('x-ms-version', '2019-09-19')
      const dirResp = await fs.readdirSync(publicDir)
      let blobString = ''
      for (const file of dirResp) {
        blobString += `<Blob>
            <Name>${file}</Name>
            <Properties>
              <Creation-Time>Mon, 20 Sep 2021 13:54:38 GMT</Creation-Time>
              <Last-Modified>Mon, 20 Sep 2021 13:54:38 GMT</Last-Modified>
            </Properties>
            <OrMetadata />
          </Blob>`
      }

      res.send(`<?xml version="1.0" encoding="utf-8"?>
        <EnumerationResults ServiceEndpoint="http://localhost:3300/" ContainerName="projectstorage">
          <Blobs>
            ${blobString}
          </Blobs>
        <NextMarker />
        </EnumerationResults>`);
    } catch (error) {
      next(error);
    }
  };

  public getBlob = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("in getBlob")
    try {
      const filename = req.params.filename
      logger.info(`reading file : ${publicDir}/${filename}`)
      const file = fs.readFileSync(`${publicDir}/${filename}`)
      res.set('Content-Type', 'text/plain; charset=UTF-8');
      res.set('Content-Length', file.length.toString())
      res.set('x-ms-blob-type', 'BlockBlob')
      res.set('x-ms-version', '2019-09-19')


      res.download(`${publicDir}/${filename}`)
    } catch (error) {
      res.sendStatus(404)
    }
  };

  public headBlob = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("in headBlob")
    try {
      const filename = req.params.filename
      const file = fs.readFileSync(`${publicDir}/${filename}`)
      res.set('Content-Type', 'text/plain; charset=UTF-8');
      res.set('Content-Length', file.length.toString())
      res.set('x-ms-blob-type', 'BlockBlob')
      res.set('x-ms-version', '2019-09-19')
      res.sendStatus(200)


    } catch (error) {
      res.set('Content-Type', 'text/plain; charset=UTF-8');
      res.set('Content-Length', '0')
      res.set('x-ms-blob-type', 'BlockBlob')
      res.set('x-ms-version', '2019-09-19')
      res.sendStatus(404)
    }
  };

  public putBlob = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("in putBlob")
    try {
      const filename = req.params.filename
      fs.writeFileSync(`${publicDir}/${filename}`, req.body)
      res.send(201)

    } catch (error) {
      res.sendStatus(404)
    }
  };

  public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(req.query.filename)
    try {
      if (req.query?.filename) {
        const mybuffer : Buffer = req.body
        logger.info(req.body)
        this._writeFileSync(`${publicDir}/${req.query.filename}`, mybuffer, 666)
      } else {
        logger.error('missing "filename" in request query')
        res.sendStatus(500)
        return
      }
    } catch (err) {
      logger.error(err)
      res.sendStatus(500)
      return
    }
    
    res.sendStatus(200)
  }

  private _writeFileSync = function (path, buffer, permission) {
    permission = permission || 438; // 0666
    var fileDescriptor;

    try {
      fileDescriptor = fs.openSync(path, 'w', permission);
    } catch (e) {
      fs.chmodSync(path, permission);
      fileDescriptor = fs.openSync(path, 'w', permission);
    }

    if (fileDescriptor) {
      fs.writeSync(fileDescriptor, buffer, 0, buffer.length, 0);
      fs.closeSync(fileDescriptor);
    }
  }


  public all = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("in all")
    res.sendStatus(404)
  };




}

export default BlobController;