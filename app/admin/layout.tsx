import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page renders without the sidebar shell
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-svh bg-[#f7f1ea]">
      <AdminSidebar />
      <div className="min-h-svh min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
