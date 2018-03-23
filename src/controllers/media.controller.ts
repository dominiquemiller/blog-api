import { Response, Request, NextFunction } from "express";
import * as boom from "boom";
import { Media, MediaModel } from "../models/media.model";
import * as s3Service from "../services/s3.service";
import { job } from "../services/delayed-jobs.service";
import { getPreSignedUrl } from "../services/s3.service";

const matchMimeType = /png|jpg|jpeg|gif|tiff/g;

// need schema validation for file type
export let create = (req: any, res: Response, next: NextFunction) => {
  if (req.file) {
    const file = req.file;
    const { originalname, size, key, mimetype } = file;

    Media.create( { name: originalname, size, key, mimetype }, (err: Error, media: MediaModel) => {
      if (err) next(err);
      const { name, id } = media;
      media.expiringUrl(media.key, 3000, (err: null, url: string) => {
        const doc = { url, name, id, key };

        // background job: create media asset sizes
        if ( mimetype.match(matchMimeType) ) job.media(doc);

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

export const show = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const mediaSize = req.query.size;

  Media.findById(id, async (err, doc: MediaModel) => {
    if (err) next(err);
    const { id, name, size, mimetype } = doc;
    let sizeUrl: string = undefined;

    if (mediaSize) sizeUrl = await getPreSignedUrl(doc[`${mediaSize}Key`], 3000);
    const url = await getPreSignedUrl(doc.key, 3000);

    const file = { url, id, name, size, mimetype, [mediaSize]: sizeUrl };
    res.json(file);
  });
};

export const destroy = (req: Request, res: Response, next: NextFunction) => {
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