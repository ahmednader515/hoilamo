"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createProduct,
  updateProduct,
  type ProductFormState,
} from "@/lib/actions/products";
import { ProductImageField } from "@/components/admin/product-image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  stock: number;
  categoryId: string | null;
  imageUrl: string | null;
  hoverImageUrl: string | null;
  active: boolean;
};

type Props = {
  categories: Category[];
  product?: Product;
};

const initialState: ProductFormState = {};

export function ProductForm({ categories, product }: Props) {
  const action = product
    ? updateProduct.bind(null, product.id)
    : createProduct;

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="mx-auto max-w-xl space-y-4">
          {state.error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">الاسم *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={product?.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description || ""}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">السعر *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={
                  product ? Number(product.price).toFixed(2) : undefined
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">المخزون *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                defaultValue={product?.stock ?? 0}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">التصنيف</Label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={product?.categoryId || ""}
              className="flex h-10 w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-sm"
            >
              <option value="">بدون تصنيف</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 border-t border-amber-900/10 pt-4 sm:grid-cols-2">
            <ProductImageField
              name="imageUrl"
              label="الصورة الافتراضية"
              hint="تُعرض على بطاقة المنتج بشكل افتراضي"
              defaultValue={product?.imageUrl}
            />
            <ProductImageField
              name="hoverImageUrl"
              label="صورة التحويم"
              hint="تُعرض عند تمرير المؤشر فوق بطاقة المنتج"
              defaultValue={product?.hoverImageUrl}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              defaultChecked={product?.active ?? true}
              className="h-4 w-4 rounded border-amber-900/30"
            />
            نشط (ظاهر في القائمة)
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={pending}>
              {pending
                ? "جارٍ الحفظ…"
                : product
                  ? "تحديث المنتج"
                  : "إنشاء المنتج"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/products">إلغاء</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
