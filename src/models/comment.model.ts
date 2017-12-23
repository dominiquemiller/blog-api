import * as mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  body: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);