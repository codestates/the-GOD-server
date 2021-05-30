import { Request, Response } from 'express';
import {
  Iartist,
  Itoken,
  Iuser,
  Icontent,
  Iauthor,
  IsharedContents,
} from '@interface';
import { v4 as uuidv4 } from 'uuid';
import { findArtists } from '@database/artists';
import { ENV } from '@config';
import {
  createContent,
  findContentById,
  findContent,
  findContentsByUserId,
  updateContent,
  deleteContent,
} from '@database/contents';
import {
  findUserByEmail,
  findUserById,
  updateAddUserBookmark,
  updateDeleteUserBookmark,
} from '@database/users';
import {
  createSharedContent,
  findSharedContentById,
  findSharedContentsByUserId,
  deleteSharedContent,
  updateSharedContent,
} from '@database/sharedcontents';

export const createSharedContents = async (req: Request, res: Response) => {
  try {
    const { parsedToken } = req;
    const { contents } = req.body; //여기서 contents는 contentsId들로 이루어진 배열
    const sharedContentsId = uuidv4();
    const findUser = (await findUserByEmail(parsedToken as string)) as Iuser; // 공유 컨텐츠를 작성하는 유저의 아이디
    const isShared = await createSharedContent({
      id: sharedContentsId,
      userId: findUser.id,
      contents: contents,
    });
    if (isShared) {
      res.status(201).send({
        result: {
          id: sharedContentsId,
        },
        message: 'ok',
      });
    } else {
      res.status(400).send({ message: 'invalid request' });
    }
  } catch (err) {
    console.error('sharing content error');
    res.status(401).send({ message: 'unauthorized' });
  }
};

export const getSharedContents = async (req: Request, res: Response) => {
  try {
    const { id } = req.query; // 여기서 id는 공유컨텐츠의 아이디
    const result = await findSharedContentById(id as string);
    if (result) {
      res
        .status(200)
        .send({ result: { id: id, contents: result }, message: 'ok' });
    } else {
      res.status(400).send({ message: 'invalid request' });
    }
  } catch {
    console.error('find shared contents error');
    res.status(404).send({ message: 'invalid request' });
  }
};

export const updateSharedContents = async (req: Request, res: Response) => {
  try {
    const { parsedToken } = req;
    const findUser = await findUserByEmail(parsedToken as string);
    if (!findUser) {
      res.status(401).send({ message: 'unauthorized' });
    }
    const { id, contents } = req.body;
    const updateResult = await updateSharedContent(id, contents);
    if (updateResult) {
      res.status(201).send({ result: { id: id }, message: 'ok' });
    } else {
      res.status(400).send({ message: 'invalid request' });
    }
  } catch {
    console.error('update shared contents error');
    res.status(400).send({ message: 'invalid request' });
  }
};

export const deleteSharedContents = async (req: Request, res: Response) => {
  try {
    const { parsedToken } = req;
    const { id } = req.body;
    const findUser = await findUserByEmail(parsedToken as string);
    if (!findUser) {
      res.status(401).send({ message: 'unauthorized' });
    } else {
      const isDeleted = await deleteSharedContent(id);
      if (isDeleted) {
        res.status(201).send({ message: 'ok' });
      } else {
        res.status(400).send({ message: 'invalid request' });
      }
    }
  } catch (err) {
    console.error('delete shared contents error');
    res.status(404).send({ message: 'invalid request' });
  }
};
