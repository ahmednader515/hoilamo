import { SignUpForm } from "@/components/store/auth-forms";

export const metadata = {
  title: "إنشاء حساب",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center bg-white px-4 py-28">
      <SignUpForm />
    </div>
  );
}
