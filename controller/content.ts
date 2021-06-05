import { Request, Response } from 'express';
import { Iuser, Icontent, Iartist, IcontentImages } from '@interface';
import { v4 as uuidv4 } from 'uuid';
import { findArtistById } from '@database/artists';
import {
  createContent,
  findContentById,
  findContent,
  updateContent,
  deleteContent,
} from '@database/contents';
import { uploadImage } from '@util/aws';
import multer from 'multer';

export const createContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser } = req;
    const { images: imageData } = req.files as IcontentImages;
    const { id, name, profileImage } = tokenUser as Iuser;
    const {
      artistId,
      title,
      tags,
      description,
      date,
      time,
      address,
      mobile,
      perks,
    } = req.body;

    const parsedTitle = JSON.parse(title);
    const parsedMobile = JSON.parse(mobile);
    const parsedDesc = JSON.parse(description);
    const parsedTags = JSON.parse(tags);
    const parsedDate = JSON.parse(date);
    const parsedTime = JSON.parse(time);
    const parsedAddress = JSON.parse(address);
    const parsedPerks = JSON.parse(perks);
    const parsedArtist = JSON.parse(artistId);
    const celeb = await findArtistById(parsedArtist);

    const imageUrls = [];
    if (imageData) {
      for (let idx = 0; idx < imageData.length; idx++) {
        const data = await uploadImage(imageData[idx]);
        imageUrls.push(data);
      }
    }

    if (!celeb) {
      res.status(404).send({
        message: 'no data',
      });
      return;
    }
    let contentId = uuidv4();
    const isDuple = await findContentById(contentId);
    while (isDuple) {
      contentId = uuidv4();
    }

    const newContent = await createContent({
      id: contentId,
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
      title: parsedTitle,
      images: imageUrls as string[],
      date: parsedDate,
      time: parsedTime,
      address: parsedAddress,
      mobile: parsedMobile,
      description: parsedDesc,
      tags: parsedTags,
      perks: parsedPerks,
    });
    const resultContent = (await findContentById(contentId)) as Icontent;
    if (newContent) {
      res.status(201).send({
        result: {
          id: resultContent.id,
        },
        message: 'ok',
      });
    }
  } catch (err) {
    console.error('create content error', err.message);
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
    const author = (await findContentById(id)) as Icontent;
    if (!author) {
      res.status(404).send({
        message: 'invalid request',
      });
      return;
    }

    const user = tokenUser as Iuser;
    if (author.author.id !== user.id) {
      res.status(403).send({
        message: 'rejected',
      });
      return;
    }

    const deleteResult = await deleteContent(id);
    if (deleteResult) {
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
    const { images: imageData } = req.files as IcontentImages;
    const {
      id,
      artistId,
      title,
      tags,
      description,
      date,
      time,
      address,
      mobile,
      perks,
    } = req.body;
    const user = tokenUser as Iuser;
    const parsedId = JSON.parse(id);
    const author = (await findContentById(id)) as Icontent;
    if (user.id !== author.author.id) {
      res.status(403).send({
        message: 'rejected',
      });
      return;
    }
    const parsedTitle = JSON.parse(title);
    const parsedMobile = JSON.parse(mobile);
    const parsedDesc = JSON.parse(description);
    const parsedTags = JSON.parse(tags);
    const parsedDate = JSON.parse(date);
    const parsedTime = JSON.parse(time);
    const parsedAddress = JSON.parse(address);
    const parsedPerks = JSON.parse(perks);
    const parsedArtist = JSON.parse(artistId);

    const celeb = (await findArtistById(parsedArtist)) as Iartist;

    const imageUrls = [];
    if (imageData) {
      for (let idx = 0; idx < imageData.length; idx++) {
        const data = await uploadImage(imageData[idx]);
        imageUrls.push(data);
      }
    }

    const updateResult = await updateContent({
      id: parsedId,
      title: parsedTitle,
      artist: {
        id: celeb.id,
        name: celeb.name,
        group: celeb.group as string,
        profileImage: celeb.profileImage as string,
      },
      images: imageUrls as string[],
      date: parsedDate,
      time: parsedTime,
      address: parsedAddress,
      mobile: parsedMobile,
      description: parsedDesc,
      tags: parsedTags,
      perks: parsedPerks,
    });
    if (updateResult) {
      res.status(201).send({ message: 'ok' });
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
  const { tokenUser: user } = req;
  const { artistId, location, dateStart, dateEnd, page } = req.query;
  try {
    const findResult = await findContent({
      artistId: artistId as string,
      location: location as string,
      dateStart: dateStart as string,
      dateEnd: dateEnd as string,
      page: Number(page) || 1,
    });
    if (!findResult) {
      res.status(404).send({ message: 'not found contents' });
      return;
    }

    if (user) {
      const resultArr = findResult.contents.map((el) => {
        return { ...el, isBookmark: user.bookmark.includes(el.id) };
      });
      res.status(200).send({ result: resultArr, message: 'ok' });
    } else {
      const resultArr = findResult.contents.map((el) => {
        return { ...el, isBookmark: false };
      });
      res.status(200).send({ result: resultArr, message: 'ok' });
    }
  } catch (err) {
    console.error('contents list error', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};
