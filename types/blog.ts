export interface BlogPost {
  _id?: string;
  title: string;
  content: any;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}

export type BlogPostCreate = Omit<
  BlogPost,
  "_id" | "createdAt" | "updatedAt" | "slug"
>;
