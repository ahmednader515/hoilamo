"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Coffee,
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  LogOut,
  FileText,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAdmin } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/sales", label: "المبيعات", icon: BarChart3 },
  { href: "/admin/content", label: "محتوى الصفحة", icon: FileText },
  { href: "/admin/account", label: "حساب المسؤول", icon: UserCog },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-svh w-64 shrink-0 flex-col border-e border-amber-900/10 bg-[#2c1810] text-amber-50">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <Coffee className="h-5 w-5" />
        <div>
          <p className="font-semibold">إدارة هويلامو</p>
          <p className="text-xs text-amber-100/60">لوحة المتجر</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-amber-100/15 text-white"
                  : "text-amber-100/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <form action={logoutAdmin}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-amber-100/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </form>
        <Link
          href="/"
          className="mt-1 block px-3 py-2 text-xs text-amber-100/50 hover:text-amber-100"
        >
          ← العودة إلى المتجر
        </Link>
      </div>
    </aside>
  );
}
