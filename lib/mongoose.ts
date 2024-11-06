import mongoose from "mongoose";
import { Post } from "@/database/post.model";
import { Category } from "@/database/category.model";
import { Tag } from "@/database/tag.model";
import { User } from "@/database/user.model";
import { Comment } from "@/database/comment.model";

export const models = { Post, Category, Tag, User, Comment };

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected!");
    return;
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing from environment variables");
    }

    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log("MongoDB Connected");

    // Register all models
    Object.values(models).forEach((model) => {
      if (!mongoose.models[model.modelName]) {
        mongoose.model(model.modelName, model.schema);
      }
    });

    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default models;
