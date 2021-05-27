import { Request, Response } from 'express';
import { Iartist, Itoken, Iuser, Icontent, Iauthor } from '@interface';
import { v5 as uuidv5 } from 'uuid';
import { findArtistById } from '@database/artists';
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

export const createContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req; //email
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

    // TODO: check invalid input

    const user = await findUserByEmail(parsedToken as string);
    const artist = await findArtistById(artistId);
    console.log('user : ', user);

    if (!user || !artist) {
      res
        .status(401)
        .send({
          message: 'unauthorized',
        })
        .end();
    } else {
      //검색한 아티스트의 아이디입니다.
      const contentsId = uuidv5(
        parsedToken as string,
        ENV.MY_NAMESPACE as string
      );

      const newContent = await createContent({
        id: contentsId,
        author: {
          userId: user.id,
          userName: user.userName,
          profileImage: user.profileImage,
        },
        artist: {
          artistId: artist.id,
          artistName: artist.name,
          group: artist.group,
          profileImage: artist.profileImage || '',
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
    const { parsedToken } = req;
    const { contentId } = req.body;
    const user = await findUserByEmail(parsedToken as string);
    if (!user) {
      res
        .status(401)
        .send({
          message: 'unauthorized',
        })
        .end();
    } else {
      const deleteResult = await deleteContent(contentId);
      if (deleteResult) {
        res.status(201).send({ message: 'ok' });
      } else {
        res.status(400).send({ message: 'invalid request' });
      }
    }
  } catch (err) {
    console.error('delete contents error');
    console.log(err.message);
  }
};

export const updateContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const {
      artistId,
      title,
      tags,
      description,
      images,
      date,
      time,
      storeName,
      roadAddress,
      location,
      mobile,
      perks,
    } = req.body;

    const user = await findUserByEmail(parsedToken as string);
    const artist = await findArtistById(artistId);

    if (!user || !artist) {
      res
        .status(401)
        .send({
          message: 'unauthorized',
        })
        .end();
    } else {
      const updateResult = await updateContent(req.body.contentId, {
        title: title,
        artist: {
          artistId: artist.id,
          artistName: artist.name,
          group: artist.group as string,
          profileImage: artist.profileImage as string,
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
          storeName: storeName,
          roadAddress: roadAddress,
          location: {
            lat: location.lat,
            lng: location.lng,
          },
        },
        mobile: mobile,
        description: description,
        tags: tags,
        perks: perks,
      });
      if (!updateResult) {
        res.status(400).send('invalid input');
      } else {
        res.status(201).send({ result: updateResult, message: 'ok' });
      }
    }
  } catch (err) {
    console.error('update content error');
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const readContent = async (req: Request, res: Response) => {
  try {
    const { parsedToken } = req;
    const { contentId } = req.body;

    const content = await findContentById(contentId);
    if (!content) {
      res.status(404).send({ message: 'no data' });
    } else {
      let isBookmark = false;
      if (parsedToken) {
        const user = await findUserById(parsedToken);
        isBookmark = user?.bookmark.includes(content.id) || false;
      }
      res
        .status(200)
        .send({ result: { ...content, isBookmark }, message: 'ok' });
    }
  } catch (err) {
    console.error('read content error');
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const listOfContents = async (req: Request, res: Response) => {
  const { artistId, location, date } = req.body;
  try {
    const resultList = await findContent({ artistId, location, date });
    if (!resultList) {
      res.status(404).send({ message: 'not found contents' });
    } else {
      res.status(200).send({ result: resultList, message: 'ok' });
    }
  } catch (err) {
    console.error('contents list error');
    res.status(400).send({ message: 'invalid request' });
  }
};

export const addBookmark = async (req: Request, res: Response) => {
  try {
    const { parsedToken } = req;
    const { contentId } = req.body;
    const findUser = await findUserByEmail(parsedToken as string);
    if (!findUser) {
      res.status(401).send({ message: 'unauthorized' });
    } else {
      const isBookmarked = await updateAddUserBookmark(
        parsedToken as string,
        contentId
      );
      if (isBookmarked) {
        res
          .status(201)
          .send({ result: { isBookmarked: isBookmarked }, message: 'ok' });
      } else {
        res.status(400).send({ message: 'invalid request' });
      }
    }
  } catch (err) {
    console.error('add bookmard error');
    res.status(404).send({ message: 'invalid request' });
  }
};

export const deleteBookmark = async (req: Request, res: Response) => {
  try {
    const { parsedToken } = req;
    const { contentId } = req.body;
    const findUser = await findUserByEmail(parsedToken as string);
    if (!findUser) {
      res.status(401).send({ message: 'unauthorized' });
    } else {
      const deletedBookmark = await updateDeleteUserBookmark(
        parsedToken as string,
        contentId
      );
      if (deletedBookmark) {
        res
          .status(201)
          .send({ result: { isBookmarked: false }, message: 'ok' });
      } else {
        res.status(400).send({ message: 'invalid request' });
      }
    }
  } catch (err) {
    console.error('delete bookmark error');
    res.status(404).send({ message: 'invalid request' });
  }
};
