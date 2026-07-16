import type { Metadata } from "next";
import localFont from "next/font/local";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const cairo = localFont({
  src: [
    {
      path: "../public/fonts/Cairo/static/Cairo-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Cairo/static/Cairo-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Cairo/static/Cairo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Cairo/static/Cairo-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Cairo/static/Cairo-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Cairo/static/Cairo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Cairo/static/Cairo-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Cairo/static/Cairo-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-cairo",
  display: "swap",
});

const zain = localFont({
  src: [
    {
      path: "../public/fonts/Zain/Zain-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Zain/Zain-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Zain/Zain-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Zain/Zain-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Zain/Zain-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Zain/Zain-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/Zain/Zain-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/Zain/Zain-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-zain",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "هويلامو",
    template: "%s | هويلامو",
  },
  description:
    "هويلامو — قهوة مختصة للاستلام. اطلب مسبقاً وادفع نقداً عند الاستلام.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${zain.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#faf6f1] font-sans text-amber-950">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
