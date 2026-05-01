// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useLanguage } from "@/app/hooks/useLanguage";
// import {
//   MessageCircle,
//   X,
//   Send,
//   Loader2,
//   Bot,
//   User,
//   BookOpen,
//   Wallet,
//   GraduationCap,
//   HelpCircle,
// } from "lucide-react";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// const QUICK_REPLIES = [
//   { icon: BookOpen, en: "Available Courses", ar: "الكورسات المتاحة" },
//   { icon: Wallet, en: "How to recharge?", ar: "كيف أشحن الرصيد؟" },
//   {
//     icon: GraduationCap,
//     en: "How to get certificate?",
//     ar: "كيف أحصل على شهادة؟",
//   },
//   { icon: HelpCircle, en: "How to enroll?", ar: "كيف أسجّل في كورس؟" },
// ];

// export function Chatbot() {
//   const { t, isRTL } = useLanguage();
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: "assistant",
//       content:
//         "أهلاً وسهلاً! 😊 أنا مساعد EN-AVM Academy. كيف أقدر أساعدك اليوم؟",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [unread, setUnread] = useState(0);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (open) {
//       setUnread(0);
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   }, [open]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   async function send(text?: string) {
//     const msg = (text ?? input).trim();
//     if (!msg || loading) return;
//     setInput("");

//     const userMsg: Message = { role: "user", content: msg };
//     const updated = [...messages, userMsg];
//     setMessages(updated);
//     setLoading(true);

//     try {
//       const r = await fetch("/api/chatbot", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ messages: updated }),
//       });
//       const d = await r.json();
//       const reply = d.reply ?? "عذراً، حدث خطأ.";
//       setMessages((p) => [...p, { role: "assistant", content: reply }]);
//       if (!open) setUnread((n) => n + 1);
//     } catch {
//       setMessages((p) => [
//         ...p,
//         {
//           role: "assistant",
//           content: "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.",
//         },
//       ]);
//     }
//     setLoading(false);
//   }

//   return (
//     <div className={`fixed bottom-6 z-50 ${isRTL ? "left-6" : "right-6"}`}>
//       {/* Chat window */}
//       {open && (
//         <div
//           dir={isRTL ? "rtl" : "ltr"}
//           className="absolute bottom-16 w-[360px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300"
//           style={{
//             maxHeight: "520px",
//             bottom: "calc(100% + 12px)",
//             right: isRTL ? "auto" : 0,
//             left: isRTL ? 0 : "auto",
//           }}
//         >
//           {/* header */}
//           <div className="bg-[#0a2540] px-5 py-4 flex items-center justify-between flex-shrink-0">
//             <div
//               className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
//             >
//               <div className="w-9 h-9 rounded-xl bg-[#00b4d8]/25 border border-[#00b4d8]/40 flex items-center justify-center">
//                 <Bot className="w-4 h-4 text-[#00b4d8]" />
//               </div>
//               <div className={isRTL ? "text-right" : ""}>
//                 <p className="text-white font-bold text-[14px] leading-tight">
//                   {t("Academy Assistant", "مساعد الأكاديمية")}
//                 </p>
//                 <div
//                   className={`flex items-center gap-1 mt-0.5 ${isRTL ? "flex-row-reverse" : ""}`}
//                 >
//                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//                   <span className="text-white/40 text-[11px]">
//                     {t("Online", "متصل")}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={() => setOpen(false)}
//               className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-all"
//             >
//               <X className="w-3.5 h-3.5" />
//             </button>
//           </div>

//           {/* messages */}
//           <div
//             className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fc]"
//             style={{
//               scrollbarWidth: "thin",
//               scrollbarColor: "#e2e8f0 transparent",
//             }}
//           >
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`flex gap-2.5 ${msg.role === "user" ? (isRTL ? "flex-row-reverse" : "flex-row-reverse") : ""}`}
//               >
//                 {/* avatar */}
//                 <div
//                   className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
//                     msg.role === "assistant" ? "bg-[#0a2540]" : "bg-[#00b4d8]"
//                   }`}
//                 >
//                   {msg.role === "assistant" ? (
//                     <Bot className="w-3.5 h-3.5 text-[#00b4d8]" />
//                   ) : (
//                     <User className="w-3.5 h-3.5 text-white" />
//                   )}
//                 </div>
//                 {/* bubble */}
//                 <div
//                   className={`max-w-[78%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
//                     msg.role === "assistant"
//                       ? `bg-white text-slate-700 shadow-sm border border-slate-100 ${isRTL ? "rounded-tr-sm" : "rounded-tl-sm"}`
//                       : `bg-[#0a2540] text-white ${isRTL ? "rounded-tl-sm" : "rounded-tr-sm"}`
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               </div>
//             ))}

//             {/* typing indicator */}
//             {loading && (
//               <div
//                 className={`flex gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}
//               >
//                 <div className="w-7 h-7 rounded-full bg-[#0a2540] flex items-center justify-center flex-shrink-0">
//                   <Bot className="w-3.5 h-3.5 text-[#00b4d8]" />
//                 </div>
//                 <div className="bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm">
//                   <div className="flex items-center gap-1">
//                     <div
//                       className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
//                       style={{ animationDelay: "0ms" }}
//                     />
//                     <div
//                       className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
//                       style={{ animationDelay: "150ms" }}
//                     />
//                     <div
//                       className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
//                       style={{ animationDelay: "300ms" }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={bottomRef} />
//           </div>

//           {/* quick replies — only show when few messages */}
//           {messages.length <= 2 && (
//             <div
//               className={`px-4 py-2 bg-[#f8f9fc] border-t border-slate-100 flex gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
//             >
//               {QUICK_REPLIES.map((qr, i) => (
//                 <button
//                   key={i}
//                   onClick={() => send(t(qr.en, qr.ar))}
//                   className={`flex items-center gap-1.5 bg-white border border-slate-200 hover:border-[#00b4d8] hover:text-[#00b4d8] text-slate-600 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all ${isRTL ? "flex-row-reverse" : ""}`}
//                 >
//                   <qr.icon className="w-3 h-3" />
//                   {t(qr.en, qr.ar)}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* input */}
//           <div
//             className={`p-3 bg-white border-t border-slate-100 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
//           >
//             <input
//               ref={inputRef}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
//               placeholder={t("Type your message...", "اكتب رسالتك...")}
//               className={`flex-1 bg-[#f8f9fc] border border-slate-200 rounded-2xl px-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all ${isRTL ? "text-right" : ""}`}
//               dir={isRTL ? "rtl" : "ltr"}
//             />
//             <button
//               onClick={() => send()}
//               disabled={!input.trim() || loading}
//               className="w-10 h-10 rounded-2xl bg-[#0a2540] hover:bg-[#0d3060] disabled:opacity-40 text-white flex items-center justify-center transition-all flex-shrink-0"
//             >
//               {loading ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
//               )}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* FAB button */}
//       <button
//         onClick={() => setOpen((p) => !p)}
//         className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative ${
//           open
//             ? "bg-slate-600 hover:bg-slate-700"
//             : "bg-[#0a2540] hover:bg-[#0d3060]"
//         }`}
//       >
//         {open ? (
//           <X className="w-5 h-5 text-white" />
//         ) : (
//           <MessageCircle className="w-6 h-6 text-white" />
//         )}
//         {/* unread badge */}
//         {!open && unread > 0 && (
//           <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
//             {unread}
//           </span>
//         )}
//         {/* pulse ring when closed */}
//         {!open && (
//           <span className="absolute inset-0 rounded-full bg-[#00b4d8]/20 animate-ping" />
//         )}
//       </button>
//     </div>
//   );
// }
"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import {
  MessageCircle, X, Send, Loader2, Bot, User,
  BookOpen, Wallet, GraduationCap, HelpCircle, RefreshCw,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  time?: string;
}

const QUICK = [
  { icon: BookOpen,       en: "What courses are available?", ar: "ما هي الكورسات المتاحة؟"   },
  { icon: Wallet,         en: "How to recharge balance?",    ar: "كيف أشحن الرصيد؟"           },
  { icon: GraduationCap, en: "How to get certificate?",     ar: "كيف أحصل على الشهادة؟"      },
  { icon: HelpCircle,    en: "How to enroll in a course?",  ar: "كيف أسجّل في كورس؟"         },
];

const WELCOME = "أهلاً وسهلاً! 😊 أنا مساعد EN-AVM Academy.\n\nيمكنني مساعدتك في:\n• معرفة الكورسات المتاحة وأسعارها\n• شرح كيفية التسجيل وشراء الكورسات\n• الإجابة عن أي سؤال عن المنصة\n\nكيف أقدر أساعدك اليوم؟";

function now() {
  return new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

export function Chatbot() {
  const { t, isRTL } = useLanguage();
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME, time: now() },
  ]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [unread,   setUnread]   = useState(0);
  const [error,    setError]    = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setError(false);

    const userMsg: Message = { role: "user", content: msg, time: now() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const r = await fetch("/api/chatbot", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: updated }),
      });

      if (!r.ok) throw new Error("HTTP " + r.status);

      const d = await r.json();
      const reply = d.reply ?? "عذراً، لم أتمكن من الرد.";

      setMessages(p => [...p, { role: "assistant", content: reply, time: now() }]);
      if (!open) setUnread(n => n + 1);
    } catch {
      setError(true);
      setMessages(p => [...p, {
        role: "assistant",
        content: "عذراً، حدث خطأ في الاتصال. 😓\nاضغط زر الإعادة للمحاولة مرة أخرى.",
        time: now(),
      }]);
    }
    setLoading(false);
  }

  async function retry() {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (!lastUser) return;
    // remove last error assistant message
    setMessages(p => p.slice(0, -1));
    await send(lastUser.content);
  }

  function reset() {
    setMessages([{ role: "assistant", content: WELCOME, time: now() }]);
    setError(false);
    setInput("");
  }

  const isAr = isRTL;

  return (
    <div className={`fixed bottom-6 z-[100] ${isAr ? "left-6" : "right-6"}`}>

      {/* ── Chat window ────────────────────────────────────────────────── */}
      {open && (
        <div
          dir={isAr ? "rtl" : "ltr"}
          className="flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
          style={{
            width: 360,
            maxHeight: 540,
            position: "absolute",
            bottom: "calc(100% + 12px)",
            [isAr ? "left" : "right"]: 0,
          }}
        >
          {/* header */}
          <div className="bg-[#0a2540] px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className={`flex items-center gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-[#00b4d8]/20 border border-[#00b4d8]/40 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#00b4d8]" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a2540]" />
              </div>
              <div className={isAr ? "text-right" : ""}>
                <p className="text-white font-bold text-[14px] leading-tight">
                  {t("Academy Assistant", "مساعد الأكاديمية")}
                </p>
                <p className="text-[#00b4d8]/60 text-[11px]">{t("Online · Always here", "متصل · دائماً هنا")}</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
              <button onClick={reset} title={t("Reset chat", "إعادة المحادثة")}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white flex items-center justify-center transition-all">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white flex items-center justify-center transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fc]"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 shadow-sm ${
                  msg.role === "assistant" ? "bg-[#0a2540]" : "bg-[#00b4d8]"
                }`}>
                  {msg.role === "assistant"
                    ? <Bot  className="w-4 h-4 text-[#00b4d8]" />
                    : <User className="w-4 h-4 text-white" />}
                </div>

                <div className={`flex flex-col gap-1 max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {/* bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap shadow-sm ${
                    msg.role === "assistant"
                      ? `bg-white text-slate-700 border border-slate-100 ${isAr ? "rounded-tr-sm" : "rounded-tl-sm"}`
                      : `bg-[#0a2540] text-white ${isAr ? "rounded-tl-sm" : "rounded-tr-sm"}`
                  }`}>
                    {msg.content}
                  </div>
                  {msg.time && (
                    <span className="text-slate-300 text-[10px] px-1">{msg.time}</span>
                  )}
                </div>
              </div>
            ))}

            {/* retry button on error */}
            {error && (
              <div className="flex justify-center">
                <button onClick={retry}
                  className={`flex items-center gap-1.5 text-[#00b4d8] text-[12px] font-semibold hover:underline ${isAr ? "flex-row-reverse" : ""}`}>
                  <RefreshCw className="w-3 h-3" />
                  {t("Retry", "إعادة المحاولة")}
                </button>
              </div>
            )}

            {/* typing indicator */}
            {loading && (
              <div className={`flex gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-[#0a2540] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-[#00b4d8]" />
                </div>
                <div className={`bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl ${isAr ? "rounded-tr-sm" : "rounded-tl-sm"}`}>
                  <div className="flex items-center gap-1.5">
                    {[0, 150, 300].map((d, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-bounce"
                        style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* quick replies */}
          {messages.length <= 2 && !loading && (
            <div className={`px-4 py-2.5 bg-[#f8f9fc] border-t border-slate-100 flex gap-1.5 flex-wrap ${isAr ? "flex-row-reverse" : ""}`}>
              {QUICK.map((q, i) => (
                <button key={i} onClick={() => send(isAr ? q.ar : q.en)}
                  className={`flex items-center gap-1 bg-white border border-slate-200 hover:border-[#00b4d8] hover:text-[#00b4d8] text-slate-600 text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-all shadow-sm ${isAr ? "flex-row-reverse" : ""}`}>
                  <q.icon className="w-3 h-3 flex-shrink-0" />
                  {isAr ? q.ar : q.en}
                </button>
              ))}
            </div>
          )}

          {/* input */}
          <div className={`p-3 bg-white border-t border-slate-100 flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={t("Type your message...", "اكتب رسالتك هنا...")}
              disabled={loading}
              dir={isAr ? "rtl" : "ltr"}
              className={`flex-1 bg-[#f8f9fc] border border-slate-200 rounded-2xl px-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all disabled:opacity-60 ${isAr ? "text-right" : ""}`}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-2xl bg-[#0a2540] hover:bg-[#0d3060] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all flex-shrink-0 shadow-sm">
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              }
            </button>
          </div>
        </div>
      )}

      {/* ── FAB ──────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(p => !p)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative ${
          open ? "bg-slate-600 hover:bg-slate-700" : "bg-[#0a2540] hover:bg-[#0d3060]"
        }`}
      >
        <div className={`transition-all duration-200 ${open ? "rotate-90 scale-90" : "rotate-0 scale-100"}`}>
          {open ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        </div>

        {/* unread badge */}
        {!open && unread > 0 && (
          <span className={`absolute -top-1 ${isAr ? "-left-1" : "-right-1"} w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm`}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}

        {/* pulse when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#00b4d8]/15 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
}