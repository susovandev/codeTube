import { config as conf } from 'dotenv';
conf();

const _config = {
  port: Number(process.env.PORT) || 8080,
  environment: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/codetube',
};

export const config = Object.freeze(_config);
