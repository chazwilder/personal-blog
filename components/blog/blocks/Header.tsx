import { cn } from "@/lib/utils";
import { HeaderBlockProps } from "@/types/blocks";

export function HeaderBlock({ level, text, className }: HeaderBlockProps) {
  const TagName = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <TagName
      className={cn(
        "font-bold py-4",
        level === 1 && "text-4xl",
        level === 2 && "text-3xl",
        level === 3 && "text-2xl",
        level === 4 && "text-xl",
        level === 5 && "text-lg",
        level === 6 && "text-base",
        className,
      )}
    >
      {text}
    </TagName>
  );
}
