import { cn } from "@/lib/utils";
import { HeaderBlock } from "./Header";
import { ParagraphBlock } from "./Paragraph";
import { ImageBlock } from "./Image";
import { ListBlock } from "./List";
import { CodeBlock } from "./Code";
import { QuoteBlock } from "./Quote";
import { TableBlock } from "./Table";
import { MermaidBlock } from "./Mermaid";

interface BlockData {
  type: string;
  data: any;
}

// Helper function to create safe IDs
function createSafeId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing hyphens
}

export function BlockRenderer({ block }: { block: BlockData }) {
  switch (block.type) {
    case "header":
      const headerId = createSafeId(block.data.text);
      return (
        <div
          id={headerId}
          className="scroll-mt-24" // Add scroll margin for header offset
        >
          <HeaderBlock level={block.data.level} text={block.data.text} />
        </div>
      );

    case "paragraph":
      return <ParagraphBlock text={block.data.text} html={true} />;

    case "image":
      return (
        <ImageBlock
          url={block.data.file?.url || block.data.url}
          caption={block.data.caption}
          alt={block.data.caption || "Blog post image"}
        />
      );

    case "list":
      return (
        <ListBlock
          items={block.data.items}
          style={block.data.style === "ordered" ? "ordered" : "unordered"}
        />
      );

    case "code":
      return (
        <CodeBlock code={block.data.code} language={block.data.language} />
      );

    case "quote":
      return <QuoteBlock text={block.data.text} caption={block.data.caption} />;

    case "table":
      return <TableBlock content={block.data.content} />;

    case "mermaid":
      return (
        <MermaidBlock
          code={block.data.code}
          caption={block.data.caption || block.data.title}
        />
      );

    case "checklist":
      return (
        <ListBlock
          items={block.data.items.map(
            (item: any) => `[${item.checked ? "x" : " "}] ${item.text}`,
          )}
          style="unordered"
        />
      );

    case "delimiter":
      return (
        <hr className="my-8 border-t border-neutral-200 dark:border-neutral-800" />
      );

    case "raw":
      return (
        <div
          className="my-4 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: block.data.html }}
        />
      );

    case "embed":
      return (
        <div className="my-4 aspect-video">
          <iframe
            className="w-full h-full rounded-lg border border-neutral-200 dark:border-neutral-800"
            src={block.data.embed}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    default:
      console.warn(`Unsupported block type: ${block.type}`);
      return (
        <div className="my-4 p-4 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-800 dark:text-yellow-200">
          <p>Unsupported content block: {block.type}</p>
        </div>
      );
  }
}
