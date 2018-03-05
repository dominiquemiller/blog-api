import * as mongoose from "mongoose";

export type TagModel = mongoose.Document & {
  title: string;
  posts?: Array<mongoose.Schema.Types.ObjectId>;
};

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true },
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

tagSchema.virtual("posts", { ref: "Post", localField: "_id", foreignField: "tags" } );

export const Tag = mongoose.model("Tag", tagSchema);