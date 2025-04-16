import { Schema, model } from 'mongoose';
import { ITweet } from './tweet.interface';

const tweetSchema = new Schema<ITweet>(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Tweet = model('Tweet', tweetSchema);

export default Tweet;
