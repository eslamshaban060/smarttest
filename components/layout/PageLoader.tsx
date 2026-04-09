"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// ── Hook ──────────────────────────────────────────────────────────────────────
export function usePageLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  return loading;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function PageLoader() {
  const loading = usePageLoading();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setVisible(true);
    } else {
      // fade out then hide
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes pl-spin { to { transform: rotate(360deg); } }
        @keyframes pl-in   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pl-out  { from { opacity: 1; } to { opacity: 0; } }
        .pl-wrap {
          position: fixed; inset: 0; z-index: 9999;
          background: #06101f;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 24px;
        }
        .pl-wrap.entering { animation: pl-in  0.15s ease forwards; }
        .pl-wrap.leaving  { animation: pl-out 0.3s  ease forwards; }
        .pl-spinner {
          width: 44px; height: 44px;
          border: 3px solid rgba(0, 180, 216, 0.15);
          border-top-color: #00b4d8;
          border-radius: 50%;
          animation: pl-spin 0.85s linear infinite;
        }
        .pl-dots {
          display: flex; gap: 6px;
        }
        .pl-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(0,180,216,0.4);
          animation: pl-dot-pulse 1.2s ease-in-out infinite;
        }
        .pl-dot:nth-child(2) { animation-delay: 0.2s; }
        .pl-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pl-dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>

      <div className={`pl-wrap ${loading ? "entering" : "leaving"}`}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#00b4d8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 24px rgba(0,180,216,0.3)",
            }}
          >
      
          </div> */}
          <span
            style={{
              color: "white",
              fontWeight: 600,
              fontSize: 17,
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "-0.3px",
            }}
          >
            EN-AVM Academy
          </span>
        </div>

        {/* Spinner */}
        <div className="pl-spinner" />

        {/* Dots */}
        <div className="pl-dots">
          <div className="pl-dot" />
          <div className="pl-dot" />
          <div className="pl-dot" />
        </div>

        {/* Text */}
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: 13,
            fontFamily: "system-ui, sans-serif",
            marginTop: -8,
          }}
        >
          loading...
        </p>
      </div>
    </>
  );
}
