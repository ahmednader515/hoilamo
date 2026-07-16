import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "قيد الانتظار",
  READY: "جاهز",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغى",
};

const filterLabels: Record<string, string> = {
  ALL: "الكل",
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

async function getOrders(status?: string) {
  try {
    return await prisma.order.findMany({
      where:
        status && Object.values(OrderStatus).includes(status as OrderStatus)
          ? { status: status as OrderStatus }
          : undefined,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

const filters = ["ALL", ...Object.values(OrderStatus)];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const orders = await getOrders(status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-amber-950">الطلبات</h1>
        <p className="text-sm text-amber-900/60">
          متابعة طلبات الاستلام وتحديث حالتها
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const href =
            filter === "ALL" ? "/admin/orders" : `/admin/orders?status=${filter}`;
          const active =
            filter === "ALL" ? !status : status === filter;
          return (
            <Link
              key={filter}
              href={href}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                active
                  ? "bg-amber-900 text-amber-50"
                  : "bg-amber-100 text-amber-950 hover:bg-amber-200"
              )}
            >
              {filterLabels[filter] ?? filter}
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{orders.length} طلبات</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {orders.length === 0 ? (
            <p className="text-sm text-amber-900/50">لم يتم العثور على طلبات.</p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-amber-900/10 text-amber-900/60">
                  <th className="pb-3 font-medium">الطلب</th>
                  <th className="pb-3 font-medium">العميل</th>
                  <th className="pb-3 font-medium">العناصر</th>
                  <th className="pb-3 font-medium">الإجمالي</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium">تاريخ الطلب</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-amber-900/5 last:border-0"
                  >
                    <td className="py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-amber-950 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-amber-900/50">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-3">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </td>
                    <td className="py-3">
                      {formatCurrency(Number(order.total))}
                    </td>
                    <td className="py-3">
                      <Badge variant={statusVariant(order.status)}>
                        {statusLabels[order.status]}
                      </Badge>
                    </td>
                    <td className="py-3 text-amber-900/70">
                      {format(order.createdAt, "d MMM، h:mm a", { locale: ar })}
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
