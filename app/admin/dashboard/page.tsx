import PostList from "../../../components/features/admin/PostList";
import { getPosts } from "@/lib/actions/posts.actions";

export default async function AdminDashboard() {
  const result = await getPosts();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <PostList initialPosts={result} />
    </div>
  );
}
