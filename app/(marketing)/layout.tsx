import { AuroraBackground } from "@/components/ui/aurora-background";
import { FloatingDockComponent } from "@/components/FloatingDock";
import Image from "next/image";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuroraBackground>
      <div className="flex min-h-screen flex-col w-full justify-center">
        <div className="absolute top-0 left-0 z-50">
          <Image
            src="/logo.png"
            width={300}
            height={100}
            alt="Logo"
            className="dark:invert z-50"
          />
        </div>
        <main className="flex flex-col flex-1 h-full items-center justify-center">
          {children}
        </main>
        <FloatingDockComponent />
      </div>
    </AuroraBackground>
  );
}
