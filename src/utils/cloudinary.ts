import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinaryConfig';
import { InternalServerError } from './custom.error';
import fs from 'fs';
import Logger from '../config/logger';

class Cloudinary {
  async uploadImageOnCloud(
    localFilePath: string,
    cloudinaryUploadFolderName: string,
  ): Promise<UploadApiResponse | null> {
    if (!localFilePath) return null;
    try {
      const data = await cloudinary.uploader.upload(localFilePath, {
        folder: `images/${cloudinaryUploadFolderName}`,
        resource_type: 'image',
        transformation: [{ width: 200, height: 200, crop: 'limit' }],
      });
      fs.unlinkSync(localFilePath);
      return data;
    } catch (error) {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      Logger.error('Cloudinary Upload Error:', error);
      throw new InternalServerError('Error uploading image');
    }
  }

  async deleteImageOnCloud(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      Logger.error('Cloudinary Delete Error:', error);
      throw new InternalServerError('Error deleting image');
    }
  }

  async uploadVideoOnCloud(localFilePath: string): Promise<UploadApiResponse> {
    try {
      const data = await cloudinary.uploader.upload(localFilePath, {
        folder: 'videos',
        resource_type: 'video',
        transformation: [{ quality: 'auto:best' }],
        media_metadata: true,
      });
      fs.unlinkSync(localFilePath);
      return data;
    } catch (error) {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      Logger.error('Cloudinary Upload Error:', error);
      throw new InternalServerError('Error uploading video');
    }
  }
}

export default new Cloudinary();
