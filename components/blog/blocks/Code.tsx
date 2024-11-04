import { cn } from "@/lib/utils";
import { CodeBlockProps } from "@/types/blocks";

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "bg-neutral-800 p-4 rounded-lg my-4 overflow-x-auto",
        className,
      )}
    >
      <code
        className={cn(
          "text-neutral-300 text-sm",
          language && `language-${language}`,
        )}
      >
        {code}
      </code>
    </pre>
  );
}
