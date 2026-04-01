"use client";

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  type CSSProperties,
  type ReactNode,
  type ChangeEvent,
} from "react";

// ═══════════════════════════════════════════════════════════
// SMILESKETCHVEGAS — PRIVATE INFRASTRUCTURE WALKTHROUGH
// Final Clean Build — Next.js App Router Safe
// ═══════════════════════════════════════════════════════════

const ACCESS_CODE = "SMILESKETCH2026";
const FORM_ENDPOINT = "http://localhost:5000/api/build-submission";

const C = {
  bg: "#070707",
  d: "#0B0B0A",
  ink: "#101010",
  ash: "#181816",
  fl: "#212120",
  st: "#2C2B28",
  w: "#3E3C37",
  m: "#6A665F",
  q: "#878279",
  sa: "#ADA69B",
  pa: "#CFC7B9",
  iv: "#E9E3D8",
  cr: "#F5F1E9",
  g: "#A08B5C",
  gd: "rgba(160,139,92,.09)",
  gl: "rgba(160,139,92,.10)",
  er: "#6B2E2E",
  ov: "rgba(0,0,0,.88)",
} as const;

const SE = "'Libre Caslon Display', Georgia, serif";
const SA = "'Libre Franklin', system-ui, sans-serif";

const CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{margin:0;padding:0;background:${C.bg};}
body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
::selection{background:${C.g};color:${C.bg}}
input::placeholder,textarea::placeholder{color:${C.st}}
@keyframes si{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes zi{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:scale(1)}}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:${C.st};border-radius:2px}`;

type FormDataShape = {
  pn: string;
  cn: string;
  em: string;
  ph: string;
  cd: string[];
  vs: string[];
  bn: string;
  fp: string[];
  fn: string;
  bp: string[];
  bnn: string;
  ap: string[];
  an: string;
  pa: string;
  im: string;
  ta: string;
  cu: string;
  sp: string;
  ad: string;
};

type ScreenItem = {
  num: string;
  label: string;
  title: string;
  text: string;
  src: string;
  alt: string;
  cap: string;
};

type Slide = {
  id: string;
  r: () => ReactNode;
};

const INITIAL_FORM: FormDataShape = {
  pn: "",
  cn: "",
  em: "",
  ph: "",
  cd: [],
  vs: [],
  bn: "",
  fp: [],
  fn: "",
  bp: [],
  bnn: "",
  ap: [],
  an: "",
  pa: "",
  im: "",
  ta: "",
  cu: "",
  sp: "",
  ad: "",
};

const gb: CSSProperties = {
  fontFamily: SA,
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: 2.5,
  textTransform: "uppercase",
  padding: "15px 38px",
  border: `1px solid rgba(160,139,92,.28)`,
  background: "transparent",
  color: C.g,
  cursor: "pointer",
  borderRadius: 1,
  transition: "all .35s cubic-bezier(.16,1,.3,1)",
};

const sb: CSSProperties = {
  ...gb,
  background: C.g,
  color: C.bg,
  border: `1px solid ${C.g}`,
};

function L({ children, s = {} }: { children: ReactNode; s?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: SA,
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: 4,
        color: C.q,
        textTransform: "uppercase",
        ...s,
      }}
    >
      {children}
    </div>
  );
}

function H({
  children,
  z = 42,
  s = {},
}: {
  children: ReactNode;
  z?: number;
  s?: CSSProperties;
}) {
  return (
    <h2
      style={{
        fontFamily: SE,
        fontSize: z,
        fontWeight: 400,
        color: C.cr,
        lineHeight: 1.14,
        letterSpacing: "-.015em",
        margin: 0,
        ...s,
      }}
    >
      {children}
    </h2>
  );
}

function P({ children, s = {} }: { children: ReactNode; s?: CSSProperties }) {
  return (
    <p
      style={{
        fontFamily: SA,
        fontSize: 14,
        fontWeight: 300,
        lineHeight: 1.9,
        color: C.sa,
        margin: 0,
        maxWidth: 560,
        letterSpacing: ".01em",
        ...s,
      }}
    >
      {children}
    </p>
  );
}

function Ru({ w = 36, s = {} }: { w?: number; s?: CSSProperties }) {
  return (
    <div
      style={{
        width: w,
        height: 1,
        background: C.g,
        opacity: 0.18,
        ...s,
      }}
    />
  );
}

function Fi({
  label,
  ph,
  type = "text",
  value,
  onChange,
  ta,
}: {
  label: string;
  ph: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  ta?: boolean;
}) {
  const base: CSSProperties = {
    fontFamily: SA,
    fontSize: 13.5,
    fontWeight: 300,
    color: C.cr,
    background: "rgba(255,255,255,.013)",
    border: `1px solid ${C.gl}`,
    borderRadius: 1,
    padding: "13px 15px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    letterSpacing: ".015em",
    transition: "border-color .3s",
  };

  return (
    <div>
      <label
        style={{
          fontFamily: SA,
          fontSize: 8.5,
          fontWeight: 500,
          color: C.m,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {ta ? (
        <textarea
          rows={3}
          placeholder={ph}
          style={{ ...base, resize: "vertical" }}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          placeholder={ph}
          style={base}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

function Ch({
  label,
  opts,
  sel,
  tog,
}: {
  label: string;
  opts: string[];
  sel: string[];
  tog: (value: string) => void;
}) {
  return (
    <div>
      <label
        style={{
          fontFamily: SA,
          fontSize: 8.5,
          fontWeight: 500,
          color: C.m,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          display: "block",
          marginBottom: 10,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {opts.map((o) => {
          const on = sel.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => tog(o)}
              style={{
                fontFamily: SA,
                fontSize: 11,
                fontWeight: 400,
                padding: "7px 15px",
                borderRadius: 1,
                border: `1px solid ${on ? C.g : "rgba(160,139,92,.12)"}`,
                background: on ? C.gd : "transparent",
                color: on ? C.g : C.m,
                cursor: "pointer",
                transition: "all .25s",
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ImgPanel({
  src,
  alt,
  cap,
  onOpen,
  aspect = "16/9",
}: {
  src: string;
  alt: string;
  cap: string;
  onOpen: (src: string, alt: string) => void;
  aspect?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(src, alt)}
      style={{
        width: "100%",
        display: "block",
        padding: 0,
        background: "transparent",
        border: `1px solid ${C.gl}`,
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        textAlign: "left",
        transition:
          "transform .28s cubic-bezier(.16,1,.3,1), border-color .28s cubic-bezier(.16,1,.3,1), box-shadow .28s cubic-bezier(.16,1,.3,1)",
        boxShadow: "0 0 0 1px rgba(160,139,92,.02) inset",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "rgba(160,139,92,.22)";
        e.currentTarget.style.boxShadow =
          "0 20px 50px rgba(0,0,0,.22), 0 0 0 1px rgba(160,139,92,.03) inset";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = C.gl;
        e.currentTarget.style.boxShadow =
          "0 0 0 1px rgba(160,139,92,.02) inset";
      }}
      aria-label={`Open ${alt}`}
    >
      <div
        style={{
          aspectRatio: aspect,
          width: "100%",
          background: `linear-gradient(150deg,${C.ink},${C.ash} 50%,${C.fl})`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,.34), rgba(0,0,0,.07) 26%, rgba(0,0,0,0) 52%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 14,
            top: 14,
            padding: "7px 10px",
            border: "1px solid rgba(255,255,255,.10)",
            background: "rgba(0,0,0,.26)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          }}
        >
          <span
            style={{
              fontFamily: SA,
              fontSize: 8,
              fontWeight: 500,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: C.iv,
              opacity: 0.82,
            }}
          >
            Click to Expand
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 14,
            right: 16,
          }}
        >
          <div
            style={{
              fontFamily: SA,
              fontSize: 8.5,
              fontWeight: 500,
              letterSpacing: 2.6,
              textTransform: "uppercase",
              color: C.iv,
              opacity: 0.84,
              marginBottom: 5,
            }}
          >
            {cap}
          </div>
        </div>
      </div>
    </button>
  );
}

function Lightbox({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", key);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", key);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: C.ov,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "34px",
        animation: "fi .24s both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 1400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          animation: "zi .24s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image"
          style={{
            position: "absolute",
            top: -14,
            right: -2,
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.12)",
            background: "rgba(0,0,0,.36)",
            color: C.iv,
            fontFamily: SA,
            fontSize: 11,
            letterSpacing: 1.4,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
        <img
          src={src}
          alt={alt}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "calc(100dvh - 68px)",
            objectFit: "contain",
            borderRadius: 2,
            border: "1px solid rgba(160,139,92,.14)",
            boxShadow: "0 35px 90px rgba(0,0,0,.45)",
            background: C.ink,
          }}
        />
      </div>
    </div>
  );
}

function SThresh({
  open,
}: {
  open: (src: string, alt: string) => void;
}) {
  return (
    <div style={{ textAlign: "center", maxWidth: 860, margin: "0 auto" }}>
      <L s={{ marginBottom: 32, letterSpacing: 5.5 }}>
        Prepared for SmileSketchVegas
      </L>
      <Ru w={32} s={{ margin: "0 auto 40px" }} />
      <h1
        style={{
          fontFamily: SE,
          fontSize: 50,
          fontWeight: 400,
          color: C.cr,
          lineHeight: 1.1,
          letterSpacing: "-.02em",
          marginBottom: 20,
        }}
      >
        Private Operating
        <br />
        Infrastructure
      </h1>
      <P s={{ margin: "0 auto 48px", textAlign: "center", maxWidth: 470 }}>
        A unified practice system — designed to specification, built in 20
        days, owned permanently.
      </P>
      <ImgPanel
        src="/demo-assets/00-cover.png"
        alt="SmileSketchVegas cover"
        cap="Private Operating Infrastructure"
        onOpen={open}
      />
    </div>
  );
}

function SGap() {
  return (
    <div style={{ maxWidth: 640 }}>
      <L s={{ marginBottom: 22 }}>Operational Baseline</L>
      <H z={36} s={{ marginBottom: 16, maxWidth: 500 }}>
        Most practices operate through disconnected systems by default.
      </H>
      <P s={{ marginBottom: 36 }}>
        Scheduling, records, billing, intake, communication — each handled
        separately. Functional in isolation. But collectively producing
        overhead, inconsistency, and blind spots that accumulate over time and
        reduce operational clarity.
      </P>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {[
          "Disconnected scheduling",
          "Manual intake",
          "Scattered records",
          "Limited financial visibility",
          "Fragmented communication",
          "No unified view",
        ].map((t, i) => (
          <div
            key={i}
            style={{
              padding: "13px 18px",
              background: C.ink,
              flex: "1 1 calc(33.33% - 1px)",
              minWidth: 160,
            }}
          >
            <span
              style={{
                fontFamily: SA,
                fontSize: 11,
                fontWeight: 300,
                color: C.m,
                letterSpacing: ".02em",
              }}
            >
              {t}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SReveal() {
  return (
    <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
      <L s={{ marginBottom: 22 }}>The Infrastructure</L>
      <H z={42} s={{ marginBottom: 16 }}>
        One private system.
        <br />
        Every operational layer.
      </H>
      <P s={{ margin: "0 auto 44px", textAlign: "center" }}>
        Not a template. Not a subscription. A fully owned operating environment
        — built to the exact structure of your practice. Every layer unified.
        Every workflow connected. Permanently yours.
      </P>
    </div>
  );
}

function SScreen({
  num,
  label,
  title,
  text,
  src,
  alt,
  cap,
  open,
}: ScreenItem & { open: (src: string, alt: string) => void }) {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 360px) minmax(0, 1fr)",
          gap: 34,
          alignItems: "start",
        }}
      >
        <div style={{ paddingTop: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: SE,
                fontSize: 18,
                color: C.g,
                opacity: 0.22,
              }}
            >
              {num}
            </span>
            <L>{label}</L>
          </div>
          <H z={30} s={{ marginBottom: 14 }}>
            {title}
          </H>
          <P>{text}</P>
        </div>

        <div>
          <ImgPanel src={src} alt={alt} cap={cap} onOpen={open} />
        </div>
      </div>
    </div>
  );
}

function SContrast() {
  const rows = [
    ["Multiple disconnected tools", "Single private environment"],
    ["Manual re-entry across systems", "Automated data flow"],
    ["Scattered patient information", "One-view patient record"],
    ["Generic SaaS adapted to fit", "Built to your specifications"],
    ["Ongoing subscription dependency", "Permanent ownership"],
    ["Fragmented scheduling", "Integrated calendar"],
    ["Paper and PDF intake", "Digital mobile-first onboarding"],
    ["Limited financial oversight", "Complete billing visibility"],
    ["No workflow tracking", "Visual status pipeline"],
    ["Vendor-controlled updates", "You own the system"],
  ];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <L s={{ marginBottom: 24 }}>Infrastructure Contrast</L>
      <H z={42} s={{ marginBottom: 18, maxWidth: 660 }}>
        The operational difference between fragmented systems and unified
        infrastructure.
      </H>
      <P s={{ marginBottom: 42, maxWidth: 580 }}>
        Not a product comparison. A structural comparison of how daily
        operations function under each model.
      </P>

      <div
        style={{
          borderTop: `1px solid rgba(160,139,92,.08)`,
          borderBottom: `1px solid rgba(160,139,92,.08)`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
            gap: 0,
          }}
        >
          <div
            style={{
              padding: "16px 0 14px",
              borderRight: `1px solid rgba(160,139,92,.05)`,
            }}
          >
            <L s={{ color: C.m }}>Fragmented</L>
          </div>
          <div style={{ padding: "16px 0 14px 22px" }}>
            <L s={{ color: C.g }}>Unified</L>
          </div>
        </div>

        {rows.map(([left, right], i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
              gap: 0,
              borderTop: `1px solid rgba(160,139,92,.05)`,
            }}
          >
            <div
              style={{
                padding: "18px 18px 18px 0",
                borderRight: `1px solid rgba(160,139,92,.05)`,
                color: C.m,
                fontFamily: SA,
                fontSize: 13.5,
                fontWeight: 300,
                lineHeight: 1.55,
                letterSpacing: ".01em",
              }}
            >
              {left}
            </div>
            <div
              style={{
                padding: "18px 0 18px 22px",
                color: C.pa,
                fontFamily: SA,
                fontSize: 13.5,
                fontWeight: 300,
                lineHeight: 1.55,
                letterSpacing: ".01em",
              }}
            >
              {right}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SScope() {
  const left = [
    "Custom frontend layer",
    "Booking request flow",
    "Admin booking control",
    "Calendar infrastructure",
    "Patient profile system",
    "Digital intake system",
    "Workflow & status engine",
  ];

  const right = [
    "Files, labs & documents",
    "Financial visibility layer",
    "Communication layer",
    "Admin operations dashboard",
    "Private architecture",
    "Review, refine & launch",
  ];

  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      <L s={{ marginBottom: 24 }}>Commissioned Scope</L>
      <H z={42} s={{ marginBottom: 18, maxWidth: 720 }}>
        The complete infrastructure delivered within the 20-day build window.
      </H>
      <P s={{ marginBottom: 42, maxWidth: 620 }}>
        Every layer listed is included. Nothing deferred. This is the full
        delivered system.
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
          gap: 28,
          marginBottom: 34,
        }}
      >
        {[left, right].map((col, idx) => (
          <div key={idx}>
            {col.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 0",
                  borderBottom: `1px solid rgba(160,139,92,.05)`,
                  fontFamily: SA,
                  fontSize: 13.5,
                  fontWeight: 300,
                  color: C.pa,
                  letterSpacing: ".01em",
                  lineHeight: 1.55,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: `1px solid rgba(160,139,92,.06)`,
          paddingTop: 24,
        }}
      >
        <L s={{ marginBottom: 18 }}>Project Terms</L>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: 22,
          }}
        >
          {[
            ["Total Investment", "$100,000"],
            ["Initial Authorization", "$20,000"],
            ["Completion Balance", "$80,000"],
            ["Delivery Window", "20 Days"],
          ].map(([k, v], i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: SA,
                  fontSize: 8,
                  fontWeight: 500,
                  letterSpacing: 3.2,
                  textTransform: "uppercase",
                  color: C.q,
                  marginBottom: 10,
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontFamily: SE,
                  fontSize: 24,
                  fontWeight: 400,
                  color: C.cr,
                  lineHeight: 1.2,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>

        <P
          s={{
            marginTop: 22,
            maxWidth: 760,
            fontSize: 12,
            color: C.m,
            lineHeight: 1.75,
          }}
        >
          Additional intelligence capabilities available for development
          following the initial build and hosting period.
        </P>
      </div>
    </div>
  );
}

function SProcess() {
  const items = [
    {
      t: "Current operations stay in place",
      d: "Your current operation remains untouched while the private system is built in parallel.",
    },
    {
      t: "Guided build process",
      d: "Every major layer moves through a guided process of structure, review, and refinement.",
    },
    {
      t: "Review before final transfer",
      d: "You review and approve the system before final transfer. Nothing is forced into place without approval.",
    },
    {
      t: "Parallel operation and transition",
      d: "Parallel operation keeps the transition controlled, deliberate, and operationally clean.",
    },
  ];

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <L s={{ marginBottom: 24 }}>Controlled Process</L>
      <H z={42} s={{ marginBottom: 18, maxWidth: 700 }}>
        Build progression remains controlled from first review through final
        transfer.
      </H>
      <P s={{ marginBottom: 40, maxWidth: 600 }}>
        The build process is structured to protect continuity. Current
        operations remain untouched during development, and the system moves
        through review, approval, guided transition, and parallel operation.
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1,
          background: "rgba(160,139,92,.05)",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: C.ink,
              padding: "28px 26px 30px",
              minHeight: 178,
            }}
          >
            <div
              style={{
                fontFamily: SE,
                fontSize: 22,
                fontWeight: 400,
                color: C.cr,
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              {item.t}
            </div>
            <div
              style={{
                fontFamily: SA,
                fontSize: 13.5,
                fontWeight: 300,
                color: C.sa,
                lineHeight: 1.8,
                letterSpacing: ".01em",
                maxWidth: 320,
              }}
            >
              {item.d}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SStructural() {
  const items = [
    {
      t: "Operational Maturity",
      d: "Standardized systems signal disciplined management — to staff, patients, and any future stakeholder.",
    },
    {
      t: "Clean Transferability",
      d: "A unified operating layer makes ownership transitions measurably simpler and more attractive to acquirers.",
    },
    {
      t: "Valuation Clarity",
      d: "Modern private infrastructure elevates how the practice is assessed, presented, and priced.",
    },
    {
      t: "Permanent Sovereignty",
      d: "No vendor dependency. No subscription fragility. The infrastructure is a permanent owned asset.",
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <L s={{ marginBottom: 24 }}>Structural Position</L>
      <H z={42} s={{ marginBottom: 18, maxWidth: 740 }}>
        Unified infrastructure is a practice asset — not just an operational
        tool.
      </H>
      <P s={{ marginBottom: 42, maxWidth: 660 }}>
        Clean systems affect daily function, stakeholder perception, transition
        readiness, and how the practice is evaluated. Ownership of this
        infrastructure carries forward.
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0,1fr))",
          gap: 1,
          background: "rgba(160,139,92,.05)",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: i % 2 === 0 ? C.bg : "rgba(255,255,255,.02)",
              padding: "30px 26px 34px",
              minHeight: 144,
            }}
          >
            <div
              style={{
                fontFamily: SE,
                fontSize: 22,
                fontWeight: 400,
                color: C.cr,
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              {item.t}
            </div>
            <div
              style={{
                fontFamily: SA,
                fontSize: 13.5,
                fontWeight: 300,
                color: C.sa,
                lineHeight: 1.8,
                letterSpacing: ".01em",
                maxWidth: 340,
              }}
            >
              {item.d}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SFinal({ go }: { go: () => void }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
      <Ru w={32} s={{ margin: "0 auto 42px" }} />
      <H z={52} s={{ marginBottom: 42 }}>
        Commission the build.
      </H>
      <button
        type="button"
        onClick={go}
        style={{ ...gb, padding: "17px 54px", minWidth: 290 }}
      >
        Begin Configuration
      </button>
    </div>
  );
}

const SCREENS: ScreenItem[] = [
  {
    num: "01",
    label: "Operations Center",
    title: "Dashboard",
    text: "Today's activity. Pending bookings. Submissions. Patient movement. Financial snapshots. The single environment your administrative team opens and operates from each day. The system begins with executive visibility — not guesswork.",
    src: "/demo-assets/01-dashboard.png",
    alt: "SmileSketchVegas dashboard screen",
    cap: "Dashboard",
  },
  {
    num: "02",
    label: "Scheduling Layer",
    title: "Schedule",
    text: "Day, week, and month views. Color-coded status. Provider and chair-level visibility. Drag-to-reschedule. Manual creation. Blocked time. The operational surface your front desk works from once the day begins moving.",
    src: "/demo-assets/02-schedule.png",
    alt: "SmileSketchVegas schedule screen",
    cap: "Schedule",
  },
  {
    num: "03",
    label: "Patient Structure",
    title: "Patients",
    text: "One patient, one record. Structured lists, searchable continuity, clear status, and immediate access to the people moving through the practice. Patient organization stops being scattered and becomes operationally usable.",
    src: "/demo-assets/03-patients.png",
    alt: "SmileSketchVegas patients screen",
    cap: "Patients",
  },
  {
    num: "04",
    label: "Patient Intelligence",
    title: "Patient Detail",
    text: "Overview. Timeline. Intake data. Files and labs. Financial history. Notes. Status tags. Unified access eliminates searching across disconnected systems and deepens the record from list view into real operational context.",
    src: "/demo-assets/04-patient-detail.png",
    alt: "SmileSketchVegas patient detail screen",
    cap: "Patient Detail",
  },
  {
    num: "05",
    label: "Clinical Layer",
    title: "Clinical",
    text: "Clinical work belongs inside the same operating environment as the rest of the practice. Once patient detail is structured correctly, the clinical layer becomes part of the system — not an isolated island.",
    src: "/demo-assets/05-clinical.png",
    alt: "SmileSketchVegas clinical screen",
    cap: "Clinical",
  },
  {
    num: "06",
    label: "Imaging Layer",
    title: "Imaging",
    text: "Scans, x-rays, visual records, and supporting imagery live inside the patient infrastructure instead of floating across disconnected storage habits. Retrieval becomes clean. Review becomes immediate. The record becomes deeper and more credible.",
    src: "/demo-assets/06-imaging.png",
    alt: "SmileSketchVegas imaging screen",
    cap: "Imaging",
  },
  {
    num: "07",
    label: "Treatment Progression",
    title: "Treatment",
    text: "Defined treatment movement keeps the patient journey operationally visible. Planning, progress, follow-through, and continuity become part of one connected practice system instead of fragmented staff memory.",
    src: "/demo-assets/07-treatment.png",
    alt: "SmileSketchVegas treatment screen",
    cap: "Treatment",
  },
  {
    num: "08",
    label: "Revenue Visibility",
    title: "Billing",
    text: "Per-patient and practice-wide clarity. Billed. Paid. Outstanding. Transaction history with notes. Invoice and payment logic — administrative visibility that functions as a real financial surface instead of delayed back-office reconstruction.",
    src: "/demo-assets/08-billing.png",
    alt: "SmileSketchVegas billing screen",
    cap: "Billing",
  },
  {
    num: "09",
    label: "Coverage Layer",
    title: "Insurance",
    text: "Insurance belongs inside the same operational picture as treatment and billing. When financial logic and patient record logic are connected, staff friction drops and visibility becomes cleaner at the exact point it matters.",
    src: "/demo-assets/09-insurance.png",
    alt: "SmileSketchVegas insurance screen",
    cap: "Insurance",
  },
  {
    num: "10",
    label: "Executive Control",
    title: "Reports",
    text: "At the top of the system sits reporting — the layer where performance becomes visible, decisions become cleaner, and the practice gains real operational self-awareness. Revenue, flow, activity, and structure resolve into executive control.",
    src: "/demo-assets/10-reports.png",
    alt: "SmileSketchVegas reports screen",
    cap: "Reports",
  },
];

export default function Page() {
  const [mode, setMode] = useState<"gate" | "walk" | "intake" | "done">("gate");
  const [code, setCode] = useState("");
  const [ce, setCe] = useState(false);
  const [sl, setSl] = useState(0);
  const [ak, setAk] = useState(0);
  const [is, setIs] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [fd, setFd] = useState<FormDataShape>(INITIAL_FORM);
  const [lb, setLb] = useState<{ open: boolean; src: string; alt: string }>({
    open: false,
    src: "",
    alt: "",
  });

  const IT = 8;

  const openLightbox = useCallback((src: string, alt: string) => {
    setLb({ open: true, src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    setLb((p) => ({ ...p, open: false }));
  }, []);

  const u = (k: keyof FormDataShape, v: string) =>
    setFd((p) => ({ ...p, [k]: v }));

  const t = (k: keyof FormDataShape, v: string) =>
    setFd((p) => {
      const cur = p[k];
      if (!Array.isArray(cur)) return p;
      return {
        ...p,
        [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v],
      };
    });

  const slides = useMemo<Slide[]>(() => {
    const r: Slide[] = [];
    r.push({
      id: "threshold",
      r: () => <SThresh open={openLightbox} />,
    });
    r.push({ id: "gap", r: () => <SGap /> });
    r.push({ id: "reveal", r: () => <SReveal /> });

    SCREENS.forEach((d) =>
      r.push({
        id: `screen-${d.num}`,
        r: () => <SScreen {...d} open={openLightbox} />,
      })
    );

    r.push({ id: "contrast", r: () => <SContrast /> });
    r.push({ id: "scope", r: () => <SScope /> });
    r.push({ id: "process", r: () => <SProcess /> });
    r.push({ id: "structural", r: () => <SStructural /> });

    r.push({
      id: "final",
      r: () => (
        <SFinal
          go={() => {
            setMode("intake");
            setIs(1);
          }}
        />
      ),
    });

    return r;
  }, [openLightbox]);

  const tot = slides.length;

  const go = useCallback(
    (n: number) => {
      if (n < 0 || n >= tot) return;
      setSl(n);
      setAk((k) => k + 1);
    },
    [tot]
  );

  const enter = useCallback(() => {
    if (code.trim().toUpperCase() === ACCESS_CODE) {
      setMode("walk");
      setSl(0);
      setAk((k) => k + 1);
      setCe(false);
      return;
    }
    setCe(true);
    window.setTimeout(() => setCe(false), 2400);
  }, [code]);

  const sub = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      ...fd,
      source: "smilesketchvegas-private-walkthrough",
      submittedAt: new Date().toISOString(),
    };

    try {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`Submit failed with status ${res.status}`);
        }
      } catch (err) {
        console.error("Endpoint unavailable; using demo success fallback.", err);
      }

      console.log("Build Config:", payload);
      setMode("done");
    } catch (err) {
      console.error(err);
      alert("Submission failed. Refresh and try again.");
    } finally {
      setSubmitting(false);
    }
  }, [fd, submitting]);

  if (mode === "gate") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <style>{CSS}</style>
        <div
          style={{
            textAlign: "center",
            animation: "si 1s cubic-bezier(.16,1,.3,1) both",
            maxWidth: 360,
            padding: "0 28px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontFamily: SE,
              fontSize: 22,
              color: C.cr,
              letterSpacing: "-.01em",
              marginBottom: 4,
            }}
          >
            SmileSketchVegas
          </div>
          <div
            style={{
              fontFamily: SA,
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: 4,
              color: C.w,
              textTransform: "uppercase",
              marginBottom: 48,
            }}
          >
            System Access
          </div>
          <input
            type="password"
            placeholder="Access Code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setCe(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && enter()}
            style={{
              fontFamily: SA,
              fontSize: 13,
              fontWeight: 300,
              color: C.cr,
              letterSpacing: 2.5,
              textAlign: "center",
              background: "transparent",
              width: "100%",
              border: "none",
              borderBottom: `1px solid ${
                ce ? C.er : "rgba(160,139,92,.15)"
              }`,
              padding: "12px 0",
              outline: "none",
              transition: "border-color .3s",
            }}
          />
          <div
            style={{
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {ce && (
              <span
                style={{
                  fontFamily: SA,
                  fontSize: 10,
                  color: C.er,
                  letterSpacing: 1,
                  animation: "fi .25s both",
                }}
              >
                Not recognized
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={enter}
            style={{ ...gb, marginTop: 18, padding: "13px 44px", fontSize: 9 }}
          >
            Enter
          </button>
          <div
            style={{
              marginTop: 56,
              fontFamily: SA,
              fontSize: 7.5,
              letterSpacing: 3.5,
              color: "rgba(106,102,95,.3)",
              textTransform: "uppercase",
            }}
          >
            Authorized Access Only
          </div>
        </div>
      </div>
    );
  }

  if (mode === "done") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <style>{CSS}</style>
        <div
          style={{
            textAlign: "center",
            animation: "si 1s cubic-bezier(.16,1,.3,1) both",
            maxWidth: 460,
            padding: "0 28px",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              border: `1px solid rgba(160,139,92,.22)`,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.g}
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <L s={{ marginBottom: 14 }}>Configuration Received</L>
          <h1
            style={{
              fontFamily: SE,
              fontSize: 30,
              fontWeight: 400,
              color: C.cr,
              lineHeight: 1.3,
              marginBottom: 32,
            }}
          >
            Build request submitted.
          </h1>
          <Ru w={28} s={{ margin: "0 auto 32px" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              textAlign: "left",
              maxWidth: 380,
              margin: "0 auto",
            }}
          >
            {[
              "Your build configuration has been received.",
              "Our team will review within 24 hours.",
              "Confirmation with scope and timeline will be sent to your email.",
              "Wire transfer invoice and authorization documents will follow.",
            ].map((x, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 12, alignItems: "baseline" }}
              >
                <div
                  style={{
                    width: 2.5,
                    height: 2.5,
                    borderRadius: "50%",
                    background: C.g,
                    opacity: 0.3,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <span
                  style={{
                    fontFamily: SA,
                    fontSize: 12.5,
                    fontWeight: 300,
                    lineHeight: 1.65,
                    color: C.sa,
                  }}
                >
                  {x}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 64,
              fontFamily: SA,
              fontSize: 7.5,
              letterSpacing: 3,
              color: "rgba(106,102,95,.22)",
              textTransform: "uppercase",
            }}
          >
            SmileSketchVegas
          </div>
        </div>
      </div>
    );
  }

  if (mode === "intake") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: C.bg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <style>{CSS}</style>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{ maxWidth: 500, width: "100%", padding: "64px 28px 100px" }}
          >
            <L s={{ textAlign: "center", marginBottom: 40, letterSpacing: 5 }}>
              Build Configuration
            </L>

            <div style={{ display: "flex", gap: 3, marginBottom: 44 }}>
              {Array.from({ length: IT }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 1,
                    background: i < is ? C.g : "rgba(160,139,92,.07)",
                    transition: "background .4s",
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>

            <div
              key={is}
              style={{ animation: "si .5s cubic-bezier(.16,1,.3,1) both" }}
            >
              <div
                style={{
                  fontFamily: SA,
                  fontSize: 8.5,
                  color: C.w,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 7,
                }}
              >
                {is} — {IT}
              </div>

              {is === 1 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }}>
                    Practice Identity
                  </H>
                  <P s={{ marginBottom: 24, fontSize: 11.5, color: C.m }}>
                    Foundation details.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Fi
                      label="Practice Name"
                      ph="SmileSketch Vegas"
                      value={fd.pn}
                      onChange={(e) => u("pn", e.target.value)}
                    />
                    <Fi
                      label="Primary Contact"
                      ph="Full name"
                      value={fd.cn}
                      onChange={(e) => u("cn", e.target.value)}
                    />
                    <Fi
                      label="Email"
                      ph="you@practice.com"
                      type="email"
                      value={fd.em}
                      onChange={(e) => u("em", e.target.value)}
                    />
                    <Fi
                      label="Phone"
                      ph="(702) 000-0000"
                      type="tel"
                      value={fd.ph}
                      onChange={(e) => u("ph", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 2 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }}>
                    Brand Direction
                  </H>
                  <P s={{ marginBottom: 24, fontSize: 11.5, color: C.m }}>
                    Visual identity for your system.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Ch
                      label="Color"
                      opts={[
                        "Dark & Refined",
                        "Clean & Light",
                        "Warm Neutral",
                        "Cool Clinical",
                        "Bold",
                      ]}
                      sel={fd.cd}
                      tog={(v) => t("cd", v)}
                    />
                    <Ch
                      label="Character"
                      opts={[
                        "Luxury",
                        "Modern",
                        "Clinical",
                        "Minimal",
                        "Bold",
                        "Warm",
                      ]}
                      sel={fd.vs}
                      tog={(v) => t("vs", v)}
                    />
                    <Fi
                      label="Notes"
                      ph="Colors, references..."
                      ta
                      value={fd.bn}
                      onChange={(e) => u("bn", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 3 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }}>
                    Frontend Priorities
                  </H>
                  <P s={{ marginBottom: 24, fontSize: 11.5, color: C.m }}>
                    Patient-facing layer.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Ch
                      label="Focus"
                      opts={[
                        "Booking-First",
                        "Service Visibility",
                        "Mobile-First",
                        "Trust & Reviews",
                        "Patient Experience",
                        "Aesthetic",
                      ]}
                      sel={fd.fp}
                      tog={(v) => t("fp", v)}
                    />
                    <Fi
                      label="Notes"
                      ph="Requirements..."
                      ta
                      value={fd.fn}
                      onChange={(e) => u("fn", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 4 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }}>
                    Operating Priorities
                  </H>
                  <P s={{ marginBottom: 24, fontSize: 11.5, color: C.m }}>
                    Backend depth.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Ch
                      label="Priorities"
                      opts={[
                        "Calendar",
                        "Profiles",
                        "Intake",
                        "Files & Labs",
                        "Financial",
                        "Comms",
                        "Pipeline",
                      ]}
                      sel={fd.bp}
                      tog={(v) => t("bp", v)}
                    />
                    <Fi
                      label="Notes"
                      ph="Workflows..."
                      ta
                      value={fd.bnn}
                      onChange={(e) => u("bnn", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 5 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }}>
                    Future Intelligence
                  </H>
                  <P
                    s={{
                      marginBottom: 24,
                      fontSize: 11.5,
                      color: C.m,
                      fontStyle: "italic",
                    }}
                  >
                    Optional post-build capabilities.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Ch
                      label="Interest Areas"
                      opts={[
                        "Patient Guidance",
                        "Booking Assist",
                        "Intake Support",
                        "Admin Assist",
                        "Follow-Up",
                        "Automation",
                      ]}
                      sel={fd.ap}
                      tog={(v) => t("ap", v)}
                    />
                    <Fi
                      label="Notes"
                      ph="Automation ideas..."
                      ta
                      value={fd.an}
                      onChange={(e) => u("an", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 6 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }}>
                    Transformation Targets
                  </H>
                  <P s={{ marginBottom: 24, fontSize: 11.5, color: C.m }}>
                    Priorities for change.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Fi
                      label="Pain Points"
                      ph="Current frustrations..."
                      ta
                      value={fd.pa}
                      onChange={(e) => u("pa", e.target.value)}
                    />
                    <Fi
                      label="Improvements"
                      ph="What matters most..."
                      ta
                      value={fd.im}
                      onChange={(e) => u("im", e.target.value)}
                    />
                    <Fi
                      label="Immediate Targets"
                      ph="First changes..."
                      ta
                      value={fd.ta}
                      onChange={(e) => u("ta", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 7 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }}>
                    Final Notes
                  </H>
                  <P s={{ marginBottom: 24, fontSize: 11.5, color: C.m }}>
                    Anything additional.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Fi
                      label="Custom Requests"
                      ph="Features, integrations..."
                      ta
                      value={fd.cu}
                      onChange={(e) => u("cu", e.target.value)}
                    />
                    <Fi
                      label="Special Requirements"
                      ph="Compliance, legacy..."
                      ta
                      value={fd.sp}
                      onChange={(e) => u("sp", e.target.value)}
                    />
                    <Fi
                      label="Anything Else"
                      ph="Final notes..."
                      ta
                      value={fd.ad}
                      onChange={(e) => u("ad", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 8 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }}>
                    Acknowledgment
                  </H>
                  <P s={{ marginBottom: 24, fontSize: 11.5, color: C.m }}>
                    Review before submission.
                  </P>
                  <div
                    style={{
                      borderTop: `1px solid rgba(160,139,92,.06)`,
                      paddingTop: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    {[
                      "Review within 24 hours of submission.",
                      "Confirmation email with scope and timeline.",
                      "Wire transfer invoice and authorization documents to follow.",
                      "$100,000 total — $20,000 to authorize — $80,000 upon completion — 20-day delivery.",
                    ].map((x, i) => (
                      <div
                        key={i}
                        style={{ display: "flex", gap: 10, alignItems: "baseline" }}
                      >
                        <div
                          style={{
                            width: 2.5,
                            height: 2.5,
                            borderRadius: "50%",
                            background: C.g,
                            opacity: 0.25,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: SA,
                            fontSize: 11.5,
                            fontWeight: 300,
                            lineHeight: 1.6,
                            color: C.sa,
                          }}
                        >
                          {x}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 40,
              }}
            >
              {is > 1 ? (
                <button
                  type="button"
                  onClick={() => setIs((s) => Math.max(s - 1, 1))}
                  style={{ ...gb, padding: "11px 26px", fontSize: 8.5 }}
                  disabled={submitting}
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {is < IT ? (
                <button
                  type="button"
                  onClick={() => setIs((s) => Math.min(s + 1, IT))}
                  style={{ ...sb, padding: "11px 26px", fontSize: 8.5 }}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={sub}
                  style={{
                    ...sb,
                    padding: "11px 26px",
                    fontSize: 8.5,
                    opacity: submitting ? 0.7 : 1,
                  }}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cur = slides[sl];

  return (
    <div
      style={{
        minHeight: "100dvh",
        height: "100dvh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{CSS}</style>

      <Lightbox
        open={lb.open}
        src={lb.src}
        alt={lb.alt}
        onClose={closeLightbox}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 55% 40% at 50% 38%,rgba(160,139,92,.014),transparent)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 36px 0",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: SA,
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: 4,
            color: C.w,
            textTransform: "uppercase",
          }}
        >
          SmileSketchVegas
        </div>

        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === sl ? 14 : 3,
                height: 1.5,
                borderRadius: 1,
                background:
                  i === sl
                    ? C.g
                    : i < sl
                    ? "rgba(160,139,92,.16)"
                    : "rgba(160,139,92,.05)",
                transition: "all .4s cubic-bezier(.16,1,.3,1)",
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontFamily: SA,
            fontSize: 8,
            fontWeight: 400,
            letterSpacing: 3,
            color: C.w,
            textTransform: "uppercase",
            minWidth: 48,
            textAlign: "right",
          }}
        >
          {String(sl + 1).padStart(2, "0")} / {String(tot).padStart(2, "0")}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 44px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          key={ak}
          style={{
            width: "100%",
            maxHeight: "100%",
            overflow: "auto",
            animation: "si .65s cubic-bezier(.16,1,.3,1) both",
            padding: "0 0 32px",
          }}
        >
          {cur.r()}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 36px 28px",
          flexShrink: 0,
        }}
      >
        {sl > 0 ? (
          <button
            type="button"
            onClick={() => go(sl - 1)}
            style={{ ...gb, padding: "11px 28px", fontSize: 8.5, opacity: 0.65 }}
          >
            Back
          </button>
        ) : (
          <div style={{ width: 90 }} />
        )}

        {sl < tot - 1 ? (
          <button
            type="button"
            onClick={() => go(sl + 1)}
            style={{ ...gb, padding: "11px 28px", fontSize: 8.5 }}
          >
            Continue
          </button>
        ) : (
          <div style={{ width: 90 }} />
        )}
      </div>
    </div>
  );
}