const gm = require("gm");
import * as request from "request";
import { uploadMedia } from "./s3.service";
import * as fs from "fs";
import { Media, MediaModel } from "../models/media.model";

gm.subClass({imageMagick: true});

interface MediaDoc {
  url: string;
  name: string;
  id: string;
  key?: string;
}

interface Keys {
  thumbnailKey: string;
  smallKey: string;
  mediumKey: string;
}
// Image Resize class is a singleton
export class MediaSizes {
  private static instance: MediaSizes;
  thumbnailKey: string;
  smallKey: string;
  mediumKey: string;

  private constructor() {}

  static getInstance() {
   if (!MediaSizes.instance) {
    MediaSizes.instance = new MediaSizes();
   }
   return MediaSizes.instance;
  }

  // pass in media asset aws link
  async process(doc: MediaDoc) {
    let thumbnailKey = undefined;
    let smallKey = undefined;
    let mediumKey = undefined;

    try {
      thumbnailKey = await this.thumbnail(doc);
    } catch (error) {
      return false;
    }
    try {
      smallKey = await this.small(doc);
    } catch (error) {
      return false;
    }
    try {
      mediumKey = await this.medium(doc);
    } catch (error) {
      return false;
    }

    const keys: Keys = { thumbnailKey, smallKey, mediumKey };
    const updateMedia  = this.updateMedia(doc.id, keys);

    return updateMedia;
  }

  resize(width: number,
         height: number,
         type: string,
         filename: string,
         url: string,
         cb: ((event: string) => void)) {
    gm(request(url))
    .resize(width, height)
    .write(`temp/${filename}_${type}.jpg`, (err: Error) => {
      if (!err) cb("done");
    });
  }

  // 150 by 150
  thumbnail(doc: MediaDoc) {
    return new Promise<string>( (res, rej) => {
      this.resize(150, 150, "thumbnail", doc.name, doc.url, async (event) => {
        // after saving resized image to temp dir, upload asset to aws
        try {
          const newKey = `${doc.key}_thumbnail`;
          const fileName = `${doc.name}_thumbnail.jpg`;
          const upload = await uploadMedia(fileName, newKey);
          // remove temp file
          fs.unlinkSync(`temp/${fileName}`);
          res(upload);
        } catch (error) {
          rej(error);
        }
      });
    });
  }

  // 300 by 300
  small(doc: MediaDoc) {
    return new Promise<string>( (res, rej) => {
      this.resize(300, 300, "small", doc.name, doc.url, async (event) => {
        // after saving resized image to temp dir, upload asset to aws
        try {
          const newKey = `${doc.key}_small`;
          const fileName = `${doc.name}_small.jpg`;
          const upload = await uploadMedia(fileName, newKey);
          // remove temp file
          fs.unlinkSync(`temp/${fileName}`);
          res(upload);
        } catch (error) {
          rej(error);
        }
      });
    });
  }

  // 500 by 500
  medium(doc: MediaDoc) {
    return new Promise<string>( (res, rej) => {
      this.resize(500, 500, "medium", doc.name, doc.url, async (event) => {
        // after saving resized image to temp dir, upload asset to aws
        try {
          const newKey = `${doc.key}_medium`;
          const fileName = `${doc.name}_medium.jpg`;
          const upload = await uploadMedia(fileName, newKey);
          // remove temp file
          fs.unlinkSync(`temp/${fileName}`);
          res(upload);
        } catch (error) {
          rej(error);
        }
      });
    });

  }

  // update media asset with new keys
  updateMedia(id: string, updatedKeys: Keys ) {
    return new Promise<any>( (res, rej) => {
      Media.findByIdAndUpdate( id, updatedKeys, (err: any, doc) => {
        if (err) console.log(err);
        console.log(doc);
        res(doc);
      });
    });
  }

}
