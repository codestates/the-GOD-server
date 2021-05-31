import mongoose from 'mongoose';
import { IsharedContents } from '@interface';

// content schema
const sharedContentScheme = new mongoose.Schema<IsharedContents>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    contents: [String],
  },
  {
    timestamps: true,
  }
);

const SharedContentModel = mongoose.model<IsharedContents>(
  'sharedcontent',
  sharedContentScheme
);

export const createSharedContent = async (
  sharedContent: IsharedContents
): Promise<boolean> => {
  try {
    const newSharedContent = new SharedContentModel(sharedContent);
    const result = await newSharedContent.save();
    console.log(result);
    console.log('Shared contents save OK');
    return true;
  } catch (err) {
    console.error('Shared contents save error : ', err.message);
    return false;
  }
};

export const findSharedContentById = async (
  id: string
): Promise<IsharedContents | null> => {
  try {
    return await SharedContentModel.findOne(
      { id },
      { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    ).lean();
  } catch (err) {
    console.error('findSharedContentsById error : ', err.message);
    return null;
  }
};

export const findSharedContentsByUserId = async (
  userId: string
): Promise<IsharedContents[] | null> => {
  try {
    return await SharedContentModel.find(
      { userId },
      { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    ).lean();
  } catch (err) {
    console.error('findSharedContentsByUserId error : ', err.message);
    return null;
  }
};

export const updateSharedContent = async (
  id: string,
  contents: string[]
): Promise<boolean> => {
  try {
    const result = await SharedContentModel.findOneAndUpdate(
      { id },
      { contents }
    );
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateContent error : ', err.message);
    return false;
  }
};

export const deleteSharedContent = async (id: string): Promise<boolean> => {
  try {
    const result = await SharedContentModel.deleteOne({ id });
    let deleteCount = result.deletedCount || 0;

    console.log('contetnt delete : ', deleteCount);

    if (deleteCount >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('deleteSharedContent error : ', err.message);
    return false;
  }
};

// NOTE : for mock data
export const createManySharedContent = async (
  shreadContents: IsharedContents[]
) => {
  console.log('Write many shread contents - Start');
  try {
    const result = await SharedContentModel.insertMany(shreadContents);
    console.log('result : ', result);
    return result;
  } catch (err) {
    console.log('createManySharedContent error : ', err.message);
    return null;
  }
};
