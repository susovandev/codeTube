import { Schema, model } from 'mongoose';
import { ILike } from './like.interface';

const likeSchema = new Schema<ILike>(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Like = model<ILike>('Like', likeSchema);

export default Like;
