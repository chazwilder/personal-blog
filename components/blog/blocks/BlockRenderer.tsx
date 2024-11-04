import { HeaderBlock } from "./Header";
import { ParagraphBlock } from "./Paragraph";
import { ImageBlock } from "./Image";
import { ListBlock } from "./List";
import { CodeBlock } from "./Code";
import { QuoteBlock } from "./Quote";
import { TableBlock } from "./Table";

interface BlockData {
  type: string;
  data: any;
}

export function BlockRenderer({ block }: { block: BlockData }) {
  switch (block.type) {
    case "header":
      return <HeaderBlock level={block.data.level} text={block.data.text} />;

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

    default:
      console.warn(`Unsupported block type: ${block.type}`);
      return null;
  }
}
