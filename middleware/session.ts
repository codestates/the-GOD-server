import { ENV } from '@config';
import sesstion, { SessionOptions } from 'express-session';

const options: SessionOptions = {
  secret: ENV.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 300,
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  },
};

export default sesstion(options);
