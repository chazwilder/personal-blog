"use client";
import React from "react";
import { BlogPost } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";

interface ClientBlogPostProps {
  initialPost: BlogPost;
}

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
        <p className="text-neutral-300 my-4 leading-relaxed text-lg">
          {block.data.text}
        </p>
      );

    case "image":
      return (
        <div className="my-6">
          <Image
            src={block.data.file?.url || block.data.url}
            alt={block.data.caption}
            width={1000}
            height={1000}
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
        <ListTag className="list-inside my-4 text-neutral-300 text-lg">
          {block.data.items.map((item: string, index: number) => (
            <li key={index} className="py-2 pl-1">
              <span>{item}</span>
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

    case "link":
      const isExternal = block.data.link.startsWith("http");
      return isExternal ? (
        <a
          href={block.data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-main hover:underline"
        >
          {block.data.text || block.data.link}
        </a>
      ) : (
        <Link href={block.data.link} className="text-main hover:underline">
          {block.data.text || block.data.link}
        </Link>
      );

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
      console.log("Unhandled block type:", block.type, block);
      return null;
  }
};

const ClientBlogPost = ({ initialPost }: ClientBlogPostProps) => {
  return (
    <article className="flex flex-col max-w-3xl mx-auto px-4 py-12 z-[999] w-full h-full">
      <header className="mb-12">
        {initialPost.featuredImage && (
          <div className="aspect-video relative mb-8">
            <Image
              src={initialPost.featuredImage}
              alt={initialPost.title}
              width={1000}
              height={1000}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {initialPost.title}
        </h1>
        <div className="flex flex-wrap gap-4 items-center text-neutral-400">
          <time>
            {new Date(initialPost.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span>•</span>
          <span>
            {Math.ceil(initialPost.content.blocks?.length / 4)} minute read
          </span>
        </div>
        {initialPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {initialPost.tags.map((tag) => (
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

      <div className="prose prose-invert space-y-2">
        {initialPost.content.blocks?.map((block: any, index: number) => (
          <div key={index}>{renderBlock(block)}</div>
        ))}
      </div>
    </article>
  );
};

export default ClientBlogPost;
