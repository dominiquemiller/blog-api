import * as mongoose from "mongoose";

export type PostModel = mongoose.Document & {
  title: string;
  author: string;
  body: string;
  comments: string[];
};

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  comments: [ {type: mongoose.Schema.Types.ObjectId, ref: "Comment" } ]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;
