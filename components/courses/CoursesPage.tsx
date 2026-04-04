"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  PlayCircle,
  Users,
  Clock,
  Search,
  Lock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  GraduationCap,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Course {
  id: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  language: string;
  price: number;
  videoUrls: string[];
  imageUrl: string | null;
  _count: { enrollments: number };
  enrollments: { id: string; progress: number; status: string }[];
}

function ytThumb(url: string) {
  try {
    const u = new URL(url);
    const id = u.hostname.includes("youtu.be")
      ? u.pathname.slice(1)
      : u.searchParams.get("v");
    if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  } catch {}
  return "";
}

type FilterKey = "all" | "free" | "paid" | "enrolled";

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCourses(d.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q || c.title.toLowerCase().includes(q) || (c.titleAr ?? "").includes(q);
    const enrolled = (c.enrollments?.length ?? 0) > 0;
    const matchFilter =
      filter === "all"
        ? true
        : filter === "free"
          ? c.price === 0
          : filter === "paid"
            ? c.price > 0
            : filter === "enrolled"
              ? enrolled
              : true;
    return matchSearch && matchFilter;
  });

  const totalStudents = courses.reduce((s, c) => s + c._count.enrollments, 0);
  const myCount = courses.filter(
    (c) => (c.enrollments?.length ?? 0) > 0,
  ).length;

  const filters: { key: FilterKey; en: string; ar: string }[] = [
    { key: "all", en: "All", ar: "الكل" },
    { key: "enrolled", en: "My Courses", ar: "كورساتي" },
    { key: "free", en: "Free", ar: "مجاني" },
    { key: "paid", en: "Paid", ar: "مدفوع" },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0a2540] overflow-hidden">
        {/* bg layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,180,216,0.18),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00b4d8]/30 to-transparent" />

        {/* decorative rings */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/[0.04]" />
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#00b4d8]/[0.08]" />
        <div className="absolute -left-32 -bottom-20 w-80 h-80 rounded-full border border-white/[0.03]" />

        <div className="relative max-w-6xl mx-auto px-8 pt-14 pb-12">
          {/* badge */}
          <div
            className={`inline-flex items-center gap-2 bg-[#00b4d8]/10 border border-[#00b4d8]/20 rounded-full px-4 py-1.5 mb-7 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00b4d8]" />
            <span className="text-[#00b4d8] text-[12px] font-semibold tracking-wide">
              {t(
                "Smart Academy — Medical Education",
                "سمارت أكاديمي — تعليم طبي",
              )}
            </span>
          </div>

          {/* headline */}
          <h1
            className={`text-white font-extrabold leading-[1.15] mb-5 ${isRTL ? "text-right" : ""}`}
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            {t("Expand Your", "طوّر")}
            <span className="text-[#00b4d8]">
              {" "}
              {t(" Knowledge", " معرفتك ")}
            </span>
            <br />
            <span
              className="text-white/50 font-normal"
              style={{ fontSize: "clamp(16px, 2vw, 22px)" }}
            >
              {t(
                "Courses by doctors, for doctors & medical students.",
                "كورسات من دكاتره، لدكاتره وطلاب الطب.",
              )}
            </span>
          </h1>

          {/* search */}
          <div className="relative max-w-md mb-10">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none ${isRTL ? "right-4" : "left-4"}`}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search courses...", "ابحث عن كورس...")}
              className={`w-full bg-white/[0.08] border border-white/[0.12] hover:border-white/20 rounded-2xl py-3.5 text-white text-[14px] placeholder:text-white/30 outline-none focus:border-[#00b4d8]/60 focus:bg-white/[0.12] transition-all ${isRTL ? "pr-11 pl-5 text-right" : "pl-11 pr-5"}`}
            />
          </div>

          {/* stats row */}
          <div
            className={`flex items-center gap-8 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {[
              {
                Icon: BookOpen,
                val: courses.length,
                en: "Courses",
                ar: "كورس",
              },
              { Icon: Users, val: totalStudents, en: "Students", ar: "طالب" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#00b4d8]/15 flex items-center justify-center">
                  <s.Icon className="w-4 h-4 text-[#00b4d8]" />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <span className="text-white font-bold text-[20px] leading-none">
                    {s.val}
                  </span>
                  <span className="text-white/40 text-[12px] ms-1.5">
                    {t(s.en, s.ar)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FILTER BAR ══════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-20">
        <div
          className={`max-w-6xl mx-auto px-8 h-14 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                filter === f.key
                  ? "bg-[#0a2540] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              {t(f.en, f.ar)}
            </button>
          ))}
          <span
            className={`text-slate-300 text-[13px] font-medium ${isRTL ? "me-auto" : "ms-auto"}`}
          >
            {filtered.length} {t("courses", "كورس")}
          </span>
        </div>
      </div>

      {/* ══ GRID ════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center py-32 gap-4">
            <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
            <p className="text-slate-400 text-[14px]">
              {t("Loading...", "جاري التحميل...")}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-600 font-bold text-[18px] mb-2">
              {search
                ? t("No results found", "لا توجد نتائج")
                : t("No courses yet", "لا توجد كورسات بعد")}
            </p>
            <p className="text-slate-400 text-[14px]">
              {search
                ? t("Try a different search term", "جرّب كلمة بحث مختلفة")
                : t("Check back soon!", "تابعنا قريباً!")}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                isRTL={isRTL}
                t={t}
                onClick={() => router.push(`/dashboard/courses/${c.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({
  course: c,
  isRTL,
  t,
  onClick,
}: {
  course: Course;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onClick: () => void;
}) {
  const enrolled = (c.enrollments?.length ?? 0) > 0;
  const progress = c.enrollments?.[0]?.progress ?? 0;
  const completed = c.enrollments?.[0]?.status === "COMPLETED";
  const cover =
    c.imageUrl || (c.videoUrls?.[0] ? ytThumb(c.videoUrls[0]) : null);
  const title = isRTL && c.titleAr ? c.titleAr : c.title;
  const desc = isRTL ? c.descriptionAr : c.description;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* cover */}
      <div className="relative h-48 bg-gradient-to-br from-[#0a2540] to-[#0d3a6e] overflow-hidden flex-shrink-0">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,180,216,0.2),transparent)]" />
            <BookOpen className="w-14 h-14 text-white/10 relative" />
          </div>
        )}
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* top badges */}
        <div
          className={`absolute top-3 flex gap-2 ${isRTL ? "right-3" : "left-3"}`}
        >
          {c.price === 0 ? (
            <span className="text-[11px] px-3 py-1 rounded-full font-bold bg-[#00b4d8] text-white">
              {t("Free", "مجاني")}
            </span>
          ) : (
            <span className="text-[11px] px-3 py-1 rounded-full font-bold bg-[#e9c46a] text-[#0a2540]">
              {c.price} EGP
            </span>
          )}
          {completed && (
            <span className="text-[11px] px-2.5 py-1 rounded-full font-bold bg-emerald-500 text-white flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {t("Done", "مكتمل")}
            </span>
          )}
        </div>

        {/* bottom info */}
        <div
          className={`absolute bottom-3 flex items-center gap-3 ${isRTL ? "right-3" : "left-3"}`}
        >
          <span className="flex items-center gap-1 text-white/70 text-[12px] font-medium">
            <PlayCircle className="w-3.5 h-3.5" />
            {c.videoUrls?.length ?? 0} {t("lessons", "درس")}
          </span>
          {enrolled && !completed && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/15 text-white border border-white/20 font-medium backdrop-blur-sm">
              {t("In Progress", "جاري")}
            </span>
          )}
        </div>
      </div>

      {/* body */}
      <div className="p-5 flex flex-col gap-4">
        {/* title + desc */}
        <div className={isRTL ? "text-right" : ""}>
          <h3 className="text-[#0a2540] font-bold text-[15px] leading-snug line-clamp-2 mb-1.5">
            {title}
          </h3>
          {desc && (
            <p className="text-slate-400 text-[13px] line-clamp-2 leading-relaxed">
              {desc}
            </p>
          )}
        </div>

        {/* meta */}
        <div
          className={`flex items-center gap-3 text-slate-400 text-[12px] ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <span
            className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Users className="w-3.5 h-3.5" />
            {c._count.enrollments}
          </span>
          <span className="text-slate-200">·</span>
          <span
            className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Clock className="w-3.5 h-3.5" />
            {c.videoUrls?.length ?? 0} {t("videos", "فيديو")}
          </span>
          <span className="text-slate-200">·</span>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 font-semibold">
            {c.language}
          </span>
        </div>

        {/* progress bar */}
        {enrolled && (
          <div className="space-y-1.5">
            <div
              className={`flex items-center justify-between text-[11px] font-semibold ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className="text-slate-400">{t("Progress", "التقدم")}</span>
              <span
                className={
                  progress === 100 ? "text-emerald-500" : "text-[#00b4d8]"
                }
              >
                {progress}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${progress === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-[#00b4d8] to-[#0096b4]"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA button */}
        <button
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[14px] font-bold transition-all mt-auto ${isRTL ? "flex-row-reverse" : ""} ${
            completed
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
              : enrolled
                ? "bg-[#0a2540] text-white hover:bg-[#0d3060] shadow-md shadow-[#0a2540]/15"
                : c.price === 0
                  ? "bg-[#00b4d8] text-white hover:bg-[#0096b4] shadow-md shadow-[#00b4d8]/20"
                  : "bg-[#0a2540] text-white hover:bg-[#0d3060] shadow-md shadow-[#0a2540]/15"
          }`}
        >
          {completed ? (
            <>
              <GraduationCap className="w-4 h-4" />
              {t("View Certificate", "عرض الشهادة")}
            </>
          ) : enrolled ? (
            <>
              {t("Continue", "متابعة")}
              {isRTL ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </>
          ) : c.price === 0 ? (
            <>
              <PlayCircle className="w-4 h-4" />
              {t("Enroll Free", "سجّل مجاناً")}
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              {t("Enroll Now", "سجّل الآن")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
