import Link from "next/link";
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "lucide-react";

export function SocialShare({ url, title }: { url: string; title: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4 my-8">
      <span className="text-sm text-white/60">Share:</span>
      <div className="flex gap-2">
        <Link
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <LinkedinIcon className="w-4 h-4 text-white/60" />
        </Link>
        <Link
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <TwitterIcon className="w-4 h-4 text-white/60" />
        </Link>
        <Link
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <FacebookIcon className="w-4 h-4 text-white/60" />
        </Link>
      </div>
    </div>
  );
}
