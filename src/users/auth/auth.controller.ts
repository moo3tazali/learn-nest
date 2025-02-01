import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../dto';
import { User } from '../entities';
import { UserExistException } from '../exceptions';
import { LoginResponse } from './login.response';
import { AuthGuard } from './auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: LoginUserDto,
  ): Promise<LoginResponse> {
    const accessToken = await this.authService.login(loginDto);
    return new LoginResponse({ accessToken });
  }

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      if (error instanceof UserExistException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  public getProfile(@Req() req: Request): User {
    return req.user;
  }
}
