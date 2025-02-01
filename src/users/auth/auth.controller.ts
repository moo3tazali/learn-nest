import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../dto';
import { User } from '../entities';
import { UserExistException } from '../exceptions';
import { LoginResponse } from './login.response';

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
}
