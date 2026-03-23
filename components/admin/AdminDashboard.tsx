// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useLanguage } from "@/app/hooks/useLanguage";
// import { useRouter } from "next/navigation";
// import {
//   Users,
//   BookOpen,
//   TrendingUp,
//   LogOut,
//   Search,
//   Plus,
//   Trash2,
//   Edit2,
//   CheckCircle2,
//   AlertCircle,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   ToggleLeft,
//   ToggleRight,
//   ShieldCheck,
//   ShieldOff,
//   X,
//   BarChart2,
//   DollarSign,
//   Youtube,
//   Eye,
//   EyeOff,
//   Clock,
//   PlayCircle,
//   Wallet,
// } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface StatsData {
//   totalUsers: number;
//   totalCourses: number;
//   totalEnrollments: number;
//   totalRevenue: number;
//   recentUsers: {
//     id: string;
//     fullName: string;
//     email: string;
//     role: string;
//     createdAt: string;
//   }[];
//   recentTransactions: {
//     id: string;
//     type: string;
//     amount: number;
//     description: string | null;
//     createdAt: string;
//     user: { fullName: string };
//   }[];
// }
// interface AdminUser {
//   id: string;
//   email: string;
//   fullName: string;
//   phone: string | null;
//   role: string;
//   isActive: boolean;
//   emailVerified: boolean;
//   createdAt: string;
//   balance: { amount: number } | null;
//   _count: { enrollments: number };
// }
// interface Course {
//   id: string;
//   title: string;
//   titleAr: string | null;
//   description: string | null;
//   descriptionAr: string | null;
//   language: string;
//   published: boolean;
//   price: number;
//   videoUrls: string[];
//   createdAt: string;
//   _count: { enrollments: number };
// }
// interface VideoItem {
//   url: string;
//   titleEn: string;
//   titleAr: string;
//   duration: string;
// }

// type Tab = "overview" | "users" | "courses";
// type UserModal = "balance" | "deduct" | "role" | "password" | "delete" | null;
// type CourseView = "list" | "add" | "edit";

// // ─── Shared helpers ───────────────────────────────────────────────────────────
// const inp =
//   "w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all";

// function toEmbed(url: string) {
//   try {
//     const u = new URL(url.trim());
//     if (u.hostname.includes("youtu.be"))
//       return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
//     const v = u.searchParams.get("v");
//     if (v) return `https://www.youtube.com/embed/${v}`;
//   } catch {}
//   return url.trim();
// }
// function thumb(url: string) {
//   try {
//     const id = toEmbed(url).split("/embed/")[1]?.split("?")[0];
//     if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
//   } catch {}
//   return "";
// }

// // ── Toast ─────────────────────────────────────────────────────────────────────
// type ToastMsg = { type: "success" | "error"; text: string } | null;

// function Toast({ msg, onClose }: { msg: ToastMsg; onClose: () => void }) {
//   useEffect(() => {
//     if (!msg) return;
//     const id = setTimeout(onClose, 4000);
//     return () => clearTimeout(id);
//   }, [msg, onClose]);
//   if (!msg) return null;
//   return (
//     <div
//       className={`fixed top-5 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-[14px] font-medium min-w-[280px] max-w-sm ${msg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}
//     >
//       {msg.type === "success" ? (
//         <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
//       ) : (
//         <AlertCircle className="w-4 h-4 flex-shrink-0" />
//       )}
//       <span className="flex-1">{msg.text}</span>
//       <button
//         onClick={onClose}
//         className="opacity-40 hover:opacity-100 transition-opacity"
//       >
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }

// function Spin() {
//   return (
//     <div className="flex justify-center py-24">
//       <Loader2 className="w-7 h-7 text-[#00b4d8] animate-spin" />
//     </div>
//   );
// }

// function Overlay({
//   children,
//   isRTL,
// }: {
//   children: React.ReactNode;
//   isRTL: boolean;
// }) {
//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//       <div
//         dir={isRTL ? "rtl" : "ltr"}
//         className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
//       >
//         <div className="h-1 bg-gradient-to-r from-[#00b4d8] via-[#00b4d8]/50 to-transparent" />
//         <div className="p-7">{children}</div>
//       </div>
//     </div>
//   );
// }

// function XBtn({ onClick }: { onClick: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-300 hover:text-slate-500 flex items-center justify-center transition-colors"
//     >
//       <X className="w-4 h-4" />
//     </button>
//   );
// }

// function ABtn({
//   Icon,
//   color,
//   title,
//   onClick,
// }: {
//   Icon: React.ElementType;
//   color: string;
//   title: string;
//   onClick: () => void;
// }) {
//   const map: Record<string, string> = {
//     emerald: "hover:bg-emerald-50 hover:text-emerald-500",
//     amber: "hover:bg-amber-50 hover:text-amber-500",
//     red: "hover:bg-red-50 hover:text-red-500",
//     purple: "hover:bg-purple-50 hover:text-purple-500",
//     blue: "hover:bg-blue-50 hover:text-blue-500",
//     green: "hover:bg-emerald-50 hover:text-emerald-500",
//   };
//   return (
//     <button
//       title={title}
//       onClick={onClick}
//       className={`w-8 h-8 rounded-lg bg-[#f4f6f9] text-slate-400 flex items-center justify-center transition-colors ${map[color] ?? ""}`}
//     >
//       <Icon className="w-3.5 h-3.5" />
//     </button>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // ROOT
// // ══════════════════════════════════════════════════════════════════════════════
// export function AdminDashboard({ currentUserId }: { currentUserId: string }) {
//   const { t, isRTL } = useLanguage();
//   const router = useRouter();
//   const [tab, setTab] = useState<Tab>("overview");
//   const [toast, setToast] = useState<ToastMsg>(null);
//   const showToast = (type: "success" | "error", text: string) =>
//     setToast({ type, text });

//   const tabs = [
//     { key: "overview" as Tab, en: "Overview", ar: "الرئيسية", Icon: BarChart2 },
//     { key: "users" as Tab, en: "Users", ar: "المستخدمون", Icon: Users },
//     { key: "courses" as Tab, en: "Courses", ar: "الكورسات", Icon: BookOpen },
//   ];

//   return (
//     <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
//       <Toast msg={toast} onClose={() => setToast(null)} />

//       {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
//       <header className="bg-[#0a2540] sticky top-50 z-40 shadow-2xl">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,180,216,0.15),transparent_70%)] pointer-events-none" />
//         <div className="max-w-7xl mx-auto px-8 relative">
//           {/* top bar */}
//           <div
//             className={`flex items-center justify-between h-[72px] border-b border-white/[0.07] ${isRTL ? "" : ""}`}
//           >
//             <div
//               className={`flex items-center gap-4 ${isRTL ? "" : ""}`}
//             >
//               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00b4d8]/30 to-[#00b4d8]/10 border border-[#00b4d8]/40 flex items-center justify-center shadow-lg">
//                 <ShieldCheck className="w-5 h-5 text-[#00b4d8]" />
//               </div>
//               <div className={isRTL ? "text-right" : ""}>
//                 <p className="text-white font-bold text-[16px] leading-tight tracking-tight">
//                   Smart Academy
//                 </p>
//                 <p className="text-[#00b4d8]/50 text-[10px] uppercase tracking-[0.2em] mt-0.5">
//                   {t("Admin Panel", "لوحة التحكم")}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={async () => {
//                 await fetch("/api/auth/logout", { method: "POST" });
//                 router.push("/auth/login");
//               }}
//               className={`flex items-center gap-2 text-white/40 hover:text-white/90 text-[13px] font-medium px-4 py-2.5 rounded-xl hover:bg-white/[0.07] border border-transparent hover:border-white/10 transition-all ${isRTL ? "" : ""}`}
//             >
//               <LogOut className="w-4 h-4" />
//               <span className="hidden sm:block">{t("Logout", "خروج")}</span>
//             </button>
//           </div>

//           {/* nav tabs */}
//           <div
//             className={`flex items-center gap-1 py-3 ${isRTL ? "" : ""}`}
//           >
//             {tabs.map((tb) => (
//               <button
//                 key={tb.key}
//                 onClick={() => setTab(tb.key)}
//                 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${isRTL ? "" : ""} ${tab === tb.key ? "bg-white/[0.12] text-white shadow-inner border border-white/[0.1]" : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"}`}
//               >
//                 <tb.Icon className="w-4 h-4" />
//                 {t(tb.en, tb.ar)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </header>

//       {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
//       <main className="max-w-7xl mx-auto px-8 py-10">
//         {tab === "overview" && <OverviewTab t={t} isRTL={isRTL} />}
//         {tab === "users" && (
//           <UsersTab
//             t={t}
//             isRTL={isRTL}
//             currentUserId={currentUserId}
//             showToast={showToast}
//           />
//         )}
//         {tab === "courses" && (
//           <CoursesSection t={t} isRTL={isRTL} showToast={showToast} />
//         )}
//       </main>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // OVERVIEW
// // ══════════════════════════════════════════════════════════════════════════════
// function OverviewTab({
//   t,
//   isRTL,
// }: {
//   t: (a: string, b: string) => string;
//   isRTL: boolean;
// }) {
//   const [stats, setStats] = useState<StatsData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/admin/stats")
//       .then((r) => r.json())
//       .then((d) => {
//         setStats(d.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading) return <Spin />;
//   if (!stats)
//     return (
//       <p className="text-center text-slate-400 py-20">
//         {t("Failed to load", "فشل التحميل")}
//       </p>
//     );

//   return (
//     <div className="space-y-8">
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
//         {[
//           {
//             Icon: Users,
//             val: stats.totalUsers,
//             en: "Total Users",
//             ar: "إجمالي المستخدمين",
//             c: "#00b4d8",
//           },
//           {
//             Icon: BookOpen,
//             val: stats.totalCourses,
//             en: "Total Courses",
//             ar: "إجمالي الكورسات",
//             c: "#0096b4",
//           },
//           {
//             Icon: TrendingUp,
//             val: stats.totalEnrollments,
//             en: "Total Enrollments",
//             ar: "إجمالي التسجيلات",
//             c: "#10b981",
//           },
//           {
//             Icon: DollarSign,
//             val: `${stats.totalRevenue.toFixed(0)} EGP`,
//             en: "Total Revenue",
//             ar: "إجمالي الإيرادات",
//             c: "#e9c46a",
//           },
//         ].map((s, i) => (
//           <div
//             key={i}
//             className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow"
//           >
//             <div
//               className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
//               style={{ backgroundColor: `${s.c}18` }}
//             >
//               <s.Icon className="w-5 h-5" style={{ color: s.c }} />
//             </div>
//             <div className="font-serif text-[#0a2540] font-bold text-[30px] leading-none mb-2">
//               {s.val}
//             </div>
//             <div className="text-slate-400 text-[13px]">{t(s.en, s.ar)}</div>
//           </div>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm">
//           <h2
//             className={`text-[#0a2540] font-bold text-[15px] mb-6 ${isRTL ? "text-right" : ""}`}
//           >
//             {t("Recent Users", "أحدث المستخدمين")}
//           </h2>
//           <div className="space-y-4">
//             {stats.recentUsers.map((u) => (
//               <div
//                 key={u.id}
//                 className={`flex items-center gap-3 ${isRTL ? "" : ""}`}
//               >
//                 <div className="w-9 h-9 rounded-xl bg-[#00b4d8]/10 flex items-center justify-center flex-shrink-0">
//                   <span className="text-[#00b4d8] font-bold text-[12px]">
//                     {u.fullName.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
//                   <p className="text-slate-700 text-[13px] font-semibold truncate">
//                     {u.fullName}
//                   </p>
//                   <p className="text-slate-400 text-[11px] truncate">
//                     {u.email}
//                   </p>
//                 </div>
//                 <span
//                   className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border flex-shrink-0 ${u.role === "ADMIN" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}
//                 >
//                   {u.role === "ADMIN"
//                     ? t("Admin", "أدمن")
//                     : t("Student", "طالب")}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm">
//           <h2
//             className={`text-[#0a2540] font-bold text-[15px] mb-6 ${isRTL ? "text-right" : ""}`}
//           >
//             {t("Recent Transactions", "أحدث المعاملات")}
//           </h2>
//           <div className="space-y-4">
//             {stats.recentTransactions.map((tx) => (
//               <div
//                 key={tx.id}
//                 className={`flex items-center justify-between gap-3 ${isRTL ? "" : ""}`}
//               >
//                 <div
//                   className={`flex items-center gap-3 min-w-0 ${isRTL ? "" : ""}`}
//                 >
//                   <div
//                     className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === "CREDIT" ? "bg-emerald-50" : "bg-red-50"}`}
//                   >
//                     <Wallet
//                       className={`w-4 h-4 ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400"}`}
//                     />
//                   </div>
//                   <div className={`min-w-0 ${isRTL ? "text-right" : ""}`}>
//                     <p className="text-slate-700 text-[13px] font-semibold truncate">
//                       {tx.user.fullName}
//                     </p>
//                     <p className="text-slate-400 text-[11px]">
//                       {new Date(tx.createdAt).toLocaleDateString(
//                         isRTL ? "ar-EG" : "en-US",
//                       )}
//                     </p>
//                   </div>
//                 </div>
//                 <span
//                   className={`font-bold text-[14px] flex-shrink-0 ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400"}`}
//                 >
//                   {tx.type === "CREDIT" ? "+" : "-"}
//                   {tx.amount} EGP
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // USERS
// // ══════════════════════════════════════════════════════════════════════════════
// function UsersTab({
//   t,
//   isRTL,
//   currentUserId,
//   showToast,
// }: {
//   t: (a: string, b: string) => string;
//   isRTL: boolean;
//   currentUserId: string;
//   showToast: (type: "success" | "error", text: string) => void;
// }) {
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [sel, setSel] = useState<AdminUser | null>(null);
//   const [modal, setModal] = useState<UserModal>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     const r = await fetch(
//       `/api/admin/users?search=${encodeURIComponent(search)}&page=${page}`,
//     );
//     const d = await r.json();
//     if (d.data) {
//       setUsers(d.data.users);
//       setPages(d.data.pages);
//       setTotal(d.data.total);
//     }
//     setLoading(false);
//   }, [search, page]);

//   useEffect(() => {
//     load();
//   }, [load]);
//   useEffect(() => {
//     setPage(1);
//   }, [search]);

//   const open = (u: AdminUser, m: UserModal) => {
//     setSel(u);
//     setModal(m);
//   };
//   const close = () => {
//     setSel(null);
//     setModal(null);
//   };

//   async function toggleActive(u: AdminUser) {
//     const r = await fetch(`/api/admin/users/${u.id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: "toggle_active" }),
//     });
//     if (r.ok) {
//       showToast(
//         "success",
//         u.isActive
//           ? t("User deactivated", "تم إيقاف المستخدم")
//           : t("User activated", "تم تفعيل المستخدم"),
//       );
//       load();
//     } else showToast("error", t("Operation failed", "فشلت العملية"));
//   }

//   return (
//     <div className="space-y-6">
//       <div
//         className={`flex items-center justify-between gap-4 flex-wrap ${isRTL ? "" : ""}`}
//       >
//         <div className="relative flex-1 min-w-[220px] max-w-md">
//           <Search
//             className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none ${isRTL ? "right-4" : "left-4"}`}
//           />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder={t(
//               "Search by name or email...",
//               "ابحث بالاسم أو الإيميل...",
//             )}
//             className={`w-full bg-white border border-slate-200 rounded-xl py-3 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all shadow-sm ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"}`}
//           />
//         </div>
//         <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-500 text-[13px] font-medium shadow-sm">
//           {total} {t("users total", "مستخدم إجمالاً")}
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//         {loading ? (
//           <Spin />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-[13px]">
//               <thead>
//                 <tr className="border-b border-slate-100 bg-[#f8f9fc]">
//                   {[
//                     t("User", "المستخدم"),
//                     t("Role", "الدور"),
//                     t("Balance", "الرصيد"),
//                     t("Courses", "الكورسات"),
//                     t("Status", "الحالة"),
//                     t("Actions", "الإجراءات"),
//                   ].map((h, i) => (
//                     <th
//                       key={i}
//                       className={`px-6 py-4 font-bold text-slate-400 text-[11px] uppercase tracking-wider whitespace-nowrap ${isRTL ? "text-right" : "text-left"}`}
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {users.map((u) => (
//                   <tr
//                     key={u.id}
//                     className="hover:bg-[#f8f9fc]/80 transition-colors"
//                   >
//                     <td className="px-6 py-4">
//                       <div
//                         className={`flex items-center gap-3 ${isRTL ? "" : ""}`}
//                       >
//                         <div className="w-9 h-9 rounded-xl bg-[#00b4d8]/10 flex items-center justify-center flex-shrink-0">
//                           <span className="text-[#00b4d8] font-bold text-[12px]">
//                             {u.fullName.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div className={isRTL ? "text-right" : ""}>
//                           <p className="text-slate-800 font-semibold">
//                             {u.fullName}
//                           </p>
//                           <p className="text-slate-400 text-[11px]">
//                             {u.email}
//                           </p>
//                           <p className="font-mono text-slate-300 text-[10px] select-all mt-0.5">
//                             {u.id.slice(0, 8).toUpperCase()}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${u.role === "ADMIN" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}
//                       >
//                         {u.role === "ADMIN"
//                           ? t("Admin", "أدمن")
//                           : t("Student", "طالب")}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 font-mono text-slate-700 font-medium">
//                       {(u.balance?.amount ?? 0).toFixed(0)} EGP
//                     </td>
//                     <td className="px-6 py-4 text-slate-500 font-medium">
//                       {u._count.enrollments}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${u.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"}`}
//                       >
//                         {u.isActive
//                           ? t("Active", "نشط")
//                           : t("Suspended", "موقوف")}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div
//                         className={`flex items-center gap-1.5 ${isRTL ? "" : ""}`}
//                       >
//                         <ABtn
//                           Icon={Plus}
//                           color="emerald"
//                           title={t("Add Balance", "إضافة رصيد")}
//                           onClick={() => open(u, "balance")}
//                         />
//                         <ABtn
//                           Icon={DollarSign}
//                           color="amber"
//                           title={t("Deduct Balance", "خصم رصيد")}
//                           onClick={() => open(u, "deduct")}
//                         />
//                         {u.id !== currentUserId && (
//                           <>
//                             <ABtn
//                               Icon={u.isActive ? ToggleRight : ToggleLeft}
//                               color={u.isActive ? "red" : "green"}
//                               title={
//                                 u.isActive
//                                   ? t("Deactivate", "إيقاف")
//                                   : t("Activate", "تفعيل")
//                               }
//                               onClick={() => toggleActive(u)}
//                             />
//                             <ABtn
//                               Icon={
//                                 u.role === "ADMIN" ? ShieldOff : ShieldCheck
//                               }
//                               color="purple"
//                               title={
//                                 u.role === "ADMIN"
//                                   ? t("Remove Admin", "إزالة أدمن")
//                                   : t("Make Admin", "ترقية لأدمن")
//                               }
//                               onClick={() => open(u, "role")}
//                             />
//                           </>
//                         )}
//                         <ABtn
//                           Icon={Edit2}
//                           color="blue"
//                           title={t("Reset Password", "تغيير كلمة المرور")}
//                           onClick={() => open(u, "password")}
//                         />
//                         {u.id !== currentUserId && (
//                           <ABtn
//                             Icon={Trash2}
//                             color="red"
//                             title={t("Delete", "حذف")}
//                             onClick={() => open(u, "delete")}
//                           />
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {pages > 1 && (
//         <div
//           className={`flex items-center gap-2 justify-center ${isRTL ? "" : ""}`}
//         >
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page === 1}
//             className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40 hover:border-[#00b4d8] transition-colors shadow-sm"
//           >
//             {isRTL ? (
//               <ChevronRight className="w-4 h-4" />
//             ) : (
//               <ChevronLeft className="w-4 h-4" />
//             )}
//           </button>
//           <span className="text-slate-500 text-[13px] px-3 font-medium">
//             {page} / {pages}
//           </span>
//           <button
//             onClick={() => setPage((p) => Math.min(pages, p + 1))}
//             disabled={page === pages}
//             className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40 hover:border-[#00b4d8] transition-colors shadow-sm"
//           >
//             {isRTL ? (
//               <ChevronLeft className="w-4 h-4" />
//             ) : (
//               <ChevronRight className="w-4 h-4" />
//             )}
//           </button>
//         </div>
//       )}

//       {sel && modal === "balance" && (
//         <BalanceModal
//           user={sel}
//           action="add_balance"
//           isRTL={isRTL}
//           t={t}
//           onClose={close}
//           onSuccess={() => {
//             showToast("success", t("Balance added", "تم إضافة الرصيد"));
//             load();
//             close();
//           }}
//           onError={(e) => showToast("error", e)}
//         />
//       )}
//       {sel && modal === "deduct" && (
//         <BalanceModal
//           user={sel}
//           action="deduct_balance"
//           isRTL={isRTL}
//           t={t}
//           onClose={close}
//           onSuccess={() => {
//             showToast("success", t("Balance deducted", "تم خصم الرصيد"));
//             load();
//             close();
//           }}
//           onError={(e) => showToast("error", e)}
//         />
//       )}
//       {sel && modal === "password" && (
//         <PasswordModal
//           user={sel}
//           isRTL={isRTL}
//           t={t}
//           onClose={close}
//           onSuccess={() => {
//             showToast("success", t("Password reset", "تم تغيير كلمة المرور"));
//             close();
//           }}
//           onError={(e) => showToast("error", e)}
//         />
//       )}
//       {sel && modal === "role" && (
//         <ConfirmModal
//           isRTL={isRTL}
//           title={
//             sel.role === "ADMIN"
//               ? t("Remove Admin", "إزالة الأدمن")
//               : t("Make Admin", "ترقية لأدمن")
//           }
//           message={
//             sel.role === "ADMIN"
//               ? t(
//                   `Remove admin from ${sel.fullName}?`,
//                   `إزالة صلاحيات ${sel.fullName}؟`,
//                 )
//               : t(`Make ${sel.fullName} admin?`, `ترقية ${sel.fullName} لأدمن؟`)
//           }
//           confirmLabel={t("Confirm", "تأكيد")}
//           confirmColor="purple"
//           onClose={close}
//           onConfirm={async () => {
//             const r = await fetch(`/api/admin/users/${sel.id}`, {
//               method: "PATCH",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 action: "change_role",
//                 role: sel.role === "ADMIN" ? "STUDENT" : "ADMIN",
//               }),
//             });
//             const d = await r.json();
//             if (r.ok) {
//               showToast("success", t("Role updated", "تم التحديث"));
//               load();
//               close();
//             } else showToast("error", d.error);
//           }}
//         />
//       )}
//       {sel && modal === "delete" && (
//         <ConfirmModal
//           isRTL={isRTL}
//           title={t("Delete User", "حذف المستخدم")}
//           message={t(
//             `Delete ${sel.fullName}? This cannot be undone.`,
//             `حذف ${sel.fullName}؟ لا يمكن التراجع.`,
//           )}
//           confirmLabel={t("Delete", "حذف")}
//           confirmColor="red"
//           onClose={close}
//           onConfirm={async () => {
//             const r = await fetch(`/api/admin/users/${sel.id}`, {
//               method: "DELETE",
//             });
//             const d = await r.json();
//             if (r.ok) {
//               showToast("success", t("User deleted", "تم الحذف"));
//               load();
//               close();
//             } else showToast("error", d.error);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // COURSES SECTION
// // ══════════════════════════════════════════════════════════════════════════════
// function CoursesSection({
//   t,
//   isRTL,
//   showToast,
// }: {
//   t: (a: string, b: string) => string;
//   isRTL: boolean;
//   showToast: (type: "success" | "error", text: string) => void;
// }) {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState<CourseView>("list");
//   const [editTarget, setEditTarget] = useState<Course | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     const r = await fetch("/api/admin/courses");
//     const d = await r.json();
//     if (d.success) setCourses(d.data);
//     else
//       showToast(
//         "error",
//         d.error ?? t("Failed to load courses", "فشل تحميل الكورسات"),
//       );
//     setLoading(false);
//   }, []); // eslint-disable-line

//   useEffect(() => {
//     load();
//   }, [load]);

//   async function togglePublish(c: Course) {
//     const r = await fetch(`/api/admin/courses/${c.id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ published: !c.published }),
//     });
//     if (r.ok) {
//       showToast(
//         "success",
//         c.published
//           ? t("Unpublished", "تم إلغاء النشر")
//           : t("Published", "تم النشر"),
//       );
//       load();
//     } else showToast("error", t("Failed", "فشلت العملية"));
//   }

//   async function deleteCourse(c: Course) {
//     if (!confirm(t(`Delete "${c.title}"?`, `حذف "${c.titleAr ?? c.title}"؟`)))
//       return;
//     const r = await fetch(`/api/admin/courses/${c.id}`, { method: "DELETE" });
//     if (r.ok) {
//       showToast("success", t("Course deleted", "تم حذف الكورس"));
//       load();
//     } else showToast("error", t("Failed", "فشلت العملية"));
//   }

//   if (view !== "list") {
//     return (
//       <CourseForm
//         t={t}
//         isRTL={isRTL}
//         course={view === "edit" ? (editTarget ?? undefined) : undefined}
//         onBack={() => {
//           setView("list");
//           setEditTarget(null);
//         }}
//         onSuccess={(msg) => {
//           showToast("success", msg);
//           setView("list");
//           setEditTarget(null);
//           load();
//         }}
//         onError={(e) => showToast("error", e)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div
//         className={`flex items-end justify-between ${isRTL ? "" : ""}`}
//       >
//         <div className={isRTL ? "text-right" : ""}>
//           <h2 className="text-[#0a2540] font-bold text-[22px]">
//             {t("Courses", "الكورسات")}
//           </h2>
//           <p className="text-slate-400 text-[13px] mt-1">
//             {courses.length} {t("courses total", "كورس إجمالاً")}
//           </p>
//         </div>
//         <button
//           onClick={() => setView("add")}
//           className={`flex items-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] text-white font-bold px-6 py-3 rounded-xl text-[14px] shadow-lg shadow-[#0a2540]/20 transition-all hover:-translate-y-0.5 ${isRTL ? "" : ""}`}
//         >
//           <Plus className="w-4 h-4" />
//           {t("Add Course", "إضافة كورس")}
//         </button>
//       </div>

//       {loading ? (
//         <Spin />
//       ) : courses.length === 0 ? (
//         <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-24 text-center">
//           <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
//             <BookOpen className="w-7 h-7 text-slate-300" />
//           </div>
//           <p className="text-slate-400 font-semibold mb-3">
//             {t("No courses yet", "لا توجد كورسات بعد")}
//           </p>
//           <button
//             onClick={() => setView("add")}
//             className="text-[#00b4d8] text-[14px] hover:underline font-semibold"
//           >
//             {t("Add your first course →", "أضف أول كورس ←")}
//           </button>
//         </div>
//       ) : (
//         <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//           {courses.map((c) => (
//             <div
//               key={c.id}
//               className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
//             >
//               <div className="relative h-44 bg-slate-100 overflow-hidden">
//                 {c.videoUrls[0] ? (
//                   <img
//                     src={thumb(c.videoUrls[0])}
//                     alt={c.title}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).style.display = "none";
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-slate-50">
//                     <Youtube className="w-12 h-12 text-slate-200" />
//                   </div>
//                 )}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
//                 <div
//                   className={`absolute top-3 ${isRTL ? "right-3" : "left-3"} flex gap-2`}
//                 >
//                   <span
//                     className={`text-[10px] px-2.5 py-1 rounded-full font-bold backdrop-blur-sm ${c.published ? "bg-emerald-500 text-white" : "bg-white/25 text-white border border-white/30"}`}
//                   >
//                     {c.published
//                       ? t("Published", "منشور")
//                       : t("Draft", "مسودة")}
//                   </span>
//                   {c.price === 0 ? (
//                     <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-[#00b4d8] text-white">
//                       {t("Free", "مجاني")}
//                     </span>
//                   ) : (
//                     <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-[#e9c46a] text-[#0a2540]">
//                       {c.price} EGP
//                     </span>
//                   )}
//                 </div>
//                 <div
//                   className={`absolute bottom-3 ${isRTL ? "left-3" : "right-3"} flex items-center gap-1.5 text-white text-[12px] font-semibold`}
//                 >
//                   <PlayCircle className="w-4 h-4" />
//                   {c.videoUrls.length} {t("videos", "فيديو")}
//                 </div>
//               </div>
//               <div className="p-5">
//                 <h3
//                   className={`text-[#0a2540] font-bold text-[15px] mb-0.5 line-clamp-1 ${isRTL ? "text-right" : ""}`}
//                 >
//                   {isRTL && c.titleAr ? c.titleAr : c.title}
//                 </h3>
//                 {(isRTL ? c.title : c.titleAr) && (
//                   <p
//                     className={`text-slate-400 text-[12px] mb-3 line-clamp-1 ${isRTL ? "text-right" : ""}`}
//                   >
//                     {isRTL ? c.title : c.titleAr}
//                   </p>
//                 )}
//                 <div
//                   className={`flex items-center gap-3 text-slate-400 text-[12px] mb-5 ${isRTL ? "" : ""}`}
//                 >
//                   <span
//                     className={`flex items-center gap-1 ${isRTL ? "" : ""}`}
//                   >
//                     <Users className="w-3 h-3" />
//                     {c._count.enrollments} {t("enrolled", "مسجّل")}
//                   </span>
//                   <span className="text-slate-200">·</span>
//                   <span
//                     className={`flex items-center gap-1 ${isRTL ? "" : ""}`}
//                   >
//                     <Clock className="w-3 h-3" />
//                     {new Date(c.createdAt).toLocaleDateString(
//                       isRTL ? "ar-EG" : "en-US",
//                       { month: "short", day: "numeric" },
//                     )}
//                   </span>
//                 </div>
//                 <div
//                   className={`flex items-center gap-2 ${isRTL ? "" : ""}`}
//                 >
//                   <button
//                     onClick={() => togglePublish(c)}
//                     className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold border transition-all ${isRTL ? "" : ""} ${c.published ? "bg-slate-50 text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"}`}
//                   >
//                     {c.published ? (
//                       <>
//                         <EyeOff className="w-3.5 h-3.5" />
//                         {t("Unpublish", "إلغاء النشر")}
//                       </>
//                     ) : (
//                       <>
//                         <Eye className="w-3.5 h-3.5" />
//                         {t("Publish", "نشر")}
//                       </>
//                     )}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setEditTarget(c);
//                       setView("edit");
//                     }}
//                     className="w-10 h-10 rounded-xl bg-[#f4f6f9] hover:bg-[#00b4d8]/10 text-slate-400 hover:text-[#00b4d8] flex items-center justify-center transition-colors"
//                   >
//                     <Edit2 className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => deleteCourse(c)}
//                     className="w-10 h-10 rounded-xl bg-[#f4f6f9] hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // COURSE FORM (full page)
// // ══════════════════════════════════════════════════════════════════════════════
// function CourseForm({
//   t,
//   isRTL,
//   course,
//   onBack,
//   onSuccess,
//   onError,
// }: {
//   t: (a: string, b: string) => string;
//   isRTL: boolean;
//   course?: Course;
//   onBack: () => void;
//   onSuccess: (msg: string) => void;
//   onError: (e: string) => void;
// }) {
//   const isEdit = !!course;
//   const [title, setTitle] = useState(course?.title ?? "");
//   const [titleAr, setTitleAr] = useState(course?.titleAr ?? "");
//   const [description, setDescription] = useState(course?.description ?? "");
//   const [descriptionAr, setDescriptionAr] = useState(
//     course?.descriptionAr ?? "",
//   );
//   const [price, setPrice] = useState(String(course?.price ?? 0));
//   const [language, setLanguage] = useState(course?.language ?? "AR");
//   const [published, setPublished] = useState(course?.published ?? false);
//   const [loading, setLoading] = useState(false);
//   const [videos, setVideos] = useState<VideoItem[]>(
//     course?.videoUrls?.length
//       ? course.videoUrls.map((u) => ({
//           url: u,
//           titleEn: "",
//           titleAr: "",
//           duration: "",
//         }))
//       : [{ url: "", titleEn: "", titleAr: "", duration: "" }],
//   );
//   const [videoPopup, setVideoPopup] = useState<number | null>(null);

//   const addVideo = () =>
//     setVideos((v) => [
//       ...v,
//       { url: "", titleEn: "", titleAr: "", duration: "" },
//     ]);
//   const removeVideo = (i: number) => {
//     setVideos((v) => v.filter((_, idx) => idx !== i));
//     if (videoPopup === i) setVideoPopup(null);
//   };
//   const updateVideo = (i: number, f: keyof VideoItem, val: string) =>
//     setVideos((v) =>
//       v.map((item, idx) => (idx === i ? { ...item, [f]: val } : item)),
//     );

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     const validUrls = videos.map((v) => toEmbed(v.url)).filter((u) => u !== "");
//     if (!validUrls.length) {
//       onError(t("Add at least one video URL", "أضف رابط فيديو واحد على الأقل"));
//       return;
//     }
//     setLoading(true);
//     const body = {
//       title,
//       titleAr,
//       description,
//       descriptionAr,
//       language,
//       published,
//       price: parseFloat(price) || 0,
//       videoUrls: validUrls,
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
//           ? t("Course updated", "تم تحديث الكورس")
//           : t("Course added successfully", "تم إضافة الكورس بنجاح"),
//       );
//     else onError(d.error ?? t("Something went wrong", "حدث خطأ ما"));
//   }

//   return (
//     <div dir={isRTL ? "rtl" : "ltr"}>
//       {/* breadcrumb */}
//       <div
//         className={`flex items-center gap-2 mb-8 ${isRTL ? "" : ""}`}
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
//           {/* ── LEFT ── */}
//           <div className="xl:col-span-2 space-y-6">
//             {/* info */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
//               <h3 className="text-[#0a2540] font-bold text-[16px] pb-5 mb-6 border-b border-slate-100">
//                 {t("Course Information", "معلومات الكورس")}
//               </h3>
//               <div className="space-y-5">
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div className="flex flex-col gap-2">
//                     <label className="text-slate-600 text-[13px] font-bold">
//                       {t("Title (EN)", "العنوان (EN)")}{" "}
//                       <span className="text-[#00b4d8]">*</span>
//                     </label>
//                     <input
//                       value={title}
//                       onChange={(e) => setTitle(e.target.value)}
//                       required
//                       placeholder="e.g. Introduction to Anatomy"
//                       className={inp}
//                       dir="ltr"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <label className="text-slate-600 text-[13px] font-bold">
//                       {t("Title (AR)", "العنوان (AR)")}
//                     </label>
//                     <input
//                       value={titleAr}
//                       onChange={(e) => setTitleAr(e.target.value)}
//                       placeholder="مثال: مقدمة في علم التشريح"
//                       className={inp}
//                       dir="rtl"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div className="flex flex-col gap-2">
//                     <label className="text-slate-600 text-[13px] font-bold">
//                       {t("Description (EN)", "الوصف (EN)")}
//                     </label>
//                     <textarea
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                       placeholder="Course description..."
//                       rows={4}
//                       className={`${inp} resize-none`}
//                       dir="ltr"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <label className="text-slate-600 text-[13px] font-bold">
//                       {t("Description (AR)", "الوصف (AR)")}
//                     </label>
//                     <textarea
//                       value={descriptionAr}
//                       onChange={(e) => setDescriptionAr(e.target.value)}
//                       placeholder="وصف الكورس..."
//                       rows={4}
//                       className={`${inp} resize-none`}
//                       dir="rtl"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* videos */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
//               <div
//                 className={`flex items-center justify-between pb-5 mb-6 border-b border-slate-100 ${isRTL ? "" : ""}`}
//               >
//                 <div
//                   className={`flex items-center gap-3 ${isRTL ? "" : ""}`}
//                 >
//                   <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
//                     <Youtube className="w-4 h-4 text-red-500" />
//                   </div>
//                   <h3 className="text-[#0a2540] font-bold text-[16px]">
//                     {t("Course Videos", "فيديوهات الكورس")}
//                   </h3>
//                   <span className="bg-[#00b4d8]/10 text-[#00b4d8] text-[11px] font-bold px-2.5 py-1 rounded-full">
//                     {videos.filter((v) => v.url.trim()).length}
//                   </span>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={addVideo}
//                   className={`flex items-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl transition-all ${isRTL ? "" : ""}`}
//                 >
//                   <Plus className="w-3.5 h-3.5" />
//                   {t("Add Video", "إضافة فيديو")}
//                 </button>
//               </div>

//               <div className="space-y-3">
//                 {videos.map((video, i) => (
//                   <div
//                     key={i}
//                     className="border border-slate-200 rounded-2xl overflow-hidden hover:border-[#00b4d8]/30 transition-colors"
//                   >
//                     <div
//                       className={`flex items-center gap-3 p-4 bg-[#f8f9fc] ${isRTL ? "" : ""}`}
//                     >
//                       <div className="w-7 h-7 rounded-lg bg-[#0a2540] flex items-center justify-center flex-shrink-0">
//                         <span className="text-white font-bold text-[11px]">
//                           {i + 1}
//                         </span>
//                       </div>
//                       {video.url.trim() && (
//                         <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 border border-slate-200">
//                           <img
//                             src={thumb(video.url)}
//                             alt=""
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).style.display =
//                                 "none";
//                             }}
//                           />
//                         </div>
//                       )}
//                       <input
//                         value={video.url}
//                         onChange={(e) => updateVideo(i, "url", e.target.value)}
//                         placeholder="https://www.youtube.com/watch?v=..."
//                         className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#00b4d8] transition-colors"
//                         dir="ltr"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setVideoPopup(i)}
//                         className={`flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-2.5 rounded-xl border transition-all flex-shrink-0 bg-white text-slate-500 border-slate-200 hover:border-[#00b4d8] hover:text-[#00b4d8] ${isRTL ? "" : ""}`}
//                       >
//                         <Edit2 className="w-3 h-3" />
//                         {t("Details", "تفاصيل")}
//                       </button>
//                       {videos.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeVideo(i)}
//                           className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors flex-shrink-0"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>
//                     {(video.titleEn || video.titleAr || video.duration) && (
//                       <div
//                         className={`px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-4 text-[12px] text-slate-400 flex-wrap ${isRTL ? "" : ""}`}
//                       >
//                         {video.titleEn && (
//                           <span className="font-semibold text-slate-600 truncate">
//                             {video.titleEn}
//                           </span>
//                         )}
//                         {video.titleAr && (
//                           <span
//                             className="font-semibold text-slate-500 truncate"
//                             dir="rtl"
//                           >
//                             {video.titleAr}
//                           </span>
//                         )}
//                         {video.duration && (
//                           <span className="flex items-center gap-1 flex-shrink-0 text-[#00b4d8]">
//                             <Clock className="w-3 h-3" />
//                             {video.duration}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <p className="text-slate-400 text-[11px] mt-4 leading-relaxed bg-[#f8f9fc] rounded-xl p-3 border border-slate-100">
//                 💡{" "}
//                 {t(
//                   "Paste any YouTube URL. Videos embedded privately — no YouTube UI shown to students.",
//                   "الصق أي رابط يوتيوب. مضمّن بشكل خفي بدون واجهة يوتيوب للطلاب.",
//                 )}
//               </p>
//             </div>
//           </div>

//           {/* ── RIGHT: sidebar ── */}
//           <div className="space-y-5">
//             {/* publish */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//               <h3 className="text-[#0a2540] font-bold text-[15px] mb-5">
//                 {t("Publish Settings", "إعدادات النشر")}
//               </h3>
//               <div
//                 onClick={() => setPublished((p) => !p)}
//                 className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${isRTL ? "" : ""} ${published ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-slate-50"}`}
//               >
//                 <div
//                   className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${published ? "bg-emerald-500" : "bg-slate-300"}`}
//                 >
//                   <div
//                     className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${published ? (isRTL ? "right-1" : "left-7") : isRTL ? "right-7" : "left-1"}`}
//                   />
//                 </div>
//                 <div className={isRTL ? "text-right" : ""}>
//                   <p
//                     className={`font-bold text-[14px] ${published ? "text-emerald-700" : "text-slate-500"}`}
//                   >
//                     {published ? t("Published", "منشور") : t("Draft", "مسودة")}
//                   </p>
//                   <p className="text-[11px] text-slate-400 mt-0.5">
//                     {published
//                       ? t("Visible to all students", "مرئي لجميع الطلاب")
//                       : t("Hidden from students", "مخفي عن الطلاب")}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* price & lang */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
//               <h3 className="text-[#0a2540] font-bold text-[15px]">
//                 {t("Pricing & Language", "السعر واللغة")}
//               </h3>
//               <div className="flex flex-col gap-2">
//                 <label className="text-slate-600 text-[13px] font-bold">
//                   {t("Price (EGP)", "السعر (جنيه)")}
//                 </label>
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
//                   <span
//                     className={`absolute top-1/2 -translate-y-1/2 text-slate-400 text-[12px] font-medium ${isRTL ? "left-4" : "right-4"}`}
//                   >
//                     EGP
//                   </span>
//                 </div>
//                 <p className="text-slate-400 text-[11px]">
//                   {t("Set 0 for a free course", "اضبط 0 لكورس مجاني")}
//                 </p>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label className="text-slate-600 text-[13px] font-bold">
//                   {t("Language", "اللغة")}
//                 </label>
//                 <select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                   className={inp}
//                 >
//                   <option value="AR">{t("Arabic", "عربي")}</option>
//                   <option value="EN">{t("English", "إنجليزي")}</option>
//                   <option value="BOTH">
//                     {t("Arabic + English", "عربي + إنجليزي")}
//                   </option>
//                 </select>
//               </div>
//             </div>

//             {/* summary */}
//             <div className="bg-[#0a2540] rounded-2xl p-6">
//               <h3 className="font-bold text-[11px] text-white/40 uppercase tracking-[0.15em] mb-5">
//                 {t("Summary", "ملخص")}
//               </h3>
//               <div className="space-y-3.5 text-[13px]">
//                 {[
//                   {
//                     en: "Videos",
//                     ar: "الفيديوهات",
//                     val: `${videos.filter((v) => v.url.trim()).length}`,
//                   },
//                   {
//                     en: "Price",
//                     ar: "السعر",
//                     val:
//                       parseFloat(price) === 0
//                         ? t("Free", "مجاني")
//                         : `${price} EGP`,
//                   },
//                   { en: "Language", ar: "اللغة", val: language },
//                   {
//                     en: "Status",
//                     ar: "الحالة",
//                     val: published
//                       ? t("Published", "منشور")
//                       : t("Draft", "مسودة"),
//                     color: published ? "#4ade80" : "#94a3b8",
//                   },
//                 ].map((row, i) => (
//                   <div
//                     key={i}
//                     className={`flex items-center justify-between ${isRTL ? "" : ""}`}
//                   >
//                     <span className="text-white/40">{t(row.en, row.ar)}</span>
//                     <span
//                       className="font-bold text-white"
//                       style={row.color ? { color: row.color } : {}}
//                     >
//                       {row.val}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* submit */}
//             <div className="space-y-3">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex items-center justify-center gap-2 bg-[#00b4d8] hover:bg-[#0096b4] disabled:opacity-60 text-white font-bold rounded-xl py-4 text-[15px] transition-all shadow-lg shadow-[#00b4d8]/25 hover:-translate-y-0.5"
//               >
//                 {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//                 {isEdit
//                   ? t("Save Changes", "حفظ التغييرات")
//                   : t("Add Course", "إضافة الكورس")}
//               </button>
//               <button
//                 type="button"
//                 onClick={onBack}
//                 className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl py-3.5 text-[14px] transition-all"
//               >
//                 {t("Cancel", "إلغاء")}
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>

//       {/* ── VIDEO DETAILS POPUP ── */}
//       {videoPopup !== null && videos[videoPopup] && (
//         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//           <div
//             dir={isRTL ? "rtl" : "ltr"}
//             className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
//           >
//             <div className="h-1 bg-gradient-to-r from-[#00b4d8] via-[#00b4d8]/50 to-transparent" />
//             <div className="p-8">
//               <div
//                 className={`flex items-center justify-between mb-7 ${isRTL ? "" : ""}`}
//               >
//                 <div
//                   className={`flex items-center gap-3 ${isRTL ? "" : ""}`}
//                 >
//                   <div className="w-9 h-9 rounded-xl bg-[#0a2540] flex items-center justify-center">
//                     <span className="text-white font-bold text-[13px]">
//                       {videoPopup + 1}
//                     </span>
//                   </div>
//                   <div className={isRTL ? "text-right" : ""}>
//                     <h3 className="text-[#0a2540] font-bold text-[18px]">
//                       {t("Video Details", "تفاصيل الفيديو")}
//                     </h3>
//                     <p className="text-slate-400 text-[12px] mt-0.5">
//                       {t(
//                         "Optional metadata for this lesson",
//                         "بيانات اختيارية لهذا الدرس",
//                       )}
//                     </p>
//                   </div>
//                 </div>
//                 <XBtn onClick={() => setVideoPopup(null)} />
//               </div>

//               {videos[videoPopup].url.trim() && (
//                 <div className="mb-6 rounded-2xl overflow-hidden bg-slate-100 h-36">
//                   <img
//                     src={thumb(videos[videoPopup].url)}
//                     alt=""
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).style.display = "none";
//                     }}
//                   />
//                 </div>
//               )}

//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-slate-600 text-[12px] font-bold">
//                       {t("Title (EN)", "العنوان (EN)")}
//                     </label>
//                     <input
//                       value={videos[videoPopup].titleEn}
//                       onChange={(e) =>
//                         updateVideo(videoPopup, "titleEn", e.target.value)
//                       }
//                       placeholder="e.g. Lesson 1"
//                       className={`${inp} text-[13px] py-2.5`}
//                       dir="ltr"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-slate-600 text-[12px] font-bold">
//                       {t("Title (AR)", "العنوان (AR)")}
//                     </label>
//                     <input
//                       value={videos[videoPopup].titleAr}
//                       onChange={(e) =>
//                         updateVideo(videoPopup, "titleAr", e.target.value)
//                       }
//                       placeholder="مثال: الدرس الأول"
//                       className={`${inp} text-[13px] py-2.5`}
//                       dir="rtl"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-1.5 max-w-[200px]">
//                   <label className="text-slate-600 text-[12px] font-bold">
//                     {t("Duration", "المدة")}{" "}
//                     <span className="text-slate-300 font-normal">(12:30)</span>
//                   </label>
//                   <input
//                     value={videos[videoPopup].duration}
//                     onChange={(e) =>
//                       updateVideo(videoPopup, "duration", e.target.value)
//                     }
//                     placeholder="12:30"
//                     className={`${inp} text-[13px] py-2.5`}
//                     dir="ltr"
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={() => setVideoPopup(null)}
//                 className="mt-6 w-full bg-[#0a2540] hover:bg-[#0d3060] text-white font-bold rounded-xl py-4 text-[14px] transition-all"
//               >
//                 {t("Done ✓", "تم ✓")}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // USER MODALS
// // ══════════════════════════════════════════════════════════════════════════════
// function BalanceModal({
//   user,
//   action,
//   isRTL,
//   t,
//   onClose,
//   onSuccess,
//   onError,
// }: {
//   user: AdminUser;
//   action: "add_balance" | "deduct_balance";
//   isRTL: boolean;
//   t: (a: string, b: string) => string;
//   onClose: () => void;
//   onSuccess: () => void;
//   onError: (e: string) => void;
// }) {
//   const [amount, setAmount] = useState("");
//   const [desc, setDesc] = useState("");
//   const [loading, setLoading] = useState(false);
//   const isAdd = action === "add_balance";
//   async function go(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     const r = await fetch(`/api/admin/users/${user.id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         action,
//         amount: parseFloat(amount),
//         description: desc,
//       }),
//     });
//     const d = await r.json();
//     setLoading(false);
//     if (r.ok) onSuccess();
//     else onError(d.error ?? t("Failed", "فشلت العملية"));
//   }
//   return (
//     <Overlay isRTL={isRTL}>
//       <div
//         className={`flex items-center justify-between mb-6 ${isRTL ? "" : ""}`}
//       >
//         <h3 className="text-[#0a2540] font-bold text-[18px]">
//           {isAdd
//             ? t("Add Balance", "إضافة رصيد")
//             : t("Deduct Balance", "خصم رصيد")}
//         </h3>
//         <XBtn onClick={onClose} />
//       </div>
//       <div className="bg-[#f4f6f9] rounded-xl p-4 mb-6 text-[13px] text-slate-500">
//         {t("User", "المستخدم")}:{" "}
//         <strong className="text-slate-700">{user.fullName}</strong>
//         {" · "}
//         {t("Balance", "الرصيد")}:{" "}
//         <strong className="text-[#00b4d8]">
//           {(user.balance?.amount ?? 0).toFixed(2)} EGP
//         </strong>
//       </div>
//       <form onSubmit={go} className="space-y-4">
//         <div className="flex flex-col gap-1.5">
//           <label className="text-slate-700 text-[13px] font-bold">
//             {t("Amount (EGP)", "المبلغ (جنيه)")}{" "}
//             <span className="text-[#00b4d8]">*</span>
//           </label>
//           <input
//             type="number"
//             min="0.01"
//             step="0.01"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             required
//             placeholder="0.00"
//             className={inp}
//           />
//         </div>
//         <div className="flex flex-col gap-1.5">
//           <label className="text-slate-700 text-[13px] font-bold">
//             {t("Note (optional)", "ملاحظة (اختياري)")}
//           </label>
//           <input
//             type="text"
//             value={desc}
//             onChange={(e) => setDesc(e.target.value)}
//             placeholder={
//               isAdd
//                 ? t("Payment received", "تم استلام الدفع")
//                 : t("Course deduction", "خصم كورس")
//             }
//             className={inp}
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full flex items-center justify-center gap-2 font-bold rounded-xl py-4 text-[15px] text-white disabled:opacity-60 transition-all ${isAdd ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"}`}
//         >
//           {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//           {isAdd
//             ? t("Add Balance", "إضافة الرصيد")
//             : t("Deduct Balance", "خصم الرصيد")}
//         </button>
//       </form>
//     </Overlay>
//   );
// }

// function PasswordModal({
//   user,
//   isRTL,
//   t,
//   onClose,
//   onSuccess,
//   onError,
// }: {
//   user: AdminUser;
//   isRTL: boolean;
//   t: (a: string, b: string) => string;
//   onClose: () => void;
//   onSuccess: () => void;
//   onError: (e: string) => void;
// }) {
//   const [pw, setPw] = useState("");
//   const [loading, setLoading] = useState(false);
//   async function go(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     const r = await fetch(`/api/admin/users/${user.id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: "reset_password", newPassword: pw }),
//     });
//     const d = await r.json();
//     setLoading(false);
//     if (r.ok) onSuccess();
//     else onError(d.error ?? t("Failed", "فشلت العملية"));
//   }
//   return (
//     <Overlay isRTL={isRTL}>
//       <div
//         className={`flex items-center justify-between mb-6 ${isRTL ? "" : ""}`}
//       >
//         <h3 className="text-[#0a2540] font-bold text-[18px]">
//           {t("Reset Password", "تغيير كلمة المرور")}
//         </h3>
//         <XBtn onClick={onClose} />
//       </div>
//       <div className="bg-[#f4f6f9] rounded-xl p-4 mb-6 text-[13px] text-slate-500">
//         {t("User", "المستخدم")}:{" "}
//         <strong className="text-slate-700">{user.fullName}</strong>
//       </div>
//       <form onSubmit={go} className="space-y-4">
//         <div className="flex flex-col gap-1.5">
//           <label className="text-slate-700 text-[13px] font-bold">
//             {t("New Password", "كلمة المرور الجديدة")}{" "}
//             <span className="text-[#00b4d8]">*</span>
//           </label>
//           <input
//             type="password"
//             value={pw}
//             onChange={(e) => setPw(e.target.value)}
//             required
//             minLength={8}
//             placeholder={t("At least 8 characters", "٨ أحرف على الأقل")}
//             className={inp}
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full flex items-center justify-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] disabled:opacity-60 text-white font-bold rounded-xl py-4 text-[15px] transition-all"
//         >
//           {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//           {t("Reset Password", "تعيين كلمة المرور")}
//         </button>
//       </form>
//     </Overlay>
//   );
// }

// function ConfirmModal({
//   isRTL,
//   title,
//   message,
//   confirmLabel,
//   confirmColor,
//   onClose,
//   onConfirm,
// }: {
//   isRTL: boolean;
//   title: string;
//   message: string;
//   confirmLabel: string;
//   confirmColor: "red" | "purple" | "emerald";
//   onClose: () => void;
//   onConfirm: () => Promise<void>;
// }) {
//   const [loading, setLoading] = useState(false);
//   const colors = {
//     red: "bg-red-500 hover:bg-red-600",
//     purple: "bg-purple-500 hover:bg-purple-600",
//     emerald: "bg-emerald-500 hover:bg-emerald-600",
//   };
//   return (
//     <Overlay isRTL={isRTL}>
//       <div
//         className={`flex items-center justify-between mb-5 ${isRTL ? "" : ""}`}
//       >
//         <h3 className="text-[#0a2540] font-bold text-[18px]">{title}</h3>
//         <XBtn onClick={onClose} />
//       </div>
//       <p className="text-slate-500 text-[14px] leading-relaxed mb-8">
//         {message}
//       </p>
//       <div className={`flex gap-3 ${isRTL ? "" : ""}`}>
//         <button
//           onClick={onClose}
//           className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl py-3.5 text-[14px] transition-all"
//         >
//           {t("Cancel", "إلغاء")}
//         </button>
//         <button
//           disabled={loading}
//           onClick={async () => {
//             setLoading(true);
//             await onConfirm();
//             setLoading(false);
//           }}
//           className={`flex-1 flex items-center justify-center gap-2 ${colors[confirmColor]} disabled:opacity-60 text-white font-bold rounded-xl py-3.5 text-[14px] transition-all`}
//         >
//           {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//           {confirmLabel}
//         </button>
//       </div>
//     </Overlay>
//   );
// }

// function t(en: string, _ar: string) {
//   return en;
// }
"use client";

import { useState } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { useRouter } from "next/navigation";
import { BarChart2, Users, BookOpen, ShieldCheck, LogOut } from "lucide-react";

import { Toast } from "./components/ui";
import { OverviewTab } from "./components/OverviewTab";
import { UsersTab } from "./components/UsersTab";
import { CoursesSection } from "./components/CoursesSection";
import type { Tab, ToastMsg } from "./components/types";

export function AdminDashboard({ currentUserId }: { currentUserId: string }) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [toast, setToast] = useState<ToastMsg>(null);
  const showToast = (type: "success" | "error", text: string) =>
    setToast({ type, text });

  const tabs = [
    { key: "overview" as Tab, en: "Overview", ar: "الرئيسية", Icon: BarChart2 },
    { key: "users" as Tab, en: "Users", ar: "المستخدمون", Icon: Users },
    { key: "courses" as Tab, en: "Courses", ar: "الكورسات", Icon: BookOpen },
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
      <Toast msg={toast} onClose={() => setToast(null)} />

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="bg-[#0a2540] sticky top-[-200px] z-40 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,180,216,0.15),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 relative">
          {/* top bar */}

          {/* nav tabs */}
          <div className={`flex items-center gap-1 py-8 ${isRTL ? "" : ""}`}>
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setActiveTab(tb.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${isRTL ? "" : ""} ${
                  activeTab === tb.key
                    ? "bg-white/[0.12] text-white shadow-inner border border-white/[0.1]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
                }`}
              >
                <tb.Icon className="w-4 h-4" />
                {t(tb.en, tb.ar)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl w-full mx-auto px-12 py-20">
        {activeTab === "overview" && <OverviewTab t={t} isRTL={isRTL} />}
        {activeTab === "users" && (
          <UsersTab
            t={t}
            isRTL={isRTL}
            currentUserId={currentUserId}
            showToast={showToast}
          />
        )}
        {activeTab === "courses" && (
          <CoursesSection t={t} isRTL={isRTL} showToast={showToast} />
        )}
      </main>
    </div>
  );
}
