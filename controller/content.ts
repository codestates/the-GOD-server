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
    console.log('imageData : ', imageData);
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
    const imageUrls = [];
    const celeb = await findArtistById(artistId);
    if (imageData) {
      for (let idx = 0; idx < imageData.length; idx++) {
        const data = await uploadImage(imageData[idx]);
        imageUrls.push(data);
      }
    }
    //text값으로 들어온 json 값을 parsing을 해서
    const jsonTags = JSON.parse(tags);
    const jsonDate = JSON.parse(date);
    const jsonTime = JSON.parse(time);
    const jsonAddress = JSON.parse(address);
    const jsonPerks = JSON.parse(perks);
    //tag date time address perks
    //json.parse 해서 사용해야함

    if (!celeb) {
      res.status(400).send({
        message: 'no data',
      });
      return;
    }
    console.log('입력 값 : ', req.body);
    const newContent = await createContent({
      id: uuidv4(),
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
      images: imageUrls as string[],
      date: jsonDate,
      time: jsonTime,
      address: jsonAddress,
      mobile: mobile,
      description: description,
      tags: jsonTags,
      perks: jsonPerks,
    });

    if (newContent) {
      res.status(201).send({ result: newContent, message: 'ok' });
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
      res.status(401).send({
        message: 'unauthorized',
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
    const user = tokenUser as Iuser;
    const author = await findContentById(id);
    if (user.id !== author?.author.id) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }
    const celeb = (await findArtistById(artistId)) as Iartist;
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
    if (updateResult) {
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

export const createContentsTesting = async (
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
      date,
      time,
      address,
      mobile,
      perks,
    } = req.body;
    const imagesFiles = req.files as Express.Multer.File[];
    console.log(imagesFiles);
    const celeb = await findArtistById(artistId);
    console.log(imagesFiles);
    if (!celeb) {
      res.status(400).send({
        message: 'no data',
      });
      return;
    }

    const urls = imagesFiles.map((imagesFiles) => {
      const url = uploadImage(imagesFiles);
      return url;
    });
    console.log(urls);

    const newContent = await createContent({
      id: uuidv4(),
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
      //images: images,
      images: [''],
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
    }
  } catch (err) {
    console.error('create content error');
    res.status(400).send({
      message: 'invalid request',
    });
  }
};
