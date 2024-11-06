import { Schema, model, models, Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  excerpt?: string;
  content: {
    blocks: Array<{
      type: string;
      data: {
        text?: string;
        [key: string]: any;
      };
    }>;
  };
  featuredImage?: {
    url: string;
    alt: string;
    caption?: string;
    imageId?: string;
  };
  category: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  author: Schema.Types.ObjectId;
  comments: Schema.Types.ObjectId[];
  status: "draft" | "published" | "archived";
  visibility: "public" | "private" | "password-protected";
  password?: string | null;
  metrics: {
    views: number;
    readingTime: number;
    likes: number;
    shares: number;
  };
  publishedAt?: Date;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
    focusKeywords?: string[];
    ogImage?: string;
  };
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
      default: "",
    },
    content: {
      type: {
        blocks: [
          {
            type: {
              type: String,
              required: true,
            },
            data: {
              type: Schema.Types.Mixed,
              required: true,
            },
          },
        ],
      },
      required: [true, "Content is required"],
    },
    featuredImage: {
      url: String,
      alt: String,
      caption: String,
      imageId: {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    visibility: {
      type: String,
      enum: ["public", "private", "password-protected"],
      default: "public",
    },
    password: {
      type: String,
      select: false,
      default: null,
    },
    metrics: {
      views: { type: Number, default: 0 },
      readingTime: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
    },
    publishedAt: Date,
    seo: {
      metaTitle: { type: String, required: true },
      metaDescription: { type: String, required: true },
      canonicalUrl: String,
      focusKeywords: [String],
      ogImage: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Post = models.Post || model<IBlogPost>("Post", blogPostSchema);
