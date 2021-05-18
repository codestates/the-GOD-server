import mongoose from 'mongoose';
import {
  createUser,
  findUserById,
  updateUserName,
  updateUserProfileImg,
  deleteUser,
} from './users';

import { USER_TYPE } from '@interface';

type connectionCallback = (err: string | null) => void;

let database: mongoose.Connection;

export const connect = (uri: string, callback: connectionCallback): void => {
  if (database) {
    console.log('alreay connected database');
    return;
  }

  if (!uri) {
    console.error('Error, invalid database URI');
    return;
  }

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  database = mongoose.connection;
  database.once('open', async () => {
    callback(null);
    // NOTE : test code
    // let testUser = await findUserById('123');
    // console.log('get test User : ', testUser);

    // if (!testUser) {
    //   const result = await createUser({
    //     id: '123',
    //     userName: 'sim',
    //     email: 'tester@test.com',
    //     profileImg: 'https://bit.ly/3euIgJj',
    //     password: '1234',
    //     type: USER_TYPE.Email,
    //   });

    //   console.log('result : ', result);
    // } else {
    //   let result = await updateUserName('123', 'EJ');
    //   result = await updateUserProfileImg('123', 'testURL');

    //   result = await deleteUser('1234');
    //   console.log('delete result : ', result);
    // }
  });

  database.on('error', () => {
    callback('Error connecting to database');
  });
};

export const disconnect = (): void => {
  if (!database) {
    console.log('database was not connected');
    return;
  }
  mongoose.disconnect();
};
