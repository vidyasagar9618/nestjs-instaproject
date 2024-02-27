import { Document } from 'mongoose';

export interface PostInterface extends Document {
  username: string;
  user_id: string;
  imageUrl: string;
  createdAt: Date;
  likes: { user_id: string; createdAt: Date }[];
  comments: { user_id: string; comment: string; createdAt: Date }[];
}