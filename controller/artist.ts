import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  createArtist,
  findArtistById,
  deleteArtist as deleteArtistData,
  updateArtist as updateArtistData,
  findAllArtists,
} from '@database/artists';
import { updateContentArtistInfo } from '@database/contents';
import { IartistList, IgroupArtist, IsoloArtist, ARTST_TYPE } from '@interface';
import { uploadImage, deleteImage } from '@util/aws';

export const getArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const artists = await findAllArtists();
    if (!artists) {
      res.status(404).send({
        message: 'not found artist',
      });
      return;
    }

    let result: IartistList = [];
    const groups: IgroupArtist[] = [];
    const groupIdx: { [key: string]: number } = {};

    for (let idx = 0; idx < artists.length; idx++) {
      const { id, name, group, profileImage } = artists[idx];
      if (group) {
        const isAll = name === '전체';
        if (group in groupIdx) {
          const artistGroup = groups[groupIdx[group]];
          artistGroup.name = group;
          if (isAll) {
            artistGroup.id = id;
            artistGroup.profileImage = profileImage;
          } else {
            artistGroup.member.push({ id, name, profileImage });
          }
        } else {
          groupIdx[group] = Object.keys(groupIdx).length;
          const artistGroup: IgroupArtist = {
            id: isAll ? id : '',
            name: group,
            type: ARTST_TYPE.Group,
            member: isAll ? [] : [{ id, name, profileImage }],
            profileImage: isAll ? profileImage : '',
          };
          groups.push(artistGroup);
        }
      } else {
        const soloArtist: IsoloArtist = {
          id,
          name,
          profileImage,
          type: ARTST_TYPE.Solo,
        };
        result.push(soloArtist);
      }
    }

    res.status(200).send({
      result: result.concat(groups),
      message: 'ok',
    });
  } catch (err) {
    console.error('getArtist error : ', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const makeArtist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser: user } = req;
    const { name, group } = req.body;
    const profileImageFile = req.file;

    if (!user) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }

    const id = uuidv4();
    let profileImage = 'https://bit.ly/3euIgJj';
    if (profileImageFile) {
      profileImage =
        (await uploadImage(profileImageFile)) || 'https://bit.ly/3euIgJj';
    }

    const result = await createArtist({ id, name, group, profileImage });

    if (result) {
      res.status(201).send({
        message: 'ok',
      });
    } else {
      res.status(400).send({
        message: 'invalid request',
      });
    }
  } catch (err) {
    console.error('makeArtist error : ', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const updateArtist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser: user } = req;
    const { id, name, group } = req.body;
    const artist = await findArtistById(id);

    if (!user || !artist) {
      res.status(400).send({
        message: 'invlaid request',
      });
      return;
    }

    if (name) artist.name = name;
    if (group) artist.group = group;

    const result = await updateArtistData({ id, name, group });
    if (result) {
      updateContentArtistInfo({ ...artist });

      res.status(201).send({
        message: 'ok',
      });
    } else {
      res.status(404).send({
        message: 'invlaid request',
      });
    }
  } catch (err) {
    console.error('updateArtist error : ', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};

export const deleteArtist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser: user } = req;
    const { id } = req.body;

    if (!id) {
      res.status(400).send({
        message: 'invlaid request',
      });
      return;
    }

    if (!user) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }

    const result = await deleteArtistData(id);
    if (result) {
      res.status(201).send({
        message: 'ok',
      });
    } else {
      res.status(404).send({
        message: 'invalid request',
      });
    }
  } catch (err) {
    console.error('deleteArtist error : ', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};
export const updateArtistProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser: user } = req;
    const { id } = req.body;
    const profileImage = req.file;
    const artist = await findArtistById(id);

    if (!user || !artist) {
      res.status(400).send({
        message: 'invlaid request',
      });
      return;
    }

    const profileImageUrl = await uploadImage(profileImage);
    if (!profileImageUrl) {
      console.log('S3 Image update error');
      res.status(400).send({
        message: 'invlaid request',
      });
      return;
    }

    const updateResult = await updateArtistData({
      id: artist.id,
      profileImage: profileImageUrl,
    });

    if (updateResult) {
      deleteImage(artist.profileImage);
      updateContentArtistInfo({ ...artist, profileImage: profileImageUrl });

      res.status(201).send({
        result: {
          profileImage: profileImageUrl,
        },
        message: 'ok',
      });
    } else {
      res.status(404).send({
        message: 'invlaid request',
      });
    }
  } catch (err) {
    console.error('updateArtistProfile error : ', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};
