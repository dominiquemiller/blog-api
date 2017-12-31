import * as bcyrpt from "bcrypt-nodejs";
import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

// add encrypting and compare password functions below
const User = mongoose.model("User", userSchema);

export default User;

