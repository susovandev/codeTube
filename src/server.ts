import express from 'express';
import { config } from './config/config';

export class Server {
  app: express.Application;
  constructor() {
    this.app = express();
  }
  start() {
    this.middlewares();
    this.listen();
  }

  private middlewares() {
    this.app.use(express.json({ limit: '15kb', strict: true }));
    this.app.use(express.urlencoded({ extended: true, limit: '15kb' }));
    this.app.use(express.static('public'));
  }
  private listen() {
    this.app.listen(config.port, () => {
      console.log(
        `Server running on port ${config.port} in ${config.environment} mode`,
      );
    });
  }
}
