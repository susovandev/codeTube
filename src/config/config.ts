import { config as conf } from 'dotenv';
conf();

const _config = {
  port: Number(process.env.PORT) || 8080,
  environment: process.env.NODE_ENV || 'development',
};

export const config = Object.freeze(_config);
