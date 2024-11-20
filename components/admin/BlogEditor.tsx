"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { BlockToolConstructable, OutputData } from "@editorjs/editorjs";
import EditorjsList from "@editorjs/list";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import { uploadFile } from "./UploadHandler";

type HeaderConfig = {
  levels: number[];
  defaultLevel: number;
  placeholder?: string;
};

type ListConfig = {
  defaultStyle: "unordered" | "ordered";
  maxLevel?: number;
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

const lucideToSvg = (Icon: any) => {
  const defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = Icon.toString();

  return `<svg ${Object.entries(defaultAttributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ")}>${paths}</svg>`;
};

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
            toolbox: [
              {
                title: "Heading 1",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-1"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></svg>',
                data: { level: 1 },
              },
              {
                title: "Heading 2",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-2"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>',
                data: { level: 2 },
              },
              {
                title: "Heading 3",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-3"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>',
                data: { level: 3 },
              },
              {
                title: "Heading 4",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-4"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 10v4h4"/><path d="M21 10v8"/></svg>',
                data: { level: 4 },
              },
              {
                title: "Heading 5",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-5"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 13v-3h4"/><path d="M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17"/></svg>',
                data: { level: 5 },
              },
              {
                title: "Heading 6",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-6"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><circle cx="19" cy="16" r="2"/><path d="M20 10c-2 2-3 3.5-3 6"/></svg>',
                data: { level: 6 },
              },
            ],
          },
          paragraph: {
            inlineToolbar: true,
          },
          list: {
            class: EditorjsList,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
              maxLevel: 4,
            },
            toolbox: [
              {
                title: "Bullet List",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>',
                data: { style: "unordered" },
              },
              {
                title: "Numbered List",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-ordered"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>',
                data: {
                  style: "ordered",
                  meta: {
                    start: 1,
                    counterType: "numeric",
                  },
                },
              },
            ],
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
            config: {
              theme: "neutral",
            },
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
          onReady: () => {
            // Initialize drag and drop
            new DragDrop(editor);

            // Initialize undo/redo
            new Undo({ editor });

            // Add keyboard shortcuts for nested lists
            editor.keyboard.addBinding({
              key: "TAB",
              callback: (event) => {
                event.preventDefault();
                const currentBlock = editor.blocks.getCurrentBlock();
                if (currentBlock?.name === "list") {
                  editor.blocks
                    .getBlockByIndex(currentBlock.index)
                    ?.incrementLevel();
                }
              },
            });

            editor.keyboard.addBinding({
              key: "TAB",
              shiftKey: true,
              callback: (event) => {
                event.preventDefault();
                const currentBlock = editor.blocks.getCurrentBlock();
                if (currentBlock?.name === "list") {
                  editor.blocks
                    .getBlockByIndex(currentBlock.index)
                    ?.decrementLevel();
                }
              },
            });

            // Configure Mermaid
            MermaidTool.config({ theme: "neutral" });

            editorRef.current = editor;
            setIsReady(true);
          },
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
              ui: {
                blockTunes: {
                  toggler: {
                    "Click to tune": "Click to tune",
                    "or drag to move": "or drag to move",
                  },
                },
              },
            },
          },
        });
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
