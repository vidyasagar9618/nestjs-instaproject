import { Controller, Get, Post,Body,Headers,UseGuards, Delete,Request, Put,UseInterceptors,UploadedFile,Inject} from '@nestjs/common';

import { UserService } from './user.service';
import { JwtMiddleware } from '../jwtmiddleware/tokencheck';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';




@Controller('user')
export class UserController {
    constructor(
    private readonly UserService: UserService,
  ) {}
    
    @Post('/createUser')
    async createuser(@Headers('authorization') authorization: string):Promise<any>{
        return await this.UserService.createuser(authorization)
    }

    @Delete('/deleteUser')
    @UseGuards(JwtMiddleware)
    async deleteUser(@Request() req):Promise<any>{
        const userData = req['user'];
        return await this.UserService.deleteUSer(userData)
    }

    @Get('/userDetails')
    @UseGuards(JwtMiddleware)
    @CacheTTL(20)
    async getuserdetails(@Request() req):Promise<any>{
      const userData = req['user'];
      return await this.UserService.getuser(userData)
    }
    
    

    @Put('/updateProfilePicture')
    @UseGuards(JwtMiddleware)
    @UseInterceptors(FileInterceptor('image'))
    async updateprofileimage(@Request() req,@UploadedFile() image: MulterFile):Promise<any>{
        const userdetails=req['user']
        return await this.UserService.updateUserProfile(userdetails,image)


    }

}
