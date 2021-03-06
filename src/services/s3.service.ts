import { S3 } from "aws-sdk";
import { config } from "../config";
import * as fs from "fs";
import * as bcrypt from "bcrypt-nodejs";

const env = process.env.NODE_ENV;
const envConfig = config[env];
const { region, accessKeyId, secretAccessKey, bucket } = envConfig.s3;

const s3 = new S3( { accessKeyId, secretAccessKey, region } );

interface AwsDocument {
  ETag: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
}

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

async function base64Encode(filePath: string) {
  const bitmap = fs.readFileSync(filePath);
  return new Buffer(bitmap).toString("base64");
}

function createKey(fileName: string) {
  return bcrypt.hashSync(fileName);
}

export const uploadMedia = (file: string, key: string) => {
  return new Promise<any>( async (res, rej) => {
    const fileName = `temp/${file}`;
    const base64Data = await base64Encode(fileName);

    const params = {
      Bucket: bucket,
      Key: key,
      Body: base64Data,
      ACL: "private",
      ContentEncoding: "base64",
      ContentType: "image/jpg"
    };

    s3.upload(params, (err: Error, data: AwsDocument) => {
      if (err) {
        console.log(err);
        rej(err);
      }

      console.log(data);
      res(data.key);
    });
  });
};