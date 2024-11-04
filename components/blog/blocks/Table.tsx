import { cn } from "@/lib/utils";
import { TableBlockProps } from "@/types/blocks";

export function TableBlock({ content, className }: TableBlockProps) {
  return (
    <div className={cn("overflow-x-auto my-6", className)}>
      <table className="w-full text-neutral-300">
        <tbody>
          {content.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-neutral-800 px-4 py-2"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
