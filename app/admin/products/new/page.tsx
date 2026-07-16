import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-amber-950">منتج جديد</h1>
        <p className="text-sm text-amber-900/60">أضف صنفًا إلى القائمة</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
