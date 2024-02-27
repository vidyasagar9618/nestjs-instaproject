import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Delete, Get, Post } from '@nestjs/common';
import { Body, UseInterceptors } from '@nestjs/common/decorators';

import { AppService } from './app.service';


@Controller('/hi')
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  
}