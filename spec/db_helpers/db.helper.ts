import * as mongoose from "mongoose";
// fixtures
import { users } from "../fixtures/users.fixture";
import { posts } from "../fixtures/posts.fixture";
// models
import { default as User, UserModel } from "../../src/models/user.model";
import { default as Post } from "../../src/models/post.model";

export interface ModelSeed {
  name: mongoose.Model<any>;
  data: Array<any>;
}

export interface Models {
  [key: string]: ModelSeed;
}

const models: Models = { "User": { name: User, data: users },
                         "Posts": { name: Post, data: [] } };

export const dropDB = (): void => {
  for (const key in models) {
    const model = models[key].name;
    model.collection.drop().then( (data) => { console.log("dropDb", data); } );
  }
};

export const seedModel = (name: string) => {
  return new Promise<UserModel>( (res, rej) => {
    models[name].data.forEach( (item, index) => {
      const count = index + 1;
      const length = models[name].data.length;
      models[name].name.create(item, (err, doc: UserModel) => {
        if (count === length) {
          res(doc);
        }
      });
    });
  });
};

export const seedPosts = (userId: string) => {
  return new Promise( (res, rej) => {
    posts.forEach( (item, index) => {
      const count = index + 1;
      const length = posts.length;
      const post = Object.assign({}, item, { author: userId });
      Post.create(post, (err: any, doc: any) => {
        if (count === length) {
          res(doc);
        }
      });
    });
  });
};
