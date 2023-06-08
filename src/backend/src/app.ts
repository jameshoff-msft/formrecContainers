process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from 'config';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import bodyParser from 'body-parser';
import path from 'path'
import fs from 'fs'
import https from 'https'
import http from 'http'

var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};




class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3300;
    this.env = process.env.NODE_ENV || 'development';
    
    // this.app.use('/docs',express.static(__dirname + '/public'));
    //this.app.use('/',express.static(__dirname+"/public"))

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    process.on('uncaughtException', function(ex) {
      console.log(ex)
    });
    https.createServer(credentials, this.app).listen(8443, ()=> {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} VER: 0.0.1 =======`);
      logger.info(`🚀 App listening on the port 8443`);
      logger.info(`=================================`);
    })
    http.createServer(this.app).listen(8080, ()=> {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} VER: 0.0.1 =======`);
      logger.info(`🚀 App listening on the port 8080`);
      logger.info(`=================================`);
    })

  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    //this.app.use(morgan(config.get('log.format'), { stream }));
    this.app.use(cors({ origin: true, credentials: true, exposedHeaders: ['operation-location','location']}));
    //this.app.use(express.static(path.join(__dirname, 'public')))
    // this.app.use(bodyParser.urlencoded({extended: false}))
    // this.app.use(bodyParser.json())
    //this.app.use(hpp());
    //this.app.use(helmet());
    //this.app.use(compression());
    this.app.use(express.raw({
      inflate: true,
      limit: '500mb',
      type: '*/*'
    }));
    //this.app.use(express.json());
    //this.app.use(express.urlencoded({ extended: true }));
    //this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
