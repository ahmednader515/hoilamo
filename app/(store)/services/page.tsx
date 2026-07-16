"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ServicesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/#services");
  }, [router]);
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-amber-900/60">
      جاري التحميل…
    </div>
  );
}
