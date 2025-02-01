import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { CreateUserDto, LoginUserDto } from '../dto';
import { UserExistException } from '../exceptions';
import { User } from '../entities';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  public async register(userDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.findOneByEmail(
      userDto.email,
    );

    if (existingUser) {
      throw new UserExistException();
    }

    const user = await this.usersService.createUser(userDto);

    return user;
  }

  public async login(loginDto: LoginUserDto): Promise<string> {
    const user = await this.usersService.findOneByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.verify(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }
}
