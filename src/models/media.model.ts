import * as mongoose from "mongoose";
import { getPreSignedUrl } from "../middleware/s3-file-upload";

export type MediaModel = mongoose.Document & {
  name: string;
  size: number;
  key: string;
  mimetype: string;
};

const mediaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  key: { type: String, required: true },
  mimetype: { type: String, required: true }
}, { timestamps: true });

mediaSchema.methods.expiringUrl = async function(key: string, expires: number, cb: (err: Error, url: string) => {}) {
  try {
    const url = await getPreSignedUrl(key, expires);
    cb(null, url);
  } catch (error) {
    cb(error, null);
  }
};

export const Media = mongoose.model("Media", mediaSchema);