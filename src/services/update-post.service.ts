import { Category, CategoryModel } from "../models/category.model";
// import { Tag, TagModel } from "../models/tag.model";
// import { default as Post } from "../models/post.model";
// import * as mongoose from "mongoose";

// export class UpdatePostService {
//   postId: mongoose.Schema.Types.ObjectId;
//   postParams: any;
//   categories: mongoose.Schema.Types.ObjectId[];
//   tags: mongoose.Schema.Types.ObjectId[];

//   constructor(id: mongoose.Schema.Types.ObjectId, request: any) {
//     this.postId = id;
//     this.postParams = request;
//     this.categories = request.categories || [];
//     this.tags = request.tags || [];
//   }

//   update() {
//     return new Promise( async (res, rej) => {
//       try {
//         const cats = await this.catsAndTags(Category, this.categories);
//         const tags = await this.catsAndTags(Tag, this.tags);
//       } catch (error) {
//         rej(error);
//       }

//       Post.findOneAndUpdate({ _id: this.postId }, this.postParams, { new: true }, (error, post) => {
//         if (error) rej(error);

//         res(post);
//       });
//     });
//   }

//   catsAndTags(model: mongoose.Model<mongoose.Document>, items: mongoose.Schema.Types.ObjectId[]) {
//     return new Promise( (res, rej) => {
//       if (items === undefined || items.length === 0) res("Empty Array");

//       items.forEach( (item: mongoose.Schema.Types.ObjectId) => {
//         model.findOneAndUpdate({_id: item }, {posts: this.postId}, (err, data) => {
//           if (err) rej(err);

//           res(data);
//         });
//       });
//     });
//   }
// }