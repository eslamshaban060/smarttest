"use client";

import Link from "next/link";
import { useLanguage } from "@/app/hooks/useLanguage";

export default function PrivacyPage() {
  const { t, isRTL } = useLanguage();

  const sections = [
    {
      titleEn: "Information We Collect",
      titleAr: "المعلومات التي نجمعها",
      contentEn:
        "We collect information you provide directly, such as your name, email address, and phone number when you create an account. We also collect usage data to improve our services.",
      contentAr:
        "نجمع المعلومات التي تقدمها مباشرةً، مثل اسمك وبريدك الإلكتروني ورقم هاتفك عند إنشاء حساب. كما نجمع بيانات الاستخدام لتحسين خدماتنا.",
    },
    {
      titleEn: "How We Use Your Information",
      titleAr: "كيف نستخدم معلوماتك",
      contentEn:
        "We use your information to provide and improve our educational services, send important notifications, process payments, and personalize your learning experience.",
      contentAr:
        "نستخدم معلوماتك لتقديم خدماتنا التعليمية وتحسينها، وإرسال الإشعارات المهمة، ومعالجة المدفوعات، وتخصيص تجربة التعلم الخاصة بك.",
    },
    {
      titleEn: "Data Security",
      titleAr: "أمان البيانات",
      contentEn:
        "We implement industry-standard security measures to protect your personal information. Your password is encrypted and never stored in plain text.",
      contentAr:
        "نطبق معايير أمان على مستوى الصناعة لحماية معلوماتك الشخصية. كلمة مرورك مشفّرة ولا تُخزَّن أبدًا كنص عادي.",
    },
    {
      titleEn: "Cookies",
      titleAr: "ملفات تعريف الارتباط",
      contentEn:
        "We use cookies to maintain your session and preferences. You can control cookie settings through your browser.",
      contentAr:
        "نستخدم ملفات تعريف الارتباط للحفاظ على جلستك وتفضيلاتك. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.",
    },
    {
      titleEn: "Contact Us",
      titleAr: "تواصل معنا",
      contentEn:
        "If you have questions about this privacy policy, please contact us at eslamshaban060@gmail.com.",
      contentAr:
        "إذا كانت لديك أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا على eslamshaban060@gmail.com.",
    },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
      {/* header */}
      <div className="bg-[#0a2540] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_50%,rgba(0,180,216,0.1),transparent)]" />
        <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
          <p className="text-[#00b4d8]/70 text-[11px] font-bold tracking-[0.25em] uppercase mb-4">
            Smart Academy
          </p>
          <h1 className="text-white text-[clamp(28px,5vw,48px)] font-bold leading-tight mb-3">
            {t("Privacy Policy", "سياسة الخصوصية")}
          </h1>
          <p className="text-white/40 text-[14px]">
            {t("Last updated: January 2025", "آخر تحديث: يناير 2025")}
          </p>
        </div>
      </div>

      {/* content */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <p className="text-slate-500 text-[15px] leading-[1.9]">
            {t(
              "Smart Academy is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.",
              "تلتزم Smart Academy بحماية خصوصيتك. توضح هذه السياسة كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها.",
            )}
          </p>
        </div>

        {sections.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
          >
            <div className={`flex items-start gap-4 ${isRTL ? "" : ""}`}>
              <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-[#00b4d8] to-[#00b4d8]/10 flex-shrink-0 hidden sm:block" />
              <div>
                <h2 className="text-[#0a2540] font-bold text-[17px] mb-3">
                  {t(s.titleEn, s.titleAr)}
                </h2>
                <p className="text-slate-500 text-[15px] leading-[1.9]">
                  {t(s.contentEn, s.contentAr)}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center pb-4">
          <Link
            href="/"
            className="text-[#00b4d8] text-[14px] font-medium hover:underline"
          >
            {t("← Back to Home", "← العودة للرئيسية")}
          </Link>
        </div>
      </div>
    </div>
  );
}
