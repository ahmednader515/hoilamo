"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setOpen(false);
    if (q) {
      router.push(`/menu?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/menu");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="البحث عن المنتجات"
        className="rounded-full p-2 text-white transition hover:bg-white/10"
      >
        <Search className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="fixed inset-x-0 top-20 z-50 border-t border-white/10 bg-[#1a120c]/98 px-6 py-4 backdrop-blur-md md:top-24 md:px-10 lg:px-14">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-7xl items-center gap-3"
          >
            <Search
              className="h-5 w-5 shrink-0 text-white/50"
              strokeWidth={1.5}
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن قهوة، مشروبات، معجنات…"
              className="w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/45"
            />
            <button
              type="submit"
              className="shrink-0 bg-amber-100 px-4 py-2 text-xs font-bold tracking-wide text-[#1a120c] transition hover:bg-white"
            >
              بحث
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="إغلاق البحث"
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
