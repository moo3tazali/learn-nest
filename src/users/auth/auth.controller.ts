import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../dto';
import { User } from '../entities';
import { UserExistException } from '../exceptions';
import { LoginResponse } from './login.response';
import { Public, Roles } from '../decorators';
import { UserService } from '../user/user.service';
import { Auth } from '../decorators';
import { AdminResponse } from './admin.response';
import { UserRole } from '../model';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: LoginUserDto,
  ): Promise<LoginResponse> {
    const accessToken = await this.authService.login(loginDto);
    return new LoginResponse({ accessToken });
  }

  @Public()
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

  @ApiBearerAuth()
  @Get('profile')
  public async getProfile(@Auth('sub') id: string): Promise<User> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Get('admin')
  public adminOnly(): AdminResponse {
    return new AdminResponse({ message: 'You are an admin' });
  }
}
