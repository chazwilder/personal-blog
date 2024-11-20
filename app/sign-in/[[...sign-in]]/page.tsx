import { SignIn } from "@clerk/nextjs";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function SignInPage() {
  return (
    <AuroraBackground>
      <div className="flex items-center justify-center min-h-screen w-full">
        <SignIn
          appearance={{
            variables: { colorPrimary: "#b8ff34" },
            elements: {
              formButtonPrimary: "bg-main hover:bg-main/80 text-black",
              footer: "hidden",
            },
          }}
          fallbackRedirectUrl="/admin"
        />
      </div>
    </AuroraBackground>
  );
}
