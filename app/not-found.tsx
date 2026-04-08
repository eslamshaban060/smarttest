"use client";

import Link from "next/link";
import { useLanguage } from "./hooks/useLanguage";

export default function NotFound() {
  const { t, isRTL } = useLanguage();
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        <div className="font-serif text-[#00b4d8] font-bold text-[96px] leading-none mb-4">
          404
        </div>
        <h1 className="text-[#0a2540] text-[24px] font-bold mb-3">
          {t("Page Not Found", "الصفحة غير موجودة")}
        </h1>
        <p className="text-slate-400 text-[15px] leading-relaxed mb-8">
          {t(
            "The page you're looking for doesn't exist or has been moved.",
            "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
          )}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-[#0d3060] text-white font-semibold px-6 py-3 rounded-2xl text-[15px] transition-all"
        >
          {t("Back to Home", "العودة للرئيسية")}
        </Link>
      </div>
    </div>
  );
}
