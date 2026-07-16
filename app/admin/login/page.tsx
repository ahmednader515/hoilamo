import { redirect } from "next/navigation";

export const metadata = {
  title: "تسجيل الدخول",
};

export default function AdminLoginPage() {
  redirect("/sign-in");
}
