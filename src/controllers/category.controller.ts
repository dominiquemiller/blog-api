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
  Category.findOneAndUpdate({ _id: req.params.id }, cat, { new: true }, (err, doc) => {
    if (err) next(boom.badData("Category not updated"));

    res.json(doc);
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