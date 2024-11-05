import Image from "next/image";
import { PostStatus } from "@/app/admin/dashboard/components/PostStatus";
import { BlogPost } from "@/types/blog";
import { PostActions } from "@/app/admin/dashboard/components/PostActions";

interface PostCardProps {
  post: BlogPost;
  onDelete: (id: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-gray-50">
      <div className="flex-1 min-w-0 mb-2 sm:mb-0">
        <div className="flex items-center">
          {post.featuredImage && (
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={40}
              height={40}
              className="rounded object-cover mr-3"
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {post.title}
            </div>
            <div className="flex items-center gap-2 mt-1 sm:hidden">
              <PostStatus status={post.status} />
              <span className="text-xs text-gray-500">
                {new Date(post.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-8">
        <PostStatus status={post.status} />
        <span className="text-sm text-gray-500 w-24">{post.category}</span>
        <span className="text-sm text-gray-500 w-32">
          {new Date(post.updatedAt).toLocaleDateString()}
        </span>
      </div>
      <PostActions postId={post._id} onDelete={onDelete} />
    </div>
  );
}
