export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface Payload {
  sub: string;
  email: string;
  name: string;
  roles: UserRole[];
}
