// "use client";

// import { useEffect, useState } from "react";
// import { useLanguage } from "@/app/hooks/useLanguage";
// import { useRouter } from "next/navigation";
// import {
//   User,
//   BookOpen,
//   Wallet,
//   Clock,
//   CheckCircle2,
//   LogOut,
//   Settings,
//   ChevronRight,
//   AlertCircle,
//   TrendingUp,
//   Award,
//   Loader2,
//   Plus,
// } from "lucide-react";

// // ─── Types ─────────────────────────────────────────────────────────────────────

// interface Course {
//   id: string;
//   title: string;
//   description: string | null;
//   language: string;
// }

// interface Enrollment {
//   id: string;
//   status: "ACTIVE" | "COMPLETED" | "CANCELLED";
//   progress: number;
//   enrolledAt: string;
//   completedAt: string | null;
//   course: Course;
// }

// interface Transaction {
//   id: string;
//   type: "CREDIT" | "DEBIT";
//   amount: number;
//   description: string | null;
//   createdAt: string;
// }

// interface ProfileData {
//   id: string;
//   email: string;
//   fullName: string;
//   phone: string | null;
//   role: string;
//   emailVerified: boolean;
//   createdAt: string;
//   balance: { amount: number } | null;
//   enrollments: Enrollment[];
//   transactions: Transaction[];
// }

// type Tab = "overview" | "courses" | "balance" | "settings";

// // ══════════════════════════════════════════════════════════════════════════════
// export function ProfileClient() {
//   const { t, isRTL } = useLanguage();
//   const router = useRouter();

//   const [profile, setProfile] = useState<ProfileData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<Tab>("overview");
//   const [showRecharge, setShowRecharge] = useState(false);

//   useEffect(() => {
//     fetch("/api/profile")
//       .then((r) => r.json())
//       .then((d) => {
//         setProfile(d.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   async function handleLogout() {
//     await fetch("/api/auth/logout", { method: "POST" });
//     router.push("/auth/login");
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
//         <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
//         <p className="text-slate-400">
//           {t("Failed to load profile", "فشل تحميل الملف الشخصي")}
//         </p>
//       </div>
//     );
//   }

//   const completedCount = profile.enrollments.filter(
//     (e) => e.status === "COMPLETED",
//   ).length;
//   const activeCount = profile.enrollments.filter(
//     (e) => e.status === "ACTIVE",
//   ).length;
//   const balance = profile.balance?.amount ?? 0;

//   const tabs: {
//     key: Tab;
//     labelEn: string;
//     labelAr: string;
//     Icon: React.ElementType;
//   }[] = [
//     { key: "overview", labelEn: "Overview", labelAr: "نظرة عامة", Icon: User },
//     {
//       key: "courses",
//       labelEn: "My Courses",
//       labelAr: "كورساتي",
//       Icon: BookOpen,
//     },
//     { key: "balance", labelEn: "Balance", labelAr: "الرصيد", Icon: Wallet },
//     {
//       key: "settings",
//       labelEn: "Settings",
//       labelAr: "الإعدادات",
//       Icon: Settings,
//     },
//   ];

//   return (
//     <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
//       {/* ── Recharge Modal ── */}
//       {showRecharge && (
//         <RechargeModal
//           userId={profile.id}
//           isRTL={isRTL}
//           t={t}
//           onClose={() => setShowRecharge(false)}
//         />
//       )}

//       {/* ── Header ── */}
//       <div className="bg-primary relative overflow-hidden">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_50%,rgba(0,180,216,0.1),transparent)]" />
//         <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
//           {/* top bar */}
//           <div
//             className={`flex items-center justify-between mb-8 ${isRTL ? "" : ""}`}
//           >
//             <span className="text-white/40 text-[13px]">EN-AVM Academy</span>
//             <button
//               onClick={handleLogout}
//               className={`flex items-center gap-2 text-white/50 hover:text-white text-[13px] transition-colors ${isRTL ? "" : ""}`}
//             >
//               <LogOut className="w-4 h-4" />
//               {t("Logout", "تسجيل الخروج")}
//             </button>
//           </div>

//           {/* avatar + name */}
//           <div className={`flex items-center gap-5 mb-8 ${isRTL ? "" : ""}`}>
//             <div className="w-16 h-16 rounded-2xl bg-secondary/20 border border-[#00b4d8]/30 flex items-center justify-center flex-shrink-0">
//               <span className="text-[#00b4d8] font-serif font-bold text-[26px]">
//                 {profile.fullName.charAt(0).toUpperCase()}
//               </span>
//             </div>
//             <div className={isRTL ? "text-right" : ""}>
//               <h1 className="text-white text-[20px] font-bold">
//                 {profile.fullName}
//               </h1>
//               <p className="text-white/40 text-[13px]">{profile.email}</p>
//               {!profile.emailVerified && (
//                 <span
//                   className={`inline-flex items-center gap-1 text-amber-400 text-[11px] mt-1 ${isRTL ? "" : ""}`}
//                 >
//                   <AlertCircle className="w-3 h-3" />
//                   {t("Email not verified", "البريد غير مفعّل")}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* tabs */}
//           <div className={`flex gap-1 ${isRTL ? "" : ""}`}>
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key)}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${isRTL ? "" : ""} ${
//                   activeTab === tab.key
//                     ? "bg-white/10 text-white"
//                     : "text-white/40 hover:text-white/70"
//                 }`}
//               >
//                 <tab.Icon className="w-4 h-4" />
//                 <span className="hidden sm:block">
//                   {t(tab.labelEn, tab.labelAr)}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Content ── */}
//       <div className="max-w-5xl mx-auto px-6 py-8">
//         {/* ════ OVERVIEW ════ */}
//         {activeTab === "overview" && (
//           <div className="space-y-6">
//             {/* stats */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//               {[
//                 {
//                   Icon: BookOpen,
//                   value: profile.enrollments.length,
//                   labelEn: "Total Courses",
//                   labelAr: "إجمالي الكورسات",
//                   color: "#00b4d8",
//                 },
//                 {
//                   Icon: TrendingUp,
//                   value: activeCount,
//                   labelEn: "In Progress",
//                   labelAr: "جاري التعلم",
//                   color: "#0096b4",
//                 },
//                 {
//                   Icon: Award,
//                   value: completedCount,
//                   labelEn: "Completed",
//                   labelAr: "مكتمل",
//                   color: "#10b981",
//                 },
//                 {
//                   Icon: Wallet,
//                   value: `${balance} EGP`,
//                   labelEn: "Balance",
//                   labelAr: "الرصيد",
//                   color: "#e9c46a",
//                 },
//               ].map((s, i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
//                 >
//                   <div
//                     className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
//                     style={{ backgroundColor: `${s.color}18` }}
//                   >
//                     <s.Icon className="w-4 h-4" style={{ color: s.color }} />
//                   </div>
//                   <div className="font-serif text-[#0a2540] font-bold text-[22px] leading-none mb-1">
//                     {s.value}
//                   </div>
//                   <div className="text-slate-400 text-[12px]">
//                     {t(s.labelEn, s.labelAr)}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* personal info */}
//             <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
//               <h2 className="text-[#0a2540] font-bold text-[16px] mb-5">
//                 {t("Personal Information", "البيانات الشخصية")}
//               </h2>

//               {/* account ID */}
//               <div
//                 className={`flex items-center gap-2 mb-5 p-3 bg-[#f4f6f9] rounded-xl ${isRTL ? "" : ""}`}
//               >
//                 <span className="text-slate-400 text-[12px]">
//                   {t("Account ID:", "رقم الحساب:")}
//                 </span>
//                 <span className="font-mono font-bold text-[#00b4d8] text-[13px] select-all">
//                   {profile.id.slice(0, 8).toUpperCase()}
//                 </span>
//                 <span className="text-slate-400 text-[11px]">
//                   {t(
//                     "(use when contacting support)",
//                     "(استخدمه عند التواصل مع الدعم)",
//                   )}
//                 </span>
//               </div>

//               <div className="grid sm:grid-cols-2 gap-4">
//                 {[
//                   {
//                     labelEn: "Full Name",
//                     labelAr: "الاسم الكامل",
//                     value: profile.fullName,
//                   },
//                   {
//                     labelEn: "Email",
//                     labelAr: "البريد الإلكتروني",
//                     value: profile.email,
//                   },
//                   {
//                     labelEn: "Phone",
//                     labelAr: "رقم الهاتف",
//                     value: profile.phone ?? t("Not provided", "غير محدد"),
//                   },
//                   {
//                     labelEn: "Member since",
//                     labelAr: "عضو منذ",
//                     value: new Date(profile.createdAt).toLocaleDateString(
//                       isRTL ? "ar-EG" : "en-US",
//                       { year: "numeric", month: "long" },
//                     ),
//                   },
//                 ].map((item, i) => (
//                   <div key={i} className="bg-[#f8f9fc] rounded-xl p-4">
//                     <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
//                       {t(item.labelEn, item.labelAr)}
//                     </div>
//                     <div className="text-slate-700 text-[14px] font-medium">
//                       {item.value}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* recent courses */}
//             {profile.enrollments.length > 0 && (
//               <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
//                 <div
//                   className={`flex items-center justify-between mb-5 ${isRTL ? "" : ""}`}
//                 >
//                   <h2 className="text-[#0a2540] font-bold text-[16px]">
//                     {t("Recent Courses", "آخر الكورسات")}
//                   </h2>
//                   <button
//                     onClick={() => setActiveTab("courses")}
//                     className="text-[#00b4d8] text-[13px] hover:underline"
//                   >
//                     {t("View all", "عرض الكل")}
//                   </button>
//                 </div>
//                 <div className="space-y-3">
//                   {profile.enrollments.slice(0, 3).map((e) => (
//                     <CourseCard key={e.id} enrollment={e} isRTL={isRTL} t={t} />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ════ COURSES ════ */}
//         {activeTab === "courses" && (
//           <div className="space-y-4">
//             <h2 className="text-[#0a2540] font-bold text-[18px]">
//               {t("My Courses", "كورساتي")} ({profile.enrollments.length})
//             </h2>
//             {profile.enrollments.length === 0 ? (
//               <EmptyState
//                 icon={BookOpen}
//                 titleEn="No courses yet"
//                 titleAr="لا توجد كورسات بعد"
//                 subtitleEn="Browse our courses and start learning"
//                 subtitleAr="تصفح الكورسات وابدأ التعلم"
//                 t={t}
//               />
//             ) : (
//               profile.enrollments.map((e) => (
//                 <CourseCard
//                   key={e.id}
//                   enrollment={e}
//                   isRTL={isRTL}
//                   t={t}
//                   expanded
//                 />
//               ))
//             )}
//           </div>
//         )}

//         {/* ════ BALANCE ════ */}
//         {activeTab === "balance" && (
//           <div className="space-y-6">
//             {/* balance card */}
//             <div className="bg-primary rounded-3xl p-7 relative overflow-hidden">
//               <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/[0.1] rounded-full blur-3xl" />
//               <div className="relative z-10">
//                 {/* account ID */}
//                 <div
//                   className={`flex items-center gap-2 mb-4 flex-wrap ${isRTL ? "" : ""}`}
//                 >
//                   <span className="text-white/30 text-[11px] uppercase tracking-wider">
//                     {t("Account ID", "رقم الحساب")}
//                   </span>
//                   <span className="font-mono text-white/70 text-[13px] bg-white/5 px-3 py-1 rounded-lg select-all border border-white/10">
//                     {profile.id.slice(0, 8).toUpperCase()}
//                   </span>
//                   <span className="text-white/20 text-[11px]">
//                     {t("(share with support)", "(شاركه مع الدعم)")}
//                   </span>
//                 </div>

//                 <div className="text-white/40 text-[13px] mb-2">
//                   {t("Available Balance", "الرصيد المتاح")}
//                 </div>
//                 <div className="font-serif text-[#00b4d8] font-bold text-[42px] leading-none mb-1">
//                   {balance.toFixed(2)}
//                 </div>
//                 <div className="text-white/30 text-[13px] mb-6">EGP</div>

//                 <button
//                   onClick={() => setShowRecharge(true)}
//                   className={`inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold px-5 py-2.5 rounded-xl text-[14px] shadow-lg shadow-[#00b4d8]/20 transition-all hover:-translate-y-0.5 ${isRTL ? "" : ""}`}
//                 >
//                   <Plus className="w-4 h-4" />
//                   {t("Recharge Balance", "شحن الرصيد")}
//                 </button>
//               </div>
//             </div>

//             {/* transactions */}
//             <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
//               <h2 className="text-[#0a2540] font-bold text-[16px] mb-5">
//                 {t("Transaction History", "سجل المعاملات")}
//               </h2>
//               {profile.transactions.length === 0 ? (
//                 <EmptyState
//                   icon={Wallet}
//                   titleEn="No transactions yet"
//                   titleAr="لا توجد معاملات بعد"
//                   subtitleEn="Your transaction history will appear here"
//                   subtitleAr="سيظهر هنا سجل معاملاتك"
//                   t={t}
//                 />
//               ) : (
//                 <div className="space-y-3">
//                   {profile.transactions.map((tx) => (
//                     <div
//                       key={tx.id}
//                       className={`flex items-center justify-between p-4 rounded-xl bg-[#f8f9fc] ${isRTL ? "" : ""}`}
//                     >
//                       <div
//                         className={`flex items-center gap-3 ${isRTL ? "" : ""}`}
//                       >
//                         <div
//                           className={`w-8 h-8 rounded-xl flex items-center justify-center ${tx.type === "CREDIT" ? "bg-emerald-50" : "bg-red-50"}`}
//                         >
//                           <TrendingUp
//                             className={`w-4 h-4 ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400 rotate-180"}`}
//                           />
//                         </div>
//                         <div className={isRTL ? "text-right" : ""}>
//                           <div className="text-slate-700 text-[14px] font-medium">
//                             {tx.description ??
//                               (tx.type === "CREDIT"
//                                 ? t("Credit", "إيداع")
//                                 : t("Debit", "خصم"))}
//                           </div>
//                           <div className="text-slate-400 text-[12px]">
//                             {new Date(tx.createdAt).toLocaleDateString(
//                               isRTL ? "ar-EG" : "en-US",
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       <div
//                         className={`font-serif font-bold text-[16px] ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400"}`}
//                       >
//                         {tx.type === "CREDIT" ? "+" : "-"}
//                         {tx.amount.toFixed(2)} EGP
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ════ SETTINGS ════ */}
//         {activeTab === "settings" && (
//           <SettingsTab
//             profile={profile}
//             t={t}
//             isRTL={isRTL}
//             onUpdated={(updated) =>
//               setProfile((p) => (p ? { ...p, ...updated } : p))
//             }
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── CourseCard ────────────────────────────────────────────────────────────────
// function CourseCard({
//   enrollment,
//   isRTL,
//   t,
//   expanded = false,
// }: {
//   enrollment: Enrollment;
//   isRTL: boolean;
//   t: (en: string, ar: string) => string;
//   expanded?: boolean;
// }) {
//   const statusColor = {
//     ACTIVE: "bg-blue-50 text-blue-600 border-blue-100",
//     COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
//     CANCELLED: "bg-slate-100 text-slate-400 border-slate-200",
//   }[enrollment.status];

//   const statusLabel = {
//     ACTIVE: t("In Progress", "جاري"),
//     COMPLETED: t("Completed", "مكتمل"),
//     CANCELLED: t("Cancelled", "ملغي"),
//   }[enrollment.status];

//   return (
//     <div className="bg-[#f8f9fc] rounded-2xl border border-slate-100 p-5">
//       <div
//         className={`flex items-start justify-between gap-4 ${isRTL ? "" : ""}`}
//       >
//         <div className="flex-1 min-w-0">
//           <div
//             className={`flex items-center gap-2 mb-1 flex-wrap ${isRTL ? "" : ""}`}
//           >
//             <h3 className="text-slate-800 font-semibold text-[14px] truncate">
//               {enrollment.course.title}
//             </h3>
//             <span
//               className={`text-[11px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${statusColor}`}
//             >
//               {statusLabel}
//             </span>
//           </div>
//           {expanded && enrollment.course.description && (
//             <p className="text-slate-400 text-[13px] leading-relaxed mb-3">
//               {enrollment.course.description}
//             </p>
//           )}
//           <div className={`flex items-center gap-3 ${isRTL ? "" : ""}`}>
//             <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-secondary rounded-full transition-all"
//                 style={{ width: `${enrollment.progress}%` }}
//               />
//             </div>
//             <span className="text-slate-400 text-[12px] flex-shrink-0">
//               {enrollment.progress}%
//             </span>
//           </div>
//         </div>
//         <div
//           className={`text-slate-300 flex-shrink-0 ${isRTL ? "rotate-180" : ""}`}
//         >
//           <ChevronRight className="w-4 h-4" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── EmptyState ────────────────────────────────────────────────────────────────
// function EmptyState({
//   icon: Icon,
//   titleEn,
//   titleAr,
//   subtitleEn,
//   subtitleAr,
//   t,
// }: {
//   icon: React.ElementType;
//   titleEn: string;
//   titleAr: string;
//   subtitleEn: string;
//   subtitleAr: string;
//   t: (en: string, ar: string) => string;
// }) {
//   return (
//     <div className="flex flex-col items-center gap-3 py-12 text-center">
//       <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
//         <Icon className="w-6 h-6 text-slate-300" />
//       </div>
//       <p className="text-slate-500 font-medium text-[15px]">
//         {t(titleEn, titleAr)}
//       </p>
//       <p className="text-slate-400 text-[13px]">{t(subtitleEn, subtitleAr)}</p>
//     </div>
//   );
// }

// // ─── SettingsTab ───────────────────────────────────────────────────────────────
// function SettingsTab({
//   profile,
//   t,
//   isRTL,
//   onUpdated,
// }: {
//   profile: ProfileData;
//   t: (en: string, ar: string) => string;
//   isRTL: boolean;
//   onUpdated: (data: Partial<ProfileData>) => void;
// }) {
//   const [fullName, setFullName] = useState(profile.fullName);
//   const [phone, setPhone] = useState(profile.phone ?? "");
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);

//   const [currPass, setCurrPass] = useState("");
//   const [newPass, setNewPass] = useState("");
//   const [confPass, setConfPass] = useState("");
//   const [pwSaving, setPwSaving] = useState(false);
//   const [pwMsg, setPwMsg] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);

//   async function saveProfile(e: React.FormEvent) {
//     e.preventDefault();
//     setSaving(true);
//     setMsg(null);
//     const res = await fetch("/api/profile", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ fullName, phone }),
//     });
//     const data = await res.json();
//     setSaving(false);
//     if (res.ok) {
//       setMsg({
//         type: "success",
//         text: t("Saved successfully", "تم الحفظ بنجاح"),
//       });
//       onUpdated(data.data);
//     } else {
//       setMsg({ type: "error", text: data.error });
//     }
//   }

//   async function changePassword(e: React.FormEvent) {
//     e.preventDefault();
//     if (newPass !== confPass) {
//       setPwMsg({
//         type: "error",
//         text: t("Passwords do not match", "كلمتا المرور غير متطابقتين"),
//       });
//       return;
//     }
//     setPwSaving(true);
//     setPwMsg(null);
//     const res = await fetch("/api/profile/change-password", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ currentPassword: currPass, newPassword: newPass }),
//     });
//     const data = await res.json();
//     setPwSaving(false);
//     if (res.ok) {
//       setPwMsg({
//         type: "success",
//         text: t("Password changed", "تم تغيير كلمة المرور"),
//       });
//       setCurrPass("");
//       setNewPass("");
//       setConfPass("");
//     } else {
//       setPwMsg({ type: "error", text: data.error });
//     }
//   }

//   const inputCls =
//     "w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all";

//   return (
//     <div className="space-y-6">
//       {/* Edit profile */}
//       <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
//         <h2 className="text-[#0a2540] font-bold text-[16px] mb-5">
//           {t("Edit Profile", "تعديل البيانات")}
//         </h2>
//         <form onSubmit={saveProfile} className="space-y-4">
//           {msg && (
//             <div
//               className={`flex items-center gap-2 rounded-xl px-4 py-3 text-[13px] ${msg.type === "success" ? "bg-emerald-50 border border-emerald-100 text-emerald-600" : "bg-red-50 border border-red-100 text-red-600"}`}
//             >
//               {msg.type === "success" ? (
//                 <CheckCircle2 className="w-4 h-4" />
//               ) : (
//                 <AlertCircle className="w-4 h-4" />
//               )}
//               {msg.text}
//             </div>
//           )}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-slate-700 text-[13px] font-medium">
//               {t("Full Name", "الاسم الكامل")}{" "}
//               <span className="text-[#00b4d8]">*</span>
//             </label>
//             <input
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               required
//               className={inputCls}
//             />
//           </div>
//           <div className="flex flex-col gap-1.5">
//             <label className="text-slate-700 text-[13px] font-medium">
//               {t("Phone", "رقم الهاتف")}
//             </label>
//             <input
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder="01xxxxxxxxx"
//               className={inputCls}
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={saving}
//             className={`flex items-center justify-center gap-2 bg-primary hover:bg-[#0d3060] disabled:opacity-60 text-white font-semibold rounded-xl px-6 py-3 text-[14px] transition-all ${isRTL ? "" : ""}`}
//           >
//             {saving ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 {t("Saving...", "جاري الحفظ...")}
//               </>
//             ) : (
//               t("Save Changes", "حفظ التغييرات")
//             )}
//           </button>
//         </form>
//       </div>

//       {/* Change password */}
//       <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
//         <h2 className="text-[#0a2540] font-bold text-[16px] mb-5">
//           {t("Change Password", "تغيير كلمة المرور")}
//         </h2>
//         <form onSubmit={changePassword} className="space-y-4">
//           {pwMsg && (
//             <div
//               className={`flex items-center gap-2 rounded-xl px-4 py-3 text-[13px] ${pwMsg.type === "success" ? "bg-emerald-50 border border-emerald-100 text-emerald-600" : "bg-red-50 border border-red-100 text-red-600"}`}
//             >
//               {pwMsg.type === "success" ? (
//                 <CheckCircle2 className="w-4 h-4" />
//               ) : (
//                 <AlertCircle className="w-4 h-4" />
//               )}
//               {pwMsg.text}
//             </div>
//           )}
//           {(
//             [
//               {
//                 label: t("Current Password", "كلمة المرور الحالية"),
//                 val: currPass,
//                 set: setCurrPass,
//               },
//               {
//                 label: t("New Password", "كلمة المرور الجديدة"),
//                 val: newPass,
//                 set: setNewPass,
//               },
//               {
//                 label: t("Confirm New Password", "تأكيد كلمة المرور الجديدة"),
//                 val: confPass,
//                 set: setConfPass,
//               },
//             ] as { label: string; val: string; set: (v: string) => void }[]
//           ).map((f, i) => (
//             <div key={i} className="flex flex-col gap-1.5">
//               <label className="text-slate-700 text-[13px] font-medium">
//                 {f.label}
//               </label>
//               <input
//                 type="password"
//                 value={f.val}
//                 onChange={(e) => f.set(e.target.value)}
//                 required
//                 className={inputCls}
//               />
//             </div>
//           ))}
//           <button
//             type="submit"
//             disabled={pwSaving}
//             className={`flex items-center justify-center gap-2 bg-primary hover:bg-[#0d3060] disabled:opacity-60 text-white font-semibold rounded-xl px-6 py-3 text-[14px] transition-all ${isRTL ? "" : ""}`}
//           >
//             {pwSaving ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 {t("Saving...", "جاري الحفظ...")}
//               </>
//             ) : (
//               t("Change Password", "تغيير كلمة المرور")
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ─── RechargeModal ─────────────────────────────────────────────────────────────
// function RechargeModal({
//   userId,
//   isRTL,
//   t,
//   onClose,
// }: {
//   userId: string;
//   isRTL: boolean;
//   t: (en: string, ar: string) => string;
//   onClose: () => void;
// }) {
//   const [amount, setAmount] = useState("");
//   const [accName, setAccName] = useState("");
//   const [refNumber, setRefNumber] = useState("");
//   const [sending, setSending] = useState(false);
//   const [done, setDone] = useState(false);

//   const INSTAPAY_NUMBER = "01006407387";
//   const WHATSAPP_NUMBER = "201006407387";
//   const shortId = userId.slice(0, 8).toUpperCase();

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setSending(true);
//     await new Promise((r) => setTimeout(r, 800));
//     setSending(false);
//     setDone(true);
//   }

//   const inputCls =
//     "w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all";

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//       <div
//         dir={isRTL ? "rtl" : "ltr"}
//         className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
//       >
//         <div className="h-1 bg-gradient-to-r from-[#00b4d8] via-[#00b4d8]/60 to-transparent" />
//         <div className="p-7">
//           {done ? (
//             /* ── success ── */
//             <div className="flex flex-col items-center gap-4 py-4 text-center">
//               <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
//                 <CheckCircle2 className="w-8 h-8 text-emerald-500" />
//               </div>
//               <h3 className="text-[#0a2540] font-bold text-[18px]">
//                 {t("Request Sent!", "تم إرسال الطلب!")}
//               </h3>
//               <p className="text-slate-500 text-[14px] leading-relaxed">
//                 {t(
//                   "Your recharge request has been submitted. Balance will be added within 24 hours.",
//                   "تم إرسال طلب الشحن. سيتم إضافة الرصيد خلال 24 ساعة.",
//                 )}
//               </p>
//               <p className="text-slate-400 text-[13px] leading-relaxed">
//                 {t(
//                   "If balance isn't added within 24 hours, contact us on WhatsApp and send your receipt.",
//                   "إذا لم يُضف الرصيد خلال 24 ساعة، تواصل معنا على واتساب وأرسل الإيصال.",
//                 )}
//               </p>
//               <a
//                 href={`https://wa.me/${WHATSAPP_NUMBER}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 className={`inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold px-5 py-2.5 rounded-xl text-[14px] transition-all ${isRTL ? "" : ""}`}
//               >
//                 {t("Contact WhatsApp", "تواصل واتساب")}
//               </a>
//               <button
//                 onClick={onClose}
//                 className="text-slate-400 text-[13px] hover:text-slate-600 transition-colors"
//               >
//                 {t("Close", "إغلاق")}
//               </button>
//             </div>
//           ) : (
//             /* ── form ── */
//             <>
//               <div
//                 className={`flex items-center justify-between mb-6 ${isRTL ? "" : ""}`}
//               >
//                 <h3 className="text-[#0a2540] font-bold text-[18px]">
//                   {t("Recharge Balance", "شحن الرصيد")}
//                 </h3>
//                 <button
//                   onClick={onClose}
//                   className="text-slate-300 hover:text-slate-500 transition-colors text-[20px] leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* payment info */}
//               <div className="bg-[#f4f6f9] rounded-2xl p-4 mb-6 space-y-3">
//                 <p className="text-slate-500 text-[13px] font-medium">
//                   {t("Available Payment Method", "طريقة الدفع المتاحة")}
//                 </p>

//                 <div className={`flex items-center gap-3 ${isRTL ? "" : ""}`}>
//                   <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
//                     <Wallet className="w-4 h-4 text-[#00b4d8]" />
//                   </div>
//                   <div className={isRTL ? "text-right" : ""}>
//                     <div className="text-slate-700 text-[13px] font-semibold">
//                       InstaPay
//                     </div>
//                     <div className="text-slate-400 text-[12px]">
//                       {t("Transfer to number", "حوّل على الرقم")}
//                     </div>
//                   </div>
//                   <div className="ms-auto font-mono text-[#0a2540] font-bold text-[16px] select-all">
//                     {INSTAPAY_NUMBER}
//                   </div>
//                 </div>

//                 <div className="border-t border-slate-200 pt-3">
//                   <p className="text-slate-400 text-[12px] leading-relaxed">
//                     {t(
//                       "Include your Account ID in the transfer note:",
//                       "اذكر رقم حسابك في ملاحظة التحويل:",
//                     )}{" "}
//                     <span className="font-mono font-bold text-[#00b4d8] select-all">
//                       {shortId}
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-slate-700 text-[13px] font-medium">
//                     {t("Amount Sent (EGP)", "المبلغ المرسل (جنيه)")}{" "}
//                     <span className="text-[#00b4d8]">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     min="1"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     placeholder="100"
//                     required
//                     className={inputCls}
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-slate-700 text-[13px] font-medium">
//                     {t("Sender Account Name", "اسم الحساب المرسِل")}{" "}
//                     <span className="text-[#00b4d8]">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={accName}
//                     onChange={(e) => setAccName(e.target.value)}
//                     placeholder={t(
//                       "Name on the sending account",
//                       "الاسم على الحساب المرسِل",
//                     )}
//                     required
//                     className={inputCls}
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-slate-700 text-[13px] font-medium">
//                     {t("Transfer Reference Number", "الرقم المرجعي للتحويل")}{" "}
//                     <span className="text-[#00b4d8]">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={refNumber}
//                     onChange={(e) => setRefNumber(e.target.value)}
//                     placeholder={t("e.g. TXN123456", "مثال: TXN123456")}
//                     required
//                     className={inputCls}
//                   />
//                 </div>

//                 <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
//                   <p className="text-amber-600 text-[12px] leading-relaxed">
//                     {t(
//                       `⚠ If balance is not added within 24 hours, contact us on WhatsApp at ${INSTAPAY_NUMBER} and send your receipt.`,
//                       `⚠ إذا لم يُضف الرصيد خلال 24 ساعة، تواصل معنا على واتساب على ${INSTAPAY_NUMBER} وأرسل الإيصال.`,
//                     )}
//                   </p>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={sending}
//                   className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#0d3060] disabled:opacity-60 text-white font-semibold rounded-xl py-3.5 text-[15px] transition-all"
//                 >
//                   {sending ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       {t("Sending...", "جاري الإرسال...")}
//                     </>
//                   ) : (
//                     t("Submit Request", "إرسال الطلب")
//                   )}
//                 </button>
//               </form>
//             </>
//           )}
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
  User,
  BookOpen,
  Wallet,
  CheckCircle2,
  LogOut,
  Settings,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Award,
  Loader2,
  Plus,
  ImagePlus,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Course {
  id: string;
  title: string;
  description: string | null;
  language: string;
}
interface Enrollment {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  course: Course;
}
interface Transaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string | null;
  createdAt: string;
}
interface ProfileData {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  balance: { amount: number } | null;
  enrollments: Enrollment[];
  transactions: Transaction[];
}
type Tab = "overview" | "courses" | "balance" | "settings";

const inp =
  "w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all";

// ══════════════════════════════════════════════════════════════════════════════
export function ProfileClient() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showRecharge, setShowRecharge] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <p className="text-slate-400">
          {t("Failed to load profile", "فشل تحميل الملف الشخصي")}
        </p>
      </div>
    );

  const completedCount = profile.enrollments.filter(
    (e) => e.status === "COMPLETED",
  ).length;
  const activeCount = profile.enrollments.filter(
    (e) => e.status === "ACTIVE",
  ).length;
  const balance = profile.balance?.amount ?? 0;

  const tabs: {
    key: Tab;
    labelEn: string;
    labelAr: string;
    Icon: React.ElementType;
  }[] = [
    { key: "overview", labelEn: "Overview", labelAr: "نظرة عامة", Icon: User },
    {
      key: "courses",
      labelEn: "My Courses",
      labelAr: "كورساتي",
      Icon: BookOpen,
    },
    { key: "balance", labelEn: "Balance", labelAr: "الرصيد", Icon: Wallet },
    {
      key: "settings",
      labelEn: "Settings",
      labelAr: "الإعدادات",
      Icon: Settings,
    },
  ];

  return (
    <>
      <style>{`
        * { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
        {showRecharge && (
          <RechargeModal
            userId={profile.id}
            isRTL={isRTL}
            t={t}
            onClose={() => setShowRecharge(false)}
            onSuccess={() => {
              setShowRecharge(false);
              fetch("/api/profile")
                .then((r) => r.json())
                .then((d) => setProfile(d.data));
            }}
          />
        )}

        {/* ── Header ── */}
        <div className="bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,180,216,0.12),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full border border-white/[0.03] translate-x-1/3 -translate-y-1/3" />

          <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
            <div
              className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className="text-white/30 text-[13px] font-medium">
                EN-AVM Academy
              </span>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 text-white/40 hover:text-white/80 text-[13px] px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <LogOut className="w-3.5 h-3.5" />
                {t("Logout", "تسجيل الخروج")}
              </button>
            </div>

            <div
              className={`flex items-center gap-5 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00b4d8]/30 to-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-[#00b4d8] font-bold text-[28px]">
                  {profile.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <h1 className="text-white text-[20px] font-bold">
                  {profile.fullName}
                </h1>
                <p className="text-white/40 text-[13px] mt-0.5">
                  {profile.email}
                </p>
                {!profile.emailVerified && (
                  <span
                    className={`inline-flex items-center gap-1 text-amber-400 text-[11px] mt-1 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <AlertCircle className="w-3 h-3" />
                    {t("Email not verified", "البريد غير مفعّل")}
                  </span>
                )}
              </div>
            </div>

            <div className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${isRTL ? "flex-row-reverse" : ""} ${
                    activeTab === tab.key
                      ? "bg-white/[0.12] text-white border border-white/[0.1]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
                  }`}
                >
                  <tab.Icon className="w-4 h-4" />
                  <span className="hidden sm:block">
                    {t(tab.labelEn, tab.labelAr)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    Icon: BookOpen,
                    value: profile.enrollments.length,
                    labelEn: "Total Courses",
                    labelAr: "إجمالي الكورسات",
                    color: "#00b4d8",
                  },
                  {
                    Icon: TrendingUp,
                    value: activeCount,
                    labelEn: "In Progress",
                    labelAr: "جاري التعلم",
                    color: "#0096b4",
                  },
                  {
                    Icon: Award,
                    value: completedCount,
                    labelEn: "Completed",
                    labelAr: "مكتمل",
                    color: "#10b981",
                  },
                  {
                    Icon: Wallet,
                    value: `${balance.toFixed(0)} EGP`,
                    labelEn: "Balance",
                    labelAr: "الرصيد",
                    color: "#e9c46a",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${s.color}18` }}
                    >
                      <s.Icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <div className="font-bold text-[#0a2540] text-[22px] leading-none mb-1">
                      {s.value}
                    </div>
                    <div className="text-slate-400 text-[12px]">
                      {t(s.labelEn, s.labelAr)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2
                  className={`text-[#0a2540] font-bold text-[16px] mb-5 ${isRTL ? "text-right" : ""}`}
                >
                  {t("Personal Information", "البيانات الشخصية")}
                </h2>
                <div
                  className={`flex items-center gap-2 mb-5 p-3 bg-[#f4f6f9] rounded-xl flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className="text-slate-400 text-[12px]">
                    {t("Account ID:", "رقم الحساب:")}
                  </span>
                  <span className="font-mono font-bold text-[#00b4d8] text-[13px] select-all">
                    {profile.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {t(
                      "(use when contacting support)",
                      "(استخدمه عند التواصل مع الدعم)",
                    )}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      labelEn: "Full Name",
                      labelAr: "الاسم الكامل",
                      value: profile.fullName,
                    },
                    {
                      labelEn: "Email",
                      labelAr: "البريد الإلكتروني",
                      value: profile.email,
                    },
                    {
                      labelEn: "Phone",
                      labelAr: "رقم الهاتف",
                      value: profile.phone ?? t("Not provided", "غير محدد"),
                    },
                    {
                      labelEn: "Member since",
                      labelAr: "عضو منذ",
                      value: new Date(profile.createdAt).toLocaleDateString(
                        isRTL ? "ar-EG" : "en-US",
                        { year: "numeric", month: "long" },
                      ),
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`bg-[#f8f9fc] rounded-xl p-4 ${isRTL ? "text-right" : ""}`}
                    >
                      <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                        {t(item.labelEn, item.labelAr)}
                      </div>
                      <div className="text-slate-700 text-[14px] font-medium">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {profile.enrollments.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <div
                    className={`flex items-center justify-between mb-5 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <h2 className="text-[#0a2540] font-bold text-[16px]">
                      {t("Recent Courses", "آخر الكورسات")}
                    </h2>
                    <button
                      onClick={() => setActiveTab("courses")}
                      className="text-[#00b4d8] text-[13px] hover:underline"
                    >
                      {t("View all", "عرض الكل")}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {profile.enrollments.slice(0, 3).map((e) => (
                      <CourseCard
                        key={e.id}
                        enrollment={e}
                        isRTL={isRTL}
                        t={t}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COURSES */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <h2
                className={`text-[#0a2540] font-bold text-[18px] ${isRTL ? "text-right" : ""}`}
              >
                {t("My Courses", "كورساتي")} ({profile.enrollments.length})
              </h2>
              {profile.enrollments.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  titleEn="No courses yet"
                  titleAr="لا توجد كورسات بعد"
                  subtitleEn="Browse our courses and start learning"
                  subtitleAr="تصفح الكورسات وابدأ التعلم"
                  t={t}
                />
              ) : (
                profile.enrollments.map((e) => (
                  <CourseCard
                    key={e.id}
                    enrollment={e}
                    isRTL={isRTL}
                    t={t}
                    expanded
                  />
                ))
              )}
            </div>
          )}

          {/* BALANCE */}
          {activeTab === "balance" && (
            <div className="space-y-6">
              <div className="bg-primary rounded-3xl p-7 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <div
                    className={`flex items-center gap-2 mb-5 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className="text-white/30 text-[11px] uppercase tracking-wider">
                      {t("Account ID", "رقم الحساب")}
                    </span>
                    <span className="font-mono text-white/70 text-[13px] bg-white/[0.07] px-3 py-1 rounded-lg select-all border border-white/10">
                      {profile.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-white/40 text-[13px] mb-2">
                    {t("Available Balance", "الرصيد المتاح")}
                  </div>
                  <div className="text-[#00b4d8] font-bold text-[48px] leading-none mb-1">
                    {balance.toFixed(2)}
                  </div>
                  <div className="text-white/30 text-[14px] mb-7">EGP</div>
                  <button
                    onClick={() => setShowRecharge(true)}
                    className={`inline-flex items-center gap-2 bg-secondary hover:bg-[#0096b4] text-white font-bold px-6 py-3 rounded-xl text-[14px] shadow-lg shadow-[#00b4d8]/25 transition-all hover:-translate-y-0.5 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Plus className="w-4 h-4" />
                    {t("Recharge Balance", "شحن الرصيد")}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2
                  className={`text-[#0a2540] font-bold text-[16px] mb-5 ${isRTL ? "text-right" : ""}`}
                >
                  {t("Transaction History", "سجل المعاملات")}
                </h2>
                {profile.transactions.length === 0 ? (
                  <EmptyState
                    icon={Wallet}
                    titleEn="No transactions yet"
                    titleAr="لا توجد معاملات بعد"
                    subtitleEn="Your transaction history will appear here"
                    subtitleAr="سيظهر هنا سجل معاملاتك"
                    t={t}
                  />
                ) : (
                  <div className="space-y-3">
                    {profile.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className={`flex items-center justify-between p-4 rounded-xl bg-[#f8f9fc] hover:bg-[#f0f2f5] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === "CREDIT" ? "bg-emerald-50" : "bg-red-50"}`}
                          >
                            <TrendingUp
                              className={`w-4 h-4 ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400 rotate-180"}`}
                            />
                          </div>
                          <div className={isRTL ? "text-right" : ""}>
                            <div className="text-slate-700 text-[14px] font-medium">
                              {tx.description ??
                                (tx.type === "CREDIT"
                                  ? t("Credit", "إيداع")
                                  : t("Debit", "خصم"))}
                            </div>
                            <div className="text-slate-400 text-[12px]">
                              {new Date(tx.createdAt).toLocaleDateString(
                                isRTL ? "ar-EG" : "en-US",
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-bold text-[16px] ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400"}`}
                        >
                          {tx.type === "CREDIT" ? "+" : "-"}
                          {tx.amount.toFixed(2)} EGP
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <SettingsTab
              profile={profile}
              t={t}
              isRTL={isRTL}
              onUpdated={(updated) =>
                setProfile((p) => (p ? { ...p, ...updated } : p))
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

// ─── CourseCard ───────────────────────────────────────────────────────────────
function CourseCard({
  enrollment,
  isRTL,
  t,
  expanded = false,
}: {
  enrollment: Enrollment;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  expanded?: boolean;
}) {
  const statusStyle = {
    ACTIVE: "bg-blue-50 text-blue-600 border-blue-100",
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    CANCELLED: "bg-slate-100 text-slate-400 border-slate-200",
  }[enrollment.status];
  const statusLabel = {
    ACTIVE: t("In Progress", "جاري"),
    COMPLETED: t("Completed", "مكتمل"),
    CANCELLED: t("Cancelled", "ملغي"),
  }[enrollment.status];

  return (
    <div className="bg-[#f8f9fc] rounded-2xl border border-slate-100 p-5 hover:border-slate-200 transition-colors">
      <div
        className={`flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <div className="flex-1 min-w-0">
          <div
            className={`flex items-center gap-2 mb-3 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <h3 className="text-slate-800 font-semibold text-[14px] truncate">
              {enrollment.course.title}
            </h3>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold flex-shrink-0 ${statusStyle}`}
            >
              {statusLabel}
            </span>
          </div>
          {expanded && enrollment.course.description && (
            <p className="text-slate-400 text-[13px] leading-relaxed mb-3">
              {enrollment.course.description}
            </p>
          )}
          <div
            className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${enrollment.progress === 100 ? "bg-emerald-500" : "bg-secondary"}`}
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
            <span className="text-slate-400 text-[12px] flex-shrink-0 font-medium">
              {enrollment.progress}%
            </span>
          </div>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-slate-300 flex-shrink-0 mt-1 ${isRTL ? "rotate-180" : ""}`}
        />
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({
  icon: Icon,
  titleEn,
  titleAr,
  subtitleEn,
  subtitleAr,
  t,
}: {
  icon: React.ElementType;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  t: (en: string, ar: string) => string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-slate-600 font-semibold text-[15px]">
        {t(titleEn, titleAr)}
      </p>
      <p className="text-slate-400 text-[13px]">{t(subtitleEn, subtitleAr)}</p>
    </div>
  );
}

// ─── SettingsTab ──────────────────────────────────────────────────────────────
function SettingsTab({
  profile,
  t,
  isRTL,
  onUpdated,
}: {
  profile: ProfileData;
  t: (en: string, ar: string) => string;
  isRTL: boolean;
  onUpdated: (data: Partial<ProfileData>) => void;
}) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg({
        type: "success",
        text: t("Saved successfully", "تم الحفظ بنجاح"),
      });
      onUpdated(data.data);
    } else setMsg({ type: "error", text: data.error });
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPass !== confPass) {
      setPwMsg({
        type: "error",
        text: t("Passwords do not match", "كلمتا المرور غير متطابقتين"),
      });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    const res = await fetch("/api/profile/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currPass, newPassword: newPass }),
    });
    const data = await res.json();
    setPwSaving(false);
    if (res.ok) {
      setPwMsg({
        type: "success",
        text: t("Password changed", "تم تغيير كلمة المرور"),
      });
      setCurrPass("");
      setNewPass("");
      setConfPass("");
    } else setPwMsg({ type: "error", text: data.error });
  }

  const MsgAlert = ({
    m,
  }: {
    m: { type: "success" | "error"; text: string };
  }) => (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-[13px] ${m.type === "success" ? "bg-emerald-50 border border-emerald-100 text-emerald-600" : "bg-red-50 border border-red-100 text-red-600"}`}
    >
      {m.type === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {m.text}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2
          className={`text-[#0a2540] font-bold text-[16px] mb-5 ${isRTL ? "text-right" : ""}`}
        >
          {t("Edit Profile", "تعديل البيانات")}
        </h2>
        <form onSubmit={saveProfile} className="space-y-4">
          {msg && <MsgAlert m={msg} />}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-[13px] font-semibold">
              {t("Full Name", "الاسم الكامل")}{" "}
              <span className="text-[#00b4d8]">*</span>
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={inp}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-[13px] font-semibold">
              {t("Phone", "رقم الهاتف")}
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className={inp}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-[#0d3060] disabled:opacity-60 text-white font-bold rounded-xl px-6 py-3 text-[14px] transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("Saving...", "جاري الحفظ...")}
              </>
            ) : (
              t("Save Changes", "حفظ التغييرات")
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2
          className={`text-[#0a2540] font-bold text-[16px] mb-5 ${isRTL ? "text-right" : ""}`}
        >
          {t("Change Password", "تغيير كلمة المرور")}
        </h2>
        <form onSubmit={changePassword} className="space-y-4">
          {pwMsg && <MsgAlert m={pwMsg} />}
          {(
            [
              {
                label: t("Current Password", "كلمة المرور الحالية"),
                val: currPass,
                set: setCurrPass,
              },
              {
                label: t("New Password", "كلمة المرور الجديدة"),
                val: newPass,
                set: setNewPass,
              },
              {
                label: t("Confirm New Password", "تأكيد كلمة المرور الجديدة"),
                val: confPass,
                set: setConfPass,
              },
            ] as { label: string; val: string; set: (v: string) => void }[]
          ).map((f, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <label className="text-slate-700 text-[13px] font-semibold">
                {f.label}
              </label>
              <input
                type="password"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                required
                className={inp}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={pwSaving}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-[#0d3060] disabled:opacity-60 text-white font-bold rounded-xl px-6 py-3 text-[14px] transition-all"
          >
            {pwSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("Saving...", "جاري الحفظ...")}
              </>
            ) : (
              t("Change Password", "تغيير كلمة المرور")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── RechargeModal ────────────────────────────────────────────────────────────
function RechargeModal({
  userId,
  isRTL,
  t,
  onClose,
  onSuccess,
}: {
  userId: string;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiptB64, setReceiptB64] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const INSTAPAY = "01006407387";
  const WA = "201006407387";
  const shortId = userId.slice(0, 8).toUpperCase();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(
        t("Image must be less than 5MB", "يجب أن تكون الصورة أقل من 5 ميجا"),
      );
      return;
    }
    setReceiptName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptB64(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!receiptB64) {
      setError(t("Please upload the receipt image", "برجاء رفع صورة الإيصال"));
      return;
    }
    setSending(true);
    const res = await fetch("/api/recharge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(amount),
        senderName,
        receiptUrl: receiptB64,
      }),
    });
    const data = await res.json();
    setSending(false);
    if (res.ok) setDone(true);
    else setError(data.error ?? t("Something went wrong", "حدث خطأ ما"));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        <div className="h-1 bg-gradient-to-r from-[#00b4d8] via-[#00b4d8]/60 to-transparent flex-shrink-0" />

        <div
          className="overflow-y-auto p-7"
          style={{ maxHeight: "calc(90vh - 4px)" }}
        >
          {done ? (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-[#0a2540] font-bold text-[20px] mb-2">
                  {t("Request Sent!", "تم إرسال الطلب!")}
                </h3>
                <p className="text-slate-500 text-[14px] leading-relaxed max-w-sm">
                  {t(
                    "Your recharge request has been submitted. Balance will be added within 24 hours after admin review.",
                    "تم إرسال طلب الشحن. سيتم مراجعته وإضافة الرصيد خلال 24 ساعة.",
                  )}
                </p>
              </div>
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#22c55e] text-white font-bold px-6 py-3 rounded-xl text-[14px] transition-all"
              >
                {t("Contact on WhatsApp", "تواصل على واتساب")}
              </a>
              <button
                onClick={onSuccess}
                className="text-slate-400 text-[13px] hover:text-slate-600"
              >
                {t("Close", "إغلاق")}
              </button>
            </div>
          ) : (
            <>
              <div
                className={`flex items-start justify-between mb-7 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className={isRTL ? "text-right" : ""}>
                  <h3 className="text-[#0a2540] font-bold text-[20px]">
                    {t("Recharge Balance", "شحن الرصيد")}
                  </h3>
                  <p className="text-slate-400 text-[13px] mt-0.5">
                    {t(
                      "Send via InstaPay then fill the form",
                      "حوّل عبر انستاباي ثم أكمل البيانات",
                    )}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* payment card */}
              <div className="bg-gradient-to-br from-[#0a2540] to-[#0d3a6e] rounded-2xl p-5 mb-6">
                <p className="text-white/40 text-[11px] uppercase tracking-wider mb-3">
                  {t("Send to", "أرسل على")}
                </p>
                <div
                  className={`flex items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className={isRTL ? "text-right" : ""}>
                    <div className="text-[#00b4d8] font-bold text-[13px] mb-1">
                      InstaPay
                    </div>
                    <div className="text-white font-mono font-bold text-[24px]">
                      {INSTAPAY}
                    </div>
                  </div>
                  <div className="bg-white/[0.07] border border-white/10 rounded-xl px-4 py-2.5 text-center flex-shrink-0">
                    <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">
                      {t("Your ID", "رقم حسابك")}
                    </div>
                    <div className="font-mono text-[#e9c46a] font-bold text-[16px] select-all">
                      {shortId}
                    </div>
                  </div>
                </div>
                <p className="text-white/40 text-[11px] mt-3 leading-relaxed">
                  {t(
                    "Add your Account ID in the transfer note.",
                    "أضف رقم حسابك في ملاحظة التحويل.",
                  )}
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-[13px] mb-5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-[13px] font-semibold">
                    {t("Amount Sent (EGP)", "المبلغ المرسل (جنيه)")}{" "}
                    <span className="text-[#00b4d8]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="100"
                      required
                      className={inp}
                    />
                    <span
                      className={`absolute top-1/2 -translate-y-1/2 text-slate-400 text-[12px] font-medium pointer-events-none ${isRTL ? "left-4" : "right-4"}`}
                    >
                      EGP
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-[13px] font-semibold">
                    {t("Sender Account Name", "اسم الحساب المرسِل")}{" "}
                    <span className="text-[#00b4d8]">*</span>
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder={t(
                      "Name on the sending account",
                      "الاسم على الحساب المرسِل",
                    )}
                    required
                    className={inp}
                  />
                </div>

                {/* receipt image upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-[13px] font-semibold">
                    {t("Transfer Receipt Image", "صورة إيصال التحويل")}{" "}
                    <span className="text-[#00b4d8]">*</span>
                  </label>

                  {receiptB64 ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-[#00b4d8]/20 bg-slate-50">
                      <img
                        src={receiptB64}
                        alt="receipt"
                        className="w-full max-h-56 object-contain p-3"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptB64(null);
                          setReceiptName("");
                        }}
                        className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div
                        className={`absolute bottom-2 ${isRTL ? "right-2" : "left-2"} bg-emerald-500/90 text-white text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {receiptName}
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#00b4d8] rounded-2xl p-8 cursor-pointer transition-all group bg-slate-50/50 hover:bg-secondary/[0.02]">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 group-hover:border-[#00b4d8]/40 flex items-center justify-center mb-4 shadow-sm transition-all">
                        <ImagePlus className="w-6 h-6 text-slate-300 group-hover:text-[#00b4d8] transition-colors" />
                      </div>
                      <p className="text-slate-600 font-semibold text-[14px] mb-1">
                        {t("Upload receipt image", "ارفع صورة الإيصال")}
                      </p>
                      <p className="text-slate-400 text-[12px]">
                        {t(
                          "PNG, JPG, WEBP — max 5MB",
                          "PNG، JPG، WEBP — حد أقصى 5 ميجا",
                        )}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <p className="text-amber-700 text-[12px] leading-relaxed">
                    ⚠{" "}
                    {t(
                      `Balance added within 24 hours. If not, WhatsApp: ${INSTAPAY}`,
                      `الرصيد يُضاف خلال 24 ساعة. إذا لم يُضف واتساب: ${INSTAPAY}`,
                    )}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending || !receiptB64 || !amount || !senderName}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#0d3060] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl py-4 text-[15px] transition-all shadow-lg shadow-[#0a2540]/15"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("Sending...", "جاري الإرسال...")}
                    </>
                  ) : (
                    t("Submit Request", "إرسال الطلب")
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
