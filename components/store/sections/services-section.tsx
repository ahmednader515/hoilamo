import { Coffee, Clock, ShoppingBag } from "lucide-react";
import Image from "next/image";
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
      className="relative overflow-x-hidden scroll-mt-28 md:scroll-mt-32"
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/background-offer.jpg"
          alt=""
          fill
          unoptimized
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-[#1a120c]/55" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]"
        aria-hidden
      />

      {/* Same top tear idea as Offer — paper color matches Story above */}
      <TornEdge flip fill="#ffffff" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24 lg:px-14">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          {t(content, "services.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-white/75">
          {t(content, "services.intro")}
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((item) => (
            <div
              key={item.title}
              className="border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
            >
              <item.icon className="mb-4 h-7 w-7 text-amber-100" />
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom tear — paper color matches Shop below */}
      <TornEdge fill="#ffffff" />
    </section>
  );
}
