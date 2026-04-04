"use client";

import { useState } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { useRouter } from "next/navigation";
import { BarChart2, Users, BookOpen, ShieldCheck, LogOut } from "lucide-react";

import { Toast } from "./components/ui";
import { OverviewTab } from "./components/OverviewTab";
import { UsersTab } from "./components/UsersTab";
import { CoursesSection } from "./components/CoursesSection";
import type { Tab, ToastMsg } from "./components/types";

export function AdminDashboard({ currentUserId }: { currentUserId: string }) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [toast, setToast] = useState<ToastMsg>(null);
  const showToast = (type: "success" | "error", text: string) =>
    setToast({ type, text });

  const tabs = [
    { key: "overview" as Tab, en: "Overview", ar: "الرئيسية", Icon: BarChart2 },
    { key: "users" as Tab, en: "Users", ar: "المستخدمون", Icon: Users },
    { key: "courses" as Tab, en: "Courses", ar: "الكورسات", Icon: BookOpen },
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
      <Toast msg={toast} onClose={() => setToast(null)} />

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="bg-[#0a2540] sticky  z-40 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,180,216,0.15),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 relative">
          {/* top bar */}
          <div
            className={`flex items-center justify-between h-[72px] border-b border-white/[0.07] ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00b4d8]/30 to-[#00b4d8]/10 border border-[#00b4d8]/40 flex items-center justify-center shadow-lg shadow-[#00b4d8]/10">
                <ShieldCheck className="w-5 h-5 text-[#00b4d8]" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <p className="text-white font-bold text-[16px] leading-tight tracking-tight">
                  EN-AVM Academy
                </p>
                <p className="text-[#00b4d8]/50 text-[10px] uppercase tracking-[0.2em] mt-0.5">
                  {t("Admin Panel", "لوحة التحكم")}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className={`flex items-center gap-2 text-white/40 hover:text-white/90 text-[13px] font-medium px-4 py-2.5 rounded-xl hover:bg-white/[0.07] border border-transparent hover:border-white/10 transition-all ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">{t("Logout", "خروج")}</span>
            </button>
          </div>
          {/* nav tabs */}
          <div className={`flex items-center gap-1 py-8 ${isRTL ? "" : ""}`}>
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setActiveTab(tb.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${isRTL ? "" : ""} ${
                  activeTab === tb.key
                    ? "bg-white/[0.12] text-white shadow-inner border border-white/[0.1]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
                }`}
              >
                <tb.Icon className="w-4 h-4" />
                {t(tb.en, tb.ar)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl w-full mx-auto px-12 py-20">
        {activeTab === "overview" && <OverviewTab t={t} isRTL={isRTL} />}
        {activeTab === "users" && (
          <UsersTab
            t={t}
            isRTL={isRTL}
            currentUserId={currentUserId}
            showToast={showToast}
          />
        )}
        {activeTab === "courses" && (
          <CoursesSection t={t} isRTL={isRTL} showToast={showToast} />
        )}
      </main>
    </div>
  );
}
