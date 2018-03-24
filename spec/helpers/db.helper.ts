import * as mongoose from "mongoose";
// fixtures
import { users } from "../fixtures/users.fixture";
import { posts } from "../fixtures/posts.fixture";
import { categories } from "../fixtures/categories.fixture";
import { tags } from "../fixtures/tags.fixtures";
import { media } from "../fixtures/media.fixture";

// models
import { default as User, UserModel } from "../../src/models/user.model";
import { default as Post, PostModel } from "../../src/models/post.model";
import { Category, CategoryModel } from "../../src/models/category.model";
import { Tag, TagModel } from "../../src/models/tag.model";
import { Media, MediaModel } from "../../src/models/media.model";

export interface ModelSeed {
  name: mongoose.Model<any>;
  data: Array<any>;
}

export interface Models {
  [key: string]: ModelSeed;
}

export interface Collections {
  [key: string]: string;
}

const models: Models = { "Users": { name: User, data: users },
                         "Posts": { name: Post, data: [] },
                         "Categories": { name: Category, data: categories },
                         "Tags": { name: Tag, data: tags },
                         "Media": { name: Media, data: media }
                        };

// clear all data in DB
export const dropDB = (collections: Collections): void => {
  for (const key in collections) {
    const value = collections[key];
    const model = models[value].name;
    model.collection.drop().then( (data) => { console.log("dropDb", data); } );
  }
};

// populates collection and returns last document created
export const seedModel = (name: string) => {
  return new Promise<any>( (res, rej) => {
    models[name].data.forEach( (item, index) => {
      const count = index + 1;
      const length = models[name].data.length;
      models[name].name.create(item, (err, doc: any) => {
        if (count === length) {
          res(doc);
        }
      });
    });
  });
};

// seed posts with categories and / or tags
export const seedPosts = (userId: string, catIds: string[] = [], tagIds: string[] = []) => {
  return new Promise( (res, rej) => {

    posts.forEach( (item, index) => {
      const count = index + 1;
      const length = posts.length;
      const post = Object.assign({}, item, { author: userId }, { categories: catIds }, { tags: tagIds });

      Post.create(post, (err: any, doc: any) => {
        if (count === length) {
          res(doc);
        }
      });

    });
  });
};

// get an array of IDS to populate another model
export function idArray(key: string): Promise<string[]> {
  return new Promise( (res, rej) => {
    const ids: string[] = [];

    models[key].name.find({}, (err: any, docs ) => {
      docs.forEach( (doc, index) => {
        const count = index + 1;
        const length = docs.length;

        ids.push(doc._id);
        if (count === length) {
          res(ids);
        }

      });
    });

  });
}

// get one post
export const getAPost = () => {
  return new Promise<PostModel>( (res, rej) => {
    Post.findOne({}, (err: any, doc: PostModel) => {
      res(doc);
    });
  });
};
