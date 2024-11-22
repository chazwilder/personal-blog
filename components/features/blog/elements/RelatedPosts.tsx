import { BlogPost } from "@/types/blog";
import Link from "next/link";
import Image from "next/image";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="mt-16">
      <h3 className="text-xl font-bold text-white mb-6">Related Posts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <article className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/15 transition-colors">
              {post.featuredImage && (
                <div className="aspect-video relative">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white group-hover:text-main transition-colors">
                  {post.title}
                </h4>
                <p className="text-sm text-white/60 mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
