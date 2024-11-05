// models/index.ts
import mongoose from "mongoose";
import { IUser, IPost, IComment } from "./interfaces";
import userSchema from "@/models/schemas/user.schema";
import postSchema from "@/models/schemas/post.schema";
import commentSchema from "@/models/schemas/comment.schema";

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);
const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);

export { User, Post, Comment };
