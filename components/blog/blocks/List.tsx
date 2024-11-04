import { cn } from "@/lib/utils";
import { ListBlockProps } from "@/types/blocks";

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
        <li key={index} className="py-2 pl-1">
          <span>{item}</span>
        </li>
      ))}
    </ListTag>
  );
}
