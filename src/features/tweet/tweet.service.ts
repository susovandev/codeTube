import { ITweet } from './tweet.interface';
import Tweet from './tweet.model';

class TweetServices {
  async createNewTweet(requestData: Partial<ITweet>): Promise<ITweet | null> {
    return await Tweet.create(requestData);
  }

  async updateTweetById(
    tweetId: string,
    content: Partial<ITweet>,
  ): Promise<ITweet | null> {
    return await Tweet.findOneAndUpdate(
      { _id: tweetId },
      { $set: content },
      { new: true },
    );
  }

  async deleteTweetById(tweetId: string): Promise<null> {
    return await Tweet.findOneAndDelete({ _id: tweetId }, { new: true });
  }
}

export default new TweetServices();
