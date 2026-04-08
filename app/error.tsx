"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "./hooks/useLanguage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        <div className="font-serif text-red-400 font-bold text-[96px] leading-none mb-4">
          500
        </div>
        <h1 className="text-[#0a2540] text-[24px] font-bold mb-3">
          {t("Something went wrong", "حدث خطأ ما")}
        </h1>
        <p className="text-slate-400 text-[15px] leading-relaxed mb-8">
          {t(
            "An unexpected error occurred. Please try again.",
            "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
          )}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-primary hover:bg-[#0d3060] text-white font-semibold px-6 py-3 rounded-2xl text-[15px] transition-all"
          >
            {t("Try Again", "حاول مجدداً")}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-medium px-6 py-3 rounded-2xl text-[15px] transition-all"
          >
            {t("Back to Home", "العودة للرئيسية")}
          </Link>
        </div>
      </div>
    </div>
  );
}
