"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  videos: string[];
};

export function HeroVideoBackground({ videos }: Props) {
  const sources =
    videos && videos.length > 0 ? videos : ["/video-1.mp4"];
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const playIndex = useCallback((index: number) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.currentTime = 0;
        void video.play().catch(() => {
          // Autoplay may be blocked until user interaction; muted should allow it
        });
      } else {
        video.pause();
      }
    });
  }, []);

  useEffect(() => {
    playIndex(active);
  }, [active, playIndex]);

  function handleEnded(index: number) {
    setActive((index + 1) % sources.length);
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1a120c]">
      {sources.map((src, index) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: active === index ? 1 : 0 }}
          src={src}
          muted
          playsInline
          preload="auto"
          onEnded={() => handleEnded(index)}
          aria-hidden
        />
      ))}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
    </div>
  );
}
