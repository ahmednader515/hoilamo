"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { z } from "zod";
import { OrderStatus, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "الاسم مطلوب"),
  customerPhone: z.string().min(7, "رقم الهاتف مطلوب"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  pickupTime: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "السلة فارغة"),
});

export type CheckoutState = {
  error?: string;
};

async function generateOrderNumber() {
  const datePart = format(new Date(), "yyyyMMdd");
  const prefix = `HLM-${datePart}-`;
  const latest = await prisma.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
  });

  let sequence = 1;
  if (latest) {
    const lastSeq = parseInt(latest.orderNumber.split("-").pop() || "0", 10);
    sequence = lastSeq + 1;
  }

  return `${prefix}${String(sequence).padStart(4, "0")}`;
}

export async function submitCheckout(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  let items: { productId: string; quantity: number }[] = [];
  try {
    items = JSON.parse(formData.get("items") as string);
  } catch {
    return { error: "بيانات السلة غير صالحة" };
  }

  const parsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail") || "",
    pickupTime: formData.get("pickupTime") || undefined,
    notes: formData.get("notes") || undefined,
    items,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== productIds.length) {
    return { error: "أحد المنتجات أو أكثر غير متوفر" };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  let total = new Prisma.Decimal(0);
  const orderItems: {
    productId: string;
    quantity: number;
    unitPrice: Prisma.Decimal;
    subtotal: Prisma.Decimal;
  }[] = [];

  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return { error: "المنتج غير موجود" };
    }
    if (product.stock < item.quantity) {
      return { error: `المخزون غير كافٍ لـ ${product.name}` };
    }
    const unitPrice = product.price;
    const subtotal = unitPrice.mul(item.quantity);
    total = total.add(subtotal);
    orderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      subtotal,
    });
  }

  const orderNumber = await generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return tx.order.create({
      data: {
        orderNumber,
        customerName: parsed.data.customerName,
        customerPhone: parsed.data.customerPhone,
        customerEmail: parsed.data.customerEmail || null,
        pickupTime: parsed.data.pickupTime
          ? new Date(parsed.data.pickupTime)
          : null,
        notes: parsed.data.notes || null,
        total,
        items: {
          create: orderItems,
        },
      },
    });
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/sales");
  redirect(`/order/${order.id}`);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/sales");
}

export async function getSalesStats(range: "day" | "week" | "month" = "week") {
  const now = new Date();
  const start = new Date(now);

  if (range === "day") {
    start.setHours(0, 0, 0, 0);
  } else if (range === "week") {
    start.setDate(now.getDate() - 7);
  } else {
    start.setMonth(now.getMonth() - 1);
  }

  const completedWhere = {
    status: OrderStatus.COMPLETED,
    createdAt: { gte: start },
  };

  const [revenueAgg, orderCount, topProducts, dailyOrders] = await Promise.all([
    prisma.order.aggregate({
      where: completedWhere,
      _sum: { total: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: start } } }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: completedWhere,
      },
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true, total: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const productIds = topProducts.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  return {
    revenue: Number(revenueAgg._sum.total || 0),
    orderCount,
    topProducts: topProducts.map((p) => ({
      productId: p.productId,
      name: productMap.get(p.productId)?.name || "غير معروف",
      quantity: p._sum.quantity || 0,
      revenue: Number(p._sum.subtotal || 0),
    })),
    dailyOrders,
  };
}
