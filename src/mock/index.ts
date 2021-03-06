import mockUser from './mockUsers.json';
import mockAritists from './mockArtists.json';
import mockComments from './mockComments.json';
import mockContetnts from './mockContents.json';
import mockSharedContents from './mockSharedContents.json';
import mockLocation from './mockLocation.json';
import mongoose from 'mongoose';

import {
  Iuser,
  Icontent,
  Iartist,
  Icomment,
  IsharedContents,
} from '@interface';
import { createManyUser } from '@database/users';
import { createManyContent } from '@database/contents';
import { createManyArtist } from '@database/artists';
import { createManyComment } from '@database/comments';
import { createManySharedContent } from '@database/sharedcontents';

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

    await database.dropCollection('contents');
    console.log('clear contents collections');

    await createManyContent(mockContetnts as Icontent[]);
    console.log('set contents collections');

    await database.dropCollection('artists');
    console.log('clear artists collections');

    await createManyArtist(mockAritists as Iartist[]);
    console.log('set artists collections');

    await database.dropCollection('comments');
    console.log('clear comments collections');

    await createManyComment(mockComments as Icomment[]);
    console.log('set comments collections');

    await database.dropCollection('sharedcontents');
    console.log('clear shared contents collections');

    await createManySharedContent(mockSharedContents as IsharedContents[]);
    console.log('set shared contents collections');

    console.log('END');
    mongoose.disconnect();
  });

  database.on('error', () => {
    console.log('Error connecting to database');
  });
};

writeMockData(ENV.DATABASE_URL as string);
