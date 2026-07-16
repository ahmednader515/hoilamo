import { cn } from "@/lib/utils";

type Props = {
  /** Color of the section below (the "paper" showing through the tear) */
  fill?: string;
  className?: string;
  /** Use top overlay (for top of a section) instead of bottom */
  flip?: boolean;
};

/** Native overlay asset size — tile instead of stretching for a crisp edge */
const TILE_W = 456;
const TILE_H = 15;

/**
 * Torn-paper edge using /overlay-top.png and /overlay-bottom.png as masks.
 * Tiles at native pixel size (no upscale) and finishes with a solid strip so the
 * soft PNG alpha never leaves a hairline against the next section.
 */
export function TornEdge({
  fill = "#ffffff",
  className,
  flip = false,
}: Props) {
  const src = flip ? "/overlay-top.png" : "/overlay-bottom.png";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-[5]",
        flip ? "top-0" : "bottom-0",
        className
      )}
      style={{ height: TILE_H }}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: fill,
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: `${TILE_W}px ${TILE_H}px`,
          maskSize: `${TILE_W}px ${TILE_H}px`,
          WebkitMaskRepeat: "repeat-x",
          maskRepeat: "repeat-x",
          WebkitMaskPosition: flip ? "left top" : "left bottom",
          maskPosition: flip ? "left top" : "left bottom",
        }}
      />
      {/* Covers soft bottom/top alpha in the PNG so no dark hairline shows */}
      <div
        className={cn("absolute inset-x-0 h-[3px]", flip ? "top-0" : "bottom-0")}
        style={{ backgroundColor: fill }}
      />
    </div>
  );
}
