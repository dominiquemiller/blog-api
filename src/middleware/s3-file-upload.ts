import { S3 } from "aws-sdk";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import { config } from "../config";

const env = process.env.NODE_ENV;
const envConfig = config[env];
const { region, accessKeyId, secretAccessKey, bucket } = envConfig.s3;

const s3 = new S3( { accessKeyId, secretAccessKey, region } );

export const uploadToS3 = (): multer.Instance => {

  return multer({
    storage: multerS3({
      s3: s3,
      bucket: bucket,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString());
      }
    })
  });

};

export const getPreSignedUrl = (key: string, expires: number): Promise<string> => {
  return new Promise ((res, rej) => {
    const params = { Bucket: bucket, Key: key, Expires: expires };
    s3.getSignedUrl("getObject", params, (err, url) => {
      if (err) rej(err);
      res(url);
    });
  });
}