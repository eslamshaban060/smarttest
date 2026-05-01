// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useLanguage } from "@/app/hooks/useLanguage";
// import { useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   ArrowRight,
//   CheckCircle2,
//   Circle,
//   Lock,
//   Loader2,
//   FileText,
//   PlayCircle,
//   HelpCircle,
//   GraduationCap,
//   ChevronLeft,
//   ChevronRight,
//   Sparkles,
//   AlertCircle,
//   Menu,
//   ShieldAlert,
//   Volume2,
//   VolumeX,
//   Maximize,
// } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface QuizQuestion {
//   id: string;
//   questionEn: string;
//   questionAr: string | null;
//   options: { id: string; textEn: string; textAr: string }[];
//   correctOption: string;
// }
// interface LessonQuiz {
//   id: string;
//   passingScore: number;
//   questions: QuizQuestion[];
// }
// interface LessonProgress {
//   videoWatched: boolean;
//   quizPassed: boolean;
// }
// interface Lesson {
//   id: string;
//   order: number;
//   titleEn: string;
//   titleAr: string | null;
//   materialUrl: string | null;
//   videoUrl: string | null;
//   quiz: LessonQuiz | null;
//   progress: LessonProgress;
//   unlocked: boolean;
// }
// interface FinalExam {
//   id: string;
//   passingScore: number;
//   questions: QuizQuestion[];
// }
// interface Course {
//   id: string;
//   title: string;
//   titleAr: string | null;
//   lessons: Lesson[];
//   finalExam: FinalExam | null;
//   enrollment: { id: string; progress: number; status: string } | null;
// }

// // ══════════════════════════════════════════════════════════════════════════════
// export default function CourseLearnPage({ courseId }: { courseId: string }) {
//   const { t, isRTL } = useLanguage();
//   const router = useRouter();

//   const [course, setCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
//   const [view, setView] = useState<"video" | "material" | "quiz" | "finalExam">(
//     "video",
//   );
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [markingDone, setMarkingDone] = useState(false);
//   const [showCert, setShowCert] = useState(false);
//   const [lastScore, setLastScore] = useState<number>(0);

//   const [embedUrl, setEmbedUrl] = useState<string | null>(null);
//   const [videoLoading, setVideoLoading] = useState(false);
//   const [muted, setMuted] = useState(false);

//   const [userName, setUserName] = useState("");
//   const [userId, setUserId] = useState("");

//   const load = useCallback(async () => {
//     try {
//       const r = await fetch(`/api/courses/${courseId}`);
//       const d = await r.json();
//       if (d.success) {
//         setCourse(d.data);
//         const first =
//           d.data.lessons.find((l: Lesson) => l.unlocked) ?? d.data.lessons[0];
//         setActiveLesson((prev) =>
//           prev
//             ? (d.data.lessons.find((l: Lesson) => l.id === prev.id) ?? first)
//             : first,
//         );
//       }
//     } catch {}
//     setLoading(false);
//   }, [courseId]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   useEffect(() => {
//     fetch("/api/profile")
//       .then((r) => r.json())
//       .then((d) => {
//         if (d.data) {
//           setUserName(d.data.fullName);
//           setUserId(d.data.id.slice(0, 8).toUpperCase());
//         }
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (!activeLesson?.videoUrl || view !== "video") {
//       setEmbedUrl(null);
//       return;
//     }
//     setVideoLoading(true);
//     fetch(`/api/courses/${courseId}/video?lessonId=${activeLesson.id}`)
//       .then((r) => r.json())
//       .then((d) => setEmbedUrl(d.success ? d.embedUrl : null))
//       .catch(() => setEmbedUrl(null))
//       .finally(() => setVideoLoading(false));
//   }, [activeLesson?.id, view, courseId]); // eslint-disable-line

//   async function markWatched() {
//     if (!activeLesson || activeLesson.progress.videoWatched) return;
//     setMarkingDone(true);
//     await fetch(`/api/courses/${courseId}/progress`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ lessonId: activeLesson.id }),
//     });
//     await load();
//     setMarkingDone(false);
//   }

//   function goToLesson(lesson: Lesson) {
//     if (!lesson.unlocked) return;
//     setActiveLesson(lesson);
//     setView("video");
//     setEmbedUrl(null);
//   }

//   if (loading)
//     return (
//       <div className="min-h-screen bg-[#0d1b2e] flex items-center justify-center">
//         <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
//       </div>
//     );

//   if (!course || !course.enrollment)
//     return (
//       <div className="min-h-screen bg-[#0d1b2e] flex flex-col items-center justify-center gap-4">
//         <p className="text-white/40">{t("Not enrolled", "غير مسجّل")}</p>
//         <button
//           onClick={() => router.push(`/dashboard/courses/${courseId}`)}
//           className="bg-[#00b4d8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0096b4] transition-all"
//         >
//           {t("Go to Course", "الذهاب للكورس")}
//         </button>
//       </div>
//     );

//   const lessons = course.lessons;
//   const totalLessons = lessons.length;
//   const activeIdx = lessons.findIndex((l) => l.id === activeLesson?.id);
//   const prevLesson = activeIdx > 0 ? lessons[activeIdx - 1] : null;
//   const nextLesson =
//     activeIdx < totalLessons - 1 ? lessons[activeIdx + 1] : null;
//   const allDone = lessons.every(
//     (l) => l.progress.quizPassed || (!l.quiz && l.progress.videoWatched),
//   );
//   const courseTitle = isRTL && course.titleAr ? course.titleAr : course.title;
//   const lessonTitle = activeLesson
//     ? isRTL && activeLesson.titleAr
//       ? activeLesson.titleAr
//       : activeLesson.titleEn
//     : "";

//   const activeEmbedUrl = embedUrl
//     ? muted
//       ? `${embedUrl}&mute=1`
//       : embedUrl
//     : null;

//   return (
//     <div
//       dir={isRTL ? "rtl" : "ltr"}
//       className="min-h-screen bg-[#0d1b2e] flex flex-col"
//     >
//       {/* ── TOP BAR ──────────────────────────────────────────────────────────── */}
//       <header className="bg-[#0a2540] border-b border-white/[0.07] px-6 py-4 flex items-center justify-between flex-shrink-0 z-30">
//         <div
//           className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
//         >
//           <button
//             onClick={() => router.push(`/dashboard/courses/${courseId}`)}
//             className="w-9 h-9 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white/60 hover:text-white flex items-center justify-center transition-all"
//           >
//             {isRTL ? (
//               <ArrowRight className="w-4 h-4" />
//             ) : (
//               <ArrowLeft className="w-4 h-4" />
//             )}
//           </button>
//           <div className={isRTL ? "text-right" : ""}>
//             <p className="text-white font-bold text-[14px] leading-tight line-clamp-1">
//               {courseTitle}
//             </p>
//             {lessonTitle && (
//               <p className="text-white/40 text-[11px] mt-0.5 line-clamp-1">
//                 {lessonTitle}
//               </p>
//             )}
//           </div>
//         </div>

//         <div
//           className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
//         >
//           <div className="hidden sm:flex items-center gap-2.5">
//             <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-[#00b4d8] rounded-full transition-all duration-700"
//                 style={{ width: `${course.enrollment.progress}%` }}
//               />
//             </div>
//             <span className="text-[#00b4d8] text-[12px] font-bold">
//               {course.enrollment.progress}%
//             </span>
//           </div>

//           {course.enrollment.status === "COMPLETED" && (
//             <button
//               onClick={() => setShowCert(true)}
//               className={`flex items-center gap-1.5 bg-[#e9c46a]/20 text-[#e9c46a] border border-[#e9c46a]/30 px-3 py-2 rounded-xl text-[12px] font-bold hover:bg-[#e9c46a]/30 transition-all ${isRTL ? "flex-row-reverse" : ""}`}
//             >
//               <GraduationCap className="w-3.5 h-3.5" />
//               {t("Certificate", "الشهادة")}
//             </button>
//           )}

//           <button
//             onClick={() => setSidebarOpen((p) => !p)}
//             className="w-9 h-9 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white/60 hover:text-white flex items-center justify-center transition-all"
//           >
//             <Menu className="w-4 h-4" />
//           </button>
//         </div>
//       </header>

//       {/* ── BODY ─────────────────────────────────────────────────────────────── */}
//       <div
//         className={`flex flex-1 overflow-hidden ${isRTL ? "flex-row-reverse" : ""}`}
//       >
//         {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
//         <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
//           {activeLesson && (
//             <>
//               {/* TABS */}
//               <div
//                 className={`flex items-center gap-1 px-6 py-3 bg-[#0a2540] border-b border-white/[0.07] flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}
//               >
//                 {[
//                   {
//                     key: "video" as const,
//                     Icon: PlayCircle,
//                     label: t("Video", "الفيديو"),
//                     show: !!activeLesson.videoUrl,
//                   },
//                   {
//                     key: "material" as const,
//                     Icon: FileText,
//                     label: t("Material", "الماتريال"),
//                     show: !!activeLesson.materialUrl,
//                   },
//                   {
//                     key: "quiz" as const,
//                     Icon: HelpCircle,
//                     label: t("Quiz", "الكويز"),
//                     show: !!activeLesson.quiz,
//                   },
//                 ]
//                   .filter((tab) => tab.show)
//                   .map((tab) => (
//                     <button
//                       key={tab.key}
//                       onClick={() => setView(tab.key)}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${isRTL ? "flex-row-reverse" : ""} ${
//                         view === tab.key
//                           ? "bg-white/[0.12] text-white border border-white/[0.1]"
//                           : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
//                       }`}
//                     >
//                       <tab.Icon className="w-4 h-4" />
//                       {tab.label}
//                       {tab.key === "quiz" &&
//                         activeLesson.progress.quizPassed && (
//                           <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
//                         )}
//                     </button>
//                   ))}
//               </div>

//               {/* VIDEO */}
//               {view === "video" && (
//                 <div className="flex flex-col flex-1">
//                   {/* player */}
//                   <div
//                     className="w-full bg-black relative select-none"
//                     style={{ aspectRatio: "16/9" }}
//                     onContextMenu={(e) => e.preventDefault()}
//                   >
//                     {videoLoading ? (
//                       <div className="absolute inset-0 flex items-center justify-center bg-[#0a1f35]">
//                         <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
//                       </div>
//                     ) : activeEmbedUrl ? (
//                       <>
//                         <div className="absolute inset-0 z-10 pointer-events-none" />
//                         <iframe
//                           key={`${activeLesson.id}-${muted}`}
//                           src={activeEmbedUrl}
//                           className="w-full h-full"
//                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                           allowFullScreen
//                           referrerPolicy="strict-origin"
//                           sandbox="allow-scripts allow-same-origin allow-presentation"
//                         />
//                         <div
//                           className={`absolute bottom-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent ${isRTL ? "flex-row-reverse" : ""}`}
//                         >
//                           <button
//                             onClick={() => setMuted((p) => !p)}
//                             className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
//                           >
//                             {muted ? (
//                               <VolumeX className="w-4 h-4" />
//                             ) : (
//                               <Volume2 className="w-4 h-4" />
//                             )}
//                           </button>
//                           <span className="text-white/60 text-[12px] font-medium select-none flex-1 truncate">
//                             {lessonTitle}
//                           </span>
//                           <button
//                             onClick={() => {
//                               const el = document.querySelector("iframe");
//                               el?.requestFullscreen?.();
//                             }}
//                             className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
//                           >
//                             <Maximize className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </>
//                     ) : (
//                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1f35] gap-3">
//                         <ShieldAlert className="w-10 h-10 text-white/20" />
//                         <p className="text-white/30 text-[14px]">
//                           {t("Video unavailable", "الفيديو غير متاح")}
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {/* content below video */}
//                   <div className="px-8 py-6 max-w-3xl space-y-6">
//                     {/* lesson header */}
//                     <div
//                       className={`flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
//                     >
//                       <div className={isRTL ? "text-right" : ""}>
//                         <p className="text-[#00b4d8] text-[11px] font-bold uppercase tracking-widest mb-1">
//                           {t(
//                             `Lesson ${activeLesson.order}`,
//                             `الدرس ${activeLesson.order}`,
//                           )}
//                         </p>
//                         <h2 className="text-white font-bold text-[20px] leading-snug">
//                           {lessonTitle}
//                         </h2>
//                       </div>
//                       {activeLesson.unlocked && (
//                         <button
//                           onClick={markWatched}
//                           disabled={
//                             activeLesson.progress.videoWatched || markingDone
//                           }
//                           className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold border transition-all flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""} ${
//                             activeLesson.progress.videoWatched
//                               ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-default"
//                               : "bg-white/10 text-white/70 border-white/20 hover:bg-[#00b4d8]/20 hover:text-[#00b4d8] hover:border-[#00b4d8]/40"
//                           }`}
//                         >
//                           {markingDone ? (
//                             <Loader2 className="w-3.5 h-3.5 animate-spin" />
//                           ) : activeLesson.progress.videoWatched ? (
//                             <CheckCircle2 className="w-3.5 h-3.5" />
//                           ) : (
//                             <Circle className="w-3.5 h-3.5" />
//                           )}
//                           {activeLesson.progress.videoWatched
//                             ? t("Watched ✓", "تمت المشاهدة ✓")
//                             : t("Mark as watched", "تمييز كمشاهَد")}
//                         </button>
//                       )}
//                     </div>

//                     {/* navigation */}
//                     <div
//                       className={`flex items-center gap-3 pt-4 border-t border-white/[0.06] ${isRTL ? "flex-row-reverse" : ""}`}
//                     >
//                       <button
//                         onClick={() => prevLesson && goToLesson(prevLesson)}
//                         disabled={!prevLesson}
//                         className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/60 hover:text-white disabled:opacity-30 text-[13px] font-semibold transition-all ${isRTL ? "flex-row-reverse" : ""}`}
//                       >
//                         {isRTL ? (
//                           <ChevronRight className="w-4 h-4" />
//                         ) : (
//                           <ChevronLeft className="w-4 h-4" />
//                         )}
//                         {t("Previous", "السابق")}
//                       </button>

//                       {activeLesson.quiz &&
//                       !activeLesson.progress.quizPassed ? (
//                         <button
//                           onClick={() => setView("quiz")}
//                           className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-bold transition-all shadow-lg shadow-amber-500/20 ${isRTL ? "flex-row-reverse" : ""}`}
//                         >
//                           <HelpCircle className="w-4 h-4" />
//                           {t("Take Quiz to Continue", "خذ الكويز للمتابعة")}
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => nextLesson && goToLesson(nextLesson)}
//                           disabled={!nextLesson || !nextLesson.unlocked}
//                           className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00b4d8] hover:bg-[#0096b4] text-white disabled:opacity-30 text-[13px] font-bold transition-all shadow-lg shadow-[#00b4d8]/20 ${isRTL ? "flex-row-reverse" : ""}`}
//                         >
//                           {t("Next Lesson", "الدرس التالي")}
//                           {isRTL ? (
//                             <ChevronLeft className="w-4 h-4" />
//                           ) : (
//                             <ChevronRight className="w-4 h-4" />
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* MATERIAL */}
//               {view === "material" && (
//                 <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
//                   {activeLesson.materialUrl ? (
//                     <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-2xl">
//                       <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6">
//                         <FileText className="w-10 h-10 text-blue-500" />
//                       </div>
//                       <h3 className="text-[#0a2540] font-bold text-[20px] mb-2">
//                         {t("Study Material", "الماتريال")}
//                       </h3>
//                       <p className="text-slate-400 text-[14px] leading-relaxed mb-7">
//                         {t(
//                           "Click below to open the study material in Google Drive.",
//                           "انقر أدناه لفتح مادة الدراسة في Google Drive.",
//                         )}
//                       </p>
//                       <a
//                         href={activeLesson.materialUrl}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl text-[15px] transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
//                       >
//                         <FileText className="w-5 h-5" />
//                         {t("Open Material", "فتح الماتريال")}
//                       </a>
//                     </div>
//                   ) : (
//                     <p className="text-white/30 text-[14px]">
//                       {t("No material", "لا يوجد ماتريال")}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* QUIZ */}
//               {view === "quiz" && activeLesson.quiz && (
//                 <QuizSection
//                   quiz={activeLesson.quiz}
//                   courseId={courseId}
//                   alreadyPassed={activeLesson.progress.quizPassed}
//                   isRTL={isRTL}
//                   t={t}
//                   onPassed={async () => {
//                     await load();
//                     const updated = await fetch(
//                       `/api/courses/${courseId}`,
//                     ).then((r) => r.json());
//                     if (updated.success) {
//                       const nextIdx =
//                         updated.data.lessons.findIndex(
//                           (l: Lesson) => l.id === activeLesson.id,
//                         ) + 1;
//                       const next = updated.data.lessons[nextIdx];
//                       if (next?.unlocked) {
//                         setCourse(updated.data);
//                         setActiveLesson(next);
//                         setView("video");
//                         setEmbedUrl(null);
//                       } else await load();
//                     }
//                   }}
//                 />
//               )}
//             </>
//           )}

//           {/* ALL DONE BANNER */}
//           {allDone &&
//             course.finalExam &&
//             course.enrollment.status !== "COMPLETED" &&
//             view !== "finalExam" && (
//               <div className="mx-8 mt-8 bg-gradient-to-br from-[#0a2540] to-[#0d3a6e] rounded-2xl p-6 border border-[#e9c46a]/20">
//                 <div
//                   className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
//                 >
//                   <div className="w-12 h-12 rounded-xl bg-[#e9c46a]/20 border border-[#e9c46a]/30 flex items-center justify-center flex-shrink-0">
//                     <GraduationCap className="w-6 h-6 text-[#e9c46a]" />
//                   </div>
//                   <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
//                     <p className="text-white font-bold text-[16px]">
//                       {t(
//                         "You're ready for the Final Exam! 🎉",
//                         "أنت جاهز للامتحان الشامل! 🎉",
//                       )}
//                     </p>
//                     <p className="text-white/40 text-[13px] mt-0.5">
//                       {t(
//                         "Pass it to get your certificate",
//                         "انجح فيه للحصول على شهادتك",
//                       )}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setView("finalExam")}
//                     className={`flex items-center gap-2 bg-[#e9c46a] hover:bg-[#f0d080] text-[#0a2540] font-bold px-5 py-3 rounded-xl text-[14px] transition-all flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}
//                   >
//                     <Sparkles className="w-4 h-4" />
//                     {t("Start Exam", "ابدأ الامتحان")}
//                   </button>
//                 </div>
//               </div>
//             )}

//           {/* FINAL EXAM */}
//           {view === "finalExam" && course.finalExam && (
//             <FinalExamSection
//               exam={course.finalExam}
//               courseId={courseId}
//               isRTL={isRTL}
//               t={t}
//               onPassed={(score) => {
//                 setLastScore(score);
//                 load();
//                 setShowCert(true);
//               }}
//             />
//           )}
//         </div>

//         {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
//         <div
//           className={`bg-[#0a2540] border-${isRTL ? "l" : "r"} border-white/[0.07] flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ${sidebarOpen ? "w-72" : "w-0"}`}
//         >
//           {/* sidebar header */}
//           <div className="px-5 py-5 border-b border-white/[0.07] flex-shrink-0">
//             <h3 className="text-white font-bold text-[14px] mb-4">
//               {t("Course Content", "محتوى الكورس")}
//             </h3>
//             <div className="bg-white/[0.05] rounded-xl p-4 space-y-3">
//               <div
//                 className={`flex items-center justify-between text-[12px] ${isRTL ? "flex-row-reverse" : ""}`}
//               >
//                 <span className="text-white/40">{t("Progress", "التقدم")}</span>
//                 <span className="text-[#00b4d8] font-bold">
//                   {course.enrollment.progress}%
//                 </span>
//               </div>
//               <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-[#00b4d8] rounded-full transition-all duration-700"
//                   style={{ width: `${course.enrollment.progress}%` }}
//                 />
//               </div>
//               <p className="text-white/25 text-[11px]">
//                 {
//                   lessons.filter(
//                     (l) => l.progress.quizPassed || l.progress.videoWatched,
//                   ).length
//                 }{" "}
//                 / {totalLessons} {t("done", "مكتمل")}
//               </p>
//             </div>
//           </div>

//           {/* lesson list */}
//           <div className="flex-1 overflow-y-auto py-2">
//             {lessons.map((lesson) => {
//               const lTitle =
//                 isRTL && lesson.titleAr ? lesson.titleAr : lesson.titleEn;
//               const isActive = lesson.id === activeLesson?.id;
//               const done =
//                 lesson.progress.quizPassed ||
//                 (!lesson.quiz && lesson.progress.videoWatched);
//               return (
//                 <button
//                   key={lesson.id}
//                   onClick={() => lesson.unlocked && goToLesson(lesson)}
//                   disabled={!lesson.unlocked}
//                   className={`w-full flex items-center gap-3 px-5 py-3.5 transition-all ${isRTL ? "flex-row-reverse" : ""} ${
//                     isActive
//                       ? "bg-[#00b4d8]/15 border-s-2 border-[#00b4d8]"
//                       : "hover:bg-white/[0.04]"
//                   } ${!lesson.unlocked ? "cursor-not-allowed" : "cursor-pointer"}`}
//                 >
//                   <div
//                     className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
//                       done
//                         ? "bg-emerald-500/20"
//                         : isActive
//                           ? "bg-[#00b4d8]/20"
//                           : "bg-white/[0.06]"
//                     }`}
//                   >
//                     {done ? (
//                       <CheckCircle2 className="w-4 h-4 text-emerald-400" />
//                     ) : !lesson.unlocked ? (
//                       <Lock className="w-3.5 h-3.5 text-white/20" />
//                     ) : (
//                       <PlayCircle
//                         className={`w-4 h-4 ${isActive ? "text-[#00b4d8]" : "text-white/30"}`}
//                       />
//                     )}
//                   </div>
//                   <div
//                     className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}
//                   >
//                     <p
//                       className={`text-[13px] font-semibold truncate ${isActive ? "text-white" : done ? "text-white/50" : "text-white/60"}`}
//                     >
//                       {lTitle}
//                     </p>
//                     <p className="text-white/25 text-[10px] mt-0.5">
//                       {[
//                         lesson.materialUrl && t("Material", "ماتريال"),
//                         lesson.videoUrl && t("Video", "فيديو"),
//                         lesson.quiz && t("Quiz", "كويز"),
//                       ]
//                         .filter(Boolean)
//                         .join(" · ")}
//                     </p>
//                   </div>
//                   {isActive && (
//                     <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] flex-shrink-0" />
//                   )}
//                 </button>
//               );
//             })}

//             {/* final exam entry */}
//             {course.finalExam && (
//               <button
//                 onClick={() => allDone && setView("finalExam")}
//                 disabled={!allDone}
//                 className={`w-full flex items-center gap-3 px-5 py-3.5 mt-2 border-t border-white/[0.05] transition-all ${isRTL ? "flex-row-reverse" : ""} ${
//                   view === "finalExam"
//                     ? "bg-[#e9c46a]/15"
//                     : allDone
//                       ? "hover:bg-white/[0.04] cursor-pointer"
//                       : "opacity-30 cursor-not-allowed"
//                 }`}
//               >
//                 <div
//                   className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
//                     view === "finalExam" ? "bg-[#e9c46a]/20" : "bg-white/[0.06]"
//                   }`}
//                 >
//                   <GraduationCap
//                     className={`w-4 h-4 ${
//                       view === "finalExam"
//                         ? "text-[#e9c46a]"
//                         : allDone
//                           ? "text-[#e9c46a]/60"
//                           : "text-white/20"
//                     }`}
//                   />
//                 </div>
//                 <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
//                   <p
//                     className={`text-[13px] font-bold truncate ${view === "finalExam" ? "text-[#e9c46a]" : "text-white/60"}`}
//                   >
//                     {t("Final Exam", "الامتحان الشامل")}
//                   </p>
//                   <p className="text-white/25 text-[10px] mt-0.5">
//                     {t("Pass = Certificate", "النجاح = شهادة")}
//                   </p>
//                 </div>
//                 {course.enrollment.status === "COMPLETED" && (
//                   <CheckCircle2 className="w-3.5 h-3.5 text-[#e9c46a] flex-shrink-0" />
//                 )}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* CERTIFICATE MODAL */}
//       {showCert && (
//         <CertificateModal
//           courseTitle={course.title}
//           userName={userName}
//           userId={userId}
//           score={lastScore}
//           isRTL={isRTL}
//           t={t}
//           onClose={() => setShowCert(false)}
//         />
//       )}
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // QUIZ SECTION
// // ══════════════════════════════════════════════════════════════════════════════
// function QuizSection({
//   quiz,
//   courseId,
//   alreadyPassed,
//   isRTL,
//   t,
//   onPassed,
// }: {
//   quiz: LessonQuiz;
//   courseId: string;
//   alreadyPassed: boolean;
//   isRTL: boolean;
//   t: (en: string, ar: string) => string;
//   onPassed: () => void;
// }) {
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [result, setResult] = useState<{
//     score: number;
//     passed: boolean;
//     correct: number;
//     total: number;
//   } | null>(null);

//   async function submit() {
//     if (Object.keys(answers).length < quiz.questions.length) return;
//     setSubmitting(true);
//     const r = await fetch(`/api/courses/${courseId}/quiz`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ lessonQuizId: quiz.id, answers }),
//     });
//     const d = await r.json();
//     setSubmitting(false);
//     if (r.ok) {
//       setResult(d);
//       if (d.passed) setTimeout(onPassed, 1500);
//     }
//   }

//   if (alreadyPassed)
//     return (
//       <div className="flex-1 flex items-center justify-center px-8 py-12">
//         <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-10 text-center max-w-sm">
//           <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
//           <h3 className="text-white font-bold text-[20px] mb-2">
//             {t("Quiz Passed! ✓", "اجتزت الكويز! ✓")}
//           </h3>
//           <p className="text-white/40 text-[14px]">
//             {t("You already passed this quiz.", "لقد اجتزت هذا الكويز مسبقاً.")}
//           </p>
//         </div>
//       </div>
//     );

//   if (result)
//     return (
//       <div className="flex-1 flex items-center justify-center px-8 py-12">
//         <div
//           className={`${result.passed ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"} border rounded-3xl p-10 text-center max-w-sm`}
//         >
//           {result.passed ? (
//             <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
//           ) : (
//             <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           )}
//           <h3 className="text-white font-bold text-[24px] mb-2">
//             {result.score}%
//           </h3>
//           <p
//             className={`font-bold text-[18px] mb-3 ${result.passed ? "text-emerald-400" : "text-red-400"}`}
//           >
//             {result.passed
//               ? t("Passed! 🎉", "نجحت! 🎉")
//               : t("Try Again", "حاول مرة أخرى")}
//           </p>
//           <p className="text-white/40 text-[14px] mb-6">
//             {result.correct} / {result.total} {t("correct", "صحيح")}
//           </p>
//           {!result.passed && (
//             <button
//               onClick={() => {
//                 setResult(null);
//                 setAnswers({});
//               }}
//               className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-[14px] transition-all"
//             >
//               {t("Retry", "إعادة المحاولة")}
//             </button>
//           )}
//         </div>
//       </div>
//     );

//   return (
//     <QuizForm
//       questions={quiz.questions}
//       isRTL={isRTL}
//       t={t}
//       submitting={submitting}
//       answers={answers}
//       setAnswers={setAnswers}
//       onSubmit={submit}
//       accentColor="#00b4d8"
//       submitLabel={t("Submit Quiz", "تسليم الكويز")}
//     />
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // FINAL EXAM SECTION
// // ══════════════════════════════════════════════════════════════════════════════
// function FinalExamSection({
//   exam,
//   courseId,
//   isRTL,
//   t,
//   onPassed,
// }: {
//   exam: FinalExam;
//   courseId: string;
//   isRTL: boolean;
//   t: (en: string, ar: string) => string;
//   onPassed: (score: number) => void;
// }) {
//   const [started, setStarted] = useState(false);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [result, setResult] = useState<{
//     score: number;
//     passed: boolean;
//     correct: number;
//     total: number;
//   } | null>(null);

//   async function submit() {
//     if (Object.keys(answers).length < exam.questions.length) return;
//     setSubmitting(true);
//     const r = await fetch(`/api/courses/${courseId}/quiz`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ finalExamId: exam.id, answers }),
//     });
//     const d = await r.json();
//     setSubmitting(false);
//     if (r.ok) {
//       setResult(d);
//       if (d.passed) setTimeout(() => onPassed(d.score), 1500);
//     }
//   }

//   if (!started)
//     return (
//       <div className="flex-1 flex items-center justify-center px-8 py-12">
//         <div className="bg-gradient-to-br from-[#0a2540] to-[#0d3a6e] border border-[#e9c46a]/20 rounded-3xl p-10 text-center max-w-md shadow-2xl">
//           <div className="w-20 h-20 rounded-full bg-[#e9c46a]/15 border border-[#e9c46a]/30 flex items-center justify-center mx-auto mb-6">
//             <GraduationCap className="w-10 h-10 text-[#e9c46a]" />
//           </div>
//           <h2 className="text-white font-bold text-[24px] mb-3">
//             {t("Final Exam", "الامتحان الشامل")}
//           </h2>
//           <p className="text-white/40 text-[14px] mb-2">
//             {exam.questions.length} {t("questions", "سؤال")}
//           </p>
//           <p className="text-white/40 text-[14px] mb-8">
//             {t(
//               "Pass: 60% · Get certificate on success!",
//               "نجاح: 60% · شهادة عند النجاح!",
//             )}
//           </p>
//           <button
//             onClick={() => setStarted(true)}
//             className="inline-flex items-center gap-2 bg-[#e9c46a] hover:bg-[#f0d080] text-[#0a2540] font-bold px-8 py-4 rounded-xl text-[16px] transition-all shadow-lg shadow-[#e9c46a]/20 hover:-translate-y-0.5"
//           >
//             <Sparkles className="w-5 h-5" />
//             {t("Start Exam", "ابدأ الامتحان")}
//           </button>
//         </div>
//       </div>
//     );

//   if (result)
//     return (
//       <div className="flex-1 flex items-center justify-center px-8 py-12">
//         <div
//           className={`${result.passed ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"} border rounded-3xl p-12 text-center max-w-sm`}
//         >
//           {result.passed ? (
//             <Sparkles className="w-16 h-16 text-[#e9c46a] mx-auto mb-4" />
//           ) : (
//             <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           )}
//           <h3 className="text-white font-bold text-[28px] mb-2">
//             {result.score}%
//           </h3>
//           <p
//             className={`font-bold text-[20px] mb-3 ${result.passed ? "text-[#e9c46a]" : "text-red-400"}`}
//           >
//             {result.passed
//               ? t("Congratulations! 🎓", "مبروك! 🎓")
//               : t("Not Passed", "لم تنجح")}
//           </p>
//           <p className="text-white/40 text-[14px] mb-8">
//             {result.correct} / {result.total} {t("correct", "صحيح")}
//           </p>
//           {!result.passed && (
//             <button
//               onClick={() => {
//                 setResult(null);
//                 setAnswers({});
//                 setStarted(false);
//               }}
//               className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-[14px] transition-all"
//             >
//               {t("Try Again", "حاول مرة أخرى")}
//             </button>
//           )}
//         </div>
//       </div>
//     );

//   return (
//     <div className="flex-1 overflow-y-auto">
//       <div className="max-w-2xl mx-auto px-8 py-6 space-y-4">
//         <div
//           className={`flex items-center gap-3 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
//         >
//           <div className="w-10 h-10 rounded-xl bg-[#e9c46a]/15 border border-[#e9c46a]/30 flex items-center justify-center">
//             <GraduationCap className="w-5 h-5 text-[#e9c46a]" />
//           </div>
//           <div className={isRTL ? "text-right" : ""}>
//             <h2 className="text-white font-bold text-[20px]">
//               {t("Final Exam", "الامتحان الشامل")}
//             </h2>
//             <p className="text-white/40 text-[13px]">
//               {exam.questions.length}{" "}
//               {t("questions · pass: 60%", "سؤال · نجاح: 60%")}
//             </p>
//           </div>
//         </div>
//         <QuizForm
//           questions={exam.questions}
//           isRTL={isRTL}
//           t={t}
//           submitting={submitting}
//           answers={answers}
//           setAnswers={setAnswers}
//           onSubmit={submit}
//           accentColor="#e9c46a"
//           submitLabel={t("Submit Exam", "تسليم الامتحان")}
//         />
//       </div>
//     </div>
//   );
// }

// // ── shared quiz form ──────────────────────────────────────────────────────────
// function QuizForm({
//   questions,
//   isRTL,
//   t,
//   submitting,
//   answers,
//   setAnswers,
//   onSubmit,
//   accentColor,
//   submitLabel,
// }: {
//   questions: QuizQuestion[];
//   isRTL: boolean;
//   t: (en: string, ar: string) => string;
//   submitting: boolean;
//   answers: Record<string, string>;
//   setAnswers: (
//     fn: (p: Record<string, string>) => Record<string, string>,
//   ) => void;
//   onSubmit: () => void;
//   accentColor: string;
//   submitLabel: string;
// }) {
//   return (
//     <div className="space-y-5">
//       {questions.map((q, qi) => {
//         const qText = isRTL && q.questionAr ? q.questionAr : q.questionEn;
//         return (
//           <div
//             key={q.id}
//             className="bg-white/[0.06] rounded-2xl border border-white/[0.08] p-5 space-y-4"
//           >
//             <p
//               className={`text-white font-bold text-[15px] leading-relaxed ${isRTL ? "text-right" : ""}`}
//             >
//               <span style={{ color: accentColor }} className="me-2">
//                 Q{qi + 1}.
//               </span>
//               {qText}
//             </p>
//             <div className="space-y-2.5">
//               {q.options.map((opt, oi) => {
//                 const optText = isRTL && opt.textAr ? opt.textAr : opt.textEn;
//                 const isSelected = answers[q.id] === opt.id;
//                 return (
//                   <button
//                     key={opt.id}
//                     onClick={() =>
//                       setAnswers((p) => ({ ...p, [q.id]: opt.id }))
//                     }
//                     className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${isRTL ? "flex-row-reverse text-right" : ""}`}
//                     style={
//                       isSelected
//                         ? {
//                             backgroundColor: `${accentColor}22`,
//                             borderColor: `${accentColor}80`,
//                           }
//                         : {
//                             backgroundColor: "rgba(255,255,255,0.04)",
//                             borderColor: "rgba(255,255,255,0.08)",
//                           }
//                     }
//                   >
//                     <div
//                       className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
//                       style={
//                         isSelected
//                           ? {
//                               borderColor: accentColor,
//                               backgroundColor: accentColor,
//                             }
//                           : { borderColor: "rgba(255,255,255,0.2)" }
//                       }
//                     >
//                       {isSelected && (
//                         <CheckCircle2
//                           className="w-3.5 h-3.5"
//                           style={{
//                             color:
//                               accentColor === "#e9c46a" ? "#0a2540" : "white",
//                           }}
//                         />
//                       )}
//                     </div>
//                     <span className="text-white/40 font-bold text-[12px] flex-shrink-0 w-5">
//                       {["A", "B", "C", "D"][oi]}
//                     </span>
//                     <span className="text-[14px] font-medium text-white/80">
//                       {optText}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}

//       <button
//         onClick={onSubmit}
//         disabled={submitting || Object.keys(answers).length < questions.length}
//         className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 rounded-xl text-[15px] transition-all shadow-lg"
//         style={{
//           backgroundColor: accentColor,
//           color: accentColor === "#e9c46a" ? "#0a2540" : "white",
//         }}
//       >
//         {submitting ? (
//           <Loader2 className="w-5 h-5 animate-spin" />
//         ) : (
//           <GraduationCap className="w-5 h-5" />
//         )}
//         {submitting ? t("Grading...", "جاري التصحيح...") : submitLabel}
//       </button>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // CERTIFICATE MODAL — canvas PNG (English only + hand-drawn signature)
// // ══════════════════════════════════════════════════════════════════════════════
// function CertificateModal({
//   courseTitle,
//   userName,
//   userId,
//   score,
//   isRTL,
//   t,
//   onClose,
// }: {
//   courseTitle: string;
//   userName: string;
//   userId: string;
//   score: number;
//   isRTL: boolean;
//   t: (en: string, ar: string) => string;
//   onClose: () => void;
// }) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const dateStr = new Date().toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   useEffect(() => {
//     drawCertificate();
//   }, []); // eslint-disable-line

//   function drawCertificate() {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const W = 1122,
//       H = 794;
//     canvas.width = W;
//     canvas.height = H;
//     const ctx = canvas.getContext("2d")!;

//     // background
//     const bg = ctx.createLinearGradient(0, 0, W, H);
//     bg.addColorStop(0, "#0a2540");
//     bg.addColorStop(0.5, "#0d3a6e");
//     bg.addColorStop(1, "#0a2540");
//     ctx.fillStyle = bg;
//     ctx.fillRect(0, 0, W, H);

//     // radial glow
//     const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 500);
//     glow.addColorStop(0, "rgba(233,196,106,0.07)");
//     glow.addColorStop(1, "transparent");
//     ctx.fillStyle = glow;
//     ctx.fillRect(0, 0, W, H);

//     // outer border
//     ctx.strokeStyle = "rgba(233,196,106,0.7)";
//     ctx.lineWidth = 3;
//     ctx.strokeRect(20, 20, W - 40, H - 40);

//     // inner border
//     ctx.strokeStyle = "rgba(233,196,106,0.25)";
//     ctx.lineWidth = 1;
//     ctx.strokeRect(34, 34, W - 68, H - 68);

//     // corner ornaments
//     const corners: [number, number][] = [
//       [30, 30],
//       [W - 30, 30],
//       [30, H - 30],
//       [W - 30, H - 30],
//     ];
//     corners.forEach(([cx, cy]) => {
//       ctx.save();
//       ctx.translate(cx, cy);
//       ctx.strokeStyle = "rgba(233,196,106,0.6)";
//       ctx.lineWidth = 2;
//       ctx.beginPath();
//       ctx.rect(-15, -15, 30, 30);
//       ctx.stroke();
//       ctx.fillStyle = "rgba(233,196,106,0.35)";
//       ctx.save();
//       ctx.rotate(Math.PI / 4);
//       ctx.fillRect(-5, -5, 10, 10);
//       ctx.restore();
//       ctx.restore();
//     });

//     function hLine(y: number, opacity = 0.3) {
//       const grad = ctx.createLinearGradient(50, y, W - 50, y);
//       grad.addColorStop(0, "transparent");
//       grad.addColorStop(0.3, `rgba(233,196,106,${opacity})`);
//       grad.addColorStop(0.7, `rgba(233,196,106,${opacity})`);
//       grad.addColorStop(1, "transparent");
//       ctx.strokeStyle = grad;
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.moveTo(50, y);
//       ctx.lineTo(W - 50, y);
//       ctx.stroke();
//     }

//     // academy name
//     ctx.fillStyle = "rgba(233,196,106,0.6)";
//     ctx.font = "bold 13px Arial";
//     ctx.textAlign = "center";
//     ctx.letterSpacing = "4px";
//     ctx.fillText("EN-AVM ACADEMY", W / 2, 80);
//     ctx.letterSpacing = "0px";

//     hLine(100);

//     ctx.fillStyle = "rgba(233,196,106,0.45)";
//     ctx.font = "12px Arial";
//     ctx.fillText("CERTIFICATE OF COMPLETION", W / 2, 135);

//     // main title — English only
//     ctx.fillStyle = "white";
//     ctx.font = "bold 52px Georgia, serif";
//     ctx.fillText("Certificate of Completion", W / 2, 210);

//     hLine(235, 0.4);

//     ctx.fillStyle = "rgba(255,255,255,0.4)";
//     ctx.font = "14px Arial";
//     ctx.fillText("This certificate is proudly presented to", W / 2, 280);

//     // student name
//     ctx.fillStyle = "white";
//     ctx.font = "bold 38px Georgia, serif";
//     ctx.fillText(userName || "Student", W / 2, 340);

//     ctx.fillStyle = "rgba(255,255,255,0.4)";
//     ctx.font = "14px Arial";
//     ctx.fillText("for successfully completing", W / 2, 385);

//     // course title box
//     ctx.font = "bold 22px Georgia, serif";
//     const boxW = Math.min(700, ctx.measureText(courseTitle).width + 80);
//     const boxX = (W - boxW) / 2;
//     ctx.strokeStyle = "rgba(233,196,106,0.3)";
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.roundRect(boxX, 400, boxW, 54, 12);
//     ctx.stroke();
//     ctx.fillStyle = "rgba(233,196,106,0.08)";
//     ctx.beginPath();
//     ctx.roundRect(boxX, 400, boxW, 54, 12);
//     ctx.fill();
//     ctx.fillStyle = "#e9c46a";
//     ctx.fillText(courseTitle, W / 2, 434);

//     // score badge
//     if (score > 0) {
//       ctx.fillStyle = "rgba(233,196,106,0.15)";
//       ctx.strokeStyle = "rgba(233,196,106,0.4)";
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.roundRect(W / 2 - 60, 468, 120, 32, 16);
//       ctx.fill();
//       ctx.stroke();
//       ctx.fillStyle = "#e9c46a";
//       ctx.font = "bold 14px Arial";
//       ctx.fillText(`Score: ${score}%`, W / 2, 489);
//     }

//     hLine(520, 0.25);

//     // ── bottom: seal | date | signature ───────────────────────────────────

//     // Seal
//     const sealX = 160;
//     ctx.strokeStyle = "rgba(233,196,106,0.5)";
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     ctx.arc(sealX, 615, 38, 0, Math.PI * 2);
//     ctx.stroke();
//     ctx.strokeStyle = "rgba(233,196,106,0.25)";
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.arc(sealX, 615, 30, 0, Math.PI * 2);
//     ctx.stroke();
//     ctx.fillStyle = "#e9c46a";
//     ctx.font = "bold 24px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText("✦", sealX, 623);
//     ctx.fillStyle = "rgba(233,196,106,0.5)";
//     ctx.font = "9px Arial";
//     ctx.letterSpacing = "2px";
//     ctx.fillText("OFFICIAL SEAL", sealX, 668);
//     ctx.letterSpacing = "0px";

//     // Date
//     ctx.fillStyle = "rgba(255,255,255,0.3)";
//     ctx.font = "11px Arial";
//     ctx.letterSpacing = "2px";
//     ctx.fillText("ISSUED ON", W / 2, 585);
//     ctx.letterSpacing = "0px";
//     ctx.fillStyle = "white";
//     ctx.font = "bold 15px Arial";
//     ctx.fillText(dateStr, W / 2, 610);
//     ctx.fillStyle = "rgba(255,255,255,0.25)";
//     ctx.font = "11px Arial";
//     ctx.fillText(`ID: ${userId}`, W / 2, 640);

//     // Signature — drawn cursive
//     const sigX = W - 165;

//     ctx.save();
//     ctx.translate(sigX, 590);
//     ctx.strokeStyle = "rgba(233,196,106,0.9)";
//     ctx.lineWidth = 2;
//     ctx.lineCap = "round";
//     ctx.lineJoin = "round";
//     ctx.beginPath();
//     ctx.moveTo(-70, 8);
//     ctx.bezierCurveTo(-75, -16, -52, -20, -42, -6);
//     ctx.bezierCurveTo(-35, 4, -46, 14, -58, 7);
//     ctx.bezierCurveTo(-68, 1, -28, -28, -8, -9);
//     ctx.bezierCurveTo(6, 3, -4, 18, -16, 13);
//     ctx.bezierCurveTo(-28, 8, 8, -26, 28, -7);
//     ctx.bezierCurveTo(44, 6, 30, 20, 17, 15);
//     ctx.bezierCurveTo(4, 10, 42, -18, 66, 1);
//     ctx.bezierCurveTo(82, 13, 68, 24, 52, 19);
//     ctx.stroke();

//     // flourish underline
//     ctx.beginPath();
//     ctx.moveTo(-72, 26);
//     ctx.bezierCurveTo(-38, 20, 18, 30, 74, 18);
//     ctx.bezierCurveTo(86, 15, 90, 26, 76, 32);
//     ctx.strokeStyle = "rgba(233,196,106,0.45)";
//     ctx.lineWidth = 1.2;
//     ctx.stroke();
//     ctx.restore();

//     // name under signature
//     ctx.fillStyle = "rgba(233,196,106,0.75)";
//     ctx.font = "bold 12px Georgia, serif";
//     ctx.textAlign = "center";
//     ctx.fillText("Prof. Dr. Ebtessam Nada", sigX, 640);

//     ctx.strokeStyle = "rgba(233,196,106,0.25)";
//     ctx.lineWidth = 0.5;
//     ctx.beginPath();
//     ctx.moveTo(sigX - 82, 648);
//     ctx.lineTo(sigX + 82, 648);
//     ctx.stroke();

//     ctx.fillStyle = "rgba(255,255,255,0.25)";
//     ctx.font = "10px Arial";
//     ctx.letterSpacing = "2px";
//     ctx.fillText("INSTRUCTOR", sigX, 662);
//     ctx.letterSpacing = "0px";
//   }

//   function downloadPNG() {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const link = document.createElement("a");
//     link.download = `certificate-${courseTitle.replace(/\s+/g, "-")}.png`;
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   }

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
//         <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#e9c46a]/20">
//           <canvas ref={canvasRef} className="w-full h-auto block" />
//         </div>
//         <div className="flex items-center gap-3 mt-4">
//           <button
//             onClick={onClose}
//             className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-[14px] transition-all"
//           >
//             {t("Close", "إغلاق")}
//           </button>
//           <button
//             onClick={downloadPNG}
//             className="flex-1 bg-[#e9c46a] hover:bg-[#f0d080] text-[#0a2540] font-bold py-3 rounded-2xl text-[14px] transition-all flex items-center justify-center gap-2"
//           >
//             <GraduationCap className="w-4 h-4" />
//             {t("Download Certificate", "تحميل الشهادة")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Loader2,
  FileText,
  PlayCircle,
  HelpCircle,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Menu,
  ShieldAlert,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface QuizQuestion {
  id: string;
  questionEn: string;
  questionAr: string | null;
  options: { id: string; textEn: string; textAr: string }[];
  correctOption: string;
}
interface LessonQuiz {
  id: string;
  passingScore: number;
  questions: QuizQuestion[];
}
interface LessonProgress {
  videoWatched: boolean;
  quizPassed: boolean;
}
interface Lesson {
  id: string;
  order: number;
  titleEn: string;
  titleAr: string | null;
  materialUrl: string | null;
  videoUrl: string | null;
  quiz: LessonQuiz | null;
  progress: LessonProgress;
  unlocked: boolean;
}
interface FinalExam {
  id: string;
  passingScore: number;
  questions: QuizQuestion[];
}
interface Course {
  id: string;
  title: string;
  titleAr: string | null;
  lessons: Lesson[];
  finalExam: FinalExam | null;
  enrollment: { id: string; progress: number; status: string } | null;
}

// ══════════════════════════════════════════════════════════════════════════════
export default function CourseLearnPage({ courseId }: { courseId: string }) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [view, setView] = useState<"video" | "material" | "quiz" | "finalExam">(
    "video",
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [markingDone, setMarkingDone] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [lastScore, setLastScore] = useState<number>(0);

  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [muted, setMuted] = useState(false);

  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  // ── FIX: useRef to always have the latest activeLesson in callbacks ────────
  const activeLessonRef = useRef<Lesson | null>(null);
  useEffect(() => {
    activeLessonRef.current = activeLesson;
  }, [activeLesson]);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/courses/${courseId}`);
      const d = await r.json();
      if (d.success) {
        setCourse(d.data);
        const first =
          d.data.lessons.find((l: Lesson) => l.unlocked) ?? d.data.lessons[0];
        setActiveLesson((prev) =>
          prev
            ? (d.data.lessons.find((l: Lesson) => l.id === prev.id) ?? first)
            : first,
        );
      }
    } catch {}
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setUserName(d.data.fullName);
          setUserId(d.data.id.slice(0, 8).toUpperCase());
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeLesson?.videoUrl || view !== "video") {
      setEmbedUrl(null);
      return;
    }
    setVideoLoading(true);
    fetch(`/api/courses/${courseId}/video?lessonId=${activeLesson.id}`)
      .then((r) => r.json())
      .then((d) => setEmbedUrl(d.success ? d.embedUrl : null))
      .catch(() => setEmbedUrl(null))
      .finally(() => setVideoLoading(false));
  }, [activeLesson?.id, view, courseId]); // eslint-disable-line

  async function markWatched() {
    if (!activeLesson || activeLesson.progress.videoWatched) return;
    setMarkingDone(true);
    await fetch(`/api/courses/${courseId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: activeLesson.id }),
    });
    await load();
    setMarkingDone(false);
  }

  function goToLesson(lesson: Lesson) {
    if (!lesson.unlocked) return;
    setActiveLesson(lesson);
    setView("video");
    setEmbedUrl(null);
  }

  // ── FIX: onPassed — single load() call, then read updated state via ref ───
  const handleQuizPassed = useCallback(async () => {
    await load();
    // After load(), setCourse runs and triggers setActiveLesson to update to
    // the refreshed lesson object. Now find the next unlocked lesson.
    const currentId = activeLessonRef.current?.id;
    setCourse((prev) => {
      if (!prev || !currentId) return prev;
      const idx = prev.lessons.findIndex((l) => l.id === currentId);
      const next = prev.lessons[idx + 1];
      if (next?.unlocked) {
        // Use a small timeout so setCourse finishes before we navigate
        setTimeout(() => {
          setActiveLesson(next);
          setView("video");
          setEmbedUrl(null);
        }, 0);
      }
      return prev;
    });
  }, [load]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0d1b2e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
      </div>
    );

  if (!course || !course.enrollment)
    return (
      <div className="min-h-screen bg-[#0d1b2e] flex flex-col items-center justify-center gap-4">
        <p className="text-white/40">{t("Not enrolled", "غير مسجّل")}</p>
        <button
          onClick={() => router.push(`/dashboard/courses/${courseId}`)}
          className="bg-[#00b4d8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0096b4] transition-all"
        >
          {t("Go to Course", "الذهاب للكورس")}
        </button>
      </div>
    );

  const lessons = course.lessons;
  const totalLessons = lessons.length;
  const activeIdx = lessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = activeIdx > 0 ? lessons[activeIdx - 1] : null;
  const nextLesson =
    activeIdx < totalLessons - 1 ? lessons[activeIdx + 1] : null;
  const allDone = lessons.every(
    (l) => l.progress.quizPassed || (!l.quiz && l.progress.videoWatched),
  );
  const courseTitle = isRTL && course.titleAr ? course.titleAr : course.title;
  const lessonTitle = activeLesson
    ? isRTL && activeLesson.titleAr
      ? activeLesson.titleAr
      : activeLesson.titleEn
    : "";

  const activeEmbedUrl = embedUrl
    ? muted
      ? `${embedUrl}&mute=1`
      : embedUrl
    : null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0d1b2e] flex flex-col"
    >
      {/* ── TOP BAR ──────────────────────────────────────────────────────────── */}
      <header className="bg-[#0a2540] border-b border-white/[0.07] px-6 py-4 flex items-center justify-between flex-shrink-0 z-30">
        <div
          className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={() => router.push(`/dashboard/courses/${courseId}`)}
            className="w-9 h-9 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white/60 hover:text-white flex items-center justify-center transition-all"
          >
            {isRTL ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
          </button>
          <div className={isRTL ? "text-right" : ""}>
            <p className="text-white font-bold text-[14px] leading-tight line-clamp-1">
              {courseTitle}
            </p>
            {lessonTitle && (
              <p className="text-white/40 text-[11px] mt-0.5 line-clamp-1">
                {lessonTitle}
              </p>
            )}
          </div>
        </div>

        <div
          className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00b4d8] rounded-full transition-all duration-700"
                style={{ width: `${course.enrollment.progress}%` }}
              />
            </div>
            <span className="text-[#00b4d8] text-[12px] font-bold">
              {course.enrollment.progress}%
            </span>
          </div>

          {course.enrollment.status === "COMPLETED" && (
            <button
              onClick={() => setShowCert(true)}
              className={`flex items-center gap-1.5 bg-[#e9c46a]/20 text-[#e9c46a] border border-[#e9c46a]/30 px-3 py-2 rounded-xl text-[12px] font-bold hover:bg-[#e9c46a]/30 transition-all ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {t("Certificate", "الشهادة")}
            </button>
          )}

          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="w-9 h-9 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white/60 hover:text-white flex items-center justify-center transition-all"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────────────────────── */}
      <div
        className={`flex flex-1 overflow-hidden ${isRTL ? "flex-row-reverse" : ""}`}
      >
        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {activeLesson && (
            <>
              {/* TABS */}
              <div
                className={`flex items-center gap-1 px-6 py-3 bg-[#0a2540] border-b border-white/[0.07] flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                {[
                  {
                    key: "video" as const,
                    Icon: PlayCircle,
                    label: t("Video", "الفيديو"),
                    show: !!activeLesson.videoUrl,
                  },
                  {
                    key: "material" as const,
                    Icon: FileText,
                    label: t("Material", "الماتريال"),
                    show: !!activeLesson.materialUrl,
                  },
                  {
                    key: "quiz" as const,
                    Icon: HelpCircle,
                    label: t("Quiz", "الكويز"),
                    show: !!activeLesson.quiz,
                  },
                ]
                  .filter((tab) => tab.show)
                  .map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setView(tab.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${isRTL ? "flex-row-reverse" : ""} ${
                        view === tab.key
                          ? "bg-white/[0.12] text-white border border-white/[0.1]"
                          : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
                      }`}
                    >
                      <tab.Icon className="w-4 h-4" />
                      {tab.label}
                      {tab.key === "quiz" &&
                        activeLesson.progress.quizPassed && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                    </button>
                  ))}
              </div>

              {/* VIDEO */}
              {view === "video" && (
                <div className="flex flex-col flex-1">
                  {/* player */}
                  <div
                    className="w-full bg-black relative select-none"
                    style={{ aspectRatio: "16/9" }}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {videoLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0a1f35]">
                        <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
                      </div>
                    ) : activeEmbedUrl ? (
                      <>
                        <div className="absolute inset-0 z-10 pointer-events-none" />
                        <iframe
                          key={`${activeLesson.id}-${muted}`}
                          src={activeEmbedUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          referrerPolicy="strict-origin"
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                        />
                        <div
                          className={`absolute bottom-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <button
                            onClick={() => setMuted((p) => !p)}
                            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                          >
                            {muted ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                          <span className="text-white/60 text-[12px] font-medium select-none flex-1 truncate">
                            {lessonTitle}
                          </span>
                          <button
                            onClick={() => {
                              const el = document.querySelector("iframe");
                              el?.requestFullscreen?.();
                            }}
                            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                          >
                            <Maximize className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1f35] gap-3">
                        <ShieldAlert className="w-10 h-10 text-white/20" />
                        <p className="text-white/30 text-[14px]">
                          {t("Video unavailable", "الفيديو غير متاح")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* content below video */}
                  <div className="px-8 py-6 max-w-3xl space-y-6">
                    {/* lesson header */}
                    <div
                      className={`flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="text-[#00b4d8] text-[11px] font-bold uppercase tracking-widest mb-1">
                          {t(
                            `Lesson ${activeLesson.order}`,
                            `الدرس ${activeLesson.order}`,
                          )}
                        </p>
                        <h2 className="text-white font-bold text-[20px] leading-snug">
                          {lessonTitle}
                        </h2>
                      </div>
                      {activeLesson.unlocked && (
                        <button
                          onClick={markWatched}
                          disabled={
                            activeLesson.progress.videoWatched || markingDone
                          }
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold border transition-all flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""} ${
                            activeLesson.progress.videoWatched
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-default"
                              : "bg-white/10 text-white/70 border-white/20 hover:bg-[#00b4d8]/20 hover:text-[#00b4d8] hover:border-[#00b4d8]/40"
                          }`}
                        >
                          {markingDone ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : activeLesson.progress.videoWatched ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                          {activeLesson.progress.videoWatched
                            ? t("Watched ✓", "تمت المشاهدة ✓")
                            : t("Mark as watched", "تمييز كمشاهَد")}
                        </button>
                      )}
                    </div>

                    {/* navigation */}
                    <div
                      className={`flex items-center gap-3 pt-4 border-t border-white/[0.06] ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <button
                        onClick={() => prevLesson && goToLesson(prevLesson)}
                        disabled={!prevLesson}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/60 hover:text-white disabled:opacity-30 text-[13px] font-semibold transition-all ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        {isRTL ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ChevronLeft className="w-4 h-4" />
                        )}
                        {t("Previous", "السابق")}
                      </button>

                      {activeLesson.quiz &&
                      !activeLesson.progress.quizPassed ? (
                        <button
                          onClick={() => setView("quiz")}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-bold transition-all shadow-lg shadow-amber-500/20 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <HelpCircle className="w-4 h-4" />
                          {t("Take Quiz to Continue", "خذ الكويز للمتابعة")}
                        </button>
                      ) : (
                        <button
                          onClick={() => nextLesson && goToLesson(nextLesson)}
                          disabled={!nextLesson || !nextLesson.unlocked}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00b4d8] hover:bg-[#0096b4] text-white disabled:opacity-30 text-[13px] font-bold transition-all shadow-lg shadow-[#00b4d8]/20 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          {t("Next Lesson", "الدرس التالي")}
                          {isRTL ? (
                            <ChevronLeft className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MATERIAL */}
              {view === "material" && (
                <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
                  {activeLesson.materialUrl ? (
                    <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-2xl">
                      <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-blue-500" />
                      </div>
                      <h3 className="text-[#0a2540] font-bold text-[20px] mb-2">
                        {t("Study Material", "الماتريال")}
                      </h3>
                      <p className="text-slate-400 text-[14px] leading-relaxed mb-7">
                        {t(
                          "Click below to open the study material in Google Drive.",
                          "انقر أدناه لفتح مادة الدراسة في Google Drive.",
                        )}
                      </p>
                      <a
                        href={activeLesson.materialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl text-[15px] transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
                      >
                        <FileText className="w-5 h-5" />
                        {t("Open Material", "فتح الماتريال")}
                      </a>
                    </div>
                  ) : (
                    <p className="text-white/30 text-[14px]">
                      {t("No material", "لا يوجد ماتريال")}
                    </p>
                  )}
                </div>
              )}

              {/* QUIZ */}
              {view === "quiz" && activeLesson.quiz && (
                <QuizSection
                  quiz={activeLesson.quiz}
                  courseId={courseId}
                  alreadyPassed={activeLesson.progress.quizPassed}
                  isRTL={isRTL}
                  t={t}
                  onPassed={handleQuizPassed}
                />
              )}
            </>
          )}

          {/* ALL DONE BANNER */}
          {allDone &&
            course.finalExam &&
            course.enrollment.status !== "COMPLETED" &&
            view !== "finalExam" && (
              <div className="mx-8 mt-8 bg-gradient-to-br from-[#0a2540] to-[#0d3a6e] rounded-2xl p-6 border border-[#e9c46a]/20">
                <div
                  className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#e9c46a]/20 border border-[#e9c46a]/30 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-[#e9c46a]" />
                  </div>
                  <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                    <p className="text-white font-bold text-[16px]">
                      {t(
                        "You're ready for the Final Exam! 🎉",
                        "أنت جاهز للامتحان الشامل! 🎉",
                      )}
                    </p>
                    <p className="text-white/40 text-[13px] mt-0.5">
                      {t(
                        "Pass it to get your certificate",
                        "انجح فيه للحصول على شهادتك",
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setView("finalExam")}
                    className={`flex items-center gap-2 bg-[#e9c46a] hover:bg-[#f0d080] text-[#0a2540] font-bold px-5 py-3 rounded-xl text-[14px] transition-all flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Sparkles className="w-4 h-4" />
                    {t("Start Exam", "ابدأ الامتحان")}
                  </button>
                </div>
              </div>
            )}

          {/* FINAL EXAM */}
          {view === "finalExam" && course.finalExam && (
            <FinalExamSection
              exam={course.finalExam}
              courseId={courseId}
              isRTL={isRTL}
              t={t}
              onPassed={(score) => {
                setLastScore(score);
                load();
                setShowCert(true);
              }}
            />
          )}
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <div
          className={`bg-[#0a2540] border-${isRTL ? "l" : "r"} border-white/[0.07] flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ${sidebarOpen ? "w-72" : "w-0"}`}
        >
          {/* sidebar header */}
          <div className="px-5 py-5 border-b border-white/[0.07] flex-shrink-0">
            <h3 className="text-white font-bold text-[14px] mb-4">
              {t("Course Content", "محتوى الكورس")}
            </h3>
            <div className="bg-white/[0.05] rounded-xl p-4 space-y-3">
              <div
                className={`flex items-center justify-between text-[12px] ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className="text-white/40">{t("Progress", "التقدم")}</span>
                <span className="text-[#00b4d8] font-bold">
                  {course.enrollment.progress}%
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00b4d8] rounded-full transition-all duration-700"
                  style={{ width: `${course.enrollment.progress}%` }}
                />
              </div>
              <p className="text-white/25 text-[11px]">
                {
                  lessons.filter(
                    (l) => l.progress.quizPassed || l.progress.videoWatched,
                  ).length
                }{" "}
                / {totalLessons} {t("done", "مكتمل")}
              </p>
            </div>
          </div>

          {/* lesson list */}
          <div className="flex-1 overflow-y-auto py-2">
            {lessons.map((lesson) => {
              const lTitle =
                isRTL && lesson.titleAr ? lesson.titleAr : lesson.titleEn;
              const isActive = lesson.id === activeLesson?.id;
              const done =
                lesson.progress.quizPassed ||
                (!lesson.quiz && lesson.progress.videoWatched);
              return (
                <button
                  key={lesson.id}
                  onClick={() => lesson.unlocked && goToLesson(lesson)}
                  disabled={!lesson.unlocked}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 transition-all ${isRTL ? "flex-row-reverse" : ""} ${
                    isActive
                      ? "bg-[#00b4d8]/15 border-s-2 border-[#00b4d8]"
                      : "hover:bg-white/[0.04]"
                  } ${!lesson.unlocked ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      done
                        ? "bg-emerald-500/20"
                        : isActive
                          ? "bg-[#00b4d8]/20"
                          : "bg-white/[0.06]"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : !lesson.unlocked ? (
                      <Lock className="w-3.5 h-3.5 text-white/20" />
                    ) : (
                      <PlayCircle
                        className={`w-4 h-4 ${isActive ? "text-[#00b4d8]" : "text-white/30"}`}
                      />
                    )}
                  </div>
                  <div
                    className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}
                  >
                    <p
                      className={`text-[13px] font-semibold truncate ${isActive ? "text-white" : done ? "text-white/50" : "text-white/60"}`}
                    >
                      {lTitle}
                    </p>
                    <p className="text-white/25 text-[10px] mt-0.5">
                      {[
                        lesson.materialUrl && t("Material", "ماتريال"),
                        lesson.videoUrl && t("Video", "فيديو"),
                        lesson.quiz && t("Quiz", "كويز"),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] flex-shrink-0" />
                  )}
                </button>
              );
            })}

            {/* final exam entry */}
            {course.finalExam && (
              <button
                onClick={() => allDone && setView("finalExam")}
                disabled={!allDone}
                className={`w-full flex items-center gap-3 px-5 py-3.5 mt-2 border-t border-white/[0.05] transition-all ${isRTL ? "flex-row-reverse" : ""} ${
                  view === "finalExam"
                    ? "bg-[#e9c46a]/15"
                    : allDone
                      ? "hover:bg-white/[0.04] cursor-pointer"
                      : "opacity-30 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    view === "finalExam" ? "bg-[#e9c46a]/20" : "bg-white/[0.06]"
                  }`}
                >
                  <GraduationCap
                    className={`w-4 h-4 ${
                      view === "finalExam"
                        ? "text-[#e9c46a]"
                        : allDone
                          ? "text-[#e9c46a]/60"
                          : "text-white/20"
                    }`}
                  />
                </div>
                <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                  <p
                    className={`text-[13px] font-bold truncate ${view === "finalExam" ? "text-[#e9c46a]" : "text-white/60"}`}
                  >
                    {t("Final Exam", "الامتحان الشامل")}
                  </p>
                  <p className="text-white/25 text-[10px] mt-0.5">
                    {t("Pass = Certificate", "النجاح = شهادة")}
                  </p>
                </div>
                {course.enrollment.status === "COMPLETED" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#e9c46a] flex-shrink-0" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CERTIFICATE MODAL */}
      {showCert && (
        <CertificateModal
          courseTitle={course.title}
          userName={userName}
          userId={userId}
          score={lastScore}
          isRTL={isRTL}
          t={t}
          onClose={() => setShowCert(false)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// QUIZ SECTION
// ══════════════════════════════════════════════════════════════════════════════
function QuizSection({
  quiz,
  courseId,
  alreadyPassed,
  isRTL,
  t,
  onPassed,
}: {
  quiz: LessonQuiz;
  courseId: string;
  alreadyPassed: boolean;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onPassed: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correct: number;
    total: number;
  } | null>(null);

  async function submit() {
    if (Object.keys(answers).length < quiz.questions.length) return;
    setSubmitting(true);
    try {
      const r = await fetch(`/api/courses/${courseId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonQuizId: quiz.id, answers }),
      });
      const d = await r.json();
      if (r.ok && d.success) {
        setResult(d);
        if (d.passed) setTimeout(onPassed, 1500);
      } else {
        console.error("[QuizSection] submit error:", d);
      }
    } catch (err) {
      console.error("[QuizSection] fetch error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (alreadyPassed)
    return (
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-10 text-center max-w-sm">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-white font-bold text-[20px] mb-2">
            {t("Quiz Passed! ✓", "اجتزت الكويز! ✓")}
          </h3>
          <p className="text-white/40 text-[14px]">
            {t("You already passed this quiz.", "لقد اجتزت هذا الكويز مسبقاً.")}
          </p>
        </div>
      </div>
    );

  if (result)
    return (
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div
          className={`${result.passed ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"} border rounded-3xl p-10 text-center max-w-sm`}
        >
          {result.passed ? (
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          ) : (
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          )}
          <h3 className="text-white font-bold text-[24px] mb-2">
            {result.score}%
          </h3>
          <p
            className={`font-bold text-[18px] mb-3 ${result.passed ? "text-emerald-400" : "text-red-400"}`}
          >
            {result.passed
              ? t("Passed! 🎉", "نجحت! 🎉")
              : t("Try Again", "حاول مرة أخرى")}
          </p>
          <p className="text-white/40 text-[14px] mb-6">
            {result.correct} / {result.total} {t("correct", "صحيح")}
          </p>
          {!result.passed && (
            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-[14px] transition-all"
            >
              {t("Retry", "إعادة المحاولة")}
            </button>
          )}
        </div>
      </div>
    );

  return (
    <QuizForm
      questions={quiz.questions}
      isRTL={isRTL}
      t={t}
      submitting={submitting}
      answers={answers}
      setAnswers={setAnswers}
      onSubmit={submit}
      accentColor="#00b4d8"
      submitLabel={t("Submit Quiz", "تسليم الكويز")}
    />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FINAL EXAM SECTION
// ══════════════════════════════════════════════════════════════════════════════
function FinalExamSection({
  exam,
  courseId,
  isRTL,
  t,
  onPassed,
}: {
  exam: FinalExam;
  courseId: string;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onPassed: (score: number) => void;
}) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correct: number;
    total: number;
  } | null>(null);

  async function submit() {
    if (Object.keys(answers).length < exam.questions.length) return;
    setSubmitting(true);
    try {
      const r = await fetch(`/api/courses/${courseId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalExamId: exam.id, answers }),
      });
      const d = await r.json();
      if (r.ok && d.success) {
        setResult(d);
        if (d.passed) setTimeout(() => onPassed(d.score), 1500);
      } else {
        console.error("[FinalExamSection] submit error:", d);
      }
    } catch (err) {
      console.error("[FinalExamSection] fetch error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (!started)
    return (
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="bg-gradient-to-br from-[#0a2540] to-[#0d3a6e] border border-[#e9c46a]/20 rounded-3xl p-10 text-center max-w-md shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-[#e9c46a]/15 border border-[#e9c46a]/30 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-[#e9c46a]" />
          </div>
          <h2 className="text-white font-bold text-[24px] mb-3">
            {t("Final Exam", "الامتحان الشامل")}
          </h2>
          <p className="text-white/40 text-[14px] mb-2">
            {exam.questions.length} {t("questions", "سؤال")}
          </p>
          <p className="text-white/40 text-[14px] mb-8">
            {t(
              "Pass: 60% · Get certificate on success!",
              "نجاح: 60% · شهادة عند النجاح!",
            )}
          </p>
          <button
            onClick={() => setStarted(true)}
            className="inline-flex items-center gap-2 bg-[#e9c46a] hover:bg-[#f0d080] text-[#0a2540] font-bold px-8 py-4 rounded-xl text-[16px] transition-all shadow-lg shadow-[#e9c46a]/20 hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            {t("Start Exam", "ابدأ الامتحان")}
          </button>
        </div>
      </div>
    );

  if (result)
    return (
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div
          className={`${result.passed ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"} border rounded-3xl p-12 text-center max-w-sm`}
        >
          {result.passed ? (
            <Sparkles className="w-16 h-16 text-[#e9c46a] mx-auto mb-4" />
          ) : (
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          )}
          <h3 className="text-white font-bold text-[28px] mb-2">
            {result.score}%
          </h3>
          <p
            className={`font-bold text-[20px] mb-3 ${result.passed ? "text-[#e9c46a]" : "text-red-400"}`}
          >
            {result.passed
              ? t("Congratulations! 🎓", "مبروك! 🎓")
              : t("Not Passed", "لم تنجح")}
          </p>
          <p className="text-white/40 text-[14px] mb-8">
            {result.correct} / {result.total} {t("correct", "صحيح")}
          </p>
          {!result.passed && (
            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
                setStarted(false);
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-[14px] transition-all"
            >
              {t("Try Again", "حاول مرة أخرى")}
            </button>
          )}
        </div>
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-6 space-y-4">
        <div
          className={`flex items-center gap-3 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#e9c46a]/15 border border-[#e9c46a]/30 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#e9c46a]" />
          </div>
          <div className={isRTL ? "text-right" : ""}>
            <h2 className="text-white font-bold text-[20px]">
              {t("Final Exam", "الامتحان الشامل")}
            </h2>
            <p className="text-white/40 text-[13px]">
              {exam.questions.length}{" "}
              {t("questions · pass: 60%", "سؤال · نجاح: 60%")}
            </p>
          </div>
        </div>
        <QuizForm
          questions={exam.questions}
          isRTL={isRTL}
          t={t}
          submitting={submitting}
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={submit}
          accentColor="#e9c46a"
          submitLabel={t("Submit Exam", "تسليم الامتحان")}
        />
      </div>
    </div>
  );
}

// ── shared quiz form ──────────────────────────────────────────────────────────
function QuizForm({
  questions,
  isRTL,
  t,
  submitting,
  answers,
  setAnswers,
  onSubmit,
  accentColor,
  submitLabel,
}: {
  questions: QuizQuestion[];
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  submitting: boolean;
  answers: Record<string, string>;
  setAnswers: (
    fn: (p: Record<string, string>) => Record<string, string>,
  ) => void;
  onSubmit: () => void;
  accentColor: string;
  submitLabel: string;
}) {
  return (
    <div className="space-y-5">
      {questions.map((q, qi) => {
        const qText = isRTL && q.questionAr ? q.questionAr : q.questionEn;
        return (
          <div
            key={q.id}
            className="bg-white/[0.06] lg:w-[80%] mx-auto mt-7 rounded-2xl border border-white/[0.08] p-5 space-y-4"
          >
            <p
              className={`text-white font-bold text-[15px] leading-relaxed ${isRTL ? "text-right" : ""}`}
            >
              <span style={{ color: accentColor }} className="me-2">
                Q{qi + 1}.
              </span>
              {qText}
            </p>
            <div className="space-y-2.5">
              {q.options.map((opt, oi) => {
                const optText = isRTL && opt.textAr ? opt.textAr : opt.textEn;
                const isSelected = answers[q.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() =>
                      setAnswers((p) => ({ ...p, [q.id]: opt.id }))
                    }
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${isRTL ? "flex-row-reverse text-right" : ""}`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: `${accentColor}22`,
                            borderColor: `${accentColor}80`,
                          }
                        : {
                            backgroundColor: "rgba(255,255,255,0.04)",
                            borderColor: "rgba(255,255,255,0.08)",
                          }
                    }
                  >
                    <div
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={
                        isSelected
                          ? {
                              borderColor: accentColor,
                              backgroundColor: accentColor,
                            }
                          : { borderColor: "rgba(255,255,255,0.2)" }
                      }
                    >
                      {isSelected && (
                        <CheckCircle2
                          className="w-3.5 h-3.5"
                          style={{
                            color:
                              accentColor === "#e9c46a" ? "#0a2540" : "white",
                          }}
                        />
                      )}
                    </div>
                    <span className="text-white/40 font-bold text-[12px] flex-shrink-0 w-5">
                      {["A", "B", "C", "D"][oi]}
                    </span>
                    <span className="text-[14px] font-medium text-white/80">
                      {optText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        onClick={onSubmit}
        disabled={submitting || Object.keys(answers).length < questions.length}
        className="w-full lg:w-[80%] mx-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 rounded-xl text-[15px] transition-all shadow-lg"
        style={{
          backgroundColor: accentColor,
          color: accentColor === "#e9c46a" ? "#0a2540" : "white",
        }}
      >
        {submitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <GraduationCap className="w-5 h-5" />
        )}
        {submitting ? t("Grading...", "جاري التصحيح...") : submitLabel}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CERTIFICATE MODAL — canvas PNG (English only + hand-drawn signature)
// ══════════════════════════════════════════════════════════════════════════════
function CertificateModal({
  courseTitle,
  userName,
  userId,
  score,
  isRTL,
  t,
  onClose,
}: {
  courseTitle: string;
  userName: string;
  userId: string;
  score: number;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    drawCertificate();
  }, []); // eslint-disable-line

  function drawCertificate() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = 1122,
      H = 794;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0a2540");
    bg.addColorStop(0.5, "#0d3a6e");
    bg.addColorStop(1, "#0a2540");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // radial glow
    const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 500);
    glow.addColorStop(0, "rgba(233,196,106,0.07)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // outer border
    ctx.strokeStyle = "rgba(233,196,106,0.7)";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // inner border
    ctx.strokeStyle = "rgba(233,196,106,0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(34, 34, W - 68, H - 68);

    // corner ornaments
    const corners: [number, number][] = [
      [30, 30],
      [W - 30, 30],
      [30, H - 30],
      [W - 30, H - 30],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(233,196,106,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(-15, -15, 30, 30);
      ctx.stroke();
      ctx.fillStyle = "rgba(233,196,106,0.35)";
      ctx.save();
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-5, -5, 10, 10);
      ctx.restore();
      ctx.restore();
    });

    function hLine(y: number, opacity = 0.3) {
      const grad = ctx.createLinearGradient(50, y, W - 50, y);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.3, `rgba(233,196,106,${opacity})`);
      grad.addColorStop(0.7, `rgba(233,196,106,${opacity})`);
      grad.addColorStop(1, "transparent");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(W - 50, y);
      ctx.stroke();
    }

    // academy name
    ctx.fillStyle = "rgba(233,196,106,0.6)";
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.letterSpacing = "4px";
    ctx.fillText("EN-AVM ACADEMY", W / 2, 80);
    ctx.letterSpacing = "0px";

    hLine(100);

    ctx.fillStyle = "rgba(233,196,106,0.45)";
    ctx.font = "12px Arial";
    ctx.fillText("CERTIFICATE OF COMPLETION", W / 2, 135);

    // main title — English only
    ctx.fillStyle = "white";
    ctx.font = "bold 52px Georgia, serif";
    ctx.fillText("Certificate of Completion", W / 2, 210);

    hLine(235, 0.4);

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "14px Arial";
    ctx.fillText("This certificate is proudly presented to", W / 2, 280);

    // student name
    ctx.fillStyle = "white";
    ctx.font = "bold 38px Georgia, serif";
    ctx.fillText(userName || "Student", W / 2, 340);

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "14px Arial";
    ctx.fillText("for successfully completing", W / 2, 385);

    // course title box
    ctx.font = "bold 22px Georgia, serif";
    const boxW = Math.min(700, ctx.measureText(courseTitle).width + 80);
    const boxX = (W - boxW) / 2;
    ctx.strokeStyle = "rgba(233,196,106,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX, 400, boxW, 54, 12);
    ctx.stroke();
    ctx.fillStyle = "rgba(233,196,106,0.08)";
    ctx.beginPath();
    ctx.roundRect(boxX, 400, boxW, 54, 12);
    ctx.fill();
    ctx.fillStyle = "#e9c46a";
    ctx.fillText(courseTitle, W / 2, 434);

    // score badge
    if (score > 0) {
      ctx.fillStyle = "rgba(233,196,106,0.15)";
      ctx.strokeStyle = "rgba(233,196,106,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 60, 468, 120, 32, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#e9c46a";
      ctx.font = "bold 14px Arial";
      ctx.fillText(`Score: ${score}%`, W / 2, 489);
    }

    hLine(520, 0.25);

    // ── bottom: seal | date | signature ───────────────────────────────────

    // Seal
    const sealX = 160;
    ctx.strokeStyle = "rgba(233,196,106,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, 615, 38, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(233,196,106,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sealX, 615, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#e9c46a";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("✦", sealX, 623);
    ctx.fillStyle = "rgba(233,196,106,0.5)";
    ctx.font = "9px Arial";
    ctx.letterSpacing = "2px";
    ctx.fillText("OFFICIAL SEAL", sealX, 668);
    ctx.letterSpacing = "0px";

    // Date
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "11px Arial";
    ctx.letterSpacing = "2px";
    ctx.fillText("ISSUED ON", W / 2, 585);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = "white";
    ctx.font = "bold 15px Arial";
    ctx.fillText(dateStr, W / 2, 610);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "11px Arial";
    ctx.fillText(`ID: ${userId}`, W / 2, 640);

    // Signature — drawn cursive
    const sigX = W - 165;

    ctx.save();
    ctx.translate(sigX, 590);
    ctx.strokeStyle = "rgba(233,196,106,0.9)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-70, 8);
    ctx.bezierCurveTo(-75, -16, -52, -20, -42, -6);
    ctx.bezierCurveTo(-35, 4, -46, 14, -58, 7);
    ctx.bezierCurveTo(-68, 1, -28, -28, -8, -9);
    ctx.bezierCurveTo(6, 3, -4, 18, -16, 13);
    ctx.bezierCurveTo(-28, 8, 8, -26, 28, -7);
    ctx.bezierCurveTo(44, 6, 30, 20, 17, 15);
    ctx.bezierCurveTo(4, 10, 42, -18, 66, 1);
    ctx.bezierCurveTo(82, 13, 68, 24, 52, 19);
    ctx.stroke();

    // flourish underline
    ctx.beginPath();
    ctx.moveTo(-72, 26);
    ctx.bezierCurveTo(-38, 20, 18, 30, 74, 18);
    ctx.bezierCurveTo(86, 15, 90, 26, 76, 32);
    ctx.strokeStyle = "rgba(233,196,106,0.45)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // name under signature
    ctx.fillStyle = "rgba(233,196,106,0.75)";
    ctx.font = "bold 12px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Prof. Dr. Ebtessam Nada", sigX, 640);

    ctx.strokeStyle = "rgba(233,196,106,0.25)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(sigX - 82, 648);
    ctx.lineTo(sigX + 82, 648);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "10px Arial";
    ctx.letterSpacing = "2px";
    ctx.fillText("INSTRUCTOR", sigX, 662);
    ctx.letterSpacing = "0px";
  }

  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `certificate-${courseTitle.replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#e9c46a]/20">
          <canvas ref={canvasRef} className="w-full h-auto block" />
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-[14px] transition-all"
          >
            {t("Close", "إغلاق")}
          </button>
          <button
            onClick={downloadPNG}
            className="flex-1 bg-[#e9c46a] hover:bg-[#f0d080] text-[#0a2540] font-bold py-3 rounded-2xl text-[14px] transition-all flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            {t("Download Certificate", "تحميل الشهادة")}
          </button>
        </div>
      </div>
    </div>
  );
}
