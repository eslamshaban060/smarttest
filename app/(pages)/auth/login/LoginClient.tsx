"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field, SubmitButton, Alert } from "@/components/auth/FormFields";
import { useLanguage } from "@/app/hooks/useLanguage";

export default function LoginPage() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });

    const data = await res.json();
    setPending(false);

    if (!res.ok) setError(data.error);
    else router.push("/dashboard");
  }

  return (
    <AuthCard
      titleEn="Welcome back"
      titleAr="أهلاً بعودتك"
      subtitleEn="Sign in to continue"
      subtitleAr="سجّل دخولك للمتابعة"
      footer={
        <span dir={isRTL ? "rtl" : "ltr"}>
          {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
          <Link
            href="/auth/register"
            className="text-[#00b4d8] font-medium hover:underline"
          >
            {t("Create one", "إنشاء حساب جديد")}
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {verified && (
          <Alert
            type="success"
            message={t(
              "Account activated! Sign in now.",
              "تم تفعيل حسابك بنجاح! سجّل دخولك الآن",
            )}
          />
        )}
        {error && <Alert type="error" message={error} />}

        <Field
          label={t("Email", "البريد الإلكتروني")}
          name="email"
          type="email"
          placeholder="example@email.com"
          required
          autoComplete="email"
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-slate-700 text-[13px] font-medium"
            >
              {t("Password", "كلمة المرور")}{" "}
              <span className="text-[#00b4d8]">*</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[#00b4d8] text-[12px] font-medium hover:underline"
            >
              {t("Forgot password?", "نسيت كلمة المرور؟")}
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all"
          />
        </div>

        <SubmitButton
          label={t("Sign In", "تسجيل الدخول")}
          pendingLabel={t("Signing in...", "جاري الدخول...")}
          pending={pending}
        />
      </form>
    </AuthCard>
  );
}
