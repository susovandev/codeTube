import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { BadRequestError } from '../utils/custom.error';

// Define Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/temp');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// File filter for images and videos
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
    'image/tiff',
    'image/avif',
    'image/heic',
    'image/png',
    'image/gif',
    'video/mp4',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        'Invalid file type! Only images and videos are allowed.',
      ),
    );
  }
};

// Multer instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});
