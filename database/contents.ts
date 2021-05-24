import mongoose from 'mongoose';
import {
  Icontent,
  IcontentUpdate,
  IcontentFind,
  IcontentFindResult,
} from '@interface';

// content schema
const contentScheme = new mongoose.Schema<Icontent>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    artistId: { type: String, required: true },
    images: [String],
    date: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    time: {
      open: { type: String, required: true },
      close: { type: String, required: true },
    },
    address: {
      storeName: { type: String, required: true },
      roadAddress: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    mobile: { type: String },
    description: { type: String },
    tags: [String],
    perks: { type: Object },
  },
  {
    timestamps: true,
  }
);

const ContentModel = mongoose.model<Icontent>('content', contentScheme);

export const createContent = async (content: Icontent): Promise<boolean> => {
  try {
    const newContent = new ContentModel(content);
    const result = await newContent.save();
    console.log(result);
    console.log('Content save OK');
    return true;
  } catch (err) {
    console.error('Content save error : ', err.message);
    return false;
  }
};

export const findContentById = async (id: string): Promise<Icontent | null> => {
  try {
    return await ContentModel.findOne({ id });
  } catch (err) {
    console.error('findContentById error : ', err.message);
    return null;
  }
};

// TODO : make content searcing function by query -> artist && location && date time
// TODO : make pagination
// TODO : sorting by location
export const findContent = async (
  query: IcontentFind
): Promise<IcontentFindResult | null> => {
  try {
    const findQuery = {
      'artistId': query.artistId,
      'date.start': { $lte: query.date.end },
      'date.end': { $gte: query.date.start },
      'address.roadAddress': { $regex: query.location },
    };

    const totalCount = await ContentModel.count(findQuery);
    const currentPage = query.page || 1;
    const dataPerPage = 2;
    const skip = (currentPage - 1) * dataPerPage;
    const totalPage = Math.ceil(totalCount / dataPerPage);

    console.log('totalCount : ', totalCount);
    console.log('totalPage : ', totalPage);

    if (totalCount === 0) {
      return {
        contents: [],
        totalPage,
        currentPage,
        dataPerPage,
      };
    } else {
      const contents = await ContentModel.find(
        findQuery,
        {
          id: 1,
          address: 1,
          title: 1,
          images: 1,
        },
        {
          limit: dataPerPage,
          skip,
        }
      );

      return {
        contents,
        totalPage,
        currentPage,
        dataPerPage,
      };
    }
  } catch (err) {
    console.log('findContent error : ', err.message);
    return null;
  }
};

export const findContentsByUserId = async (
  userId: string
): Promise<Icontent[] | null> => {
  try {
    return await ContentModel.find({ userId });
  } catch (err) {
    console.error('findContentById error : ', err.message);
    return null;
  }
};

export const updateContent = async (
  id: string,
  update: IcontentUpdate
): Promise<boolean> => {
  try {
    const result = await ContentModel.findOneAndUpdate({ id }, update);
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

export const deleteContent = async (id: string): Promise<boolean> => {
  try {
    const result = await ContentModel.deleteOne({ id });
    let deleteCount = result.deletedCount || 0;

    console.log('contetnt delete : ', deleteCount);

    if (deleteCount >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('deleteContent error : ', err.message);
    return false;
  }
};

export const createManyContent = async (contents: Icontent[]) => {
  console.log('Write many contents - Start');
  try {
    const result = await ContentModel.insertMany(contents);
    console.log('result : ', result);
    return result;
  } catch (err) {
    return null;
  }
};
