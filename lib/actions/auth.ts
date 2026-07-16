"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AuthFormState = {
  error?: string;
  success?: string;
};

/** Shared login for customers and admins — redirects by role. */
export async function login(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const redirectTo = user?.role === "ADMIN" ? "/admin" : "/";

    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }
    throw error;
  }
}

/** @deprecated Use `login` — kept for any leftover imports */
export async function loginAdmin(
  prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  return login(prev, formData);
}

/** @deprecated Use `login` — kept for any leftover imports */
export async function loginCustomer(
  prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  return login(prev, formData);
}

export async function logoutAdmin() {
  await signOut({ redirectTo: "/sign-in" });
}

const signUpSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("أدخل بريداً إلكترونياً صالحاً"),
  password: z.string().min(6, "يجب أن تكون كلمة المرور ٦ أحرف على الأقل"),
});

export async function registerCustomer(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "بيانات غير صالحة" };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return { error: "يوجد حساب بهذا البريد الإلكتروني بالفعل" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: "تم إنشاء الحساب. يرجى تسجيل الدخول.",
      };
    }
    throw error;
  }
}

export async function logoutCustomer() {
  await signOut({ redirectTo: "/" });
}
