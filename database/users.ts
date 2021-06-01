import mongoose from 'mongoose';
import { Iuser } from '@interface';

import { createPWD } from '@util/pwFunctions';

// user schema
const userSchema = new mongoose.Schema<Iuser>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    profileImage: { type: String },
    password: { type: String, required: true },
    type: { type: String, required: true },
    follow: [String],
    bookmark: [String],
    passwordUpdate: { type: String },
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
    return await UserModel.findOne({ id }).lean();
  } catch (err) {
    console.error('findUserById error : ', err.message);
    return null;
  }
};

export const findUserByEmail = async (email: string): Promise<Iuser | null> => {
  try {
    return await UserModel.findOne({ email }).lean();
  } catch (err) {
    console.error('findUserByEmail error : ', err.message);
    return null;
  }
};

export const findUserByUserName = async (
  userName: string
): Promise<Iuser | null> => {
  try {
    return await UserModel.findOne({ userName });
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
    const result = await UserModel.findOneAndUpdate({ id }, { name: userName });

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

export const updateUserProfileImage = async (
  id: string,
  profileImage: string
): Promise<boolean> => {
  try {
    const result = await UserModel.findOneAndUpdate({ id }, { profileImage });
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateUserProfileImage eerror : ', err.message);
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

export const updateDeleteUserBookmark = async (
  email: string,
  contentId: string
): Promise<boolean> => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { email },
      {
        $pull: { bookmark: contentId },
      }
    );

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateDeleteUserBookmark error : ', err.message);
    return false;
  }
};

export const updateAddUserFollow = async (
  email: string,
  artistId: string
): Promise<boolean> => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { email },
      {
        $addToSet: { follow: { $each: [artistId] } },
      }
    );

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateAddUserFollow error : ', err.message);
    return false;
  }
};

export const updateDeleteUserFollow = async (
  email: string,
  artistId: string
): Promise<boolean> => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { email },
      {
        $pull: { follow: artistId },
      }
    );

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateDeleteUserFollow error : ', err.message);
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

// NOTE : for mock data
export const createManyUser = async (users: Iuser[]) => {
  console.log('Write many users - Start');

  users = users.map((user) => {
    const newPwd = createPWD(user.email, user.password);
    user.password = newPwd;
    return user;
  });

  try {
    const result = await UserModel.insertMany(users);
    console.log('result : ', result);
    return result;
  } catch (err) {
    console.log('createManyUser error : ', err.message);
    return null;
  }
};
