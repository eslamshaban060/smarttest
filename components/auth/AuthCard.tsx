"use client";

import Link from "next/link";
import { useLanguage } from "@/app/hooks/useLanguage";

interface Props {
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
  children,
  footer,
}: Props) {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-4">
      {/* bg blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] max-w-[700px] rounded-full bg-secondary/[0.07] blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-primary/[0.04] blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-[#00b4d8] font-serif font-bold text-[18px]">
                S
              </span>
            </div>
            <span className="text-[#0a2540] font-semibold text-[13px] tracking-wide">
              EN-AVM Academy
            </span>
          </Link>
        </div>

        {/* card */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-[#00b4d8] via-[#00b4d8]/60 to-transparent" />
          <div className="p-8">
            <h1 className="text-[#0a2540] text-[24px] font-bold mb-1">
              {t(titleEn, titleAr)}
            </h1>
            <p className="text-slate-400 text-[14px] mb-7">
              {t(subtitleEn, subtitleAr)}
            </p>
            {children}
          </div>
        </div>

        {footer && (
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="text-center mt-5 text-slate-400 text-[13px]"
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
