import PostList from "./PostList";
import { getPosts } from "@/lib/actions/posts";

export default async function AdminDashboard() {
  const result = await getPosts();

  const initialPosts = {
    success: result.success,
    data: result.success ? result.data : [],
    error: result.error,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <PostList initialPosts={initialPosts} />
    </div>
  );
}
