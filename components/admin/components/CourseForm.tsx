// // "use client";

// // import { useState } from "react";
// // import {
// //   Plus,
// //   X,
// //   Loader2,
// //   ImagePlus,
// //   Link as LinkIcon,
// //   ChevronDown,
// //   ChevronUp,
// //   GraduationCap,
// //   BookOpen,
// //   Youtube,
// //   FileText,
// //   Check,
// //   Trash2,
// // } from "lucide-react";
// // import { inp } from "./types";
// // import type { Course } from "./types";

// // // ─── Local Types ──────────────────────────────────────────────────────────────
// // interface QuizOption {
// //   id: string;
// //   textEn: string;
// //   textAr: string;
// // }
// // interface QuizQuestion {
// //   id: string;
// //   questionEn: string;
// //   questionAr: string;
// //   options: QuizOption[];
// //   correctOption: string;
// // }
// // interface LessonData {
// //   id: string;
// //   titleEn: string;
// //   titleAr: string;
// //   materialUrl: string;
// //   videoUrl: string;
// //   hasQuiz: boolean;
// //   quiz: { questions: QuizQuestion[] };
// // }

// // function uid() {
// //   return Math.random().toString(36).slice(2, 10);
// // }
// // function makeOption(): QuizOption {
// //   return { id: uid(), textEn: "", textAr: "" };
// // }
// // function makeQuestion(): QuizQuestion {
// //   const opts = [makeOption(), makeOption(), makeOption(), makeOption()];
// //   return {
// //     id: uid(),
// //     questionEn: "",
// //     questionAr: "",
// //     options: opts,
// //     correctOption: opts[0].id,
// //   };
// // }
// // function makeLesson(n: number): LessonData {
// //   return {
// //     id: uid(),
// //     titleEn: `Lesson ${n}`,
// //     titleAr: `الدرس ${n}`,
// //     materialUrl: "",
// //     videoUrl: "",
// //     hasQuiz: true,
// //     quiz: { questions: [makeQuestion()] },
// //   };
// // }

// // // ══════════════════════════════════════════════════════════════════════════════
// // export function CourseForm({
// //   t,
// //   isRTL,
// //   course,
// //   onBack,
// //   onSuccess,
// //   onError,
// // }: {
// //   t: (en: string, ar: string) => string;
// //   isRTL: boolean;
// //   course?: Course;
// //   onBack: () => void;
// //   onSuccess: (msg: string) => void;
// //   onError: (e: string) => void;
// // }) {
// //   const isEdit = !!course;

// //   const [title, setTitle] = useState(course?.title ?? "");
// //   const [titleAr, setTitleAr] = useState(course?.titleAr ?? "");
// //   const [description, setDesc] = useState(course?.description ?? "");
// //   const [descriptionAr, setDescAr] = useState(course?.descriptionAr ?? "");
// //   const [price, setPrice] = useState(String(course?.price ?? 0));
// //   const [language, setLanguage] = useState(course?.language ?? "AR");
// //   const [published, setPublished] = useState(course?.published ?? false);
// //   const [imageUrl, setImageUrl] = useState(course?.imageUrl ?? "");
// //   const [imageMode, setImageMode] = useState<"url" | "upload">("url");
// //   const [passingScore, setPassingScore] = useState(60);
// //   const [loading, setLoading] = useState(false);

// //   const [lessons, setLessons] = useState<LessonData[]>([makeLesson(1)]);
// //   const [openLesson, setOpenLesson] = useState<string | null>(null);
// //   const [hasFinal, setHasFinal] = useState(true);
// //   const [finalExam, setFinalExam] = useState<{ questions: QuizQuestion[] }>({
// //     questions: [makeQuestion()],
// //   });
// //   const [finalOpen, setFinalOpen] = useState(false);

// //   // ── lesson helpers ──────────────────────────────────────────────────────────
// //   const addLesson = () => {
// //     const l = makeLesson(lessons.length + 1);
// //     setLessons((p) => [...p, l]);
// //     setOpenLesson(l.id);
// //   };
// //   const removeLesson = (id: string) =>
// //     setLessons((p) => p.filter((l) => l.id !== id));
// //   const updateLesson = (id: string, patch: Partial<LessonData>) =>
// //     setLessons((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));
// //   const addQ = (lid: string) =>
// //     setLessons((p) =>
// //       p.map((l) =>
// //         l.id === lid
// //           ? { ...l, quiz: { questions: [...l.quiz.questions, makeQuestion()] } }
// //           : l,
// //       ),
// //     );
// //   const removeQ = (lid: string, qid: string) =>
// //     setLessons((p) =>
// //       p.map((l) =>
// //         l.id === lid
// //           ? {
// //               ...l,
// //               quiz: { questions: l.quiz.questions.filter((q) => q.id !== qid) },
// //             }
// //           : l,
// //       ),
// //     );
// //   const updateQ = (lid: string, qid: string, patch: Partial<QuizQuestion>) =>
// //     setLessons((p) =>
// //       p.map((l) =>
// //         l.id === lid
// //           ? {
// //               ...l,
// //               quiz: {
// //                 questions: l.quiz.questions.map((q) =>
// //                   q.id === qid ? { ...q, ...patch } : q,
// //                 ),
// //               },
// //             }
// //           : l,
// //       ),
// //     );
// //   const updateO = (
// //     lid: string,
// //     qid: string,
// //     oid: string,
// //     patch: Partial<QuizOption>,
// //   ) =>
// //     setLessons((p) =>
// //       p.map((l) =>
// //         l.id === lid
// //           ? {
// //               ...l,
// //               quiz: {
// //                 questions: l.quiz.questions.map((q) =>
// //                   q.id === qid
// //                     ? {
// //                         ...q,
// //                         options: q.options.map((o) =>
// //                           o.id === oid ? { ...o, ...patch } : o,
// //                         ),
// //                       }
// //                     : q,
// //                 ),
// //               },
// //             }
// //           : l,
// //       ),
// //     );

// //   // ── final exam helpers ──────────────────────────────────────────────────────
// //   const addFQ = () =>
// //     setFinalExam((p) => ({ questions: [...p.questions, makeQuestion()] }));
// //   const removeFQ = (qid: string) =>
// //     setFinalExam((p) => ({
// //       questions: p.questions.filter((q) => q.id !== qid),
// //     }));
// //   const updateFQ = (qid: string, patch: Partial<QuizQuestion>) =>
// //     setFinalExam((p) => ({
// //       questions: p.questions.map((q) =>
// //         q.id === qid ? { ...q, ...patch } : q,
// //       ),
// //     }));
// //   const updateFO = (qid: string, oid: string, patch: Partial<QuizOption>) =>
// //     setFinalExam((p) => ({
// //       questions: p.questions.map((q) =>
// //         q.id === qid
// //           ? {
// //               ...q,
// //               options: q.options.map((o) =>
// //                 o.id === oid ? { ...o, ...patch } : o,
// //               ),
// //             }
// //           : q,
// //       ),
// //     }));

// //   function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
// //     const file = e.target.files?.[0];
// //     if (!file) return;
// //     const reader = new FileReader();
// //     reader.onload = (ev) => setImageUrl(ev.target?.result as string);
// //     reader.readAsDataURL(file);
// //   }

// //   async function submit(e: React.FormEvent) {
// //     e.preventDefault();
// //     if (!title.trim()) {
// //       onError(t("Title required", "العنوان مطلوب"));
// //       return;
// //     }
// //     if (!lessons.length) {
// //       onError(t("Add at least one lesson", "أضف درساً"));
// //       return;
// //     }
// //     setLoading(true);
// //     const body = {
// //       title,
// //       titleAr,
// //       description,
// //       descriptionAr,
// //       language,
// //       price: parseFloat(price) || 0,
// //       published,
// //       imageUrl: imageUrl || null,
// //       passingScore,
// //       lessons: lessons.map((l) => ({
// //         titleEn: l.titleEn,
// //         titleAr: l.titleAr,
// //         materialUrl: l.materialUrl || null,
// //         videoUrl: l.videoUrl || null,
// //         quiz:
// //           l.hasQuiz && l.quiz.questions.length
// //             ? {
// //                 passingScore: 60,
// //                 questions: l.quiz.questions.map((q) => ({
// //                   questionEn: q.questionEn,
// //                   questionAr: q.questionAr,
// //                   options: q.options,
// //                   correctOption: q.correctOption,
// //                 })),
// //               }
// //             : null,
// //       })),
// //       finalExam:
// //         hasFinal && finalExam.questions.length
// //           ? {
// //               passingScore,
// //               questions: finalExam.questions.map((q) => ({
// //                 questionEn: q.questionEn,
// //                 questionAr: q.questionAr,
// //                 options: q.options,
// //                 correctOption: q.correctOption,
// //               })),
// //             }
// //           : null,
// //     };
// //     const r = isEdit
// //       ? await fetch(`/api/admin/courses/${course!.id}`, {
// //           method: "PATCH",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(body),
// //         })
// //       : await fetch("/api/admin/courses", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(body),
// //         });
// //     const d = await r.json();
// //     setLoading(false);
// //     if (r.ok)
// //       onSuccess(
// //         isEdit
// //           ? t("Course updated", "تم التحديث")
// //           : t("Course added!", "تم الإضافة!"),
// //       );
// //     else onError(d.error ?? t("Something went wrong", "حدث خطأ"));
// //   }

// //   return (
// //     <div dir={isRTL ? "rtl" : "ltr"}>
// //       {/* breadcrumb */}
// //       <div
// //         className={`flex items-center gap-2 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}
// //       >
// //         <button
// //           onClick={onBack}
// //           className="text-slate-400 hover:text-[#00b4d8] text-[14px] font-semibold transition-colors"
// //         >
// //           {t("← Courses", "الكورسات →")}
// //         </button>
// //         <span className="text-slate-300">/</span>
// //         <span className="text-[#0a2540] font-bold text-[14px]">
// //           {isEdit
// //             ? t("Edit Course", "تعديل الكورس")
// //             : t("Add New Course", "إضافة كورس جديد")}
// //         </span>
// //       </div>

// //       <form onSubmit={submit}>
// //         <div className="grid xl:grid-cols-3 gap-7">
// //           {/* ══ LEFT ══ */}
// //           <div className="xl:col-span-2 space-y-5">
// //             {/* Course Info */}
// //             <Card
// //               icon={BookOpen}
// //               title={t("Course Information", "معلومات الكورس")}
// //             >
// //               <div className="grid sm:grid-cols-2 gap-4">
// //                 <F label={`${t("Title EN", "العنوان EN")} *`}>
// //                   <input
// //                     value={title}
// //                     onChange={(e) => setTitle(e.target.value)}
// //                     required
// //                     placeholder="e.g. Anatomy 101"
// //                     className={inp}
// //                     dir="ltr"
// //                   />
// //                 </F>
// //                 <F label={t("Title AR", "العنوان AR")}>
// //                   <input
// //                     value={titleAr}
// //                     onChange={(e) => setTitleAr(e.target.value)}
// //                     placeholder="مثال: تشريح"
// //                     className={inp}
// //                     dir="rtl"
// //                   />
// //                 </F>
// //                 <F label={t("Description EN", "الوصف EN")}>
// //                   <textarea
// //                     value={description}
// //                     onChange={(e) => setDesc(e.target.value)}
// //                     rows={3}
// //                     className={`${inp} resize-none`}
// //                     dir="ltr"
// //                   />
// //                 </F>
// //                 <F label={t("Description AR", "الوصف AR")}>
// //                   <textarea
// //                     value={descriptionAr}
// //                     onChange={(e) => setDescAr(e.target.value)}
// //                     rows={3}
// //                     className={`${inp} resize-none`}
// //                     dir="rtl"
// //                   />
// //                 </F>
// //               </div>
// //             </Card>

// //             {/* Cover Image */}
// //             <Card
// //               icon={ImagePlus}
// //               title={t("Cover Image", "صورة الغلاف")}
// //               optional
// //             >
// //               <div
// //                 className={`flex gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
// //               >
// //                 {(["url", "upload"] as const).map((m) => (
// //                   <button
// //                     key={m}
// //                     type="button"
// //                     onClick={() => setImageMode(m)}
// //                     className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold border transition-all ${isRTL ? "flex-row-reverse" : ""} ${imageMode === m ? "bg-primary text-white border-[#0a2540]" : "bg-white text-slate-500 border-slate-200 hover:border-[#00b4d8]"}`}
// //                   >
// //                     {m === "url" ? (
// //                       <LinkIcon className="w-3.5 h-3.5" />
// //                     ) : (
// //                       <ImagePlus className="w-3.5 h-3.5" />
// //                     )}
// //                     {m === "url" ? t("URL", "رابط") : t("Upload", "رفع")}
// //                   </button>
// //                 ))}
// //               </div>
// //               {imageMode === "url" ? (
// //                 <input
// //                   value={imageUrl}
// //                   onChange={(e) => setImageUrl(e.target.value)}
// //                   placeholder="https://..."
// //                   className={inp}
// //                   dir="ltr"
// //                 />
// //               ) : (
// //                 <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#00b4d8] rounded-2xl p-8 cursor-pointer transition-colors group">
// //                   <ImagePlus className="w-7 h-7 text-slate-300 group-hover:text-[#00b4d8] mb-2 transition-colors" />
// //                   <p className="text-slate-400 text-[13px]">
// //                     {t("Click to upload", "انقر للرفع")}
// //                   </p>
// //                   <input
// //                     type="file"
// //                     accept="image/*"
// //                     className="hidden"
// //                     onChange={handleImageFile}
// //                   />
// //                 </label>
// //               )}
// //               {imageUrl && (
// //                 <div className="mt-3 relative rounded-xl overflow-hidden h-28 border border-slate-200">
// //                   <img
// //                     src={imageUrl}
// //                     alt="preview"
// //                     className="w-full h-full object-cover"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setImageUrl("")}
// //                     className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center"
// //                   >
// //                     <X className="w-3 h-3" />
// //                   </button>
// //                 </div>
// //               )}
// //             </Card>

// //             {/* ══ LESSONS ══ */}
// //             <div className="space-y-3">
// //               <div
// //                 className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
// //               >
// //                 <h3 className="text-[#0a2540] font-bold text-[18px]">
// //                   {t("Lessons", "الدروس")}{" "}
// //                   <span className="text-slate-300 font-normal text-[14px]">
// //                     ({lessons.length})
// //                   </span>
// //                 </h3>
// //                 <button
// //                   type="button"
// //                   onClick={addLesson}
// //                   className={`flex items-center gap-2 bg-primary hover:bg-[#0d3060] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl transition-all ${isRTL ? "flex-row-reverse" : ""}`}
// //                 >
// //                   <Plus className="w-3.5 h-3.5" />
// //                   {t("Add Lesson", "إضافة درس")}
// //                 </button>
// //               </div>

// //               {lessons.map((lesson, li) => (
// //                 <LessonBlock
// //                   key={lesson.id}
// //                   lesson={lesson}
// //                   index={li}
// //                   isOpen={openLesson === lesson.id}
// //                   onToggle={() =>
// //                     setOpenLesson(openLesson === lesson.id ? null : lesson.id)
// //                   }
// //                   onUpdate={(patch) => updateLesson(lesson.id, patch)}
// //                   onRemove={() => removeLesson(lesson.id)}
// //                   onAddQ={() => addQ(lesson.id)}
// //                   onRemoveQ={(qid) => removeQ(lesson.id, qid)}
// //                   onUpdateQ={(qid, patch) => updateQ(lesson.id, qid, patch)}
// //                   onUpdateO={(qid, oid, patch) =>
// //                     updateO(lesson.id, qid, oid, patch)
// //                   }
// //                   canRemove={lessons.length > 1}
// //                   isRTL={isRTL}
// //                   t={t}
// //                 />
// //               ))}
// //             </div>

// //             {/* ══ FINAL EXAM ══ */}
// //             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
// //               <button
// //                 type="button"
// //                 onClick={() => setFinalOpen((p) => !p)}
// //                 className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
// //               >
// //                 <div
// //                   className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
// //                 >
// //                   <div className="w-9 h-9 rounded-xl bg-[#e9c46a]/15 flex items-center justify-center">
// //                     <GraduationCap className="w-4 h-4 text-[#e9c46a]" />
// //                   </div>
// //                   <div className={isRTL ? "text-right" : ""}>
// //                     <p className="text-[#0a2540] font-bold text-[15px]">
// //                       {t("Final Exam", "الامتحان الشامل")}
// //                     </p>
// //                     <p className="text-slate-400 text-[12px]">
// //                       {finalExam.questions.length}{" "}
// //                       {t(
// //                         "questions · pass = certificate",
// //                         "سؤال · نجاح = شهادة",
// //                       )}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div
// //                   className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
// //                 >
// //                   <div
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       setHasFinal((p) => !p);
// //                     }}
// //                     className={`w-11 h-6 rounded-full transition-colors relative ${hasFinal ? "bg-[#e9c46a]" : "bg-slate-300"}`}
// //                   >
// //                     <div
// //                       className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${hasFinal ? (isRTL ? "right-1" : "left-6") : isRTL ? "right-6" : "left-1"}`}
// //                     />
// //                   </div>
// //                   {finalOpen ? (
// //                     <ChevronUp className="w-4 h-4 text-slate-400" />
// //                   ) : (
// //                     <ChevronDown className="w-4 h-4 text-slate-400" />
// //                   )}
// //                 </div>
// //               </button>

// //               {finalOpen && hasFinal && (
// //                 <div className="px-5 pb-5 border-t border-slate-100 pt-5 space-y-4">
// //                   <div
// //                     className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
// //                   >
// //                     <p className="text-slate-500 text-[12px] font-semibold">
// //                       {t("Pass score: 60%", "نجاح: 60%")}
// //                     </p>
// //                     <button
// //                       type="button"
// //                       onClick={addFQ}
// //                       className={`flex items-center gap-1.5 text-[#00b4d8] hover:text-[#0096b4] text-[13px] font-bold ${isRTL ? "flex-row-reverse" : ""}`}
// //                     >
// //                       <Plus className="w-3.5 h-3.5" />
// //                       {t("Add Question", "إضافة سؤال")}
// //                     </button>
// //                   </div>
// //                   {finalExam.questions.map((q, qi) => (
// //                     <QuestionBlock
// //                       key={q.id}
// //                       question={q}
// //                       index={qi}
// //                       isRTL={isRTL}
// //                       t={t}
// //                       canRemove={finalExam.questions.length > 1}
// //                       onRemove={() => removeFQ(q.id)}
// //                       onUpdate={(patch) => updateFQ(q.id, patch)}
// //                       onUpdateOption={(oid, patch) =>
// //                         updateFO(q.id, oid, patch)
// //                       }
// //                     />
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* ══ RIGHT SIDEBAR ══ */}
// //           <div className="space-y-5">
// //             {/* publish */}
// //             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
// //               <h3 className="text-[#0a2540] font-bold text-[15px] mb-4">
// //                 {t("Publish Settings", "إعدادات النشر")}
// //               </h3>
// //               <div
// //                 onClick={() => setPublished((p) => !p)}
// //                 className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer select-none ${isRTL ? "flex-row-reverse" : ""} ${published ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-slate-50"}`}
// //               >
// //                 <div
// //                   className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${published ? "bg-emerald-500" : "bg-slate-300"}`}
// //                 >
// //                   <div
// //                     className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${published ? (isRTL ? "right-1" : "left-7") : isRTL ? "right-7" : "left-1"}`}
// //                   />
// //                 </div>
// //                 <p
// //                   className={`font-bold text-[14px] ${published ? "text-emerald-700" : "text-slate-500"}`}
// //                 >
// //                   {published ? t("Published", "منشور") : t("Draft", "مسودة")}
// //                 </p>
// //               </div>
// //             </div>

// //             {/* pricing */}
// //             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
// //               <h3 className="text-[#0a2540] font-bold text-[15px]">
// //                 {t("Pricing", "السعر")}
// //               </h3>
// //               <F label={t("Price (EGP)", "السعر (جنيه)")}>
// //                 <div className="relative">
// //                   <input
// //                     type="number"
// //                     min="0"
// //                     step="0.01"
// //                     value={price}
// //                     onChange={(e) => setPrice(e.target.value)}
// //                     placeholder="0"
// //                     className={inp}
// //                   />
// //                   <span
// //                     className={`absolute top-1/2 -translate-y-1/2 text-slate-400 text-[12px] ${isRTL ? "left-4" : "right-4"}`}
// //                   >
// //                     EGP
// //                   </span>
// //                 </div>
// //               </F>
// //               <F label={t("Language", "اللغة")}>
// //                 <select
// //                   value={language}
// //                   onChange={(e) => setLanguage(e.target.value)}
// //                   className={inp}
// //                 >
// //                   <option value="AR">{t("Arabic", "عربي")}</option>
// //                   <option value="EN">{t("English", "إنجليزي")}</option>
// //                   <option value="BOTH">{t("Both", "ثنائي")}</option>
// //                 </select>
// //               </F>
// //               <F label={t("Final exam pass %", "نسبة نجاح الامتحان الشامل %")}>
// //                 <input
// //                   type="number"
// //                   min="0"
// //                   max="100"
// //                   value={passingScore}
// //                   onChange={(e) => setPassingScore(Number(e.target.value))}
// //                   className={inp}
// //                 />
// //               </F>
// //             </div>

// //             {/* summary */}
// //             <div className="bg-primary rounded-2xl p-6">
// //               <p className="text-white/40 text-[11px] uppercase tracking-wider mb-4">
// //                 {t("Summary", "ملخص")}
// //               </p>
// //               {[
// //                 { en: "Lessons", ar: "الدروس", val: lessons.length },
// //                 {
// //                   en: "With Quiz",
// //                   ar: "مع كويز",
// //                   val: lessons.filter((l) => l.hasQuiz).length,
// //                 },
// //                 {
// //                   en: "Final Exam",
// //                   ar: "امتحان شامل",
// //                   val: hasFinal ? t("Yes", "نعم") : t("No", "لا"),
// //                   c: hasFinal ? "#4ade80" : "#94a3b8",
// //                 },
// //                 {
// //                   en: "Price",
// //                   ar: "السعر",
// //                   val:
// //                     parseFloat(price) === 0
// //                       ? t("Free", "مجاني")
// //                       : `${price} EGP`,
// //                 },
// //                 {
// //                   en: "Status",
// //                   ar: "الحالة",
// //                   val: published
// //                     ? t("Published", "منشور")
// //                     : t("Draft", "مسودة"),
// //                   c: published ? "#4ade80" : "#94a3b8",
// //                 },
// //               ].map((row, i) => (
// //                 <div
// //                   key={i}
// //                   className={`flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0 ${isRTL ? "flex-row-reverse" : ""}`}
// //                 >
// //                   <span className="text-white/40 text-[13px]">
// //                     {t(row.en, row.ar)}
// //                   </span>
// //                   <span
// //                     className="font-bold text-[13px] text-white"
// //                     style={row.c ? { color: row.c } : {}}
// //                   >
// //                     {row.val}
// //                   </span>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* submit */}
// //             <div className="space-y-3">
// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-[#0096b4] disabled:opacity-60 text-white font-bold rounded-xl py-4 text-[15px] transition-all shadow-lg shadow-[#00b4d8]/25 hover:-translate-y-0.5"
// //               >
// //                 {loading && <Loader2 className="w-4 h-4 animate-spin" />}
// //                 {isEdit
// //                   ? t("Save Changes", "حفظ التغييرات")
// //                   : t("Add Course", "إضافة الكورس")}
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={onBack}
// //                 className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl py-3.5 text-[14px] transition-all"
// //               >
// //                 {t("Cancel", "إلغاء")}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }

// // // ─── LessonBlock ──────────────────────────────────────────────────────────────
// // function LessonBlock({
// //   lesson,
// //   index,
// //   isOpen,
// //   onToggle,
// //   onUpdate,
// //   onRemove,
// //   onAddQ,
// //   onRemoveQ,
// //   onUpdateQ,
// //   onUpdateO,
// //   canRemove,
// //   isRTL,
// //   t,
// // }: {
// //   lesson: LessonData;
// //   index: number;
// //   isOpen: boolean;
// //   onToggle: () => void;
// //   onUpdate: (p: Partial<LessonData>) => void;
// //   onRemove: () => void;
// //   onAddQ: () => void;
// //   onRemoveQ: (id: string) => void;
// //   onUpdateQ: (id: string, p: Partial<QuizQuestion>) => void;
// //   onUpdateO: (qid: string, oid: string, p: Partial<QuizOption>) => void;
// //   canRemove: boolean;
// //   isRTL: boolean;
// //   t: (en: string, ar: string) => string;
// // }) {
// //   return (
// //     <div
// //       className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isOpen ? "border-[#00b4d8]/30" : "border-slate-100"}`}
// //     >
// //       {isOpen && (
// //         <div className="h-0.5 bg-gradient-to-r from-[#00b4d8] to-[#00b4d8]/20" />
// //       )}

// //       <button
// //         type="button"
// //         onClick={onToggle}
// //         className={`w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
// //       >
// //         <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
// //           <span className="text-white font-bold text-[12px]">{index + 1}</span>
// //         </div>
// //         <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
// //           <p className="text-[#0a2540] font-bold text-[14px] truncate">
// //             {isRTL && lesson.titleAr ? lesson.titleAr : lesson.titleEn}
// //           </p>
// //           <p className="text-slate-400 text-[12px] mt-0.5">
// //             {[
// //               lesson.materialUrl && t("Material", "ماتريال"),
// //               lesson.videoUrl && t("Video", "فيديو"),
// //               lesson.hasQuiz && t("Quiz", "كويز"),
// //             ]
// //               .filter(Boolean)
// //               .join(" · ") || t("Click to edit", "انقر للتعديل")}
// //           </p>
// //         </div>
// //         <div
// //           className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
// //         >
// //           {canRemove && (
// //             <span
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 onRemove();
// //               }}
// //               className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
// //             >
// //               <Trash2 className="w-3.5 h-3.5" />
// //             </span>
// //           )}
// //           {isOpen ? (
// //             <ChevronUp className="w-4 h-4 text-slate-400" />
// //           ) : (
// //             <ChevronDown className="w-4 h-4 text-slate-400" />
// //           )}
// //         </div>
// //       </button>

// //       {isOpen && (
// //         <div className="px-5 pb-6 border-t border-slate-100 pt-5 space-y-5">
// //           <div className="grid sm:grid-cols-2 gap-4">
// //             <F label={`${t("Title EN", "العنوان EN")} *`}>
// //               <input
// //                 value={lesson.titleEn}
// //                 onChange={(e) => onUpdate({ titleEn: e.target.value })}
// //                 required
// //                 className={inp}
// //                 dir="ltr"
// //               />
// //             </F>
// //             <F label={t("Title AR", "العنوان AR")}>
// //               <input
// //                 value={lesson.titleAr}
// //                 onChange={(e) => onUpdate({ titleAr: e.target.value })}
// //                 className={inp}
// //                 dir="rtl"
// //               />
// //             </F>
// //           </div>
// //           <div className="grid sm:grid-cols-2 gap-4">
// //             <F label={t("Material (Google Drive)", "الماتريال (Google Drive)")}>
// //               <div className="relative">
// //                 <FileText
// //                   className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none ${isRTL ? "right-3" : "left-3"}`}
// //                 />
// //                 <input
// //                   value={lesson.materialUrl}
// //                   onChange={(e) => onUpdate({ materialUrl: e.target.value })}
// //                   placeholder="https://drive.google.com/..."
// //                   className={`${inp} ${isRTL ? "pr-9" : "pl-9"}`}
// //                   dir="ltr"
// //                 />
// //               </div>
// //             </F>
// //             <F label={t("Video (YouTube)", "الفيديو (YouTube)")}>
// //               <div className="relative">
// //                 <Youtube
// //                   className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none ${isRTL ? "right-3" : "left-3"}`}
// //                 />
// //                 <input
// //                   value={lesson.videoUrl}
// //                   onChange={(e) => onUpdate({ videoUrl: e.target.value })}
// //                   placeholder="https://youtube.com/watch?v=..."
// //                   className={`${inp} ${isRTL ? "pr-9" : "pl-9"}`}
// //                   dir="ltr"
// //                 />
// //               </div>
// //             </F>
// //           </div>

// //           {/* quiz toggle */}
// //           <div>
// //             <div
// //               onClick={() => onUpdate({ hasQuiz: !lesson.hasQuiz })}
// //               className={`flex items-center gap-3 cursor-pointer select-none mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
// //             >
// //               <div
// //                 className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${lesson.hasQuiz ? "bg-secondary" : "bg-slate-300"}`}
// //               >
// //                 <div
// //                   className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${lesson.hasQuiz ? (isRTL ? "right-0.5" : "left-5") : isRTL ? "right-5" : "left-0.5"}`}
// //                 />
// //               </div>
// //               <span className="text-[#0a2540] font-bold text-[14px]">
// //                 {t("Lesson Quiz", "كويز الدرس")}
// //               </span>
// //               <span className="text-slate-400 text-[12px]">
// //                 {t(
// //                   "(blocks next lesson until passed)",
// //                   "(يحجب الدرس التالي حتى النجاح)",
// //                 )}
// //               </span>
// //             </div>

// //             {lesson.hasQuiz && (
// //               <div className="bg-[#f8f9fc] rounded-2xl border border-slate-200 p-5 space-y-4">
// //                 <div
// //                   className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
// //                 >
// //                   <p className="text-slate-500 text-[12px] font-semibold">
// //                     {lesson.quiz.questions.length}{" "}
// //                     {t("questions · pass: 60%", "سؤال · نجاح: 60%")}
// //                   </p>
// //                   <button
// //                     type="button"
// //                     onClick={onAddQ}
// //                     className={`flex items-center gap-1.5 text-[#00b4d8] hover:text-[#0096b4] text-[13px] font-bold ${isRTL ? "flex-row-reverse" : ""}`}
// //                   >
// //                     <Plus className="w-3.5 h-3.5" />
// //                     {t("Add Question", "إضافة سؤال")}
// //                   </button>
// //                 </div>
// //                 {lesson.quiz.questions.map((q, qi) => (
// //                   <QuestionBlock
// //                     key={q.id}
// //                     question={q}
// //                     index={qi}
// //                     isRTL={isRTL}
// //                     t={t}
// //                     canRemove={lesson.quiz.questions.length > 1}
// //                     onRemove={() => onRemoveQ(q.id)}
// //                     onUpdate={(patch) => onUpdateQ(q.id, patch)}
// //                     onUpdateOption={(oid, patch) => onUpdateO(q.id, oid, patch)}
// //                   />
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ─── QuestionBlock ────────────────────────────────────────────────────────────
// // function QuestionBlock({
// //   question: q,
// //   index,
// //   isRTL,
// //   t,
// //   canRemove,
// //   onRemove,
// //   onUpdate,
// //   onUpdateOption,
// // }: {
// //   question: QuizQuestion;
// //   index: number;
// //   isRTL: boolean;
// //   t: (en: string, ar: string) => string;
// //   canRemove: boolean;
// //   onRemove: () => void;
// //   onUpdate: (p: Partial<QuizQuestion>) => void;
// //   onUpdateOption: (oid: string, p: Partial<QuizOption>) => void;
// // }) {
// //   return (
// //     <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
// //       <div
// //         className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
// //       >
// //         <span className="text-[#00b4d8] font-bold text-[12px]">
// //           {t(`Q${index + 1}`, `س${index + 1}`)}
// //         </span>
// //         {canRemove && (
// //           <button
// //             type="button"
// //             onClick={onRemove}
// //             className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center"
// //           >
// //             <X className="w-3 h-3" />
// //           </button>
// //         )}
// //       </div>
// //       <div className="grid sm:grid-cols-2 gap-3">
// //         <input
// //           value={q.questionEn}
// //           onChange={(e) => onUpdate({ questionEn: e.target.value })}
// //           placeholder={t("Question (EN)", "السؤال (EN)")}
// //           className={`${inp} text-[13px] py-2.5`}
// //           dir="ltr"
// //         />
// //         <input
// //           value={q.questionAr}
// //           onChange={(e) => onUpdate({ questionAr: e.target.value })}
// //           placeholder={t("Question (AR)", "السؤال (AR)")}
// //           className={`${inp} text-[13px] py-2.5`}
// //           dir="rtl"
// //         />
// //       </div>
// //       <div className="space-y-2">
// //         {q.options.map((opt, oi) => (
// //           <div
// //             key={opt.id}
// //             className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
// //           >
// //             <button
// //               type="button"
// //               onClick={() => onUpdate({ correctOption: opt.id })}
// //               className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${q.correctOption === opt.id ? "border-emerald-500 bg-emerald-500" : "border-slate-300 hover:border-emerald-400"}`}
// //             >
// //               {q.correctOption === opt.id && (
// //                 <Check className="w-3 h-3 text-white" />
// //               )}
// //             </button>
// //             <span className="text-slate-400 text-[11px] font-bold w-4 flex-shrink-0">
// //               {["A", "B", "C", "D"][oi]}
// //             </span>
// //             <input
// //               value={opt.textEn}
// //               onChange={(e) =>
// //                 onUpdateOption(opt.id, { textEn: e.target.value })
// //               }
// //               placeholder={t("EN", "EN")}
// //               className={`${inp} text-[13px] py-2 flex-1`}
// //               dir="ltr"
// //             />
// //             <input
// //               value={opt.textAr}
// //               onChange={(e) =>
// //                 onUpdateOption(opt.id, { textAr: e.target.value })
// //               }
// //               placeholder={t("AR", "AR")}
// //               className={`${inp} text-[13px] py-2 flex-1`}
// //               dir="rtl"
// //             />
// //           </div>
// //         ))}
// //       </div>
// //       <p className="text-slate-300 text-[11px]">
// //         {t("Click circle = correct answer", "انقر الدائرة = الإجابة الصحيحة")}
// //       </p>
// //     </div>
// //   );
// // }

// // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // function Card({
// //   title,
// //   icon: Icon,
// //   optional,
// //   children,
// // }: {
// //   title: string;
// //   icon: React.ElementType;
// //   optional?: boolean;
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
// //       <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
// //         <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
// //           <Icon className="w-4 h-4 text-[#00b4d8]" />
// //         </div>
// //         <h3 className="text-[#0a2540] font-bold text-[16px]">{title}</h3>
// //         {optional && (
// //           <span className="text-slate-400 text-[12px]">(optional)</span>
// //         )}
// //       </div>
// //       {children}
// //     </div>
// //   );
// // }

// // function F({ label, children }: { label: string; children: React.ReactNode }) {
// //   return (
// //     <div className="flex flex-col gap-1.5">
// //       <label className="text-slate-600 text-[13px] font-bold">{label}</label>
// //       {children}
// //     </div>
// //   );
// // }
// "use client";

// import { useState } from "react";
// import {
//   Plus,
//   X,
//   Loader2,
//   ImagePlus,
//   Link as LinkIcon,
//   ChevronDown,
//   ChevronUp,
//   GraduationCap,
//   BookOpen,
//   Youtube,
//   FileText,
//   Check,
//   Trash2,
// } from "lucide-react";
// import { inp } from "./types";
// import type { Course } from "./types";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface QuizOption {
//   id: string;
//   text: string;
// }
// interface QuizQuestion {
//   id: string;
//   question: string;
//   options: QuizOption[];
//   correctOption: string;
// }
// interface LessonData {
//   id: string;
//   title: string;
//   materialUrl: string;
//   videoUrl: string;
//   hasQuiz: boolean;
//   quiz: { questions: QuizQuestion[] };
// }

// function uid() {
//   return Math.random().toString(36).slice(2, 10);
// }
// function makeOption(): QuizOption {
//   return { id: uid(), text: "" };
// }
// function makeQuestion(): QuizQuestion {
//   const opts = [makeOption(), makeOption(), makeOption(), makeOption()];
//   return { id: uid(), question: "", options: opts, correctOption: opts[0].id };
// }
// function makeLesson(n: number): LessonData {
//   return {
//     id: uid(),
//     title: `Lesson ${n}`,
//     materialUrl: "",
//     videoUrl: "",
//     hasQuiz: true,
//     quiz: { questions: [makeQuestion()] },
//   };
// }

// // ══════════════════════════════════════════════════════════════════════════════
// export function CourseForm({
//   t,
//   isRTL,
//   course,
//   onBack,
//   onSuccess,
//   onError,
// }: {
//   t: (en: string, ar: string) => string;
//   isRTL: boolean;
//   course?: Course;
//   onBack: () => void;
//   onSuccess: (msg: string) => void;
//   onError: (e: string) => void;
// }) {
//   const isEdit = !!course;

//   const [title, setTitle] = useState(course?.title ?? "");
//   const [description, setDesc] = useState(course?.description ?? "");
//   const [price, setPrice] = useState(String(course?.price ?? 0));
//   const [language, setLanguage] = useState(course?.language ?? "AR");
//   const [published, setPublished] = useState(course?.published ?? false);
//   const [imageUrl, setImageUrl] = useState(course?.imageUrl ?? "");
//   const [imageMode, setImageMode] = useState<"url" | "upload">("url");
//   const [passingScore, setPassingScore] = useState(60);
//   const [loading, setLoading] = useState(false);

//   const [lessons, setLessons] = useState<LessonData[]>([makeLesson(1)]);
//   const [openLesson, setOpenLesson] = useState<string | null>(null);
//   const [hasFinal, setHasFinal] = useState(true);
//   const [finalExam, setFinalExam] = useState<{ questions: QuizQuestion[] }>({
//     questions: [makeQuestion()],
//   });
//   const [finalOpen, setFinalOpen] = useState(false);

//   // ── lesson helpers ──────────────────────────────────────────────────────────
//   const addLesson = () => {
//     const l = makeLesson(lessons.length + 1);
//     setLessons((p) => [...p, l]);
//     setOpenLesson(l.id);
//   };
//   const removeLesson = (id: string) =>
//     setLessons((p) => p.filter((l) => l.id !== id));
//   const updateLesson = (id: string, patch: Partial<LessonData>) =>
//     setLessons((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));
//   const addQ = (lid: string) =>
//     setLessons((p) =>
//       p.map((l) =>
//         l.id === lid
//           ? { ...l, quiz: { questions: [...l.quiz.questions, makeQuestion()] } }
//           : l,
//       ),
//     );
//   const removeQ = (lid: string, qid: string) =>
//     setLessons((p) =>
//       p.map((l) =>
//         l.id === lid
//           ? {
//               ...l,
//               quiz: { questions: l.quiz.questions.filter((q) => q.id !== qid) },
//             }
//           : l,
//       ),
//     );
//   const updateQ = (lid: string, qid: string, patch: Partial<QuizQuestion>) =>
//     setLessons((p) =>
//       p.map((l) =>
//         l.id === lid
//           ? {
//               ...l,
//               quiz: {
//                 questions: l.quiz.questions.map((q) =>
//                   q.id === qid ? { ...q, ...patch } : q,
//                 ),
//               },
//             }
//           : l,
//       ),
//     );
//   const updateO = (
//     lid: string,
//     qid: string,
//     oid: string,
//     patch: Partial<QuizOption>,
//   ) =>
//     setLessons((p) =>
//       p.map((l) =>
//         l.id === lid
//           ? {
//               ...l,
//               quiz: {
//                 questions: l.quiz.questions.map((q) =>
//                   q.id === qid
//                     ? {
//                         ...q,
//                         options: q.options.map((o) =>
//                           o.id === oid ? { ...o, ...patch } : o,
//                         ),
//                       }
//                     : q,
//                 ),
//               },
//             }
//           : l,
//       ),
//     );

//   // ── final exam helpers ──────────────────────────────────────────────────────
//   const addFQ = () =>
//     setFinalExam((p) => ({ questions: [...p.questions, makeQuestion()] }));
//   const removeFQ = (qid: string) =>
//     setFinalExam((p) => ({
//       questions: p.questions.filter((q) => q.id !== qid),
//     }));
//   const updateFQ = (qid: string, patch: Partial<QuizQuestion>) =>
//     setFinalExam((p) => ({
//       questions: p.questions.map((q) =>
//         q.id === qid ? { ...q, ...patch } : q,
//       ),
//     }));
//   const updateFO = (qid: string, oid: string, patch: Partial<QuizOption>) =>
//     setFinalExam((p) => ({
//       questions: p.questions.map((q) =>
//         q.id === qid
//           ? {
//               ...q,
//               options: q.options.map((o) =>
//                 o.id === oid ? { ...o, ...patch } : o,
//               ),
//             }
//           : q,
//       ),
//     }));

//   function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => setImageUrl(ev.target?.result as string);
//     reader.readAsDataURL(file);
//   }

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!title.trim()) {
//       onError("Title is required");
//       return;
//     }
//     if (!lessons.length) {
//       onError("Add at least one lesson");
//       return;
//     }
//     setLoading(true);

//     const body = {
//       title,
//       titleAr: null,
//       description,
//       descriptionAr: null,
//       language,
//       price: parseFloat(price) || 0,
//       published,
//       imageUrl: imageUrl || null,
//       passingScore,
//       lessons: lessons.map((l) => ({
//         titleEn: l.title,
//         titleAr: null,
//         materialUrl: l.materialUrl || null,
//         videoUrl: l.videoUrl || null,
//         quiz:
//           l.hasQuiz && l.quiz.questions.length
//             ? {
//                 passingScore: 60,
//                 questions: l.quiz.questions.map((q) => ({
//                   questionEn: q.question,
//                   questionAr: null,
//                   options: q.options.map((o) => ({
//                     id: o.id,
//                     textEn: o.text,
//                     textAr: "",
//                   })),
//                   correctOption: q.correctOption,
//                 })),
//               }
//             : null,
//       })),
//       finalExam:
//         hasFinal && finalExam.questions.length
//           ? {
//               passingScore,
//               questions: finalExam.questions.map((q) => ({
//                 questionEn: q.question,
//                 questionAr: null,
//                 options: q.options.map((o) => ({
//                   id: o.id,
//                   textEn: o.text,
//                   textAr: "",
//                 })),
//                 correctOption: q.correctOption,
//               })),
//             }
//           : null,
//     };

//     const r = isEdit
//       ? await fetch(`/api/admin/courses/${course!.id}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         })
//       : await fetch("/api/admin/courses", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         });

//     const d = await r.json();
//     setLoading(false);
//     if (r.ok)
//       onSuccess(
//         isEdit
//           ? t("Course updated", "تم التحديث")
//           : t("Course added!", "تم الإضافة!"),
//       );
//     else onError(d.error ?? t("Something went wrong", "حدث خطأ"));
//   }

//   return (
//     <div dir={isRTL ? "rtl" : "ltr"}>
//       {/* breadcrumb */}
//       <div
//         className={`flex items-center gap-2 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}
//       >
//         <button
//           onClick={onBack}
//           className="text-slate-400 hover:text-[#00b4d8] text-[14px] font-semibold transition-colors"
//         >
//           {t("← Courses", "الكورسات →")}
//         </button>
//         <span className="text-slate-300">/</span>
//         <span className="text-[#0a2540] font-bold text-[14px]">
//           {isEdit
//             ? t("Edit Course", "تعديل الكورس")
//             : t("Add New Course", "إضافة كورس جديد")}
//         </span>
//       </div>

//       <form onSubmit={submit}>
//         <div className="grid xl:grid-cols-3 gap-7">
//           {/* ══ LEFT ══ */}
//           <div className="xl:col-span-2 space-y-5">
//             {/* Course Info */}
//             <Card
//               icon={BookOpen}
//               title={t("Course Information", "معلومات الكورس")}
//             >
//               <div className="space-y-4">
//                 <F label="Title *">
//                   <input
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     required
//                     placeholder="e.g. Introduction to Anatomy"
//                     className={inp}
//                     dir="ltr"
//                   />
//                 </F>
//                 <F label="Description">
//                   <textarea
//                     value={description}
//                     onChange={(e) => setDesc(e.target.value)}
//                     placeholder="Brief description of the course..."
//                     rows={3}
//                     className={`${inp} resize-none`}
//                     dir="ltr"
//                   />
//                 </F>
//               </div>
//             </Card>

//             {/* Cover Image */}
//             <Card
//               icon={ImagePlus}
//               title={t("Cover Image", "صورة الغلاف")}
//               optional
//             >
//               <div className="flex gap-2 mb-4">
//                 {(["url", "upload"] as const).map((m) => (
//                   <button
//                     key={m}
//                     type="button"
//                     onClick={() => setImageMode(m)}
//                     className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold border transition-all ${imageMode === m ? "bg-[#0a2540] text-white border-[#0a2540]" : "bg-white text-slate-500 border-slate-200 hover:border-[#00b4d8]"}`}
//                   >
//                     {m === "url" ? (
//                       <LinkIcon className="w-3.5 h-3.5" />
//                     ) : (
//                       <ImagePlus className="w-3.5 h-3.5" />
//                     )}
//                     {m === "url" ? "URL" : "Upload"}
//                   </button>
//                 ))}
//               </div>
//               {imageMode === "url" ? (
//                 <input
//                   value={imageUrl}
//                   onChange={(e) => setImageUrl(e.target.value)}
//                   placeholder="https://..."
//                   className={inp}
//                   dir="ltr"
//                 />
//               ) : (
//                 <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#00b4d8] rounded-2xl p-8 cursor-pointer transition-colors group">
//                   <ImagePlus className="w-7 h-7 text-slate-300 group-hover:text-[#00b4d8] mb-2 transition-colors" />
//                   <p className="text-slate-400 text-[13px]">Click to upload</p>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleImageFile}
//                   />
//                 </label>
//               )}
//               {imageUrl && (
//                 <div className="mt-3 relative rounded-xl overflow-hidden h-28 border border-slate-200">
//                   <img
//                     src={imageUrl}
//                     alt="preview"
//                     className="w-full h-full object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setImageUrl("")}
//                     className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                 </div>
//               )}
//             </Card>

//             {/* ══ LESSONS ══ */}
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-[#0a2540] font-bold text-[18px]">
//                   Lessons{" "}
//                   <span className="text-slate-300 font-normal text-[14px]">
//                     ({lessons.length})
//                   </span>
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={addLesson}
//                   className="flex items-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl transition-all"
//                 >
//                   <Plus className="w-3.5 h-3.5" /> Add Lesson
//                 </button>
//               </div>

//               {lessons.map((lesson, li) => (
//                 <LessonBlock
//                   key={lesson.id}
//                   lesson={lesson}
//                   index={li}
//                   isOpen={openLesson === lesson.id}
//                   onToggle={() =>
//                     setOpenLesson(openLesson === lesson.id ? null : lesson.id)
//                   }
//                   onUpdate={(patch) => updateLesson(lesson.id, patch)}
//                   onRemove={() => removeLesson(lesson.id)}
//                   onAddQ={() => addQ(lesson.id)}
//                   onRemoveQ={(qid) => removeQ(lesson.id, qid)}
//                   onUpdateQ={(qid, patch) => updateQ(lesson.id, qid, patch)}
//                   onUpdateO={(qid, oid, patch) =>
//                     updateO(lesson.id, qid, oid, patch)
//                   }
//                   canRemove={lessons.length > 1}
//                 />
//               ))}
//             </div>

//             {/* ══ FINAL EXAM ══ */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//               <button
//                 type="button"
//                 onClick={() => setFinalOpen((p) => !p)}
//                 className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-xl bg-[#e9c46a]/15 flex items-center justify-center">
//                     <GraduationCap className="w-4 h-4 text-[#e9c46a]" />
//                   </div>
//                   <div>
//                     <p className="text-[#0a2540] font-bold text-[15px] text-left">
//                       Final Exam
//                     </p>
//                     <p className="text-slate-400 text-[12px] text-left">
//                       {finalExam.questions.length} questions · pass =
//                       certificate
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setHasFinal((p) => !p);
//                     }}
//                     className={`w-11 h-6 rounded-full transition-colors relative ${hasFinal ? "bg-[#e9c46a]" : "bg-slate-300"}`}
//                   >
//                     <div
//                       className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${hasFinal ? "left-6" : "left-1"}`}
//                     />
//                   </div>
//                   {finalOpen ? (
//                     <ChevronUp className="w-4 h-4 text-slate-400" />
//                   ) : (
//                     <ChevronDown className="w-4 h-4 text-slate-400" />
//                   )}
//                 </div>
//               </button>

//               {finalOpen && hasFinal && (
//                 <div className="px-5 pb-5 border-t border-slate-100 pt-5 space-y-4">
//                   <div className="flex items-center justify-between">
//                     <p className="text-slate-500 text-[12px] font-semibold">
//                       Pass score: {passingScore}%
//                     </p>
//                     <button
//                       type="button"
//                       onClick={addFQ}
//                       className="flex items-center gap-1.5 text-[#00b4d8] hover:text-[#0096b4] text-[13px] font-bold"
//                     >
//                       <Plus className="w-3.5 h-3.5" /> Add Question
//                     </button>
//                   </div>
//                   {finalExam.questions.map((q, qi) => (
//                     <QuestionBlock
//                       key={q.id}
//                       question={q}
//                       index={qi}
//                       canRemove={finalExam.questions.length > 1}
//                       onRemove={() => removeFQ(q.id)}
//                       onUpdate={(patch) => updateFQ(q.id, patch)}
//                       onUpdateOption={(oid, patch) =>
//                         updateFO(q.id, oid, patch)
//                       }
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ══ RIGHT SIDEBAR ══ */}
//           <div className="space-y-5">
//             {/* publish */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//               <h3 className="text-[#0a2540] font-bold text-[15px] mb-4">
//                 Publish Settings
//               </h3>
//               <div
//                 onClick={() => setPublished((p) => !p)}
//                 className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer select-none ${published ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-slate-50"}`}
//               >
//                 <div
//                   className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${published ? "bg-emerald-500" : "bg-slate-300"}`}
//                 >
//                   <div
//                     className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${published ? "left-7" : "left-1"}`}
//                   />
//                 </div>
//                 <p
//                   className={`font-bold text-[14px] ${published ? "text-emerald-700" : "text-slate-500"}`}
//                 >
//                   {published ? "Published" : "Draft"}
//                 </p>
//               </div>
//             </div>

//             {/* pricing */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
//               <h3 className="text-[#0a2540] font-bold text-[15px]">
//                 Pricing & Settings
//               </h3>
//               <F label="Price (EGP)">
//                 <div className="relative">
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={price}
//                     onChange={(e) => setPrice(e.target.value)}
//                     placeholder="0"
//                     className={inp}
//                   />
//                   <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 text-[12px]">
//                     EGP
//                   </span>
//                 </div>
//                 <p className="text-slate-400 text-[11px] mt-1">
//                   Set 0 for a free course
//                 </p>
//               </F>
//               <F label="Language">
//                 <select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                   className={inp}
//                 >
//                   <option value="AR">Arabic</option>
//                   <option value="EN">English</option>
//                   <option value="BOTH">Arabic + English</option>
//                 </select>
//               </F>
//               <F label="Final exam passing score (%)">
//                 <input
//                   type="number"
//                   min="0"
//                   max="100"
//                   value={passingScore}
//                   onChange={(e) => setPassingScore(Number(e.target.value))}
//                   className={inp}
//                 />
//               </F>
//             </div>

//             {/* summary */}
//             <div className="bg-[#0a2540] rounded-2xl p-6">
//               <p className="text-white/40 text-[11px] uppercase tracking-wider mb-4">
//                 Summary
//               </p>
//               {[
//                 { label: "Lessons", val: lessons.length },
//                 {
//                   label: "With Quiz",
//                   val: lessons.filter((l) => l.hasQuiz).length,
//                 },
//                 {
//                   label: "Final Exam",
//                   val: hasFinal ? "Yes" : "No",
//                   color: hasFinal ? "#4ade80" : "#94a3b8",
//                 },
//                 {
//                   label: "Price",
//                   val: parseFloat(price) === 0 ? "Free" : `${price} EGP`,
//                 },
//                 {
//                   label: "Status",
//                   val: published ? "Published" : "Draft",
//                   color: published ? "#4ade80" : "#94a3b8",
//                 },
//               ].map((row, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0"
//                 >
//                   <span className="text-white/40 text-[13px]">{row.label}</span>
//                   <span
//                     className="font-bold text-[13px] text-white"
//                     style={row.color ? { color: row.color } : {}}
//                   >
//                     {row.val}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* buttons */}
//             <div className="space-y-3">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex items-center justify-center gap-2 bg-[#00b4d8] hover:bg-[#0096b4] disabled:opacity-60 text-white font-bold rounded-xl py-4 text-[15px] transition-all shadow-lg shadow-[#00b4d8]/25 hover:-translate-y-0.5"
//               >
//                 {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//                 {isEdit ? "Save Changes" : "Add Course"}
//               </button>
//               <button
//                 type="button"
//                 onClick={onBack}
//                 className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl py-3.5 text-[14px] transition-all"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// // ─── LessonBlock ──────────────────────────────────────────────────────────────
// function LessonBlock({
//   lesson,
//   index,
//   isOpen,
//   onToggle,
//   onUpdate,
//   onRemove,
//   onAddQ,
//   onRemoveQ,
//   onUpdateQ,
//   onUpdateO,
//   canRemove,
// }: {
//   lesson: LessonData;
//   index: number;
//   isOpen: boolean;
//   onToggle: () => void;
//   onUpdate: (p: Partial<LessonData>) => void;
//   onRemove: () => void;
//   onAddQ: () => void;
//   onRemoveQ: (id: string) => void;
//   onUpdateQ: (id: string, p: Partial<QuizQuestion>) => void;
//   onUpdateO: (qid: string, oid: string, p: Partial<QuizOption>) => void;
//   canRemove: boolean;
// }) {
//   return (
//     <div
//       className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isOpen ? "border-[#00b4d8]/30" : "border-slate-100"}`}
//     >
//       {isOpen && (
//         <div className="h-0.5 bg-gradient-to-r from-[#00b4d8] to-[#00b4d8]/20" />
//       )}

//       <button
//         type="button"
//         onClick={onToggle}
//         className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors"
//       >
//         <div className="w-8 h-8 rounded-xl bg-[#0a2540] flex items-center justify-center flex-shrink-0">
//           <span className="text-white font-bold text-[12px]">{index + 1}</span>
//         </div>
//         <div className="flex-1 min-w-0 text-left">
//           <p className="text-[#0a2540] font-bold text-[14px] truncate">
//             {lesson.title}
//           </p>
//           <p className="text-slate-400 text-[12px] mt-0.5">
//             {[
//               lesson.materialUrl && "Material",
//               lesson.videoUrl && "Video",
//               lesson.hasQuiz && "Quiz",
//             ]
//               .filter(Boolean)
//               .join(" · ") || "Click to edit"}
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           {canRemove && (
//             <span
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onRemove();
//               }}
//               className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
//             >
//               <Trash2 className="w-3.5 h-3.5" />
//             </span>
//           )}
//           {isOpen ? (
//             <ChevronUp className="w-4 h-4 text-slate-400" />
//           ) : (
//             <ChevronDown className="w-4 h-4 text-slate-400" />
//           )}
//         </div>
//       </button>

//       {isOpen && (
//         <div className="px-5 pb-6 border-t border-slate-100 pt-5 space-y-5">
//           <F label="Lesson Title *">
//             <input
//               value={lesson.title}
//               onChange={(e) => onUpdate({ title: e.target.value })}
//               required
//               placeholder="e.g. Introduction to the topic"
//               className={inp}
//               dir="ltr"
//             />
//           </F>

//           <div className="grid sm:grid-cols-2 gap-4">
//             <F label="Material Link (Google Drive)">
//               <div className="relative">
//                 <FileText className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-slate-300 pointer-events-none" />
//                 <input
//                   value={lesson.materialUrl}
//                   onChange={(e) => onUpdate({ materialUrl: e.target.value })}
//                   placeholder="https://drive.google.com/..."
//                   className={`${inp} pl-9`}
//                   dir="ltr"
//                 />
//               </div>
//             </F>
//             <F label="Video Link (YouTube)">
//               <div className="relative">
//                 <Youtube className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-red-400 pointer-events-none" />
//                 <input
//                   value={lesson.videoUrl}
//                   onChange={(e) => onUpdate({ videoUrl: e.target.value })}
//                   placeholder="https://youtube.com/watch?v=..."
//                   className={`${inp} pl-9`}
//                   dir="ltr"
//                 />
//               </div>
//             </F>
//           </div>

//           {/* quiz toggle */}
//           <div>
//             <div
//               onClick={() => onUpdate({ hasQuiz: !lesson.hasQuiz })}
//               className="flex items-center gap-3 cursor-pointer select-none mb-4"
//             >
//               <div
//                 className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${lesson.hasQuiz ? "bg-[#00b4d8]" : "bg-slate-300"}`}
//               >
//                 <div
//                   className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${lesson.hasQuiz ? "left-5" : "left-0.5"}`}
//                 />
//               </div>
//               <span className="text-[#0a2540] font-bold text-[14px]">
//                 Lesson Quiz
//               </span>
//               <span className="text-slate-400 text-[12px]">
//                 (blocks next lesson until passed)
//               </span>
//             </div>

//             {lesson.hasQuiz && (
//               <div className="bg-[#f8f9fc] rounded-2xl border border-slate-200 p-5 space-y-4">
//                 <div className="flex items-center justify-between">
//                   <p className="text-slate-500 text-[12px] font-semibold">
//                     {lesson.quiz.questions.length} questions · pass: 60%
//                   </p>
//                   <button
//                     type="button"
//                     onClick={onAddQ}
//                     className="flex items-center gap-1.5 text-[#00b4d8] hover:text-[#0096b4] text-[13px] font-bold"
//                   >
//                     <Plus className="w-3.5 h-3.5" /> Add Question
//                   </button>
//                 </div>
//                 {lesson.quiz.questions.map((q, qi) => (
//                   <QuestionBlock
//                     key={q.id}
//                     question={q}
//                     index={qi}
//                     canRemove={lesson.quiz.questions.length > 1}
//                     onRemove={() => onRemoveQ(q.id)}
//                     onUpdate={(patch) => onUpdateQ(q.id, patch)}
//                     onUpdateOption={(oid, patch) => onUpdateO(q.id, oid, patch)}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── QuestionBlock ────────────────────────────────────────────────────────────
// function QuestionBlock({
//   question: q,
//   index,
//   canRemove,
//   onRemove,
//   onUpdate,
//   onUpdateOption,
// }: {
//   question: QuizQuestion;
//   index: number;
//   canRemove: boolean;
//   onRemove: () => void;
//   onUpdate: (p: Partial<QuizQuestion>) => void;
//   onUpdateOption: (oid: string, p: Partial<QuizOption>) => void;
// }) {
//   return (
//     <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
//       <div className="flex items-center justify-between">
//         <span className="text-[#00b4d8] font-bold text-[12px]">
//           Q{index + 1}
//         </span>
//         {canRemove && (
//           <button
//             type="button"
//             onClick={onRemove}
//             className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center"
//           >
//             <X className="w-3 h-3" />
//           </button>
//         )}
//       </div>

//       <input
//         value={q.question}
//         onChange={(e) => onUpdate({ question: e.target.value })}
//         placeholder="Type your question here..."
//         className={`${inp} text-[13px] py-2.5`}
//         dir="ltr"
//       />

//       <div className="space-y-2">
//         {q.options.map((opt, oi) => (
//           <div key={opt.id} className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={() => onUpdate({ correctOption: opt.id })}
//               className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${q.correctOption === opt.id ? "border-emerald-500 bg-emerald-500" : "border-slate-300 hover:border-emerald-400"}`}
//             >
//               {q.correctOption === opt.id && (
//                 <Check className="w-3 h-3 text-white" />
//               )}
//             </button>
//             <span className="text-slate-400 text-[11px] font-bold w-5 flex-shrink-0 text-center">
//               {["A", "B", "C", "D"][oi]}
//             </span>
//             <input
//               value={opt.text}
//               onChange={(e) => onUpdateOption(opt.id, { text: e.target.value })}
//               placeholder={`Option ${["A", "B", "C", "D"][oi]}`}
//               className={`${inp} text-[13px] py-2`}
//               dir="ltr"
//             />
//           </div>
//         ))}
//       </div>
//       <p className="text-slate-300 text-[11px]">
//         Click the circle to select the correct answer
//       </p>
//     </div>
//   );
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function Card({
//   title,
//   icon: Icon,
//   optional,
//   children,
// }: {
//   title: string;
//   icon: React.ElementType;
//   optional?: boolean;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
//       <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
//         <div className="w-8 h-8 rounded-xl bg-[#00b4d8]/10 flex items-center justify-center">
//           <Icon className="w-4 h-4 text-[#00b4d8]" />
//         </div>
//         <h3 className="text-[#0a2540] font-bold text-[16px]">{title}</h3>
//         {optional && (
//           <span className="text-slate-400 text-[12px]">(optional)</span>
//         )}
//       </div>
//       {children}
//     </div>
//   );
// }

// function F({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-slate-600 text-[13px] font-bold">{label}</label>
//       {children}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Loader2,
  ImagePlus,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BookOpen,
  Youtube,
  FileText,
  Check,
  Trash2,
} from "lucide-react";
import { inp } from "./types";
import type { Course } from "./types";

// ─── Local Types ──────────────────────────────────────────────────────────────
interface QuizOption {
  id: string;
  text: string;
}
interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOption: string;
}
interface LessonData {
  id: string;
  title: string;
  materialUrl: string;
  videoUrl: string;
  hasQuiz: boolean;
  quiz: { questions: QuizQuestion[] };
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function makeOption(): QuizOption {
  return { id: uid(), text: "" };
}
function makeQuestion(): QuizQuestion {
  const opts = [makeOption(), makeOption(), makeOption(), makeOption()];
  return { id: uid(), question: "", options: opts, correctOption: opts[0].id };
}
function makeLesson(n: number): LessonData {
  return {
    id: uid(),
    title: `Lesson ${n}`,
    materialUrl: "",
    videoUrl: "",
    hasQuiz: true,
    quiz: { questions: [makeQuestion()] },
  };
}

// ── Map API lesson → local LessonData ────────────────────────────────────────
function mapLesson(l: NonNullable<Course["lessons"]>[number]): LessonData {
  return {
    id: l.id,
    title: l.titleEn,
    materialUrl: l.materialUrl ?? "",
    videoUrl: l.videoUrl ?? "",
    hasQuiz: !!l.quiz,
    quiz: l.quiz?.questions?.length
      ? {
          questions: l.quiz.questions.map((q) => ({
            id: q.id,
            question: q.questionEn,
            options: q.options.map((o) => ({ id: o.id, text: o.textEn })),
            correctOption: q.correctOption,
          })),
        }
      : { questions: [makeQuestion()] },
  };
}

// ── Map API finalExam questions → local QuizQuestion[] ───────────────────────
function mapFinalQuestions(
  questions: NonNullable<Course["finalExam"]>["questions"],
): QuizQuestion[] {
  return questions.map((q) => ({
    id: q.id,
    question: q.questionEn,
    options: q.options.map((o) => ({ id: o.id, text: o.textEn })),
    correctOption: q.correctOption,
  }));
}

// ══════════════════════════════════════════════════════════════════════════════
export function CourseForm({
  t,
  isRTL,
  course,
  onBack,
  onSuccess,
  onError,
}: {
  t: (en: string, ar: string) => string;
  isRTL: boolean;
  course?: Course;
  onBack: () => void;
  onSuccess: (msg: string) => void;
  onError: (e: string) => void;
}) {
  const isEdit = !!course;

  const [title, setTitle] = useState(course?.title ?? "");
  const [description, setDesc] = useState(course?.description ?? "");
  const [price, setPrice] = useState(String(course?.price ?? 0));
  const [language, setLanguage] = useState(course?.language ?? "AR");
  const [published, setPublished] = useState(course?.published ?? false);
  const [imageUrl, setImageUrl] = useState(course?.imageUrl ?? "");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [passingScore, setPassingScore] = useState(course?.passingScore ?? 60);
  const [loading, setLoading] = useState(false);

  // ── lessons: load from course if editing ───────────────────────────────────
  const [lessons, setLessons] = useState<LessonData[]>(() => {
    if (course?.lessons?.length) return course.lessons.map(mapLesson);
    return [makeLesson(1)];
  });
  const [openLesson, setOpenLesson] = useState<string | null>(null);

  // ── final exam: load from course if editing ────────────────────────────────
  const [hasFinal, setHasFinal] = useState(() => !!course?.finalExam);
  const [finalExam, setFinalExam] = useState<{ questions: QuizQuestion[] }>(
    () => {
      if (course?.finalExam?.questions?.length) {
        return { questions: mapFinalQuestions(course.finalExam.questions) };
      }
      return { questions: [makeQuestion()] };
    },
  );
  const [finalOpen, setFinalOpen] = useState(false);

  // ── lesson helpers ──────────────────────────────────────────────────────────
  const addLesson = () => {
    const l = makeLesson(lessons.length + 1);
    setLessons((p) => [...p, l]);
    setOpenLesson(l.id);
  };
  const removeLesson = (id: string) =>
    setLessons((p) => p.filter((l) => l.id !== id));
  const updateLesson = (id: string, patch: Partial<LessonData>) =>
    setLessons((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const addQ = (lid: string) =>
    setLessons((p) =>
      p.map((l) =>
        l.id === lid
          ? { ...l, quiz: { questions: [...l.quiz.questions, makeQuestion()] } }
          : l,
      ),
    );
  const removeQ = (lid: string, qid: string) =>
    setLessons((p) =>
      p.map((l) =>
        l.id === lid
          ? {
              ...l,
              quiz: {
                questions: l.quiz.questions.filter((q) => q.id !== qid),
              },
            }
          : l,
      ),
    );
  const updateQ = (lid: string, qid: string, patch: Partial<QuizQuestion>) =>
    setLessons((p) =>
      p.map((l) =>
        l.id === lid
          ? {
              ...l,
              quiz: {
                questions: l.quiz.questions.map((q) =>
                  q.id === qid ? { ...q, ...patch } : q,
                ),
              },
            }
          : l,
      ),
    );
  const updateO = (
    lid: string,
    qid: string,
    oid: string,
    patch: Partial<QuizOption>,
  ) =>
    setLessons((p) =>
      p.map((l) =>
        l.id === lid
          ? {
              ...l,
              quiz: {
                questions: l.quiz.questions.map((q) =>
                  q.id === qid
                    ? {
                        ...q,
                        options: q.options.map((o) =>
                          o.id === oid ? { ...o, ...patch } : o,
                        ),
                      }
                    : q,
                ),
              },
            }
          : l,
      ),
    );

  // ── final exam helpers ──────────────────────────────────────────────────────
  const addFQ = () =>
    setFinalExam((p) => ({ questions: [...p.questions, makeQuestion()] }));
  const removeFQ = (qid: string) =>
    setFinalExam((p) => ({
      questions: p.questions.filter((q) => q.id !== qid),
    }));
  const updateFQ = (qid: string, patch: Partial<QuizQuestion>) =>
    setFinalExam((p) => ({
      questions: p.questions.map((q) =>
        q.id === qid ? { ...q, ...patch } : q,
      ),
    }));
  const updateFO = (qid: string, oid: string, patch: Partial<QuizOption>) =>
    setFinalExam((p) => ({
      questions: p.questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === oid ? { ...o, ...patch } : o,
              ),
            }
          : q,
      ),
    }));

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      onError("Title is required");
      return;
    }
    if (!lessons.length) {
      onError("Add at least one lesson");
      return;
    }
    setLoading(true);

    const body = {
      title,
      titleAr: null,
      description,
      descriptionAr: null,
      language,
      price: parseFloat(price) || 0,
      published,
      imageUrl: imageUrl || null,
      passingScore,
      lessons: lessons.map((l) => ({
        titleEn: l.title,
        titleAr: null,
        materialUrl: l.materialUrl || null,
        videoUrl: l.videoUrl || null,
        quiz:
          l.hasQuiz && l.quiz.questions.length
            ? {
                passingScore: 60,
                questions: l.quiz.questions.map((q) => ({
                  questionEn: q.question,
                  questionAr: null,
                  options: q.options.map((o) => ({
                    id: o.id,
                    textEn: o.text,
                    textAr: "",
                  })),
                  correctOption: q.correctOption,
                })),
              }
            : null,
      })),
      finalExam:
        hasFinal && finalExam.questions.length
          ? {
              passingScore,
              questions: finalExam.questions.map((q) => ({
                questionEn: q.question,
                questionAr: null,
                options: q.options.map((o) => ({
                  id: o.id,
                  textEn: o.text,
                  textAr: "",
                })),
                correctOption: q.correctOption,
              })),
            }
          : null,
    };

    const r = isEdit
      ? await fetch(`/api/admin/courses/${course!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    const d = await r.json();
    setLoading(false);
    if (r.ok)
      onSuccess(
        isEdit
          ? t("Course updated", "تم التحديث")
          : t("Course added!", "تم الإضافة!"),
      );
    else onError(d.error ?? t("Something went wrong", "حدث خطأ"));
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* breadcrumb */}
      <div
        className={`flex items-center gap-2 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-[#00b4d8] text-[14px] font-semibold transition-colors"
        >
          {t("← Courses", "الكورسات →")}
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-[#0a2540] font-bold text-[14px]">
          {isEdit
            ? t("Edit Course", "تعديل الكورس")
            : t("Add New Course", "إضافة كورس جديد")}
        </span>
      </div>

      <form onSubmit={submit}>
        <div className="grid xl:grid-cols-3 gap-7">
          {/* ══ LEFT ══ */}
          <div className="xl:col-span-2 space-y-5">
            {/* Course Info */}
            <Card
              icon={BookOpen}
              title={t("Course Information", "معلومات الكورس")}
            >
              <div className="space-y-4">
                <F label="Title *">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Introduction to Anatomy"
                    className={inp}
                    dir="ltr"
                  />
                </F>
                <F label="Description">
                  <textarea
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Brief description of the course..."
                    rows={3}
                    className={`${inp} resize-none`}
                    dir="ltr"
                  />
                </F>
              </div>
            </Card>

            {/* Cover Image */}
            <Card
              icon={ImagePlus}
              title={t("Cover Image", "صورة الغلاف")}
              optional
            >
              <div className="flex gap-2 mb-4">
                {(["url", "upload"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setImageMode(m)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold border transition-all ${imageMode === m ? "bg-[#0a2540] text-white border-[#0a2540]" : "bg-white text-slate-500 border-slate-200 hover:border-[#00b4d8]"}`}
                  >
                    {m === "url" ? (
                      <LinkIcon className="w-3.5 h-3.5" />
                    ) : (
                      <ImagePlus className="w-3.5 h-3.5" />
                    )}
                    {m === "url" ? "URL" : "Upload"}
                  </button>
                ))}
              </div>
              {imageMode === "url" ? (
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className={inp}
                  dir="ltr"
                />
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#00b4d8] rounded-2xl p-8 cursor-pointer transition-colors group">
                  <ImagePlus className="w-7 h-7 text-slate-300 group-hover:text-[#00b4d8] mb-2 transition-colors" />
                  <p className="text-slate-400 text-[13px]">Click to upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFile}
                  />
                </label>
              )}
              {imageUrl && (
                <div className="mt-3 relative rounded-xl overflow-hidden h-28 border border-slate-200">
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </Card>

            {/* ══ LESSONS ══ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[#0a2540] font-bold text-[18px]">
                  Lessons{" "}
                  <span className="text-slate-300 font-normal text-[14px]">
                    ({lessons.length})
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={addLesson}
                  className="flex items-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Lesson
                </button>
              </div>

              {lessons.map((lesson, li) => (
                <LessonBlock
                  key={lesson.id}
                  lesson={lesson}
                  index={li}
                  isOpen={openLesson === lesson.id}
                  onToggle={() =>
                    setOpenLesson(openLesson === lesson.id ? null : lesson.id)
                  }
                  onUpdate={(patch) => updateLesson(lesson.id, patch)}
                  onRemove={() => removeLesson(lesson.id)}
                  onAddQ={() => addQ(lesson.id)}
                  onRemoveQ={(qid) => removeQ(lesson.id, qid)}
                  onUpdateQ={(qid, patch) => updateQ(lesson.id, qid, patch)}
                  onUpdateO={(qid, oid, patch) =>
                    updateO(lesson.id, qid, oid, patch)
                  }
                  canRemove={lessons.length > 1}
                />
              ))}
            </div>

            {/* ══ FINAL EXAM ══ */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setFinalOpen((p) => !p)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#e9c46a]/15 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-[#e9c46a]" />
                  </div>
                  <div>
                    <p className="text-[#0a2540] font-bold text-[15px] text-left">
                      Final Exam
                    </p>
                    <p className="text-slate-400 text-[12px] text-left">
                      {finalExam.questions.length} questions · pass =
                      certificate
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setHasFinal((p) => !p);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${hasFinal ? "bg-[#e9c46a]" : "bg-slate-300"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${hasFinal ? "left-6" : "left-1"}`}
                    />
                  </div>
                  {finalOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {finalOpen && hasFinal && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 text-[12px] font-semibold">
                      Pass score: {passingScore}%
                    </p>
                    <button
                      type="button"
                      onClick={addFQ}
                      className="flex items-center gap-1.5 text-[#00b4d8] hover:text-[#0096b4] text-[13px] font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Question
                    </button>
                  </div>
                  {finalExam.questions.map((q, qi) => (
                    <QuestionBlock
                      key={q.id}
                      question={q}
                      index={qi}
                      canRemove={finalExam.questions.length > 1}
                      onRemove={() => removeFQ(q.id)}
                      onUpdate={(patch) => updateFQ(q.id, patch)}
                      onUpdateOption={(oid, patch) =>
                        updateFO(q.id, oid, patch)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT SIDEBAR ══ */}
          <div className="space-y-5">
            {/* publish */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-[#0a2540] font-bold text-[15px] mb-4">
                Publish Settings
              </h3>
              <div
                onClick={() => setPublished((p) => !p)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer select-none ${published ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-slate-50"}`}
              >
                <div
                  className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${published ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${published ? "left-7" : "left-1"}`}
                  />
                </div>
                <p
                  className={`font-bold text-[14px] ${published ? "text-emerald-700" : "text-slate-500"}`}
                >
                  {published ? "Published" : "Draft"}
                </p>
              </div>
            </div>

            {/* pricing */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-[#0a2540] font-bold text-[15px]">
                Pricing & Settings
              </h3>
              <F label="Price (EGP)">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className={inp}
                  />
                  <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 text-[12px]">
                    EGP
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Set 0 for a free course
                </p>
              </F>
              <F label="Language">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={inp}
                >
                  <option value="AR">Arabic</option>
                  <option value="EN">English</option>
                  <option value="BOTH">Arabic + English</option>
                </select>
              </F>
              <F label="Final exam passing score (%)">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  className={inp}
                />
              </F>
            </div>

            {/* summary */}
            <div className="bg-[#0a2540] rounded-2xl p-6">
              <p className="text-white/40 text-[11px] uppercase tracking-wider mb-4">
                Summary
              </p>
              {[
                { label: "Lessons", val: lessons.length },
                {
                  label: "With Quiz",
                  val: lessons.filter((l) => l.hasQuiz).length,
                },
                {
                  label: "Final Exam",
                  val: hasFinal ? "Yes" : "No",
                  color: hasFinal ? "#4ade80" : "#94a3b8",
                },
                {
                  label: "Price",
                  val: parseFloat(price) === 0 ? "Free" : `${price} EGP`,
                },
                {
                  label: "Status",
                  val: published ? "Published" : "Draft",
                  color: published ? "#4ade80" : "#94a3b8",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0"
                >
                  <span className="text-white/40 text-[13px]">{row.label}</span>
                  <span
                    className="font-bold text-[13px] text-white"
                    style={row.color ? { color: row.color } : {}}
                  >
                    {row.val}
                  </span>
                </div>
              ))}
            </div>

            {/* buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#00b4d8] hover:bg-[#0096b4] disabled:opacity-60 text-white font-bold rounded-xl py-4 text-[15px] transition-all shadow-lg shadow-[#00b4d8]/25 hover:-translate-y-0.5"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Add Course"}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl py-3.5 text-[14px] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── LessonBlock ──────────────────────────────────────────────────────────────
function LessonBlock({
  lesson,
  index,
  isOpen,
  onToggle,
  onUpdate,
  onRemove,
  onAddQ,
  onRemoveQ,
  onUpdateQ,
  onUpdateO,
  canRemove,
}: {
  lesson: LessonData;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (p: Partial<LessonData>) => void;
  onRemove: () => void;
  onAddQ: () => void;
  onRemoveQ: (id: string) => void;
  onUpdateQ: (id: string, p: Partial<QuizQuestion>) => void;
  onUpdateO: (qid: string, oid: string, p: Partial<QuizOption>) => void;
  canRemove: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isOpen ? "border-[#00b4d8]/30" : "border-slate-100"}`}
    >
      {isOpen && (
        <div className="h-0.5 bg-gradient-to-r from-[#00b4d8] to-[#00b4d8]/20" />
      )}

      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-xl bg-[#0a2540] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-[12px]">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[#0a2540] font-bold text-[14px] truncate">
            {lesson.title}
          </p>
          <p className="text-slate-400 text-[12px] mt-0.5">
            {[
              lesson.materialUrl && "Material",
              lesson.videoUrl && "Video",
              lesson.hasQuiz && "Quiz",
            ]
              .filter(Boolean)
              .join(" · ") || "Click to edit"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-6 border-t border-slate-100 pt-5 space-y-5">
          <F label="Lesson Title *">
            <input
              value={lesson.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              required
              placeholder="e.g. Introduction to the topic"
              className={inp}
              dir="ltr"
            />
          </F>

          <div className="grid sm:grid-cols-2 gap-4">
            <F label="Material Link (Google Drive)">
              <div className="relative">
                <FileText className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-slate-300 pointer-events-none" />
                <input
                  value={lesson.materialUrl}
                  onChange={(e) => onUpdate({ materialUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className={`${inp} pl-9`}
                  dir="ltr"
                />
              </div>
            </F>
            <F label="Video Link (YouTube)">
              <div className="relative">
                <Youtube className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-red-400 pointer-events-none" />
                <input
                  value={lesson.videoUrl}
                  onChange={(e) => onUpdate({ videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`${inp} pl-9`}
                  dir="ltr"
                />
              </div>
            </F>
          </div>

          {/* quiz toggle */}
          <div>
            <div
              onClick={() => onUpdate({ hasQuiz: !lesson.hasQuiz })}
              className="flex items-center gap-3 cursor-pointer select-none mb-4"
            >
              <div
                className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${lesson.hasQuiz ? "bg-[#00b4d8]" : "bg-slate-300"}`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${lesson.hasQuiz ? "left-5" : "left-0.5"}`}
                />
              </div>
              <span className="text-[#0a2540] font-bold text-[14px]">
                Lesson Quiz
              </span>
              <span className="text-slate-400 text-[12px]">
                (blocks next lesson until passed)
              </span>
            </div>

            {lesson.hasQuiz && (
              <div className="bg-[#f8f9fc] rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 text-[12px] font-semibold">
                    {lesson.quiz.questions.length} questions · pass: 60%
                  </p>
                  <button
                    type="button"
                    onClick={onAddQ}
                    className="flex items-center gap-1.5 text-[#00b4d8] hover:text-[#0096b4] text-[13px] font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>
                {lesson.quiz.questions.map((q, qi) => (
                  <QuestionBlock
                    key={q.id}
                    question={q}
                    index={qi}
                    canRemove={lesson.quiz.questions.length > 1}
                    onRemove={() => onRemoveQ(q.id)}
                    onUpdate={(patch) => onUpdateQ(q.id, patch)}
                    onUpdateOption={(oid, patch) => onUpdateO(q.id, oid, patch)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── QuestionBlock ────────────────────────────────────────────────────────────
function QuestionBlock({
  question: q,
  index,
  canRemove,
  onRemove,
  onUpdate,
  onUpdateOption,
}: {
  question: QuizQuestion;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  onUpdate: (p: Partial<QuizQuestion>) => void;
  onUpdateOption: (oid: string, p: Partial<QuizOption>) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[#00b4d8] font-bold text-[12px]">
          Q{index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <input
        value={q.question}
        onChange={(e) => onUpdate({ question: e.target.value })}
        placeholder="Type your question here..."
        className={`${inp} text-[13px] py-2.5`}
        dir="ltr"
      />

      <div className="space-y-2">
        {q.options.map((opt, oi) => (
          <div key={opt.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdate({ correctOption: opt.id })}
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${q.correctOption === opt.id ? "border-emerald-500 bg-emerald-500" : "border-slate-300 hover:border-emerald-400"}`}
            >
              {q.correctOption === opt.id && (
                <Check className="w-3 h-3 text-white" />
              )}
            </button>
            <span className="text-slate-400 text-[11px] font-bold w-5 flex-shrink-0 text-center">
              {["A", "B", "C", "D"][oi]}
            </span>
            <input
              value={opt.text}
              onChange={(e) => onUpdateOption(opt.id, { text: e.target.value })}
              placeholder={`Option ${["A", "B", "C", "D"][oi]}`}
              className={`${inp} text-[13px] py-2`}
              dir="ltr"
            />
          </div>
        ))}
      </div>
      <p className="text-slate-300 text-[11px]">
        Click the circle to select the correct answer
      </p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Card({
  title,
  icon: Icon,
  optional,
  children,
}: {
  title: string;
  icon: React.ElementType;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
      <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-[#00b4d8]/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#00b4d8]" />
        </div>
        <h3 className="text-[#0a2540] font-bold text-[16px]">{title}</h3>
        {optional && (
          <span className="text-slate-400 text-[12px]">(optional)</span>
        )}
      </div>
      {children}
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-slate-600 text-[13px] font-bold">{label}</label>
      {children}
    </div>
  );
}
