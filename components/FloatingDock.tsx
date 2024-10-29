import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconAddressBook,
  IconArticle,
  IconBrandLinkedin,
  IconHome,
  IconTerminal2,
} from "@tabler/icons-react";

export function FloatingDockComponent() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },

    {
      title: "About",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/about",
    },
    {
      title: "Blog",
      icon: (
        <IconArticle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/blog",
    },
    {
      title: "Contact",
      icon: (
        <IconAddressBook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/contact",
    },
    {
      title: "LinkedIn",
      icon: (
        <IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.linkedin.com/in/chaz-wilder/",
    },
  ];
  return (
    <div className="flex items-center justify-center w-full mt-auto fixed bottom-4 z-[999]">
      <FloatingDock mobileClassName="translate-y-20" items={links} />
    </div>
  );
}
