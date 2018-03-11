import { S3 } from "aws-sdk";
import { config } from "../config";

const env = process.env.NODE_ENV;
const envConfig = config[env];
const { region, accessKeyId, secretAccessKey, bucket } = envConfig.s3;

const s3 = new S3( { accessKeyId, secretAccessKey, region } );

export const getPreSignedUrl = (key: string, expires: number): Promise<string> => {
  return new Promise ((res, rej) => {
    const params = { Bucket: bucket, Key: key, Expires: expires };
    s3.getSignedUrl("getObject", params, (err, url) => {
      if (err) rej(err);
      res(url);
    });
  });
};

export const deleteMedia = (key: string): Promise<S3.DeleteObjectOutput> => {
  return new Promise ((res, rej) => {
    const params = { Bucket: bucket, Key: key};
    s3.deleteObject(params, (err, data) => {
      if (err) rej(err);
      res(data);
    });
  });
};