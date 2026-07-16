"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { allContentKeys } from "@/lib/site-content";

export type ContentFormState = {
  error?: string;
  success?: string;
};

export async function updateSiteContent(
  _prev: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "غير مصرح" };
  }

  const keys = allContentKeys();

  try {
    // Upsert one-by-one — Neon/pgbouncer can fail interactive $transaction batches
    for (const key of keys) {
      const raw = formData.get(key);
      const value = typeof raw === "string" ? raw : "";
      await prisma.siteContent.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/content");

    return { success: "تم حفظ محتوى الصفحة الرئيسية بنجاح." };
  } catch (error) {
    console.error("updateSiteContent failed:", error);
    const message =
      error instanceof Error ? error.message : "تعذّر حفظ المحتوى. حاول مرة أخرى.";
    return { error: message };
  }
}
