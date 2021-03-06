import { Request, Response } from 'express';
import {
  updateAddUserFollow,
  updateDeleteUserFollow,
  updateAddUserBookmark,
  updateDeleteUserBookmark,
  updateUserProfileImage,
  updateUserName,
} from '@database/users';
import { findArtistById, findArtistsByIdList } from '@database/artists';
import {
  findContentById,
  findContentsByUserId,
  findContentsByIdList,
  updateContentUserInfo,
} from '@database/contents';
import { findSharedContentsByUserId } from '@database/sharedcontents';
import { Iuser } from '@interface';
import { uploadImage, deleteImage } from '@util/aws';

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenUser: user } = req;
    const { id, name, email, profileImage, type, passwordUpdate } =
      user as Iuser;
    res
      .status(200)
      .send({
        result: {
          id,
          name,
          email,
          profileImage,
          type,
          passwordUpdate,
        },
        message: 'ok',
      })
      .end();
  } catch (err) {
    console.error('getUser error : ', err.message);
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
    const { tokenUser: user } = req;
    const { artistId } = req.body;

    if (!artistId) {
      res.status(400).send({
        message: 'invlaid request',
      });
      return;
    }

    const artist = await findArtistById(artistId);
    if (!user || !artist) {
      res.status(404).send({
        message: 'invlaid request',
      });
      return;
    }

    const isFollow = user.follow.includes(artistId);
    let result = false;
    if (isFollow) {
      result = await updateDeleteUserFollow(user.email, artist.id);
    } else {
      result = await updateAddUserFollow(user.email, artist.id);
    }

    if (result) {
      res.status(201).send({
        result: {
          isFollow: !isFollow,
        },
        message: 'ok',
      });
    } else {
      res.status(400).send({
        message: 'invlaid request',
      });
    }
  } catch (err) {
    console.error('followArtist error : ', err.message);
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
    const { tokenUser: user } = req;
    const { contentId } = req.body;

    if (!contentId) {
      res.status(400).send({
        message: 'invlaid request',
      });
      return;
    }

    const content = await findContentById(contentId);

    if (!user || !content) {
      res.status(404).send({
        message: 'invlaid request',
      });
      return;
    }

    const isBookmark = user.bookmark.includes(contentId);
    let result;
    if (isBookmark) {
      result = await updateDeleteUserBookmark(user.email, content.id);
    } else {
      result = await updateAddUserBookmark(user.email, content.id);
    }

    if (result) {
      res.status(201).send({
        result: {
          isBookmarked: !isBookmark,
        },
        message: 'ok',
      });
    } else {
      res.status(400).send({
        message: 'invlaid request',
      });
    }
  } catch (err) {
    console.error('bookmarkContent error : ', err.message);
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
    const { tokenUser: user } = req;
    const profileImage = req.file;

    if (!user || !profileImage) {
      console.log('updateUserProfile invalid input');
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

    const updateResult = await updateUserProfileImage(user.id, profileImageUrl);
    if (updateResult) {
      deleteImage(user.profileImage);
      updateContentUserInfo({ ...user, profileImage: profileImageUrl });

      res.status(201).send({
        result: {
          profileImage: profileImageUrl,
        },
        message: 'ok',
      });
    } else {
      res.status(400).send({
        message: 'invlaid request',
      });
    }
  } catch (err) {
    console.error('updateUserProfile error : ', err.message);
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
    const { tokenUser: user } = req;
    const { name } = req.body;

    if (!user || !name) {
      res.status(400).send({
        message: 'invlaid request',
      });
      return;
    }

    const result = await updateUserName(user.id, name);
    if (result) {
      updateContentUserInfo({ ...user, name });

      res.status(201).send({
        message: 'ok',
      });
    } else {
      res.status(400).send({
        message: 'invlaid request',
      });
    }
  } catch (err) {
    console.error('updateUserName error : ', err.message);
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
    const { tokenUser: user } = req;
    if (!user) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }

    if (user.follow.length === 0) {
      res.status(200).send({
        result: [],
        message: 'ok',
      });
      return;
    }

    const artists = await findArtistsByIdList(user.follow);
    if (!artists) {
      res.status(404).send({
        message: 'not found user follow list',
      });
      return;
    }

    const result = artists.map((artist) => {
      return { ...artist, isFollow: true };
    });

    res.status(200).send({
      result,
      message: 'ok',
    });
  } catch (err) {
    console.error('getFollowList error : ', err.message);
    res.status(404).send({
      message: 'not found user follow list',
    });
  }
};

export const getBookmarkList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser: user } = req;
    if (!user) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }

    if (user.bookmark.length === 0) {
      res.status(200).send({
        result: [],
        message: 'ok',
      });
      return;
    }

    const contents = await findContentsByIdList(user.bookmark);
    if (!contents) {
      res.status(404).send({
        message: 'not found user content',
      });
      return;
    }

    const result = contents.map((content) => {
      return {
        ...content,
        artist: {
          ...content.artist,
          isFollow: user.follow.includes(content.artist.id),
        },
        isBookmark: true,
      };
    });

    res.status(200).send({
      result,
      message: 'ok',
    });
  } catch (err) {
    console.error('getBookmarkList error : ', err.message);
    res.status(404).send({
      message: 'not found user bookmark list',
    });
  }
};

export const getUserContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser: user } = req;
    if (!user) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }

    const contents = await findContentsByUserId(user.id);
    if (!contents || contents.length === 0) {
      res.status(200).send({
        result: [],
        message: 'ok',
      });
      return;
    }

    const result = contents.map((content) => {
      return {
        ...content,
        artist: {
          ...content.artist,
          isFollow: user.follow.includes(content.artist.id),
        },
        isBookmark: user.bookmark.includes(content.id),
      };
    });

    res.status(200).send({
      result,
      message: 'ok',
    });
  } catch (err) {
    console.error('getUserContents error : ', err.message);
    res.status(404).send({
      message: 'not found user content',
    });
  }
};

export const getUserSharedContents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tokenUser: user } = req;
    if (!user) {
      res.status(401).send({
        message: 'unauthorized',
      });
      return;
    }

    const sharedContents = await findSharedContentsByUserId(user.id);
    if (!sharedContents || sharedContents.length === 0) {
      res.status(200).send({
        result: [],
        message: 'ok',
      });
      return;
    }

    const result = [];
    for (let idx = 0; idx < sharedContents.length; idx++) {
      const { id, contents } = sharedContents[idx];
      const findContents = await findContentsByIdList(contents);

      if (!findContents || findContents.length === 0) continue;

      const contentsResult = findContents.map((content) => {
        return {
          ...content,
          isBookmark: user.bookmark.includes(content.id),
        };
      });
      result.push({ id, contents: contentsResult });
    }

    res.status(200).send({
      result,
      message: 'ok',
    });
  } catch (err) {
    console.error('getUserSharedContents error : ', err.message);
    res.status(404).send({
      message: 'not found user shred content',
    });
  }
};
