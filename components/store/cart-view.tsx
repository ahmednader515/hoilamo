"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { isRemoteImage } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CartView() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-amber-900/20 bg-white px-6 py-16 text-center">
        <p className="mb-4 text-amber-900/70">سلتك فارغة.</p>
        <Button asChild>
          <Link href="/#shop">تصفّح المتجر</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.lineId}>
            <CardContent className="flex gap-4 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-amber-100">
                <Image
                  src={item.imageUrl || "/products/placeholder.svg"}
                  alt={item.name}
                  fill
                  quality={100}
                  unoptimized={isRemoteImage(
                    item.imageUrl || "/products/placeholder.svg"
                  )}
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    href={`/menu/${item.slug}`}
                    className="font-medium text-amber-950 hover:underline"
                  >
                    {item.name}
                  </Link>
                  {(item.size || item.grind) && (
                    <p className="text-xs text-amber-900/55">
                      {[item.size, item.grind].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-sm text-amber-900/60">
                    {formatCurrency(item.price)} للوحدة
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-amber-900/15">
                    <button
                      type="button"
                      className="p-2 hover:bg-amber-50"
                      onClick={() =>
                        updateQuantity(item.lineId, item.quantity - 1)
                      }
                      aria-label="تقليل الكمية"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="p-2 hover:bg-amber-50"
                      onClick={() =>
                        updateQuantity(item.lineId, item.quantity + 1)
                      }
                      aria-label="زيادة الكمية"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="w-20 text-start font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.lineId)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label="حذف المنتج"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-fit">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">ملخص الطلب</h2>
          <div className="flex justify-between text-sm">
            <span className="text-amber-900/70">المجموع الفرعي</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <p className="text-xs text-amber-900/50">
            ادفع نقداً عند استلام طلبك من الكاونتر.
          </p>
          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">متابعة لإتمام الطلب</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
