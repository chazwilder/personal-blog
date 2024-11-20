import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageBlockProps } from "@/types/blocks";

export function ImageBlock({ url, caption, alt, className }: ImageBlockProps) {
  return (
    <div className="relative py-2">
      <div className="static">
        <div className="relative w-full">
          <Image
            src={url}
            alt={alt}
            width={1000}
            height={1000}
            className="rounded-lg object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority
          />
        </div>
      </div>
      {caption && (
        <p className="text-center text-sm text-neutral-400 mt-1">{caption}</p>
      )}
    </div>
  );
}
