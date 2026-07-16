"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  login,
  registerCustomer,
  type AuthFormState,
} from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoilamoLogo } from "@/components/store/hoilamo-logo";

const initialState: AuthFormState = {};

export function SignInForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <Card className="w-full max-w-md border-amber-900/10 bg-white shadow-sm">
      <CardHeader className="items-center text-center">
        <HoilamoLogo className="mb-2 h-20 w-20" />
        <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
        <p className="text-sm text-amber-900/60">
          للعملاء والإدارة — مرحباً بعودتك إلى هويلامو
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#1a120c] hover:bg-[#2c1810]"
            disabled={pending}
          >
            {pending ? "جاري الدخول…" : "تسجيل الدخول"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-amber-900/60">
          ليس لديك حساب؟{" "}
          <Link href="/sign-up" className="font-medium text-[#1a120c] underline">
            إنشاء حساب
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    registerCustomer,
    initialState
  );

  return (
    <Card className="w-full max-w-md border-amber-900/10 bg-white shadow-sm">
      <CardHeader className="items-center text-center">
        <HoilamoLogo className="mb-2 h-20 w-20" />
        <CardTitle className="text-2xl">إنشاء حساب</CardTitle>
        <p className="text-sm text-amber-900/60">
          انضم إلى هويلامو واطلب مسبقاً للاستلام
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </div>
          )}
          {state.success && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {state.success}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={6}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#1a120c] hover:bg-[#2c1810]"
            disabled={pending}
          >
            {pending ? "جاري إنشاء الحساب…" : "إنشاء حساب"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-amber-900/60">
          لديك حساب بالفعل؟{" "}
          <Link href="/sign-in" className="font-medium text-[#1a120c] underline">
            تسجيل الدخول
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
