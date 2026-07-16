import { SignUpForm } from "@/components/store/auth-forms";
import { getLogoUrl, getSiteContent } from "@/lib/get-site-content";

export const metadata = {
  title: "إنشاء حساب",
};

export default async function SignUpPage() {
  const content = await getSiteContent();
  const logoUrl = getLogoUrl(content);

  return (
    <div className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center bg-white px-4 py-28">
      <SignUpForm logoUrl={logoUrl} />
    </div>
  );
}
