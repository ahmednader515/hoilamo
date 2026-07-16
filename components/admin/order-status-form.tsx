"use client";

import { useTransition } from "react";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";

const statuses: OrderStatus[] = [
  "PENDING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "قيد الانتظار",
  READY: "جاهز",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغى",
};

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          size="sm"
          variant={status === currentStatus ? "default" : "outline"}
          disabled={pending || status === currentStatus}
          onClick={() =>
            startTransition(async () => {
              await updateOrderStatus(orderId, status);
            })
          }
        >
          {statusLabels[status]}
        </Button>
      ))}
    </div>
  );
}
