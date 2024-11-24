import { privacyPolicy } from "@/components/gdpr";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-invert">
      <div dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
    </div>
  );
}
