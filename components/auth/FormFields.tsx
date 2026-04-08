"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  autoComplete,
}: FieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-slate-700 text-[13px] font-medium">
        {label}
        {required && <span className="text-[#00b4d8] ms-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all"
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 end-3 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
          >
            {show ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function SubmitButton({
  label,
  pendingLabel,
  pending = false,
}: {
  label: string;
  pendingLabel?: string;
  pending?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#0d3060] disabled:opacity-60 text-white font-semibold rounded-xl px-4 py-3.5 text-[15px] shadow-lg shadow-[#0a2540]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {pendingLabel ?? label}
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function Alert({
  type,
  message,
}: {
  type: "error" | "success";
  message: string;
}) {
  const isError = type === "error";
  return (
    <div
      className={`flex items-start gap-3 rounded-xl px-4 py-3 text-[13px] ${
        isError
          ? "bg-red-50 border border-red-100 text-red-600"
          : "bg-emerald-50 border border-emerald-100 text-emerald-600"
      }`}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
      )}
      <span>{message}</span>
    </div>
  );
}
