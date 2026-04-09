"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Ear,
  AudioLines,
  Headphones,
  Stethoscope,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { fadeUpView } from "@/lib/animations";

export const WhatWeOffer = () => {
  const { t, isRTL } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const items = [
    {
      Icon: Ear,
      title: t("Clinical Audiology", "السمعيات الإكلينيكية"),
      desc: t(
        "Comprehensive diagnostic audiological assessments and interpretation.",
        "تقييمات سمعية تشخيصية شاملة وتفسيرها.",
      ),
    },
    {
      Icon: AudioLines,
      title: t("Vestibular Assessment", "تقييم الاتزان"),
      desc: t(
        "Advanced vestibular testing, VNG, VEMP, and balance evaluation.",
        "اختبارات متقدمة للاتزان: VNG، VEMP، وتقييم التوازن.",
      ),
    },
    {
      Icon: Headphones,
      title: t("auditory evoked potentials", "السماعات الطبية"),
      desc: t(
        "Selection, fitting, and programming of hearing amplification devices.",
        "اختيار وتركيب وبرمجة أجهزة تضخيم السمع.",
      ),
    },
    {
      Icon: Stethoscope,
      title: t("Cochlear Implants", "زراعة القوقعة"),
      desc: t(
        "Pre-operative evaluation, candidacy selection, and post-operative mapping.",
        "التقييم قبل الجراحة واختيار المرشحين والبرمجة بعدها.",
      ),
    },
    {
      Icon: BookOpen,
      title: t("Case-Based Teaching", "تعليم قائم على الحالات"),
      desc: t(
        "Real clinical cases for practical learning and diagnostic reasoning.",
        "حالات إكلينيكية حقيقية للتعلم العملي والاستدلال التشخيصي.",
      ),
    },
    {
      Icon: GraduationCap,
      title: t("central auditory processing", "التحضير للبورد"),
      desc: t(
        "Structured training for the Egyptian Board of Audio-Vestibular Medicine.",
        "تدريب منهجي للبورد المصري لطب السمع والاتزان.",
      ),
    },
  ];

  return (
    <section
      id="offer"
      dir={isRTL ? "rtl" : "ltr"}
      className="py-28 bg-[#f4f6f9] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <motion.div
          {...fadeUpView()}
          className="mb-16"
          style={{ textAlign: isRTL ? "right" : "left" }}
        >
          <span className="text-secondary text-[12px] font-bold tracking-[0.2em] uppercase block mb-3">
            {t("What You'll Learn", "ماذا ستتعلم")}
          </span>
          <h2 className="font-serif text-primary text-[clamp(32px,4.5vw,52px)] font-bold leading-tight mb-4">
            {t("Core Specializations", "التخصصات الأساسية")}
          </h2>
          <p className="text-slate-500 text-[16px] leading-relaxed max-w-xl">
            {t(
              "Courses designed by Prof. Dr. Ebtessam Nada covering all aspects of Audio-Vestibular Medicine.",
              "دورات من تصميم أ.د. ابتسام ندى تغطي جميع جوانب طب السمع والاتزان.",
            )}
          </p>
        </motion.div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-1.5 transition-all duration-400 relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-secondary to-secondary/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              <div className="w-12 h-12 rounded-xl bg-secondary/[0.09] group-hover:bg-secondary group-hover:shadow-lg group-hover:shadow-secondary/25 flex items-center justify-center mb-5 transition-all duration-400">
                <item.Icon className="w-6 h-6 text-secondary group-hover:text-white transition-colors duration-400" />
              </div>
              <h3 className="font-semibold text-[16.5px] text-slate-800 mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-[14px] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
