import { Response, Request, NextFunction } from "express";
import * as boom from "boom";
import { default as User, UserModel } from "../models/user.model";

export const roleAuthorization = ( roles: string[] ) => {

  return function( req: Request, res: Response, next: NextFunction ) {
      const user = req.user;

      console.log(req.user);

      User.findById(user._id, (err, doc: UserModel) => {

          if (err) {
              const error = boom.notFound("User not found");
              return next(error);
          }

          if (roles.indexOf(doc.role) > -1) {
              // authorized to view content
              return next();
          }

          const error = boom.unauthorized();
          return next(error);

      });

  };

};