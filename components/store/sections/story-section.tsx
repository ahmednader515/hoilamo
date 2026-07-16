import { Coffee, Heart, Leaf } from "lucide-react";
import { TornEdge } from "@/components/store/torn-edge";
import { t, type SiteContentMap } from "@/lib/get-site-content";

export function StorySection({ content }: { content: SiteContentMap }) {
  const cards = [
    {
      icon: Coffee,
      title: t(content, "story.card1.title"),
      text: t(content, "story.card1.text"),
    },
    {
      icon: Leaf,
      title: t(content, "story.card2.title"),
      text: t(content, "story.card2.text"),
    },
    {
      icon: Heart,
      title: t(content, "story.card3.title"),
      text: t(content, "story.card3.text"),
    },
  ];

  return (
    <section
      id="story"
      className="relative scroll-mt-28 bg-white md:scroll-mt-32"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24 lg:px-14">
        <h2 className="text-3xl font-semibold text-amber-950 md:text-4xl">
          {t(content, "story.title")}
        </h2>
        <div className="max-w-3xl">
          <p className="mt-4 leading-relaxed text-amber-900/70">
            {t(content, "story.paragraph1")}
          </p>
          <p className="mt-4 leading-relaxed text-amber-900/70">
            {t(content, "story.paragraph2")}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {cards.map((item) => (
            <div
              key={item.title}
              className="border border-amber-900/10 bg-[#faf6f1] p-5"
            >
              <item.icon className="mb-3 h-6 w-6 text-amber-900" />
              <h3 className="font-semibold text-amber-950">{item.title}</h3>
              <p className="mt-1 text-sm text-amber-900/60">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <TornEdge fill="#faf6f1" />
    </section>
  );
}
