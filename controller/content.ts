import { Request, Response } from 'express';
import { Iuser } from '@interface';
import { v4 as uuidv4 } from 'uuid';
import { findArtistById } from '@database/artists';
import {
  createContent,
  findContentById,
  findContent,
  updateContent,
  deleteContent,
} from '@database/contents';
import { findUserById } from '@database/users';

export const createContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser } = req;
    const { id, name, profileImage } = tokenUser as Iuser;
    const {
      artistId,
      title,
      tags,
      description,
      images,
      date,
      time,
      address,
      mobile,
      perks,
    } = req.body;

    const celeb = await findArtistById(artistId);

    if (!celeb) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }
    const contentsId = uuidv4();
    const newContent = await createContent({
      id: contentsId,
      author: {
        id: id,
        name: name,
        profileImage: profileImage,
      },
      artist: {
        id: celeb.id,
        name: celeb.name,
        group: celeb.group,
        profileImage: celeb.profileImage,
      },
      title: title,
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

    if (newContent) {
      res.status(201).send({ result: newContent, message: 'ok' });
    } else {
      res.status(400).send({ message: 'invalid input' });
    }
  } catch (err) {
    console.error('create content error');
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const deleteContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser } = req;
    const { id } = req.body;
    const deleteResult = await deleteContent(id);
    if (deleteResult && tokenUser) {
      res.status(201).send({ message: 'ok' });
    }
  } catch (err) {
    console.error('delete contents error : ', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const updateContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser } = req;
    const {
      id,
      artistId,
      title,
      tags,
      description,
      images,
      date,
      time,
      address,
      mobile,
      perks,
    } = req.body;

    const celeb = await findArtistById(artistId);

    if (!celeb) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }
    const updateResult = await updateContent({
      id: id,
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
      res.status(400).send('invalid request');
      return;
    } else {
      res.status(201).send({ result: updateResult, message: 'ok' });
    }
  } catch (err) {
    console.error('update content error', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const readContent = async (req: Request, res: Response) => {
  try {
    const { tokenUser } = req;
    const id = req.query.id as string;

    const content = await findContentById(id);
    if (!content) {
      res.status(404).send({ message: 'no data' });
      return;
    }
    let isBookmark = false;
    isBookmark = tokenUser?.bookmark.includes(content.id) || false;
    res.status(200).send({ result: { ...content, isBookmark }, message: 'ok' });
  } catch (err) {
    console.error('read content error', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const listOfContents = async (req: Request, res: Response) => {
  const { artistId, location, dateStart, dateEnd } = req.query;
  console.log(req.query);
  try {
    const resultList = await findContent({
      artistId: artistId as string,
      location: location as string,
      dateStart: dateStart as string,
      dateEnd: dateEnd as string,
    });
    if (!resultList) {
      res.status(404).send({ message: 'not found contents' });
      return;
    }
    res.status(200).send({ result: resultList, message: 'ok' });
  } catch (err) {
    console.error('contents list error', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};
