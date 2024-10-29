import NavBar from "@/components/NavBar";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <AuroraBackground>
        <NavBar />
        <main className="flex flex-col w-full h-full flex-1 flex-grow items-center justify-center">
          {children}
        </main>
      </AuroraBackground>
    </div>
  );
}
