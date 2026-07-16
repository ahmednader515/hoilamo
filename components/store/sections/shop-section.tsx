import { ProductCard } from "@/components/store/product-card";
import { t, type SiteContentMap } from "@/lib/get-site-content";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  imageUrl: string | null;
  hoverImageUrl?: string | null;
  category?: { name: string } | null;
};

export function ShopSection({
  products,
  content,
}: {
  products: Product[];
  content: SiteContentMap;
}) {
  return (
    <section
      id="shop"
      className="relative scroll-mt-28 bg-white md:scroll-mt-32"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24 lg:px-14">
        <div className="mb-10">
          <h2 className="text-xl font-bold tracking-wide text-[#111] md:text-2xl">
            {t(content, "shop.title")}
          </h2>
          <p className="mt-2 text-sm text-amber-900/60">
            {t(content, "shop.subtitle")}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="border border-dashed border-neutral-300 px-6 py-12 text-center text-sm text-neutral-500">
            ستظهر المنتجات هنا بعد ربط قاعدة البيانات وإضافة البيانات الأولية.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
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
    </section>
  );
}
