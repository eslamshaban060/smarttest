"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";

export const Header = () => {
  const { lang, setLang, t, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    { label: t("Home", "الرئيسية"), href: "/", emoji: "🏠" },
    { label: t("About", "عن الأكاديمية"), href: "/about", emoji: "👩‍⚕️" },
    { label: t("Courses", "الدورات"), href: "/courses", emoji: "🎓" },
    { label: t("Book Series", "سلسلة الكتب"), href: "#book", emoji: "📚" },
  ];

  return (
    <>
      <header
        dir={isRTL ? "rtl" : "ltr"}
        className="sticky top-0 z-50 bg-primary/95 backdrop-blur-xl border-b border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-[64px]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/30 group-hover:scale-105 transition-transform">
              <span className="font-bold text-white text-sm font-serif">S</span>
            </div>
            <span className="text-white font-semibold text-[16px] tracking-tight">
              {t("Smart Academy", "سمارت أكاديمي")}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/60 hover:text-white hover:bg-white/[0.08] transition-all px-4 py-2 rounded-lg text-[14px] font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="hidden sm:flex items-center gap-1.5 text-white/55 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.09] rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "en" ? "ع" : "EN"}
            </button>
            <Link
              href="/auth/login"
              className="hidden sm:flex bg-secondary hover:bg-secondary/90 text-white text-[13.5px] font-semibold px-4 py-2 rounded-xl shadow-lg shadow-secondary/20 hover:-translate-y-0.5 transition-all"
            >
              {t("Login", "دخول")}
            </Link>
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              dir={isRTL ? "rtl" : "ltr"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] md:hidden bg-[#0d1f35] rounded-t-[28px] overflow-hidden pb-8"
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                    <span className="font-bold text-white text-sm font-serif">
                      S
                    </span>
                  </div>
                  <span className="text-white font-semibold text-[15px]">
                    {t("Smart Academy", "سمارت أكاديمي")}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="px-4 py-3 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-white/[0.06] active:bg-white/[0.1] transition-colors group"
                    >
                      <span className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg flex-shrink-0">
                        {l.emoji}
                      </span>
                      <span className="text-white/80 group-hover:text-white font-medium text-[15px] transition-colors">
                        {l.label}
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 text-white/25 group-hover:text-secondary transition-colors ms-auto ${isRTL ? "rotate-180" : ""}`}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="px-4 pt-2 flex flex-col gap-2.5 border-t border-white/[0.07] mt-1">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full bg-secondary text-white text-[15px] font-semibold py-3.5 rounded-2xl text-center shadow-lg shadow-secondary/25 active:scale-[0.98] transition-all"
                >
                  {t("Login", "تسجيل الدخول")}
                </Link>
                <button
                  onClick={() => {
                    setLang(lang === "en" ? "ar" : "en");
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white text-[14px] font-medium py-3 rounded-2xl transition-all cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  {lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
