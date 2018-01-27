import { Response, Request, NextFunction } from "express";
import { default as User, UserModel } from "../models/user.model";
import * as boom from "boom";

export let create = (req: Request, res: Response, next: NextFunction) => {
  User.create(req.body, (err, user: UserModel) => {
    if (err) next(boom.badRequest(err));

    res.status(201).json({ message: "ok", email: user.email });
  });
};