import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import {
  createArtist,
  deleteArtist as deleteArtistData,
} from '@database/artists';
import { findUserByEmail } from '@database/users';
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

export const updateArtist = () => {};
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
export const updateArtistProfile = () => {};
