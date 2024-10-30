"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogPost } from "@/types/blog";

const renderBlock = (block: any) => {
  switch (block.type) {
    case "header":
      const TagName = `h${block.data.level}` as keyof JSX.IntrinsicElements;
      return (
        <TagName className="text-white font-bold my-4">
          {block.data.text}
        </TagName>
      );

    case "paragraph":
      return (
        <p className="text-neutral-300 my-4 leading-relaxed">
          {block.data.text}
        </p>
      );

    case "image":
      return (
        <div className="my-6">
          <img
            src={block.data.file?.url || block.data.url}
            alt={block.data.caption}
            className="rounded-lg max-w-full mx-auto"
          />
          {block.data.caption && (
            <p className="text-center text-sm text-neutral-400 mt-2">
              {block.data.caption}
            </p>
          )}
        </div>
      );

    case "list":
      const ListTag = block.data.style === "ordered" ? "ol" : "ul";
      return (
        <ListTag className="list-inside my-4 text-neutral-300">
          {block.data.items.map((item: string, index: number) => (
            <li key={index} className="my-2">
              {block.data.style === "ordered"
                ? `${index + 1}. ${item}`
                : `• ${item}`}
            </li>
          ))}
        </ListTag>
      );

    case "code":
      return (
        <pre className="bg-neutral-800 p-4 rounded-lg my-4 overflow-x-auto">
          <code className="text-neutral-300 text-sm">{block.data.code}</code>
        </pre>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-main pl-4 my-6">
          <p className="text-neutral-300 italic">{block.data.text}</p>
          {block.data.caption && (
            <cite className="text-neutral-400 text-sm block mt-2">
              — {block.data.caption}
            </cite>
          )}
        </blockquote>
      );

    case "delimiter":
      return <hr className="my-8 border-neutral-800" />;

    case "table":
      return (
        <div className="overflow-x-auto my-6">
          <table className="w-full text-neutral-300">
            <tbody>
              {block.data.content.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className="border border-neutral-800 px-4 py-2"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
};

const BlogPostPage = () => {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/slug/${params.slug}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-main border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen max-w-4xl w-full">
        <h1 className="text-2xl text-neutral-300">Post not found</h1>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 z-[999]">
      {/* Header Section */}
      <header className="mb-12">
        {post.featuredImage && (
          <div className="aspect-video relative mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-4 items-center text-neutral-400">
          <time>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span>•</span>
          <span>{Math.ceil(post.content.blocks?.length / 4)} minute read</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-neutral-800 text-neutral-400 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content Section */}
      <div className="prose prose-invert max-w-none">
        {post.content.blocks?.map((block: any, index: number) => (
          <div key={index}>{renderBlock(block)}</div>
        ))}
      </div>
    </article>
  );
};

export default BlogPostPage;
