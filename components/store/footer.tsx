import Link from "next/link";
import { HoilamoLogo } from "@/components/store/hoilamo-logo";
import { t, type SiteContentMap } from "@/lib/get-site-content";

export function StoreFooter({
  content,
  logoUrl,
}: {
  content: SiteContentMap;
  logoUrl?: string;
}) {
  return (
    <footer className="mt-auto bg-[#1a120c] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 md:px-10 lg:px-14">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <HoilamoLogo className="h-16 w-16" src={logoUrl} />
            <div>
              <p className="text-sm font-semibold tracking-wide">
                {t(content, "footer.brand")}
              </p>
              <p className="text-xs text-white/55">
                {t(content, "footer.tagline")}
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            {t(content, "footer.blurb")}
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide">استكشف</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <Link href="/#story" className="hover:text-white">
                قصتنا
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-white">
                خدماتنا
              </Link>
            </li>
            <li>
              <Link href="/#shop" className="hover:text-white">
                المتجر
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-white">
                تواصل معنا
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide">
            {t(content, "footer.hoursTitle")}
          </h3>
          <ul className="space-y-1 text-sm text-white/60">
            <li>{t(content, "footer.hours1")}</li>
            <li>{t(content, "footer.hours2")}</li>
            <li>{t(content, "footer.hours3")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {t(content, "footer.copyright")}
      </div>
    </footer>
  );
}
