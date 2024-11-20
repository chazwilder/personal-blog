import { cn } from "@/lib/utils";
import { ParagraphBlockProps } from "@/types/blocks";
import DOMPurify from "isomorphic-dompurify";

export function ParagraphBlock({
  text,
  html = false,
  className,
}: ParagraphBlockProps) {
  const content = html ? (
    <div
      className={cn(
        "text-neutral-300 my-4 leading-relaxed text-lg [&_a]:text-main [&_a]:hover:underline",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
    />
  ) : (
    <p
      className={cn("text-neutral-300 my-4 leading-relaxed text-lg", className)}
    >
      {text}
    </p>
  );

  return content;
}
