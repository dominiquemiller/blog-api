import { BoomError } from "boom";
import { Response, Request, NextFunction } from "express";

export function errorHandler(err: BoomError | any, req: Request, res: Response, next: NextFunction) {
  if (err) {
    res.status(err.output.statusCode || 500).json(err.output.payload || "Something went wrong");
  }
  else {
    res.status(500).send("Something Went Wrong");
  }
}
