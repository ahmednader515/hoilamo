import { CheckoutForm } from "@/components/store/checkout-form";

export const metadata = {
  title: "إتمام الطلب",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-28">
      <h1 className="mb-2 text-3xl font-semibold text-amber-950">إتمام الطلب</h1>
      <p className="mb-8 text-amber-900/60">
        أدخل بيانات الاستلام. ستدفع نقداً عند استلام طلبك.
      </p>
      <CheckoutForm />
    </div>
  );
}
