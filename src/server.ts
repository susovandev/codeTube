import express, { Request, Response, NextFunction } from 'express';
import { config } from './config/config';
import { connectionDB } from './config/db';

export class Server {
  app: express.Application;
  constructor() {
    this.app = express();
  }
  async start() {
    await this.databaseConnection();
    this.middlewares();
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

  private setupGlobalErrors() {
    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({
        status: false,
        message: `Can't find ${req.originalUrl} on this server!`,
      });
      next();
    });
  }
  private listen() {
    this.app.listen(config.port, () => {
      console.log(
        `Server running on port ${config.port} in ${config.environment} mode`,
      );
    });
  }
}
