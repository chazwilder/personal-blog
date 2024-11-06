import { Schema, model, models, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  postCount: number;
}

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Tag name must be at least 2 characters long"],
      maxlength: [50, "Tag name cannot exceed 50 characters"],
    },
    postCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Tag = models.Tag || model<ITag>("Tag", tagSchema);
