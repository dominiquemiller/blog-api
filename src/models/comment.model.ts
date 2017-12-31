import * as mongoose from "mongoose";

export interface CommentModel extends mongoose.Document {
  body: string;
  email: string;
  post_id?: mongoose.Schema.Types.ObjectId;
}

const commentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  body: { type: String, required: true },
}, { timestamps: true });

const Comment = mongoose.model<CommentModel>("Comment", commentSchema);

export default Comment;
