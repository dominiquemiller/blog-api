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
  const update = req.body;
  Tag.findById(req.params.id, (err, tag) => {
    if (err) next(boom.badData(err));

    if (update.title) {
      tag.set( { title: update.title } );
    }

    tag.set( { $push: { posts: update.posts } } );
    tag.save( (err, updated) => {
      if (err) next(boom.badData(err));
      res.json(updated);
    });

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