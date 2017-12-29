import { Response, Request, NextFunction } from "express";
import { default as Post } from "../models/post.model";
import { default as User } from "../models/user.model";
import * as boom from "boom";

User.find();

export let index = (req: Request, res: Response, next: NextFunction) => {
  Post.find()
      .populate({ path: "author" })
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
  Post.findById(req.params.id, (err, post) => {
    if (err) next(boom.notFound(err));
    post = Object.assign({}, post, req.body);
    post.save( (err) => {
      if (err) next(boom.badData(err));
      res.json("Post updated successfully");
    })
  });
};

export let show = (req: Request, res: Response, next: NextFunction) => {
  Post.findById(req.params.id)
      .populate("author")
      .populate("comments")
      .exec( (err, post) => {
        if (err) next(boom.notFound(err));
        res.json(post);
      });
};