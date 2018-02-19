import { Response, Request, NextFunction } from "express";
import { default as Post } from "../models/post.model";
import { default as User } from "../models/user.model";
import { default as Comment } from "../models/comment.model";
import * as boom from "boom";

import { UpdatePostService } from "../services/update-post.service";

export let index = (req: Request, res: Response, next: NextFunction) => {
  Post.find()
      .populate({ path: "author" })
      .populate("comments")
      .exec( (err, posts) => {
        if (err) next(boom.notFound(err));

        res.json(posts);
      });
};

export let create = (req: Request, res: Response, next: NextFunction) => {
  Post.create( req.body, (err, post) => {
    if (err) next(boom.badRequest(err));

    res.json(post);
  });
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const service = new UpdatePostService(req.params.id, req.body);

  try {
    const update = await service.update();
    res.json(update);
  } catch (error) {
    next(boom.badRequest(error));
  }

};

export let show = (req: Request, res: Response, next: NextFunction) => {
  Post.findById(req.params.id)
      .populate("author")
      .populate("comments")
      .populate("tags")
      .populate("categories")
      .exec( (err, post) => {
        if (err) next(boom.notFound(err));
        res.json(post);
      });
};