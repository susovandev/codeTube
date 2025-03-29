import express from "express";

export class Server {
  app: express.Application;
  constructor() {
    this.app = express();
  }
  start() {
    this.middlewares()
    this.listen();
  }

  private middlewares() {
    this.app.use(express.json({ limit: '15kb', strict: true }))
    this.app.use(express.urlencoded({ extended: true, limit: '15kb' }))
    this.app.use(express.static("public"))
  }
  private listen() {
    this.app.listen(8080, () => {
      console.log(`Sever is running on port 8080`);
    });
  }
}
