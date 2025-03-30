import mongoose from 'mongoose';
import { config } from './config';

const connectionDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl as string);
    console.log('Database connected');
  } catch (error) {
    process.exit(1);
    console.log(`Database connection error: ${error}`);
  }
};

export { connectionDB };
