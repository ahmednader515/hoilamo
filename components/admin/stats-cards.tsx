import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Package, ShoppingBag, AlertTriangle } from "lucide-react";

type Props = {
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  lowStockCount: number;
};

export function StatsCards({
  todayRevenue,
  todayOrders,
  pendingOrders,
  lowStockCount,
}: Props) {
  const stats = [
    {
      label: "إيرادات اليوم",
      value: formatCurrency(todayRevenue),
      icon: DollarSign,
      hint: "الطلبات المكتملة",
    },
    {
      label: "طلبات اليوم",
      value: String(todayOrders),
      icon: ShoppingBag,
      hint: "جميع الحالات",
    },
    {
      label: "طلبات قيد الانتظار",
      value: String(pendingOrders),
      icon: Package,
      hint: "تحتاج متابعة",
    },
    {
      label: "منتجات منخفضة المخزون",
      value: String(lowStockCount),
      icon: AlertTriangle,
      hint: "المخزون أقل من 5",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-sm text-amber-900/60">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-amber-950">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-amber-900/45">{stat.hint}</p>
              </div>
              <span className="rounded-lg bg-amber-100 p-2 text-amber-900">
                <Icon className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
