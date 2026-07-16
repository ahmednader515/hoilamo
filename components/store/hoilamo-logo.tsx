import Image from "next/image";
import { cn } from "@/lib/utils";

export function HoilamoLogo({
  className = "h-20 w-20",
  sizes = "80px",
  src,
}: {
  className?: string;
  sizes?: string;
  /** Logo URL from admin (SiteContent brand.logoUrl). Falls back to /logo.png */
  src?: string;
}) {
  const logoSrc = src?.trim() || "/logo.png";

  return (
    <span className={cn("relative inline-block shrink-0", className)}>
      <Image
        key={logoSrc}
        src={logoSrc}
        alt="Hoilamo"
        fill
        sizes={sizes}
        quality={100}
        unoptimized
        className="object-contain object-center"
        priority
      />
    </span>
  );
}
