import morgan, { StreamOptions } from 'morgan';
import { IncomingMessage } from 'http';
import Logger from '../config/logger';
import { config } from '../config/config';

interface Request extends IncomingMessage {
  body: {
    query: String;
  };
}

const stream: StreamOptions = {
  write: (message) =>
    Logger.http(message.substring(0, message.lastIndexOf('\n'))),
};

const skip = () => {
  const env = config.environment || 'development';
  return env !== 'development';
};

const registerGraphQLToken = () => {
  morgan.token('graphql-query', (req: Request) => `GraphQL ${req.body.query}`);
};

registerGraphQLToken();

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms\n:graphql-query',
  { stream, skip },
);

export default morganMiddleware;
