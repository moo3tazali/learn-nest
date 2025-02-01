import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS = 10;

  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  public async verify(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
