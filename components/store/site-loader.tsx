"use client";

import { useEffect, useState } from "react";
import { HoilamoLogo } from "@/components/store/hoilamo-logo";
import { HERO_VIDEOS } from "@/lib/hero-videos";
import { cn } from "@/lib/utils";

const LOAD_TIMEOUT_MS = 120_000;

function preloadVideoFully(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = src;

    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("canplaythrough", onCanPlayThrough);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("loadeddata", onProgress);
      video.removeEventListener("error", onError);
      video.removeAttribute("src");
      video.load();
      resolve();
    };

    const isFullyBuffered = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return false;
      if (video.buffered.length === 0) return false;
      const end = video.buffered.end(video.buffered.length - 1);
      return end >= video.duration - 0.35;
    };

    const onProgress = () => {
      if (isFullyBuffered()) finish();
    };

    const onCanPlayThrough = () => {
      // Some browsers fire this before the whole file is cached — still check buffer.
      if (isFullyBuffered()) finish();
    };

    const onError = () => finish();

    video.addEventListener("canplaythrough", onCanPlayThrough);
    video.addEventListener("progress", onProgress);
    video.addEventListener("loadeddata", onProgress);
    video.addEventListener("error", onError);
    video.load();

    // Don't block forever on flaky buffer reporting / huge files
    window.setTimeout(() => finish(), LOAD_TIMEOUT_MS);
  });
}

type Props = {
  children: React.ReactNode;
};

export function SiteLoader({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const total = HERO_VIDEOS.length;
    let completed = 0;

    async function loadAll() {
      await Promise.all(
        HERO_VIDEOS.map(async (src) => {
          await preloadVideoFully(src);
          if (cancelled) return;
          completed += 1;
          setProgress(Math.round((completed / total) * 100));
        })
      );

      if (cancelled) return;
      setProgress(100);
      setReady(true);
      // Allow one paint of the page under the loader, then fade out
      window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 420);
    }

    void loadAll();

    return () => {
      cancelled = true;
    };
  }, []);

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

  return (
    <>
      {children}

      {visible ? (
        <div
          className={cn(
            "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a120c] transition-opacity duration-500",
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          aria-busy={!ready}
          aria-live="polite"
        >
          <HoilamoLogo className="h-28 w-28 animate-pulse md:h-32 md:w-32" />
          <p className="mt-8 text-sm font-medium text-white/80">جاري التحميل</p>
          <div className="mt-10 h-1 w-48 overflow-hidden rounded-full bg-white/15 md:w-64">
            <div
              className="h-full rounded-full bg-[#c5a27d] transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-white/45">{progress}%</p>
        </div>
      ) : null}
    </>
  );
}
