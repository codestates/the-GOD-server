import mockUser from './mockUsers.json';
import mockAritists from './mockUsers.json';
import mockCommnets from './mockUsers.json';
import mockContetnts from './mockUsers.json';
import mockSharedContents from './mockUsers.json';

import mongoose from 'mongoose';

import { Iuser } from '@interface';
import { createManyUser } from '@database/users';

import { ENV } from '@config';

const writeMockData = (uri: string): void => {
  if (!uri) {
    console.error('Error, invalid database URI');
    return;
  }

  console.log('START - SET mock data');

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  let database: mongoose.Connection = mongoose.connection;

  database.once('open', async () => {
    console.log('Connected to database');

    await database.dropCollection('users');
    console.log('clear users collections');

    await createManyUser(mockUser as Iuser[]);
    console.log('set users collections');

    console.log('END');
    mongoose.disconnect();
  });

  database.on('error', () => {
    console.log('Error connecting to database');
  });
};

writeMockData(ENV.DATABASE_URL as string);
