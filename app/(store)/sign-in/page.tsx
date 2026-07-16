import { SignInForm } from "@/components/store/auth-forms";
import { getLogoUrl, getSiteContent } from "@/lib/get-site-content";

export const metadata = {
  title: "تسجيل الدخول",
};

export default async function SignInPage() {
  const content = await getSiteContent();
  const logoUrl = getLogoUrl(content);

  return (
    <div className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center bg-white px-4 py-28">
      <SignInForm logoUrl={logoUrl} />
    </div>
  );
}
