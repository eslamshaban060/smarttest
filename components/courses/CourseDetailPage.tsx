"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  Clock,
  Lock,
  PlayCircle,
  CheckCircle2,
  FileText,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface Lesson {
  id: string;
  order: number;
  titleEn: string;
  titleAr: string | null;
  materialUrl: string | null;
  videoUrl: string | null;
  quiz: {
    id: string;
    passingScore: number;
    _count: { questions: number };
  } | null;
  progress: { videoWatched: boolean; quizPassed: boolean };
  unlocked: boolean;
}
interface Course {
  id: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  language: string;
  price: number;
  imageUrl: string | null;
  createdAt: string;
  passingScore: number;
  _count: { enrollments: number; lessons: number };
  enrollment: { id: string; progress: number; status: string } | null;
  lessons: Lesson[];
  finalExam: {
    id: string;
    passingScore: number;
    _count: { questions: number };
  } | null;
}

export default function CourseDetailPage({ courseId }: { courseId: string }) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`/api/courses/${courseId}`);
      const d = await r.json();
      if (d.success) setCourse(d.data);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [courseId]); // eslint-disable-line

  async function enroll() {
    setEnrolling(true);
    setError(null);
    const r = await fetch(`/api/courses/${courseId}/enroll`, {
      method: "POST",
    });
    const d = await r.json();
    setEnrolling(false);
    if (r.ok) {
      await load();
      router.push(`/dashboard/courses/${courseId}/learn`);
    } else if (d.error === "insufficient_balance") {
      setError(
        t(
          `Insufficient balance. Need ${d.required} EGP, you have ${d.available} EGP.`,
          `رصيد غير كافٍ. تحتاج ${d.required} جنيه، لديك ${d.available} جنيه.`,
        ),
      );
    } else if (d.error === "already_enrolled") {
      router.push(`/dashboard/courses/${courseId}/learn`);
    } else setError(d.error ?? t("Something went wrong", "حدث خطأ"));
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
      </div>
    );
  if (!course)
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <p className="text-slate-400">
          {t("Course not found", "الكورس غير موجود")}
        </p>
      </div>
    );

  const enrolled = !!course.enrollment;
  const completed = course.enrollment?.status === "COMPLETED";
  const progress = course.enrollment?.progress ?? 0;
  const title = isRTL && course.titleAr ? course.titleAr : course.title;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
      {/* Hero */}
      <div className="bg-[#0a2540] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,180,216,0.15),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-8 py-10 relative">
          <button
            onClick={() => router.push("/dashboard/courses")}
            className={`flex items-center gap-2 text-white/40 hover:text-white/80 text-[13px] mb-8 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {isRTL ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
            {t("All Courses", "كل الكورسات")}
          </button>

          <div className={`flex gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* cover */}
            {course.imageUrl && (
              <div className="hidden md:block w-56 h-36 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl">
                <img
                  src={course.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
              <div
                className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#00b4d8]/20 text-[#00b4d8] border border-[#00b4d8]/30 font-semibold">
                  {course.language}
                </span>
                {course.price === 0 ? (
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                    {t("Free", "مجاني")}
                  </span>
                ) : (
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#e9c46a]/20 text-[#e9c46a] border border-[#e9c46a]/30 font-semibold">
                    {course.price} EGP
                  </span>
                )}
              </div>
              <h1 className="text-white font-bold text-[28px] leading-tight mb-3">
                {title}
              </h1>
              {course.description && (
                <p className="text-white/50 text-[15px] leading-relaxed mb-5">
                  {course.description}
                </p>
              )}
              <div
                className={`flex items-center gap-5 text-white/40 text-[13px] ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Users className="w-4 h-4" />
                  {course._count.enrollments} {t("students", "طالب")}
                </span>
                <span
                  className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <BookOpen className="w-4 h-4" />
                  {course._count.lessons} {t("lessons", "درس")}
                </span>
                {course.finalExam && (
                  <span
                    className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    {t("Certificate", "شهادة")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className={`grid lg:grid-cols-3 gap-8 ${isRTL ? "" : ""}`}>
          {/* Lessons list */}
          <div className="lg:col-span-2 space-y-3">
            <h2
              className={`text-[#0a2540] font-bold text-[18px] mb-5 ${isRTL ? "text-right" : ""}`}
            >
              {t("Course Content", "محتوى الكورس")}
            </h2>

            {course.lessons.map((lesson, i) => {
              const isExpanded = expanded === lesson.id;
              const lessonTitle =
                isRTL && lesson.titleAr ? lesson.titleAr : lesson.titleEn;
              const locked = !lesson.unlocked && enrolled;
              const notEnrolled = !enrolled;

              return (
                <div
                  key={lesson.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${lesson.unlocked && enrolled ? "border-slate-100 hover:border-slate-200" : "border-slate-100 opacity-80"}`}
                >
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : lesson.id)}
                    className={`w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {/* number / status icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        lesson.progress.quizPassed
                          ? "bg-emerald-500"
                          : lesson.progress.videoWatched
                            ? "bg-[#00b4d8]"
                            : lesson.unlocked && enrolled
                              ? "bg-[#0a2540]"
                              : "bg-slate-200"
                      }`}
                    >
                      {lesson.progress.quizPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : locked || notEnrolled ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <span className="text-white font-bold text-[12px]">
                          {i + 1}
                        </span>
                      )}
                    </div>

                    <div
                      className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}
                    >
                      <p className="text-[#0a2540] font-bold text-[14px] truncate">
                        {lessonTitle}
                      </p>
                      <p className="text-slate-400 text-[12px] mt-0.5">
                        {[
                          lesson.materialUrl && t("Material", "ماتريال"),
                          lesson.videoUrl && t("Video", "فيديو"),
                          lesson.quiz && t("Quiz", "كويز"),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-2 flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      {lesson.progress.quizPassed && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-100">
                          {t("Done", "مكتمل")}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-3">
                      {lesson.materialUrl && (
                        <a
                          href={lesson.materialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors group ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <div
                            className={`flex-1 ${isRTL ? "text-right" : ""}`}
                          >
                            <p className="text-blue-700 font-bold text-[13px]">
                              {t("Study Material", "الماتريال")}
                            </p>
                            <p className="text-blue-500 text-[11px]">
                              {t("Open in Google Drive", "فتح في Google Drive")}
                            </p>
                          </div>
                          <ArrowRight
                            className={`w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform ${isRTL ? "rotate-180" : ""}`}
                          />
                        </a>
                      )}
                      {lesson.videoUrl && (
                        <div
                          className={`flex items-center gap-3 p-3.5 rounded-xl bg-red-50 border border-red-100 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                            <PlayCircle className="w-4 h-4 text-white" />
                          </div>
                          <div
                            className={`flex-1 ${isRTL ? "text-right" : ""}`}
                          >
                            <p className="text-red-700 font-bold text-[13px]">
                              {t("Video Lesson", "الفيديو")}
                            </p>
                            <p className="text-red-400 text-[11px]">
                              {t(
                                "Available in course player",
                                "متاح في مشغّل الكورس",
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                      {lesson.quiz && (
                        <div
                          className={`flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                            <HelpCircle className="w-4 h-4 text-white" />
                          </div>
                          <div
                            className={`flex-1 ${isRTL ? "text-right" : ""}`}
                          >
                            <p className="text-amber-700 font-bold text-[13px]">
                              {t("Lesson Quiz", "كويز الدرس")}
                            </p>
                            <p className="text-amber-500 text-[11px]">
                              {lesson.quiz._count.questions}{" "}
                              {t("questions · Pass: 60%", "سؤال · نجاح: 60%")}
                            </p>
                          </div>
                          {lesson.progress.quizPassed && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                      )}
                      {(locked || notEnrolled) && (
                        <p className="text-slate-400 text-[12px] text-center py-1">
                          🔒{" "}
                          {locked
                            ? t(
                                "Pass previous lesson's quiz to unlock",
                                "انجح في كويز الدرس السابق لفتح هذا الدرس",
                              )
                            : t(
                                "Enroll to access this lesson",
                                "سجّل في الكورس للوصول لهذا الدرس",
                              )}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* final exam */}
            {course.finalExam && (
              <div className="bg-gradient-to-br from-[#0a2540] to-[#0d3a6e] rounded-2xl p-5 border border-white/10 shadow-sm">
                <div
                  className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e9c46a]/20 border border-[#e9c46a]/30 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-[#e9c46a]" />
                  </div>
                  <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                    <p className="text-white font-bold text-[15px]">
                      {t("Final Exam", "الامتحان الشامل")}
                    </p>
                    <p className="text-white/40 text-[12px]">
                      {course.finalExam._count.questions}{" "}
                      {t(
                        "questions · Pass to get certificate",
                        "سؤال · النجاح = شهادة",
                      )}
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#e9c46a]/60 flex-shrink-0" />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — enroll / progress */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-20">
              {enrolled ? (
                /* enrolled state */
                <div className="space-y-5">
                  {/* progress */}
                  <div>
                    <div className="flex items-center justify-between text-[13px] font-semibold mb-2">
                      <span className="text-slate-500">
                        {t("Your Progress", "تقدمك")}
                      </span>
                      <span
                        className={
                          progress === 100
                            ? "text-emerald-500"
                            : "text-[#00b4d8]"
                        }
                      >
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${progress === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-[#00b4d8] to-[#0096b4]"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-slate-400 text-[12px] mt-1.5">
                      {
                        course.lessons.filter(
                          (l) =>
                            l.progress.quizPassed || l.progress.videoWatched,
                        ).length
                      }{" "}
                      / {course._count.lessons} {t("lessons done", "درس مكتمل")}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/dashboard/courses/${courseId}/learn`)
                    }
                    className="w-full flex items-center justify-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] text-white font-bold py-4 rounded-xl text-[15px] transition-all shadow-lg hover:-translate-y-0.5"
                  >
                    <PlayCircle className="w-5 h-5" />
                    {completed
                      ? t("Review Course", "مراجعة الكورس")
                      : t("Continue Learning", "متابعة التعلم")}
                  </button>

                  {completed && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                      <GraduationCap className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-emerald-700 font-bold text-[14px]">
                        {t("Course Completed! 🎉", "أتممت الكورس! 🎉")}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* not enrolled state */
                <div className="space-y-5">
                  <div className="text-center">
                    <div className="text-[#0a2540] font-bold text-[32px] leading-none mb-1">
                      {course.price === 0
                        ? t("Free", "مجاني")
                        : `${course.price} EGP`}
                    </div>
                    {course.price > 0 && (
                      <p className="text-slate-400 text-[13px]">
                        {t("One-time payment", "دفع مرة واحدة")}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13px] text-red-600 flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        {error}
                        {(error.includes("balance") ||
                          error.includes("رصيد")) && (
                          <button
                            onClick={() => router.push("/dashboard/profile")}
                            className="block mt-1.5 text-[#00b4d8] font-bold hover:underline text-[12px]"
                          >
                            {t("Recharge balance →", "شحن الرصيد ←")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={enroll}
                    disabled={enrolling}
                    className="w-full flex items-center justify-center gap-2 bg-[#00b4d8] hover:bg-[#0096b4] disabled:opacity-60 text-white font-bold py-4 rounded-xl text-[15px] transition-all shadow-lg shadow-[#00b4d8]/25 hover:-translate-y-0.5"
                  >
                    {enrolling ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <PlayCircle className="w-5 h-5" />
                    )}
                    {enrolling
                      ? t("Processing...", "جاري المعالجة...")
                      : course.price === 0
                        ? t("Enroll Free", "سجّل مجاناً")
                        : t("Enroll Now", "سجّل الآن")}
                  </button>

                  <ul className="space-y-2 text-slate-500 text-[13px]">
                    {[
                      [
                        BookOpen,
                        `${course._count.lessons} ${t("lessons", "درس")}`,
                      ],
                      [FileText, t("Study materials", "مواد دراسية")],
                      [HelpCircle, t("Lesson quizzes", "كويز لكل درس")],
                      ...(course.finalExam
                        ? [
                            [
                              GraduationCap,
                              t(
                                "Certificate on completion",
                                "شهادة عند الإتمام",
                              ),
                            ],
                          ]
                        : []),
                    ].map(([Icon, label], i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {label as string}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
