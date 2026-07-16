import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/product-card";
import { ShopSearchForm } from "@/components/store/shop-search-form";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "المتجر",
};

async function getMenuData(categorySlug?: string, query?: string) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    const q = query?.trim();

    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { category: { name: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: { name: "asc" },
    });

    return { categories, products };
  } catch {
    return { categories: [], products: [] };
  }
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  // No filters → send people to the homepage shop section
  if (!category && !q) {
    redirect("/#shop");
  }

  const { categories, products } = await getMenuData(category, q);

  return (
    <div className="mx-auto max-w-7xl bg-white px-6 py-28 md:px-10 lg:px-14">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-xl font-bold tracking-wide text-[#111] md:text-2xl">
          {q ? `نتائج البحث عن «${q}»` : "المتجر"}
        </h1>
        <Link
          href="/#shop"
          className="text-sm text-amber-900/70 underline underline-offset-4 hover:text-amber-950"
        >
          العودة للمتجر
        </Link>
      </div>

      <ShopSearchForm initialQuery={q || ""} />

      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href={q ? `/menu?q=${encodeURIComponent(q)}` : "/#shop"}
          className={cn(
            "px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition",
            !category
              ? "bg-[#1a120c] text-amber-50"
              : "bg-amber-100 text-amber-950 hover:bg-amber-200"
          )}
        >
          الكل
        </Link>
        {categories.map((cat) => {
          const params = new URLSearchParams();
          params.set("category", cat.slug);
          if (q) params.set("q", q);
          return (
            <Link
              key={cat.id}
              href={`/menu?${params.toString()}`}
              className={cn(
                "px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition",
                category === cat.slug
                  ? "bg-[#1a120c] text-amber-50"
                  : "bg-amber-100 text-amber-950 hover:bg-amber-200"
              )}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {products.length === 0 ? (
        <div className="border border-dashed border-amber-900/20 px-6 py-12 text-center text-sm text-amber-900/60">
          {q
            ? `لا توجد منتجات تطابق «${q}». جرّب بحثاً آخر.`
            : "لا توجد منتجات."}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
