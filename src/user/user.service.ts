import { Inject, Injectable } from '@nestjs/common';
import { promises } from 'dns';
import {User} from './user.interface'
import {FirebaseService} from '../firebase/firebase.service'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';


dotenv.config();
const projectId: string = process.env.CLOUD_PROJECT_ID || '';
const keyFilename: string = 'cloudstorage.json';
const st = new Storage({ projectId, keyFilename });        

@Injectable()
export class UserService {
    constructor(private readonly firebaseService: FirebaseService,
        @InjectModel('User') private readonly userModel: Model<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
        private readonly secretKey: string = process.env.token;

    
    

    async createuser(authorization: string):Promise<any>{
        try {
            const data = await this.firebaseService.verifyToken(authorization);
            if (!data){
                return 'Invalid token'
            }
            const { uid, name, picture, email } = data;
    
            const dataFromDatabase = await this.userModel.findOne({ uid: uid });
            if (!dataFromDatabase) {
                const remoteFileName: string = `image_user_id_${uid}`;
                const imageUrl = await this.uploadImageInCloudStorage(picture, remoteFileName);
    
                const payload: object = {
                    name,
                    uid,
                    email,
                };
    
                const token = jwt.sign(payload, this.secretKey, { expiresIn: '5h' });
                console.log(token);
    
                const newUser = new this.userModel({
                    name,
                    uid,
                    email,
                    picture: imageUrl,
                });
    
                const savedUser = await newUser.save();
                 // 10 seconds expiration time
                    await this.cacheManager.set(uid, newUser, 10);       
                return savedUser;
            } else {
                return "User already exists";
            }
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    async deleteUSer(userData): Promise<any> {
        try {
            const { uid } = userData;
            const dataFromDatabase = await this.userModel.findOne({ uid: uid });
            if (dataFromDatabase) {
                const profilePicName = dataFromDatabase.picture.split("/").pop().split("?")[0];
                console.log("Profile picture name:", profilePicName);
    
                const bucket = st.bucket(process.env.bucket_name);
                const file = bucket.file(profilePicName);
                await this.userModel.deleteOne({ uid }).exec();
                await file.delete();
                return "Successfully deleted";
            } else {
                return "User does not exist";
            }
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }
    

    async getuser(userData):Promise<any>{
        const {uid}=userData
        const data=await this.cacheManager.get(uid); 
        if (data){
            console.log("data coimng from ")
            return data
        }
        
        const dataFromDatabase = await this.userModel.findOne({ uid: uid });
        return dataFromDatabase
        
    }

    async updateUserProfile(userdetails,image):Promise<any>{
        try {
            const { uid } = userdetails;
            if (!uid) {
                throw new Error('User ID is missing.'); 
            }
    
            const bucket = st.bucket(process.env.bucket_name);
            const remoteFileName = `image_user_id_${uid}`;
    
            
            await bucket.file(remoteFileName).save(image.buffer, {
                contentType: image.mimetype,
            });
    
            
            const [signedUrl] = await bucket.file(remoteFileName).getSignedUrl({
                action: 'read',
                expires: '2030-12-31',
            });
    
            console.log('Image uploaded to GCS:', signedUrl);
    
            
            await this.userModel.updateOne({ uid: uid }, { $set: { picture: signedUrl } });
    
            return "Successfully updated the user profile."; 
        } catch (error) {
            console.error('Error updating user profile:', error);
            return "An error occurred while updating the user profile."; 
        }
        
       
        
    }



    async  uploadImageInCloudStorage(picture: string, remoteFileName: string):  Promise<string>{
        try {
            // Fetch the image data
            const response = await axios.get(picture, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');
    
            // Upload the image to Cloud Storage
            const bucket = st.bucket(process.env.bucket_name);
            const file = bucket.file(remoteFileName);
            await file.save(imageBuffer, {
                metadata: { contentType: response.headers['content-type'] },
            });
    
            // Generate a signed URL for the uploaded image
            const [signedUrl] = await file.getSignedUrl({
                action: 'read',
                expires: '2030-12-31', // Adjust expiration date as needed
            });
    
            return signedUrl;
        } catch (error) {
            console.error(error);
            throw error; // Re-throw the error to handle it outside this function
        }
    }
    
        
    }
    

