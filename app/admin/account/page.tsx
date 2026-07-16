import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminAccountForms } from "@/components/admin/account-forms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "حساب المسؤول",
};

export default async function AdminAccountPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-amber-950">حساب المسؤول</h1>
        <p className="mt-1 text-sm text-amber-900/60">
          حدّث البريد الإلكتروني أو كلمة المرور لحساب الإدارة
          {user.name ? ` (${user.name})` : ""}.
        </p>
      </div>

      <AdminAccountForms currentEmail={user.email} />
    </div>
  );
}
