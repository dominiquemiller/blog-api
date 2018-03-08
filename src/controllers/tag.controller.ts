import { Response, Request, NextFunction } from "express";
import { Tag } from "../models/tag.model";
import * as boom from "boom";

export let index = (req: Request, res: Response, next: NextFunction) => {
  Tag.find( (err, tags) => {
       if (err) next(boom.notFound(err));
       res.json(tags);
     });
};

export let create = (req: Request, res: Response, next: NextFunction) => {
  Tag.create( req.body, (err, tag) => {
    if (err) next(boom.badRequest(err));

    res.json(tag);
  });
};

export let update = (req: Request, res: Response, next: NextFunction) => {
  const tag = req.body;
  Tag.findOneAndUpdate({_id: req.params.id }, tag, { new: true}, (err, doc) => {
    if (err) next(boom.badData("Tag not updated"));

    res.json(doc);
  });
};


export let show = (req: Request, res: Response, next: NextFunction) => {
  Tag.findById(req.params.id)
      .populate("posts")
      .exec( (err, tag) => {
        if (err) next(boom.notFound(err));
        res.json(tag);
      });
};