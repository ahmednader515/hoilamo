import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { logoutCustomer } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "حسابي",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-28">
      <Card>
        <CardHeader>
          <CardTitle>حسابك</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            <p className="text-amber-900/60">الاسم</p>
            <p className="font-medium">{session.user.name}</p>
          </div>
          <div className="text-sm">
            <p className="text-amber-900/60">البريد الإلكتروني</p>
            <p className="font-medium">{session.user.email}</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="outline">
              <Link href="/#shop">متابعة التسوق</Link>
            </Button>
            <form action={logoutCustomer}>
              <Button type="submit" variant="destructive">
                تسجيل الخروج
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
