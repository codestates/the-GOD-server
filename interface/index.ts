declare module 'express' {
  export interface Request {
    parsedToken?: string;
  }
}

export * from './auth';
export * from './user';
export * from './content';
export * from './artist';
export * from './commnet';
export * from './sharedcontent';
