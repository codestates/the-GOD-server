import { Request, Response } from 'express';
import {
  findUserByEmail,
  updateAddUserFollow,
  updateDeleteUserFollow,
  updateAddUserBookmark,
  updateDeleteUserBookmark,
  updateUserProfileImage,
  updateUserName,
} from '@database/users';
import { findArtistById, findArtistByIdList } from '@database/artists';
import { findContentById } from '@database/contents';
import { uploadImage, deleteImage } from '@util/aws';

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
      const { id, userName, email, profileImage, type } = user;
      res
        .status(200)
        .send({
          result: {
            id,
            userName,
            email,
            profileImage,
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
  } catch (err) {
    console.error('bookmarkContent error');
    res.status(404).send({
      message: 'invlaid request',
    });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const profileImage = req.file;
    const user = await findUserByEmail(parsedToken as string);

    if (!user || !profileImage) {
      console.log('updateUserProfile invalid input');
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
        const updateResult = await updateUserProfileImage(
          user.id,
          profileImageUrl as string
        );

        if (updateResult) {
          await deleteImage(user.profileImage);
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
    console.error('updateUserProfile error');
    res.status(404).send({
      message: 'invlaid request',
    });
  }
};

export const updateName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const { userName } = req.body;
    const user = await findUserByEmail(parsedToken as string);

    if (!user || !userName) {
      res
        .status(400)
        .send({
          message: 'invlaid request',
        })
        .end();
    } else {
      const result = await updateUserName(user.id, userName);
      if (result) {
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
    console.error('updateUserName error');
    res.status(404).send({
      message: 'invlaid request',
    });
  }
};

export const getFollowList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { parsedToken } = req;
    const user = await findUserByEmail(parsedToken as string);
    if (!user) {
      res
        .status(401)
        .send({
          message: 'unauthorized',
        })
        .end();
    } else {
      if (user.follow.length === 0) {
        res
          .status(200)
          .send({
            result: [],
            message: 'unauthorized',
          })
          .end();
        return;
      }

      const artists = await findArtistByIdList(user.follow);
      if (artists) {
        const result = artists.map((artist) => {
          return { ...artist, isFollow: true };
        });

        res.status(200).send({
          result,
          message: 'not found user follow list',
        });
      } else {
        res.status(404).send({
          message: 'not found user follow list',
        });
      }
    }
  } catch (err) {
    console.error('getFollowList error');
    res.status(404).send({
      message: 'not found user follow list',
    });
  }
};
