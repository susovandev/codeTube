import mongoose from 'mongoose';
import { config } from './config';

const connectionDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl as string);
    console.log('Database connected');
  } catch (error) {
    console.log(`Database connection error: ${error}`);
    process.exit(1);
  }
};

export { connectionDB };
