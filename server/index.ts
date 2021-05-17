import express from 'express';
import fs from 'fs';
import https from 'https';

import { connect } from '../database';

import { ENV } from '@config';
import { defaultMiddleware } from '@middleware';
import { authRouter } from '@router';

const PORT = ENV.SERVER_PORT || 4000;
console.log(PORT);

const app = express();

// moddleware
app.use(...defaultMiddleware);

// router
app.use('/auth', authRouter);

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

connect();

// TODO : open server after DB connection
server.listen(PORT, () => {
  console.log(`https server listen on : ${PORT}`);
});

export default server;
