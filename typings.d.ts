import { User } from './src/database/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
