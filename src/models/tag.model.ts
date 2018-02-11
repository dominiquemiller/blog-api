import * as mongoose from "mongoose";

export type TagModel = mongoose.Document & {
  title: string;
};

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true }
}, { timestamps: true });

export const Tag = mongoose.model("Tag", tagSchema);