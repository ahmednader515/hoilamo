import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { ProductActions } from "@/components/admin/product-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getProducts() {
  try {
    return await prisma.product.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-amber-950">المنتجات</h1>
          <p className="text-sm text-amber-900/60">
            إدارة أصناف القائمة والأسعار والمخزون
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">إضافة منتج</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{products.length} منتجات</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {products.length === 0 ? (
            <p className="text-sm text-amber-900/50">
              لا توجد منتجات بعد. أضف منتجًا أو شغّل سكربت البذر.
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-amber-900/10 text-amber-900/60">
                  <th className="pb-3 font-medium">الاسم</th>
                  <th className="pb-3 font-medium">التصنيف</th>
                  <th className="pb-3 font-medium">السعر</th>
                  <th className="pb-3 font-medium">المخزون</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-amber-900/5 last:border-0"
                  >
                    <td className="py-3 font-medium">{product.name}</td>
                    <td className="py-3 text-amber-900/70">
                      {product.category?.name || "—"}
                    </td>
                    <td className="py-3">
                      {formatCurrency(Number(product.price))}
                    </td>
                    <td className="py-3">
                      <span
                        className={
                          product.stock < 5 ? "font-medium text-red-600" : ""
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3">
                      <Badge variant={product.active ? "success" : "secondary"}>
                        {product.active ? "نشط" : "مخفي"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <ProductActions
                        productId={product.id}
                        active={product.active}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
