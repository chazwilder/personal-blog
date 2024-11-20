import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateReadingTime = (blocks: any[] = []) => {
  const WORDS_PER_MINUTE = 170;
  let wordCount = 0;

  blocks.forEach((block) => {
    switch (block.type) {
      case "paragraph":
      case "header":
      case "quote":
        wordCount += block.data.text.split(/\s+/).length;
        break;
      case "list":
        wordCount += block.data.items.join(" ").split(/\s+/).length;
        break;
    }
  });

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};
