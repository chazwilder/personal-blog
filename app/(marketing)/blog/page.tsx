import { getPosts } from "@/lib/actions/posts";
import BlogPosts from "./BlogPosts";

export default async function BlogPage() {
  const { posts, pagination } = await getPosts({
    status: "PUBLISHED",
    visibility: "PUBLIC",
  });

  return <BlogPosts initialPosts={posts} />;
}
