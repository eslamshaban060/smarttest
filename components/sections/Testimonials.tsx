"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { fadeUpView } from "@/lib/animations";

export const Testimonials = () => {
  const { t, isRTL } = useLanguage();
  const [active, setActive] = useState(0);

  const items = [
    {
      name: t("Dr. Ahmed Youssef", "د. أحمد يوسف"),
      role: t("Resident, Cairo University", "طبيب مقيم، جامعة القاهرة"),
      initial: "أ",
      text: t(
        "Prof. Nada's courses completely transformed my clinical understanding of vestibular disorders. The case-based approach is unmatched.",
        "دورات أ.د. ابتسام غيّرت فهمي الإكلينيكي لاضطرابات الاتزان تمامًا. الأسلوب القائم على الحالات لا مثيل له.",
      ),
    },
    {
      name: t("Dr. Sara El-Masry", "د. سارة المصري"),
      role: t("Audiologist, Alexandria", "أخصائية سمعيات، الإسكندرية"),
      initial: "س",
      text: t(
        "The book series is my daily reference. Six volumes that cover everything I need from diagnostic testing to hearing aid fitting.",
        "سلسلة الكتب هي مرجعي اليومي. ستة أجزاء تغطي كل ما أحتاجه من الاختبارات التشخيصية إلى تركيب السماعات.",
      ),
    },
    {
      name: t("Dr. Omar Hassan", "د. عمر حسن"),
      role: t("ENT Specialist, Zagazig", "متخصص أنف وأذن وحنجرة، الزقازيق"),
      initial: "ع",
      text: t(
        "Preparing for the Board exam with Smart Academy made the process structured and far less stressful. Highly recommended.",
        "التحضير للبورد مع سمارت أكاديمي جعل العملية منهجية وأقل إجهادًا بكثير. أنصح به بشدة.",
      ),
    },
  ];

  const prev = () =>
    setActive((a: number) => (a - 1 + items.length) % items.length);
  const next = () => setActive((a: number) => (a + 1) % items.length);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="py-24 bg-white relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-secondary/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <motion.div {...fadeUpView()} className="text-center mb-14">
          <span className="text-secondary text-[12px] font-bold tracking-[0.2em] uppercase block mb-3">
            {t("Testimonials", "آراء الطلاب")}
          </span>
          <h2 className="font-serif text-primary text-[clamp(28px,4vw,46px)] font-bold">
            {t("What Our Students Say", "ماذا يقول طلابنا")}
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-slate-50 border border-slate-100 rounded-3xl p-8 sm:p-10 relative"
            >
              <Quote className="w-8 h-8 text-secondary/30 mb-5" />
              <p className="text-slate-700 text-[16.5px] leading-[1.85] mb-8 font-medium">
                &ldquo;{items[active].text}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-serif font-bold text-lg flex-shrink-0">
                  {items[active].initial}
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-[15px]">
                    {items[active].name}
                  </div>
                  <div className="text-slate-500 text-[13px]">
                    {items[active].role}
                  </div>
                </div>
                <div className="flex gap-0.5 ms-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-3 mt-7">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full border border-slate-200 hover:border-secondary hover:text-secondary flex items-center justify-center text-slate-400 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all cursor-pointer ${i === active ? "w-6 h-2.5 bg-secondary" : "w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300"}`}
              />
            ))}
            <button
              onClick={next}
              className="w-9 h-9 rounded-full border border-slate-200 hover:border-secondary hover:text-secondary flex items-center justify-center text-slate-400 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
