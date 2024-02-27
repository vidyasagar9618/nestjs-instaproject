import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FirebaseService } from '../firebase/firebase.service';
import { UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtMiddleware } from '../jwtmiddleware/tokencheck';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    
  ],
  providers: [UserService, FirebaseService,],
})
export class UserModule {}
