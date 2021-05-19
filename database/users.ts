import mongoose from 'mongoose';
import { Iuser } from '@interface';

// user schema
const userSchema = new mongoose.Schema<Iuser>(
  {
    id: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    profileImg: { type: String },
    password: { type: String, required: true },
    type: { type: String, required: true },
    follow: [String],
    bookmark: [String],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<Iuser>('user', userSchema);

export const createUser = async (user: Iuser): Promise<boolean> => {
  try {
    const newUser = new UserModel(user);
    const result = await newUser.save();
    console.log(result);
    console.log('User save OK');
    return true;
  } catch (err) {
    console.error('User save error : ', err.message);
    return false;
  }
};

export const findUserById = async (id: string): Promise<Iuser | null> => {
  try {
    return await UserModel.findOne({ id });
  } catch (err) {
    console.error('findUserById error : ', err.message);
    return null;
  }
};

export const findUserByEmail = async (email: string): Promise<Iuser | null> => {
  try {
    return await UserModel.findOne({ email });
  } catch (err) {
    console.error('findUserByEmail error : ', err.message);
    return null;
  }
};

export const findValidUser = async (
  email: string,
  password: string
): Promise<Iuser | null> => {
  try {
    return await UserModel.findOne({ email, password });
  } catch (err) {
    console.error('findValidUser error : ', err.message);
    return null;
  }
};

export const updateUserName = async (
  id: string,
  userName: string
): Promise<boolean> => {
  try {
    const result = await UserModel.findOneAndUpdate({ id }, { userName });

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateUserName error : ', err.message);
    return false;
  }
};

export const updateUserProfileImg = async (
  id: string,
  profileImg: string
): Promise<boolean> => {
  try {
    const result = await UserModel.findOneAndUpdate({ id }, { profileImg });
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateUserProfileImg error : ', err.message);
    return false;
  }
};

export const updateUserPassword = async (
  id: string,
  password: string
): Promise<boolean> => {
  try {
    const result = await UserModel.findOneAndUpdate({ id }, { password });

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateUserPassword error : ', err.message);
    return false;
  }
};

export const updateAddUserBookmark = async (
  email: string,
  contentId: string
): Promise<boolean> => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { email },
      {
        $addToSet: { bookmark: { $each: [contentId] } },
      }
    );

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateAddUserBookmark error : ', err.message);
    return false;
  }
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const result = await UserModel.deleteOne({ id });
    let deleteCount = result.deletedCount || 0;

    console.log('user delete : ', deleteCount);
    if (deleteCount >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('deleteUser error : ', err.message);
    return false;
  }
};

export const createManyUser = async (users: Iuser[]) => {
  console.log('Write many users - Start');
  try {
    const result = await UserModel.insertMany(users);
    console.log('result : ', result);
    return result;
  } catch (err) {
    return null;
  }
};
