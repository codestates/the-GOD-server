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
} from '@database/contents';
import { accessTokenRequest } from './auth';
import { findUserByEmail } from '@database/users';

export const createContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = (await accessTokenRequest(req)) as Itoken; //헤더에 기입된 토큰을 기반으로 유저를 검색
  if (!email) {
    res.status(401).send('unauthorized'); //토큰으로 검색한 이메일이 존재하지 않을 때, status(401)
  }
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
  const tokenUser = await findUserByEmail(email); //헤더 토큰의 주인(유저)
  const MY_NAMESPACE = '1df13-aiuweo-31rbu-1ouowef';
  const artistId = await findArtists(artist); //검색한 아티스트의 아디디입니다.
  const contentsId = uuidv5(email, MY_NAMESPACE);
  if (tokenUser) {
    const newContent = await createContent({
      id: contentsId,
      userId: email,
      title: title,
      artistId: artist,
      images: images,
      date: {
        start: date.start,
        end: date.end,
      },
      time: {
        start: time.start,
        end: time.end,
      },
      address: {
        storeName: storeName,
        roadAddress: roadAddress,
        lat: location.lat,
        lng: location.lng,
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
};
