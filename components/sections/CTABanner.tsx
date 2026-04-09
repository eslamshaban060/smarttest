"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { fadeUpView } from "@/lib/animations";

export const CTABanner = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="py-20 bg-primary relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,rgba(0,180,216,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
        <motion.div {...fadeUpView()}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/15 border border-secondary/25 rounded-full text-secondary text-[13px] font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {t("Start Today", "ابدأ اليوم")}
          </span>
          <h2 className="font-serif text-white text-[clamp(30px,5vw,54px)] font-bold leading-tight mb-5">
            {t(
              "Ready to Elevate Your Clinical Skills?",
              "هل أنت مستعد للارتقاء بمهاراتك الإكلينيكية؟",
            )}
          </h2>
          <p className="text-white/45 text-[16px] leading-relaxed mb-10 max-w-xl mx-auto">
            {t(
              "Join hundreds of physicians and audiologists who trust EN-AVM Academy for their continuing medical education.",
              "انضم لمئات الأطباء وأخصائيي السمعيات الذين يثقون بسمارت أكاديمي في تعليمهم الطبي المستمر.",
            )}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center gap-2.5 bg-secondary hover:bg-secondary/90 text-white font-semibold px-9 py-4 rounded-2xl shadow-xl shadow-secondary/30 hover:-translate-y-0.5 transition-all text-[15.5px]"
            >
              {t("Browse Courses", "تصفح الدورات")}
              <ArrowRight
                className={`w-[18px] h-[18px] ${isRTL ? "rotate-180" : ""}`}
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.12] text-white font-medium px-9 py-4 rounded-2xl transition-all text-[15.5px]"
            >
              {t("Contact Us", "تواصل معنا")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
