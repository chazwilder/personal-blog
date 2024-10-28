// components/admin/BlogEditor.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

type EditorJS = any;

const BlogEditor = () => {
  const editorRef = useRef<EditorJS>();
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadEditor = async () => {
      try {
        const [
          { default: EditorJS },
          { default: Header },
          { default: List },
          { default: Code },
          { default: LinkTool },
          { default: Image },
          { default: Embed },
          { default: Quote },
          { default: Checklist },
          { default: Delimiter },
          { default: Marker },
          { default: Table },
          { default: Warning },
          { default: InlineCode },
          { default: Alert },
          { default: Title },
          { default: Attaches },
          { default: MermaidTool },
          { default: Hyperlink },
          { default: Raw },
          { default: DragDrop },
          { default: Undo },
        ] = await Promise.all([
          import("@editorjs/editorjs"),
          import("@editorjs/header"),
          import("@editorjs/nested-list"),
          import("@editorjs/code"),
          import("@editorjs/link"),
          import("@editorjs/image"),
          import("@editorjs/embed"),
          import("@editorjs/quote"),
          import("@editorjs/checklist"),
          import("@editorjs/delimiter"),
          import("@editorjs/marker"),
          import("@editorjs/table"),
          import("@editorjs/warning"),
          import("@editorjs/inline-code"),
          import("editorjs-alert"),
          import("title-editorjs"),
          import("@editorjs/attaches"),
          import("editorjs-mermaid"),
          import("editorjs-hyperlink"),
          import("@editorjs/raw"),
          import("editorjs-drag-drop"),
          import("editorjs-undo"),
        ]);

        if (!holderRef.current || editorRef.current) {
          return;
        }

        const editor = new EditorJS({
          holder: holderRef.current,
          placeholder: "Let's write an awesome blog post!",
          inlineToolbar: true,
          tools: {
            title: {
              class: Title,
            },
            alert: {
              class: Alert,
              inlineToolbar: true,
              shortcut: "CMD+SHIFT+A",
              config: {
                defaultType: "info",
                messagePlaceholder: "Enter something",
              },
            },
            attaches: {
              class: Attaches,
              config: {
                endpoint: "/api/upload-file",
                buttonText: "Select file",
                errorMessage: "File upload failed",
              },
            },
            mermaid: {
              class: MermaidTool,
            },
            hyperlink: {
              class: Hyperlink,
              config: {
                shortcut: "CMD+L",
                target: "_blank",
                rel: "nofollow",
                availableTargets: ["_blank", "_self"],
                availableRels: ["nofollow", "noreferrer"],
                validate: true,
              },
            },
            raw: Raw,
            header: {
              class: Header,
              config: {
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 1,
                placeholder: "Heading",
              } as const,
              shortcut: "CMD+SHIFT+H",
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
              shortcut: "CMD+SHIFT+L",
            },
            code: {
              class: Code,
              shortcut: "CMD+SHIFT+C",
            },
            linkTool: {
              class: LinkTool,
              config: {
                endpoint: "/api/link-meta",
              },
            },
            image: {
              class: Image,
              config: {
                endpoints: {
                  byFile: "/api/upload-image",
                  byUrl: "/api/fetch-image",
                },
                uploader: {
                  uploadByFile(file: File) {
                    return Promise.resolve({
                      success: 1,
                      file: {
                        url: "https://example.com/image.png",
                      },
                    });
                  },
                },
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
            quote: {
              class: Quote,
              inlineToolbar: true,
              shortcut: "CMD+SHIFT+Q",
              config: {
                quotePlaceholder: "Enter a quote",
                captionPlaceholder: "Quote's author",
              },
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true,
            },
            delimiter: Delimiter,
            table: {
              class: Table,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3,
              },
            },
            warning: {
              class: Warning,
              inlineToolbar: true,
              config: {
                titlePlaceholder: "Title",
                messagePlaceholder: "Message",
              },
            },
            marker: {
              class: Marker,
              shortcut: "CMD+SHIFT+M",
            },
            inlineCode: {
              class: InlineCode,
              shortcut: "CMD+SHIFT+C",
            },
          },
          data: {
            blocks: [],
          },
          autofocus: true,
          onChange: () => {
            console.log("Content changed");
          },
        });

        await editor.isReady;
        editorRef.current = editor;

        new DragDrop(editor);

        const undo = new Undo({ editor });
        undo.initialize(await editor.save());

        MermaidTool.config({ theme: "neutral" });
      } catch (error) {
        console.error("Failed to load editor:", error);
      }
    };

    loadEditor();

    return () => {
      const cleanup = async () => {
        if (editorRef.current && editorRef.current.destroy) {
          try {
            await editorRef.current.destroy();
            editorRef.current = undefined;
          } catch (e) {
            console.error("Editor cleanup failed:", e);
          }
        }
      };

      cleanup();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <style jsx global>{`
        .codex-editor__redactor {
          padding-bottom: 120px !important;
        }

        .ce-block__content {
          max-width: 100%;
          margin: 0;
        }

        .ce-toolbar__content {
          max-width: 100%;
          margin: 0;
        }

        .ce-code__textarea {
          min-height: 200px;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas",
            "source-code-pro", monospace;
        }

        .ce-header {
          padding-top: 0.5em;
          padding-bottom: 0.1em;
        }

        .cdx-alert {
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 0.375rem;
        }

        .cdx-alert--info {
          background-color: #e0f2fe;
          border: 1px solid #7dd3fc;
        }

        .cdx-alert--warning {
          background-color: #fef9c3;
          border: 1px solid #fde047;
        }

        /* Title styling */
        .ce-title {
          margin-bottom: 1rem;
        }

        /* Mermaid styling */
        .ce-mermaid {
          padding: 1rem 0;
        }

        /* Raw HTML block styling */
        .ce-rawtool__textarea {
          min-height: 200px;
          font-family: monospace;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.375rem;
        }
      `}</style>
      <div ref={holderRef} className="prose prose-lg max-w-none" />
    </div>
  );
};

// Export as dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(BlogEditor), {
  ssr: false,
});
