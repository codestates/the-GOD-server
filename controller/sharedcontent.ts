import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  createSharedContent,
  findSharedContentById,
  deleteSharedContent,
  updateSharedContent,
} from '@database/sharedcontents';

export const createSharedContents = async (req: Request, res: Response) => {
  try {
    const { tokenUser } = req;
    const { contents } = req.body;

    if (!tokenUser) {
      res.status(401).send({ message: 'unauthorized' });
      return;
    }

    const id = uuidv4();
    const isShared = await createSharedContent({
      id: id,
      userId: tokenUser.id,
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
    res.status(400).send({ message: 'invalidrequest' });
  }
};

export const getSharedContents = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const result = await findSharedContentById(id as string);
    if (!result) {
      res.status(404).send({
        message: 'invalid request',
      });
      return;
    }

    res.status(200).send({
      result: { id: id, contents: result },
      message: 'ok',
    });
  } catch (err) {
    console.error('find shared contents error', err.message);
    res.status(400).send({ message: 'invalid request' });
  }
};

export const updateSharedContents = async (req: Request, res: Response) => {
  try {
    const { tokenUser } = req;
    if (!tokenUser) {
      res.status(401).send({ message: 'unauthorized' });
      return;
    }
    const { id, contents } = req.body;
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
    if (!tokenUser) {
      res.status(401).send({ message: 'unauthorized' });
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
