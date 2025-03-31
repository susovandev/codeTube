import express, { Request, Response, NextFunction } from 'express';
import { config } from './config/config';
import { connectionDB } from './config/db';
import { StatusCodes } from 'http-status-codes';
import { appRoutes } from './routes/appRoutes';
import { CustomError, NotFoundException } from './utils/custom.error';

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
    this.app.use(express.json({ limit: '15kb', strict: true }));
    this.app.use(express.urlencoded({ extended: true, limit: '15kb' }));
    this.app.use(express.static('public'));
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

    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        config.environment === 'development' && console.log(err);
        if (err instanceof CustomError) {
          res.status(err.statusCode).json({
            status: false,
            message: err.message,
          });
        }
        if (err instanceof Error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: err.message,
          });
        }
        next();
      },
    );
  }
  private listen() {
    this.app.listen(config.port, () => {
      console.log(
        `Server running on port ${config.port} in ${config.environment} mode`,
      );
    });
  }
}
