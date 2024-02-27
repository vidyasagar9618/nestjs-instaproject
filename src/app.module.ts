import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtMiddleware } from './jwtmiddleware/tokencheck';
import { PostingImageModule } from './posting-image/posting-image.module';
import { CacheModule,CacheInterceptor } from '@nestjs/cache-manager';
import { RedisOptions } from './configs/app-options.constants';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';


@Module({
  imports: [
    UserModule,
    FirebaseModule,
    MongooseModule.forRoot('mongodb://localhost:27017/instagram-nest'),
    PostingImageModule,ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
    
  ],
  controllers: [AppController],
  providers: [AppService]
    
})
export class AppModule {}
