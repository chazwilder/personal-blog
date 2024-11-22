import React from "react";
import Image from "next/image";
import { AUTHOR_INFO } from "@/constants";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

const AuthorSection = () => {
  return (
    <div className="mt-16 border-t border-white/10 pt-8">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <Image
          src={AUTHOR_INFO.image}
          alt={AUTHOR_INFO.name}
          width={100}
          height={100}
          className="rounded-full shrink-0"
        />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white mb-2">
            {AUTHOR_INFO.name}
          </h3>
          <p className="text-white/60 mb-4">{AUTHOR_INFO.bio}</p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white/80 mb-2">
              Tech Stack
            </h4>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {AUTHOR_INFO.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center sm:justify-start gap-3 flex-wrap">
            {AUTHOR_INFO.links.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                className="text-main hover:underline text-sm flex items-center gap-1"
              >
                {link.name}
                <ExternalLinkIcon className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthorSection;
