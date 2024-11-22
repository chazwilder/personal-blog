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
    <ClerkProvider dynamic>
      <AuroraBackground>
        <div className="flex min-h-screen flex-col w-full justify-center mb-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-0 z-[999]">
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
          <main className="flex flex-col flex-1 h-full items-center justify-center py-20">
            {children}
          </main>
          <FloatingDockComponent />
        </div>
      </AuroraBackground>
    </ClerkProvider>
  );
}
