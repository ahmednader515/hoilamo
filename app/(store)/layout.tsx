import { auth } from "@/lib/auth";
import { getSiteContent } from "@/lib/get-site-content";
import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";
import { SiteLoader } from "@/components/store/site-loader";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, content] = await Promise.all([auth(), getSiteContent()]);

  return (
    <SiteLoader>
      <StoreHeader
        userName={session?.user?.name}
        isAdmin={session?.user?.role === "ADMIN"}
      />
      <main className="flex-1">{children}</main>
      <StoreFooter content={content} />
    </SiteLoader>
  );
}
