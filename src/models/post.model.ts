import * as mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  comments: [ {type: mongoose.Schema.Types.ObjectId, ref: "Comments" } ]
});

module.exports = mongoose.model("Post", postSchema);