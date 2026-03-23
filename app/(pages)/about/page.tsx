"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  BookOpen,
  Award,
  Users,
  Stethoscope,
} from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const About = () => {
  const { t, isRTL } = useLanguage();

  const roles = [
    t(
      "Professor of Audio-Vestibular Medicine, Zagazig University (since 2019)",
      "أستاذة طب السمع والاتزان، جامعة الزقازيق (منذ 2019)",
    ),
    t(
      "Coordinator, Egyptian Board of Audio-Vestibular Medicine Training Program",
      "منسّقة برنامج تدريب البورد المصري لطب السمع والاتزان",
    ),
    t("IBCT-Certified Trainer", "مدربة معتمدة IBCT"),
    t("DHPE Fellow", "زمالة DHPE"),
  ];

  const stats = [
    { Icon: BookOpen, value: "6", label: t("Book Volumes", "أجزاء") },
    { Icon: Users, value: "500+", label: t("Students", "طالب") },
    { Icon: Award, value: "50+", label: t("Workshops", "ورشة") },
    { Icon: Stethoscope, value: "2019", label: t("Prof. Since", "أستاذة منذ") },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* ── Hero strip ── */}
        <section
          dir={isRTL ? "rtl" : "ltr"}
          className="bg-primary relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_50%,rgba(0,180,216,0.1),transparent)]" />
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* breadcrumb */}
              <div
                className={`flex items-center gap-2 text-white/30 text-[12px] mb-8 ${isRTL ? "flex-row-reverse justify-end" : ""}`}
              >
                <Link
                  href="/"
                  className="hover:text-secondary transition-colors"
                >
                  {t("Home", "الرئيسية")}
                </Link>
                <span>/</span>
                <span className="text-white/55">
                  {t("About", "عن الأكاديمية")}
                </span>
              </div>

              <p className="text-secondary/70 text-[11px] font-bold tracking-[0.25em] uppercase mb-4">
                EN-AVM Academy
              </p>
              <h1 className="font-serif text-white text-[clamp(36px,6vw,72px)] font-bold leading-[1.0] tracking-tight mb-6">
                {t("About the", "عن")}
                <br />
                <span
                  style={{
                    WebkitTextStroke: "1.5px rgba(0,180,216,0.6)",
                    color: "transparent",
                  }}
                >
                  {t("Academy", "الأكاديمية")}
                </span>
              </h1>
              <p className="text-white/45 text-[15px] leading-relaxed max-w-xl">
                {t(
                  "A trusted learning space for Audio-Vestibular Medicine, led by Prof. Dr. Ebtessam Nada.",
                  "منصة تعليمية موثوقة في طب السمع والاتزان، بقيادة أ.د. ابتسام ندى.",
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section
          dir={isRTL ? "rtl" : "ltr"}
          className="bg-[#f8f9fc] border-b border-slate-100"
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.07)}
                  className={`flex items-center gap-3 ${isRTL ? "" : ""}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <s.Icon className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <div className="font-serif text-primary font-bold text-[20px] leading-none">
                      {s.value}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      {s.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Main content ── */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="max-w-4xl mx-auto px-6 sm:px-10 py-16 space-y-16"
        >
          {/* About Prof */}
          <motion.div
            {...fadeUp()}
            className="grid sm:grid-cols-[auto_1fr] gap-8 items-start"
          >
            {/* accent bar */}
            <div className="hidden sm:block w-1 self-stretch rounded-full bg-gradient-to-b from-secondary to-secondary/10 flex-shrink-0" />
            <div>
              <h2 className="font-serif text-primary text-[22px] font-bold mb-5">
                {t("About Prof. Dr. Ebtessam Nada", "عن أ.د. ابتسام ندى")}
              </h2>
              <div className="space-y-4 text-slate-500 text-[15px] leading-[1.9]">
                <p>
                  {t(
                    "Prof. Dr. Ebtessam Nada is a Professor of Audio-Vestibular Medicine at the Otolaryngology Department, Zagazig University, Egypt. With extensive clinical and academic experience, she is dedicated to improving the standards of audiology and vestibular practice across the region through education, research, and structured professional training.",
                    "أ.د. ابتسام ندى أستاذة طب السمع والاتزان بقسم الأنف والأذن والحنجرة، جامعة الزقازيق – مصر. بخبرة إكلينيكية وأكاديمية واسعة، تكرّس جهودها لرفع معايير ممارسة السمعيات والاتزان في المنطقة عبر التعليم والبحث والتدريب المهني المنهجي.",
                  )}
                </p>
                <p>
                  {t(
                    "She is the founder and director of Audiology Step by Step, one of the leading educational platforms in the field, offering comprehensive lectures, case-based teaching, written materials, and continuously updated literature to support clinicians and trainees. Her commitment to mentorship has helped guide many young physicians and audiologists toward professional excellence in diagnostics and rehabilitation.",
                    "وهي المؤسسة والمديرة لمنصة Audiology Step by Step، إحدى أبرز المنصات التعليمية في المجال، والتي تقدم محاضرات شاملة وتعليمًا قائمًا على الحالات ومواد مكتوبة ومراجع محدثة باستمرار لدعم الأطباء والمتدربين.",
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Professional Roles */}
          <motion.div
            {...fadeUp()}
            className="grid sm:grid-cols-[auto_1fr] gap-8 items-start"
          >
            <div className="hidden sm:block w-1 self-stretch rounded-full bg-gradient-to-b from-secondary to-secondary/10 flex-shrink-0" />
            <div>
              <h2 className="font-serif text-primary text-[22px] font-bold mb-6">
                {t(
                  "Professional Positions & Roles",
                  "المناصب والأدوار المهنية",
                )}
              </h2>
              <div className="space-y-3">
                {roles.map((role, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    className={`flex items-start gap-3 ${isRTL ? "" : ""}`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-[3px]" />
                    <span className="text-slate-600 text-[15px] leading-relaxed">
                      {role}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Publications */}
          <motion.div
            {...fadeUp()}
            className="grid sm:grid-cols-[auto_1fr] gap-8 items-start"
          >
            <div className="hidden sm:block w-1 self-stretch rounded-full bg-gradient-to-b from-secondary to-secondary/10 flex-shrink-0" />
            <div>
              <h2 className="font-serif text-primary text-[22px] font-bold mb-5">
                {t(
                  "Publications & Academic Work",
                  "الإصدارات والعمل الأكاديمي",
                )}
              </h2>
              <div className="space-y-4 text-slate-500 text-[15px] leading-[1.9] mb-7">
                <p>
                  {t(
                    'Prof. Nada is the author of the educational book series "Audiology Step by Step", now consisting of six volumes covering clinical audiology, vestibular assessment, hearing aids, cochlear implants, and more.',
                    'أ.د. ابتسام هي مؤلفة سلسلة الكتب التعليمية "Audiology Step by Step" والتي أصبحت الآن 6 أجزاء تغطي السمعيات الإكلينيكية وتقييم الاتزان والسماعات الطبية وزراعة القوقعة وغيرها.',
                  )}
                </p>
                <p>
                  {t(
                    "She serves as an Editor for the Egyptian Journal of Otorhinolaryngology, and contributes as a reviewer for several national and international journals, with numerous scientific publications to her credit.",
                    "وتعمل كمحررة بالمجلة المصرية لطب الأنف والأذن والحنجرة، وتشارك كمحكِّمة علمية لعدد من الدوريات المحلية والدولية، مع عدد كبير من المنشورات العلمية.",
                  )}
                </p>
              </div>

              {/* volume chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    n: 1,
                    color: "#00b4d8",
                    title: t("Basic Audiology", "السمعيات الأساسية"),
                  },
                  {
                    n: 2,
                    color: "#0096c7",
                    title: t("Advanced Diagnostics", "التشخيص المتقدم"),
                  },
                  {
                    n: 3,
                    color: "#0077b6",
                    title: t("Vestibular System", "الجهاز الدهليزي"),
                  },
                  {
                    n: 4,
                    color: "#48cae4",
                    title: t("Hearing Aids", "السماعات الطبية"),
                  },
                  {
                    n: 5,
                    color: "#0d3868",
                    title: t("Cochlear Implants", "زراعة القوقعة"),
                  },
                  {
                    n: 6,
                    color: "#e9c46a",
                    title: t("Board Preparation", "التحضير للبورد"),
                  },
                ].map((v) => (
                  <div
                    key={v.n}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[13px] font-medium`}
                    style={{
                      backgroundColor: `${v.color}12`,
                      borderColor: `${v.color}30`,
                      color: v.color === "#e9c46a" ? "#b5882a" : v.color,
                    }}
                  >
                    <span className="font-serif font-bold text-[11px]">
                      Vol.{v.n}
                    </span>
                    <span className="text-slate-500 font-normal">
                      {v.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Beyond Audiology */}
          <motion.div
            {...fadeUp()}
            className="grid sm:grid-cols-[auto_1fr] gap-8 items-start"
          >
            <div className="hidden sm:block w-1 self-stretch rounded-full bg-gradient-to-b from-secondary to-secondary/10 flex-shrink-0" />
            <div>
              <h2 className="font-serif text-primary text-[22px] font-bold mb-5">
                {t("Beyond Audiology", "ما وراء السمعيات")}
              </h2>
              <p className="text-slate-500 text-[15px] leading-[1.9]">
                {t(
                  "Holding diplomas in Childhood Psychiatry (2015) and Therapeutic Nutrition (2016) from the British Phoenix Academy, she believes in a holistic view of patient health — recognizing the interplay between neurological, psychological, nutritional, and sensory systems.",
                  "بحصولها على دبلومات في طب نفسية الأطفال (2015) والتغذية العلاجية (2016) من الأكاديمية البريطانية فينيكس، تتبنى رؤية شمولية لصحة المريض تُراعي تداخل العوامل العصبية والنفسية والتغذوية والحسية.",
                )}
              </p>

              {/* diploma chips */}
              <div className={`flex flex-wrap gap-2 mt-5 ${isRTL ? "" : ""}`}>
                {[
                  {
                    label: t("Childhood Psychiatry", "طب نفسية الأطفال"),
                    year: "2015",
                  },
                  {
                    label: t("Therapeutic Nutrition", "التغذية العلاجية"),
                    year: "2016",
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                  >
                    <span className="text-secondary font-bold font-serif">
                      {d.year}
                    </span>
                    <span className="text-slate-500">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── CTA ── */}
        <section
          dir={isRTL ? "rtl" : "ltr"}
          className="bg-[#f8f9fc] border-t border-slate-100"
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-14">
            <motion.div
              {...fadeUp()}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${isRTL ? "sm:flex-row-reverse" : ""}`}
            >
              <div>
                <h3 className="font-serif text-primary text-[20px] font-bold mb-1">
                  {t("Ready to start learning?", "مستعد للبدء؟")}
                </h3>
                <p className="text-slate-400 text-[14px]">
                  {t(
                    "Browse our courses and book series.",
                    "تصفح الدورات والكتب.",
                  )}
                </p>
              </div>
              <div className={`flex gap-3 flex-shrink-0 ${isRTL ? "" : ""}`}>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-3 rounded-2xl text-[14px] shadow-lg shadow-secondary/20 hover:-translate-y-0.5 transition-all"
                >
                  {t("Browse Courses", "تصفح الدورات")}
                </Link>
                <Link
                  href="#book"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-medium px-5 py-3 rounded-2xl text-[14px] transition-all"
                >
                  {t("Book Series", "سلسلة الكتب")}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
