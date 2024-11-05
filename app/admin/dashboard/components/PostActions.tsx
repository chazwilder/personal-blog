import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

interface PostActionsProps {
  postId: string;
  onDelete: (id: string) => void;
}

export function PostActions({ postId, onDelete }: PostActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 mt-2 sm:mt-0 sm:ml-4">
      <Link
        href={`/admin/editor/${postId}`}
        className="text-gray-600 hover:text-gray-900"
      >
        <Edit2 className="w-4 h-4" />
      </Link>
      <button
        onClick={() => onDelete(postId)}
        className="text-red-600 hover:text-red-900"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
