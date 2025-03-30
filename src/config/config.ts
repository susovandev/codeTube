import { config as conf } from 'dotenv';
conf({ path: './.env' });

const _config = {
  environment: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
};

export const config = Object.freeze(_config);
