"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AccountFormState = {
  error?: string;
  success?: string;
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

const emailSchema = z.object({
  email: z.string().email("أدخل بريداً إلكترونياً صالحاً"),
  currentPassword: z.string().min(1, "أدخل كلمة المرور الحالية"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "أدخل كلمة المرور الحالية"),
    newPassword: z
      .string()
      .min(6, "يجب أن تكون كلمة المرور الجديدة ٦ أحرف على الأقل"),
    confirmPassword: z.string().min(1, "أكد كلمة المرور الجديدة"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export async function updateAdminEmail(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const session = await requireAdmin();
  if (!session) return { error: "غير مصرح" };

  const parsed = emailSchema.safeParse({
    email: formData.get("email"),
    currentPassword: formData.get("currentPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") {
    return { error: "غير مصرح" };
  }

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.password
  );
  if (!valid) {
    return { error: "كلمة المرور الحالية غير صحيحة" };
  }

  const nextEmail = parsed.data.email.trim().toLowerCase();
  if (nextEmail === user.email.toLowerCase()) {
    return { error: "هذا هو بريدك الحالي بالفعل" };
  }

  const taken = await prisma.user.findUnique({
    where: { email: nextEmail },
  });
  if (taken) {
    return { error: "هذا البريد الإلكتروني مستخدم بالفعل" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { email: nextEmail },
  });

  revalidatePath("/admin/account");

  return {
    success:
      "تم تحديث البريد الإلكتروني. استخدم البريد الجديد عند تسجيل الدخول التالي.",
  };
}

export async function updateAdminPassword(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const session = await requireAdmin();
  if (!session) return { error: "غير مصرح" };

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") {
    return { error: "غير مصرح" };
  }

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.password
  );
  if (!valid) {
    return { error: "كلمة المرور الحالية غير صحيحة" };
  }

  const same = await bcrypt.compare(parsed.data.newPassword, user.password);
  if (same) {
    return { error: "اختر كلمة مرور مختلفة عن الحالية" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  revalidatePath("/admin/account");

  return { success: "تم تحديث كلمة المرور بنجاح." };
}
