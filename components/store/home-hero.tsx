import { HeroVideoBackground } from "@/components/store/hero-video-background";
import { TornEdge } from "@/components/store/torn-edge";
import { getHeroVideos, t, type SiteContentMap } from "@/lib/get-site-content";

export function HomeHero({ content }: { content: SiteContentMap }) {
  const videos = getHeroVideos(content);

  return (
    <section
      id="home"
      className="relative h-[100svh] min-h-[560px] w-full scroll-mt-0 overflow-x-hidden"
    >
      <HeroVideoBackground videos={videos} />

      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-32 md:px-10 md:pb-20 lg:px-14">
          <h1 className="max-w-xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5rem]">
            {t(content, "hero.title")}
          </h1>
          <p className="mt-4 text-xs font-medium tracking-[0.28em] text-white/90 sm:text-sm">
            {t(content, "hero.subtitle")}
          </p>
        </div>
      </div>

      <TornEdge fill="#ffffff" />
    </section>
  );
}
