// "use client";

// import {
//   Clock,
//   Eye,
//   EyeOff,
//   Edit2,
//   Trash2,
//   Users,
//   PlayCircle,
//   Youtube,
// } from "lucide-react";
// import type { Course } from "./types";
// import { ytThumb } from "./types";

// // ── Course card ───────────────────────────────────────────────────────────────
// export function CourseCard({
//   course: c,
//   isRTL,
//   t,
//   onTogglePublish,
//   onEdit,
//   onDelete,
// }: {
//   course: Course;
//   isRTL: boolean;
//   t: (en: string, ar: string) => string;
//   onTogglePublish: () => void;
//   onEdit: () => void;
//   onDelete: () => void;
// }) {
//   // Best image: custom cover > YouTube thumbnail > gradient placeholder
//   const coverImage = c.imageUrl
//     ? c.imageUrl
//     : c.videoUrls[0]
//       ? ytThumb(c.videoUrls[0])
//       : null;

//   const displayTitle = isRTL && c.titleAr ? c.titleAr : c.title;
//   const subTitle = isRTL ? c.title : c.titleAr;

//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
//       {/* ── cover image ── */}
//       <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#0a2540] to-[#0d3a6e]">
//         {coverImage ? (
//           <img
//             src={coverImage}
//             alt={displayTitle}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
//             onError={(e) => {
//               (e.target as HTMLImageElement).style.display = "none";
//             }}
//           />
//         ) : (
//           /* Decorative placeholder when no image */
//           <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
//             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,180,216,0.3),transparent_70%)]" />
//             <div className="absolute w-32 h-32 rounded-full border border-[#00b4d8]/20 top-4 right-4" />
//             <div className="absolute w-20 h-20 rounded-full border border-[#00b4d8]/15 bottom-4 left-6" />
//             <Youtube className="w-14 h-14 text-white/20" />
//           </div>
//         )}

//         {/* dark overlay for text readability */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

//         {/* badges — top */}
//         <div
//           className={`absolute top-3 ${isRTL ? "right-3" : "left-3"} flex gap-2`}
//         >
//           <span
//             className={`text-[10px] px-2.5 py-1 rounded-full font-bold backdrop-blur-sm shadow-sm ${
//               c.published
//                 ? "bg-emerald-500 text-white"
//                 : "bg-white/20 text-white border border-white/30"
//             }`}
//           >
//             {c.published ? t("Published", "منشور") : t("Draft", "مسودة")}
//           </span>
//           {c.price === 0 ? (
//             <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-secondary text-white shadow-sm">
//               {t("Free", "مجاني")}
//             </span>
//           ) : (
//             <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-[#e9c46a] text-[#0a2540] shadow-sm">
//               {c.price} EGP
//             </span>
//           )}
//         </div>

//         {/* video count — bottom right */}
//         <div
//           className={`absolute bottom-3 ${isRTL ? "left-3" : "right-3"} flex items-center gap-1.5 text-white text-[12px] font-semibold`}
//         >
//           <PlayCircle className="w-4 h-4" />
//           {c.videoUrls?.length} {t("videos", "فيديو")}
//           {/* {c.videoUrls?.length ?? 0} {t("videos", "فيديو")} */}
//         </div>

//         {/* language badge — bottom left */}
//         <div className={`absolute bottom-3 ${isRTL ? "right-3" : "left-3"}`}>
//           <span className="text-[10px] px-2 py-1 rounded-lg bg-white/15 text-white/80 font-medium backdrop-blur-sm">
//             {c.language}
//           </span>
//         </div>
//       </div>

//       {/* ── body ── */}
//       <div className="p-5 space-y-4">
//         {/* title */}
//         <div className={isRTL ? "text-right" : ""}>
//           <h3 className="text-[#0a2540] font-bold text-[15px] line-clamp-1 leading-snug">
//             {displayTitle}
//           </h3>
//           {subTitle && (
//             <p className="text-slate-400 text-[12px] line-clamp-1 mt-0.5">
//               {subTitle}
//             </p>
//           )}
//         </div>

//         {/* meta row */}
//         <div
//           className={`flex items-center gap-3 text-slate-400 text-[12px] ${isRTL ? "" : ""}`}
//         >
//           <span className={`flex items-center gap-1.5 ${isRTL ? "" : ""}`}>
//             <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
//               <Users className="w-2.5 h-2.5" />
//             </div>
//             {c._count.enrollments} {t("enrolled", "مسجّل")}
//           </span>
//           <span className="text-slate-200">·</span>
//           <span className={`flex items-center gap-1.5 ${isRTL ? "" : ""}`}>
//             <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
//               <Clock className="w-2.5 h-2.5" />
//             </div>
//             {new Date(c.createdAt).toLocaleDateString(
//               isRTL ? "ar-EG" : "en-US",
//               { month: "short", day: "numeric", year: "numeric" },
//             )}
//           </span>
//         </div>

//         {/* divider */}
//         <div className="h-px bg-slate-100" />

//         {/* action row */}
//         <div className={`flex items-center gap-2 ${isRTL ? "" : ""}`}>
//           <button
//             onClick={onTogglePublish}
//             className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold border transition-all ${isRTL ? "" : ""} ${
//               c.published
//                 ? "bg-slate-50 text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
//                 : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
//             }`}
//           >
//             {c.published ? (
//               <>
//                 <EyeOff className="w-3.5 h-3.5" />
//                 {t("Unpublish", "إلغاء النشر")}
//               </>
//             ) : (
//               <>
//                 <Eye className="w-3.5 h-3.5" />
//                 {t("Publish", "نشر")}
//               </>
//             )}
//           </button>
//           <button
//             onClick={onEdit}
//             className="w-10 h-10 rounded-xl bg-[#f4f6f9] hover:bg-secondary/10 text-slate-400 hover:text-[#00b4d8] flex items-center justify-center transition-colors"
//             title={t("Edit", "تعديل")}
//           >
//             <Edit2 className="w-4 h-4" />
//           </button>
//           <button
//             onClick={onDelete}
//             className="w-10 h-10 rounded-xl bg-[#f4f6f9] hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
//             title={t("Delete", "حذف")}
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import {
  Clock,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Users,
  BookOpen,
} from "lucide-react";
import type { Course } from "./types";

export function CourseCard({
  course: c,
  isRTL,
  t,
  onTogglePublish,
  onEdit,
  onDelete,
}: {
  course: Course;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onTogglePublish: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const coverImage = c.imageUrl ?? null;
  const displayTitle = isRTL && c.titleAr ? c.titleAr : c.title;
  const lessonsCount = c._count?.lessons ?? c.lessons?.length ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
      {/* cover */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#0a2540] to-[#0d3a6e]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,180,216,0.3),transparent_70%)]" />
            <BookOpen className="w-14 h-14 text-white/20 relative z-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* badges top */}
        <div
          className={`absolute top-3 ${isRTL ? "right-3" : "left-3"} flex gap-2`}
        >
          <span
            className={`text-[10px] px-2.5 py-1 rounded-full font-bold backdrop-blur-sm shadow-sm ${
              c.published
                ? "bg-emerald-500 text-white"
                : "bg-white/20 text-white border border-white/30"
            }`}
          >
            {c.published ? t("Published", "منشور") : t("Draft", "مسودة")}
          </span>
          {c.price === 0 ? (
            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-[#00b4d8] text-white shadow-sm">
              {t("Free", "مجاني")}
            </span>
          ) : (
            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-[#e9c46a] text-[#0a2540] shadow-sm">
              {c.price} EGP
            </span>
          )}
        </div>

        {/* lessons count */}
        <div
          className={`absolute bottom-3 ${isRTL ? "left-3" : "right-3"} flex items-center gap-1.5 text-white text-[12px] font-semibold`}
        >
          <BookOpen className="w-4 h-4" />
          {lessonsCount} {t("lessons", "درس")}
        </div>

        {/* language */}
        <div className={`absolute bottom-3 ${isRTL ? "right-3" : "left-3"}`}>
          <span className="text-[10px] px-2 py-1 rounded-lg bg-white/15 text-white/80 font-medium backdrop-blur-sm">
            {c.language}
          </span>
        </div>
      </div>

      {/* body */}
      <div className="p-5 space-y-4">
        <div className={isRTL ? "text-right" : ""}>
          <h3 className="text-[#0a2540] font-bold text-[15px] line-clamp-1 leading-snug">
            {displayTitle}
          </h3>
          {c.description && (
            <p className="text-slate-400 text-[12px] line-clamp-1 mt-0.5">
              {c.description}
            </p>
          )}
        </div>

        <div
          className={`flex items-center gap-3 text-slate-400 text-[12px] ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <span
            className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Users className="w-3.5 h-3.5" />
            {c._count.enrollments} {t("enrolled", "مسجّل")}
          </span>
          <span className="text-slate-200">·</span>
          <span
            className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Clock className="w-3.5 h-3.5" />
            {new Date(c.createdAt).toLocaleDateString(
              isRTL ? "ar-EG" : "en-US",
              { month: "short", day: "numeric", year: "numeric" },
            )}
          </span>
        </div>

        <div className="h-px bg-slate-100" />

        <div
          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={onTogglePublish}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold border transition-all ${isRTL ? "flex-row-reverse" : ""} ${
              c.published
                ? "bg-slate-50 text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
            }`}
          >
            {c.published ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                {t("Unpublish", "إلغاء النشر")}
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                {t("Publish", "نشر")}
              </>
            )}
          </button>
          <button
            onClick={onEdit}
            className="w-10 h-10 rounded-xl bg-[#f4f6f9] hover:bg-[#00b4d8]/10 text-slate-400 hover:text-[#00b4d8] flex items-center justify-center transition-colors"
            title={t("Edit", "تعديل")}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="w-10 h-10 rounded-xl bg-[#f4f6f9] hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
            title={t("Delete", "حذف")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
