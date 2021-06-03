import { Request, Response } from 'express';
import { IcommentFindResult, Iuser, Icomment } from '@interface';
import {
  createComment,
  deleteComment,
  findCommentById,
  findComments,
  updateComment,
} from '@database/comments';
import { v4 as uuidv4 } from 'uuid';
import { findContentById } from '@database/contents';

export const createComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser } = req;
    const { id, comment } = req.body;
    if (!id || !tokenUser) {
      res.status(404).send({ message: 'not found data' });
      return;
    }
    const uniqueID = uuidv4();
    const newComment = await createComment({
      id: uniqueID,
      user: {
        id: tokenUser.id,
        name: tokenUser.name,
        profileImage: tokenUser.profileImage,
      },
      comment: comment,
      contentId: id,
    });
    if (newComment) {
      res.status(200).send({
        result: {
          id: uniqueID,
          user: {
            id: tokenUser.id,
            name: tokenUser.name,
          },
          comment: comment,
        },
        message: 'ok',
      });
    }
  } catch (err) {
    console.error('create comment error', err.message);
    res.status(400).send({ message: 'bad request' });
  }
};

export const deleteComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser } = req;
    const { id } = req.body;
    const writer = await findCommentById(id);
    const user = tokenUser as Iuser;
    if (writer?.user.id !== user.id) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }

    const isDeleted = await deleteComment(id);
    if (isDeleted) {
      res.status(200).send({
        result: { id: id },
        message: 'ok',
      });
    }
  } catch (err) {
    console.error('delete comment error', err.message);
    res.status(400).send({ message: 'invalid request' });
  }
};

export const updateComments = async (req: Request, res: Response) => {
  try {
    const { tokenUser } = req;
    const { id, comment } = req.body; //{ 수정하고자 하는 댓글의 id , 수정할 내용 }
    const user = tokenUser as Iuser;
    const writer = (await findCommentById(id)) as Icomment;
    if (user.id !== writer.user.id) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }
    const updatedComment = await updateComment(id, comment);
    if (updatedComment) {
      res.status(200).send({ message: 'ok' });
    }
  } catch {
    console.error('update comment error');
    res.status(400).send({ message: 'invalid request' });
  }
};

export const pageComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { page } = req.query;
    const checkContent = await findContentById(id as string);
    if (!checkContent) {
      res.status(404).send({ message: 'not found data' });
      return;
    } else {
      const resultCommentPages: IcommentFindResult = (await findComments({
        id: id as string,
        page: Number(page as string),
      })) as IcommentFindResult;
      res.status(200).send({ result: resultCommentPages, message: 'ok' });
    }
  } catch (err) {
    console.error('page comment error');
    res.status(400).send({ message: 'bad request' });
  }
};
