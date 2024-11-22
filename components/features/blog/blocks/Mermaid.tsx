"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";

interface MermaidBlockProps {
  code: string;
  caption?: string;
  className?: string;
}

mermaid.initialize({
  startOnLoad: true,
  theme: "neutral",
  securityLevel: "loose",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
});

export function MermaidBlock({ code, caption, className }: MermaidBlockProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = "";
      mermaid
        .render(`mermaid-${Date.now()}`, code)
        .then(({ svg }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        })
        .catch((error) => {
          console.error("Mermaid rendering error:", error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `<pre class="text-red-500">Error rendering diagram: ${error.message}</pre>`;
          }
        });
    }
  }, [code]);

  return (
    <div className={cn("my-6", className)}>
      <div
        ref={mermaidRef}
        className="overflow-x-auto bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
      />
      {caption && (
        <p className="text-center text-sm text-neutral-500 mt-2">{caption}</p>
      )}
    </div>
  );
}
