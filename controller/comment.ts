import { Request, Response } from 'express';
import { Icomment, IcommentFind, IcommentFindResult, Iuser } from '@interface';
import {
  createComment,
  deleteComment,
  findComments,
  updateComment,
} from '@database/comments';
import { findUserByEmail } from '@database/users';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from '@config';
import { findContentById } from '@database/contents';

export const createComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const { id, comment } = req.body; //여기서 id는 댓글이 들어가는 컨텐츠의 id
    if (!id) {
      //id가 없다 === 해당하는 컨텐츠가 없다
      res.status(404).send({ message: 'not found data' }).end();
    }
    const findUser = (await findUserByEmail(parsedToken as string)) as Iuser;
    const uniqueID = uuidv4();
    const newComment = await createComment({
      id: uniqueID,
      user: {
        id: findUser.id,
        name: findUser.name,
      },
      comment: comment,
      contentId: id,
    });
    if (newComment) {
      res.status(200).send({
        result: {
          id: uniqueID,
          user: {
            id: findUser.id,
            name: findUser.name,
          },
          comment: comment,
        },
        message: 'ok',
      });
    }
  } catch (err) {
    console.error('create comment error');
    res.status(400).send({ message: 'bad request' });
  }
};

export const deleteComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const { id } = req.body; //해당 코멘트 아이디
    const findUser = await findUserByEmail(parsedToken as string);
    if (!findUser) {
      res.status(401).send({ message: 'unauthorized' });
    }
    const isDeleted = await deleteComment(id);
    if (!isDeleted) {
      res.status(400).send({ message: 'invalid request' });
    } else {
      res.status(200).send({ result: { id: id }, message: 'ok' });
    }
  } catch (err) {
    console.error('delete comment error');
    res.status(400).send({ message: 'invalid request' });
  }
};

export const updateComments = async (req: Request, res: Response) => {
  try {
    const { parsedToken } = req;
    const findUser = await findUserByEmail(parsedToken as string);
    if (!findUser) {
      res.status(401).send({ message: 'unauthorized' });
    }
    const { id, comment } = req.body; //{ 수정하고자 하는 댓글의 id , 수정할 내용 }
    const updatedComment = await updateComment(id, comment);
    if (updatedComment) {
      res.status(200).send({ message: 'ok' });
    } else {
      res.status(400).send({ message: 'invalid request' });
    }
  } catch {
    console.error('update comment error');
    res.status(400).send({ message: 'invalid request' });
  }
};

export const pageComments = async (req: Request, res: Response) => {
  try {
    //컨텐츠에 작성된 댓글을 열람하는 기능은 토큰이 필요 없음
    const { id } = req.query;
    const { page } = req.query;
    const checkContent = await findContentById(id as string);
    if (!checkContent) {
      res.status(404).send({ message: 'not found data' }).end();
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
//TODO : 댓글을 나타내는 로직 수정 필요함
