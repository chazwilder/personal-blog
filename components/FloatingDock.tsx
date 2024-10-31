"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconAddressBook,
  IconArticle,
  IconBrandLinkedin,
  IconHome,
  IconLayoutDashboard,
  IconTerminal2,
} from "@tabler/icons-react";
import { useAuth } from "@clerk/nextjs";

export function FloatingDockComponent() {
  // Add isLoading check
  const { isSignedIn, isLoaded } = useAuth();

  // Return null or loading state while auth is loading
  if (!isLoaded) {
    return null;
  }

  // Base links that are always shown
  const baseLinks = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-black" />
      ),
      href: "/",
    },
    {
      title: "About",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-black" />
      ),
      href: "/about",
    },
    {
      title: "Blog",
      icon: (
        <IconArticle className="h-full w-full text-neutral-500 dark:text-black" />
      ),
      href: "/blog",
    },
    {
      title: "Contact",
      icon: (
        <IconAddressBook className="h-full w-full text-neutral-500 dark:text-black" />
      ),
      href: "/contact",
    },
  ];

  // Admin link shown only when logged in
  const adminLink = {
    title: "Dashboard",
    icon: (
      <IconLayoutDashboard className="h-full w-full text-neutral-500 dark:text-black" />
    ),
    href: "/admin/dashboard",
  };

  // LinkedIn link shown only when not logged in
  const linkedInLink = {
    title: "LinkedIn",
    icon: (
      <IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-black" />
    ),
    href: "https://www.linkedin.com/in/chaz-wilder/",
  };

  // Combine links based on auth status
  const links = isSignedIn
    ? [...baseLinks, adminLink]
    : [...baseLinks, linkedInLink];

  return (
    <div className="flex items-center justify-center w-full mt-auto fixed bottom-6 z-[999] p-6">
      <FloatingDock mobileClassName="translate-y-20 " items={links} />
    </div>
  );
}
