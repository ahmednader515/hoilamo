import { auth } from "@/lib/auth";
import {
  getHeroVideos,
  getLogoUrl,
  getSiteContent,
} from "@/lib/get-site-content";
import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";
import { SiteLoader } from "@/components/store/site-loader";

export const dynamic = "force-dynamic";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, content] = await Promise.all([auth(), getSiteContent()]);
  const logoUrl = getLogoUrl(content);
  const heroVideos = getHeroVideos(content);

  return (
    <SiteLoader heroVideos={heroVideos} logoUrl={logoUrl}>
      <StoreHeader
        userName={session?.user?.name}
        isAdmin={session?.user?.role === "ADMIN"}
        logoUrl={logoUrl}
      />
      <main className="flex-1">{children}</main>
      <StoreFooter content={content} logoUrl={logoUrl} />
    </SiteLoader>
  );
}
