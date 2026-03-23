"use client";

import { motion } from "framer-motion";
import { BookOpen, Microscope, Users, Award, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { fadeUpView } from "@/lib/animations";

export const WhyChooseUs = () => {
  const { t, isRTL } = useLanguage();

  const credentials = [
    t("IBCT-Certified Trainer", "مدربة معتمدة IBCT"),
    t("DHPE Fellow", "زمالة DHPE"),
    t(
      "Editor — Egyptian Journal of Otorhinolaryngology",
      "محررة — المجلة المصرية لطب الأنف والأذن والحنجرة",
    ),
    t(
      "Coordinator — Egyptian Board Training Program",
      "منسقة — برنامج تدريب البورد المصري",
    ),
    t("Diploma in Childhood Psychiatry", "دبلوم طب نفسية الأطفال"),
    t("Diploma in Therapeutic Nutrition", "دبلوم التغذية العلاجية"),
  ];

  const feats = [
    {
      Icon: BookOpen,
      title: t("6-Volume Series", "سلسلة 6 أجزاء"),
      desc: t('"Audiology Step by Step"', '"Audiology Step by Step"'),
    },
    {
      Icon: Microscope,
      title: t("Evidence-Based", "قائم على الأدلة"),
      desc: t("Latest research & guidelines", "أحدث الأبحاث والإرشادات"),
    },
    {
      Icon: Users,
      title: t("Mentorship", "إرشاد مهني"),
      desc: t("Personal clinical guidance", "توجيه إكلينيكي شخصي"),
    },
    {
      Icon: Award,
      title: t("Holistic View", "رؤية شمولية"),
      desc: t("Neuro + psych + nutrition", "عصبي + نفسي + تغذوي"),
    },
  ];

  return (
    <section
      id="why"
      dir={isRTL ? "rtl" : "ltr"}
      className="py-28 bg-white relative overflow-hidden"
    >
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-secondary/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <div>
            <motion.div {...fadeUpView()}>
              <span className="text-secondary text-[12px] font-bold tracking-[0.2em] uppercase block mb-3">
                {t("Why Smart Academy", "لماذا سمارت أكاديمي")}
              </span>
              <h2 className="font-serif text-primary text-[clamp(30px,4vw,48px)] font-bold leading-tight mb-5">
                {t("Learn from a Leading Expert", "تعلّم من خبيرة رائدة")}
              </h2>
              <p className="text-slate-500 text-[16px] leading-[1.8] mb-8">
                {t(
                  "Prof. Dr. Ebtessam Nada brings decades of clinical & academic experience, authoring one of the most comprehensive educational series in the field.",
                  "أ.د. ابتسام ندى تجمع عقودًا من الخبرة الإكلينيكية والأكاديمية، ومؤلفة أحد أشمل السلاسل التعليمية في المجال.",
                )}
              </p>
            </motion.div>
            <motion.div {...fadeUpView(0.1)} className="grid grid-cols-2 gap-3">
              {feats.map((f, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-secondary/[0.1] flex items-center justify-center">
                    <f.Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-[13.5px] text-slate-800">
                      {f.title}
                    </div>
                    <div className="text-slate-500 text-[12px] mt-0.5 leading-snug">
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div {...fadeUpView(0.15)} className="relative pb-6">
            <div className={isRTL ? "pl-6" : "pr-6"}>
              <div className="bg-primary rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-secondary/[0.12] rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5 mb-7">
                    <Award className="w-5 h-5 text-secondary" />
                    <h3 className="font-serif text-white text-[18px] font-bold">
                      {t("Credentials & Qualifications", "المؤهلات والشهادات")}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {credentials.map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-white/75 text-[14px] leading-relaxed">
                          {c}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute bottom-0 ${isRTL ? "left-0" : "right-0"} bg-secondary rounded-2xl p-4 shadow-xl shadow-secondary/35`}
            >
              <div className="font-serif text-white text-3xl font-bold leading-none">
                6
              </div>
              <div className="text-white/80 text-[11px] mt-1">
                {t("Published Volumes", "أجزاء منشورة")}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
