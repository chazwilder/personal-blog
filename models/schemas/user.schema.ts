import mongoose from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    avatar: String,
    socialLinks: {
      twitter: String,
      github: String,
      linkedin: String,
      website: String,
    },
    role: {
      type: String,
      enum: ["admin", "author", "editor"],
      default: "author",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

userSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.email;
  return user;
};

export default userSchema;
