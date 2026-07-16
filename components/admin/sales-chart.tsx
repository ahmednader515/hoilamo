"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type OrderPoint = {
  createdAt: Date | string;
  total: number | string;
  status: string;
};

export function SalesChart({ orders }: { orders: OrderPoint[] }) {
  const byDay = new Map<string, number>();

  for (const order of orders) {
    if (order.status !== "COMPLETED") continue;
    const key = format(new Date(order.createdAt), "d MMM", { locale: ar });
    byDay.set(key, (byDay.get(key) || 0) + Number(order.total));
  }

  const data = Array.from(byDay.entries()).map(([day, revenue]) => ({
    day,
    revenue,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>الإيرادات حسب اليوم</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-amber-900/50">
            لا توجد مبيعات مكتملة في هذه الفترة.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8d9c8" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value ?? 0))}
              />
              <Bar dataKey="revenue" fill="#78350f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
