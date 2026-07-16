"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { submitCheckout, type CheckoutState } from "@/lib/actions/orders";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const initialState: CheckoutState = {};

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const [state, formAction, pending] = useActionState(
    submitCheckout,
    initialState
  );

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-amber-900/20 bg-white px-6 py-16 text-center">
        <p className="mb-4 text-amber-900/70">
          أضف شيئاً من المتجر قبل إتمام الطلب.
        </p>
        <Button asChild>
          <Link href="/#shop">تصفّح المتجر</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        formData.set(
          "items",
          JSON.stringify(
            items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
            }))
          )
        );
        formAction(formData);
      }}
      className="grid gap-8 lg:grid-cols-[1fr_320px]"
    >
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">بيانات الاستلام</h2>
          {state.error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="customerName">الاسم الكامل *</Label>
            <Input id="customerName" name="customerName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">الهاتف *</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
            <Input id="customerEmail" name="customerEmail" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupTime">وقت الاستلام المفضّل</Label>
            <Input id="pickupTime" name="pickupTime" type="datetime-local" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات الطلب</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="ساخن جداً، حليب شوفان، إلخ."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">طلبك</h2>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="text-amber-900/70">
                  {item.quantity}× {item.name}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-amber-900/10 pt-3 font-semibold">
            <span>الإجمالي</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <p className="text-xs text-amber-900/50">
            الدفع: نقداً عند الاستلام من الكاونتر.
          </p>
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? "جاري إرسال الطلب…" : "تأكيد الطلب"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
