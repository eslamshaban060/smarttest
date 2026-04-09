"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { fadeUpView } from "@/lib/animations";

interface Volume {
  n: number;
  color: string;
  title: string;
  topics: string[];
  pages: string;
}

export const FeaturedBook = () => {
  const { t, isRTL } = useLanguage();
  const [activeVol, setActiveVol] = useState<number>(1);
  const [flipped, setFlipped] = useState<boolean>(false);

  const volumes: Volume[] = [
    {
      n: 1,
      color: "from-[#00b4d8] to-[#0096b4]",
      title: t("basic audiological knowledge", "السمعيات الأساسية"),
      pages: "280",
      topics: [
        t("Anatomy of the ear", "تشريح الأذن"),
        t("Sound physics", "فيزياء الصوت"),
        t("Pure tone audiometry", "قياس النغمة النقية"),
      ],
    },
    {
      n: 2,
      color: "from-[#0096c7] to-[#0077b6]",
      title: t("rehabilitation in audioliogy", "التشخيص المتقدم"),
      pages: "310",
      topics: [
        t("Speech audiometry", "قياس الكلام"),
        t("Immittance testing", "قياس الامتثال"),
        t("OAE & ABR", "OAE و ABR"),
      ],
    },
    {
      n: 3,
      color: "from-[#0077b6] to-[#005f91]",
      title: t("Basic knowledge of the vestibular system", "الجهاز الدهليزي"),
      pages: "295",
      topics: [
        t("VNG / ENG", "VNG / ENG"),
        t("VEMP testing", "اختبار VEMP"),
        t("Balance rehabilitation", "تأهيل التوازن"),
      ],
    },
    {
      n: 4,
      color: "from-[#48cae4] to-[#00b4d8]",
      title: t("auditory evoked potentials", "السماعات الطبية"),
      pages: "265",
      topics: [
        t("Candidacy & selection", "الاختيار والتركيب"),
        t("Digital programming", "البرمجة الرقمية"),
        t("Fitting & verification", "التحقق والمتابعة"),
      ],
    },
    {
      n: 5,
      color: "from-[#0d3868] to-[#0a2540]",
      title: t("Cochlear Implants", "زراعة القوقعة"),
      pages: "320",
      topics: [
        t("Pre-op evaluation", "التقييم قبل الجراحة"),
        t("Candidacy criteria", "معايير الاختيار"),
        t("Post-op mapping", "البرمجة بعد الجراحة"),
      ],
    },
    {
      n: 6,
      color: "from-[#e9c46a] to-[#f4a261]",
      title: t("central auditory processing", "التحضير للبورد"),
      pages: "340",
      topics: [
        t("MCQs & case studies", "أسئلة وحالات"),
        t("Clinical scenarios", "سيناريوهات إكلينيكية"),
        t("Exam strategies", "استراتيجيات الامتحان"),
      ],
    },
  ];

  const vol = volumes[activeVol - 1];

  const handleVolClick = (n: number) => {
    if (n === activeVol) {
      setFlipped((f: boolean) => !f);
    } else {
      setFlipped(false);
      setTimeout(() => setActiveVol(n), 80);
    }
  };

  return (
    <section
      id="book"
      dir={isRTL ? "rtl" : "ltr"}
      className="py-24 bg-[#f4f6f9] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(10,37,64,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(10,37,64,0.025)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <motion.div
          {...fadeUpView()}
          className="mb-12"
          style={{ textAlign: isRTL ? "right" : "left" }}
        >
          <span className="text-secondary text-[12px] font-bold tracking-[0.2em] uppercase block mb-3">
            {t("Flagship Publication", "الإصدار الرائد")}
          </span>
          <h2 className="font-serif text-primary text-[clamp(30px,4vw,48px)] font-bold leading-tight mb-3">
            Audiology Step by Step
          </h2>
          <p className="text-slate-500 text-[15px] max-w-lg">
            {t(
              "Select a volume to explore its contents — click again to flip for details.",
              "اختر جزءاً لاستعراض محتواه — اضغط مرة أخرى لعرض التفاصيل.",
            )}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div>
            <div className="flex flex-wrap gap-3 mb-8">
              {volumes.map((v) => (
                <motion.button
                  key={v.n}
                  onClick={() => handleVolClick(v.n)}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-12 h-12 rounded-2xl font-serif font-bold text-[17px] transition-all duration-300 cursor-pointer shadow-sm
                    ${activeVol === v.n ? "bg-primary text-white shadow-lg shadow-primary/25 scale-110" : "bg-white text-primary/50 border border-slate-200 hover:border-secondary/50 hover:text-secondary"}`}
                >
                  {v.n}
                  {activeVol === v.n && (
                    <motion.span
                      layoutId="vol-indicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-secondary"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeVol}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${vol.color} flex items-center justify-center font-serif font-bold text-white text-[15px] shadow-md`}
                  >
                    {vol.n}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-800 text-[16px]">
                      {vol.title}
                    </div>
                    <div className="text-slate-400 text-[12px]">
                      {vol.pages} {t("pages", "صفحة")}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {vol.topics.map((topic, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                      <span className="text-slate-600 text-[14px]">
                        {topic}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="cursor-pointer select-none"
            style={{ perspective: 1000 }}
            onClick={() => setFlipped((f: boolean) => !f)}
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full"
            >
              <div
                style={{ backfaceVisibility: "hidden" }}
                className="relative"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`front-${activeVol}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-gradient-to-br ${vol.color} rounded-3xl p-8 shadow-2xl min-h-[380px] flex flex-col justify-between relative overflow-hidden`}
                  >
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/[0.06]" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/[0.06]" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-8">
                        <span className="font-serif text-white/40 text-[13px] font-medium tracking-widest uppercase">
                          Vol.
                        </span>
                        <span className="font-serif text-white/20 text-[80px] font-bold leading-none -mt-4">
                          {vol.n}
                        </span>
                      </div>
                      <BookOpen className="w-10 h-10 text-white/60 mb-5" />
                      <div className="font-serif text-white text-[22px] font-bold leading-tight mb-2">
                        Audiology
                        <br />
                        Step by Step
                      </div>
                      <div className="text-white/60 text-[14px]">
                        {vol.title}
                      </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-white/40 text-[12px]">
                        {vol.pages} {t("pages", "صفحة")}
                      </span>
                      <span className="text-white/50 text-[11px]">
                        {t("tap to flip", "اضغط للتقليب")} ↻
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
                className="absolute inset-0"
              >
                <div className="bg-primary rounded-3xl p-8 shadow-2xl min-h-[380px] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-secondary/[0.1]" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <span
                        className={`w-8 h-8 rounded-xl bg-gradient-to-br ${vol.color} flex items-center justify-center font-serif font-bold text-white text-[13px]`}
                      >
                        {vol.n}
                      </span>
                      <span className="text-white/50 text-[13px]">
                        {vol.title}
                      </span>
                    </div>
                    <h4 className="font-serif text-white text-[18px] font-bold mb-4">
                      {t("What's Inside", "محتويات الجزء")}
                    </h4>
                    <div className="flex flex-col gap-2.5">
                      {vol.topics.map((topic, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                          <span className="text-white/65 text-[14px]">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative z-10 text-white/30 text-[11px]">
                    {t("tap to flip back", "اضغط للعودة")} ↻
                  </div>
                </div>
              </div>
            </motion.div>
            <p className="text-center text-slate-400 text-[12px] mt-3">
              {flipped
                ? t("Tap to see cover", "اضغط لرؤية الغلاف")
                : t("Tap to see contents", "اضغط لرؤية المحتوى")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
