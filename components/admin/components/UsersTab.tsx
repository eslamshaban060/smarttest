// "use client";

// import { useEffect, useState, useCallback } from "react";
// import {
//   Search,
//   Plus,
//   Trash2,
//   Edit2,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   ToggleLeft,
//   ToggleRight,
//   ShieldCheck,
//   ShieldOff,
//   DollarSign,
// } from "lucide-react";
// import { Spin, Overlay, XBtn, ABtn, ConfirmModal } from "./ui";
// import { inp } from "./types";
// import type { AdminUser, UserModal } from "./types";

// // ── UsersTab ──────────────────────────────────────────────────────────────────
// export function UsersTab({
//   t,
//   isRTL,
//   currentUserId,
//   showToast,
// }: {
//   t: (en: string, ar: string) => string;
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
//       {/* search + count */}
//       <div
//         className={`flex items-center justify-between gap-4 flex-wrap ${isRTL ? "" : ""}`}
//       >
//         <div className="relative flex-1 min-w-[220px] max-w-md">
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder={t(
//               "Search by name or email...",
//               "ابحث بالاسم أو الإيميل...",
//             )}
//             className={`w-full bg-white border border-slate-200 rounded-xl py-3 text-[13px] text-slate-700
//               placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15
//               transition-all shadow-sm ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"}`}
//             style={
//               isRTL
//                 ? { paddingRight: "28px", paddingLeft: "10px" }
//                 : { paddingLeft: "28px", paddingRight: "10px" }
//             }
//           />
//         </div>
//         <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-500 text-[13px] font-medium shadow-sm">
//           {total} {t("users total", "مستخدم إجمالاً")}
//         </div>
//       </div>

//       {/* table */}
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
//                         <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
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
//                         className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${
//                           u.role === "ADMIN"
//                             ? "bg-purple-50 text-purple-600 border-purple-100"
//                             : "bg-slate-100 text-slate-500 border-slate-200"
//                         }`}
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
//                         className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${
//                           u.isActive
//                             ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                             : "bg-red-50 text-red-500 border-red-100"
//                         }`}
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

//       {/* pagination */}
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

//       {/* modals */}
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

// // ── Balance modal ─────────────────────────────────────────────────────────────
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
//   t: (en: string, ar: string) => string;
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
//       {/* <form onSubmit={go} className="space-y-4">
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
//       </form> */}
//       <form onSubmit={go} className="space-y-4 pb-2">
//         {/* amount field */}
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

//         {/* note field */}
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

//         {/* ✅ الزرار لازم يكون هنا جوه الـ form */}
//         <button
//           type="submit"
//           disabled={loading}
//           style={{ backgroundColor: "grean" }}
//           className={`w-full flex items-center justify-center gap-2 font-bold rounded-xl py-4 h-20 text-[15px]  text-red-500  transition-all ${isAdd ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"}`}
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

// // ── Password modal ────────────────────────────────────────────────────────────
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
//   t: (en: string, ar: string) => string;
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
//           className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#0d3060] disabled:opacity-60 text-white font-bold rounded-xl py-4 text-[15px] transition-all"
//         >
//           {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//           {t("Reset Password", "تعيين كلمة المرور")}
//         </button>
//       </form>
//     </Overlay>
//   );
// }
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  ShieldOff,
  DollarSign,
} from "lucide-react";
import { Spin, Overlay, XBtn, ABtn, ConfirmModal } from "./ui";
import { inp } from "./types";
import type { AdminUser, UserModal } from "./types";

// ── UsersTab ──────────────────────────────────────────────────────────────────
export function UsersTab({
  t,
  isRTL,
  currentUserId,
  showToast,
}: {
  t: (en: string, ar: string) => string;
  isRTL: boolean;
  currentUserId: string;
  showToast: (type: "success" | "error", text: string) => void;
}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sel, setSel] = useState<AdminUser | null>(null);
  const [modal, setModal] = useState<UserModal>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch(
      `/api/admin/users?search=${encodeURIComponent(search)}&page=${page}`,
    );
    const d = await r.json();
    if (d.data) {
      setUsers(d.data.users);
      setPages(d.data.pages);
      setTotal(d.data.total);
    }
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  // ✅ بدل useEffect، بنعمل reset للـ page جوه الـ handler
  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  const open = (u: AdminUser, m: UserModal) => {
    setSel(u);
    setModal(m);
  };
  const close = () => {
    setSel(null);
    setModal(null);
  };

  async function toggleActive(u: AdminUser) {
    const r = await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_active" }),
    });
    if (r.ok) {
      showToast(
        "success",
        u.isActive
          ? t("User deactivated", "تم إيقاف المستخدم")
          : t("User activated", "تم تفعيل المستخدم"),
      );
      load();
    } else showToast("error", t("Operation failed", "فشلت العملية"));
  }

  return (
    <div className="space-y-6">
      {/* search + count */}
      <div
        className={`flex items-center justify-between gap-4 flex-wrap ${isRTL ? "" : ""}`}
      >
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t(
              "Search by name or email...",
              "ابحث بالاسم أو الإيميل...",
            )}
            className={`w-full bg-white border border-slate-200 rounded-xl py-3 text-[13px] text-slate-700
              placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15
              transition-all shadow-sm ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"}`}
            style={
              isRTL
                ? { paddingRight: "28px", paddingLeft: "10px" }
                : { paddingLeft: "28px", paddingRight: "10px" }
            }
          />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-500 text-[13px] font-medium shadow-sm">
          {total} {t("users total", "مستخدم إجمالاً")}
        </div>
      </div>

      {/* table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <Spin />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 bg-[#f8f9fc]">
                  {[
                    t("User", "المستخدم"),
                    t("Role", "الدور"),
                    t("Balance", "الرصيد"),
                    t("Courses", "الكورسات"),
                    t("Status", "الحالة"),
                    t("Actions", "الإجراءات"),
                  ].map((h, i) => (
                    <th
                      key={i}
                      className={`px-6 py-4 font-bold text-slate-400 text-[11px] uppercase tracking-wider whitespace-nowrap ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-[#f8f9fc]/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-3 ${isRTL ? "" : ""}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#00b4d8] font-bold text-[12px]">
                            {u.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className={isRTL ? "text-right" : ""}>
                          <p className="text-slate-800 font-semibold">
                            {u.fullName}
                          </p>
                          <p className="text-slate-400 text-[11px]">
                            {u.email}
                          </p>
                          <p className="font-mono text-slate-300 text-[10px] select-all mt-0.5">
                            {u.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${
                          u.role === "ADMIN"
                            ? "bg-purple-50 text-purple-600 border-purple-100"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {u.role === "ADMIN"
                          ? t("Admin", "أدمن")
                          : t("Student", "طالب")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700 font-medium">
                      {(u.balance?.amount ?? 0).toFixed(0)} EGP
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {u._count.enrollments}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-red-50 text-red-500 border-red-100"
                        }`}
                      >
                        {u.isActive
                          ? t("Active", "نشط")
                          : t("Suspended", "موقوف")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-1.5 ${isRTL ? "" : ""}`}
                      >
                        <ABtn
                          Icon={Plus}
                          color="emerald"
                          title={t("Add Balance", "إضافة رصيد")}
                          onClick={() => open(u, "balance")}
                        />
                        <ABtn
                          Icon={DollarSign}
                          color="amber"
                          title={t("Deduct Balance", "خصم رصيد")}
                          onClick={() => open(u, "deduct")}
                        />
                        {u.id !== currentUserId && (
                          <>
                            <ABtn
                              Icon={u.isActive ? ToggleRight : ToggleLeft}
                              color={u.isActive ? "red" : "green"}
                              title={
                                u.isActive
                                  ? t("Deactivate", "إيقاف")
                                  : t("Activate", "تفعيل")
                              }
                              onClick={() => toggleActive(u)}
                            />
                            <ABtn
                              Icon={
                                u.role === "ADMIN" ? ShieldOff : ShieldCheck
                              }
                              color="purple"
                              title={
                                u.role === "ADMIN"
                                  ? t("Remove Admin", "إزالة أدمن")
                                  : t("Make Admin", "ترقية لأدمن")
                              }
                              onClick={() => open(u, "role")}
                            />
                          </>
                        )}
                        <ABtn
                          Icon={Edit2}
                          color="blue"
                          title={t("Reset Password", "تغيير كلمة المرور")}
                          onClick={() => open(u, "password")}
                        />
                        {u.id !== currentUserId && (
                          <ABtn
                            Icon={Trash2}
                            color="red"
                            title={t("Delete", "حذف")}
                            onClick={() => open(u, "delete")}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* pagination */}
      {pages > 1 && (
        <div
          className={`flex items-center gap-2 justify-center ${isRTL ? "" : ""}`}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40 hover:border-[#00b4d8] transition-colors shadow-sm"
          >
            {isRTL ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
          <span className="text-slate-500 text-[13px] px-3 font-medium">
            {page} / {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40 hover:border-[#00b4d8] transition-colors shadow-sm"
          >
            {isRTL ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* modals */}
      {sel && modal === "balance" && (
        <BalanceModal
          user={sel}
          action="add_balance"
          isRTL={isRTL}
          t={t}
          onClose={close}
          onSuccess={() => {
            showToast("success", t("Balance added", "تم إضافة الرصيد"));
            load();
            close();
          }}
          onError={(e) => showToast("error", e)}
        />
      )}
      {sel && modal === "deduct" && (
        <BalanceModal
          user={sel}
          action="deduct_balance"
          isRTL={isRTL}
          t={t}
          onClose={close}
          onSuccess={() => {
            showToast("success", t("Balance deducted", "تم خصم الرصيد"));
            load();
            close();
          }}
          onError={(e) => showToast("error", e)}
        />
      )}
      {sel && modal === "password" && (
        <PasswordModal
          user={sel}
          isRTL={isRTL}
          t={t}
          onClose={close}
          onSuccess={() => {
            showToast("success", t("Password reset", "تم تغيير كلمة المرور"));
            close();
          }}
          onError={(e) => showToast("error", e)}
        />
      )}
      {sel && modal === "role" && (
        <ConfirmModal
          isRTL={isRTL}
          title={
            sel.role === "ADMIN"
              ? t("Remove Admin", "إزالة الأدمن")
              : t("Make Admin", "ترقية لأدمن")
          }
          message={
            sel.role === "ADMIN"
              ? t(
                  `Remove admin from ${sel.fullName}?`,
                  `إزالة صلاحيات ${sel.fullName}؟`,
                )
              : t(`Make ${sel.fullName} admin?`, `ترقية ${sel.fullName} لأدمن؟`)
          }
          confirmLabel={t("Confirm", "تأكيد")}
          confirmColor="purple"
          onClose={close}
          onConfirm={async () => {
            const r = await fetch(`/api/admin/users/${sel.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "change_role",
                role: sel.role === "ADMIN" ? "STUDENT" : "ADMIN",
              }),
            });
            const d = await r.json();
            if (r.ok) {
              showToast("success", t("Role updated", "تم التحديث"));
              load();
              close();
            } else showToast("error", d.error);
          }}
        />
      )}
      {sel && modal === "delete" && (
        <ConfirmModal
          isRTL={isRTL}
          title={t("Delete User", "حذف المستخدم")}
          message={t(
            `Delete ${sel.fullName}? This cannot be undone.`,
            `حذف ${sel.fullName}؟ لا يمكن التراجع.`,
          )}
          confirmLabel={t("Delete", "حذف")}
          confirmColor="red"
          onClose={close}
          onConfirm={async () => {
            const r = await fetch(`/api/admin/users/${sel.id}`, {
              method: "DELETE",
            });
            const d = await r.json();
            if (r.ok) {
              showToast("success", t("User deleted", "تم الحذف"));
              load();
              close();
            } else showToast("error", d.error);
          }}
        />
      )}
    </div>
  );
}

// ── Balance modal ─────────────────────────────────────────────────────────────
function BalanceModal({
  user,
  action,
  isRTL,
  t,
  onClose,
  onSuccess,
  onError,
}: {
  user: AdminUser;
  action: "add_balance" | "deduct_balance";
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (e: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const isAdd = action === "add_balance";

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        amount: parseFloat(amount),
        description: desc,
      }),
    });
    const d = await r.json();
    setLoading(false);
    if (r.ok) onSuccess();
    else onError(d.error ?? t("Failed", "فشلت العملية"));
  }

  return (
    <Overlay isRTL={isRTL}>
      <div
        className={`flex items-center justify-between mb-6 ${isRTL ? "" : ""}`}
      >
        <h3 className="text-[#0a2540] font-bold text-[18px]">
          {isAdd
            ? t("Add Balance", "إضافة رصيد")
            : t("Deduct Balance", "خصم رصيد")}
        </h3>
        <XBtn onClick={onClose} />
      </div>
      <div className="bg-[#f4f6f9] rounded-xl p-4 mb-6 text-[13px] text-slate-500">
        {t("User", "المستخدم")}:{" "}
        <strong className="text-slate-700">{user.fullName}</strong>
        {" · "}
        {t("Balance", "الرصيد")}:{" "}
        <strong className="text-[#00b4d8]">
          {(user.balance?.amount ?? 0).toFixed(2)} EGP
        </strong>
      </div>
      <form onSubmit={go} className="space-y-4 pb-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-[13px] font-bold">
            {t("Amount (EGP)", "المبلغ (جنيه)")}{" "}
            <span className="text-[#00b4d8]">*</span>
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="0.00"
            className={inp}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-[13px] font-bold">
            {t("Note (optional)", "ملاحظة (اختياري)")}
          </label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={
              isAdd
                ? t("Payment received", "تم استلام الدفع")
                : t("Course deduction", "خصم كورس")
            }
            className={inp}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 font-bold rounded-xl py-4 text-[15px] text-white disabled:opacity-60 transition-all ${isAdd ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"}`}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isAdd
            ? t("Add Balance", "إضافة الرصيد")
            : t("Deduct Balance", "خصم الرصيد")}
        </button>
      </form>
    </Overlay>
  );
}

// ── Password modal ────────────────────────────────────────────────────────────
function PasswordModal({
  user,
  isRTL,
  t,
  onClose,
  onSuccess,
  onError,
}: {
  user: AdminUser;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (e: string) => void;
}) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset_password", newPassword: pw }),
    });
    const d = await r.json();
    setLoading(false);
    if (r.ok) onSuccess();
    else onError(d.error ?? t("Failed", "فشلت العملية"));
  }

  return (
    <Overlay isRTL={isRTL}>
      <div
        className={`flex items-center justify-between mb-6 ${isRTL ? "" : ""}`}
      >
        <h3 className="text-[#0a2540] font-bold text-[18px]">
          {t("Reset Password", "تغيير كلمة المرور")}
        </h3>
        <XBtn onClick={onClose} />
      </div>
      <div className="bg-[#f4f6f9] rounded-xl p-4 mb-6 text-[13px] text-slate-500">
        {t("User", "المستخدم")}:{" "}
        <strong className="text-slate-700">{user.fullName}</strong>
      </div>
      <form onSubmit={go} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-[13px] font-bold">
            {t("New Password", "كلمة المرور الجديدة")}{" "}
            <span className="text-[#00b4d8]">*</span>
          </label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            minLength={8}
            placeholder={t("At least 8 characters", "٨ أحرف على الأقل")}
            className={inp}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#0d3060] disabled:opacity-60 text-white font-bold rounded-xl py-4 text-[15px] transition-all"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {t("Reset Password", "تعيين كلمة المرور")}
        </button>
      </form>
    </Overlay>
  );
}
