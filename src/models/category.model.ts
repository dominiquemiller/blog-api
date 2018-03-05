import * as mongoose from "mongoose";

export type CategoryModel = mongoose.Document & {
  title: string;
  posts?: Array<mongoose.Schema.Types.ObjectId>;
};

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

categorySchema.virtual("posts", { ref: "Post", localField: "_id", foreignField: "categories" } );

export const Category = mongoose.model("Category", categorySchema);
