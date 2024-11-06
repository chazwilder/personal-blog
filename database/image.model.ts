import { Schema, model, models, Document } from "mongoose";

export interface IImage extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  uploadedAt: Date;
}

const imageSchema = new Schema<IImage>({
  filename: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Image = models.Image || model<IImage>("Image", imageSchema);
