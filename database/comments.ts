import mongoose from 'mongoose';

import { Icomment, IcommentFind, IcommentFindResult } from '@interface';

// comment schema
const commentScheme = new mongoose.Schema<Icomment>(
  {
    id: { type: String, required: true, unique: true },
    user: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    comment: { type: String, required: true },
    contentId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model<Icomment>('comment', commentScheme);

export const createComment = async (comment: Icomment): Promise<boolean> => {
  try {
    const newComment = new CommentModel(comment);
    const result = await newComment.save();
    console.log(result);
    console.log('Comment save OK');
    return true;
  } catch (err) {
    console.error('Comment save error : ', err.message);
    return false;
  }
};

export const findCommentById = async (id: string): Promise<Icomment | null> => {
  try {
    return await CommentModel.findOne({ id }).lean();
  } catch (err) {
    console.error('findCommentById error : ', err.message);
    return null;
  }
};

// TODO : make comment searching function by query -> content ID
// TODO : make pagination
export const findComments = async (
  query: IcommentFind
): Promise<IcommentFindResult | null> => {
  try {
    const totalCount = await CommentModel.count({ contentId: query.id });
    console.log(query.id);
    const currentPage = query.page || 1;
    const dataPerPage = 30;
    const skip = (currentPage - 1) * dataPerPage;
    const totalPage = Math.ceil(totalCount / dataPerPage);

    console.log('totalCount : ', totalCount);
    console.log('totalPage : ', totalPage);

    if (totalCount === 0) {
      return {
        comments: [],
        totalPage,
        currentPage,
        dataPerPage,
      };
    } else {
      const comments = await CommentModel.find({ contentId: query.id }, null, {
        limit: dataPerPage,
        skip,
      }).lean();

      return {
        comments,
        totalPage,
        currentPage,
        dataPerPage,
      };
    }
  } catch (err) {
    console.log('findComments error : ', err.message);
    return null;
  }
};

export const findCommentsByUserId = async (
  userId: string
): Promise<Icomment[] | null> => {
  try {
    return await CommentModel.find({ userId }).lean();
  } catch (err) {
    console.error('findCommentByUserId error : ', err.message);
    return null;
  }
};

export const updateComment = async (
  id: string,
  comment: string
): Promise<boolean> => {
  try {
    const result = await CommentModel.findOneAndUpdate({ id }, { comment });
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('updateComment error : ', err.message);
    return false;
  }
};

export const deleteComment = async (id: string): Promise<boolean> => {
  try {
    const result = await CommentModel.deleteOne({ id });
    let deleteCount = result.deletedCount || 0;

    console.log('comment delete : ', deleteCount);

    if (deleteCount >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('deleteComment error : ', err.message);
    return false;
  }
};

// NOTE : for mock data
export const createManyComment = async (comments: Icomment[]) => {
  console.log('Write many comment - Start');
  try {
    const result = await CommentModel.insertMany(comments);
    console.log('result : ', result);
    return result;
  } catch (err) {
    console.log('createManyComment error : ', err.message);
    return null;
  }
};
