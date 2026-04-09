// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useLanguage } from "@/app/hooks/useLanguage";
// import { useRouter } from "next/navigation";
// import {
//   CheckCircle2,
//   Circle,
//   Lock,
//   Loader2,
//   ArrowLeft,
//   ArrowRight,
//   GraduationCap,
//   PlayCircle,
//   ChevronDown,
//   Sparkles,
// } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface VideoProgress {
//   videoIndex: number;
//   watched: boolean;
// }
// interface Enrollment {
//   id: string;
//   progress: number;
//   status: string;
//   videoProgress: VideoProgress[];
//   certificate: { id: string; issuedAt: string } | null;
// }
// interface Course {
//   id: string;
//   title: string;
//   titleAr: string | null;
//   description: string | null;
//   descriptionAr: string | null;
//   videoUrls: string[];
//   price: number;
//   language: string;
//   imageUrl: string | null;
//   _count: { enrollments: number };
//   enrollments: Enrollment[];
// }

// function toEmbed(url: string) {
//   try {
//     const u = new URL(url);
//     if (u.hostname.includes("youtu.be"))
//       return `https://www.youtube.com/embed/${u.pathname.slice(1)}?rel=0&modestbranding=1`;
//     const v = u.searchParams.get("v");
//     if (v) return `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`;
//   } catch {}
//   return url;
// }

// // ─── Course Watch Page ────────────────────────────────────────────────────────
// export default function CourseWatchPage({ courseId }: { courseId: string }) {
//   const { t, isRTL } = useLanguage();
//   const router = useRouter();

//   const [course, setCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeIdx, setActiveIdx] = useState(0);
//   const [enrolling, setEnrolling] = useState(false);
//   const [markingDone, setMarkingDone] = useState(false);
//   const [showCert, setShowCert] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     const r = await fetch(`/api/courses/${courseId}`);
//     const d = await r.json();
//     if (d.success) setCourse(d.data);
//     setLoading(false);
//   }, [courseId]);

//   useEffect(() => {
//     let cancelled = false;

//     async function fetchCourse() {
//       const r = await fetch(`/api/courses/${courseId}`);
//       const d = await r.json();
//       if (!cancelled) {
//         if (d.success) setCourse(d.data);
//         setLoading(false);
//       }
//     }

//     fetchCourse();
//     return () => {
//       cancelled = true;
//     };
//   }, [courseId]);

//   if (loading)
//     return (
//       <div className="min-h-screen bg-primary flex items-center justify-center">
//         <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
//       </div>
//     );

//   if (!course)
//     return (
//       <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
//         <p className="text-slate-500">
//           {t("Course not found", "الكورس غير موجود")}
//         </p>
//       </div>
//     );

//   const enrollment = course.enrollments?.[0] ?? null;
//   const enrolled = !!enrollment;
//   const completed = enrollment?.status === "COMPLETED";
//   const progress = enrollment?.progress ?? 0;
//   const cert = enrollment?.certificate;
//   const title = isRTL && course.titleAr ? course.titleAr : course.title;
//   const desc = isRTL ? course.descriptionAr : course.description;
//   const totalVideos = course.videoUrls.length;

//   const isWatched = (i: number) =>
//     enrollment?.videoProgress?.some((v) => v.videoIndex === i && v.watched) ??
//     false;

//   // ── Enroll ──────────────────────────────────────────────────────────────────
//   async function enroll() {
//     setEnrolling(true);
//     setError(null);
//     const r = await fetch(`/api/courses/${courseId}/enroll`, {
//       method: "POST",
//     });
//     const d = await r.json();
//     setEnrolling(false);
//     if (r.ok) {
//       load();
//     } else if (d.error === "insufficient_balance") {
//       setError(
//         t(
//           `Insufficient balance. You need ${d.required} EGP but have ${d.available} EGP.`,
//           `رصيد غير كافٍ. تحتاج ${d.required} جنيه ولديك ${d.available} جنيه.`,
//         ),
//       );
//     } else setError(d.error);
//   }

//   // ── Mark video watched ──────────────────────────────────────────────────────
//   async function markWatched(idx: number) {
//     if (!enrolled || isWatched(idx)) return;
//     setMarkingDone(true);
//     const r = await fetch(`/api/courses/${courseId}/progress`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ videoIndex: idx }),
//     });
//     const d = await r.json();
//     setMarkingDone(false);
//     if (r.ok) {
//       await load();
//       if (d.completed) {
//         setShowCert(true);
//       }
//     }
//   }

//   const currentWatched = isWatched(activeIdx);

//   return (
//     <div
//       dir={isRTL ? "rtl" : "ltr"}
//       className="min-h-screen bg-[#0d1b2e] flex flex-col"
//     >
//       {/* ── Top bar ─────────────────────────────────────────────────────── */}
//       <header className="bg-primary border-b border-white/[0.07] px-6 py-4 flex items-center justify-between flex-shrink-0 z-30">
//         <div
//           className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
//         >
//           <button
//             onClick={() => router.push("/dashboard/courses")}
//             className="w-9 h-9 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white/60 hover:text-white flex items-center justify-center transition-all"
//           >
//             {isRTL ? (
//               <ArrowRight className="w-4 h-4" />
//             ) : (
//               <ArrowLeft className="w-4 h-4" />
//             )}
//           </button>
//           <div className={isRTL ? "text-right" : ""}>
//             <p className="text-white font-bold text-[15px] leading-tight line-clamp-1">
//               {title}
//             </p>
//             <p className="text-white/40 text-[12px] mt-0.5">
//               {t(
//                 `Lesson ${activeIdx + 1} of ${totalVideos}`,
//                 `الدرس ${activeIdx + 1} من ${totalVideos}`,
//               )}
//             </p>
//           </div>
//         </div>

//         {/* progress pill */}
//         {enrolled && (
//           <div
//             className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
//           >
//             <div className="hidden sm:flex items-center gap-2">
//               <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
//                 <div
//                   className={`h-full rounded-full transition-all duration-700 ${progress === 100 ? "bg-emerald-400" : "bg-secondary"}`}
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//               <span
//                 className={`text-[12px] font-bold ${progress === 100 ? "text-emerald-400" : "text-[#00b4d8]"}`}
//               >
//                 {progress}%
//               </span>
//             </div>
//             {cert && (
//               <button
//                 onClick={() => setShowCert(true)}
//                 className="flex items-center gap-1.5 bg-[#e9c46a]/20 text-[#e9c46a] border border-[#e9c46a]/30 px-3.5 py-2 rounded-xl text-[12px] font-bold hover:bg-[#e9c46a]/30 transition-all"
//               >
//                 <GraduationCap className="w-3.5 h-3.5" />
//                 {t("Certificate", "الشهادة")}
//               </button>
//             )}
//           </div>
//         )}
//       </header>

//       {/* ── Body ────────────────────────────────────────────────────────── */}
//       <div
//         className={`flex flex-1 overflow-hidden ${isRTL ? "flex-row-reverse" : ""}`}
//       >
//         {/* ── Video area ──────────────────────────────────────────────── */}
//         <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
//           {/* video player */}
//           <div className="w-full bg-black aspect-video relative">
//             {enrolled ? (
//               <iframe
//                 key={activeIdx}
//                 src={toEmbed(course.videoUrls[activeIdx])}
//                 className="w-full h-full"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               />
//             ) : (
//               /* not enrolled overlay */
//               <div className="w-full h-full flex flex-col items-center justify-center bg-primary gap-6 p-8">
//                 <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
//                   <Lock className="w-9 h-9 text-white/30" />
//                 </div>
//                 <div className="text-center max-w-sm">
//                   <p className="text-white font-bold text-[20px] mb-2">
//                     {t("Enroll to Watch", "سجّل لمشاهدة الكورس")}
//                   </p>
//                   <p className="text-white/40 text-[14px] leading-relaxed">
//                     {course.price === 0
//                       ? t(
//                           "This course is free. Enroll now to start learning.",
//                           "الكورس مجاني. سجّل الآن للبدء.",
//                         )
//                       : t(
//                           `Enroll for ${course.price} EGP to access all lessons.`,
//                           `سجّل مقابل ${course.price} جنيه للوصول لكل الدروس.`,
//                         )}
//                   </p>
//                 </div>
//                 {error && (
//                   <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-2xl text-[13px] text-center max-w-sm">
//                     {error}
//                     {error.includes("balance") || error.includes("رصيد") ? (
//                       <button
//                         onClick={() => router.push("/dashboard/profile")}
//                         className="block mt-2 text-[#00b4d8] underline font-semibold"
//                       >
//                         {t("Recharge balance →", "إعادة شحن الرصيد ←")}
//                       </button>
//                     ) : null}
//                   </div>
//                 )}
//                 <button
//                   onClick={enroll}
//                   disabled={enrolling}
//                   className="flex items-center gap-2 bg-secondary hover:bg-[#0096b4] text-white font-bold px-8 py-4 rounded-2xl text-[15px] transition-all shadow-2xl shadow-[#00b4d8]/30 hover:-translate-y-0.5 disabled:opacity-60"
//                 >
//                   {enrolling ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <PlayCircle className="w-4 h-4" />
//                   )}
//                   {course.price === 0
//                     ? t("Enroll Free", "سجّل مجاناً")
//                     : t(
//                         `Enroll for ${course.price} EGP`,
//                         `سجّل مقابل ${course.price} جنيه`,
//                       )}
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* below video */}
//           <div className="p-6 space-y-6 max-w-3xl">
//             {/* lesson title + mark done */}
//             <div
//               className={`flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
//             >
//               <div className={isRTL ? "text-right" : ""}>
//                 <div className="text-[#00b4d8] text-[12px] font-bold mb-1 uppercase tracking-wide">
//                   {t(`Lesson ${activeIdx + 1}`, `الدرس ${activeIdx + 1}`)}
//                 </div>
//                 <h2 className="text-white font-bold text-[20px] leading-snug">
//                   {title}
//                 </h2>
//               </div>
//               {enrolled && (
//                 <button
//                   onClick={() => markWatched(activeIdx)}
//                   disabled={currentWatched || markingDone}
//                   className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold border transition-all flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""} ${
//                     currentWatched
//                       ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-default"
//                       : "bg-white/10 text-white/70 border-white/20 hover:bg-secondary/20 hover:text-[#00b4d8] hover:border-[#00b4d8]/40"
//                   }`}
//                 >
//                   {markingDone ? (
//                     <Loader2 className="w-3.5 h-3.5 animate-spin" />
//                   ) : currentWatched ? (
//                     <CheckCircle2 className="w-3.5 h-3.5" />
//                   ) : (
//                     <Circle className="w-3.5 h-3.5" />
//                   )}
//                   {currentWatched
//                     ? t("Watched ✓", "تمت المشاهدة ✓")
//                     : t("Mark as done", "تمييز كمشاهَد")}
//                 </button>
//               )}
//             </div>

//             {/* description */}
//             {desc && (
//               <p
//                 className={`text-white/50 text-[14px] leading-relaxed ${isRTL ? "text-right" : ""}`}
//               >
//                 {desc}
//               </p>
//             )}

//             {/* nav buttons */}
//             {enrolled && (
//               <div
//                 className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
//               >
//                 <button
//                   onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
//                   disabled={activeIdx === 0}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/60 hover:text-white disabled:opacity-30 text-[13px] font-semibold transition-all"
//                 >
//                   {isRTL ? (
//                     <ChevronDown className="w-4 h-4 rotate-90" />
//                   ) : (
//                     <ArrowLeft className="w-4 h-4" />
//                   )}
//                   {t("Previous", "السابق")}
//                 </button>
//                 <button
//                   onClick={() =>
//                     setActiveIdx((i) => Math.min(totalVideos - 1, i + 1))
//                   }
//                   disabled={activeIdx === totalVideos - 1}
//                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-[#0096b4] text-white disabled:opacity-30 text-[13px] font-bold transition-all shadow-lg shadow-[#00b4d8]/20"
//                 >
//                   {t("Next", "التالي")}
//                   {isRTL ? (
//                     <ArrowLeft className="w-4 h-4" />
//                   ) : (
//                     <ArrowRight className="w-4 h-4" />
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── Sidebar ─────────────────────────────────────────────────── */}
//         <div
//           className={`w-80 bg-primary border-${isRTL ? "l" : "r"} border-white/[0.07] flex flex-col flex-shrink-0 overflow-hidden`}
//         >
//           {/* sidebar header */}
//           <div className="p-5 border-b border-white/[0.07] flex-shrink-0">
//             <div
//               className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
//             >
//               <h3 className="text-white font-bold text-[14px]">
//                 {t("Course Content", "محتوى الكورس")}
//               </h3>
//               <span className="text-white/30 text-[12px]">
//                 {totalVideos} {t("lessons", "درس")}
//               </span>
//             </div>

//             {/* overall progress */}
//             {enrolled && (
//               <div className="bg-white/[0.05] rounded-2xl p-4 space-y-2">
//                 <div
//                   className={`flex items-center justify-between text-[12px] ${isRTL ? "flex-row-reverse" : ""}`}
//                 >
//                   <span className="text-white/40">
//                     {t("Your progress", "تقدمك")}
//                   </span>
//                   <span
//                     className={`font-bold ${progress === 100 ? "text-emerald-400" : "text-[#00b4d8]"}`}
//                   >
//                     {progress}%
//                   </span>
//                 </div>
//                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full rounded-full transition-all duration-700 ${progress === 100 ? "bg-emerald-400" : "bg-gradient-to-r from-[#00b4d8] to-[#0096b4]"}`}
//                     style={{ width: `${progress}%` }}
//                   />
//                 </div>
//                 <div
//                   className={`flex items-center gap-2 text-[11px] text-white/30 ${isRTL ? "flex-row-reverse" : ""}`}
//                 >
//                   <CheckCircle2 className="w-3 h-3" />
//                   {enrollment?.videoProgress?.filter((v) => v.watched).length ??
//                     0}{" "}
//                   / {totalVideos} {t("watched", "مشاهَد")}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* lesson list */}
//           <div className="flex-1 overflow-y-auto py-2">
//             {course.videoUrls.map((_, i) => {
//               const watched = isWatched(i);
//               const isActive = i === activeIdx;

//               return (
//                 <button
//                   key={i}
//                   onClick={() => enrolled && setActiveIdx(i)}
//                   disabled={!enrolled}
//                   className={`w-full flex items-center gap-3 px-5 py-4 text-${isRTL ? "right" : "left"} transition-all group ${isRTL ? "flex-row-reverse" : ""} ${
//                     isActive
//                       ? "bg-secondary/15 border-r-2 border-[#00b4d8]"
//                       : "hover:bg-white/[0.04]"
//                   } ${!enrolled ? "cursor-default" : "cursor-pointer"}`}
//                 >
//                   <div
//                     className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
//                       watched
//                         ? "bg-emerald-500/20"
//                         : isActive
//                           ? "bg-secondary/20"
//                           : "bg-white/[0.06]"
//                     }`}
//                   >
//                     {watched ? (
//                       <CheckCircle2 className="w-4 h-4 text-emerald-400" />
//                     ) : enrolled ? (
//                       <PlayCircle
//                         className={`w-4 h-4 ${isActive ? "text-[#00b4d8]" : "text-white/30"}`}
//                       />
//                     ) : (
//                       <Lock className="w-3.5 h-3.5 text-white/20" />
//                     )}
//                   </div>

//                   <div
//                     className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}
//                   >
//                     <p
//                       className={`text-[13px] font-semibold truncate ${isActive ? "text-white" : watched ? "text-white/50" : "text-white/60"}`}
//                     >
//                       {t(`Lesson ${i + 1}`, `الدرس ${i + 1}`)}
//                     </p>
//                   </div>

//                   {isActive && (
//                     <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ── Certificate Modal ────────────────────────────────────────── */}
//       {showCert && cert && course && (
//         <CertificateModal
//           course={course}
//           issuedAt={cert.issuedAt}
//           isRTL={isRTL}
//           t={t}
//           onClose={() => setShowCert(false)}
//         />
//       )}

//       {/* Auto show cert on completion */}
//       {showCert && !cert && completed && (
//         <div
//           className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
//           onClick={() => setShowCert(false)}
//         >
//           <div className="bg-white rounded-3xl p-8 text-center max-w-sm">
//             <Sparkles className="w-12 h-12 text-[#e9c46a] mx-auto mb-4" />
//             <p className="text-[#0a2540] font-bold text-[20px]">
//               {t("Congratulations!", "مبروك!")}
//             </p>
//             <p className="text-slate-500 mt-2">
//               {t("You completed the course!", "أتممت الكورس بنجاح!")}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Certificate Modal ────────────────────────────────────────────────────────
// function CertificateModal({
//   course,
//   issuedAt,
//   isRTL,
//   t,
//   onClose,
// }: {
//   course: Course;
//   issuedAt: string;
//   isRTL: boolean;
//   t: (en: string, ar: string) => string;
//   onClose: () => void;
// }) {
//   const title = isRTL && course.titleAr ? course.titleAr : course.title;
//   const dateStr = new Date(issuedAt).toLocaleDateString(
//     isRTL ? "ar-EG" : "en-US",
//     {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     },
//   );

//   function printCert() {
//     const el = document.getElementById("certificate-print");
//     if (!el) return;
//     const w = window.open("", "_blank");
//     if (!w) return;
//     w.document.write(`
//       <html><head><title>Certificate</title>
//       <style>
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cairo:wght@400;600;700&display=swap');
//         body { margin: 0; padding: 0; background: white; }
//         * { box-sizing: border-box; }
//       </style>
//       </head><body>${el.outerHTML}</body></html>
//     `);
//     w.document.close();
//     setTimeout(() => {
//       w.print();
//     }, 500);
//   }

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
//         {/* Certificate design */}
//         <div
//           id="certificate-print"
//           dir="ltr"
//           className="relative bg-white overflow-hidden shadow-2xl"
//           style={{
//             fontFamily: "'Playfair Display', serif",
//             aspectRatio: "1.414",
//           }}
//         >
//           <div
//             className="absolute inset-0"
//             style={{
//               background:
//                 "linear-gradient(135deg, #0a2540 0%, #0d3a6e 50%, #0a2540 100%)",
//             }}
//           />
//           <div className="absolute inset-3 border-2 border-[#e9c46a]/60 rounded-sm pointer-events-none" />
//           <div className="absolute inset-5 border border-[#e9c46a]/30 rounded-sm pointer-events-none" />

//           {[
//             "top-4 left-4",
//             "top-4 right-4",
//             "bottom-4 left-4",
//             "bottom-4 right-4",
//           ].map((pos, i) => (
//             <div
//               key={i}
//               className={`absolute ${pos} w-12 h-12 flex items-center justify-center`}
//             >
//               <div className="w-8 h-8 border-2 border-[#e9c46a]/50 rotate-45" />
//               <div className="absolute w-3 h-3 bg-[#e9c46a]/40 rotate-45" />
//             </div>
//           ))}

//           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(233,196,106,0.08),transparent_60%)]" />

//           <div className="relative z-10 h-full flex flex-col items-center justify-center px-16 py-10 text-center">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e9c46a]/50" />
//               <div className="flex items-center gap-2 px-4">
//                 <div className="w-8 h-8 rounded-full bg-[#e9c46a]/20 border border-[#e9c46a]/40 flex items-center justify-center">
//                   <Sparkles className="w-4 h-4 text-[#e9c46a]" />
//                 </div>
//                 <span className="text-[#e9c46a]/80 text-[11px] tracking-[0.3em] uppercase font-medium">
//                   EN-AVM Academy
//                 </span>
//               </div>
//               <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e9c46a]/50" />
//             </div>

//             <p
//               className="text-[#e9c46a]/60 text-[12px] tracking-[0.4em] uppercase mb-2"
//               style={{ fontFamily: "system-ui, sans-serif" }}
//             >
//               Certificate of Completion
//             </p>

//             <h1
//               className="text-white text-[42px] font-bold leading-tight mb-1"
//               style={{
//                 fontFamily: "'Playfair Display', serif",
//                 textShadow: "0 2px 20px rgba(233,196,106,0.2)",
//               }}
//             >
//               شهادة إتمام
//             </h1>

//             <div className="flex items-center gap-3 my-5 w-64">
//               <div className="h-px flex-1 bg-[#e9c46a]/40" />
//               <div className="w-1.5 h-1.5 rounded-full bg-[#e9c46a]" />
//               <div className="h-px flex-1 bg-[#e9c46a]/40" />
//             </div>

//             <p
//               className="text-white/50 text-[13px] mb-3 tracking-wide"
//               style={{ fontFamily: "system-ui, sans-serif" }}
//             >
//               This certifies the successful completion of
//             </p>

//             <div className="bg-white/[0.06] border border-[#e9c46a]/20 rounded-2xl px-8 py-4 mb-3">
//               <h2
//                 className="text-[#e9c46a] font-bold text-[22px] leading-snug"
//                 style={{ fontFamily: "'Playfair Display', serif" }}
//               >
//                 {title}
//               </h2>
//             </div>

//             <p
//               className="text-white/50 text-[13px] mb-6"
//               style={{ fontFamily: "system-ui, sans-serif" }}
//             >
//               Having demonstrated full commitment and completed all course
//               requirements
//             </p>

//             <div className="flex items-end justify-between w-full max-w-lg">
//               <div className="flex flex-col items-center gap-1">
//                 <div className="w-16 h-16 rounded-full border-2 border-[#e9c46a]/50 flex items-center justify-center bg-[#e9c46a]/10">
//                   <GraduationCap className="w-7 h-7 text-[#e9c46a]" />
//                 </div>
//                 <p className="text-[#e9c46a]/50 text-[9px] tracking-widest uppercase mt-1">
//                   Official Seal
//                 </p>
//               </div>

//               <div className="text-center">
//                 <p className="text-white/30 text-[10px] tracking-wide uppercase mb-1">
//                   Issued on
//                 </p>
//                 <p className="text-white font-bold text-[14px]">{dateStr}</p>
//               </div>

//               <div className="text-center">
//                 <div className="w-28 h-px bg-[#e9c46a]/40 mb-1" />
//                 <p className="text-white/40 text-[10px] tracking-wide uppercase">
//                   EN-AVM Academy
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex items-center gap-3 mt-4">
//           <button
//             onClick={onClose}
//             className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-[14px] transition-all"
//           >
//             {t("Close", "إغلاق")}
//           </button>
//           <button
//             onClick={printCert}
//             className="flex-1 bg-[#e9c46a] hover:bg-[#f0d080] text-[#0a2540] font-bold py-3 rounded-2xl text-[14px] transition-all flex items-center justify-center gap-2"
//           >
//             <GraduationCap className="w-4 h-4" />
//             {t("Download / Print", "تحميل / طباعة")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
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
