import express, { Request, Response, NextFunction } from 'express';
import { config } from './config/config';
import { connectionDB } from './config/db';
import { appRoutes } from './routes/appRoutes';
import { NotFoundException } from './utils/custom.error';
import { errorMiddleware } from './middleware/error.middleware';
import cookieParser from 'cookie-parser';
import { corsConfig } from './config/corsConfig';
import { limiter } from './config/limiterConfig';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import morganMiddleware from './middleware/morgan.middleware';

export class Server {
  app: express.Application;
  constructor() {
    this.app = express();
  }
  async start() {
    await this.databaseConnection();
    this.middlewares();
    this.setupRoutes();
    this.setupGlobalErrors();
    this.listen();
  }

  private async databaseConnection() {
    try {
      await connectionDB();
    } catch (error) {
      console.log(`Database connection error: ${error}`);
    }
  }
  private middlewares() {
    // Security Middlewares
    this.app.use(helmet());
    this.app.use(hpp());
    this.app.use(mongoSanitize());
    this.app.use(corsConfig);

    // Development Middlewares
    if (config.environment === 'development') {
      this.app.use(morganMiddleware);
    }

    // Performance Enhancements
    this.app.use(compression());
    this.app.use('/api', limiter);

    // Standard Middleware
    this.app.use(express.static('public'));
    this.app.use(express.json({ limit: '15kb', strict: true }));
    this.app.use(express.urlencoded({ extended: true, limit: '15kb' }));
    this.app.use(cookieParser());
  }

  private setupRoutes() {
    appRoutes(this.app);
  }
  private setupGlobalErrors() {
    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(
        new NotFoundException(`Can't find ${req.originalUrl} on this server!`),
      );
    });

    this.app.use(errorMiddleware);
  }
  private listen() {
    this.app.listen(config.port, () => {
      console.log(
        `Server running on port ${config.port} in ${config.environment} mode`,
      );
    });
  }
}
