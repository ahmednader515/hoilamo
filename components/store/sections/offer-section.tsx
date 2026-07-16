"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { TornEdge } from "@/components/store/torn-edge";

export type OfferContent = {
  headline: string;
  title: string;
  subtitle: string;
  emailPlaceholder: string;
  button: string;
  success: string;
};

export function OfferSection({ content }: { content: OfferContent }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("done");
    setEmail("");
  }

  return (
    <section
      id="offer"
      className="relative overflow-x-hidden scroll-mt-28 md:scroll-mt-32"
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/background-offer.jpg"
          alt=""
          fill
          priority
          unoptimized
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-[#1a120c]/55" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]"
        aria-hidden
      />

      <TornEdge flip fill="#ffffff" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center md:px-10 md:py-28 lg:px-14">
        <h2 className="text-5xl font-bold tracking-tight text-[#c5a27d] drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl">
          {content.headline}
        </h2>
        <h3 className="mt-3 text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-3xl">
          {content.title}
        </h3>
        <p className="mt-2 text-base text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] sm:text-lg">
          {content.subtitle}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex w-full max-w-md overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
        >
          <label htmlFor="offer-email" className="sr-only">
            {content.emailPlaceholder}
          </label>
          <input
            id="offer-email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus("idle");
            }}
            placeholder={content.emailPlaceholder}
            className="min-w-0 flex-1 border-0 bg-white px-4 py-3 text-sm text-amber-950 outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="shrink-0 bg-[#c5a27d] px-6 py-3 text-sm font-semibold text-[#1a120c] transition hover:bg-[#d4b48f]"
          >
            {content.button}
          </button>
        </form>

        {status === "done" ? (
          <p className="mt-3 text-sm text-[#c5a27d]">{content.success}</p>
        ) : null}
      </div>

      <TornEdge fill="#faf6f1" />
    </section>
  );
}
