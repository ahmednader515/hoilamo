import { SignInForm } from "@/components/store/auth-forms";

export const metadata = {
  title: "تسجيل الدخول",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center bg-white px-4 py-28">
      <SignInForm />
    </div>
  );
}
