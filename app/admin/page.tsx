import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { StatsCards } from "@/components/admin/stats-cards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "قيد الانتظار",
  READY: "جاهز",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغى",
};

function statusVariant(status: OrderStatus) {
  switch (status) {
    case "COMPLETED":
      return "success" as const;
    case "READY":
      return "warning" as const;
    case "CANCELLED":
      return "danger" as const;
    default:
      return "secondary" as const;
  }
}

async function getDashboardData() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  try {
    const [
      todayRevenue,
      todayOrders,
      pendingOrders,
      lowStockCount,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          status: OrderStatus.COMPLETED,
          createdAt: { gte: startOfDay },
        },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { createdAt: { gte: startOfDay } },
      }),
      prisma.order.count({
        where: { status: OrderStatus.PENDING },
      }),
      prisma.product.count({
        where: { stock: { lt: 5 }, active: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.product.findMany({
        where: { stock: { lt: 5 }, active: true },
        take: 5,
        orderBy: { stock: "asc" },
      }),
    ]);

    return {
      todayRevenue: Number(todayRevenue._sum.total || 0),
      todayOrders,
      pendingOrders,
      lowStockCount,
      recentOrders,
      lowStockProducts,
    };
  } catch {
    return {
      todayRevenue: 0,
      todayOrders: 0,
      pendingOrders: 0,
      lowStockCount: 0,
      recentOrders: [],
      lowStockProducts: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-amber-950">لوحة التحكم</h1>
        <p className="text-sm text-amber-900/60">
          نظرة عامة على مبيعات اليوم والمخزون
        </p>
      </div>

      <StatsCards
        todayRevenue={data.todayRevenue}
        todayOrders={data.todayOrders}
        pendingOrders={data.pendingOrders}
        lowStockCount={data.lowStockCount}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>أحدث الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-amber-900/50">لا توجد طلبات بعد.</p>
            ) : (
              <ul className="space-y-3">
                {data.recentOrders.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-amber-900/10 px-3 py-2 transition hover:bg-amber-50"
                    >
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-amber-900/50">
                          {order.customerName} ·{" "}
                          {format(order.createdAt, "d MMM، h:mm a", {
                            locale: ar,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={statusVariant(order.status)}>
                          {statusLabels[order.status]}
                        </Badge>
                        <p className="mt-1 text-sm font-medium">
                          {formatCurrency(Number(order.total))}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تنبيهات انخفاض المخزون</CardTitle>
          </CardHeader>
          <CardContent>
            {data.lowStockProducts.length === 0 ? (
              <p className="text-sm text-amber-900/50">
                جميع المنتجات النشطة لديها مخزون كافٍ.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.lowStockProducts.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-amber-900/10 px-3 py-2"
                  >
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="danger">متبقي {product.stock}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
