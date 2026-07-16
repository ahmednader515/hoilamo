import Image from "next/image";
import { cn } from "@/lib/utils";

export function HoilamoLogo({
  className = "h-20 w-20",
}: {
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block shrink-0", className)}>
      <Image
        src="/logo.png"
        alt="Hoilamo"
        fill
        sizes="80px"
        className="object-contain object-center"
        priority
      />
    </span>
  );
}
