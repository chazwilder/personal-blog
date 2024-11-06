// types/blog.ts

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: {
    blocks: Array<{
      type: string;
      data: any;
    }>;
  };
  excerpt?: string;
  slug: string;
  status: "draft" | "published";
  category: Category | null;
  tags: Tag[];
  featuredImage?: {
    url: string;
    alt: string;
    imageId?: string;
  };
  createdAt: string;
  updatedAt: string;
  author: Author | null;
}
