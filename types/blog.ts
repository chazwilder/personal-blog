export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogPost {
  _id: string;
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
  slug: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
  } | null;
}

export type PostStatus = "all" | "published" | "draft";

export interface PostFilter {
  searchTerm?: string;
  status?: PostStatus;
  sortBy?: "date" | "title";
  sortOrder?: "asc" | "desc";
}

export type PostSortField = "date" | "title";
export type SortOrder = "asc" | "desc";

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
