import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/store/product-detail-client";
import { ProductCard } from "@/components/store/product-card";

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug, active: true },
      include: { category: true },
    });
  } catch {
    return null;
  }
}

async function getRelated(productId: string, categoryId: string | null) {
  try {
    const sameCategory = await prisma.product.findMany({
      where: {
        active: true,
        id: { not: productId },
        ...(categoryId ? { categoryId } : {}),
      },
      include: { category: true },
      take: 4,
      orderBy: { name: "asc" },
    });

    if (sameCategory.length >= 4) {
      return sameCategory.slice(0, 4);
    }

    const excludeIds = [productId, ...sameCategory.map((p) => p.id)];
    const fillers = await prisma.product.findMany({
      where: {
        active: true,
        id: { notIn: excludeIds },
      },
      include: { category: true },
      take: 4 - sameCategory.length,
      orderBy: { name: "asc" },
    });

    return [...sameCategory, ...fillers].slice(0, 4);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return {
    title: product?.name || "منتج",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product.id, product.categoryId);

  return (
    <div className="bg-white text-amber-950">
      <ProductDetailClient
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          imageUrl: product.imageUrl,
          hoverImageUrl: product.hoverImageUrl,
          description: product.description,
          stock: product.stock,
        }}
      />

      <section className="border-t border-amber-900/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
          <h2 className="text-3xl font-bold tracking-wide text-amber-950 md:text-4xl">
            القصة
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-7 text-amber-900/75 md:text-base md:leading-8">
            {product.description ? (
              <p>{product.description}</p>
            ) : (
              <p>
                محضّرة بعناية في هويلامو — محمّصة ومجهّزة لكوب يبدو مقصوداً من
                أول رشفة.
              </p>
            )}
            <p>
              {product.name} جزء من تشكيلة{" "}
              {product.category?.name || "القهوة"} لدينا. اطلب مسبقاً للاستلام
              واستمتع بها طازجة — وادفع نقداً عند الكاونتر حين تصل.
            </p>
            <p>
              كل دفعة مختارة للوضوح والتوازن، ولطقوس يومية تجعل القهوة تستحق أن
              تبطئ من أجلها.
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-amber-900/10 bg-white pb-24">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:px-12">
            <h2 className="mb-10 text-center text-xl font-bold tracking-wide text-amber-950 md:text-2xl">
              قد يعجبك أيضاً
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={{
                    ...item,
                    price: Number(item.price),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
