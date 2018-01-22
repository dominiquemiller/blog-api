import { default as User, UserModel } from "../../src/models/user.model";
import { createJWT, JWT } from "../../src/controllers/login.controller";

export const getUser = () => {
  return new Promise<UserModel>((res, rej) => {
    User.findOne()
        .sort({ field: "asc", _id: -1 })
        .limit(1)
        .exec((err, doc: UserModel) => { res(doc) });
  });
};

export const userJwt = () => {
  return new Promise<JWT>( async(res, rej) => {
    const user = await getUser();
    const jwt = await createJWT(user);
    res(jwt);
  });
};