import { Schema, model } from 'mongoose';
import { IComments } from './comments.interface';

const commentsSchema = new Schema<IComments>(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Comments = model<IComments>('Comments', commentsSchema);
export default Comments;
