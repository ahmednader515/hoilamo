import { CartView } from "@/components/store/cart-view";

export const metadata = {
  title: "السلة",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-28">
      <h1 className="mb-8 text-3xl font-semibold text-amber-950">سلتك</h1>
      <CartView />
    </div>
  );
}
