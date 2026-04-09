import { useRef } from "react";
import { GraduationCap, Sparkles } from "lucide-react";

// ── Watermark SVG (tiled diagonal text) ─────────────────────────────────────
function Watermark() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="wm-pattern"
          x="0"
          y="0"
          width="220"
          height="120"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-35)"
        >
          <text
            x="10"
            y="40"
            fontFamily="Georgia, serif"
            fontSize="13"
            fontWeight="500"
            letterSpacing="3"
            fill="rgba(233,196,106,0.07)"
            transform="rotate(-10, 10, 40)"
          >
            EN-AVM ACADEMY
          </text>
          <text
            x="20"
            y="80"
            fontFamily="Georgia, serif"
            fontSize="11"
            fontWeight="400"
            letterSpacing="2"
            fill="rgba(233,196,106,0.05)"
            transform="rotate(-10, 20, 80)"
          >
            CERTIFICATE OF COMPLETION
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wm-pattern)" />
    </svg>
  );
}

// ── Dr. Ebtessam Nada handwritten SVG signature ──────────────────────────────
function SignatureEbtessamNada() {
  return (
    <svg
      viewBox="0 0 220 70"
      width="180"
      height="56"
      aria-label="Signature of Dr. Ebtessam Nada"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <path
        d="
          M 10 52
          C 14 38, 22 28, 30 32
          C 36 35, 34 44, 38 42
          C 43 39, 45 30, 52 28
          C 58 26, 60 34, 64 38
          C 68 42, 70 44, 76 40
          C 82 36, 84 26, 90 24
          C 96 22, 100 32, 106 36
          C 110 39, 112 36, 116 30
        "
        fill="none"
        stroke="rgba(233,196,106,0.85)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="
          M 118 30
          C 124 20, 132 16, 138 22
          C 144 28, 142 38, 148 40
          C 154 42, 158 34, 164 30
          C 170 26, 174 30, 180 34
          C 184 37, 188 36, 192 30
          C 196 24, 198 20, 204 22
          C 208 24, 210 30, 212 34
        "
        fill="none"
        stroke="rgba(233,196,106,0.85)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 8 58 Q 60 64 110 60 Q 160 56 212 60"
        fill="none"
        stroke="rgba(233,196,106,0.5)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <circle cx="216" cy="38" r="2" fill="rgba(233,196,106,0.7)" />
    </svg>
  );
}

// ── Corner ornament ──────────────────────────────────────────────────────────
function Corner() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <path
        d="M4 36 L4 8 Q4 4 8 4 L36 4"
        fill="none"
        stroke="rgba(233,196,106,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 36 L10 14 Q10 10 14 10 L36 10"
        fill="none"
        stroke="rgba(233,196,106,0.25)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="2.5" fill="rgba(233,196,106,0.5)" />
    </svg>
  );
}

// ── Certificate inner content (shared between display & clone) ───────────────
function CertificateContent({
  courseTitle,
  dateStr,
}: {
  courseTitle: string;
  dateStr: string;
}) {
  return (
    <>
      {/* Watermark */}
      <Watermark />

      {/* Outer gold border */}
      <div
        className="absolute"
        style={{
          inset: "10px",
          border: "1.5px solid rgba(233,196,106,0.55)",
          pointerEvents: "none",
        }}
      />
      {/* Inner subtle border */}
      <div
        className="absolute"
        style={{
          inset: "16px",
          border: "0.5px solid rgba(233,196,106,0.2)",
          pointerEvents: "none",
        }}
      />

      {/* Corners */}
      <div className="absolute top-2 left-2">
        <Corner />
      </div>
      <div
        className="absolute top-2 right-2"
        style={{ transform: "scaleX(-1)" }}
      >
        <Corner />
      </div>
      <div
        className="absolute bottom-2 left-2"
        style={{ transform: "scaleY(-1)" }}
      >
        <Corner />
      </div>
      <div
        className="absolute bottom-2 right-2"
        style={{ transform: "scale(-1,-1)" }}
      >
        <Corner />
      </div>

      {/* Subtle radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(233,196,106,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center"
        style={{ padding: "3% 8%" }}
      >
        {/* Academy top bar */}
        <div className="flex items-center gap-3 w-full mb-4">
          <div
            className="flex-1"
            style={{
              height: "0.5px",
              background:
                "linear-gradient(to right, transparent, rgba(233,196,106,0.4))",
            }}
          />
          <div className="flex items-center gap-2 px-4">
            <Sparkles
              style={{
                width: "14px",
                height: "14px",
                color: "rgba(233,196,106,0.8)",
              }}
            />
            <span
              style={{
                color: "rgba(233,196,106,0.75)",
                fontSize: "10px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                fontFamily: "Georgia, serif",
                fontWeight: 600,
              }}
            >
              EN-AVM Academy
            </span>
            <Sparkles
              style={{
                width: "14px",
                height: "14px",
                color: "rgba(233,196,106,0.8)",
              }}
            />
          </div>
          <div
            className="flex-1"
            style={{
              height: "0.5px",
              background:
                "linear-gradient(to left, transparent, rgba(233,196,106,0.4))",
            }}
          />
        </div>

        {/* Certificate of Completion */}
        <p
          style={{
            color: "rgba(233,196,106,0.55)",
            fontSize: "10px",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            marginBottom: "6px",
            fontFamily: "Georgia, serif",
          }}
        >
          Certificate of Completion
        </p>

        {/* Large title */}
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "44px",
            fontWeight: 600,
            color: "#ffffff",
            lineHeight: 1.15,
            marginBottom: "6px",
            letterSpacing: "0.04em",
          }}
        >
          This is to certify that
        </h1>

        {/* Divider */}
        <div
          className="flex items-center gap-3 my-3"
          style={{ width: "200px" }}
        >
          <div
            style={{
              flex: 1,
              height: "0.5px",
              background: "rgba(233,196,106,0.4)",
            }}
          />
          <div
            style={{
              width: "6px",
              height: "6px",
              background: "#e9c46a",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              flex: 1,
              height: "0.5px",
              background: "rgba(233,196,106,0.4)",
            }}
          />
        </div>

        {/* "has successfully completed" text */}
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "12px",
            marginBottom: "10px",
            letterSpacing: "0.04em",
          }}
        >
          has successfully completed all requirements of
        </p>

        {/* Course title box */}
        <div
          style={{
            background: "rgba(233,196,106,0.07)",
            border: "0.5px solid rgba(233,196,106,0.3)",
            borderRadius: "8px",
            padding: "10px 32px",
            marginBottom: "8px",
          }}
        >
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "22px",
              fontWeight: 600,
              color: "#e9c46a",
              letterSpacing: "0.02em",
            }}
          >
            {courseTitle}
          </h2>
        </div>

        <p
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "11px",
            marginBottom: "18px",
            letterSpacing: "0.03em",
            maxWidth: "480px",
          }}
        >
          Having demonstrated full commitment and mastered all course content
          and assessments
        </p>

        {/* Bottom row: seal | date | signature */}
        <div
          className="flex items-end justify-between w-full"
          style={{ maxWidth: "500px" }}
        >
          {/* Official seal */}
          <div className="flex flex-col items-center gap-1">
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                border: "1.5px solid rgba(233,196,106,0.5)",
                background: "rgba(233,196,106,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GraduationCap
                style={{
                  width: "22px",
                  height: "22px",
                  color: "rgba(233,196,106,0.8)",
                }}
              />
            </div>
            <p
              style={{
                color: "rgba(233,196,106,0.4)",
                fontSize: "8px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: "4px",
                fontFamily: "Georgia, serif",
              }}
            >
              Official Seal
            </p>
          </div>

          {/* Issue date */}
          <div className="flex flex-col items-center gap-1">
            <div
              style={{
                width: "90px",
                height: "0.5px",
                background: "rgba(233,196,106,0.35)",
                marginBottom: "5px",
              }}
            />
            <p
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: "9px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "Georgia, serif",
              }}
            >
              Issued on
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "Georgia, serif",
                letterSpacing: "0.03em",
              }}
            >
              {dateStr}
            </p>
          </div>

          {/* Signature block */}
          <div className="flex flex-col items-center gap-0">
            <SignatureEbtessamNada />
            <div
              style={{
                width: "180px",
                height: "0.5px",
                background: "rgba(233,196,106,0.4)",
                marginTop: "2px",
              }}
            />
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "Georgia, serif",
                marginTop: "4px",
                letterSpacing: "0.04em",
              }}
            >
              Dr. Ebtessam Nada
            </p>
            <p
              style={{
                color: "rgba(233,196,106,0.45)",
                fontSize: "9px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "Georgia, serif",
                marginTop: "2px",
              }}
            >
              Course Director
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main CertificateModal ────────────────────────────────────────────────────
export function CertificateModal({
  courseTitle,
  onClose,
}: {
  courseTitle: string;
  isRTL?: boolean;
  t?: (en: string, ar: string) => string;
  onClose: () => void;
}) {
  const certRef = useRef<HTMLDivElement>(null);

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── Download as image-based PDF ──────────────────────────────────────────
  async function downloadAsPDF() {
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // ✅ نعمل clone مخفي بـ fixed dimensions (A4 landscape px at 96dpi)
      const CERT_W = 1122;
      const CERT_H = 794;

      const clone = document.createElement("div");
      clone.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: ${CERT_W}px;
        height: ${CERT_H}px;
        overflow: hidden;
        background: linear-gradient(135deg,#081d35 0%,#0d3a6e 45%,#0b2f5a 75%,#081d35 100%);
        z-index: -1;
      `;

      // ✅ نعمل clone من الـ certRef element الأصلي
      const original = certRef.current;
      if (!original) return;
      const innerClone = original.cloneNode(true) as HTMLElement;
      innerClone.style.cssText = `
        position: relative;
        width: ${CERT_W}px;
        height: ${CERT_H}px;
        aspect-ratio: unset;
        overflow: hidden;
        background: linear-gradient(135deg,#081d35 0%,#0d3a6e 45%,#0b2f5a 75%,#081d35 100%);
      `;
      clone.appendChild(innerClone);
      document.body.appendChild(clone);

      // ✅ نستنى شوية عشان الـ render يكتمل
      await new Promise((resolve) => setTimeout(resolve, 400));

      const canvas = await html2canvas(innerClone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#081d35",
        logging: false,
        width: CERT_W,
        height: CERT_H,
        windowWidth: CERT_W,
        windowHeight: CERT_H,
      });

      // ✅ نشيل الـ clone بعد الـ capture
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");

      // ✅ نعمل PDF A4 landscape
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
      pdf.save(`Certificate - ${courseTitle}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      // Fallback: فتح print dialog
      fallbackPrint();
    }
  }

  function fallbackPrint() {
    const el = certRef.current;
    if (!el) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Certificate – ${courseTitle}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #081d35; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${el.outerHTML}</body>
      </html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 800);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        {/* ── CERTIFICATE BODY (للعرض فقط) ─────────────────────────── */}
        <div
          ref={certRef}
          id="cert-print"
          dir="ltr"
          className="relative overflow-hidden shadow-2xl"
          style={{
            aspectRatio: "1.414",
            background:
              "linear-gradient(135deg,#081d35 0%,#0d3a6e 45%,#0b2f5a 75%,#081d35 100%)",
          }}
        >
          <CertificateContent courseTitle={courseTitle} dateStr={dateStr} />
        </div>

        {/* ── ACTION BUTTONS ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 font-bold py-3 rounded-2xl text-[14px] transition-all"
            style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.18)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.1)")
            }
          >
            Close
          </button>
          <button
            onClick={downloadAsPDF}
            className="flex-1 font-bold py-3 rounded-2xl text-[14px] transition-all flex items-center justify-center gap-2"
            style={{ background: "#e9c46a", color: "#0a2540" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#f0d080")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "#e9c46a")
            }
          >
            <GraduationCap style={{ width: "16px", height: "16px" }} />
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}

export default CertificateModal;
