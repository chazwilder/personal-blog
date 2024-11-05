import mongoose from "mongoose";
import { IComment } from "../interfaces";

const commentSchema = new mongoose.Schema<IComment>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      website: String,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "spam", "deleted"],
      default: "pending",
    },
    likes: {
      type: Number,
      default: 0,
    },
    reports: {
      type: Number,
      default: 0,
    },
    ip: String,
    userAgent: String,
  },
  {
    timestamps: true,
  },
);

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ "author.userId": 1 });
commentSchema.index({ status: 1 });

export default commentSchema;
