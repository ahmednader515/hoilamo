"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteProduct, toggleProductActive } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";

export function ProductActions({
  productId,
  active,
}: {
  productId: string;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/admin/products/${productId}/edit`}>تعديل</Link>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await toggleProductActive(productId);
          })
        }
      >
        {active ? "إلغاء التفعيل" : "تفعيل"}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => {
          if (!confirm("هل تريد حذف هذا المنتج؟")) return;
          startTransition(async () => {
            await deleteProduct(productId);
          });
        }}
      >
        حذف
      </Button>
    </div>
  );
}
