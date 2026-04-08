"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Lock,
  Loader2,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  PlayCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface VideoProgress {
  videoIndex: number;
  watched: boolean;
}
interface Enrollment {
  id: string;
  progress: number;
  status: string;
  videoProgress: VideoProgress[];
  certificate: { id: string; issuedAt: string } | null;
}
interface Course {
  id: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  videoUrls: string[];
  price: number;
  language: string;
  imageUrl: string | null;
  _count: { enrollments: number };
  enrollments: Enrollment[];
}

function toEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be"))
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?rel=0&modestbranding=1`;
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`;
  } catch {}
  return url;
}

// ─── Course Watch Page ────────────────────────────────────────────────────────
export default function CourseWatchPage({ courseId }: { courseId: string }) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [markingDone, setMarkingDone] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await fetch(`/api/courses/${courseId}`);
    const d = await r.json();
    if (d.success) setCourse(d.data);
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    let cancelled = false;

    async function fetchCourse() {
      const r = await fetch(`/api/courses/${courseId}`);
      const d = await r.json();
      if (!cancelled) {
        if (d.success) setCourse(d.data);
        setLoading(false);
      }
    }

    fetchCourse();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (loading)
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <p className="text-slate-500">
          {t("Course not found", "الكورس غير موجود")}
        </p>
      </div>
    );

  const enrollment = course.enrollments?.[0] ?? null;
  const enrolled = !!enrollment;
  const completed = enrollment?.status === "COMPLETED";
  const progress = enrollment?.progress ?? 0;
  const cert = enrollment?.certificate;
  const title = isRTL && course.titleAr ? course.titleAr : course.title;
  const desc = isRTL ? course.descriptionAr : course.description;
  const totalVideos = course.videoUrls.length;

  const isWatched = (i: number) =>
    enrollment?.videoProgress?.some((v) => v.videoIndex === i && v.watched) ??
    false;

  // ── Enroll ──────────────────────────────────────────────────────────────────
  async function enroll() {
    setEnrolling(true);
    setError(null);
    const r = await fetch(`/api/courses/${courseId}/enroll`, {
      method: "POST",
    });
    const d = await r.json();
    setEnrolling(false);
    if (r.ok) {
      load();
    } else if (d.error === "insufficient_balance") {
      setError(
        t(
          `Insufficient balance. You need ${d.required} EGP but have ${d.available} EGP.`,
          `رصيد غير كافٍ. تحتاج ${d.required} جنيه ولديك ${d.available} جنيه.`,
        ),
      );
    } else setError(d.error);
  }

  // ── Mark video watched ──────────────────────────────────────────────────────
  async function markWatched(idx: number) {
    if (!enrolled || isWatched(idx)) return;
    setMarkingDone(true);
    const r = await fetch(`/api/courses/${courseId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoIndex: idx }),
    });
    const d = await r.json();
    setMarkingDone(false);
    if (r.ok) {
      await load();
      if (d.completed) {
        setShowCert(true);
      }
    }
  }

  const currentWatched = isWatched(activeIdx);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0d1b2e] flex flex-col"
    >
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="bg-primary border-b border-white/[0.07] px-6 py-4 flex items-center justify-between flex-shrink-0 z-30">
        <div
          className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={() => router.push("/dashboard/courses")}
            className="w-9 h-9 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white/60 hover:text-white flex items-center justify-center transition-all"
          >
            {isRTL ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
          </button>
          <div className={isRTL ? "text-right" : ""}>
            <p className="text-white font-bold text-[15px] leading-tight line-clamp-1">
              {title}
            </p>
            <p className="text-white/40 text-[12px] mt-0.5">
              {t(
                `Lesson ${activeIdx + 1} of ${totalVideos}`,
                `الدرس ${activeIdx + 1} من ${totalVideos}`,
              )}
            </p>
          </div>
        </div>

        {/* progress pill */}
        {enrolled && (
          <div
            className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${progress === 100 ? "bg-emerald-400" : "bg-secondary"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span
                className={`text-[12px] font-bold ${progress === 100 ? "text-emerald-400" : "text-[#00b4d8]"}`}
              >
                {progress}%
              </span>
            </div>
            {cert && (
              <button
                onClick={() => setShowCert(true)}
                className="flex items-center gap-1.5 bg-[#e9c46a]/20 text-[#e9c46a] border border-[#e9c46a]/30 px-3.5 py-2 rounded-xl text-[12px] font-bold hover:bg-[#e9c46a]/30 transition-all"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                {t("Certificate", "الشهادة")}
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div
        className={`flex flex-1 overflow-hidden ${isRTL ? "flex-row-reverse" : ""}`}
      >
        {/* ── Video area ──────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* video player */}
          <div className="w-full bg-black aspect-video relative">
            {enrolled ? (
              <iframe
                key={activeIdx}
                src={toEmbed(course.videoUrls[activeIdx])}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              /* not enrolled overlay */
              <div className="w-full h-full flex flex-col items-center justify-center bg-primary gap-6 p-8">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Lock className="w-9 h-9 text-white/30" />
                </div>
                <div className="text-center max-w-sm">
                  <p className="text-white font-bold text-[20px] mb-2">
                    {t("Enroll to Watch", "سجّل لمشاهدة الكورس")}
                  </p>
                  <p className="text-white/40 text-[14px] leading-relaxed">
                    {course.price === 0
                      ? t(
                          "This course is free. Enroll now to start learning.",
                          "الكورس مجاني. سجّل الآن للبدء.",
                        )
                      : t(
                          `Enroll for ${course.price} EGP to access all lessons.`,
                          `سجّل مقابل ${course.price} جنيه للوصول لكل الدروس.`,
                        )}
                  </p>
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-2xl text-[13px] text-center max-w-sm">
                    {error}
                    {error.includes("balance") || error.includes("رصيد") ? (
                      <button
                        onClick={() => router.push("/dashboard/profile")}
                        className="block mt-2 text-[#00b4d8] underline font-semibold"
                      >
                        {t("Recharge balance →", "إعادة شحن الرصيد ←")}
                      </button>
                    ) : null}
                  </div>
                )}
                <button
                  onClick={enroll}
                  disabled={enrolling}
                  className="flex items-center gap-2 bg-secondary hover:bg-[#0096b4] text-white font-bold px-8 py-4 rounded-2xl text-[15px] transition-all shadow-2xl shadow-[#00b4d8]/30 hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {enrolling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <PlayCircle className="w-4 h-4" />
                  )}
                  {course.price === 0
                    ? t("Enroll Free", "سجّل مجاناً")
                    : t(
                        `Enroll for ${course.price} EGP`,
                        `سجّل مقابل ${course.price} جنيه`,
                      )}
                </button>
              </div>
            )}
          </div>

          {/* below video */}
          <div className="p-6 space-y-6 max-w-3xl">
            {/* lesson title + mark done */}
            <div
              className={`flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className={isRTL ? "text-right" : ""}>
                <div className="text-[#00b4d8] text-[12px] font-bold mb-1 uppercase tracking-wide">
                  {t(`Lesson ${activeIdx + 1}`, `الدرس ${activeIdx + 1}`)}
                </div>
                <h2 className="text-white font-bold text-[20px] leading-snug">
                  {title}
                </h2>
              </div>
              {enrolled && (
                <button
                  onClick={() => markWatched(activeIdx)}
                  disabled={currentWatched || markingDone}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold border transition-all flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""} ${
                    currentWatched
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-default"
                      : "bg-white/10 text-white/70 border-white/20 hover:bg-secondary/20 hover:text-[#00b4d8] hover:border-[#00b4d8]/40"
                  }`}
                >
                  {markingDone ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : currentWatched ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                  {currentWatched
                    ? t("Watched ✓", "تمت المشاهدة ✓")
                    : t("Mark as done", "تمييز كمشاهَد")}
                </button>
              )}
            </div>

            {/* description */}
            {desc && (
              <p
                className={`text-white/50 text-[14px] leading-relaxed ${isRTL ? "text-right" : ""}`}
              >
                {desc}
              </p>
            )}

            {/* nav buttons */}
            {enrolled && (
              <div
                className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <button
                  onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                  disabled={activeIdx === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/60 hover:text-white disabled:opacity-30 text-[13px] font-semibold transition-all"
                >
                  {isRTL ? (
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  ) : (
                    <ArrowLeft className="w-4 h-4" />
                  )}
                  {t("Previous", "السابق")}
                </button>
                <button
                  onClick={() =>
                    setActiveIdx((i) => Math.min(totalVideos - 1, i + 1))
                  }
                  disabled={activeIdx === totalVideos - 1}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-[#0096b4] text-white disabled:opacity-30 text-[13px] font-bold transition-all shadow-lg shadow-[#00b4d8]/20"
                >
                  {t("Next", "التالي")}
                  {isRTL ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <div
          className={`w-80 bg-primary border-${isRTL ? "l" : "r"} border-white/[0.07] flex flex-col flex-shrink-0 overflow-hidden`}
        >
          {/* sidebar header */}
          <div className="p-5 border-b border-white/[0.07] flex-shrink-0">
            <div
              className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <h3 className="text-white font-bold text-[14px]">
                {t("Course Content", "محتوى الكورس")}
              </h3>
              <span className="text-white/30 text-[12px]">
                {totalVideos} {t("lessons", "درس")}
              </span>
            </div>

            {/* overall progress */}
            {enrolled && (
              <div className="bg-white/[0.05] rounded-2xl p-4 space-y-2">
                <div
                  className={`flex items-center justify-between text-[12px] ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className="text-white/40">
                    {t("Your progress", "تقدمك")}
                  </span>
                  <span
                    className={`font-bold ${progress === 100 ? "text-emerald-400" : "text-[#00b4d8]"}`}
                  >
                    {progress}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${progress === 100 ? "bg-emerald-400" : "bg-gradient-to-r from-[#00b4d8] to-[#0096b4]"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div
                  className={`flex items-center gap-2 text-[11px] text-white/30 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {enrollment?.videoProgress?.filter((v) => v.watched).length ??
                    0}{" "}
                  / {totalVideos} {t("watched", "مشاهَد")}
                </div>
              </div>
            )}
          </div>

          {/* lesson list */}
          <div className="flex-1 overflow-y-auto py-2">
            {course.videoUrls.map((_, i) => {
              const watched = isWatched(i);
              const isActive = i === activeIdx;

              return (
                <button
                  key={i}
                  onClick={() => enrolled && setActiveIdx(i)}
                  disabled={!enrolled}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-${isRTL ? "right" : "left"} transition-all group ${isRTL ? "flex-row-reverse" : ""} ${
                    isActive
                      ? "bg-secondary/15 border-r-2 border-[#00b4d8]"
                      : "hover:bg-white/[0.04]"
                  } ${!enrolled ? "cursor-default" : "cursor-pointer"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      watched
                        ? "bg-emerald-500/20"
                        : isActive
                          ? "bg-secondary/20"
                          : "bg-white/[0.06]"
                    }`}
                  >
                    {watched ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : enrolled ? (
                      <PlayCircle
                        className={`w-4 h-4 ${isActive ? "text-[#00b4d8]" : "text-white/30"}`}
                      />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-white/20" />
                    )}
                  </div>

                  <div
                    className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}
                  >
                    <p
                      className={`text-[13px] font-semibold truncate ${isActive ? "text-white" : watched ? "text-white/50" : "text-white/60"}`}
                    >
                      {t(`Lesson ${i + 1}`, `الدرس ${i + 1}`)}
                    </p>
                  </div>

                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Certificate Modal ────────────────────────────────────────── */}
      {showCert && cert && course && (
        <CertificateModal
          course={course}
          issuedAt={cert.issuedAt}
          isRTL={isRTL}
          t={t}
          onClose={() => setShowCert(false)}
        />
      )}

      {/* Auto show cert on completion */}
      {showCert && !cert && completed && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowCert(false)}
        >
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm">
            <Sparkles className="w-12 h-12 text-[#e9c46a] mx-auto mb-4" />
            <p className="text-[#0a2540] font-bold text-[20px]">
              {t("Congratulations!", "مبروك!")}
            </p>
            <p className="text-slate-500 mt-2">
              {t("You completed the course!", "أتممت الكورس بنجاح!")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Certificate Modal ────────────────────────────────────────────────────────
function CertificateModal({
  course,
  issuedAt,
  isRTL,
  t,
  onClose,
}: {
  course: Course;
  issuedAt: string;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onClose: () => void;
}) {
  const title = isRTL && course.titleAr ? course.titleAr : course.title;
  const dateStr = new Date(issuedAt).toLocaleDateString(
    isRTL ? "ar-EG" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  function printCert() {
    const el = document.getElementById("certificate-print");
    if (!el) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>Certificate</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cairo:wght@400;600;700&display=swap');
        body { margin: 0; padding: 0; background: white; }
        * { box-sizing: border-box; }
      </style>
      </head><body>${el.outerHTML}</body></html>
    `);
    w.document.close();
    setTimeout(() => {
      w.print();
    }, 500);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        {/* Certificate design */}
        <div
          id="certificate-print"
          dir="ltr"
          className="relative bg-white overflow-hidden shadow-2xl"
          style={{
            fontFamily: "'Playfair Display', serif",
            aspectRatio: "1.414",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #0a2540 0%, #0d3a6e 50%, #0a2540 100%)",
            }}
          />
          <div className="absolute inset-3 border-2 border-[#e9c46a]/60 rounded-sm pointer-events-none" />
          <div className="absolute inset-5 border border-[#e9c46a]/30 rounded-sm pointer-events-none" />

          {[
            "top-4 left-4",
            "top-4 right-4",
            "bottom-4 left-4",
            "bottom-4 right-4",
          ].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-12 h-12 flex items-center justify-center`}
            >
              <div className="w-8 h-8 border-2 border-[#e9c46a]/50 rotate-45" />
              <div className="absolute w-3 h-3 bg-[#e9c46a]/40 rotate-45" />
            </div>
          ))}

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(233,196,106,0.08),transparent_60%)]" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-16 py-10 text-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e9c46a]/50" />
              <div className="flex items-center gap-2 px-4">
                <div className="w-8 h-8 rounded-full bg-[#e9c46a]/20 border border-[#e9c46a]/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#e9c46a]" />
                </div>
                <span className="text-[#e9c46a]/80 text-[11px] tracking-[0.3em] uppercase font-medium">
                  EN-AVM Academy
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e9c46a]/50" />
            </div>

            <p
              className="text-[#e9c46a]/60 text-[12px] tracking-[0.4em] uppercase mb-2"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Certificate of Completion
            </p>

            <h1
              className="text-white text-[42px] font-bold leading-tight mb-1"
              style={{
                fontFamily: "'Playfair Display', serif",
                textShadow: "0 2px 20px rgba(233,196,106,0.2)",
              }}
            >
              شهادة إتمام
            </h1>

            <div className="flex items-center gap-3 my-5 w-64">
              <div className="h-px flex-1 bg-[#e9c46a]/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#e9c46a]" />
              <div className="h-px flex-1 bg-[#e9c46a]/40" />
            </div>

            <p
              className="text-white/50 text-[13px] mb-3 tracking-wide"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              This certifies the successful completion of
            </p>

            <div className="bg-white/[0.06] border border-[#e9c46a]/20 rounded-2xl px-8 py-4 mb-3">
              <h2
                className="text-[#e9c46a] font-bold text-[22px] leading-snug"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {title}
              </h2>
            </div>

            <p
              className="text-white/50 text-[13px] mb-6"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Having demonstrated full commitment and completed all course
              requirements
            </p>

            <div className="flex items-end justify-between w-full max-w-lg">
              <div className="flex flex-col items-center gap-1">
                <div className="w-16 h-16 rounded-full border-2 border-[#e9c46a]/50 flex items-center justify-center bg-[#e9c46a]/10">
                  <GraduationCap className="w-7 h-7 text-[#e9c46a]" />
                </div>
                <p className="text-[#e9c46a]/50 text-[9px] tracking-widest uppercase mt-1">
                  Official Seal
                </p>
              </div>

              <div className="text-center">
                <p className="text-white/30 text-[10px] tracking-wide uppercase mb-1">
                  Issued on
                </p>
                <p className="text-white font-bold text-[14px]">{dateStr}</p>
              </div>

              <div className="text-center">
                <div className="w-28 h-px bg-[#e9c46a]/40 mb-1" />
                <p className="text-white/40 text-[10px] tracking-wide uppercase">
                  EN-AVM Academy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-[14px] transition-all"
          >
            {t("Close", "إغلاق")}
          </button>
          <button
            onClick={printCert}
            className="flex-1 bg-[#e9c46a] hover:bg-[#f0d080] text-[#0a2540] font-bold py-3 rounded-2xl text-[14px] transition-all flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            {t("Download / Print", "تحميل / طباعة")}
          </button>
        </div>
      </div>
    </div>
  );
}
