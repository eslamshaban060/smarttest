"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field, SubmitButton, Alert } from "@/components/auth/FormFields";
import { useLanguage } from "@/app/hooks/useLanguage";
import { CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const password = fd.get("password") as string;
    const confirm = fd.get("confirm_password") as string;

    if (password !== confirm) {
      setError(t("Passwords do not match", "كلمتا المرور غير متطابقتين"));
      return;
    }

    setError(null);
    setPending(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password,
        fullName: fd.get("full_name"),
        phone: fd.get("phone"),
      }),
    });

    const data = await res.json();
    setPending(false);

    if (!res.ok) setError(data.error);
    else setSuccess(true);
  }

  if (success) {
    return (
      <AuthCard
        titleEn="Check your email"
        titleAr="تحقق من بريدك"
        subtitleEn="We sent you a confirmation link"
        subtitleAr="أرسلنا إليك رابط التأكيد"
      >
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-slate-500 text-[14px] leading-relaxed">
            {t(
              "A confirmation link has been sent to your email. Please check your inbox and activate your account.",
              "تم إرسال رابط التأكيد إلى بريدك الإلكتروني. افتح الرسالة واضغط على الرابط لتفعيل حسابك.",
            )}
          </p>
          <Link
            href="/auth/login"
            className="text-[#00b4d8] font-medium text-[14px] hover:underline"
          >
            {t("Back to login", "العودة لتسجيل الدخول")}
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      titleEn="Create an account"
      titleAr="إنشاء حساب جديد"
      subtitleEn="Join Smart Academy and start your learning journey"
      subtitleAr="انضم إلى Smart Academy وابدأ رحلتك التعليمية"
      footer={
        <span dir={isRTL ? "rtl" : "ltr"}>
          {t("Already have an account?", "لديك حساب بالفعل؟")}{" "}
          <Link
            href="/auth/login"
            className="text-[#00b4d8] font-medium hover:underline"
          >
            {t("Sign in", "تسجيل الدخول")}
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert type="error" message={error} />}

        <Field
          label={t("Full Name", "الاسم الكامل")}
          name="full_name"
          placeholder={t("Enter your full name", "أدخل اسمك الكامل")}
          required
          autoComplete="name"
        />
        <Field
          label={t("Email", "البريد الإلكتروني")}
          name="email"
          type="email"
          placeholder="example@email.com"
          required
          autoComplete="email"
        />
        <Field
          label={t("Phone (optional)", "رقم الهاتف (اختياري)")}
          name="phone"
          type="tel"
          placeholder="01xxxxxxxxx"
          autoComplete="tel"
        />
        <Field
          label={t("Password", "كلمة المرور")}
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

        <p className="text-slate-400 text-[12px] leading-relaxed -mt-1">
          {t(
            "By creating an account, you agree to our",
            "بإنشاء الحساب أنت توافق على",
          )}{" "}
          <Link href="/terms" className="text-[#00b4d8] hover:underline">
            {t("Terms of Use", "شروط الاستخدام")}
          </Link>{" "}
          {t("and", "و")}{" "}
          <Link href="/privacy" className="text-[#00b4d8] hover:underline">
            {t("Privacy Policy", "سياسة الخصوصية")}
          </Link>
        </p>

        <SubmitButton
          label={t("Create Account", "إنشاء الحساب")}
          pendingLabel={t("Creating...", "جاري الإنشاء...")}
          pending={pending}
        />
      </form>
    </AuthCard>
  );
}
