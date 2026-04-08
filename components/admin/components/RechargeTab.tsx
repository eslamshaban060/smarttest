// "use client";

// import { useEffect, useState, useCallback } from "react";
// import {
//   Loader2,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   ImageIcon,
//   X,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";
// import { Spin, Overlay, XBtn, ConfirmModal } from "./ui";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface RechargeRequest {
//   id: string;
//   amount: number;
//   senderName: string;
//   receiptUrl: string;
//   status: "PENDING" | "APPROVED" | "REJECTED";
//   adminNote: string | null;
//   createdAt: string;
//   user: { id: string; fullName: string; email: string };
// }

// type FilterStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

// // ─── RechargeTab ──────────────────────────────────────────────────────────────
// export function RechargeTab({
//   t,
//   isRTL,
//   showToast,
// }: {
//   t: (en: string, ar: string) => string;
//   isRTL: boolean;
//   showToast: (type: "success" | "error", text: string) => void;
// }) {
//   const [requests, setRequests] = useState<RechargeRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<FilterStatus>("PENDING");
//   const [selected, setSelected] = useState<RechargeRequest | null>(null);
//   const [action, setAction] = useState<"approve" | "reject" | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     const r = await fetch("/api/admin/recharge");
//     const d = await r.json();
//     if (d.success) setRequests(d.data);
//     else showToast("error", d.error ?? t("Failed to load", "فشل التحميل"));
//     setLoading(false);
//   }, []); // eslint-disable-line

//   useEffect(() => {
//     load();
//   }, [load]);

//   const filtered = requests.filter((r) =>
//     filter === "ALL" ? true : r.status === filter,
//   );

//   const counts = {
//     ALL: requests.length,
//     PENDING: requests.filter((r) => r.status === "PENDING").length,
//     APPROVED: requests.filter((r) => r.status === "APPROVED").length,
//     REJECTED: requests.filter((r) => r.status === "REJECTED").length,
//   };

//   const filters: { key: FilterStatus; en: string; ar: string }[] = [
//     { key: "PENDING", en: "Pending", ar: "قيد الانتظار" },
//     { key: "APPROVED", en: "Approved", ar: "مقبولة" },
//     { key: "REJECTED", en: "Rejected", ar: "مرفوضة" },
//     { key: "ALL", en: "All", ar: "الكل" },
//   ];

//   async function handleAction(
//     req: RechargeRequest,
//     act: "approve" | "reject",
//     note?: string,
//   ) {
//     const r = await fetch(`/api/admin/recharge/${req.id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: act, adminNote: note }),
//     });
//     const d = await r.json();
//     if (r.ok) {
//       showToast(
//         "success",
//         act === "approve"
//           ? t(
//               `Added ${req.amount} EGP to ${req.user.fullName}`,
//               `تمت إضافة ${req.amount} جنيه لـ ${req.user.fullName}`,
//             )
//           : t("Request rejected", "تم رفض الطلب"),
//       );
//       load();
//     } else showToast("error", d.error ?? t("Failed", "فشلت العملية"));
//   }

//   return (
//     <div className="space-y-6">
//       {/* header */}
//       <div
//         className={`flex items-end justify-between ${isRTL ? "flex-row-reverse" : ""}`}
//       >
//         <div className={isRTL ? "text-right" : ""}>
//           <h2 className="text-[#0a2540] font-bold text-[22px]">
//             {t("Recharge Requests", "طلبات الشحن")}
//           </h2>
//           <p className="text-slate-400 text-[13px] mt-1">
//             {counts.PENDING} {t("pending review", "في انتظار المراجعة")}
//           </p>
//         </div>

//         {/* filter pills */}
//         <div
//           className={`flex items-center gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
//         >
//           {filters.map((f) => (
//             <button
//               key={f.key}
//               onClick={() => setFilter(f.key)}
//               className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
//                 filter === f.key
//                   ? f.key === "PENDING"
//                     ? "bg-amber-500 text-white shadow-sm"
//                     : f.key === "APPROVED"
//                       ? "bg-emerald-500 text-white shadow-sm"
//                       : f.key === "REJECTED"
//                         ? "bg-red-500 text-white shadow-sm"
//                         : "bg-primary text-white shadow-sm"
//                   : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
//               }`}
//             >
//               {t(f.en, f.ar)}
//               <span
//                 className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${filter === f.key ? "bg-white/20" : "bg-slate-100 text-slate-400"}`}
//               >
//                 {counts[f.key]}
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* list */}
//       {loading ? (
//         <Spin />
//       ) : filtered.length === 0 ? (
//         <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center shadow-sm">
//           <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
//             <CheckCircle2 className="w-6 h-6 text-slate-300" />
//           </div>
//           <p className="text-slate-500 font-semibold text-[15px]">
//             {filter === "PENDING"
//               ? t("No pending requests", "لا توجد طلبات معلّقة")
//               : t("No requests found", "لا توجد طلبات")}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filtered.map((req) => (
//             <RequestCard
//               key={req.id}
//               req={req}
//               isRTL={isRTL}
//               t={t}
//               onApprove={() => {
//                 setSelected(req);
//                 setAction("approve");
//               }}
//               onReject={() => {
//                 setSelected(req);
//                 setAction("reject");
//               }}
//             />
//           ))}
//         </div>
//       )}

//       {/* approve confirm */}
//       {selected && action === "approve" && (
//         <ConfirmModal
//           isRTL={isRTL}
//           title={t("Approve Recharge", "قبول طلب الشحن")}
//           message={t(
//             `Add ${selected.amount} EGP to ${selected.user.fullName}'s balance?`,
//             `إضافة ${selected.amount} جنيه لرصيد ${selected.user.fullName}؟`,
//           )}
//           confirmLabel={t("Approve & Add Balance", "قبول وإضافة الرصيد")}
//           confirmColor="emerald"
//           onClose={() => {
//             setSelected(null);
//             setAction(null);
//           }}
//           onConfirm={async () => {
//             await handleAction(selected, "approve");
//             setSelected(null);
//             setAction(null);
//           }}
//         />
//       )}

//       {/* reject modal */}
//       {selected && action === "reject" && (
//         <RejectModal
//           isRTL={isRTL}
//           t={t}
//           req={selected}
//           onClose={() => {
//             setSelected(null);
//             setAction(null);
//           }}
//           onConfirm={async (note) => {
//             await handleAction(selected, "reject", note);
//             setSelected(null);
//             setAction(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// // ─── RequestCard ──────────────────────────────────────────────────────────────
// function RequestCard({
//   req,
//   isRTL,
//   t,
//   onApprove,
//   onReject,
// }: {
//   req: RechargeRequest;
//   isRTL: boolean;
//   t: (en: string, ar: string) => string;
//   onApprove: () => void;
//   onReject: () => void;
// }) {
//   const [showImg, setShowImg] = useState(false);
//   const [expanded, setExpanded] = useState(false);

//   const statusBadge = {
//     PENDING: {
//       label: t("Pending", "قيد الانتظار"),
//       cls: "bg-amber-50 text-amber-600 border-amber-100",
//     },
//     APPROVED: {
//       label: t("Approved", "مقبول"),
//       cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
//     },
//     REJECTED: {
//       label: t("Rejected", "مرفوض"),
//       cls: "bg-red-50 text-red-500 border-red-100",
//     },
//   }[req.status];

//   return (
//     <>
//       <div
//         className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${req.status === "PENDING" ? "border-amber-100 hover:border-amber-200" : "border-slate-100 hover:border-slate-200"}`}
//       >
//         {/* top accent for pending */}
//         {req.status === "PENDING" && (
//           <div className="h-0.5 bg-gradient-to-r from-amber-400 to-orange-300" />
//         )}

//         <div className="p-6">
//           <div
//             className={`flex items-start gap-5 ${isRTL ? "flex-row-reverse" : ""}`}
//           >
//             {/* receipt thumbnail */}
//             <button
//               onClick={() => setShowImg(true)}
//               className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50 hover:border-[#00b4d8] transition-colors group relative"
//             >
//               {req.receiptUrl ? (
//                 <img
//                   src={req.receiptUrl}
//                   alt="receipt"
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <ImageIcon className="w-6 h-6 text-slate-300" />
//                 </div>
//               )}
//               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
//                 <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
//               </div>
//             </button>

//             {/* info */}
//             <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
//               <div
//                 className={`flex items-start justify-between gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}
//               >
//                 <div>
//                   <p className="text-[#0a2540] font-bold text-[15px]">
//                     {req.user.fullName}
//                   </p>
//                   <p className="text-slate-400 text-[12px] mt-0.5">
//                     {req.user.email}
//                   </p>
//                   <p className="font-mono text-slate-300 text-[10px] mt-0.5 select-all">
//                     {req.user.id.slice(0, 8).toUpperCase()}
//                   </p>
//                 </div>
//                 <div
//                   className={`flex items-center gap-2 flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}
//                 >
//                   <span className="text-[#0a2540] font-bold text-[20px]">
//                     {req.amount}{" "}
//                     <span className="text-[13px] font-normal text-slate-400">
//                       EGP
//                     </span>
//                   </span>
//                   <span
//                     className={`text-[11px] px-2.5 py-1 rounded-full font-bold border flex-shrink-0 ${statusBadge.cls}`}
//                   >
//                     {statusBadge.label}
//                   </span>
//                 </div>
//               </div>

//               {/* meta */}
//               <div
//                 className={`flex items-center gap-4 text-slate-400 text-[12px] flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
//               >
//                 <span
//                   className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
//                 >
//                   <Clock className="w-3.5 h-3.5" />
//                   {new Date(req.createdAt).toLocaleString(
//                     isRTL ? "ar-EG" : "en-US",
//                     {
//                       month: "short",
//                       day: "numeric",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     },
//                   )}
//                 </span>
//                 <span>·</span>
//                 <span>
//                   {t("Sender:", "المرسِل:")}{" "}
//                   <strong className="text-slate-600">{req.senderName}</strong>
//                 </span>
//                 {req.adminNote && (
//                   <>
//                     <span>·</span>
//                     <span className="text-slate-500 italic">
//                       {req.adminNote}
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* actions — only for pending */}
//           {req.status === "PENDING" && (
//             <div
//               className={`flex items-center gap-3 mt-5 pt-5 border-t border-slate-100 ${isRTL ? "flex-row-reverse" : ""}`}
//             >
//               <button
//                 onClick={onApprove}
//                 className={`flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-[13px] transition-all shadow-sm shadow-emerald-500/20 hover:-translate-y-0.5 ${isRTL ? "flex-row-reverse" : ""}`}
//               >
//                 <CheckCircle2 className="w-4 h-4" />
//                 {t("Approve & Add Balance", "قبول وإضافة الرصيد")}
//               </button>
//               <button
//                 onClick={onReject}
//                 className={`flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-bold px-5 py-2.5 rounded-xl text-[13px] transition-all border border-red-100 ${isRTL ? "flex-row-reverse" : ""}`}
//               >
//                 <XCircle className="w-4 h-4" />
//                 {t("Reject", "رفض")}
//               </button>
//               <button
//                 onClick={() => setShowImg(true)}
//                 className="flex items-center gap-1.5 text-slate-400 hover:text-[#00b4d8] text-[12px] font-semibold transition-colors ms-auto"
//               >
//                 <ImageIcon className="w-3.5 h-3.5" />
//                 {t("View Receipt", "عرض الإيصال")}
//               </button>
//             </div>
//           )}

//           {/* view receipt for non-pending */}
//           {req.status !== "PENDING" && (
//             <div
//               className={`flex mt-4 ${isRTL ? "justify-start" : "justify-end"}`}
//             >
//               <button
//                 onClick={() => setShowImg(true)}
//                 className="flex items-center gap-1.5 text-slate-400 hover:text-[#00b4d8] text-[12px] font-semibold transition-colors"
//               >
//                 <ImageIcon className="w-3.5 h-3.5" />
//                 {t("View Receipt", "عرض الإيصال")}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* receipt image popup */}
//       {showImg && (
//         <div
//           className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
//           onClick={() => setShowImg(false)}
//         >
//           <div
//             className="relative max-w-lg w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setShowImg(false)}
//               className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-600 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors z-10"
//             >
//               <X className="w-4 h-4" />
//             </button>
//             <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
//               <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
//                 <p className="text-slate-700 text-[13px] font-semibold">
//                   {t("Transfer Receipt", "إيصال التحويل")} — {req.user.fullName}
//                 </p>
//                 <span className="text-[#0a2540] font-bold">
//                   {req.amount} EGP
//                 </span>
//               </div>
//               <img
//                 src={req.receiptUrl}
//                 alt="receipt"
//                 className="w-full max-h-[70vh] object-contain p-4"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // ─── RejectModal ──────────────────────────────────────────────────────────────
// function RejectModal({
//   isRTL,
//   t,
//   req,
//   onClose,
//   onConfirm,
// }: {
//   isRTL: boolean;
//   t: (en: string, ar: string) => string;
//   req: RechargeRequest;
//   onClose: () => void;
//   onConfirm: (note: string) => Promise<void>;
// }) {
//   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(false);

//   return (
//     <Overlay isRTL={isRTL}>
//       <div
//         className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
//       >
//         <h3 className="text-[#0a2540] font-bold text-[18px]">
//           {t("Reject Request", "رفض الطلب")}
//         </h3>
//         <XBtn onClick={onClose} />
//       </div>
//       <div className="bg-[#f4f6f9] rounded-xl p-4 mb-6 text-[13px] text-slate-500">
//         {req.user.fullName} ·{" "}
//         <strong className="text-red-500">{req.amount} EGP</strong>
//       </div>
//       <div className="flex flex-col gap-1.5 mb-5">
//         <label className="text-slate-700 text-[13px] font-semibold">
//           {t("Rejection reason (optional)", "سبب الرفض (اختياري)")}
//         </label>
//         <textarea
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//           rows={3}
//           placeholder={t(
//             "e.g. Transfer not found, incorrect amount...",
//             "مثال: التحويل غير موجود، مبلغ غير صحيح...",
//           )}
//           className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all resize-none"
//         />
//       </div>
//       <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
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
//             await onConfirm(note);
//             setLoading(false);
//           }}
//           className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold rounded-xl py-3.5 text-[14px] transition-all"
//         >
//           {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//           {t("Reject Request", "رفض الطلب")}
//         </button>
//       </div>
//     </Overlay>
//   );
// }

// // inline clock icon
// // function Clock({ className }: { className?: string }) {
// //   return (
// //     <svg
// //       className={className}
// //       fill="none"
// //       viewBox="0 0 24 24"
// //       stroke="currentColor"
// //       strokeWidth={2}
// //     >
// //       <circle cx="12" cy="12" r="10" />
// //       <path d="M12 6v6l4 2" />
// //     </svg>
// //   );
// // }
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ImageIcon,
  X,
  Trash2,
} from "lucide-react";
import { Spin, Overlay, XBtn, ConfirmModal } from "./ui";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RechargeRequest {
  id: string;
  amount: number;
  senderName: string;
  receiptUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote: string | null;
  createdAt: string;
  user: { id: string; fullName: string; email: string };
}

type FilterStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

// ─── RechargeTab ──────────────────────────────────────────────────────────────
export function RechargeTab({
  t,
  isRTL,
  showToast,
}: {
  t: (en: string, ar: string) => string;
  isRTL: boolean;
  showToast: (type: "success" | "error", text: string) => void;
}) {
  const [requests, setRequests] = useState<RechargeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("PENDING");
  const [selected, setSelected] = useState<RechargeRequest | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RechargeRequest | null>(
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/recharge");
    const d = await r.json();
    if (d.success) setRequests(d.data);
    else showToast("error", d.error ?? t("Failed to load", "فشل التحميل"));
    setLoading(false);
  }, []); // eslint-disable-line

  useEffect(() => {
    load();
  }, [load]);

  const filtered = requests.filter((r) =>
    filter === "ALL" ? true : r.status === filter,
  );

  const counts = {
    ALL: requests.length,
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    APPROVED: requests.filter((r) => r.status === "APPROVED").length,
    REJECTED: requests.filter((r) => r.status === "REJECTED").length,
  };

  const filters: { key: FilterStatus; en: string; ar: string }[] = [
    { key: "PENDING", en: "Pending", ar: "قيد الانتظار" },
    { key: "APPROVED", en: "Approved", ar: "مقبولة" },
    { key: "REJECTED", en: "Rejected", ar: "مرفوضة" },
    { key: "ALL", en: "All", ar: "الكل" },
  ];

  async function handleAction(
    req: RechargeRequest,
    act: "approve" | "reject",
    note?: string,
  ) {
    const r = await fetch(`/api/admin/recharge/${req.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: act, adminNote: note }),
    });
    const d = await r.json();
    if (r.ok) {
      showToast(
        "success",
        act === "approve"
          ? t(
              `Added ${req.amount} EGP to ${req.user.fullName}`,
              `تمت إضافة ${req.amount} جنيه لـ ${req.user.fullName}`,
            )
          : t("Request rejected", "تم رفض الطلب"),
      );
      load();
    } else showToast("error", d.error ?? t("Failed", "فشلت العملية"));
  }

  async function handleDelete(req: RechargeRequest) {
    const r = await fetch(`/api/admin/recharge/${req.id}`, {
      method: "DELETE",
    });
    const d = await r.json();
    if (r.ok) {
      showToast("success", t("Request deleted", "تم حذف الطلب"));
      load();
    } else showToast("error", d.error ?? t("Failed", "فشلت العملية"));
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div
        className={`flex items-end justify-between ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <div className={isRTL ? "text-right" : ""}>
          <h2 className="text-[#0a2540] font-bold text-[22px]">
            {t("Recharge Requests", "طلبات الشحن")}
          </h2>
          <p className="text-slate-400 text-[13px] mt-1">
            {counts.PENDING} {t("pending review", "في انتظار المراجعة")}
          </p>
        </div>

        {/* filter pills */}
        <div
          className={`flex items-center gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                filter === f.key
                  ? f.key === "PENDING"
                    ? "bg-amber-500 text-white shadow-sm"
                    : f.key === "APPROVED"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : f.key === "REJECTED"
                        ? "bg-red-500 text-white shadow-sm"
                        : "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {t(f.en, f.ar)}
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${filter === f.key ? "bg-white/20" : "bg-slate-100 text-slate-400"}`}
              >
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* list */}
      {loading ? (
        <Spin />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-slate-500 font-semibold text-[15px]">
            {filter === "PENDING"
              ? t("No pending requests", "لا توجد طلبات معلّقة")
              : t("No requests found", "لا توجد طلبات")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <RequestCard
              key={req.id}
              req={req}
              isRTL={isRTL}
              t={t}
              onApprove={() => {
                setSelected(req);
                setAction("approve");
              }}
              onReject={() => {
                setSelected(req);
                setAction("reject");
              }}
              onDelete={() => setDeleteTarget(req)}
            />
          ))}
        </div>
      )}

      {/* approve confirm */}
      {selected && action === "approve" && (
        <ConfirmModal
          isRTL={isRTL}
          title={t("Approve Recharge", "قبول طلب الشحن")}
          message={t(
            `Add ${selected.amount} EGP to ${selected.user.fullName}'s balance?`,
            `إضافة ${selected.amount} جنيه لرصيد ${selected.user.fullName}؟`,
          )}
          confirmLabel={t("Approve & Add Balance", "قبول وإضافة الرصيد")}
          confirmColor="emerald"
          onClose={() => {
            setSelected(null);
            setAction(null);
          }}
          onConfirm={async () => {
            await handleAction(selected, "approve");
            setSelected(null);
            setAction(null);
          }}
        />
      )}

      {/* reject modal */}
      {selected && action === "reject" && (
        <RejectModal
          isRTL={isRTL}
          t={t}
          req={selected}
          onClose={() => {
            setSelected(null);
            setAction(null);
          }}
          onConfirm={async (note) => {
            await handleAction(selected, "reject", note);
            setSelected(null);
            setAction(null);
          }}
        />
      )}

      {/* delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          isRTL={isRTL}
          title={t("Delete Request", "حذف الطلب")}
          message={t(
            `Delete this request from ${deleteTarget.user.fullName}? This cannot be undone.`,
            `حذف طلب ${deleteTarget.user.fullName}؟ لا يمكن التراجع عن هذا الإجراء.`,
          )}
          confirmLabel={t("Delete", "حذف")}
          confirmColor="red"
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await handleDelete(deleteTarget);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}

// ─── RequestCard ──────────────────────────────────────────────────────────────
function RequestCard({
  req,
  isRTL,
  t,
  onApprove,
  onReject,
  onDelete,
}: {
  req: RechargeRequest;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const [showImg, setShowImg] = useState(false);

  const statusBadge = {
    PENDING: {
      label: t("Pending", "قيد الانتظار"),
      cls: "bg-amber-50 text-amber-600 border-amber-100",
    },
    APPROVED: {
      label: t("Approved", "مقبول"),
      cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    REJECTED: {
      label: t("Rejected", "مرفوض"),
      cls: "bg-red-50 text-red-500 border-red-100",
    },
  }[req.status];

  return (
    <>
      <div
        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${req.status === "PENDING" ? "border-amber-100 hover:border-amber-200" : "border-slate-100 hover:border-slate-200"}`}
      >
        {req.status === "PENDING" && (
          <div className="h-0.5 bg-gradient-to-r from-amber-400 to-orange-300" />
        )}

        <div className="p-6">
          <div
            className={`flex items-start gap-5 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {/* receipt thumbnail */}
            <button
              onClick={() => setShowImg(true)}
              className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50 hover:border-[#00b4d8] transition-colors group relative"
            >
              {req.receiptUrl ? (
                <img
                  src={req.receiptUrl}
                  alt="receipt"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-slate-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>

            {/* info */}
            <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
              <div
                className={`flex items-start justify-between gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div>
                  <p className="text-[#0a2540] font-bold text-[15px]">
                    {req.user.fullName}
                  </p>
                  <p className="text-slate-400 text-[12px] mt-0.5">
                    {req.user.email}
                  </p>
                  <p className="font-mono text-slate-300 text-[10px] mt-0.5 select-all">
                    {req.user.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className="text-[#0a2540] font-bold text-[20px]">
                    {req.amount}{" "}
                    <span className="text-[13px] font-normal text-slate-400">
                      EGP
                    </span>
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full font-bold border flex-shrink-0 ${statusBadge.cls}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              {/* meta */}
              <div
                className={`flex items-center gap-4 text-slate-400 text-[12px] flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(req.createdAt).toLocaleString(
                    isRTL ? "ar-EG" : "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
                <span>·</span>
                <span>
                  {t("Sender:", "المرسِل:")}{" "}
                  <strong className="text-slate-600">{req.senderName}</strong>
                </span>
                {req.adminNote && (
                  <>
                    <span>·</span>
                    <span className="text-slate-500 italic">
                      {req.adminNote}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* actions — PENDING */}
          {req.status === "PENDING" && (
            <div
              className={`flex items-center gap-3 mt-5 pt-5 border-t border-slate-100 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <button
                onClick={onApprove}
                className={`flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-[13px] transition-all shadow-sm shadow-emerald-500/20 hover:-translate-y-0.5 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {t("Approve & Add Balance", "قبول وإضافة الرصيد")}
              </button>
              <button
                onClick={onReject}
                className={`flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-bold px-5 py-2.5 rounded-xl text-[13px] transition-all border border-red-100 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <XCircle className="w-4 h-4" />
                {t("Reject", "رفض")}
              </button>

              {/* spacer */}
              <div className="flex items-center gap-3 ms-auto">
                <button
                  onClick={() => setShowImg(true)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-[#00b4d8] text-[12px] font-semibold transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  {t("View Receipt", "عرض الإيصال")}
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-red-400 text-[12px] font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t("Delete", "حذف")}
                </button>
              </div>
            </div>
          )}

          {/* actions — non-pending */}
          {req.status !== "PENDING" && (
            <div
              className={`flex items-center gap-3 mt-4 ${isRTL ? "justify-start flex-row-reverse" : "justify-end"}`}
            >
              <button
                onClick={() => setShowImg(true)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-[#00b4d8] text-[12px] font-semibold transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                {t("View Receipt", "عرض الإيصال")}
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 text-slate-300 hover:text-red-400 text-[12px] font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t("Delete", "حذف")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* receipt image popup */}
      {showImg && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowImg(false)}
        >
          <div
            className="relative max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImg(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-600 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                <p className="text-slate-700 text-[13px] font-semibold">
                  {t("Transfer Receipt", "إيصال التحويل")} — {req.user.fullName}
                </p>
                <span className="text-[#0a2540] font-bold">
                  {req.amount} EGP
                </span>
              </div>
              <img
                src={req.receiptUrl}
                alt="receipt"
                className="w-full max-h-[70vh] object-contain p-4"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── RejectModal ──────────────────────────────────────────────────────────────
function RejectModal({
  isRTL,
  t,
  req,
  onClose,
  onConfirm,
}: {
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  req: RechargeRequest;
  onClose: () => void;
  onConfirm: (note: string) => Promise<void>;
}) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Overlay isRTL={isRTL}>
      <div
        className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <h3 className="text-[#0a2540] font-bold text-[18px]">
          {t("Reject Request", "رفض الطلب")}
        </h3>
        <XBtn onClick={onClose} />
      </div>
      <div className="bg-[#f4f6f9] rounded-xl p-4 mb-6 text-[13px] text-slate-500">
        {req.user.fullName} ·{" "}
        <strong className="text-red-500">{req.amount} EGP</strong>
      </div>
      <div className="flex flex-col gap-1.5 mb-5">
        <label className="text-slate-700 text-[13px] font-semibold">
          {t("Rejection reason (optional)", "سبب الرفض (اختياري)")}
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={t(
            "e.g. Transfer not found, incorrect amount...",
            "مثال: التحويل غير موجود، مبلغ غير صحيح...",
          )}
          className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all resize-none"
        />
      </div>
      <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <button
          onClick={onClose}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl py-3.5 text-[14px] transition-all"
        >
          {t("Cancel", "إلغاء")}
        </button>
        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await onConfirm(note);
            setLoading(false);
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold rounded-xl py-3.5 text-[14px] transition-all"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {t("Reject Request", "رفض الطلب")}
        </button>
      </div>
    </Overlay>
  );
}
