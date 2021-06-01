import mongoose from 'mongoose';
import {
  Icontent,
  IcontentUpdate,
  IcontentFind,
  IcontentFindResult,
  Iuser,
  Iartist,
} from '@interface';

// content schema
const contentScheme = new mongoose.Schema<Icontent>(
  {
    id: { type: String, required: true, unique: true },
    author: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      profileImage: { type: String, required: true },
    },
    artist: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      group: { type: String },
      profileImage: { type: String, required: true },
    },
    title: { type: String, required: true },
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
      location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
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
    return await ContentModel.findOne(
      { id },
      { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    ).lean();
  } catch (err) {
    console.error('findContentById error : ', err.message);
    return null;
  }
};

export const findContentsByIdList = async (
  idList: string[]
): Promise<Icontent[] | null> => {
  try {
    return await ContentModel.find(
      { id: { $in: idList } },
      { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    ).lean();
  } catch (err) {
    console.error('findContentsByIdList error : ', err.message);
    return null;
  }
};

// TODO : make content searcing function by query -> artist && location && date time
// TODO : make pagination
// TODO : sorting by location
export const findContent = async ({
  artistId,
  location,
  dateStart,
  dateEnd,
  page,
}: IcontentFind): Promise<IcontentFindResult | null> => {
  try {
    const findQuery = {
      'artist.id': artistId,
      'date.start': { $lte: dateEnd },
      'date.end': { $gte: dateStart },
      'address.roadAddress': { $regex: location },
    };

    const totalCount = await ContentModel.count(findQuery);
    const currentPage = page || 1;
    const dataPerPage = 15;
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

      const updateResult = await updateContent({
        id,
        title: title,
        artist: {
          id: celeb.id,
          name: celeb.name,
          group: celeb.group as string,
          profileImage: celeb.profileImage as string,
        },
        images: images,
        date: {
          start: date.start,
          end: date.end,
        },
        time: {
          open: time.open,
          close: time.close,
        },
        address: {
          storeName: address.storeName,
          roadAddress: address.roadAddress,
          location: {
            lat: address.location.lat,
            lng: address.location.lng,
          },
        },
        mobile: mobile,
        description: description,
        tags: tags,
        perks: perks,
      });
      if (!updateResult) {
        res.status(400).send('invalid input');
      } else {
        res.status(201).send({ result: updateResult, message: 'ok' });
      }
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
    return await ContentModel.find(
      { 'author.id': userId },
      { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    ).lean();
  } catch (err) {
    console.error('findContentById error : ', err.message);
    return null;
  }
};

export const updateContent = async (
  update: IcontentUpdate
): Promise<boolean> => {
  try {
    const result = await ContentModel.findOneAndUpdate(
      { id: update.id },
      update
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

export const updateContentUserInfo = async ({
  id,
  name,
  profileImage,
}: Iuser): Promise<boolean> => {
  try {
    const result = await ContentModel.updateMany(
      { 'author.id': id },
      {
        author: {
          id,
          name,
          profileImage,
        },
      }
    );

    let updateCount = result.nModified || 0;
    console.log('contetnt auther update : ', updateCount);

    if (updateCount >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateContentUserInfo error : ', err.message);
    return false;
  }
};

export const updateContentArtistInfo = async ({
  id,
  name,
  group,
  profileImage,
}: Iartist): Promise<boolean> => {
  try {
    const result = await ContentModel.updateMany(
      { 'artist.id': id },
      {
        artist: { id, name, group, profileImage },
      }
    );

    let updateCount = result.nModified || 0;
    console.log('contetnt artist update : ', updateCount);

    if (updateCount >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateContentArtistInfo error : ', err.message);
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

// NOTE : for mock data
export const createManyContent = async (contents: Icontent[]) => {
  console.log('Write many contents - Start');
  try {
    const result = await ContentModel.insertMany(contents);
    console.log('result : ', result);
    return result;
  } catch (err) {
    console.log('createManyContent error : ', err.message);
    return null;
  }
};
