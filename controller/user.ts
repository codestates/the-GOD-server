import { Request, Response } from 'express';
import {
  findUserByEmail,
  updateAddUserFollow,
  updateDeleteUserFollow,
  updateAddUserBookmark,
  updateDeleteUserBookmark,
} from '@database/users';
import { findArtistById } from '@database/artists';
import { findContentById } from '@database/contents';

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { parsedToken } = req;
    const user = await findUserByEmail(parsedToken as string);
    if (!user) {
      res
        .status(404)
        .send({
          message: 'invlaid user',
        })
        .end();
    } else {
      const { id, userName, email, profileImg, type } = user;
      res
        .status(200)
        .send({
          result: {
            id,
            userName,
            email,
            profileImg,
            type,
          },
          message: 'ok',
        })
        .end();
    }
  } catch (err) {
    console.error('getUser error');
    res.status(404).send({
      message: 'invlaid user',
    });
  }
};

export const followArtist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const { artistId } = req.body;

    if (!artistId) {
      res
        .status(400)
        .send({
          message: 'invlaid request',
        })
        .end();
    }

    const user = await findUserByEmail(parsedToken as string);
    if (!user) {
      res
        .status(404)
        .send({
          message: 'invlaid request',
        })
        .end();
    }

    const artist = await findArtistById(artistId);
    if (!artist) {
      res
        .status(404)
        .send({
          message: 'invlaid request',
        })
        .end();
    }

    if (user && artist) {
      const isFollow = user.follow.includes(artistId);
      let result;
      if (isFollow) {
        result = await updateAddUserBookmark(user.email, artist.id);
      } else {
        result = await updateDeleteUserBookmark(user.email, artist.id);
      }

      if (result) {
        res.status(201).send({
          result: {
            isFollow: !isFollow,
          },
        });
      } else {
        res.status(404).send({
          result: {
            message: 'invlaid request',
          },
        });
      }
    }
  } catch (err) {
    console.error('followArtist error');
    res.status(404).send({
      message: 'invlaid request',
    });
  }
};

export const bookmarkContent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const { contentId } = req.body;

    if (!contentId) {
      res
        .status(400)
        .send({
          message: 'invlaid request',
        })
        .end();
    }

    const user = await findUserByEmail(parsedToken as string);
    if (!user) {
      res
        .status(404)
        .send({
          message: 'invlaid request',
        })
        .end();
    }

    const content = await findContentById(contentId);
    if (!content) {
      res
        .status(404)
        .send({
          message: 'invlaid request',
        })
        .end();
    }

    if (user && content) {
      const isBookmark = user.bookmark.includes(contentId);
      let result;
      if (isBookmark) {
        result = await updateDeleteUserFollow(user.email, content.id);
      } else {
        result = await updateAddUserFollow(user.email, content.id);
      }

      if (result) {
        res.status(201).send({
          result: {
            isBookmarked: !isBookmark,
          },
        });
      } else {
        res.status(404).send({
          result: {
            message: 'invlaid request',
          },
        });
      }
    }
  } catch (err) {}
};
