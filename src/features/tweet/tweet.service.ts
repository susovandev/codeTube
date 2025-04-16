import { ITweet } from './tweet.interface';
import Tweet from './tweet.model';

class TweetServices {
  async createNewTweet(requestData: Partial<ITweet>): Promise<ITweet | null> {
    return await Tweet.create(requestData);
  }
}

export default new TweetServices();
