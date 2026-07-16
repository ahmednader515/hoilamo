import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { isRemoteImage } from "@/lib/images";

type ProductCardProps = {
  product: {
    name: string;
    slug: string;
    description: string | null;
    price: number | string;
    imageUrl: string | null;
    hoverImageUrl?: string | null;
    category?: { name: string } | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const defaultSrc = product.imageUrl || "/products/placeholder.svg";
  const hoverSrc = product.hoverImageUrl;
  const hasHover = Boolean(hoverSrc && hoverSrc !== defaultSrc);

  return (
    <Link href={`/menu/${product.slug}`} className="group block">
      <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-[#f0f0f0]">
        <Image
          src={defaultSrc}
          alt={product.name}
          fill
          quality={100}
          unoptimized={isRemoteImage(defaultSrc)}
          className={`object-cover transition duration-500 ${
            hasHover
              ? "opacity-100 group-hover:opacity-0"
              : "group-hover:scale-[1.03]"
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
        />
        {hasHover && (
          <Image
            src={hoverSrc!}
            alt=""
            fill
            quality={100}
            unoptimized={isRemoteImage(hoverSrc!)}
            className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
      </div>

      <div className="space-y-1.5 text-[#111]">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-bold leading-snug tracking-wide">
            {product.name}
          </h3>
          <span className="shrink-0 text-sm font-bold tracking-wide">
            {formatCurrency(Number(product.price))}
          </span>
        </div>

        {product.description && (
          <p className="line-clamp-2 text-[13px] font-medium leading-relaxed text-[#111]/80">
            {product.description}
          </p>
        )}

        {product.category && (
          <p className="pt-1 text-[13px] font-medium tracking-wide text-[#111]/75">
            {product.category.name}
          </p>
        )}
      </div>
    </Link>
  );
}
