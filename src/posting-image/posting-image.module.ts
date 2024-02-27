import { Module } from '@nestjs/common';
import { PostingImageController } from './posting-image.controller';
import { PostingImageService } from './posting-image.service';
import { MongooseModule } from '@nestjs/mongoose';
import {PostSchema} from './post.schema'
@Module({
  controllers: [PostingImageController],
  imports:[MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }])],
  providers: [PostingImageService]
})
export class PostingImageModule {}
