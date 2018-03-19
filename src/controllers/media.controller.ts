import { Response, Request, NextFunction } from "express";
import * as boom from "boom";
import { Media, MediaModel } from "../models/media.model";
import * as s3Service from "../services/s3.service";
import { job } from "../services/delayed-jobs.service";

export let create = (req: any, res: Response, next: NextFunction) => {
  if (req.file) {
    const file = req.file;
    const { originalname, size, key, mimetype } = file;

    Media.create( { name: originalname, size, key, mimetype }, (err: Error, media: MediaModel) => {
      if (err) next(err);
      const { name, id } = media;
      media.expiringUrl(media.key, 3000, (err: null, url: string) => {
        const doc = { url, name, id };

        // background job to create media asset sizes
        job.media(doc);

        res.json(doc);
      });

    });
  }
};

export const index = (req: any, res: Response, next: NextFunction) => {
  Media.find({}, (err, files) => {
    if (err) next(err);

    res.json(files);
  });
};

export const show = (req: any, res: Response, next: NextFunction) => {
  const id = req.params.id;
  Media.findById(id, (err, doc: MediaModel) => {
    if (err) next(err);
    const { id, name, size, mimetype } = doc;

    doc.expiringUrl(doc.key, 3000, (err: null, url: string) => {
      const file = { url, id, name, size, mimetype };
      res.json(file);
    });
  });
};

export const destroy = (req: any, res: Response, next: NextFunction) => {
  const id = req.params.id;

  function deleteRecord(id: string) {
    Media.findOneAndRemove({ id }, (err, response) => {
      if (err) next(err);
      res.json(response);
    });
  }

  Media.findById(id, "key", async (err, doc: MediaModel) => {
    const deleteAsset = await s3Service.deleteMedia(doc.key);

    deleteRecord(id);
  });
};