import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

async function getData(id: string) {
  try {
    const [product, categories] = await Promise.all([
      prisma.product.findUnique({ where: { id } }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    return { product, categories };
  } catch {
    return { product: null, categories: [] };
  }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product, categories } = await getData(id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-amber-950">تعديل المنتج</h1>
        <p className="text-sm text-amber-900/60">{product.name}</p>
      </div>
      <ProductForm
        categories={categories}
        product={{
          ...product,
          price: Number(product.price),
        }}
      />
    </div>
  );
}
