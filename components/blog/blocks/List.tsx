import { cn } from "@/lib/utils";
import { ListBlockProps } from "@/types/blocks";
import DOMPurify from "isomorphic-dompurify";

export function ListBlock({ items, style, className }: ListBlockProps) {
  const ListTag = style === "ordered" ? "ol" : "ul";

  return (
    <ListTag
      className={cn(
        "my-4 text-neutral-300 text-lg",
        style === "ordered" ? "list-decimal" : "list-disc",
        "list-inside",
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={index} className="py-2">
          <span
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(item, {
                ALLOWED_TAGS: ["a", "strong", "em", "code", "br"],
                ALLOWED_ATTR: ["href", "target", "rel"],
              }),
            }}
            className="[&_a]:text-main [&_a]:hover:underline"
          />
        </li>
      ))}
    </ListTag>
  );
}
