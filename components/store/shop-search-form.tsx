"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Props = {
  initialQuery?: string;
};

export function ShopSearchForm({ initialQuery = "" }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const qs = params.toString();
    router.push(qs ? `/menu?${qs}` : "/menu");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex w-full max-w-md gap-2">
      <div className="flex flex-1 items-center gap-2 border border-amber-900/20 bg-white px-3">
        <Search className="h-4 w-4 shrink-0 text-amber-900/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن المنتجات…"
          className="w-full bg-transparent py-2.5 text-sm text-amber-950 outline-none placeholder:text-amber-900/40"
        />
      </div>
      <button
        type="submit"
        className="bg-[#1a120c] px-5 text-xs font-bold tracking-wide text-amber-50 transition hover:bg-[#2c1810]"
      >
        بحث
      </button>
    </form>
  );
}
