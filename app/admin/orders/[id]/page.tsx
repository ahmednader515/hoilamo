import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "قيد الانتظار",
  READY: "جاهز",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغى",
};

async function getOrder(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
      },
    });
  } catch {
    return null;
  }
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button asChild variant="ghost" className="mb-2 px-0">
            <Link href="/admin/orders">← العودة إلى الطلبات</Link>
          </Button>
          <h1 className="text-2xl font-semibold text-amber-950">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-amber-900/60">
            تم الطلب {format(order.createdAt, "PPp", { locale: ar })}
          </p>
        </div>
        <Badge variant="secondary">{statusLabels[order.status]}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>العميل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-amber-900/60">الاسم:</span>{" "}
              {order.customerName}
            </p>
            <p>
              <span className="text-amber-900/60">الهاتف:</span>{" "}
              {order.customerPhone}
            </p>
            {order.customerEmail && (
              <p>
                <span className="text-amber-900/60">البريد الإلكتروني:</span>{" "}
                {order.customerEmail}
              </p>
            )}
            {order.pickupTime && (
              <p>
                <span className="text-amber-900/60">الاستلام:</span>{" "}
                {format(order.pickupTime, "PPp", { locale: ar })}
              </p>
            )}
            {order.notes && (
              <p>
                <span className="text-amber-900/60">ملاحظات:</span> {order.notes}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تحديث الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>العناصر</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between gap-3 border-b border-amber-900/5 pb-3 last:border-0"
              >
                <span>
                  {item.quantity}× {item.product.name}
                  <span className="block text-xs text-amber-900/50">
                    {formatCurrency(Number(item.unitPrice))} للواحد
                  </span>
                </span>
                <span className="font-medium">
                  {formatCurrency(Number(item.subtotal))}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-amber-900/10 pt-4 text-lg font-semibold">
            <span>الإجمالي</span>
            <span>{formatCurrency(Number(order.total))}</span>
          </div>
          <p className="mt-2 text-xs text-amber-900/50">
            طريقة الدفع: نقدًا عند الاستلام
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
