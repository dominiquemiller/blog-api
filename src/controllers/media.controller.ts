import { Response, Request, NextFunction } from "express";
import * as boom from "boom";
import { Media, MediaModel } from "../models/media.model";
import * as s3Service from "../services/s3.service";

export let create = (req: any, res: Response, next: NextFunction) => {
  if (req.file) {
    const file = req.file;
    const { originalname, size, key, mimetype } = file;

    Media.create( { name: originalname, size, key, mimetype }, (err: Error, media: MediaModel) => {
      if (err) next(err);

      media.expiringUrl(media.key, 3000, (err: null, url: string) => {
        const doc = { url, name: media.name, id: media._id };
        res.json(doc);
      });

    });
  }
};