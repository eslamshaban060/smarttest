"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field, SubmitButton, Alert } from "@/components/auth/FormFields";
import { useLanguage } from "@/app/hooks/useLanguage";

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(
    !token
      ? t(
          "Invalid link — request a new one",
          "الرابط غير صالح — اطلب رابطاً جديداً",
        )
      : null,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const password = fd.get("password") as string;
    const confirm = fd.get("confirm_password") as string;

    if (password !== confirm) {
      setError(t("Passwords do not match", "كلمتا المرور غير متطابقتين"));
      return;
    }
    if (password.length < 8) {
      setError(
        t(
          "Password must be at least 8 characters",
          "كلمة المرور يجب أن تكون ٨ أحرف على الأقل",
        ),
      );
      return;
    }

    setError(null);
    setPending(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setPending(false);

    if (!res.ok) setError(data.error);
    else router.push("/auth/login?reset=success");
  }

  return (
    <AuthCard
      titleEn="Set a new password"
      titleAr="تعيين كلمة مرور جديدة"
      subtitleEn="Choose a strong password for your account"
      subtitleAr="أدخل كلمة مرور قوية لحسابك"
      footer={
        <Link
          href="/auth/forgot-password"
          className="text-[#00b4d8] font-medium hover:underline"
        >
          {t("Request a new link", "طلب رابط جديد")}
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert type="error" message={error} />}

        <Field
          label={t("New Password", "كلمة المرور الجديدة")}
          name="password"
          type="password"
          placeholder={t("At least 8 characters", "٨ أحرف على الأقل")}
          required
          autoComplete="new-password"
        />
        <Field
          label={t("Confirm Password", "تأكيد كلمة المرور")}
          name="confirm_password"
          type="password"
          placeholder={t("Re-enter your password", "أعد إدخال كلمة المرور")}
          required
          autoComplete="new-password"
        />

        <ul className="text-slate-400 text-[12px] space-y-0.5 -mt-1 list-none">
          <li>• {t("At least 8 characters", "٨ أحرف على الأقل")}</li>
          <li>
            •{" "}
            {t(
              "Mix uppercase, numbers & symbols",
              "يُنصح باستخدام أحرف كبيرة وأرقام ورموز",
            )}
          </li>
        </ul>

        <SubmitButton
          label={t("Set Password", "تعيين كلمة المرور")}
          pendingLabel={t("Saving...", "جاري الحفظ...")}
          pending={pending}
        />
      </form>
    </AuthCard>
  );
}
