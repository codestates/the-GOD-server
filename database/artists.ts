import mongoose from 'mongoose';
import { Iartist, IartistUpdate } from '@interface';

// artist schema
const artistSchema = new mongoose.Schema<Iartist>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    group: { type: String },
  },
  {
    timestamps: true,
  }
);

const ArtistModel = mongoose.model<Iartist>('artist', artistSchema);

export const createArtist = async (artist: Iartist): Promise<boolean> => {
  try {
    const newArtist = new ArtistModel(artist);
    const result = await newArtist.save();
    console.log(result);
    console.log('Artist save OK');
    return true;
  } catch (err) {
    console.error('Artist save error : ', err.message);
    return false;
  }
};

export const findArtistById = async (id: string): Promise<Iartist | null> => {
  try {
    return await ArtistModel.findOne({ id });
  } catch (err) {
    console.error('findArtistById error : ', err.message);
    return null;
  }
};

// 그룹 또는 이름으로 검색한 결과 반환
export const findArtists = async (query: string): Promise<Iartist[] | null> => {
  try {
    return await ArtistModel.find().or([
      { name: { $regex: query } },
      { group: { $regex: query } },
    ]);
  } catch (err) {
    console.error('findArtist error : ', err.message);
    return null;
  }
};

export const updateArtist = async (
  id: string,
  update: IartistUpdate
): Promise<boolean> => {
  try {
    const result = await ArtistModel.findOneAndUpdate({ id }, update);
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateArtist error : ', err.message);
    return false;
  }
};

export const deleteArtist = async (id: string): Promise<boolean> => {
  try {
    const result = await ArtistModel.deleteOne({ id });

    let deleteCount = result.deletedCount || 0;
    console.log('artist delete : ', deleteCount);

    if (deleteCount >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('deleteArtist error : ', err.message);
    return false;
  }
};

export const createManyArtist = async (artists: Iartist[]) => {
  console.log('Write many artists - Start');
  try {
    const result = await ArtistModel.insertMany(artists);
    console.log('result : ', result);
    return result;
  } catch (err) {
    return null;
  }
};
