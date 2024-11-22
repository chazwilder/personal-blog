import { Search } from "lucide-react";
import { PostStatus } from "@/types/blog";

interface PostFiltersProps {
  searchTerm: string;
  statusFilter: PostStatus;
  sortBy: "date" | "title";
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: PostStatus) => void;
  onSortChange: (sortBy: "date" | "title", sortOrder: "asc" | "desc") => void;
}

export function PostFilters({
  searchTerm,
  statusFilter,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: PostFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
          />
        </div>

        <div className="flex flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as PostStatus)}
            className="flex-1 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-");
              onSortChange(
                newSortBy as "date" | "title",
                newSortOrder as "asc" | "desc",
              );
            }}
            className="flex-1 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
