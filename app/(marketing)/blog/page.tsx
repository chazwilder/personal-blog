import { getPosts } from "@/lib/actions/posts.actions";
import BlogPosts from "./BlogPosts";

export default async function BlogPage() {
  const { posts = [], success } = await getPosts();

  if (!success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load posts</p>
      </div>
    );
  }

  return <BlogPosts initialPosts={posts} />;
}
