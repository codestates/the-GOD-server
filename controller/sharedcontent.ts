import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  createSharedContent,
  findSharedContentById,
  deleteSharedContent,
  updateSharedContent,
} from '@database/sharedcontents';
import { findUserById } from '@database/users';
import { findContentsByIdList } from '@database/contents';
import { Iuser, IsharedContents } from '@interface';

export const createSharedContents = async (req: Request, res: Response) => {
  try {
    const { tokenUser } = req;
    const { contents } = req.body;
    const user = tokenUser as Iuser;

    const id = uuidv4();
    const isShared = await createSharedContent({
      id: id,
      userId: user.id,
      contents: contents,
    });

    if (isShared) {
      res.status(201).send({
        result: {
          id: id,
        },
        message: 'ok',
      });
    }
  } catch (err) {
    console.error('sharing content error', err.message);
    res.status(400).send({ message: 'invalid request' });
  }
};

export const getSharedContents = async (req: Request, res: Response) => {
  try {
    const { tokenUser: user } = req;
    const { id } = req.query;
    const result = await findSharedContentById(id as string);
    if (!result) {
      res.status(404).send({
        message: 'invalid request',
      });
      return;
    }

    if (result.contents.length === 0) {
      res.status(200).send({ result: { id, constants: [] }, message: 'ok' });
      return;
    }

    // NOTE : 검색한 컨텐츠 결과는 순서대로 나오지 않는다.
    let findContents = await findContentsByIdList(result.contents);
    if (!findContents) {
      res.status(400).send({ message: 'invalid request' });
      return;
    }

    // NOTE : 받아온 순서대로 정렬해야 하므로 result.contents 의 순서에 맞춰서 새로운 배열을 생성한다.
    // NOTE : 추후에 문제가 생긴다면 수정할 것.
    let contents = [];
    for (let idx = 0; idx < result.contents.length; idx++) {
      const findResult = findContents.find(
        (content) => content.id === result.contents[idx]
      );
      if (findResult) contents.push(findResult);
    }

    if (user) {
      contents = contents.map((content) => {
        return {
          ...content,
          artist: {
            ...content.artist,
            isFollow: user.follow.includes(content.artist.id),
          },
          isBookmark: user.bookmark.includes(content.id),
        };
      });
    }

    res.status(200).send({
      result: { id, contents },
      message: 'ok',
    });
  } catch (err: any) {
    console.error('find shared contents error : ', err.message);
    res.status(400).send({ message: 'invalid request' });
  }
};

export const updateSharedContents = async (req: Request, res: Response) => {
  try {
    const { tokenUser } = req;
    const { id, contents } = req.body;
    const author = (await findSharedContentById(id)) as IsharedContents;
    const user = tokenUser as Iuser;
    if (author?.userId !== user.id) {
      res.status(403).send({
        message: 'rejected',
      });
      return;
    }
    const updateResult = await updateSharedContent(id, contents);
    if (updateResult) {
      res.status(201).send({ result: { id: id }, message: 'ok' });
    }
  } catch (err) {
    console.error('update shared contents error', err.message);
    res.status(400).send({ message: 'invalid request' });
  }
};

export const deleteSharedContents = async (req: Request, res: Response) => {
  try {
    const { tokenUser } = req;
    const { id } = req.body;
    const author = (await findSharedContentById(id)) as IsharedContents;
    const user = tokenUser as Iuser;
    if (user.id !== author.userId) {
      res.status(403).send({
        message: 'rejected',
      });
      return;
    }

    const isDeleted = await deleteSharedContent(id);
    if (isDeleted) {
      res.status(201).send({ message: 'ok' });
    }
  } catch (err) {
    console.error('delete shared contents error', err.message);
    res.status(400).send({ message: 'invalid request' });
  }
};
