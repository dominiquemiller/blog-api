import * as mongoose from "mongoose";

export type CategoryModel = mongoose.Document & {
  title: string;
};

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true }
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);
