import { Expose } from 'class-transformer';

export class AdminResponse {
  constructor(private readonly partial?: Partial<AdminResponse>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  @Expose()
  message: string;
}
