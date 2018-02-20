import * as mongoose from "mongoose";
// fixtures
import { users } from "../fixtures/users.fixture";
import { posts } from "../fixtures/posts.fixture";
import { categories } from "../fixtures/categories.fixture";
import { tags } from "../fixtures/tags.fixtures";

// models
import { default as User, UserModel } from "../../src/models/user.model";
import { default as Post, PostModel } from "../../src/models/post.model";
import { Category, CategoryModel } from "../../src/models/category.model";
import { Tag, TagModel } from "../../src/models/tag.model";

export interface ModelSeed {
  name: mongoose.Model<any>;
  data: Array<any>;
}

export interface Models {
  [key: string]: ModelSeed;
}

const models: Models = { "User": { name: User, data: users },
                         "Posts": { name: Post, data: [] },
                         "Categories": { name: Category, data: categories },
                         "Tags": { name: Tag, data: tags } };

export const dropDB = (): void => {
  for (const key in models) {
    const model = models[key].name;
    model.collection.drop().then( (data) => { console.log("dropDb", data); } );
  }
};

// populates collection and returns last document created
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

export const getAPost = () => {
  return new Promise<PostModel>( (res, rej) => {
    Post.findOne({}, (err: any, doc: PostModel) => {
      res(doc);
    });
  });
};
