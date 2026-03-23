"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import type { ToastMsg } from "./types";

// ── Toast ─────────────────────────────────────────────────────────────────────
export function Toast({
  msg,
  onClose,
}: {
  msg: ToastMsg;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(onClose, 4500);
    return () => clearTimeout(id);
  }, [msg, onClose]);

  if (!msg) return null;

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3
        px-5 py-3.5 rounded-2xl shadow-2xl border text-[14px] font-medium
        min-w-[280px] max-w-sm animate-in slide-in-from-top-2 duration-300
        ${
          msg.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}
    >
      {msg.type === "success" ? (
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
      )}
      <span className="flex-1">{msg.text}</span>
      <button
        onClick={onClose}
        className="opacity-40 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spin() {
  return (
    <div className="flex justify-center py-24">
      <Loader2 className="w-7 h-7 text-[#00b4d8] animate-spin" />
    </div>
  );
}

// ── Modal overlay ─────────────────────────────────────────────────────────────
export function Overlay({
  children,
  isRTL,
  maxW = "max-w-md",
}: {
  children: React.ReactNode;
  isRTL: boolean;
  maxW?: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`bg-white rounded-3xl shadow-2xl w-full ${maxW} overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200`}
      >
        <div className="h-1 bg-gradient-to-r from-[#00b4d8] via-[#00b4d8]/50 to-transparent" />
        <div className="p-7">{children}</div>
      </div>
    </div>
  );
}

// ── Close button ──────────────────────────────────────────────────────────────
export function XBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-300 hover:text-slate-500 flex items-center justify-center transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  );
}

// ── Action button (icon only) ─────────────────────────────────────────────────
const colorMap: Record<string, string> = {
  emerald: "hover:bg-emerald-50 hover:text-emerald-500",
  amber: "hover:bg-amber-50   hover:text-amber-500",
  red: "hover:bg-red-50     hover:text-red-500",
  purple: "hover:bg-purple-50  hover:text-purple-500",
  blue: "hover:bg-blue-50    hover:text-blue-500",
  green: "hover:bg-emerald-50 hover:text-emerald-500",
  cyan: "hover:bg-cyan-50    hover:text-cyan-500",
};

export function ABtn({
  Icon,
  color,
  title,
  onClick,
}: {
  Icon: React.ElementType;
  color: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-8 h-8 rounded-lg bg-[#f4f6f9] text-slate-400 flex items-center justify-center transition-colors ${colorMap[color] ?? ""}`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────
export function ConfirmModal({
  isRTL,
  title,
  message,
  confirmLabel,
  confirmColor,
  onClose,
  onConfirm,
}: {
  isRTL: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: "red" | "purple" | "emerald";
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const colors = {
    red: "bg-red-500     hover:bg-red-600",
    purple: "bg-purple-500  hover:bg-purple-600",
    emerald: "bg-emerald-500 hover:bg-emerald-600",
  };

  return (
    <Overlay isRTL={isRTL}>
      <div
        className={`flex items-center justify-between mb-5 ${isRTL ? "" : ""}`}
      >
        <h3 className="text-[#0a2540] font-bold text-[18px]">{title}</h3>
        <XBtn onClick={onClose} />
      </div>
      <p className="text-slate-500 text-[14px] leading-relaxed mb-8">
        {message}
      </p>
      <div className={`flex gap-3 ${isRTL ? "" : ""}`}>
        <button
          onClick={onClose}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl py-3.5 text-[14px] transition-all"
        >
          {isRTL ? "إلغاء" : "Cancel"}
        </button>
        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await onConfirm();
            setLoading(false);
          }}
          className={`flex-1 flex items-center justify-center gap-2 ${colors[confirmColor]} disabled:opacity-60 text-white font-bold rounded-xl py-3.5 text-[14px] transition-all`}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Overlay>
  );
}
