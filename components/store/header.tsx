"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { HoilamoLogo } from "@/components/store/hoilamo-logo";
import { HeaderSearch } from "@/components/store/header-search";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#home", id: "home", label: "الرئيسية" },
  { href: "/#story", id: "story", label: "قصتنا" },
  { href: "/#services", id: "services", label: "خدماتنا" },
  { href: "/#shop", id: "shop", label: "المتجر" },
  { href: "/#contact", id: "contact", label: "تواصل معنا" },
];

type StoreHeaderProps = {
  userName?: string | null;
  isAdmin?: boolean;
};

export function StoreHeader({ userName, isAdmin = false }: StoreHeaderProps) {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const isHome = pathname === "/";
  const accountHref = isAdmin ? "/admin" : "/account";
  const accountLabel = isAdmin ? "لوحة الإدارة" : "حسابي";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) return;

    const sectionIds = links.map((l) => l.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [isHome]);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) {
    if (pathname !== "/") return;
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `/#${id}`);
    }
    setOpen(false);
  }

  const overlay = isHome && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        overlay
          ? "bg-transparent text-white"
          : "border-b border-white/10 bg-[#1a120c]/95 text-white backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 md:h-24 md:px-10 lg:px-14">
        <Link
          href="/#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="shrink-0 text-white"
          aria-label="هويلامو - الرئيسية"
        >
          <HoilamoLogo className="h-16 w-16 md:h-20 md:w-20" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => {
            const active = isHome && activeSection === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className={cn(
                  "text-sm font-medium tracking-wide transition",
                  active ? "text-white" : "text-white/80 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <HeaderSearch />

          <Link
            href="/cart"
            aria-label="السلة"
            className="relative rounded-full p-2 text-white transition hover:bg-white/10"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -left-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#1a120c]">
                {itemCount}
              </span>
            )}
          </Link>

          {userName ? (
            <Link
              href={accountHref}
              className="hidden items-center gap-2 rounded-full px-2 py-1.5 text-[13px] font-medium text-white transition hover:bg-white/10 sm:flex"
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
              <span className="max-w-[8rem] truncate">{userName}</span>
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="hidden items-center gap-2 rounded-full px-2 py-1.5 text-[13px] font-medium text-white transition hover:bg-white/10 sm:flex"
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
              تسجيل الدخول
            </Link>
          )}

          <button
            type="button"
            className="rounded-full p-2 text-white transition hover:bg-white/10 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-[#1a120c] px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={userName ? accountHref : "/sign-in"}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 sm:hidden"
            >
              {userName ? accountLabel : "تسجيل الدخول"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
