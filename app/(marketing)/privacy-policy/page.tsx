import { PrivacyPolicy } from "@/components/gdpr";

export default function PrivacyPolicyPage() {
  return (
    <PrivacyPolicy
      websiteUrl="https://chazwilder.io"
      contactEmail="hello@chazwilder.io"
      dpoEmail="privacy@chazwilder.io"
      companyAddress="Virginia, VA, USA"
    />
  );
}
