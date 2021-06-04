import express, { Express } from 'express';
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
  sharedcontentRouter,
} from '@router';
import LocationData from '@src/mock/mockLocation.json';

const PORT = ENV.SERVER_PORT || 4000;

const app = express();
// moddleware
app.use(...defaultMiddleware);
// router
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/content', contentRouter);
app.use('/artist', artistRouter);
app.use('/comment', commentRouter);
app.use('/sharedcontent', sharedcontentRouter);

// NOTE : test funciton
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send('Hello FansSum server !');
});

app.get('/location', (req: express.Request, res: express.Response) => {
  try {
    res.status(200).send({ result: LocationData, message: 'ok' });
  } catch (err) {
    res.status(500).send({ message: 'server error' });
  }
});

let server: https.Server | Express;
let serverType = '';
if (
  fs.existsSync(__dirname + '/key.pem') &&
  fs.existsSync(__dirname + '/cert.pem')
) {
  server = https.createServer(
    {
      key: fs.readFileSync(__dirname + '/key.pem', 'utf-8'),
      cert: fs.readFileSync(__dirname + '/cert.pem', 'utf-8'),
    },
    app
  );
  serverType = 'https';
} else {
  server = app;
  serverType = 'http';
}

connect(ENV.DATABASE_URL as string, (err) => {
  if (err) {
    console.log('DB connection error : ', err);
    return;
  }
  console.log('Connected to database');
  server.listen(PORT, () => {
    console.log(`${serverType} server listen on : ${PORT}`);
  });
});

export default server;
