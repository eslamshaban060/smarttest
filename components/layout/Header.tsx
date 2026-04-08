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
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/app/hooks/useLanguage";

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export const Header = () => {
  const { t, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ضروري عشان next-themes مش بيعرف الثيم على السيرفر
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? theme === "dark" : true;

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

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

  // ── Theme Toggle Button ───────────────────────────────────────────────────
  const ThemeToggle = ({ mobile = false }: { mobile?: boolean }) => (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      // className={`flex items-center justify-center rounded-xl transition-all w-9 h-9 ${
      //   mobile
      //     ? "bg-primary/7 hover:bg-white/[0.14] text-primary/70 hover:text-white"
      //     : isDark
      //       ? "bg-white/[0.12] hover:bg-white/[0.12] border border-white/[0.1] text-white/70 hover:text-white"
      //       : "bg-primary hover:bg-primary/[0.14] border border-primary/[0.12] text-primary/70 hover:text-primary"
      // }`}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        isDark
          ? "bg-white/[0.08] text-white/60 hover:text-white"
          : "bg-primary/[0.08] text-primary/60 hover:text-primary"
      }`}
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18 }}
          >
            {isDark ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </button>
  );

  // ── Desktop Auth Button ───────────────────────────────────────────────────
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
          className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 transition-all ${
            isDark
              ? "bg-white/[0.07] hover:bg-white/[0.12] border-white/[0.1]"
              : "bg-primary/[0.06] hover:bg-primary/[0.1] border-primary/[0.1]"
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-[12px]">{initials}</span>
          </div>
          <span
            className={`text-[13px] font-medium max-w-[100px] truncate ${isDark ? "text-white/80" : "text-primary/80"}`}
          >
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
              className={`absolute top-full mt-2 w-52 border rounded-2xl shadow-2xl overflow-hidden ${
                isDark
                  ? "bg-card border-white/[0.08]"
                  : "bg-white border-primary/[0.1]"
              } ${isRTL ? "left-0" : "right-0"}`}
            >
              <div
                className={`px-4 py-3 border-b ${isDark ? "border-white/[0.07]" : "border-primary/[0.07]"}`}
              >
                <p
                  className={`font-semibold text-[13px] truncate ${isDark ? "text-white" : "text-primary"}`}
                >
                  {user.fullName}
                </p>
                <p
                  className={`text-[11px] truncate mt-0.5 ${isDark ? "text-white/40" : "text-primary/40"}`}
                >
                  {user.email}
                </p>
              </div>

              <div className="p-1.5 flex flex-col gap-0.5">
                {isAdmin ? (
                  <Link
                    href="/auth/admin"
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-[13px] font-medium ${
                      isDark
                        ? "hover:bg-white/[0.07] text-white/70 hover:text-white"
                        : "hover:bg-primary/[0.06] text-primary/70 hover:text-primary"
                    } ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                    {t("Admin Panel", "لوحة التحكم")}
                  </Link>
                ) : (
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-[13px] font-medium ${
                      isDark
                        ? "hover:bg-white/[0.07] text-white/70 hover:text-white"
                        : "hover:bg-primary/[0.06] text-primary/70 hover:text-primary"
                    } ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    {t("My Profile", "ملفي الشخصي")}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400/70 hover:text-red-400 transition-colors text-[13px] font-medium ${isRTL ? "flex-row-reverse" : ""}`}
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
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          isDark
            ? "bg-primary/95 border-white/[0.06]"
            : "bg-white/90 border-primary/[0.08] shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-[64px]">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/30 group-hover:scale-105 transition-transform">
              <span className="font-bold text-white text-sm font-serif">S</span>
            </div>
            <span
              className={`font-semibold text-[16px] tracking-tight ${isDark ? "text-white" : "text-primary"}`}
            >
              {t("EN-AVM Academy", "سمارت أكاديمي")}
            </span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`transition-all px-4 py-2 rounded-lg text-[14px] font-medium ${
                  isDark
                    ? "text-white/60 hover:text-white hover:bg-white/[0.08]"
                    : "text-primary/60 hover:text-primary hover:bg-primary/[0.07]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <DesktopAuthButton />
            <button
              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                isDark
                  ? "text-white/70 hover:text-white hover:bg-white/[0.08]"
                  : "text-primary/70 hover:text-primary hover:bg-primary/[0.07]"
              }`}
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
              className={`fixed bottom-0 left-0 right-0 z-[70] md:hidden rounded-t-[28px] overflow-hidden pb-8 ${
                isDark ? "bg-card" : "bg-white"
              }`}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div
                  className={`w-10 h-1 rounded-full ${isDark ? "bg-white/20" : "bg-primary/20"}`}
                />
              </div>

              {/* drawer header */}
              <div
                className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/[0.07]" : "border-primary/[0.07]"}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                    <span className="font-bold text-white text-sm font-serif">
                      S
                    </span>
                  </div>
                  <span
                    className={`font-semibold text-[15px] ${isDark ? "text-white" : "text-primary"}`}
                  >
                    {t("EN-AVM Academy", "سمارت أكاديمي")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle mobile />
                  <button
                    onClick={() => setOpen(false)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isDark
                        ? "bg-white/[0.08] text-white/60 hover:text-white"
                        : "bg-primary/[0.08] text-primary/60 hover:text-primary"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* user strip — loading */}
              {authLoading && (
                <div
                  className={`flex items-center gap-3 px-6 py-4 border-b ${isDark ? "border-white/[0.07]" : "border-primary/[0.07]"} ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? "bg-white/[0.06]" : "bg-primary/[0.06]"}`}
                  >
                    <Loader2
                      className={`w-4 h-4 animate-spin ${isDark ? "text-white/20" : "text-primary/20"}`}
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div
                      className={`h-3 w-28 rounded-full animate-pulse ${isDark ? "bg-white/[0.08]" : "bg-primary/[0.08]"}`}
                    />
                    <div
                      className={`h-2.5 w-40 rounded-full animate-pulse ${isDark ? "bg-white/[0.05]" : "bg-primary/[0.05]"}`}
                    />
                  </div>
                </div>
              )}

              {/* user strip — logged in */}
              {!authLoading && user && (
                <div
                  className={`flex items-center gap-3 px-6 py-4 border-b ${isDark ? "border-white/[0.07]" : "border-primary/[0.07]"} ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-[15px]">
                      {initials}
                    </span>
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p
                      className={`font-semibold text-[14px] ${isDark ? "text-white" : "text-primary"}`}
                    >
                      {user.fullName}
                    </p>
                    <p
                      className={`text-[12px] ${isDark ? "text-white/40" : "text-primary/40"}`}
                    >
                      {user.email}
                    </p>
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
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-colors group ${
                        isDark
                          ? "hover:bg-white/[0.06] active:bg-white/[0.1]"
                          : "hover:bg-primary/[0.05] active:bg-primary/[0.1]"
                      }`}
                    >
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${isDark ? "bg-white/[0.06]" : "bg-primary/[0.06]"}`}
                      >
                        {l.emoji}
                      </span>
                      <span
                        className={`font-medium text-[15px] transition-colors ${isDark ? "text-white/80 group-hover:text-white" : "text-primary/80 group-hover:text-primary"}`}
                      >
                        {l.label}
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 transition-colors ms-auto group-hover:text-secondary ${isDark ? "text-white/25" : "text-primary/25"} ${isRTL ? "rotate-180" : ""}`}
                      />
                    </Link>
                  </motion.div>
                ))}

                {!authLoading &&
                  user &&
                  (isAdmin ? (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-colors group ${isDark ? "hover:bg-white/[0.06]" : "hover:bg-primary/[0.05]"}`}
                    >
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${isDark ? "bg-white/[0.06]" : "bg-primary/[0.06]"}`}
                      >
                        ⚙️
                      </span>
                      <span
                        className={`font-medium text-[15px] transition-colors ${isDark ? "text-white/80 group-hover:text-white" : "text-primary/80 group-hover:text-primary"}`}
                      >
                        {t("Admin Panel", "لوحة التحكم")}
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 transition-colors ms-auto group-hover:text-secondary ${isDark ? "text-white/25" : "text-primary/25"} ${isRTL ? "rotate-180" : ""}`}
                      />
                    </Link>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-colors group ${isDark ? "hover:bg-white/[0.06]" : "hover:bg-primary/[0.05]"}`}
                    >
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${isDark ? "bg-white/[0.06]" : "bg-primary/[0.06]"}`}
                      >
                        👤
                      </span>
                      <span
                        className={`font-medium text-[15px] transition-colors ${isDark ? "text-white/80 group-hover:text-white" : "text-primary/80 group-hover:text-primary"}`}
                      >
                        {t("My Profile", "ملفي الشخصي")}
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 transition-colors ms-auto group-hover:text-secondary ${isDark ? "text-white/25" : "text-primary/25"} ${isRTL ? "rotate-180" : ""}`}
                      />
                    </Link>
                  ))}
              </nav>

              {/* bottom action */}
              <div
                className={`px-4 pt-2 flex flex-col gap-2.5 border-t mt-1 ${isDark ? "border-white/[0.07]" : "border-primary/[0.07]"}`}
              >
                {authLoading ? (
                  <div
                    className={`h-[52px] rounded-2xl animate-pulse ${isDark ? "bg-white/[0.05]" : "bg-primary/[0.05]"}`}
                  />
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
