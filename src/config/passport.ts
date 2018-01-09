import * as passport from "passport";
import * as passportJwt from "passport-jwt";
import { default as User } from "../models/user.model";

const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;

export interface JwtOptions {
  jwtFromRequest: passportJwt.JwtFromRequestFunction;
  secretOrKey: string;
}

export const jwtOptions: JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "superSecretBlogKey"
};

export const strategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  console.log("payload received", jwtPayload);
  User.findById(jwtPayload.id, (err, user) => {
    if (err) return done(null, false);

    return done(null, user);
  });
});
