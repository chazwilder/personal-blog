import { Schema, model, models, Document, Types } from "mongoose";

export interface IComment extends Document {
  postId: Types.ObjectId;
  parentId?: Types.ObjectId;
  author: {
    userId?: Types.ObjectId;
  };
  content: string;
  status: "pending" | "approved" | "spam" | "deleted";
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
      required: [true, "Post ID is required"],
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      index: true,
    },
    author: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "spam", "deleted"],
      default: "pending",
      index: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Comment =
  models.Comment || model<IComment>("Comment", commentSchema);
