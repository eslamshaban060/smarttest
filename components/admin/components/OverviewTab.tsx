"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, TrendingUp, DollarSign, Wallet } from "lucide-react";
import { Spin } from "./ui";
import type { StatsData } from "./types";

export function OverviewTab({
  t,
  isRTL,
}: {
  t: (en: string, ar: string) => string;
  isRTL: boolean;
}) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spin />;
  if (!stats)
    return (
      <p className="text-center text-slate-400 py-20">
        {t("Failed to load", "فشل التحميل")}
      </p>
    );

  const statCards = [
    {
      Icon: Users,
      val: stats.totalUsers,
      en: "Total Users",
      ar: "إجمالي المستخدمين",
      color: "#00b4d8",
    },
    {
      Icon: BookOpen,
      val: stats.totalCourses,
      en: "Total Courses",
      ar: "إجمالي الكورسات",
      color: "#0096b4",
    },
    {
      Icon: TrendingUp,
      val: stats.totalEnrollments,
      en: "Total Enrollments",
      ar: "إجمالي التسجيلات",
      color: "#10b981",
    },
    {
      Icon: DollarSign,
      val: `${stats.totalRevenue.toFixed(0)} EGP`,
      en: "Total Revenue",
      ar: "إجمالي الإيرادات",
      color: "#e9c46a",
    },
  ];

  return (
    <div className="space-y-8">
      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
              style={{ backgroundColor: `${s.color}18` }}
            >
              <s.Icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div className="font-serif text-[#0a2540] font-bold text-[30px] leading-none mb-2">
              {s.val}
            </div>
            <div className="text-slate-400 text-[13px]">{t(s.en, s.ar)}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* recent users */}
        <div className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm">
          <h2
            className={`text-[#0a2540] font-bold text-[15px] mb-6 ${isRTL ? "text-right" : ""}`}
          >
            {t("Recent Users", "أحدث المستخدمين")}
          </h2>
          <div className="space-y-4">
            {stats.recentUsers.map((u) => (
              <div
                key={u.id}
                className={`flex items-center gap-3 ${isRTL ? "" : ""}`}
              >
                <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#00b4d8] font-bold text-[12px]">
                    {u.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                  <p className="text-slate-700 text-[13px] font-semibold truncate">
                    {u.fullName}
                  </p>
                  <p className="text-slate-400 text-[11px] truncate">
                    {u.email}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold border flex-shrink-0 ${
                    u.role === "ADMIN"
                      ? "bg-purple-50 text-purple-600 border-purple-100"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {u.role === "ADMIN"
                    ? t("Admin", "أدمن")
                    : t("Student", "طالب")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* recent transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm">
          <h2
            className={`text-[#0a2540] font-bold text-[15px] mb-6 ${isRTL ? "text-right" : ""}`}
          >
            {t("Recent Transactions", "أحدث المعاملات")}
          </h2>
          <div className="space-y-4">
            {stats.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between gap-3 ${isRTL ? "" : ""}`}
              >
                <div
                  className={`flex items-center gap-3 min-w-0 ${isRTL ? "" : ""}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === "CREDIT" ? "bg-emerald-50" : "bg-red-50"}`}
                  >
                    <Wallet
                      className={`w-4 h-4 ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400"}`}
                    />
                  </div>
                  <div className={`min-w-0 ${isRTL ? "text-right" : ""}`}>
                    <p className="text-slate-700 text-[13px] font-semibold truncate">
                      {tx.user.fullName}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString(
                        isRTL ? "ar-EG" : "en-US",
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold text-[14px] flex-shrink-0 ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400"}`}
                >
                  {tx.type === "CREDIT" ? "+" : "-"}
                  {tx.amount} EGP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
