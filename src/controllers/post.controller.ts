import { Response, Request, NextFunction } from "express";
import { default as Post } from "../models/post.model";
import { default as User } from "../models/user.model";
import { default as Comment } from "../models/comment.model";
import * as boom from "boom";

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

export let update = (req: Request, res: Response, next: NextFunction) => {
  const doc = req.body;
  Post.update({ _id: req.params.id }, { title: doc.title, body: doc.body, tags: doc.tag, categories: doc.categories }, (err, post) => {
    if (err) next(boom.badData(err));
    res.json(post);
  });

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