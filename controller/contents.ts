import { Request, Response } from 'express';
import { Itoken } from '@interface';
import { v5 as uuidv5 } from 'uuid';
import { findArtists } from '@database/artists';
import {
  createContent,
  findContentById,
  findContent,
  findContentsByUserId,
  updateContent,
  deleteContent,
} from '@database/contents';
import { findUserByEmail } from '@database/users';

export const createContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req; //email
    const user = await findUserByEmail(parsedToken as string);
    if (!user) {
      res.status(401).send({ message: 'unauthorized' }).end();
    } else {
      const {
        artist,
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
      const tokenUser = await findUserByEmail(parsedToken as string); //헤더 토큰의 주인(유저)
      const MY_NAMESPACE = '1df13-aiuweo-31rbu-1ouowef';
      const artistId = await findArtists(artist); //검색한 아티스트의 아디디입니다.
      const contentsId = uuidv5(parsedToken as string, MY_NAMESPACE);
      if (tokenUser) {
        const newContent = await createContent({
          id: contentsId,
          userId: parsedToken as string,
          title: title,
          artistId: artist,
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
        res.status(201).send(newContent);
      } else {
        res.status(400).send('invalid input');
      }
    }
  } catch (err) {
    console.error('create content error');
    console.log(err.message);
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
