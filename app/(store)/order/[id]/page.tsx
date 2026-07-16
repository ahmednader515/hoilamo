import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { ClearCartOnConfirm } from "@/components/store/clear-cart-on-confirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const statusLabels: Record<string, string> = {
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
        items: {
          include: { product: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export default async function OrderConfirmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-28">
      <ClearCartOnConfirm />
      <div className="mb-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-600" />
        <h1 className="text-3xl font-semibold text-amber-950">
          تم تأكيد الطلب
        </h1>
        <p className="mt-2 text-amber-900/60">
          نجهّز طلبك الآن. ادفع نقداً عند الاستلام.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-amber-900/60">رقم الطلب</p>
              <p className="text-xl font-semibold" dir="ltr">
                {order.orderNumber}
              </p>
            </div>
            <Badge variant="warning">
              {statusLabels[order.status] || order.status}
            </Badge>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-amber-900/60">الاسم</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-amber-900/60">الهاتف</p>
              <p className="font-medium" dir="ltr">
                {order.customerPhone}
              </p>
            </div>
            {order.pickupTime && (
              <div>
                <p className="text-amber-900/60">وقت الاستلام</p>
                <p className="font-medium">
                  {format(order.pickupTime, "PPp", { locale: ar })}
                </p>
              </div>
            )}
          </div>

          <ul className="space-y-2 border-t border-amber-900/10 pt-4 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span>
                  {item.quantity}× {item.product.name}
                </span>
                <span>{formatCurrency(Number(item.subtotal))}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between border-t border-amber-900/10 pt-3 text-lg font-semibold">
            <span>الإجمالي</span>
            <span>{formatCurrency(Number(order.total))}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button asChild>
          <Link href="/#shop">اطلب المزيد</Link>
        </Button>
      </div>
    </div>
  );
}
