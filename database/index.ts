import mongoose from 'mongoose';

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
