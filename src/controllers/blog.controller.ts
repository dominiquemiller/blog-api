import { Response, Request, NextFunction } from "express";
import { default as Post } from "../models/post.model";
import { default as User } from "../models/user.model";
import * as boom from "boom";

export let index = (req: Request, res: Response, next: NextFunction) => {
  Post.find({}, (err, posts) => {
    if (err) next(boom.notFound(err));

    res.json(posts);
  });
};

export let create = (req: Request, res: Response, next: NextFunction) => {
  Post.create( req.body, (err, post) => {
    if (err) next(boom.notFound(err));

    res.json(post);
  });
};

export let update = (req: Request, res: Response, next: NextFunction) => {
  res.send("update blog");
};

export let show = (req: Request, res: Response, next: NextFunction) => {
  res.send("show individual blog");
};