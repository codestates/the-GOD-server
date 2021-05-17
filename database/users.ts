import mongoose from 'mongoose';
import { Iuser } from '@interface';

// user scheme
const userScheme = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    profileImg: { type: String },
    password: { type: String, required: true },
    type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('user', userScheme);

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

export const findUserById = (id: string): Iuser => {
  // TOOD : make error handle routine
  return UserModel.findOne({ id });
};

export const updateUserName = (id: string, userName: string) => {
  // TOOD : make error handle routine
  return UserModel.findOneAndUpdate({ id }, { userName });
};

export const updateUserProfileImg = (id: string, profileImg: string) => {
  // TOOD : make error handle routine
  return UserModel.findOneAndUpdate({ id }, { profileImg });
};

export const deleteUser = (id: string) => {
  return UserModel.deleteOne({ id });
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
