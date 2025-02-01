import { User } from '../src/users/entities';

declare module 'express' {
  interface Request {
    // Add the user property to the Request object
    user: User;
  }
}
