import { Schema, model } from 'mongoose';
import { IVideo } from './video.interfaces';

const videoSchema = new Schema<IVideo>(
  {
    videoFile: {
      public_id: {
        type: String,
        required: [true, 'Public ID is required'],
        trim: true,
      },
      secure_url: {
        type: String,
        required: [true, 'Secure URL is required'],
        trim: true,
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: {
      public_id: {
        type: String,
        required: [true, 'Public ID is required'],
        trim: true,
      },
      secure_url: {
        type: String,
        required: [true, 'Secure URL is required'],
        trim: true,
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      // in Seconds
      type: Number,
      required: true,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Video = model<IVideo>('Video', videoSchema);
