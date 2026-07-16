import { prisma } from "@/lib/prisma";
import { getSiteContent, t } from "@/lib/get-site-content";
import { HomeHero } from "@/components/store/home-hero";
import { HashScroll } from "@/components/store/hash-scroll";
import { StorySection } from "@/components/store/sections/story-section";
import { ServicesSection } from "@/components/store/sections/services-section";
import { OfferSection } from "@/components/store/sections/offer-section";
import { ShopSection } from "@/components/store/sections/shop-section";
import { ContactSection } from "@/components/store/sections/contact-section";

export const dynamic = "force-dynamic";

async function getShopProducts() {
  try {
    return await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [products, content] = await Promise.all([
    getShopProducts(),
    getSiteContent(),
  ]);

  return (
    <div>
      <HashScroll />
      <HomeHero content={content} />
      <StorySection content={content} />
      <ServicesSection content={content} />
      <ShopSection
        content={content}
        products={products.map((p) => ({
          ...p,
          price: Number(p.price),
        }))}
      />
      <OfferSection
        content={{
          headline: t(content, "offer.headline"),
          title: t(content, "offer.title"),
          subtitle: t(content, "offer.subtitle"),
          emailPlaceholder: t(content, "offer.emailPlaceholder"),
          button: t(content, "offer.button"),
          success: t(content, "offer.success"),
        }}
      />
      <ContactSection content={content} />
    </div>
  );
}
