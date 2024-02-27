import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  user_id: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{
    user_id: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  comments: [{
    user_id: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
});