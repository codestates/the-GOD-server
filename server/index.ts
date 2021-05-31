import express from 'express';
import fs from 'fs';
import https from 'https';

import { connect } from '@database/index';

import { ENV } from '@config';
import { defaultMiddleware } from '@middleware';
import {
  authRouter,
  userRouter,
  artistRouter,
  contentRouter,
  commentRouter,
} from '@router';

const PORT = ENV.SERVER_PORT || 4000;

const app = express();
//set secret key for jwt
app.set('jwt-secret', ENV.SECRET);

// moddleware
app.use(...defaultMiddleware);

// router
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/content', contentRouter);
app.use('/artist', artistRouter);
app.use('/comment', commentRouter);

// NOTE : test funciton
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send('Hello FansSum server !');
});

// TODO : check certification files are exists
const server = https.createServer(
  {
    key: fs.readFileSync(__dirname + '/key.pem', 'utf-8'),
    cert: fs.readFileSync(__dirname + '/cert.pem', 'utf-8'),
  },
  app
);

connect(ENV.DATABASE_URL as string, (err) => {
  if (err) {
    console.log('DB connection error : ', err);
    return;
  }

  console.log('Connected to database');

  server.listen(PORT, () => {
    console.log(`https server listen on : ${PORT}`);
  });
});

export default server;
