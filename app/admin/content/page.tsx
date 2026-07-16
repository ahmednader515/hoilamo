import { getSiteContent } from "@/lib/get-site-content";
import { HomepageContentForm } from "@/components/admin/homepage-content-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "محتوى الصفحة الرئيسية",
};

export default async function AdminContentPage() {
  const content = await getSiteContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-amber-950">
          محتوى الصفحة الرئيسية
        </h1>
        <p className="mt-1 text-sm text-amber-900/60">
          عدّل الشعار والفيديوهات ونصوص الصفحة الرئيسية — التغييرات تظهر فوراً
          في المتجر بعد الحفظ.
        </p>
      </div>

      <HomepageContentForm initialContent={content} />
    </div>
  );
}
