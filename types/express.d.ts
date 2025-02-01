import { Payload } from '../src/users/model';

declare module 'express' {
  interface Request {
    // Add the user property to the Request object
    user: Payload;
  }
}
