"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  User,
  LogOut,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export const Header = () => {
  const { t, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setUser(d.data);
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setDropdownOpen(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const links = [
    { label: t("Home", "الرئيسية"), href: "/", emoji: "🏠" },
    { label: t("About", "عن الأكاديمية"), href: "/about", emoji: "👩‍⚕️" },
    { label: t("Courses", "الدورات"), href: "/courses", emoji: "🎓" },
    { label: t("Book Series", "سلسلة الكتب"), href: "#book", emoji: "📚" },
  ];

  const isAdmin = user?.role === "ADMIN";
  const initials = user?.fullName?.charAt(0).toUpperCase() ?? "";

  // ── Desktop right-side button ─────────────────────────────────────────────
  const DesktopAuthButton = () => {
    if (authLoading) {
      return (
        <div className="hidden sm:flex w-9 h-9 items-center justify-center">
          <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
        </div>
      );
    }

    if (!user) {
      return (
        <Link
          href="/auth/login"
          className="hidden sm:flex bg-secondary hover:bg-secondary/90 text-white text-[13.5px] font-semibold px-4 py-2 rounded-xl shadow-lg shadow-secondary/20 hover:-translate-y-0.5 transition-all"
        >
          {t("Login", "دخول")}
        </Link>
      );
    }

    return (
      <div className="relative hidden sm:block" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] rounded-xl px-3 py-1.5 transition-all"
        >
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-[12px]">{initials}</span>
          </div>
          <span className="text-white/80 text-[13px] font-medium max-w-[100px] truncate">
            {user.fullName.split(" ")[0]}
          </span>
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={`absolute top-full mt-2 w-52 bg-[#0d1f35] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden ${isRTL ? "left-0" : "right-0"}`}
            >
              {/* user info */}
              <div className="px-4 py-3 border-b border-white/[0.07]">
                <p className="text-white font-semibold text-[13px] truncate">
                  {user.fullName}
                </p>
                <p className="text-white/40 text-[11px] truncate mt-0.5">
                  {user.email}
                </p>
              </div>

              <div className="p-1.5 flex flex-col gap-0.5">
                {/* ADMIN → dashboard only | STUDENT → profile only */}
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.07] text-white/70 hover:text-white transition-colors text-[13px] font-medium ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                    {t("Admin Panel", "لوحة التحكم")}
                  </Link>
                ) : (
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.07] text-white/70 hover:text-white transition-colors text-[13px] font-medium ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    {t("My Profile", "ملفي الشخصي")}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors text-[13px] font-medium ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  {t("Logout", "تسجيل الخروج")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <header
        dir={isRTL ? "rtl" : "ltr"}
        className="sticky top-0 z-50 bg-primary/95 backdrop-blur-xl border-b border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-[64px]">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/30 group-hover:scale-105 transition-transform">
              <span className="font-bold text-white text-sm font-serif">S</span>
            </div>
            <span className="text-white font-semibold text-[16px] tracking-tight">
              {t("EN-AVM Academy", "سمارت أكاديمي")}
            </span>
          </Link>

          {/* desktop nav */}
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
            <DesktopAuthButton />
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
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

              {/* drawer header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                    <span className="font-bold text-white text-sm font-serif">
                      S
                    </span>
                  </div>
                  <span className="text-white font-semibold text-[15px]">
                    {t("EN-AVM Academy", "سمارت أكاديمي")}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* user strip — loading skeleton */}
              {authLoading && (
                <div
                  className={`flex items-center gap-3 px-6 py-4 border-b border-white/[0.07] ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-4 h-4 text-white/20 animate-spin" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-3 w-28 rounded-full bg-white/[0.08] animate-pulse" />
                    <div className="h-2.5 w-40 rounded-full bg-white/[0.05] animate-pulse" />
                  </div>
                </div>
              )}

              {/* user strip — logged in */}
              {!authLoading && user && (
                <div
                  className={`flex items-center gap-3 px-6 py-4 border-b border-white/[0.07] ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-[15px]">
                      {initials}
                    </span>
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className="text-white font-semibold text-[14px]">
                      {user.fullName}
                    </p>
                    <p className="text-white/40 text-[12px]">{user.email}</p>
                  </div>
                </div>
              )}

              {/* nav links */}
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

                {/* role-based link — mobile */}
                {!authLoading &&
                  user &&
                  (isAdmin ? (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <span className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg flex-shrink-0">
                        ⚙️
                      </span>
                      <span className="text-white/80 group-hover:text-white font-medium text-[15px] transition-colors">
                        {t("Admin Panel", "لوحة التحكم")}
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 text-white/25 group-hover:text-secondary transition-colors ms-auto ${isRTL ? "rotate-180" : ""}`}
                      />
                    </Link>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <span className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg flex-shrink-0">
                        👤
                      </span>
                      <span className="text-white/80 group-hover:text-white font-medium text-[15px] transition-colors">
                        {t("My Profile", "ملفي الشخصي")}
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 text-white/25 group-hover:text-secondary transition-colors ms-auto ${isRTL ? "rotate-180" : ""}`}
                      />
                    </Link>
                  ))}
              </nav>

              {/* bottom action */}
              <div className="px-4 pt-2 flex flex-col gap-2.5 border-t border-white/[0.07] mt-1">
                {authLoading ? (
                  <div className="h-[52px] rounded-2xl bg-white/[0.05] animate-pulse" />
                ) : user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[15px] font-semibold py-3.5 rounded-2xl active:scale-[0.98] transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("Logout", "تسجيل الخروج")}
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="w-full bg-secondary text-white text-[15px] font-semibold py-3.5 rounded-2xl text-center shadow-lg shadow-secondary/25 active:scale-[0.98] transition-all"
                  >
                    {t("Login", "تسجيل الدخول")}
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
