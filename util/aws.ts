import AWS from 'aws-sdk';
import multer from 'multer';
import path from 'path';
import { v5 as uuidv5 } from 'uuid';
import { ENV } from '@config';

const {
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  UUID_NAMESPACE,
} = ENV;

const BUCKET_URL = `https://${AWS_S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com`;

const BUCKET = new AWS.S3({
  apiVersion: '2006-03-10',
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

export const uploadImage = async (
  data: Express.Multer.File
): Promise<string | null> => {
  try {
    if (!data) {
      console.log('invalid data');
      return null;
    }

    const fileExtension = path.extname(data.originalname);
    let imageName = path.basename(data.originalname, fileExtension);
    imageName = uuidv5(imageName, UUID_NAMESPACE as string);
    const fileName = `${imageName}${fileExtension}`;

    if (AWS_S3_BUCKET_NAME) {
      await BUCKET.putObject({
        Key: fileName,
        Bucket: AWS_S3_BUCKET_NAME,
        ContentType: 'image/*',
        Body: data.buffer,
        ACL: 'public-read',
      }).promise();
      return `${BUCKET_URL}/${fileName}`;
    } else {
      console.log('uploadImage fail, not setting AWS_S3_BUCKET_NAME');
      return null;
    }
  } catch (err) {
    console.error('uploadImages error : ', err.message);
    return null;
  }
};

export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    const fileName = imageUrl.replace(`${BUCKET_URL}/`, '');

    if (AWS_S3_BUCKET_NAME) {
      await BUCKET.deleteObject({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: fileName,
      }).promise();
      return true;
    } else {
      console.log('deleteImage fail, not setting AWS_S3_BUCKET_NAME');
      return false;
    }
  } catch (err) {
    console.error('deleteImage error : ', err.message);
    return false;
  }
};
