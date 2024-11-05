import { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  name: string;
  bio: string;
  avatar: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  role: "admin" | "author" | "editor";
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}

export interface IPost extends Document {
  title: string;
  slug: string;
  content: {
    blocks: any[];
    plainText: string;
  };
  excerpt: string;
  author: Types.ObjectId;
  coAuthors: Types.ObjectId[];
  category: Types.ObjectId;
  tags: Types.ObjectId[];
  featuredImage: {
    url: string;
    alt: string;
    caption?: string;
  };
  status: "draft" | "published" | "archived";
  visibility: "public" | "private" | "password-protected";
  password?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
    focusKeywords: string[];
    ogImage?: string;
  };
  metrics: {
    views: number;
    uniqueViews: number;
    readingTime: number;
    likes: number;
    shares: number;
  };
  publishedAt?: Date;
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy: Types.ObjectId;
  version: number;
  previousVersions: Types.ObjectId[];
}

export interface ITag extends Document {
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  postId: Types.ObjectId;
  parentId?: Types.ObjectId;
  author: {
    userId?: Types.ObjectId;
    name: string;
    email: string;
    website?: string;
  };
  content: string;
  status: "pending" | "approved" | "spam" | "deleted";
  likes: number;
  reports: number;
  ip: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}
