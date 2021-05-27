import { Request, Response } from 'express';
import { Iartist, Itoken, Iuser, Icontent, Iauthor } from '@interface';
import { v5 as uuidv5 } from 'uuid';
import { findArtistById, findArtists } from '@database/artists';
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
import { captureRejectionSymbol } from 'events';

export const createContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req; //email
    const user = (await findUserByEmail(parsedToken as string)) as Iuser;

    if (!user) {
      res
        .status(401)
        .send({
          message: 'unauthorized',
        })
        .end();
    }
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
    //검색한 아티스트의 아이디입니다.
    const findArtist = (await findArtistById(artistId)) as Iartist;
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
      title: title,
      artist: {
        artistId: findArtist.id,
        artistName: findArtist.name,
        group: findArtist.group || '',
        profileImage: findArtist.profileImage || '',
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
      tags: tags, //TODO: teg 변수명 일치 필요
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
    if (!user) {
      res
        .status(401)
        .send({
          message: 'unauthorized',
        })
        .end();
    } else {
      const updateResult = await updateContent(req.body.contentId, {
        title: title,
        artistId: artistId,
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
    const { parsedToken } = req; // 토큰이 있는 유저와 없는 유저 구분
    const { contentId } = req.body;
    const findResult = (await findContentById(contentId)) as Icontent;
    const findAuthor = (await findUserById(findResult.userId)) as Iuser;
    if (!findResult || !findAuthor) {
      res.status(404).send({ message: 'no data' });
    } else {
      const author: Iauthor = {
        userName: findAuthor.userName,
        profileImg: findAuthor.profileImage,
      };
      if (parsedToken) {
        const findUser = (await findUserByEmail(
          parsedToken as string
        )) as Iuser;
        let userBooked: Boolean = false;
        for (let i = 0; i < findUser.bookmark.length; i++) {
          if (findUser.bookmark[i] === contentId) {
            userBooked = true;
          }
        }
        const finalResult = { author, findResult, userBooked };
        res.status(200).send({ result: finalResult, message: 'ok' });
      } else {
        const finalResult = { author, findResult };
        res.status(200).send({ result: finalResult, message: 'ok' });
      }
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
