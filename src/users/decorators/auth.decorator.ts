import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { Payload } from '../model';

// creates a decorator that can be used to extract the user from the request
export const Auth = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (data && data in user) {
      return user[data as keyof Payload];
    }

    return request.user;
  },
);
