"use client";

import { useEffect, useState } from "react";
import { HoilamoLogo } from "@/components/store/hoilamo-logo";
import { cn } from "@/lib/utils";

const LOAD_TIMEOUT_MS = 120_000;
const RING_SIZE = 168;
const RING_STROKE = 1.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

async function preloadWithByteProgress(
  src: string,
  onProgress: (fraction: number, bytesTotal: number) => void
): Promise<void> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), LOAD_TIMEOUT_MS);

  try {
    const res = await fetch(src, {
      signal: controller.signal,
      cache: "force-cache",
    });
    if (!res.ok) throw new Error(`Failed to load ${src}`);

    const total = Number(res.headers.get("content-length")) || 0;
    if (!res.body) {
      onProgress(1, total || 1);
      return;
    }

    const reader = res.body.getReader();
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (total > 0) {
        onProgress(Math.min(1, received / total), total);
      } else {
        onProgress(Math.min(0.95, received / (received + 2_000_000)), received);
      }
    }

    onProgress(1, total || received || 1);
  } catch {
    onProgress(1, 1);
  } finally {
    window.clearTimeout(timeout);
  }
}

type Props = {
  children: React.ReactNode;
  heroVideos: string[];
  /** Admin-managed brand logo — shown on the splash / loading screen */
  logoUrl: string;
};

export function SiteLoader({ children, heroVideos, logoUrl }: Props) {
  const logoSrc = logoUrl?.trim() || "/logo.png";
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sources =
      heroVideos && heroVideos.length > 0 ? heroVideos : ["/video-1.mp4"];
    const fractions = sources.map(() => 0);
    const weights = sources.map(() => 1);
    let lastPaint = 0;

    const paint = (force = false) => {
      if (cancelled) return;
      const now = performance.now();
      if (!force && now - lastPaint < 80) return;
      lastPaint = now;

      const totalWeight = weights.reduce((sum, w) => sum + w, 0) || 1;
      const weighted =
        fractions.reduce((sum, f, i) => sum + f * weights[i], 0) / totalWeight;
      setProgress(Math.min(100, Math.round(weighted * 100)));
    };

    async function loadAll() {
      await Promise.all(
        sources.map((src, i) =>
          preloadWithByteProgress(src, (fraction, bytesTotal) => {
            fractions[i] = fraction;
            if (bytesTotal > 1) weights[i] = bytesTotal;
            paint(fraction >= 1);
          })
        )
      );

      if (cancelled) return;
      paint(true);
      setProgress(100);
      setReady(true);
      window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 700);
    }

    void loadAll();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when video URLs change
  }, [heroVideos.join("|")]);

  useEffect(() => {
    if (!ready) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [ready]);

  const strokeOffset =
    RING_CIRCUMFERENCE - (progress / 100) * RING_CIRCUMFERENCE;

  return (
    <>
      {children}

      {visible ? (
        <div
          className={cn(
            "fixed inset-0 z-[100] overflow-hidden transition-opacity duration-700 ease-out",
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          aria-busy={!ready}
          aria-live="polite"
        >
          {/* Atmosphere */}
          <div className="absolute inset-0 bg-[#140e0a]" />
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(92,58,32,0.55) 0%, transparent 68%), radial-gradient(ellipse 90% 70% at 50% 100%, rgba(26,18,12,0.95) 0%, transparent 55%)",
            }}
          />
          <div
            className={cn(
              "pointer-events-none absolute left-1/2 top-[38%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(197,162,125,0.18)_0%,transparent_68%)] transition-opacity duration-1000",
              entered ? "loader-glow opacity-100" : "opacity-0"
            )}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
            aria-hidden
          />

          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-center px-6">
            <div
              className={cn(
                "relative flex h-44 w-44 items-center justify-center transition-all duration-1000 ease-out md:h-48 md:w-48",
                entered
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-3 scale-95 opacity-0"
              )}
            >
              <svg
                className="absolute inset-0 h-full w-full -rotate-90"
                viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                aria-hidden
              >
                <circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={RING_STROKE}
                />
                <circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="#c5a27d"
                  strokeWidth={RING_STROKE}
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={strokeOffset}
                  style={{
                    transition: "stroke-dashoffset 180ms ease-out",
                  }}
                />
              </svg>

              <HoilamoLogo
                className="h-28 w-28 md:h-32 md:w-32"
                sizes="128px"
                src={logoSrc}
              />
            </div>

            <div
              className={cn(
                "mt-10 flex flex-col items-center transition-all delay-150 duration-1000 ease-out",
                entered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              )}
            >
              <p className="font-display text-lg tracking-wide text-[#f3e8dc] md:text-xl">
                هويلامو
              </p>
              <p className="mt-2 text-[11px] font-medium tracking-[0.35em] text-[#c5a27d]/80">
                جاري التحميل
              </p>
            </div>

            <div
              className={cn(
                "mt-8 transition-all delay-300 duration-1000 ease-out",
                entered ? "opacity-100" : "opacity-0"
              )}
            >
              <p className="tabular-nums text-xs tracking-[0.2em] text-white/35">
                {String(progress).padStart(2, "0")}
                <span className="text-white/20">%</span>
              </p>
            </div>
          </div>

        </div>
      ) : null}
    </>
  );
}
