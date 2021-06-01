import { Iuser } from './user';

declare module 'express' {
  export interface Request {
    tokenUser?: Iuser;
  }
}

export * from './auth';
export * from './user';
export * from './content';
export * from './artist';
export * from './comment';
export * from './sharedcontent';
