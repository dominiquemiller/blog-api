import * as mongoose from "mongoose";
import { getPreSignedUrl } from "../services/s3.service";

export type MediaModel = mongoose.Document & {
  name: string;
  size: number;
  key: string;
  mimetype: string;
  url?: string;
  expiringUrl: any;
};

const mediaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  key: { type: String, required: true },
  mimetype: { type: String, required: true }
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

mediaSchema.methods.expiringUrl = async function(key: string, expires: number, cb: (err: Error, url: string) => {}) {
  try {
    const url = await getPreSignedUrl(key, expires);
    cb(null, url);
  } catch (error) {
    cb(error, null);
  }
};

export const Media = mongoose.model("Media", mediaSchema);