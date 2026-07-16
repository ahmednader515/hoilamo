"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, cn } from "@/lib/utils";
import { isRemoteImage } from "@/lib/images";
import { ProductGallery } from "@/components/store/product-gallery";

const SIZES = [
  { value: "12-oz", label: "١٢ أونصة" },
  { value: "5-lbs", label: "٥ أرطال" },
] as const;

const GRINDS = [
  { value: "Whole Bean", label: "حبوب كاملة" },
  { value: "French Press", label: "فرنش برس" },
  { value: "Drip", label: "تنقيط" },
  { value: "Espresso", label: "إسبريسو" },
  { value: "Aeropress", label: "أيروبرس" },
  { value: "Pour Over", label: "صبّ يدوي" },
  { value: "Chemex", label: "كيمكس" },
  { value: "Percolator / Cold Brew", label: "بيركوليتر / كولد برو" },
] as const;

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  hoverImageUrl: string | null;
  description: string | null;
  stock: number;
};

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-2.5 text-start text-xs font-medium tracking-wide transition",
        selected
          ? "bg-[#1a120c] text-amber-50"
          : "bg-amber-100 text-amber-950 hover:bg-amber-200"
      )}
    >
      {children}
    </button>
  );
}

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<(typeof SIZES)[number]["value"]>("12-oz");
  const [grind, setGrind] =
    useState<(typeof GRINDS)[number]["value"]>("Whole Bean");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  const sizeLabel = SIZES.find((s) => s.value === size)?.label ?? size;
  const grindLabel = GRINDS.find((g) => g.value === grind)?.label ?? grind;

  function handleAdd() {
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageUrl: product.imageUrl,
        size,
        grind,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-36 md:px-8 md:pt-40 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery
            name={product.name}
            imageUrl={product.imageUrl}
            hoverImageUrl={product.hoverImageUrl}
          />

          <div className="space-y-6 text-amber-950">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {product.name}
              </h1>
              <p className="mt-3 text-xl font-medium text-amber-900">
                {formatCurrency(product.price)}
              </p>
              <p className="mt-1 text-sm text-amber-900/55">
                ادفع نقداً عند الاستلام — لا حاجة لدفع إلكتروني.
              </p>
            </div>

            {product.description && (
              <p className="text-sm leading-relaxed text-amber-900/70 md:text-base">
                {product.description}
              </p>
            )}

            <div className="border border-amber-900/25 p-4 sm:p-5">
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-amber-950">
                    الحجم: <span className="font-normal">{sizeLabel}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {SIZES.map((option) => (
                      <OptionButton
                        key={option.value}
                        selected={size === option.value}
                        onClick={() => setSize(option.value)}
                      >
                        {option.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-amber-950">
                    الطحن: <span className="font-normal">{grindLabel}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {GRINDS.map((option) => (
                      <OptionButton
                        key={option.value}
                        selected={grind === option.value}
                        onClick={() => setGrind(option.value)}
                      >
                        {option.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-amber-950">الكمية</p>
              <div className="flex w-full max-w-xs items-center border border-amber-900/25 bg-amber-50">
                <button
                  type="button"
                  className="px-4 py-3 text-amber-950 hover:bg-amber-100"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="تقليل الكمية"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex-1 text-center text-sm font-medium text-amber-950">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="px-4 py-3 text-amber-950 hover:bg-amber-100"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="زيادة الكمية"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={outOfStock}
              onClick={handleAdd}
              className="w-full bg-[#1a120c] py-3.5 text-sm font-medium tracking-wide text-amber-50 transition hover:bg-[#2c1810] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {outOfStock
                ? "غير متوفر"
                : added
                  ? "تمت الإضافة إلى السلة"
                  : "أضف إلى السلة"}
            </button>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 z-40 hidden w-full max-w-xl border border-amber-900/15 bg-white shadow-[0_-8px_30px_rgba(26,18,12,0.15)] md:block lg:bottom-6 lg:left-6 lg:w-auto">
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-amber-100">
            <Image
              src={product.imageUrl || "/products/placeholder.svg"}
              alt=""
              fill
              quality={100}
              unoptimized={isRemoteImage(
                product.imageUrl || "/products/placeholder.svg"
              )}
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold tracking-wide text-amber-950">
              {product.name}
            </p>
            <p className="truncate text-xs text-amber-900/60">
              الحجم: {sizeLabel} | الطحن: {grindLabel}
            </p>
          </div>
          <p className="shrink-0 text-sm font-bold text-amber-950">
            {formatCurrency(product.price)}
          </p>
          <button
            type="button"
            disabled={outOfStock}
            onClick={handleAdd}
            className="shrink-0 bg-[#1a120c] px-5 py-2.5 text-xs font-medium tracking-wide text-amber-50 transition hover:bg-[#2c1810] disabled:opacity-40"
          >
            {added ? "تمت الإضافة" : "أضف إلى السلة"}
          </button>
        </div>
      </div>
    </>
  );
}
