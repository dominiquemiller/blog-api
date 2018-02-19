import * as mongoose from "mongoose";

export type TagModel = mongoose.Document & {
  title: string;
};

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true },
  posts: [ { type: mongoose.Schema.Types.ObjectId, ref: "Post" } ]
}, { timestamps: true });

tagSchema.virtual("count").get(function() { return this.posts.length; });

export const Tag = mongoose.model("Tag", tagSchema);