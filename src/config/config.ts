import { config as conf } from 'dotenv';
conf({ path: './.env' });

const _config = {
  environment: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
};

export const config = Object.freeze(_config);
