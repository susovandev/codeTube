import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { config } from './config';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export const cloudinaryConfigForImages: UploadApiOptions = {
  folder: 'images',
  resource_type: 'image',
  transformation: [{ width: 200, height: 200, crop: 'limit' }],
};

export default cloudinary;
