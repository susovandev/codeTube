import { Schema, model } from 'mongoose';
import { IComments } from './comments.interface';

const commentsSchema = new Schema<IComments>(
  {
    content: {
      type: String,
      required: [true, 'Content '],
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Comments = model<IComments>('Comments', commentsSchema);
export default Comments;
