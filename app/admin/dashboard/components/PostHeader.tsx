import { Plus } from "lucide-react";
import Link from "next/link";

export function PostHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Posts</h1>
      <Link
        href="/admin/editor"
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-main text-black rounded-md hover:bg-main/80 transition-colors text-sm sm:text-base"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">New Post</span>
        <span className="sm:hidden">New</span>
      </Link>
    </div>
  );
}
