import { Controller,Get,Request,UseGuards,Body,UploadedFile,UseInterceptors, Post, Param, Delete,Put} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {PostingImageService} from './posting-image.service'
import {JwtMiddleware} from '../jwtmiddleware/tokencheck'
import { MulterFile } from 'multer';




@Controller('posting-image')
export class PostingImageController {
    constructor(private readonly postservices:PostingImageService ) {}

    @Post('/createPost')
    @UseGuards(JwtMiddleware)
    @UseInterceptors(FileInterceptor('image'))
    async createPostWithImage(@Request() req, @UploadedFile() image: MulterFile): Promise<any> {
        try {
            const data = req['user'];
            if (!image) {
                throw new Error('Image file is missing.'); 
            }
            return await this.postservices.createpost(data, image);
        } catch (error) {
            console.error('Error creating post with image:', error);
            return error.message || "An error occurred while creating the post with image."; 
        }
    }

@Post('/addlike/:postId')
@UseGuards(JwtMiddleware)
async addlike(@Request() req,@Param() postId:string):Promise<any>{
    const userdetails= req['user'];
    return await this.postservices.addlike(userdetails,postId)

}
@Post('/addcomment/:postId')
@UseGuards(JwtMiddleware)
async addcomment(@Body() comment:string,@Request() req,@Param() postId:string):Promise<any>{
    const userdetails= req['user'];
    return await this.postservices.addcomment(userdetails,comment,postId)

}
@Delete("/deletePost/:postId")
@UseGuards(JwtMiddleware)
async deletepost(@Param() postId:string):Promise<any>{
    return await this.postservices.deletepost(postId)

}

@Get('/getallposts')
@UseGuards(JwtMiddleware)
async getallposts(@Request() req):Promise<any>{
    const userdetails= req['user'];
    return await this.postservices.getAllPosts(userdetails)
}


@Put('/updatePostImage/:_id')
@UseGuards(JwtMiddleware)
@UseInterceptors(FileInterceptor('image'))
async updatePostImageEndpoint(@UploadedFile() image: MulterFile, @Param() _id: string,@Request() req): Promise<any> {
    try {
        
        if (!image) {
            throw new Error('Image file is missing.'); // Throw an error if image is not provided
        }
        const userdetails= req['user'];
        return await this.postservices.updatePostImage(image, _id,userdetails);
    } catch (error) {
        console.error('Error creating post with image:', error);
        return error.message || "An error occurred while creating the post with image."; // Return error message
    }
}


}
