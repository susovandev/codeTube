import { Schema, model } from 'mongoose';
import { IPlaylist } from './playlist.interface';

const playListSchema = new Schema<IPlaylist>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Playlist = model<IPlaylist>('Playlist', playListSchema);
export default Playlist;
