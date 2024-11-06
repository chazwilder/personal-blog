// components/blog/PostHeader.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Tag } from "@/types/blog";

interface PostHeaderProps {
  title: string;
  featuredImage?: {
    url: string;
    alt: string;
    imageId?: string;
  };
  date: Date;
  readingTime: number;
  tags: Tag[];
  className?: string;
}

export function PostHeader({
  title,
  featuredImage,
  date,
  readingTime,
  tags,
  className,
}: PostHeaderProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <header className={cn("mb-12", className)}>
      {featuredImage && (
        <div className="aspect-video relative mb-8">
          <Image
            src={featuredImage}
            alt={featuredImage.alt}
            fill
            className="rounded-lg object-cover"
            priority
            unoptimized={!!featuredImage.imageId}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        {title}
      </h1>

      <div className="flex flex-wrap gap-4 items-center text-neutral-400">
        <time dateTime={date.toISOString()}>{formatDate(date)}</time>
        <span className="text-neutral-600">•</span>
        <span>{readingTime} minute read</span>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-neutral-800 text-neutral-400 rounded-full text-sm hover:bg-neutral-700 transition-colors"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
