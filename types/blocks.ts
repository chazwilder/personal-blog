export interface BaseBlockProps {
  className?: string;
}

export interface HeaderBlockProps extends BaseBlockProps {
  level: number;
  text: string;
}

export interface ParagraphBlockProps extends BaseBlockProps {
  text: string;
  html?: boolean;
}

export interface ImageBlockProps extends BaseBlockProps {
  url: string;
  caption?: string;
  alt: string;
}

export interface ListBlockProps extends BaseBlockProps {
  items: string[];
  style: "ordered" | "unordered";
}

export interface CodeBlockProps extends BaseBlockProps {
  code: string;
  language?: string;
}

export interface QuoteBlockProps extends BaseBlockProps {
  text: string;
  caption?: string;
}

export interface TableBlockProps extends BaseBlockProps {
  content: string[][];
}
