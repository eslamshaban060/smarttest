"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Edit2,
  Clock,
  Youtube,
  Loader2,
  ImagePlus,
  Link,
} from "lucide-react";
import { inp, toEmbed, ytThumb } from "./types";
import { XBtn, Overlay } from "./ui";
import type { Course, VideoItem } from "./types";

// ── CourseForm ────────────────────────────────────────────────────────────────
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

  // form state
  const [title, setTitle] = useState(course?.title ?? "");
  const [titleAr, setTitleAr] = useState(course?.titleAr ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [descriptionAr, setDescriptionAr] = useState(
    course?.descriptionAr ?? "",
  );
  const [price, setPrice] = useState(String(course?.price ?? 0));
  const [language, setLanguage] = useState(course?.language ?? "AR");
  const [published, setPublished] = useState(course?.published ?? false);
  const [imageUrl, setImageUrl] = useState(course?.imageUrl ?? "");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [loading, setLoading] = useState(false);

  const [videos, setVideos] = useState<VideoItem[]>(
    course?.videoUrls?.length
      ? course.videoUrls.map((u) => ({
          url: u,
          titleEn: "",
          titleAr: "",
          duration: "",
        }))
      : [{ url: "", titleEn: "", titleAr: "", duration: "" }],
  );
  const [videoPopup, setVideoPopup] = useState<number | null>(null);

  // video helpers
  const addVideo = () =>
    setVideos((v) => [
      ...v,
      { url: "", titleEn: "", titleAr: "", duration: "" },
    ]);
  const removeVideo = (i: number) => {
    setVideos((v) => v.filter((_, idx) => idx !== i));
    if (videoPopup === i) setVideoPopup(null);
  };
  const updateVideo = (i: number, f: keyof VideoItem, val: string) =>
    setVideos((v) =>
      v.map((item, idx) => (idx === i ? { ...item, [f]: val } : item)),
    );

  // image upload handler (base64 preview — in production you'd upload to Supabase Storage)
  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const validUrls = videos.map((v) => toEmbed(v.url)).filter((u) => u !== "");
    if (!validUrls.length) {
      onError(t("Add at least one video URL", "أضف رابط فيديو واحد على الأقل"));
      return;
    }

    setLoading(true);
    const body = {
      title,
      titleAr,
      description,
      descriptionAr,
      language,
      published,
      price: parseFloat(price) || 0,
      videoUrls: validUrls,
      imageUrl: imageUrl.trim() || null,
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
          ? t("Course updated", "تم تحديث الكورس")
          : t("Course added successfully", "تم إضافة الكورس بنجاح"),
      );
    else onError(d.error ?? t("Something went wrong", "حدث خطأ ما"));
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* breadcrumb */}
      <div className={`flex items-center gap-2 mb-8 ${isRTL ? "" : ""}`}>
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
          {/* ══ LEFT col ══════════════════════════════════════════════════════ */}
          <div className="xl:col-span-2 space-y-6">
            {/* Course info card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h3 className="text-[#0a2540] font-bold text-[16px] pb-5 mb-6 border-b border-slate-100">
                {t("Course Information", "معلومات الكورس")}
              </h3>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-600 text-[13px] font-bold">
                      {t("Title (EN)", "العنوان (EN)")}{" "}
                      <span className="text-[#00b4d8]">*</span>
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g. Introduction to Anatomy"
                      className={inp}
                      dir="ltr"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-600 text-[13px] font-bold">
                      {t("Title (AR)", "العنوان (AR)")}
                    </label>
                    <input
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      placeholder="مثال: مقدمة في علم التشريح"
                      className={inp}
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-600 text-[13px] font-bold">
                      {t("Description (EN)", "الوصف (EN)")}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Course description..."
                      rows={4}
                      className={`${inp} resize-none`}
                      dir="ltr"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-600 text-[13px] font-bold">
                      {t("Description (AR)", "الوصف (AR)")}
                    </label>
                    <textarea
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      placeholder="وصف الكورس..."
                      rows={4}
                      className={`${inp} resize-none`}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cover image card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <div
                className={`flex items-center gap-3 pb-5 mb-6 border-b border-slate-100 ${isRTL ? "" : ""}`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#00b4d8]/10 flex items-center justify-center">
                  <ImagePlus className="w-4 h-4 text-[#00b4d8]" />
                </div>
                <h3 className="text-[#0a2540] font-bold text-[16px]">
                  {t("Cover Image", "صورة الغلاف")}
                </h3>
                <span className="text-slate-400 text-[12px]">
                  {t("(optional)", "(اختياري)")}
                </span>
              </div>

              {/* mode tabs */}
              <div className={`flex gap-2 mb-5 ${isRTL ? "" : ""}`}>
                {[
                  {
                    mode: "url" as const,
                    Icon: Link,
                    label: t("Image URL", "رابط الصورة"),
                  },
                  {
                    mode: "upload" as const,
                    Icon: ImagePlus,
                    label: t("Upload", "رفع صورة"),
                  },
                ].map(({ mode, Icon, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setImageMode(mode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all ${isRTL ? "" : ""} ${imageMode === mode ? "bg-[#0a2540] text-white border-[#0a2540]" : "bg-white text-slate-500 border-slate-200 hover:border-[#00b4d8]"}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {imageMode === "url" ? (
                <div className="flex flex-col gap-2">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={inp}
                    dir="ltr"
                  />
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#00b4d8] rounded-2xl p-8 cursor-pointer transition-colors group">
                  <ImagePlus className="w-8 h-8 text-slate-300 group-hover:text-[#00b4d8] mb-3 transition-colors" />
                  <p className="text-slate-400 text-[13px] font-medium">
                    {t("Click to upload an image", "انقر لرفع صورة")}
                  </p>
                  <p className="text-slate-300 text-[11px] mt-1">
                    PNG, JPG, WEBP
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFile}
                  />
                </label>
              )}

              {/* preview */}
              {imageUrl && (
                <div className="mt-4 relative rounded-2xl overflow-hidden h-40 bg-slate-100 border border-slate-200">
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0.3";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-1 rounded-lg font-medium backdrop-blur-sm">
                    {t("Cover preview", "معاينة الغلاف")}
                  </div>
                </div>
              )}
            </div>

            {/* Videos card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <div
                className={`flex items-center justify-between pb-5 mb-6 border-b border-slate-100 ${isRTL ? "" : ""}`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? "" : ""}`}>
                  <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                    <Youtube className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="text-[#0a2540] font-bold text-[16px]">
                    {t("Course Videos", "فيديوهات الكورس")}
                  </h3>
                  <span className="bg-[#00b4d8]/10 text-[#00b4d8] text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {videos.filter((v) => v.url.trim()).length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addVideo}
                  className={`flex items-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl transition-all ${isRTL ? "" : ""}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t("Add Video", "إضافة فيديو")}
                </button>
              </div>

              <div className="space-y-3">
                {videos.map((video, i) => (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-2xl overflow-hidden hover:border-[#00b4d8]/30 transition-colors"
                  >
                    {/* row */}
                    <div
                      className={`flex items-center gap-3 p-4 bg-[#f8f9fc] ${isRTL ? "" : ""}`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#0a2540] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-[11px]">
                          {i + 1}
                        </span>
                      </div>
                      {video.url.trim() && (
                        <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-200">
                          <img
                            src={ytThumb(video.url)}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}
                      <input
                        value={video.url}
                        onChange={(e) => updateVideo(i, "url", e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#00b4d8] transition-colors"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setVideoPopup(i)}
                        className={`flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-2.5 rounded-xl border transition-all flex-shrink-0 bg-white text-slate-500 border-slate-200 hover:border-[#00b4d8] hover:text-[#00b4d8] ${isRTL ? "" : ""}`}
                      >
                        <Edit2 className="w-3 h-3" />
                        {t("Details", "تفاصيل")}
                      </button>
                      {videos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVideo(i)}
                          className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* filled details summary */}
                    {(video.titleEn || video.titleAr || video.duration) && (
                      <div
                        className={`px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-4 text-[12px] flex-wrap ${isRTL ? "" : ""}`}
                      >
                        {video.titleEn && (
                          <span className="font-semibold text-slate-600 truncate">
                            {video.titleEn}
                          </span>
                        )}
                        {video.titleAr && (
                          <span
                            className="font-semibold text-slate-500 truncate"
                            dir="rtl"
                          >
                            {video.titleAr}
                          </span>
                        )}
                        {video.duration && (
                          <span className="flex items-center gap-1 flex-shrink-0 text-[#00b4d8] font-semibold">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-slate-400 text-[11px] mt-4 leading-relaxed bg-[#f8f9fc] rounded-xl p-3 border border-slate-100">
                💡{" "}
                {t(
                  "Paste any YouTube URL (youtube.com/watch?v=... or youtu.be/...). Videos are embedded privately.",
                  "الصق أي رابط يوتيوب. الفيديوهات مضمّنة بشكل خفي بدون واجهة يوتيوب.",
                )}
              </p>
            </div>
          </div>

          {/* ══ RIGHT sidebar ══════════════════════════════════════════════════ */}
          <div className="space-y-5">
            {/* publish toggle */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-[#0a2540] font-bold text-[15px] mb-5">
                {t("Publish Settings", "إعدادات النشر")}
              </h3>
              <div
                onClick={() => setPublished((p) => !p)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${isRTL ? "" : ""} ${published ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-slate-50"}`}
              >
                <div
                  className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${published ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${published ? (isRTL ? "right-1" : "left-7") : isRTL ? "right-7" : "left-1"}`}
                  />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p
                    className={`font-bold text-[14px] ${published ? "text-emerald-700" : "text-slate-500"}`}
                  >
                    {published ? t("Published", "منشور") : t("Draft", "مسودة")}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {published
                      ? t("Visible to all students", "مرئي لجميع الطلاب")
                      : t("Hidden from students", "مخفي عن الطلاب")}
                  </p>
                </div>
              </div>
            </div>

            {/* pricing & language */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h3 className="text-[#0a2540] font-bold text-[15px]">
                {t("Pricing & Language", "السعر واللغة")}
              </h3>
              <div className="flex flex-col gap-2">
                <label className="text-slate-600 text-[13px] font-bold">
                  {t("Price (EGP)", "السعر (جنيه)")}
                </label>
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
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 text-[12px] font-medium ${isRTL ? "left-4" : "right-4"}`}
                  >
                    EGP
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {t("Set 0 for a free course", "اضبط 0 لكورس مجاني")}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-600 text-[13px] font-bold">
                  {t("Language", "اللغة")}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={inp}
                >
                  <option value="AR">{t("Arabic", "عربي")}</option>
                  <option value="EN">{t("English", "إنجليزي")}</option>
                  <option value="BOTH">
                    {t("Arabic + English", "عربي + إنجليزي")}
                  </option>
                </select>
              </div>
            </div>

            {/* summary */}
            <div className="bg-[#0a2540] rounded-2xl p-6">
              <h3 className="font-bold text-[11px] text-white/40 uppercase tracking-[0.15em] mb-5">
                {t("Summary", "ملخص")}
              </h3>
              <div className="space-y-3.5 text-[13px]">
                {[
                  {
                    en: "Videos",
                    ar: "الفيديوهات",
                    val: `${videos.filter((v) => v.url.trim()).length}`,
                  },
                  {
                    en: "Price",
                    ar: "السعر",
                    val:
                      parseFloat(price) === 0
                        ? t("Free", "مجاني")
                        : `${price} EGP`,
                  },
                  { en: "Language", ar: "اللغة", val: language },
                  {
                    en: "Cover",
                    ar: "الغلاف",
                    val: imageUrl ? t("✓ Set", "✓ محدد") : t("None", "لا يوجد"),
                    color: imageUrl ? "#4ade80" : "#94a3b8",
                  },
                  {
                    en: "Status",
                    ar: "الحالة",
                    val: published
                      ? t("Published", "منشور")
                      : t("Draft", "مسودة"),
                    color: published ? "#4ade80" : "#94a3b8",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between ${isRTL ? "" : ""}`}
                  >
                    <span className="text-white/40">{t(row.en, row.ar)}</span>
                    <span
                      className="font-bold text-white"
                      style={row.color ? { color: row.color } : {}}
                    >
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* submit */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#00b4d8] hover:bg-[#0096b4] disabled:opacity-60 text-white font-bold rounded-xl py-4 text-[15px] transition-all shadow-lg shadow-[#00b4d8]/25 hover:-translate-y-0.5"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEdit
                  ? t("Save Changes", "حفظ التغييرات")
                  : t("Add Course", "إضافة الكورس")}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl py-3.5 text-[14px] transition-all"
              >
                {t("Cancel", "إلغاء")}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* ══ VIDEO DETAILS POPUP ══ */}
      {videoPopup !== null && videos[videoPopup] && (
        <Overlay isRTL={isRTL} maxW="max-w-lg">
          <div
            className={`flex items-center justify-between mb-7 ${isRTL ? "" : ""}`}
          >
            <div className={`flex items-center gap-3 ${isRTL ? "" : ""}`}>
              <div className="w-9 h-9 rounded-xl bg-[#0a2540] flex items-center justify-center">
                <span className="text-white font-bold text-[13px]">
                  {videoPopup + 1}
                </span>
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <h3 className="text-[#0a2540] font-bold text-[18px]">
                  {t("Video Details", "تفاصيل الفيديو")}
                </h3>
                <p className="text-slate-400 text-[12px] mt-0.5">
                  {t(
                    "Optional metadata for this lesson",
                    "بيانات اختيارية لهذا الدرس",
                  )}
                </p>
              </div>
            </div>
            <XBtn onClick={() => setVideoPopup(null)} />
          </div>

          {videos[videoPopup].url.trim() && (
            <div className="mb-6 rounded-2xl overflow-hidden bg-slate-100 h-36">
              <img
                src={ytThumb(videos[videoPopup].url)}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 text-[12px] font-bold">
                  {t("Title (EN)", "العنوان (EN)")}
                </label>
                <input
                  value={videos[videoPopup].titleEn}
                  onChange={(e) =>
                    updateVideo(videoPopup, "titleEn", e.target.value)
                  }
                  placeholder="e.g. Lesson 1"
                  className={`${inp} text-[13px] py-2.5`}
                  dir="ltr"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 text-[12px] font-bold">
                  {t("Title (AR)", "العنوان (AR)")}
                </label>
                <input
                  value={videos[videoPopup].titleAr}
                  onChange={(e) =>
                    updateVideo(videoPopup, "titleAr", e.target.value)
                  }
                  placeholder="مثال: الدرس الأول"
                  className={`${inp} text-[13px] py-2.5`}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 max-w-[200px]">
              <label className="text-slate-600 text-[12px] font-bold">
                {t("Duration", "المدة")}{" "}
                <span className="text-slate-300 font-normal">(12:30)</span>
              </label>
              <input
                value={videos[videoPopup].duration}
                onChange={(e) =>
                  updateVideo(videoPopup, "duration", e.target.value)
                }
                placeholder="12:30"
                className={`${inp} text-[13px] py-2.5`}
                dir="ltr"
              />
            </div>
          </div>

          <button
            onClick={() => setVideoPopup(null)}
            className="mt-6 w-full bg-[#0a2540] hover:bg-[#0d3060] text-white font-bold rounded-xl py-4 text-[14px] transition-all"
          >
            {t("Done ✓", "تم ✓")}
          </button>
        </Overlay>
      )}
    </div>
  );
}
