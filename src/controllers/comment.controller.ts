import { Response, Request, NextFunction } from "express";
import { CommentService } from "../services/comment.service";
import * as boom from "boom";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const service = new CommentService(req.body);
  try {
    const update = await service.createComment();
    res.json(update);
  } catch (error) {
    next(boom.badRequest(error));
  }
};