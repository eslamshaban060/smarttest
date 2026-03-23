"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, BookOpen } from "lucide-react";
import { Spin } from "./ui";
import { CourseCard } from "./CourseCard";
import { CourseForm } from "./CourseForm";
import type { Course, CourseView } from "./types";

// ── CoursesSection ────────────────────────────────────────────────────────────
export function CoursesSection({
  t,
  isRTL,
  showToast,
}: {
  t: (en: string, ar: string) => string;
  isRTL: boolean;
  showToast: (type: "success" | "error", text: string) => void;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<CourseView>("list");
  const [editTarget, setEditTarget] = useState<Course | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/courses");
    const d = await r.json();
    if (d.success) setCourses(d.data);
    else
      showToast(
        "error",
        d.error ?? t("Failed to load courses", "فشل تحميل الكورسات"),
      );
    setLoading(false);
  }, []); // eslint-disable-line

  useEffect(() => {
    load();
  }, [load]);

  async function togglePublish(c: Course) {
    const r = await fetch(`/api/admin/courses/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !c.published }),
    });
    if (r.ok) {
      showToast(
        "success",
        c.published
          ? t("Unpublished", "تم إلغاء النشر")
          : t("Published", "تم النشر"),
      );
      load();
    } else showToast("error", t("Failed", "فشلت العملية"));
  }

  async function deleteCourse(c: Course) {
    if (!confirm(t(`Delete "${c.title}"?`, `حذف "${c.titleAr ?? c.title}"؟`)))
      return;
    const r = await fetch(`/api/admin/courses/${c.id}`, { method: "DELETE" });
    if (r.ok) {
      showToast("success", t("Course deleted", "تم حذف الكورس"));
      load();
    } else showToast("error", t("Failed", "فشلت العملية"));
  }

  // ── form view ──
  if (view !== "list") {
    return (
      <CourseForm
        t={t}
        isRTL={isRTL}
        course={view === "edit" ? (editTarget ?? undefined) : undefined}
        onBack={() => {
          setView("list");
          setEditTarget(null);
        }}
        onSuccess={(msg) => {
          showToast("success", msg);
          setView("list");
          setEditTarget(null);
          load();
        }}
        onError={(e) => showToast("error", e)}
      />
    );
  }

  // ── list view ──
  return (
    <div className="space-y-7">
      {/* header */}
      <div className={`flex items-end justify-between ${isRTL ? "" : ""}`}>
        <div className={isRTL ? "text-right" : ""}>
          <h2 className="text-[#0a2540] font-bold text-[24px] tracking-tight">
            {t("Courses", "الكورسات")}
          </h2>
          <p className="text-slate-400 text-[13px] mt-1">
            {courses.length} {t("courses total", "كورس إجمالاً")}
          </p>
        </div>
        <button
          onClick={() => setView("add")}
          className={`flex items-center gap-2.5 bg-[#0a2540] hover:bg-[#0d3060] text-white font-bold px-6 py-3.5 rounded-xl text-[14px] shadow-lg shadow-[#0a2540]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 ${isRTL ? "" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {t("Add Course", "إضافة كورس")}
        </button>
      </div>

      {/* content */}
      {loading ? (
        <Spin />
      ) : courses.length === 0 ? (
        /* empty state */
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-28 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00b4d8]/10 to-[#0a2540]/10 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <BookOpen className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-500 font-bold text-[16px] mb-2">
            {t("No courses yet", "لا توجد كورسات بعد")}
          </p>
          <p className="text-slate-400 text-[13px] mb-6">
            {t("Add your first course to get started", "أضف أول كورس للبدء")}
          </p>
          <button
            onClick={() => setView("add")}
            className="inline-flex items-center gap-2 bg-[#0a2540] text-white font-bold px-6 py-3 rounded-xl text-[14px] hover:bg-[#0d3060] transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            {t("Add your first course", "أضف أول كورس")}
          </button>
        </div>
      ) : (
        /* grid */
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              isRTL={isRTL}
              t={t}
              onTogglePublish={() => togglePublish(c)}
              onEdit={() => {
                setEditTarget(c);
                setView("edit");
              }}
              onDelete={() => deleteCourse(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
