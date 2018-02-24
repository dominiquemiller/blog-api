import { Response, Request, NextFunction } from "express";
import { Category, CategoryModel } from "../models/category.model";
import * as boom from "boom";

export let index = (req: Request, res: Response, next: NextFunction) => {
  Category.find( (err, cats) => {
       if (err) next(boom.notFound(err));

       res.json(cats);
     });
};

export let create = (req: Request, res: Response, next: NextFunction) => {
  Category.create( req.body, (err, cat) => {
    if (err) next(boom.badRequest(err));

    res.json(cat);
  });
};

export let update = (req: Request, res: Response, next: NextFunction) => {
  const cat: CategoryModel = req.body;
  Category.findById(req.params.id, (err, category) => {
    if (err) next(boom.badData(err));

    if (cat.title) {
      category.set( { title: cat.title } );
    }

    category.set( { $push: { posts: cat.posts } } );
    category.save( (err, updated) => {
      if (err) next(boom.badData(err));
      res.json(updated);
    });

  });
};


export let show = (req: Request, res: Response, next: NextFunction) => {
  Category.findById(req.params.id)
      .populate("posts")
      .exec( (err, cat) => {
        if (err) next(boom.notFound(err));
        res.json(cat);
      });
};