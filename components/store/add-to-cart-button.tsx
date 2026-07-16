"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string | null;
  };
};

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Button onClick={handleAdd} size="lg" className="w-full sm:w-auto">
      {added ? (
        <>
          <Check className="h-4 w-4" /> تمت الإضافة
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" /> أضف إلى السلة
        </>
      )}
    </Button>
  );
}
