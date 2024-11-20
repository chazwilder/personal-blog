import { cn } from "@/lib/utils";
import { CodeBlockProps } from "@/types/blocks";

function highlightPythonSyntax(code: string) {
  // First escape HTML
  let result = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Process line by line to avoid regex overlapping issues
  result = result
    .split("\n")
    .map((line) => {
      return (
        line
          // Keywords
          .replace(
            /\b(class|def|if|elif|in|try|except|return|self|not)\b/g,
            '<span class="keyword">$1</span>',
          )
          // Class names (after class keyword)
          .replace(
            /\b(class\s+)([A-Z][a-zA-Z0-9_]*)/g,
            '$1<span class="class-name">$2</span>',
          )
          // Function names (after def keyword)
          .replace(
            /\b(def\s+)([a-zA-Z_][a-zA-Z0-9_]*)/g,
            '$1<span class="function">$2</span>',
          )
          // Function calls
          .replace(
            /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
            '<span class="function">$1</span>(',
          )
          // Exception names
          .replace(
            /\b([A-Z][a-zA-Z0-9_]*Error)\b/g,
            '<span class="class-name">$1</span>',
          )
          // Comments (must come last to not interfere with other patterns)
          .replace(/(#.*)$/g, '<span class="comment">$1</span>')
      );
    })
    .join("\n");

  return result;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "bg-neutral-800/75 backdrop-blur supports-[backdrop-filter]:bg-neutral-800/75",
        "p-4 rounded-lg my-4",
        "overflow-x-auto",
        "border border-neutral-700",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-3 text-neutral-400 text-xs">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
        </div>
        <span className="ml-auto uppercase text-neutral-500">python</span>
      </div>
      <code
        className={cn(
          "block font-mono text-sm leading-relaxed",
          "text-neutral-300",
          "[&_.keyword]:text-pink-400",
          "[&_.function]:text-blue-400",
          "[&_.class-name]:text-yellow-400",
          "[&_.comment]:text-neutral-500 [&_.comment]:italic",
          "whitespace-pre",
        )}
        dangerouslySetInnerHTML={{ __html: highlightPythonSyntax(code) }}
      />
    </pre>
  );
}
