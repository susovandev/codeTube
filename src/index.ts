import { Server } from './server';

export class App {
  run() {
    const server = new Server();
    server.start();
  }
}

const app = new App();
app.run();
