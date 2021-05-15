import sesstion, { SessionOptions } from 'express-session';

const options: SessionOptions = {
  secret: 'fanssumSecret0987',
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
