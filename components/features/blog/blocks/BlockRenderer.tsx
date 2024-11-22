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
  data: {
    text?: string;
    level?: number;
    items?: any[];
    file?: { url: string };
    url?: string;
    caption?: string;
    code?: string;
    language?: string;
    content?: string[][];
    style?: string;
    title?: string;
    embed?: string;
    html?: string;
  };
}

interface ChecklistItem {
  checked: boolean;
  text: string;
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
      const headerId = createSafeId(block.data.text || "");
      return (
        <div id={headerId} className="scroll-mt-24">
          <HeaderBlock
            level={block.data.level || 1}
            text={block.data.text || ""}
          />
        </div>
      );

    case "paragraph":
      return (
        <div className="overflow-hidden">
          <ParagraphBlock text={block.data.text || ""} html={true} />
        </div>
      );

    case "image":
      return (
        <div className="my-4 sm:mx-0 relative">
          <ImageBlock
            url={block.data.file?.url || block.data.url || ""}
            caption={block.data.caption}
            alt={block.data.caption || "Blog post image"}
          />
        </div>
      );

    case "list":
      return (
        <div className="overflow-x-auto">
          <ListBlock
            items={block.data.items || []}
            style={block.data.style === "ordered" ? "ordered" : "unordered"}
          />
        </div>
      );

    case "code":
      return (
        <CodeBlock
          code={block.data.code || ""}
          language={block.data.language}
        />
      );

    case "quote":
      return (
        <div className="overflow-hidden">
          <QuoteBlock
            text={block.data.text || ""}
            caption={block.data.caption}
          />
        </div>
      );

    case "table":
      return (
        <div className="my-4 sm:mx-0">
          <div className="overflow-x-auto">
            <TableBlock content={block.data.content || []} />
          </div>
        </div>
      );

    case "mermaid":
      return (
        <div className="my-4 sm:mx-0">
          <div className="overflow-x-auto">
            <MermaidBlock
              code={block.data.code || ""}
              caption={block.data.caption || block.data.title}
            />
          </div>
        </div>
      );

    case "checklist":
      return (
        <div className="overflow-x-auto">
          <ListBlock
            items={(block.data.items || []).map(
              (item: ChecklistItem) =>
                `[${item.checked ? "x" : " "}] ${item.text}`,
            )}
            style="unordered"
          />
        </div>
      );

    case "delimiter":
      return (
        <hr className="my-8 border-t border-neutral-200 dark:border-neutral-800" />
      );

    case "raw":
      return (
        <div className="my-4 sm:mx-0">
          <div
            className="overflow-x-auto bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4"
            dangerouslySetInnerHTML={{ __html: block.data.html || "" }}
          />
        </div>
      );

    case "embed":
      return (
        <div className="my-4 sm:mx-0">
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full border border-neutral-200 dark:border-neutral-800"
              src={block.data.embed}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );

    default:
      console.warn(`Unsupported block type: ${block.type}`);
      return (
        <div className="my-4 p-4 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-800 dark:text-yellow-200 overflow-hidden">
          <p>Unsupported content block: {block.type}</p>
        </div>
      );
  }
}
