import * as mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  comments: [ {type: mongoose.Schema.Types.ObjectId, ref: "Comments" } ]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;