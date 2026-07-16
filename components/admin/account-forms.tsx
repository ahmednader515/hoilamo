"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  updateAdminEmail,
  updateAdminPassword,
  type AccountFormState,
} from "@/lib/actions/admin-account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: AccountFormState = {};

type Props = {
  currentEmail: string;
};

export function AdminAccountForms({ currentEmail }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <EmailForm currentEmail={currentEmail} />
      <PasswordForm />
    </div>
  );
}

function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [state, formAction, pending] = useActionState(
    updateAdminEmail,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>البريد الإلكتروني</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4" key={currentEmail}>
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
            <Label htmlFor="email">البريد الإلكتروني الجديد</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={currentEmail}
              autoComplete="email"
              dir="ltr"
              className="text-start"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-current-password">كلمة المرور الحالية</Label>
            <Input
              id="email-current-password"
              name="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              dir="ltr"
              className="text-start"
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="bg-[#1a120c] hover:bg-[#2c1810]"
          >
            {pending ? "جاري الحفظ…" : "تحديث البريد"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordForm() {
  const [state, formAction, pending] = useActionState(
    updateAdminPassword,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>كلمة المرور</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
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
            <Label htmlFor="password-current">كلمة المرور الحالية</Label>
            <Input
              id="password-current"
              name="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              dir="ltr"
              className="text-start"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              dir="ltr"
              className="text-start"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              dir="ltr"
              className="text-start"
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="bg-[#1a120c] hover:bg-[#2c1810]"
          >
            {pending ? "جاري الحفظ…" : "تحديث كلمة المرور"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
