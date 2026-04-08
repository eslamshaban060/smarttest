"use client";

import Link from "next/link";
import { useLanguage } from "@/app/hooks/useLanguage";

export default function TermsPage() {
  const { t, isRTL } = useLanguage();

  const sections = [
    {
      titleEn: "Acceptance of Terms",
      titleAr: "قبول الشروط",
      contentEn:
        "By accessing and using EN-AVM Academy, you accept and agree to be bound by these Terms of Use. If you do not agree, please do not use our platform.",
      contentAr:
        "باستخدام EN-AVM Academy، فإنك تقبل وتوافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق، يرجى عدم استخدام منصتنا.",
    },
    {
      titleEn: "User Accounts",
      titleAr: "حسابات المستخدمين",
      contentEn:
        "You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to notify us of any unauthorized use of your account.",
      contentAr:
        "أنت مسؤول عن الحفاظ على سرية بيانات حسابك. توافق على تقديم معلومات دقيقة وإخطارنا بأي استخدام غير مصرح به لحسابك.",
    },
    {
      titleEn: "Educational Content",
      titleAr: "المحتوى التعليمي",
      contentEn:
        "All content provided on EN-AVM Academy is for educational purposes only. Content is created by qualified medical professionals and is regularly updated.",
      contentAr:
        "جميع المحتويات المقدمة على EN-AVM Academy لأغراض تعليمية فقط. يتم إنشاء المحتوى من قِبل متخصصين طبيين مؤهلين ويتم تحديثه بانتظام.",
    },
    {
      titleEn: "Intellectual Property",
      titleAr: "الملكية الفكرية",
      contentEn:
        "All content, materials, and resources on this platform are the intellectual property of EN-AVM Academy. You may not reproduce or distribute any content without permission.",
      contentAr:
        "جميع المحتويات والمواد والموارد على هذه المنصة هي ملكية فكرية لـ EN-AVM Academy. لا يجوز لك إعادة إنتاج أو توزيع أي محتوى دون إذن.",
    },
    {
      titleEn: "Limitation of Liability",
      titleAr: "تحديد المسؤولية",
      contentEn:
        "EN-AVM Academy shall not be liable for any indirect or consequential damages arising from your use of the platform. Educational content does not replace professional medical advice.",
      contentAr:
        "لن تكون EN-AVM Academy مسؤولة عن أي أضرار غير مباشرة ناتجة عن استخدامك للمنصة. المحتوى التعليمي لا يحل محل المشورة الطبية المتخصصة.",
    },
    {
      titleEn: "Changes to Terms",
      titleAr: "التغييرات على الشروط",
      contentEn:
        "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.",
      contentAr:
        "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. الاستمرار في استخدام المنصة بعد التغييرات يعني قبول الشروط الجديدة.",
    },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
      {/* header */}
      <div className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_50%,rgba(0,180,216,0.1),transparent)]" />
        <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
          <p className="text-[#00b4d8]/70 text-[11px] font-bold tracking-[0.25em] uppercase mb-4">
            EN-AVM Academy
          </p>
          <h1 className="text-white text-[clamp(28px,5vw,48px)] font-bold leading-tight mb-3">
            {t("Terms of Use", "شروط الاستخدام")}
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
              "Welcome to EN-AVM Academy. These terms govern your use of our platform and educational services. Please read them carefully.",
              "مرحباً بك في EN-AVM Academy. تحكم هذه الشروط استخدامك لمنصتنا وخدماتنا التعليمية. يرجى قراءتها بعناية.",
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
