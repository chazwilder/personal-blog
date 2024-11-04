import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageBlockProps } from "@/types/blocks";

export function ImageBlock({ url, caption, alt, className }: ImageBlockProps) {
  return (
    <div className={cn("my-6", className)}>
      <div className="aspect-video relative">
        <Image
          src={url}
          alt={alt}
          width={1000}
          height={1000}
          fill
          className="rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
      {caption && (
        <p className="text-center text-sm text-neutral-400 mt-2">{caption}</p>
      )}
    </div>
  );
}
