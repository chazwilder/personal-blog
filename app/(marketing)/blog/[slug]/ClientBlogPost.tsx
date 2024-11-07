import { BlogPost } from "@/types/blog";
import { BlockRenderer } from "@/components/blog/blocks/BlockRenderer";
import { PostHeader } from "@/components/blog/PostHeader";
import { NotFound } from "@/components/NotFound";

interface BlogContentProps {
  post: BlogPost;
}

export default function ClientBlogPost({ post }: BlogContentProps) {
  if (!post) {
    return <NotFound />;
  }

  return (
    <article className="flex flex-col max-w-3xl mx-auto px-4 py-12 z-[999] w-full h-full">
      <PostHeader
        title={post.title}
        featuredImage={post.featuredImage}
        date={new Date(post.createdAt)}
        readingTime={post.readingTime}
        tags={post.tags}
      />

      <div className="prose prose-invert space-y-2">
        {post.content?.blocks?.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>
    </article>
  );
}
