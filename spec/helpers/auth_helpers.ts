import { default as User, UserModel } from "../../src/models/user.model";
import { createJWT, JWT } from "../../src/controllers/login.controller";

export const getUser = (role: string) => {
  return new Promise<UserModel>((res, rej) => {
    User.findOne({ role }, (err, doc: UserModel) => { res(doc); } );
  });
};

export const userJwt = (user: UserModel) => {
  return new Promise<JWT>( async(res, rej) => {
    const jwt = await createJWT(user);
    res(jwt);
  });
};