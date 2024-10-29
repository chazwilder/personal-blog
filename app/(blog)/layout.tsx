import NavBar from "@/components/NavBar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <NavBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
