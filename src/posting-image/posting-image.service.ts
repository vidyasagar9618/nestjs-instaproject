import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import {PostInterface} from './post.interface'
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
dotenv.config();

const projectId: string = process.env.CLOUD_PROJECT_ID || '';
const keyFilename: string = 'cloudstorage.json';
const st = new Storage({ projectId, keyFilename });   

@Injectable()
export class PostingImageService {
    constructor(@InjectModel('Post') private readonly postModel: Model<PostInterface>,@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    
    async createpost(data,postData): Promise<any> {
        try {
            const { uid, name } = data;
            if (!uid || !name) {
                throw new Error('User data is missing.'); 
            }
    
            const bucket = st.bucket(process.env.bucket_name);
            const uniqueId = uuidv4();
            const remoteFileName = `image_user_id_${uid}_post_images_${uniqueId}.jpg`;
    
            
            await bucket.file(remoteFileName).save(postData.buffer, {
                contentType: postData.mimetype,
            });
    
            
            const [signedUrl] = await bucket.file(remoteFileName).getSignedUrl({
                action: 'read',
                expires: '2030-12-31',
            });
    
            const imageUrl = signedUrl;
    
           
            const newPost = new this.postModel({
                username: name,
                user_id: uid,
                imageUrl: imageUrl,
                createdAt: new Date(),
                likes: [],
                comments: []
            });
    
           
            const savedPost = await newPost.save();
    
            return "Image updated successfully."; 
        } catch (error) {
            console.error('Error creating post:', error);
            return error.message || "An error occurred while creating the post.";
        }
       
      }

    async addlike(userdetails,_id): Promise<any> {
        try {
            const { uid, name } = userdetails;
            const { postId } = _id;
    
            const posted_user = await this.postModel.findOne({ _id: postId, 'likes.user_id': uid });
    
            if (posted_user) {
                
                const post = await this.postModel.findOne({ _id: postId });
                if (!post) {
                    throw new Error('Post not found.');
                }
                post.likes = post.likes.filter(like => like.user_id !== uid);
                await post.save();
                return "Successfully disliked";
            } else {
                
                const updatedPost = await this.postModel.findOneAndUpdate(
                    { _id: postId },
                    { $push: { likes: { user_id: uid, createdAt: new Date() } } },
                    { new: true }
                );
                if (!updatedPost) {
                    throw new Error('Failed to update post.');
                }
                return "Successfully liked";
            }
        } catch (error) {
            console.error('Error liking or disliking post:', error);
            return "An error occurred while liking or disliking the post.";
        }
     
      
    }
      
    async addcomment(userdetails,commentofimage,_id):Promise<any>{
        try {
            const { uid, name } = userdetails;
            const { comment } = commentofimage;
            const { postId } = _id;
            if (!comment) {
                return "Comment is required.";
            }
    
            const posted_user = await this.postModel.findOne({ _id: postId });
    
            if (posted_user) {
               
                const updatedPost = await this.postModel.findOneAndUpdate(
                    { _id: postId },
                    { $push: { comments: { user_id: uid, createdAt: new Date(), comment: comment } } },
                    { new: true }
                );
                if (!updatedPost) {
                    throw new Error('Failed to update post.');
                }
                return "Successfully added comment";
            } else {
               
                console.log("Post not found with ID:", postId);
                return "Post not found";
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            return "An error occurred while adding the comment.";
        }
        
    }

    async deletepost(_id):Promise<any>{
        try {
            const { postId } = _id;
            const posted_user = await this.postModel.findOne({ _id: postId });
            if (!posted_user) {              
                return 'Post not found';
            }
            const fileName = posted_user.imageUrl.split("/").pop().split("?")[0];
            const deletedPost = await this.postModel.findOneAndDelete({ _id: postId });
    
            if (!deletedPost) {               
                return 'Failed to delete post';
            }
            const bucket = st.bucket(process.env.bucket_name);
            const file = bucket.file(fileName);
            await file.delete();    
            return 'Post deleted successfully';
        } catch (error) {
            console.error('Error deleting post:', error);
            return 'An error occurred while deleting the post';
        }
    }

    async getAllPosts(userdetails):Promise<any>{
        const {uid}=userdetails

        try {

            const data=await this.cacheManager.get(uid); 
            if (data){
                console.log("data coimng from ")
                return data
            }
            const result = await this.postModel.aggregate([
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        username: 1,
                        created_at: 1,
                        imageUrl: 1,
                        likescount: { $size: "$likes" },
                        commentscount: { $size: "$comments" }
                    }
                }
            ]);
            await this.cacheManager.set(uid,result, 10);  
            if (result.length === 0) {
                return "No posts found";
            }

            return result;
        } catch (error) {
            console.error('Error getting posts with counts:', error);
            return 'An error occurred while fetching posts';
        }
    }

    async updatePostImage(image, postId,userdetails): Promise<string> {
        const { _id } = postId;
        const {uid}=userdetails
        console.log(uid)
        try {
            console.log(postId);
            const postedUser = await this.postModel.findOne({ _id: _id });
            console.log(postedUser)
            if (!postedUser) {
                throw new Error('Post not found');
            }

            if (postedUser.user_id===uid){
                const bucket = st.bucket(process.env.bucket_name);
            const fileName = postedUser.imageUrl.split("/").pop().split("?")[0];
            await bucket.file(fileName).save(image.buffer, {
                contentType: image.mimetype,
            });
    
            const [signedUrl] = await bucket.file(fileName).getSignedUrl({
                action: 'read',
                expires: '2030-12-31',
            });
    
            console.log(signedUrl);
    
            await this.postModel.updateOne({ _id: _id }, { $set: { imageUrl: signedUrl } });
    
            return "successfully updated";
            }
            else{
                console.log('eroor')
            }
            
            
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update post image');
        }
    }
        
}
