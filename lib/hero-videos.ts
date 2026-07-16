/** Fallback hero videos when SiteContent has no custom URLs yet */
export const DEFAULT_HERO_VIDEOS = [
  "/video-1.mp4",
  "/video-2.mp4",
  "/video-3.mp4",
] as const;

/** @deprecated Prefer getHeroVideos(content) from site-content */
export const HERO_VIDEOS = DEFAULT_HERO_VIDEOS;
