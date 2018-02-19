import * as mongoose from "mongoose";

export type CategoryModel = mongoose.Document & {
  title: string;
};

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  posts: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ]
}, { timestamps: true });

categorySchema.virtual("count").get(function() { return this.posts.length; });

export const Category = mongoose.model("Category", categorySchema);
