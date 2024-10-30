import { AuroraBackground } from "@/components/ui/aurora-background";
import { FloatingDockComponent } from "@/components/FloatingDock";
import Image from "next/image";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <AuroraBackground>
        <div className="flex min-h-screen flex-col w-full justify-center">
          <div className="absolute top-0 left-0 z-[999]">
            <Link href="/" className="">
              <Image
                src="/logo.png"
                width={300}
                height={100}
                alt="Logo"
                className="dark:invert"
              />
            </Link>
          </div>
          <main className="flex flex-col flex-1 h-full items-center justify-center">
            {children}
          </main>
          <FloatingDockComponent />
        </div>
      </AuroraBackground>
    </ClerkProvider>
  );
}
