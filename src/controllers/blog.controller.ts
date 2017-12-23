import { Response, Request, NextFunction } from "express";

export let index = (req: Request, res: Response, next: NextFunction) => {
  res.send("show all blogs");
};

export let create = (req: Request, res: Response, next: NextFunction) => {
  res.send("create blog");
};

export let update = (req: Request, res: Response, next: NextFunction) => {
  res.send("update blog");
};

export let show = (req: Request, res: Response, next: NextFunction) => {
  res.send("show individual blog");
};