import { Injectable, CanActivate, ExecutionContext,UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements CanActivate {
  canActivate(context: ExecutionContext):boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization;
    

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.token);
        request['user'] = decoded;
        // console.log("hi")
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    throw new UnauthorizedException('No token provided');
  }
}
