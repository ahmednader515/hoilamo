"use client";

import Image from "next/image";
import { useState } from "react";
import { isRemoteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  imageUrl: string | null;
  hoverImageUrl: string | null;
};

export function ProductGallery({ name, imageUrl, hoverImageUrl }: Props) {
  const images = [imageUrl, hoverImageUrl].filter(
    (src, index, arr): src is string =>
      Boolean(src) && arr.indexOf(src) === index
  );

  const fallback = "/products/placeholder.svg";
  const gallery = images.length > 0 ? images : [fallback];
  const [active, setActive] = useState(0);
  const current = gallery[active] || fallback;

  return (
    <div className="flex gap-3 sm:gap-4">
      {gallery.length > 1 && (
        <div className="flex shrink-0 flex-col gap-2">
          {gallery.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative h-16 w-16 overflow-hidden border bg-amber-100 sm:h-20 sm:w-20",
                active === index
                  ? "border-[#1a120c]"
                  : "border-transparent hover:border-amber-900/20"
              )}
              aria-label={`عرض الصورة ${index + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                quality={100}
                unoptimized={isRemoteImage(src)}
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-[4/5] min-h-[320px] w-full overflow-hidden bg-amber-100">
        <Image
          src={current}
          alt={name}
          fill
          quality={100}
          unoptimized={isRemoteImage(current)}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
