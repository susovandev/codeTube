import mongoose from 'mongoose';
import { config } from './config';
import Logger from './logger';

const connectionDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl as string);
    Logger.info('Database connected');
  } catch (error) {
    Logger.error(`Database connection error: ${error}`);
    process.exit(1);
  }
};

export { connectionDB };
