"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { BlockToolConstructable, OutputData } from "@editorjs/editorjs";

// Import the upload handler
import { uploadFile } from "./UploadHandler";

type HeaderConfig = {
  levels: number[];
  defaultLevel: number;
  placeholder?: string;
};

type ListConfig = {
  defaultStyle: "unordered" | "ordered";
};

type QuoteConfig = {
  quotePlaceholder: string;
  captionPlaceholder: string;
};

type ImageConfig = {
  endpoints: {
    byFile: string;
    byUrl: string;
  };
  uploader?: {
    uploadByFile(
      file: File,
    ): Promise<{ success: number; file: { url: string } }>;
  };
};

type EmbedConfig = {
  services: {
    youtube?: boolean;
    codesandbox?: boolean;
    codepen?: boolean;
    gist?: boolean;
  };
};

type TableConfig = {
  rows?: number;
  cols?: number;
};

type AttachesConfig = {
  endpoint: string;
  buttonText?: string;
  errorMessage?: string;
  uploader?: {
    uploadByFile(file: File): Promise<{
      success: number;
      file: { url: string; name: string; size: number };
    }>;
  };
};

interface ToolConstructable {
  class: BlockToolConstructable;
  config?: any;
  inlineToolbar?: boolean;
  shortcut?: string;
}

type Tools = {
  header: ToolConstructable & { config: HeaderConfig };
  paragraph: { inlineToolbar: boolean };
  list: ToolConstructable & { config: ListConfig };
  checklist: ToolConstructable;
  quote: ToolConstructable & { config: QuoteConfig };
  delimiter: BlockToolConstructable;
  image: ToolConstructable & { config: ImageConfig };
  code: ToolConstructable;
  attaches: ToolConstructable & { config: AttachesConfig };
  embed: ToolConstructable & { config: EmbedConfig };
  table: ToolConstructable & { config: TableConfig };
  mermaid: ToolConstructable;
  raw: BlockToolConstructable;
};

interface BlogEditorProps {
  onChange?: (data: OutputData) => void;
  initialData?: OutputData | null;
}

const BlogEditor = ({ onChange, initialData }: BlogEditorProps) => {
  const editorRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (editorRef.current || !holderRef.current || isReady) {
      return;
    }

    const loadEditor = async () => {
      try {
        const [
          { default: EditorJS },
          { default: Header },
          { default: List },
          { default: Checklist },
          { default: Quote },
          { default: Delimiter },
          { default: Image },
          { default: Code },
          { default: Attaches },
          { default: Embed },
          { default: Table },
          { default: MermaidTool },
          { default: Raw },
        ] = await Promise.all([
          import("@editorjs/editorjs"),
          import("@editorjs/header"),
          import("@editorjs/list"),
          import("@editorjs/checklist"),
          import("@editorjs/quote"),
          import("@editorjs/delimiter"),
          import("@editorjs/image"),
          import("@editorjs/code"),
          import("@editorjs/attaches"),
          import("@editorjs/embed"),
          import("@editorjs/table"),
          import("editorjs-mermaid"),
          import("@editorjs/raw"),
        ]);

        const tools = {
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 1,
              placeholder: "Heading",
            },
            shortcut: "CMD+SHIFT+H",
          },
          paragraph: {
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote author",
            },
          },
          delimiter: Delimiter,
          image: {
            class: Image,
            config: {
              endpoints: {
                byFile: "/api/upload",
                byUrl: "/api/fetch-image",
                captionPlaceholder: false,
              },
              uploader: {
                async uploadByFile(file: File) {
                  try {
                    const url = await uploadFile(file);
                    return {
                      success: 1,
                      file: {
                        url,
                      },
                    };
                  } catch (error) {
                    console.error("Image upload failed:", error);
                    return {
                      success: 0,
                      file: {
                        url: "",
                      },
                    };
                  }
                },
              },
            },
          },
          code: {
            class: Code,
            shortcut: "CMD+SHIFT+C",
          },
          attaches: {
            class: Attaches,
            config: {
              endpoint: "/api/upload",
              uploader: {
                async uploadByFile(file: File) {
                  try {
                    const url = await uploadFile(file);
                    return {
                      success: 1,
                      file: {
                        url,
                        name: file.name,
                        size: file.size,
                      },
                    };
                  } catch (error) {
                    console.error("File upload failed:", error);
                    return {
                      success: 0,
                      file: {
                        url: "",
                        name: file.name,
                        size: file.size,
                      },
                    };
                  }
                },
              },
              buttonText: "Upload a file",
            },
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                codesandbox: true,
                codepen: true,
                gist: true,
              },
            },
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          mermaid: {
            class: MermaidTool,
          },
          raw: Raw,
        };

        const editor = new EditorJS({
          holder: holderRef.current,
          tools,
          placeholder: "Press '/' for commands...",
          defaultBlock: "paragraph",
          inlineToolbar: ["bold", "italic", "link"],
          data: initialData || { blocks: [] },
          onChange: async () => {
            try {
              if (onChange && editor) {
                const content = await editor.save();
                onChange(content);
              }
            } catch (e) {
              console.error("Editor save failed:", e);
            }
          },
          i18n: {
            messages: {
              tools: {
                header: {
                  "Heading 1": "Heading 1",
                  "Heading 2": "Heading 2",
                  "Heading 3": "Heading 3",
                  "Heading 4": "Heading 4",
                  "Heading 5": "Heading 5",
                  "Heading 6": "Heading 6",
                },
                list: {
                  "Bullet List": "Bullet List",
                  "Numbered List": "Numbered List",
                },
                checklist: "Checklist",
                quote: "Quote",
                delimiter: "Divider",
                image: "Image",
                code: "Code",
                attaches: "File Attachment",
                embed: "Embed",
                table: "Table",
                mermaid: "Mermaid Diagram",
                raw: "Raw HTML",
              },
            },
          },
        });

        await editor.isReady;
        editorRef.current = editor;
        setIsReady(true);

        // Configure Mermaid
        MermaidTool.config({ theme: "neutral" });
      } catch (error) {
        console.error("Failed to load editor:", error);
      }
    };

    loadEditor();

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
          setIsReady(false);
        } catch (e) {
          console.error("Editor cleanup failed:", e);
        }
      }
    };
  }, []);

  return (
    <div className="w-full h-full mx-auto">
      <div ref={holderRef} className="prose prose-lg max-w-none" />
    </div>
  );
};

export default dynamic(() => Promise.resolve(BlogEditor), {
  ssr: false,
});
