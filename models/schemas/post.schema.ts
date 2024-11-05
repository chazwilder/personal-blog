import mongoose from "mongoose";
import { IPost } from "../interfaces";
import slugify from "slugify";

const postSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      blocks: [
        {
          type: mongoose.Schema.Types.Mixed,
        },
      ],
      plainText: String,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coAuthors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    featuredImage: {
      url: String,
      alt: String,
      caption: String,
    },
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
    password: String,
    seo: {
      metaTitle: String,
      metaDescription: String,
      canonicalUrl: String,
      focusKeywords: [String],
      ogImage: String,
    },
    metrics: {
      views: { type: Number, default: 0 },
      uniqueViews: { type: Number, default: 0 },
      readingTime: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
    },
    publishedAt: Date,
    scheduledFor: Date,
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostVersion",
      },
    ],
  },
  {
    timestamps: true,
  },
);

postSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

postSchema.index({ slug: 1 });
postSchema.index({ author: 1 });
postSchema.index({ status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

postSchema.methods.incrementViews = async function () {
  this.metrics.views += 1;
  await this.save();
};

postSchema.methods.addLike = async function () {
  this.metrics.likes += 1;
  await this.save();
};

export default postSchema;
