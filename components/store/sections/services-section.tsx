import { Coffee, Clock, ShoppingBag } from "lucide-react";
import { TornEdge } from "@/components/store/torn-edge";
import { t, type SiteContentMap } from "@/lib/get-site-content";

export function ServicesSection({ content }: { content: SiteContentMap }) {
  const cards = [
    {
      icon: Coffee,
      title: t(content, "services.card1.title"),
      text: t(content, "services.card1.text"),
    },
    {
      icon: ShoppingBag,
      title: t(content, "services.card2.title"),
      text: t(content, "services.card2.text"),
    },
    {
      icon: Clock,
      title: t(content, "services.card3.title"),
      text: t(content, "services.card3.text"),
    },
  ];

  return (
    <section
      id="services"
      className="relative scroll-mt-28 bg-[#faf6f1] md:scroll-mt-32"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24 lg:px-14">
        <h2 className="text-3xl font-semibold text-amber-950 md:text-4xl">
          {t(content, "services.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-amber-900/65">
          {t(content, "services.intro")}
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((item) => (
            <div
              key={item.title}
              className="border border-amber-900/10 bg-white p-6"
            >
              <item.icon className="mb-4 h-7 w-7 text-amber-900" />
              <h3 className="text-lg font-semibold text-amber-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-amber-900/65">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <TornEdge fill="#ffffff" />
    </section>
  );
}
