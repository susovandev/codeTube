import { UploadApiResponse } from 'cloudinary';
import cloudinary, {
  cloudinaryConfigForImages,
} from '../config/cloudinaryConfig';
import { InternalServerError } from './custom.error';
import fs from 'fs';

class Cloudinary {
  async uploadImageOnCloud(
    localFilePath: string,
  ): Promise<UploadApiResponse | null> {
    if (!localFilePath) return null;
    try {
      const data = await cloudinary.uploader.upload(
        localFilePath,
        cloudinaryConfigForImages,
      );
      fs.unlinkSync(localFilePath);
      return data;
    } catch (error) {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      console.error('Cloudinary Upload Error:', error);
      throw new InternalServerError('Error uploading image');
    }
  }

  async deleteImageOnCloud(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary Delete Error:', error);
      throw new InternalServerError('Error deleting image');
    }
  }
}

export default new Cloudinary();
