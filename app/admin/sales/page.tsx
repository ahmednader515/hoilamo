import Link from "next/link";
import { getSalesStats } from "@/lib/actions/orders";
import { formatCurrency, cn } from "@/lib/utils";
import { SalesChart } from "@/components/admin/sales-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ranges = [
  { key: "day", label: "اليوم" },
  { key: "week", label: "آخر 7 أيام" },
  { key: "month", label: "آخر 30 يومًا" },
] as const;

export default async function AdminSalesPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range =
    rangeParam === "day" || rangeParam === "month" ? rangeParam : "week";

  let stats = {
    revenue: 0,
    orderCount: 0,
    topProducts: [] as {
      productId: string;
      name: string;
      quantity: number;
      revenue: number;
    }[],
    dailyOrders: [] as {
      createdAt: Date;
      total: { toString(): string } | number;
      status: string;
    }[],
  };

  try {
    stats = await getSalesStats(range);
  } catch {
    // DB not connected yet
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-amber-950">المبيعات</h1>
          <p className="text-sm text-amber-900/60">
            الإيرادات وأداء المنتجات
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ranges.map((r) => (
            <Link
              key={r.key}
              href={`/admin/sales?range=${r.key}`}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                range === r.key
                  ? "bg-amber-900 text-amber-50"
                  : "bg-amber-100 text-amber-950 hover:bg-amber-200"
              )}
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-amber-900/60">إيرادات المكتمل</p>
            <p className="mt-1 text-3xl font-semibold">
              {formatCurrency(stats.revenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-amber-900/60">الطلبات المقدمة</p>
            <p className="mt-1 text-3xl font-semibold">{stats.orderCount}</p>
          </CardContent>
        </Card>
      </div>

      <SalesChart
        orders={stats.dailyOrders.map((o) => ({
          createdAt: o.createdAt,
          total: Number(o.total),
          status: o.status,
        }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>أفضل المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-amber-900/50">
              لا توجد مبيعات مكتملة في هذه الفترة.
            </p>
          ) : (
            <ul className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <li
                  key={product.productId}
                  className="flex items-center justify-between rounded-lg border border-amber-900/10 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-900">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-amber-900/50">
                        {product.quantity} مباع
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(product.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
