import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <ClerkProvider>
      <div className="antialiased w-full min-h-screen h-full flex flex-1 flex-col z-50 text-black">
        <NavBar />
        {children}
      </div>
    </ClerkProvider>
  );
}
