"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Ear, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { fadeUp } from "@/lib/animations";

export const Hero = () => {
  const { t, isRTL } = useLanguage();

  const stats = [
    { value: "2019", label: t("Since", "منذ") },
    { value: "6", label: t("Volumes", "أجزاء") },
    { value: "500+", label: t("Students", "طالب") },
    { value: "50+", label: t("Workshops", "ورشة") },
  ];

  const bars = [
    { label: t("Audiology", "السمعيات"), pct: 92 },
    { label: t("Vestibular", "الاتزان"), pct: 85 },
    { label: t("Cochlear", "القوقعة"), pct: 78 },
  ];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative min-h-[96vh] flex items-center overflow-hidden bg-primary"
    >
      <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-secondary/[0.09] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-[#004e92]/[0.15] blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_55%,rgba(0,180,216,0.04)_55%,rgba(0,180,216,0.04)_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-10 w-full py-24 lg:py-0 relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center min-h-[88vh]">
          <div className="max-w-2xl">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-secondary/[0.12] border border-secondary/25 rounded-full text-secondary text-[12.5px] font-medium mb-7 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                {t(
                  "Audio-Vestibular Medicine Platform",
                  "منصة طب السمع والاتزان",
                )}
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="font-serif font-bold leading-[1.0] mb-7"
            >
              {isRTL ? (
                <>
                  <span className="block text-[clamp(52px,9vw,96px)] text-white">
                    سمارت
                  </span>
                  <span className="block text-[clamp(52px,9vw,96px)] text-secondary italic">
                    أكاديمي
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-[clamp(52px,9vw,96px)] text-white">
                    Smart
                  </span>
                  <span className="block text-[clamp(52px,9vw,96px)] text-secondary italic">
                    Academy
                  </span>
                </>
              )}
            </motion.h1>

            <motion.div
              {...fadeUp(0.18)}
              className="flex items-center gap-4 mb-7"
            >
              <div className="h-px flex-1 max-w-[60px] bg-secondary/40" />
              <p className="text-white/50 text-[14px] leading-relaxed">
                {t(
                  "Prof. Dr. Ebtessam Nada — Audio-Vestibular Medicine, Zagazig University",
                  "أ.د. ابتسام ندى — طب السمع والاتزان، جامعة الزقازيق",
                )}
              </p>
            </motion.div>

            <motion.p
              {...fadeUp(0.24)}
              className="text-white/35 text-[15px] leading-[1.85] mb-10 max-w-md"
            >
              {t(
                "Your trusted learning space for clinical audiology, vestibular assessment & rehabilitation.",
                "مساحتك التعليمية الموثوقة في السمعيات الإكلينيكية وتقييم وتأهيل الاتزان.",
              )}
            </motion.p>

            <motion.div
              {...fadeUp(0.32)}
              className="flex flex-wrap gap-3 mb-14"
            >
              <Link
                href="/courses"
                className="inline-flex items-center gap-2.5 bg-secondary hover:bg-secondary/90 text-white font-semibold px-7 py-3.5 rounded-2xl shadow-xl shadow-secondary/30 hover:-translate-y-0.5 transition-all text-[15px]"
              >
                {t("Browse Courses", "تصفح الدورات")}
                <ArrowRight
                  className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white/80 font-medium px-7 py-3.5 rounded-2xl transition-all text-[15px]"
              >
                {t("About Prof. Nada", "عن أ.د. ابتسام")}
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.44)} className="flex flex-wrap gap-3">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2.5"
                >
                  <span className="font-serif text-secondary font-bold text-[22px] leading-none">
                    {s.value}
                  </span>
                  <span className="text-white/40 text-[12px] leading-tight max-w-[56px]">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative w-[300px] xl:w-[340px] flex-shrink-0"
          >
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-secondary/[0.08] border border-secondary/10" />
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
            <div className="relative rounded-3xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-sm p-7 shadow-2xl">
              <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/20 flex items-center justify-center">
                  <Ear className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-[11px] text-secondary/70 bg-secondary/[0.1] border border-secondary/15 rounded-full px-2.5 py-1 font-medium">
                  {t("Live", "متاح")}
                </span>
              </div>
              <h3 className="font-serif text-white text-[18px] font-bold mb-2 leading-snug">
                {t("Clinical Excellence", "التميز الإكلينيكي")}
              </h3>
              <p className="text-white/40 text-[13px] leading-relaxed mb-5">
                {t(
                  "Evidence-based curriculum built on decades of clinical practice.",
                  "منهج قائم على الأدلة مبني على عقود من الممارسة الإكلينيكية.",
                )}
              </p>
              <div className="flex flex-col gap-3 mb-5">
                {bars.map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/50">{bar.label}</span>
                      <span className="text-secondary/70">{bar.pct}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-secondary to-secondary/60 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.pct}%` }}
                        transition={{
                          duration: 1.2,
                          delay: 0.8,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/50 text-[12px]">
                    {t("Now Enrolling", "قيد التسجيل")}
                  </span>
                </div>
                <span className="text-secondary font-semibold text-[13px]">
                  {t("Summer 2025", "صيف 2025")}
                </span>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute -bottom-4 ${isRTL ? "-left-5" : "-right-5"} bg-secondary rounded-2xl px-4 py-3 shadow-xl shadow-secondary/40`}
            >
              <div className="font-serif text-white text-2xl font-bold leading-none">
                6
              </div>
              <div className="text-white/75 text-[10px] mt-0.5 whitespace-nowrap">
                {t("Published Vols.", "أجزاء منشورة")}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
