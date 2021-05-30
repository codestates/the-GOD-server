import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import {
  createArtist,
  findArtistById,
  deleteArtist as deleteArtistData,
  updateArtist as updateArtistData,
} from '@database/artists';
import { findUserByEmail } from '@database/users';
import { updateContentArtistInfo } from '@database/contents';

import { IartistUpdate } from '@interface';
import { uploadImage, deleteImage } from '@util/aws';

// TODO : make function
// TODO : make get all artist
export const getArtist = () => {};

export const makeArtist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const { name, group } = req.body;
    const profileImageFile = req.file;
    const user = await findUserByEmail(parsedToken as string);

    // TODO : check admin user
    if (!user) {
      res
        .status(401)
        .send({
          message: 'unauthorized',
        })
        .end();
    } else {
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
    const { parsedToken } = req;
    const { id, name, group } = req.body;
    const user = await findUserByEmail(parsedToken as string);
    const artist = await findArtistById(id);

    if (!user || !artist) {
      res
        .status(400)
        .send({
          message: 'invlaid request',
        })
        .end();
    } else {
      const update: IartistUpdate = {};
      if (name) {
        update.name = name;
        artist.name = name;
      }
      if (group) {
        update.group = group;
        artist.group = group;
      }

      const result = await updateArtistData(id, update);
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
    const { parsedToken } = req;
    const { id } = req.body;
    const user = await findUserByEmail(parsedToken as string);

    // TODO : check admin user
    if (!user) {
      res
        .status(401)
        .send({
          message: 'unauthorized',
        })
        .end();
    } else if (!id) {
      res
        .status(400)
        .send({
          message: 'invlaid request',
        })
        .end();
    } else {
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
    const { parsedToken } = req;
    const { id } = req.body;
    const profileImage = req.file;
    const user = await findUserByEmail(parsedToken as string);
    const artist = await findArtistById(id);

    if (!user || !artist) {
      res
        .status(400)
        .send({
          message: 'invlaid request',
        })
        .end();
    } else {
      const profileImageUrl = await uploadImage(profileImage);
      if (!profileImageUrl) {
        console.log('S3 Image update error');
        res
          .status(400)
          .send({
            message: 'invlaid request',
          })
          .end();
      } else {
        const updateResult = await updateArtistData(artist.id, {
          profileImage: profileImageUrl,
        });

        if (updateResult) {
          deleteImage(artist.profileImage);
          updateContentArtistInfo({ ...artist, profileImage: profileImageUrl });

          res
            .status(201)
            .send({
              result: {
                profileImage: profileImageUrl,
              },
              message: 'ok',
            })
            .end();
        } else {
          res
            .status(404)
            .send({
              message: 'invlaid request',
            })
            .end();
        }
      }
    }
  } catch (err) {
    console.error('updateArtistProfile error : ', err.message);
    res.status(400).send({
      message: 'invalid request',
    });
  }
};
