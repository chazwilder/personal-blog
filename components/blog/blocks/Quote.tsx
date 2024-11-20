import { cn } from "@/lib/utils";
import { QuoteBlockProps } from "@/types/blocks";

export function QuoteBlock({ text, caption, className }: QuoteBlockProps) {
  return (
    <blockquote className={cn("border-l-4 border-main pl-4 my-6", className)}>
      <p className="text-neutral-300 italic">{text}</p>
      {caption && (
        <cite className="text-neutral-400 text-sm block mt-2">— {caption}</cite>
      )}
    </blockquote>
  );
}
