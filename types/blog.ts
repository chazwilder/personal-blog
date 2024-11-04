export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogPost {
  _id?: string;
  title: string;
  content: {
    blocks: Array<{
      type: string;
      data: {
        text?: string;
        [key: string]: any;
      };
    }>;
  };
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

export interface FeaturedImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface ContentBlock {
  id?: string;
  type: string;
  data: {
    text?: string;
    level?: number;
    items?: string[];
    style?: "ordered" | "unordered";
    file?: {
      url: string;
      alt?: string;
    };
    [key: string]: any;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: {
    blocks: ContentBlock[];
  };
  excerpt?: string;
  featuredImage?: FeaturedImage;
  categoryId?: string;
  category?: string;
  tags: string[];
  status: "PUBLISHED" | "DRAFT";
  authorId: string;
  coAuthorIds?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  seriesOrder?: number;
  url?: string;
  alt?: string;
}

// types/api.ts
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BlogResponse extends PaginatedResponse<BlogPost> {}
