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
// CALICO YACHT CHARTERS — PRIVATE INFRASTRUCTURE WALKTHROUGH
// V2 — Image-First / Sales-Weighted / Next.js App Router Safe
// ═══════════════════════════════════════════════════════════

const ACCESS_CODE = "CALICO2026";
const FORM_ENDPOINT =
  "https://owen-lane-demo-intake.onrender.com/api/build-submission";

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
  gs: "rgba(160,139,92,.20)",
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
@keyframes sli{from{opacity:0;transform:translateY(26px) scale(.992)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes glowPulse{0%{box-shadow:0 0 0 rgba(160,139,92,0)}50%{box-shadow:0 0 100px rgba(160,139,92,.06)}100%{box-shadow:0 0 0 rgba(160,139,92,0)}}
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

type Slide = {
  id: string;
  r: () => ReactNode;
};

type ViewportInfo = {
  w: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isNarrow: boolean;
};

type SceneKind = "hero" | "overlay" | "split" | "stacked" | "metrics";

type ScreenItem = {
  num: string;
  label: string;
  title: string;
  text: string;
  src: string;
  alt: string;
  cap: string;
  kind: SceneKind;
  eyebrow?: string;
  stat?: string;
  kicker?: string;
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

function useViewport(): ViewportInfo {
  const [w, setW] = useState(1280);

  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    w,
    isMobile: w <= 768,
    isTablet: w <= 1100,
    isDesktop: w > 1100,
    isNarrow: w <= 430,
  };
}

function buttonBase(vp: ViewportInfo): CSSProperties {
  return {
    fontFamily: SA,
    fontSize: vp.isNarrow ? 8.5 : vp.isMobile ? 9 : 10,
    fontWeight: 500,
    letterSpacing: vp.isNarrow ? 1.9 : vp.isMobile ? 2.1 : 2.5,
    textTransform: "uppercase",
    padding: vp.isNarrow
      ? "12px 16px"
      : vp.isMobile
      ? "13px 22px"
      : "15px 38px",
    border: `1px solid rgba(160,139,92,.28)`,
    background: "transparent",
    color: C.g,
    cursor: "pointer",
    borderRadius: 1,
    transition: "all .35s cubic-bezier(.16,1,.3,1)",
    whiteSpace: "nowrap",
  };
}

function solidButton(vp: ViewportInfo): CSSProperties {
  return {
    ...buttonBase(vp),
    background: C.g,
    color: C.bg,
    border: `1px solid ${C.g}`,
  };
}

function L({
  children,
  s = {},
  vp,
}: {
  children: ReactNode;
  s?: CSSProperties;
  vp?: ViewportInfo;
}) {
  return (
    <div
      style={{
        fontFamily: SA,
        fontSize: vp?.isNarrow ? 7.5 : vp?.isMobile ? 8 : 9,
        fontWeight: 500,
        letterSpacing: vp?.isNarrow ? 2.6 : vp?.isMobile ? 3.1 : 4,
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
  vp,
}: {
  children: ReactNode;
  z?: number;
  s?: CSSProperties;
  vp?: ViewportInfo;
}) {
  const rz = vp?.isNarrow
    ? Math.max(22, Math.round(z * 0.58))
    : vp?.isMobile
    ? Math.max(24, Math.round(z * 0.68))
    : vp?.isTablet
    ? Math.max(26, Math.round(z * 0.84))
    : z;

  return (
    <h2
      style={{
        fontFamily: SE,
        fontSize: rz,
        fontWeight: 400,
        color: C.cr,
        lineHeight: vp?.isMobile ? 1.08 : 1.14,
        letterSpacing: "-.015em",
        margin: 0,
        ...s,
      }}
    >
      {children}
    </h2>
  );
}

function P({
  children,
  s = {},
  vp,
}: {
  children: ReactNode;
  s?: CSSProperties;
  vp?: ViewportInfo;
}) {
  return (
    <p
      style={{
        fontFamily: SA,
        fontSize: vp?.isNarrow ? 12.5 : vp?.isMobile ? 13 : 14,
        fontWeight: 300,
        lineHeight: vp?.isMobile ? 1.78 : 1.9,
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

function Ru({
  w = 36,
  s = {},
}: {
  w?: number;
  s?: CSSProperties;
}) {
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
  vp,
}: {
  label: string;
  ph: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  ta?: boolean;
  vp: ViewportInfo;
}) {
  const base: CSSProperties = {
    fontFamily: SA,
    fontSize: vp.isNarrow ? 13.5 : vp.isMobile ? 14 : 13.5,
    fontWeight: 300,
    color: C.cr,
    background: "rgba(255,255,255,.013)",
    border: `1px solid ${C.gl}`,
    borderRadius: 1,
    padding: vp.isMobile ? "14px 14px" : "13px 15px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    letterSpacing: ".015em",
    transition: "border-color .3s",
    minHeight: vp.isMobile ? 48 : undefined,
  };

  return (
    <div>
      <label
        style={{
          fontFamily: SA,
          fontSize: vp.isNarrow ? 7.5 : vp.isMobile ? 8 : 8.5,
          fontWeight: 500,
          color: C.m,
          letterSpacing: vp.isNarrow ? 1.9 : vp.isMobile ? 2.1 : 2.5,
          textTransform: "uppercase",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {ta ? (
        <textarea
          rows={vp.isMobile ? 4 : 3}
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
  vp,
}: {
  label: string;
  opts: string[];
  sel: string[];
  tog: (value: string) => void;
  vp: ViewportInfo;
}) {
  return (
    <div>
      <label
        style={{
          fontFamily: SA,
          fontSize: vp.isNarrow ? 7.5 : vp.isMobile ? 8 : 8.5,
          fontWeight: 500,
          color: C.m,
          letterSpacing: vp.isNarrow ? 1.9 : vp.isMobile ? 2.1 : 2.5,
          textTransform: "uppercase",
          display: "block",
          marginBottom: 10,
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: vp.isMobile ? 8 : 6,
        }}
      >
        {opts.map((o) => {
          const on = sel.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => tog(o)}
              style={{
                fontFamily: SA,
                fontSize: vp.isNarrow ? 11 : vp.isMobile ? 11.5 : 11,
                fontWeight: 400,
                padding: vp.isMobile ? "9px 13px" : "7px 15px",
                borderRadius: 1,
                border: `1px solid ${on ? C.g : "rgba(160,139,92,.12)"}`,
                background: on ? C.gd : "transparent",
                color: on ? C.g : C.m,
                cursor: "pointer",
                transition: "all .25s",
                minHeight: vp.isMobile ? 38 : undefined,
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
  vp,
  fill = false,
  elevated = false,
  noBorder = false,
  darken = 0.28,
}: {
  src: string;
  alt: string;
  cap: string;
  onOpen: (src: string, alt: string) => void;
  aspect?: string;
  vp: ViewportInfo;
  fill?: boolean;
  elevated?: boolean;
  noBorder?: boolean;
  darken?: number;
}) {
  const wrapperStyle: CSSProperties = {
    width: "100%",
    display: "block",
    padding: 0,
    background: "transparent",
    border: noBorder ? "none" : `1px solid ${C.gl}`,
    borderRadius: noBorder ? 0 : 2,
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    textAlign: "left",
    transition:
      "transform .32s cubic-bezier(.16,1,.3,1), border-color .32s cubic-bezier(.16,1,.3,1), box-shadow .32s cubic-bezier(.16,1,.3,1), filter .32s cubic-bezier(.16,1,.3,1)",
    boxShadow: elevated
      ? "0 24px 90px rgba(0,0,0,.34), 0 0 120px rgba(160,139,92,.04)"
      : "0 0 0 1px rgba(160,139,92,.02) inset",
    WebkitTapHighlightColor: "transparent",
  };

  const frameStyle: CSSProperties = vp.isMobile
    ? {
        position: "relative",
        width: "100%",
        background: `linear-gradient(150deg,${C.ink},${C.ash} 50%,${C.fl})`,
      }
    : {
        aspectRatio: fill ? undefined : aspect,
        width: "100%",
        background: `linear-gradient(150deg,${C.ink},${C.ash} 50%,${C.fl})`,
        position: "relative",
        overflow: "hidden",
      };

  return (
    <button
      type="button"
      onClick={() => onOpen(src, alt)}
      style={wrapperStyle}
      onMouseEnter={(e) => {
        if (vp.isMobile) return;
        e.currentTarget.style.transform = elevated
          ? "translateY(-4px) scale(1.004)"
          : "translateY(-2px)";
        e.currentTarget.style.borderColor = noBorder
          ? "transparent"
          : "rgba(160,139,92,.26)";
        e.currentTarget.style.boxShadow = elevated
          ? "0 30px 100px rgba(0,0,0,.42), 0 0 140px rgba(160,139,92,.08)"
          : "0 20px 50px rgba(0,0,0,.22), 0 0 0 1px rgba(160,139,92,.03) inset";
        e.currentTarget.style.filter = "brightness(1.02)";
      }}
      onMouseLeave={(e) => {
        if (vp.isMobile) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = noBorder ? "transparent" : C.gl;
        e.currentTarget.style.boxShadow = elevated
          ? "0 24px 90px rgba(0,0,0,.34), 0 0 120px rgba(160,139,92,.04)"
          : "0 0 0 1px rgba(160,139,92,.02) inset";
        e.currentTarget.style.filter = "brightness(1)";
      }}
      aria-label={`Open ${alt}`}
    >
      <div style={frameStyle}>
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="sync"
          style={{
            width: "100%",
            height: vp.isMobile || fill ? "auto" : "100%",
            objectFit: vp.isMobile || fill ? "contain" : "cover",
            display: "block",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, rgba(0,0,0,${darken}), rgba(0,0,0,.08) 28%, rgba(0,0,0,0) 58%)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: vp.isMobile ? 10 : 14,
            top: vp.isMobile ? 10 : 14,
            padding: vp.isMobile ? "6px 8px" : "7px 10px",
            border: "1px solid rgba(255,255,255,.10)",
            background: "rgba(0,0,0,.26)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          }}
        >
          <span
            style={{
              fontFamily: SA,
              fontSize: vp.isMobile ? 7.5 : 8,
              fontWeight: 500,
              letterSpacing: vp.isMobile ? 1.8 : 2.2,
              textTransform: "uppercase",
              color: C.iv,
              opacity: 0.82,
            }}
          >
            TAP TO OPEN
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            left: vp.isMobile ? 12 : 16,
            bottom: vp.isMobile ? 10 : 14,
            right: vp.isMobile ? 12 : 16,
          }}
        >
          <div
            style={{
              fontFamily: SA,
              fontSize: vp.isMobile ? 8 : 8.5,
              fontWeight: 500,
              letterSpacing: vp.isMobile ? 2.1 : 2.6,
              textTransform: "uppercase",
              color: C.iv,
              opacity: 0.88,
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
  vp,
}: {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
  vp: ViewportInfo;
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
        padding: vp.isMobile ? "18px" : "34px",
        animation: "fi .24s both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 1600,
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
            top: vp.isMobile ? -10 : -14,
            right: vp.isMobile ? 0 : -2,
            width: vp.isMobile ? 36 : 34,
            height: vp.isMobile ? 36 : 34,
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
            maxHeight: vp.isMobile
              ? "calc(100dvh - 36px)"
              : "calc(100dvh - 68px)",
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

function SceneShell({
  children,
  vp,
  max = 1180,
  align = "center",
}: {
  children: ReactNode;
  vp: ViewportInfo;
  max?: number;
  align?: "center" | "left";
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: max,
        margin: "0 auto",
        textAlign: align,
      }}
    >
      {children}
    </div>
  );
}

function SThresh({
  open,
  vp,
}: {
  open: (src: string, alt: string) => void;
  vp: ViewportInfo;
}) {
  return (
    <SceneShell vp={vp} max={1220}>
      <div style={{ textAlign: "center", marginBottom: vp.isMobile ? 26 : 34 }}>
        <L
          s={{
            marginBottom: vp.isMobile ? 22 : 28,
            letterSpacing: vp.isNarrow ? 3.5 : vp.isMobile ? 4.2 : 5.5,
          }}
          vp={vp}
        >
          Prepared for Calico Yacht Charters
        </L>
        <Ru w={32} s={{ margin: `0 auto ${vp.isMobile ? 26 : 36}px` }} />
        <h1
          style={{
            fontFamily: SE,
            fontSize: vp.isNarrow
              ? 32
              : vp.isMobile
              ? 36
              : vp.isTablet
              ? 52
              : 66,
            fontWeight: 400,
            color: C.cr,
            lineHeight: vp.isMobile ? 1.02 : 1.04,
            letterSpacing: "-.024em",
            marginBottom: vp.isMobile ? 14 : 18,
          }}
        >
          Private Operating
          <br />
          Infrastructure
        </h1>
        <P
          vp={vp}
          s={{
            margin: `0 auto ${vp.isMobile ? 26 : 38}px`,
            textAlign: "center",
            maxWidth: vp.isNarrow ? 292 : vp.isMobile ? 340 : 520,
            fontSize: vp.isMobile ? 13 : 14.5,
          }}
        >
          A unified charter system — designed to specification, built in 20
          days, and permanently owned.
        </P>
      </div>

      <ImgPanel
        src="/demo-assets/00-cover.png"
        alt="Calico Yacht Charters cover"
        cap="Private Operating Infrastructure"
        onOpen={open}
        vp={vp}
        aspect={vp.isMobile ? "4/3" : "16/8.5"}
        elevated
        noBorder
        darken={0.34}
      />
    </SceneShell>
  );
}

function SGap({
  open,
  vp,
}: {
  open: (src: string, alt: string) => void;
  vp: ViewportInfo;
}) {
  const pain = [
    "Fragmented booking channels",
    "Manual event coordination",
    "Scattered client data",
    "Slow financial visibility",
    "Disconnected crew scheduling",
    "No single operations surface",
  ];

  return (
    <SceneShell vp={vp} max={1180}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: vp.isTablet
            ? "1fr"
            : "minmax(0, 1.15fr) minmax(0, .85fr)",
          gap: vp.isMobile ? 24 : 34,
          alignItems: "center",
        }}
      >
        <div>
          <L s={{ marginBottom: 20 }} vp={vp}>
            Operational Baseline
          </L>
          <H z={44} s={{ marginBottom: 16, maxWidth: 700 }} vp={vp}>
            Most charter businesses are still running premium experiences on top
            of broken internal structure.
          </H>
          <P vp={vp} s={{ marginBottom: vp.isMobile ? 24 : 30, maxWidth: 620 }}>
            Bookings, scheduling, payments, crew coordination, and client
            history live across separate tools. It works until volume rises.
            Then speed drops, details slip, and the business starts operating
            below its own ceiling.
          </P>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: vp.isMobile
                ? "1fr"
                : "repeat(2, minmax(0, 1fr))",
              gap: 1,
              background: "rgba(160,139,92,.05)",
            }}
          >
            {pain.map((t, i) => (
              <div
                key={i}
                style={{
                  padding: vp.isMobile ? "14px 14px" : "16px 18px",
                  background: C.ink,
                }}
              >
                <span
                  style={{
                    fontFamily: SA,
                    fontSize: vp.isMobile ? 11.8 : 12.4,
                    fontWeight: 300,
                    color: C.m,
                    letterSpacing: ".02em",
                    lineHeight: 1.55,
                  }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <ImgPanel
            src="/demo-assets/02-bookings.png"
            alt="Calico Yacht Charters bookings preview"
            cap="Without unified infrastructure"
            onOpen={open}
            vp={vp}
            aspect={vp.isMobile ? "4/3" : "1/1.02"}
            elevated
            darken={0.38}
          />
        </div>
      </div>
    </SceneShell>
  );
}

function SReveal({ vp }: { vp: ViewportInfo }) {
  return (
    <SceneShell vp={vp} max={860}>
      <div style={{ textAlign: "center" }}>
        <L s={{ marginBottom: 22 }} vp={vp}>
          The Infrastructure
        </L>
        <H z={48} s={{ marginBottom: 16 }} vp={vp}>
          One private system.
          <br />
          Every operational layer.
        </H>
        <P
          vp={vp}
          s={{
            margin: `0 auto ${vp.isMobile ? 8 : 0}px`,
            textAlign: "center",
            maxWidth: vp.isNarrow ? 300 : vp.isMobile ? 340 : 560,
          }}
        >
          Not rented software. Not adapted SaaS. A business-owned charter
          environment built to the exact structure of your operation.
        </P>
      </div>
    </SceneShell>
  );
}

function SceneMeta({
  item,
  vp,
  center = false,
  compact = false,
}: {
  item: ScreenItem;
  vp: ViewportInfo;
  center?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        maxWidth: center ? 720 : 560,
        textAlign: center ? "center" : "left",
        margin: center ? "0 auto" : undefined,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: center ? "center" : "flex-start",
          gap: vp.isMobile ? 10 : 12,
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: SE,
            fontSize: vp.isMobile ? 16 : 18,
            color: C.g,
            opacity: 0.22,
          }}
        >
          {item.num}
        </span>
        <L vp={vp}>{item.label}</L>
      </div>

      {item.eyebrow && (
        <div
          style={{
            fontFamily: SA,
            fontSize: vp.isMobile ? 8 : 8.5,
            fontWeight: 500,
            letterSpacing: vp.isMobile ? 2.6 : 3,
            textTransform: "uppercase",
            color: C.g,
            opacity: 0.9,
            marginBottom: 10,
          }}
        >
          {item.eyebrow}
        </div>
      )}

      <H
        z={compact ? 28 : 34}
        s={{ marginBottom: 12, maxWidth: compact ? 520 : 620 }}
        vp={vp}
      >
        {item.title}
      </H>

      <P
        vp={vp}
        s={{
          maxWidth: compact ? 500 : 560,
          marginBottom: item.kicker || item.stat ? 14 : 0,
        }}
      >
        {item.text}
      </P>

      {item.stat && (
        <div
          style={{
            fontFamily: SE,
            fontSize: vp.isNarrow ? 20 : vp.isMobile ? 24 : 30,
            lineHeight: 1.1,
            color: C.cr,
            marginTop: 14,
            marginBottom: item.kicker ? 6 : 0,
          }}
        >
          {item.stat}
        </div>
      )}

      {item.kicker && (
        <div
          style={{
            fontFamily: SA,
            fontSize: vp.isMobile ? 10.8 : 11.5,
            lineHeight: 1.65,
            color: C.q,
            letterSpacing: ".01em",
          }}
        >
          {item.kicker}
        </div>
      )}
    </div>
  );
}

function SScreen({
  item,
  open,
  vp,
}: {
  item: ScreenItem;
  open: (src: string, alt: string) => void;
  vp: ViewportInfo;
}) {
  if (item.kind === "hero") {
    return (
      <SceneShell vp={vp} max={1280}>
        <div style={{ position: "relative" }}>
          <ImgPanel
            src={item.src}
            alt={item.alt}
            cap={item.cap}
            onOpen={open}
            vp={vp}
            aspect={vp.isMobile ? "4/3" : "16/7.8"}
            elevated
            noBorder
            darken={0.42}
          />

          {!vp.isMobile && (
            <div
              style={{
                position: "absolute",
                left: 34,
                bottom: 30,
                width: "min(520px, 46%)",
                padding: "26px 26px 24px",
                background: "linear-gradient(180deg, rgba(7,7,7,.72), rgba(7,7,7,.88))",
                border: "1px solid rgba(160,139,92,.10)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <SceneMeta item={item} vp={vp} compact />
            </div>
          )}

          {vp.isMobile && (
            <div style={{ marginTop: 18 }}>
              <SceneMeta item={item} vp={vp} />
            </div>
          )}
        </div>
      </SceneShell>
    );
  }

  if (item.kind === "overlay") {
    return (
      <SceneShell vp={vp} max={1240}>
        <div style={{ position: "relative" }}>
          <ImgPanel
            src={item.src}
            alt={item.alt}
            cap={item.cap}
            onOpen={open}
            vp={vp}
            aspect={vp.isMobile ? "4/3" : "16/8.8"}
            elevated
            noBorder
            darken={0.40}
          />

          {!vp.isMobile && (
            <div
              style={{
                position: "absolute",
                right: 28,
                bottom: 28,
                width: "min(470px, 40%)",
                padding: "22px 22px 20px",
                background:
                  "linear-gradient(180deg, rgba(7,7,7,.78), rgba(7,7,7,.92))",
                border: "1px solid rgba(160,139,92,.12)",
                boxShadow: "0 18px 60px rgba(0,0,0,.35)",
              }}
            >
              <SceneMeta item={item} vp={vp} compact />
            </div>
          )}

          {vp.isMobile && (
            <div style={{ marginTop: 18 }}>
              <SceneMeta item={item} vp={vp} />
            </div>
          )}
        </div>
      </SceneShell>
    );
  }

  if (item.kind === "split") {
    return (
      <SceneShell vp={vp} max={1220}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: vp.isTablet
              ? "1fr"
              : "minmax(0, 1.18fr) minmax(0, .82fr)",
            gap: vp.isMobile ? 20 : 34,
            alignItems: "center",
          }}
        >
          <div style={{ order: vp.isTablet ? 1 : 1 }}>
            <ImgPanel
              src={item.src}
              alt={item.alt}
              cap={item.cap}
              onOpen={open}
              vp={vp}
              aspect={vp.isMobile ? "4/3" : "16/9"}
              elevated
              darken={0.28}
            />
          </div>
          <div style={{ order: vp.isTablet ? 2 : 2 }}>
            <SceneMeta item={item} vp={vp} />
          </div>
        </div>
      </SceneShell>
    );
  }

  if (item.kind === "metrics") {
    return (
      <SceneShell vp={vp} max={1220}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: vp.isTablet
              ? "1fr"
              : "minmax(0, .9fr) minmax(0, 1.1fr)",
            gap: vp.isMobile ? 22 : 32,
            alignItems: "center",
          }}
        >
          <div style={{ order: vp.isTablet ? 2 : 1 }}>
            <SceneMeta item={item} vp={vp} />
          </div>
          <div style={{ order: vp.isTablet ? 1 : 2 }}>
            <ImgPanel
              src={item.src}
              alt={item.alt}
              cap={item.cap}
              onOpen={open}
              vp={vp}
              aspect={vp.isMobile ? "4/3" : "16/9"}
              elevated
              darken={0.30}
            />
          </div>
        </div>
      </SceneShell>
    );
  }

  return (
    <SceneShell vp={vp} max={980}>
      <div style={{ textAlign: "center", marginBottom: vp.isMobile ? 18 : 22 }}>
        <SceneMeta item={item} vp={vp} center />
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <ImgPanel
          src={item.src}
          alt={item.alt}
          cap={item.cap}
          onOpen={open}
          vp={vp}
          aspect={vp.isMobile ? "4/3" : "16/9.1"}
          elevated
          darken={0.26}
        />
      </div>
    </SceneShell>
  );
}

function SContrast({ vp }: { vp: ViewportInfo }) {
  const rows = [
    ["Disconnected tools", "Single private environment"],
    ["Manual re-entry", "Automated data flow"],
    ["Scattered client information", "One-view client record"],
    ["Generic SaaS adapted to fit", "Built to your specifications"],
    ["Subscription dependency", "Permanent ownership"],
    ["Fragmented booking channels", "Unified booking engine"],
    ["Manual event coordination", "Structured charter workflows"],
    ["Slow reconciliation", "Real-time revenue visibility"],
    ["No inquiry pipeline", "Visual status pipeline"],
    ["Vendor-controlled updates", "You own the system"],
  ];

  return (
    <SceneShell vp={vp} max={1020}>
      <L s={{ marginBottom: 24 }} vp={vp}>
        Infrastructure Contrast
      </L>
      <H z={44} s={{ marginBottom: 16, maxWidth: 760 }} vp={vp}>
        The decision is not software versus software.
        <br />
        It is fragmented operation versus owned infrastructure.
      </H>
      <P vp={vp} s={{ marginBottom: vp.isMobile ? 28 : 36, maxWidth: 600 }}>
        The difference shows up in speed, clarity, consistency, and how the
        business is perceived from the outside.
      </P>

      <div
        style={{
          borderTop: `1px solid rgba(160,139,92,.08)`,
          borderBottom: `1px solid rgba(160,139,92,.08)`,
          background: "linear-gradient(180deg, rgba(255,255,255,.01), rgba(255,255,255,.015))",
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
              padding: vp.isMobile ? "14px 0 12px" : "16px 0 14px",
              borderRight: `1px solid rgba(160,139,92,.05)`,
            }}
          >
            <L s={{ color: C.m }} vp={vp}>
              Fragmented
            </L>
          </div>
          <div
            style={{
              padding: vp.isMobile ? "14px 0 12px 14px" : "16px 0 14px 22px",
            }}
          >
            <L s={{ color: C.g }} vp={vp}>
              Unified
            </L>
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
                padding: vp.isMobile ? "14px 10px 14px 0" : "18px 18px 18px 0",
                borderRight: `1px solid rgba(160,139,92,.05)`,
                color: C.m,
                fontFamily: SA,
                fontSize: vp.isNarrow ? 11.5 : vp.isMobile ? 12 : 13.5,
                fontWeight: 300,
                lineHeight: vp.isMobile ? 1.48 : 1.55,
                letterSpacing: ".01em",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "rgba(160,139,92,.16)",
                  flexShrink: 0,
                }}
              />
              <span>{left}</span>
            </div>
            <div
              style={{
                padding: vp.isMobile ? "14px 0 14px 14px" : "18px 0 18px 22px",
                color: C.pa,
                fontFamily: SA,
                fontSize: vp.isNarrow ? 11.5 : vp.isMobile ? 12 : 13.5,
                fontWeight: 300,
                lineHeight: vp.isMobile ? 1.48 : 1.55,
                letterSpacing: ".01em",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: C.g,
                  boxShadow: "0 0 22px rgba(160,139,92,.35)",
                  flexShrink: 0,
                }}
              />
              <span>{right}</span>
            </div>
          </div>
        ))}
      </div>
    </SceneShell>
  );
}

function SPeak({
  open,
  vp,
}: {
  open: (src: string, alt: string) => void;
  vp: ViewportInfo;
}) {
  const items = [
    ["Fully visible calendar movement", "No guessing what the week looks like"],
    ["Repeat-client intelligence", "Premium service gets remembered and reused"],
    ["Add-on revenue clarity", "Upsells stop disappearing into manual work"],
    ["Automated communication", "The business keeps moving without extra labor"],
  ];

  return (
    <SceneShell vp={vp} max={1260}>
      <div style={{ textAlign: "center", marginBottom: vp.isMobile ? 22 : 28 }}>
        <L s={{ marginBottom: 18 }} vp={vp}>
          Six Months Forward
        </L>
        <H z={48} s={{ marginBottom: 14 }} vp={vp}>
          What this business feels like after the infrastructure is live.
        </H>
        <P
          vp={vp}
          s={{
            margin: "0 auto",
            textAlign: "center",
            maxWidth: 640,
          }}
        >
          More booked. More controlled. More premium from the inside — not just
          on the website.
        </P>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: vp.isTablet
            ? "1fr"
            : "minmax(0, 1.08fr) minmax(0, .92fr)",
          gap: vp.isMobile ? 22 : 30,
          alignItems: "stretch",
        }}
      >
        <div>
          <ImgPanel
            src="/demo-assets/03-schedule.png"
            alt="Calico Yacht Charters future-state schedule"
            cap="The operation at full clarity"
            onOpen={open}
            vp={vp}
            aspect={vp.isMobile ? "4/3" : "16/9"}
            elevated
            noBorder
            darken={0.34}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 1,
            background: "rgba(160,139,92,.05)",
            animation: "glowPulse 5s ease-in-out infinite",
          }}
        >
          {items.map(([t, d], i) => (
            <div
              key={i}
              style={{
                background: i === 0 ? "rgba(255,255,255,.02)" : C.ink,
                padding: vp.isMobile ? "20px 18px 22px" : "24px 22px 26px",
              }}
            >
              <div
                style={{
                  fontFamily: SE,
                  fontSize: vp.isNarrow ? 18 : vp.isMobile ? 20 : 22,
                  color: C.cr,
                  lineHeight: 1.15,
                  marginBottom: 10,
                }}
              >
                {t}
              </div>
              <div
                style={{
                  fontFamily: SA,
                  fontSize: vp.isMobile ? 12.3 : 13.2,
                  color: C.sa,
                  lineHeight: 1.72,
                  letterSpacing: ".01em",
                }}
              >
                {d}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}

function SScope({ vp }: { vp: ViewportInfo }) {
  const left = [
    "Custom frontend experience layer",
    "Luxury booking flow",
    "Admin booking control",
    "Vessel & calendar infrastructure",
    "Client intelligence system",
    "Inquiry-to-booking pipeline",
    "Event configuration engine",
  ];

  const right = [
    "Crew & vessel operations layer",
    "Financial visibility layer (QuickBooks-integrated)",
    "Automated communication engine",
    "Admin operations dashboard",
    "Private architecture",
    "Review, refine & launch",
  ];

  return (
    <SceneShell vp={vp} max={980}>
      <L s={{ marginBottom: 24 }} vp={vp}>
        Commissioned Scope
      </L>
      <H z={44} s={{ marginBottom: 16, maxWidth: 760 }} vp={vp}>
        The full infrastructure delivered within the 20-day build window.
      </H>
      <P vp={vp} s={{ marginBottom: vp.isMobile ? 28 : 36, maxWidth: 620 }}>
        This is not an outline. It is the actual system surface being delivered.
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: vp.isMobile
            ? "1fr"
            : "minmax(0,1fr) minmax(0,1fr)",
          gap: vp.isMobile ? 16 : 28,
          marginBottom: vp.isMobile ? 24 : 32,
        }}
      >
        {[left, right].map((col, idx) => (
          <div key={idx}>
            {col.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: vp.isMobile ? "12px 0" : "14px 0",
                  borderBottom: `1px solid rgba(160,139,92,.05)`,
                  fontFamily: SA,
                  fontSize: vp.isNarrow ? 12.5 : vp.isMobile ? 13 : 13.5,
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
        <L s={{ marginBottom: 18 }} vp={vp}>
          Project Terms
        </L>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: vp.isMobile
              ? "1fr"
              : vp.isTablet
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(4, minmax(0, 1fr))",
            gap: vp.isMobile ? 18 : 22,
          }}
        >
          {[
            ["Baseline Investment", "$100,000"],
            ["Initial Authorization", "$20,000"],
            ["Completion Balance", "$80,000"],
            ["Delivery Window", "20 Days"],
          ].map(([k, v], i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: SA,
                  fontSize: vp.isNarrow ? 7 : vp.isMobile ? 7.5 : 8,
                  fontWeight: 500,
                  letterSpacing: vp.isNarrow ? 2 : vp.isMobile ? 2.4 : 3.2,
                  textTransform: "uppercase",
                  color: C.q,
                  marginBottom: 8,
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontFamily: SE,
                  fontSize: vp.isNarrow ? 18 : vp.isMobile ? 20 : 24,
                  fontWeight: 400,
                  color: C.cr,
                  lineHeight: 1.18,
                  wordBreak: "break-word",
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>

        <P
          vp={vp}
          s={{
            marginTop: 22,
            maxWidth: 760,
            fontSize: vp.isNarrow ? 11 : vp.isMobile ? 11.5 : 12,
            color: C.m,
            lineHeight: 1.75,
          }}
        >
          The system can be scaled up or down with pricing adjusted to final
          configuration. Additional intelligence capabilities can be developed
          after the initial build and hosting period.
        </P>
      </div>
    </SceneShell>
  );
}

function SProcess({ vp }: { vp: ViewportInfo }) {
  const items = [
    {
      t: "Current operations stay in place",
      d: "Your current operation remains untouched while the private system is built in parallel.",
    },
    {
      t: "Guided build process",
      d: "Every major layer moves through structure, review, refinement, and approval.",
    },
    {
      t: "Review before final transfer",
      d: "Nothing is forced into place before your team sees and signs off on it.",
    },
    {
      t: "Parallel transition",
      d: "The handoff stays controlled, deliberate, and operationally clean.",
    },
  ];

  return (
    <SceneShell vp={vp} max={980}>
      <L s={{ marginBottom: 24 }} vp={vp}>
        Controlled Process
      </L>
      <H z={44} s={{ marginBottom: 16, maxWidth: 720 }} vp={vp}>
        Build progression remains controlled from first review through final
        transfer.
      </H>
      <P vp={vp} s={{ marginBottom: vp.isMobile ? 28 : 36, maxWidth: 620 }}>
        The objective is not just delivery. It is a clean delivery that does
        not break active operations.
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: vp.isMobile
            ? "1fr"
            : "repeat(2, minmax(0, 1fr))",
          gap: 1,
          background: "rgba(160,139,92,.05)",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: C.ink,
              padding: vp.isMobile ? "22px 18px 24px" : "28px 26px 30px",
              minHeight: vp.isMobile ? undefined : 170,
            }}
          >
            <div
              style={{
                fontFamily: SE,
                fontSize: vp.isNarrow ? 18 : vp.isMobile ? 20 : 22,
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
                fontSize: vp.isNarrow ? 12.5 : vp.isMobile ? 13 : 13.5,
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
    </SceneShell>
  );
}

function SStructural({ vp }: { vp: ViewportInfo }) {
  const items = [
    {
      t: "Operational Maturity",
      d: "Standardized systems signal disciplined management to crew, clients, and stakeholders.",
    },
    {
      t: "Clean Transferability",
      d: "A unified operating layer makes ownership transitions simpler and more attractive.",
    },
    {
      t: "Valuation Clarity",
      d: "Modern infrastructure elevates how the business is assessed, presented, and priced.",
    },
    {
      t: "Permanent Sovereignty",
      d: "No vendor dependency. No subscription fragility. The infrastructure is yours.",
    },
  ];

  return (
    <SceneShell vp={vp} max={980}>
      <L s={{ marginBottom: 24 }} vp={vp}>
        Structural Position
      </L>
      <H z={44} s={{ marginBottom: 16, maxWidth: 760 }} vp={vp}>
        Unified infrastructure is a business asset — not just an operational
        tool.
      </H>
      <P vp={vp} s={{ marginBottom: vp.isMobile ? 28 : 36, maxWidth: 660 }}>
        Clean systems affect daily function, stakeholder perception, transition
        readiness, and how the charter business is valued over time.
      </P>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: vp.isMobile
            ? "1fr"
            : "repeat(2, minmax(0,1fr))",
          gap: 1,
          background: "rgba(160,139,92,.05)",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background:
                !vp.isMobile && i % 2 === 0 ? C.bg : "rgba(255,255,255,.02)",
              padding: vp.isMobile ? "22px 18px 24px" : "30px 26px 34px",
              minHeight: vp.isMobile ? undefined : 144,
            }}
          >
            <div
              style={{
                fontFamily: SE,
                fontSize: vp.isNarrow ? 18 : vp.isMobile ? 20 : 22,
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
                fontSize: vp.isNarrow ? 12.5 : vp.isMobile ? 13 : 13.5,
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
    </SceneShell>
  );
}

function SFinal({
  go,
  vp,
}: {
  go: () => void;
  vp: ViewportInfo;
}) {
  return (
    <SceneShell vp={vp} max={780}>
      <div style={{ textAlign: "center" }}>
        <Ru w={32} s={{ margin: `0 auto ${vp.isMobile ? 28 : 40}px` }} />
        <H z={54} s={{ marginBottom: vp.isMobile ? 16 : 20 }} vp={vp}>
          Commission the build.
        </H>
        <P
          vp={vp}
          s={{
            textAlign: "center",
            margin: `0 auto ${vp.isMobile ? 26 : 34}px`,
            maxWidth: 520,
          }}
        >
          If the direction is right, move into configuration and define the
          exact system surface.
        </P>
        <button
          type="button"
          onClick={go}
          style={{
            ...buttonBase(vp),
            padding: vp.isMobile ? "15px 24px" : "17px 54px",
            minWidth: vp.isMobile ? "100%" : 290,
            maxWidth: vp.isMobile ? 340 : undefined,
            width: vp.isMobile ? "100%" : undefined,
          }}
        >
          Begin Configuration
        </button>
      </div>
    </SceneShell>
  );
}

const SCREENS: ScreenItem[] = [
  {
    num: "01",
    label: "Backend — Command Center",
    title: "The business opens here each day.",
    text: "Today’s activity, pending bookings, upcoming charters, vessel status, and revenue snapshots — visible immediately.",
    src: "/demo-assets/01-dashboard.png",
    alt: "Calico Yacht Charters dashboard screen",
    cap: "Operations Dashboard",
    kind: "hero",
    eyebrow: "Executive visibility first",
    stat: "One surface. Immediate control.",
    kicker: "The system starts with clarity, not guesswork.",
  },
  {
    num: "02",
    label: "Frontend — Booking Experience",
    title: "The client-facing layer feels premium before the yacht even leaves the dock.",
    text: "Vessel selection, date, duration, charter type, guest count, and add-ons presented in a clean luxury flow built to convert.",
    src: "/demo-assets/10-frontend-booking.png",
    alt: "Calico Yacht Charters frontend booking screen",
    cap: "Frontend Booking Flow",
    kind: "overlay",
    eyebrow: "Sell the experience earlier",
    stat: "Premium in. Premium out.",
  },
  {
    num: "03",
    label: "Backend — Financial Layer",
    title: "Revenue is visible while the business is moving.",
    text: "Deposits, balances, add-ons, transaction notes, and QuickBooks-integrated accounting stay connected to the actual charter workflow.",
    src: "/demo-assets/08-revenue.png",
    alt: "Calico Yacht Charters revenue screen",
    cap: "Revenue & QuickBooks",
    kind: "metrics",
    eyebrow: "Money should not be a cleanup process",
    stat: "Real-time financial visibility",
  },
  {
    num: "04",
    label: "Backend — Booking Engine",
    title: "Every charter lives inside one controlled pipeline.",
    text: "Inquiry to completion, with status, vessel assignment, deposit state, crew allocation, and special requests surfaced in one view.",
    src: "/demo-assets/02-bookings.png",
    alt: "Calico Yacht Charters bookings screen",
    cap: "Bookings Pipeline",
    kind: "split",
    eyebrow: "No lost leads. No scattered threads.",
  },
  {
    num: "05",
    label: "Backend — Scheduling Layer",
    title: "The week stops living in separate calendars, calls, and memory.",
    text: "Day, week, and month views with vessel logic, buffer windows, crew placement, and charter timing all visible at once.",
    src: "/demo-assets/03-schedule.png",
    alt: "Calico Yacht Charters schedule screen",
    cap: "Schedule",
    kind: "stacked",
    eyebrow: "Operational movement, not calendar clutter",
  },
  {
    num: "06",
    label: "Backend — Client Intelligence",
    title: "One client. One record. One deeper memory of the relationship.",
    text: "Contact data, booking history, preferences, spend, event type, communication log, and referral source stay attached to the client — not hidden across tools.",
    src: "/demo-assets/04-clients.png",
    alt: "Calico Yacht Charters clients screen",
    cap: "Client Profiles",
    kind: "split",
    eyebrow: "Premium service becomes repeatable",
  },
  {
    num: "07",
    label: "Backend — Client Detail",
    title: "Repeat business gets smarter with every charter.",
    text: "Timeline, notes, booking history, financial context, and preference data deepen the relationship instead of resetting it each time.",
    src: "/demo-assets/05-client-detail.png",
    alt: "Calico Yacht Charters client detail screen",
    cap: "Client Detail",
    kind: "overlay",
    eyebrow: "The record becomes operationally useful",
  },
  {
    num: "08",
    label: "Backend — Event Configuration",
    title: "Every charter type carries its own execution logic.",
    text: "Proposals, birthdays, sunset cruises, Catalina trips, and private events all move with structured setup instead of last-minute improvisation.",
    src: "/demo-assets/06-charter-setup.png",
    alt: "Calico Yacht Charters event configuration screen",
    cap: "Charter Configuration",
    kind: "split",
    eyebrow: "Consistency under pressure",
  },
  {
    num: "09",
    label: "Backend — Vessel & Crew Operations",
    title: "The physical business runs with the same precision as the digital one.",
    text: "Captain assignment, crew scheduling, availability, turnaround buffers, maintenance blocks, and dock instructions stay connected.",
    src: "/demo-assets/07-fleet-ops.png",
    alt: "Calico Yacht Charters fleet operations screen",
    cap: "Fleet Operations",
    kind: "metrics",
    eyebrow: "Real operational control",
    stat: "Crew + vessel precision",
  },
  {
    num: "10",
    label: "Backend — Reporting",
    title: "Performance becomes visible enough to act on.",
    text: "Revenue by vessel, charter type, month, balances, conversion rates, and repeat-client metrics make the operation measurable.",
    src: "/demo-assets/09-reports.png",
    alt: "Calico Yacht Charters reports screen",
    cap: "Executive Reports",
    kind: "stacked",
    eyebrow: "Self-awareness at the business level",
  },
  {
    num: "11",
    label: "Frontend — Brand Experience",
    title: "The presentation layer earns trust before the sales conversation begins.",
    text: "Mobile-first performance, visual storytelling, clear vessel choice, trust signals, and a direct path into booking.",
    src: "/demo-assets/11-frontend-brand.png",
    alt: "Calico Yacht Charters frontend brand experience screen",
    cap: "Frontend Brand Layer",
    kind: "hero",
    eyebrow: "Perceived value rises immediately",
    stat: "Luxury presentation with direct conversion logic",
  },
  {
    num: "12",
    label: "Backend — Communications",
    title: "The business keeps moving even when nobody is manually chasing details.",
    text: "Inquiry acknowledgment, quote follow-up, deposit confirmation, reminders, pre-charter instructions, review requests, and repeat-booking prompts — automated and branded.",
    src: "/demo-assets/12-comms.png",
    alt: "Calico Yacht Charters communications screen",
    cap: "Communication Engine",
    kind: "overlay",
    eyebrow: "Automation where the drag usually lives",
    stat: "Precision without extra labor",
  },
];

export default function Page() {
  const vp = useViewport();

  const [mode, setMode] = useState<"gate" | "walk" | "intake" | "done">(
    "gate"
  );
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
      r: () => <SThresh open={openLightbox} vp={vp} />,
    });

    r.push({
      id: "gap",
      r: () => <SGap open={openLightbox} vp={vp} />,
    });

    r.push({
      id: "reveal",
      r: () => <SReveal vp={vp} />,
    });

    SCREENS.forEach((item) =>
      r.push({
        id: `screen-${item.num}`,
        r: () => <SScreen item={item} open={openLightbox} vp={vp} />,
      })
    );

    r.push({
      id: "peak",
      r: () => <SPeak open={openLightbox} vp={vp} />,
    });

    r.push({
      id: "contrast",
      r: () => <SContrast vp={vp} />,
    });

    r.push({
      id: "scope",
      r: () => <SScope vp={vp} />,
    });

    r.push({
      id: "process",
      r: () => <SProcess vp={vp} />,
    });

    r.push({
      id: "structural",
      r: () => <SStructural vp={vp} />,
    });

    r.push({
      id: "final",
      r: () => (
        <SFinal
          vp={vp}
          go={() => {
            setMode("intake");
            setIs(1);
          }}
        />
      ),
    });

    return r;
  }, [openLightbox, vp]);

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
      source: "calicoyacht-private-walkthrough",
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
          padding: vp.isMobile ? "20px" : "24px",
        }}
      >
        <style>{CSS}</style>
        <div
          style={{
            textAlign: "center",
            animation: "si 1s cubic-bezier(.16,1,.3,1) both",
            maxWidth: 360,
            padding: vp.isMobile ? "0 8px" : "0 28px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontFamily: SE,
              fontSize: vp.isMobile ? 20 : 22,
              color: C.cr,
              letterSpacing: "-.01em",
              marginBottom: 4,
            }}
          >
            Calico Yacht Charters
          </div>
          <div
            style={{
              fontFamily: SA,
              fontSize: vp.isMobile ? 8.5 : 9,
              fontWeight: 500,
              letterSpacing: vp.isMobile ? 3.4 : 4,
              color: C.w,
              textTransform: "uppercase",
              marginBottom: vp.isMobile ? 34 : 48,
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
              fontSize: vp.isMobile ? 14 : 13,
              fontWeight: 300,
              color: C.cr,
              letterSpacing: vp.isMobile ? 2.1 : 2.5,
              textAlign: "center",
              background: "transparent",
              width: "100%",
              border: "none",
              borderBottom: `1px solid ${
                ce ? C.er : "rgba(160,139,92,.15)"
              }`,
              padding: vp.isMobile ? "14px 0" : "12px 0",
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
            style={{
              ...buttonBase(vp),
              marginTop: 18,
              padding: vp.isMobile ? "13px 28px" : "13px 44px",
              fontSize: vp.isMobile ? 8.5 : 9,
              width: vp.isMobile ? "100%" : undefined,
            }}
          >
            Enter
          </button>
          <div
            style={{
              marginTop: vp.isMobile ? 42 : 56,
              fontFamily: SA,
              fontSize: 7.5,
              letterSpacing: vp.isMobile ? 2.8 : 3.5,
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
          padding: vp.isMobile ? "20px" : "24px",
        }}
      >
        <style>{CSS}</style>
        <div
          style={{
            textAlign: "center",
            animation: "si 1s cubic-bezier(.16,1,.3,1) both",
            maxWidth: 460,
            padding: vp.isMobile ? "0 6px" : "0 28px",
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
          <L s={{ marginBottom: 14 }} vp={vp}>
            Configuration Received
          </L>
          <h1
            style={{
              fontFamily: SE,
              fontSize: vp.isMobile ? 26 : 30,
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
                    fontSize: vp.isMobile ? 12 : 12.5,
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
              marginTop: vp.isMobile ? 48 : 64,
              fontFamily: SA,
              fontSize: 7.5,
              letterSpacing: vp.isMobile ? 2.4 : 3,
              color: "rgba(106,102,95,.22)",
              textTransform: "uppercase",
            }}
          >
            Calico Yacht Charters
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
            style={{
              maxWidth: 500,
              width: "100%",
              padding: vp.isMobile ? "30px 18px 82px" : "64px 28px 100px",
            }}
          >
            <L
              s={{
                textAlign: "center",
                marginBottom: vp.isMobile ? 28 : 40,
                letterSpacing: vp.isMobile ? 4 : 5,
              }}
              vp={vp}
            >
              Build Configuration
            </L>

            <div
              style={{
                display: "flex",
                gap: 3,
                marginBottom: vp.isMobile ? 28 : 44,
              }}
            >
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
                  fontSize: vp.isMobile ? 8 : 8.5,
                  color: C.w,
                  letterSpacing: vp.isMobile ? 1.6 : 2,
                  textTransform: "uppercase",
                  marginBottom: 7,
                }}
              >
                {is} — {IT}
              </div>

              {is === 1 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }} vp={vp}>
                    Company Identity
                  </H>
                  <P
                    vp={vp}
                    s={{
                      marginBottom: 24,
                      fontSize: vp.isMobile ? 11 : 11.5,
                      color: C.m,
                    }}
                  >
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
                      vp={vp}
                      label="Company Name"
                      ph="Calico Yacht Charters"
                      value={fd.pn}
                      onChange={(e) => u("pn", e.target.value)}
                    />
                    <Fi
                      vp={vp}
                      label="Primary Contact"
                      ph="Full name"
                      value={fd.cn}
                      onChange={(e) => u("cn", e.target.value)}
                    />
                    <Fi
                      vp={vp}
                      label="Email"
                      ph="you@calicoyacht.com"
                      type="email"
                      value={fd.em}
                      onChange={(e) => u("em", e.target.value)}
                    />
                    <Fi
                      vp={vp}
                      label="Phone"
                      ph="(310) 000-0000"
                      type="tel"
                      value={fd.ph}
                      onChange={(e) => u("ph", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 2 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }} vp={vp}>
                    Fleet & Charter Types
                  </H>
                  <P
                    vp={vp}
                    s={{
                      marginBottom: 24,
                      fontSize: vp.isMobile ? 11 : 11.5,
                      color: C.m,
                    }}
                  >
                    Vessel and experience structure.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Ch
                      vp={vp}
                      label="Charter Types Offered"
                      opts={[
                        "Harbor Cruises",
                        "Sunset Cruises",
                        "Proposals",
                        "Birthdays & Events",
                        "Whale Watching",
                        "Malibu Voyages",
                        "Catalina Day Trips",
                        "Ash Scatterings",
                        "Corporate Events",
                      ]}
                      sel={fd.cd}
                      tog={(v) => t("cd", v)}
                    />
                    <Ch
                      vp={vp}
                      label="Vessel Count"
                      opts={[
                        "1 Vessel",
                        "2 Vessels",
                        "3+ Vessels",
                        "Fleet Expansion Planned",
                      ]}
                      sel={fd.vs}
                      tog={(v) => t("vs", v)}
                    />
                    <Fi
                      vp={vp}
                      label="Fleet Notes"
                      ph="Vessel details, capacities, naming..."
                      ta
                      value={fd.bn}
                      onChange={(e) => u("bn", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 3 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }} vp={vp}>
                    Frontend Experience
                  </H>
                  <P
                    vp={vp}
                    s={{
                      marginBottom: 24,
                      fontSize: vp.isMobile ? 11 : 11.5,
                      color: C.m,
                    }}
                  >
                    Client-facing booking layer.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Ch
                      vp={vp}
                      label="Booking Style"
                      opts={[
                        "Direct Booking",
                        "Inquiry-First",
                        "Hybrid (Direct + Inquiry)",
                        "Quote Request",
                      ]}
                      sel={fd.fp}
                      tog={(v) => t("fp", v)}
                    />
                    <Ch
                      vp={vp}
                      label="Frontend Priorities"
                      opts={[
                        "Luxury Aesthetic",
                        "Mobile-First",
                        "Fast Booking Flow",
                        "Visual Storytelling",
                        "Trust & Reviews",
                        "Experience Showcase",
                      ]}
                      sel={fd.bp}
                      tog={(v) => t("bp", v)}
                    />
                    <Fi
                      vp={vp}
                      label="Notes"
                      ph="Specific frontend requirements..."
                      ta
                      value={fd.fn}
                      onChange={(e) => u("fn", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 4 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }} vp={vp}>
                    Backend Operations
                  </H>
                  <P
                    vp={vp}
                    s={{
                      marginBottom: 24,
                      fontSize: vp.isMobile ? 11 : 11.5,
                      color: C.m,
                    }}
                  >
                    Operator-facing depth.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Ch
                      vp={vp}
                      label="Operations Priorities"
                      opts={[
                        "Bookings Pipeline",
                        "Client Profiles",
                        "Crew Scheduling",
                        "Vessel Management",
                        "Event Checklists",
                        "Revenue Tracking",
                        "Communications",
                        "Reporting",
                      ]}
                      sel={fd.ap}
                      tog={(v) => t("ap", v)}
                    />
                    <Fi
                      vp={vp}
                      label="Notes"
                      ph="Workflow details, operational specifics..."
                      ta
                      value={fd.bnn}
                      onChange={(e) => u("bnn", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 5 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }} vp={vp}>
                    Add-Ons & Enhancements
                  </H>
                  <P
                    vp={vp}
                    s={{
                      marginBottom: 24,
                      fontSize: vp.isMobile ? 11 : 11.5,
                      color: C.m,
                    }}
                  >
                    Revenue-expanding capabilities.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Ch
                      vp={vp}
                      label="Client Add-Ons to Manage"
                      opts={[
                        "Stewardess Service",
                        "Food & Beverage",
                        "Decorations",
                        "Photography",
                        "DJ / Music",
                        "Swimming Equipment",
                        "Special Routes",
                        "Event Planning",
                      ]}
                      sel={fd.fp}
                      tog={(v) => t("fp", v)}
                    />
                    <Fi
                      vp={vp}
                      label="Notes"
                      ph="Custom add-ons, vendor coordination..."
                      ta
                      value={fd.an}
                      onChange={(e) => u("an", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 6 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }} vp={vp}>
                    Financial & Integrations
                  </H>
                  <P
                    vp={vp}
                    s={{
                      marginBottom: 24,
                      fontSize: vp.isMobile ? 11 : 11.5,
                      color: C.m,
                    }}
                  >
                    Revenue infrastructure and accounting.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Ch
                      vp={vp}
                      label="Financial Tracking"
                      opts={[
                        "Deposit Tracking",
                        "Balance Due Alerts",
                        "Revenue by Vessel",
                        "Revenue by Charter Type",
                        "Add-On Revenue",
                        "Refund / Cancellation Tracking",
                      ]}
                      sel={fd.bp}
                      tog={(v) => t("bp", v)}
                    />
                    <Ch
                      vp={vp}
                      label="Integrations"
                      opts={[
                        "QuickBooks Integration",
                        "Payment Gateway",
                        "Calendar Sync",
                        "Review Automation",
                      ]}
                      sel={fd.cd}
                      tog={(v) => t("cd", v)}
                    />
                    <Fi
                      vp={vp}
                      label="Notes"
                      ph="Current accounting setup, payment methods accepted..."
                      ta
                      value={fd.pa}
                      onChange={(e) => u("pa", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 7 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }} vp={vp}>
                    Final Notes
                  </H>
                  <P
                    vp={vp}
                    s={{
                      marginBottom: 18,
                      fontSize: vp.isMobile ? 11 : 11.5,
                      color: C.m,
                    }}
                  >
                    Anything additional.
                  </P>
                  <P
                    vp={vp}
                    s={{
                      marginBottom: 24,
                      fontSize: vp.isNarrow ? 11 : vp.isMobile ? 11.5 : 12,
                      color: C.q,
                      lineHeight: 1.75,
                      fontStyle: "italic",
                    }}
                  >
                    If you have a specific budget in mind, complete the build as
                    usual and include your target budget below. We will tailor
                    the system accordingly — features can be added, removed, or
                    scaled to match.
                  </P>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Fi
                      vp={vp}
                      label="Custom Requests"
                      ph="Features, specific workflows, vendor integrations..."
                      ta
                      value={fd.cu}
                      onChange={(e) => u("cu", e.target.value)}
                    />
                    <Fi
                      vp={vp}
                      label="Target Budget (Optional)"
                      ph="If different from baseline, include target here..."
                      ta
                      value={fd.sp}
                      onChange={(e) => u("sp", e.target.value)}
                    />
                    <Fi
                      vp={vp}
                      label="Anything Else"
                      ph="Final notes, timelines, special requirements..."
                      ta
                      value={fd.ad}
                      onChange={(e) => u("ad", e.target.value)}
                    />
                  </div>
                </>
              )}

              {is === 8 && (
                <>
                  <H z={24} s={{ marginBottom: 5 }} vp={vp}>
                    Acknowledgment
                  </H>
                  <P
                    vp={vp}
                    s={{
                      marginBottom: 24,
                      fontSize: vp.isMobile ? 11 : 11.5,
                      color: C.m,
                    }}
                  >
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
                      "$100,000 baseline — $20,000 to authorize — $80,000 upon completion — 20-day delivery.",
                      "System can be scaled up or down. Pricing adjusts based on final build configuration.",
                    ].map((x, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "baseline",
                        }}
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
                            fontSize: vp.isMobile ? 11 : 11.5,
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
                gap: 12,
                marginTop: 40,
                flexWrap: vp.isMobile ? "wrap" : "nowrap",
              }}
            >
              {is > 1 ? (
                <button
                  type="button"
                  onClick={() => setIs((s) => Math.max(s - 1, 1))}
                  style={{
                    ...buttonBase(vp),
                    padding: vp.isMobile ? "12px 18px" : "11px 26px",
                    fontSize: 8.5,
                    width: vp.isMobile ? "calc(50% - 6px)" : undefined,
                    minWidth: vp.isMobile ? undefined : 110,
                  }}
                  disabled={submitting}
                >
                  Back
                </button>
              ) : (
                <div
                  style={
                    vp.isMobile ? { width: "calc(50% - 6px)" } : undefined
                  }
                />
              )}

              {is < IT ? (
                <button
                  type="button"
                  onClick={() => setIs((s) => Math.min(s + 1, IT))}
                  style={{
                    ...solidButton(vp),
                    padding: vp.isMobile ? "12px 18px" : "11px 26px",
                    fontSize: 8.5,
                    width: vp.isMobile ? "calc(50% - 6px)" : undefined,
                    minWidth: vp.isMobile ? undefined : 110,
                    marginLeft: vp.isMobile ? "auto" : undefined,
                  }}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={sub}
                  style={{
                    ...solidButton(vp),
                    padding: vp.isMobile ? "12px 18px" : "11px 26px",
                    fontSize: 8.5,
                    opacity: submitting ? 0.7 : 1,
                    width: vp.isMobile ? "calc(50% - 6px)" : undefined,
                    minWidth: vp.isMobile ? undefined : 110,
                    marginLeft: vp.isMobile ? "auto" : undefined,
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
        vp={vp}
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
          gap: vp.isMobile ? 10 : 16,
          padding: vp.isMobile ? "16px 16px 0" : "24px 36px 0",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: SA,
            fontSize: vp.isMobile ? 7.5 : 8,
            fontWeight: 500,
            letterSpacing: vp.isMobile ? 2.6 : 4,
            color: C.w,
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          Calico Yacht Charters
        </div>

        <div
          style={{
            display: "flex",
            gap: vp.isMobile ? 2 : 3,
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === sl ? (vp.isMobile ? 10 : 14) : 3,
                height: 1.5,
                borderRadius: 1,
                background:
                  i === sl
                    ? C.g
                    : i < sl
                    ? "rgba(160,139,92,.16)"
                    : "rgba(160,139,92,.05)",
                transition: "all .4s cubic-bezier(.16,1,.3,1)",
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontFamily: SA,
            fontSize: vp.isMobile ? 7.5 : 8,
            fontWeight: 400,
            letterSpacing: vp.isMobile ? 2.2 : 3,
            color: C.w,
            textTransform: "uppercase",
            minWidth: vp.isMobile ? 42 : 48,
            textAlign: "right",
            flexShrink: 0,
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
          alignItems: vp.isMobile ? "flex-start" : "center",
          justifyContent: "center",
          padding: vp.isMobile ? "14px 16px 0" : "32px 44px 0",
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
            WebkitOverflowScrolling: "touch",
            animation: "sli .65s cubic-bezier(.16,1,.3,1) both",
            padding: vp.isMobile ? "0 0 26px" : "0 0 32px",
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
          gap: 12,
          padding: vp.isMobile ? "0 16px 16px" : "0 36px 28px",
          flexShrink: 0,
        }}
      >
        {sl > 0 ? (
          <button
            type="button"
            onClick={() => go(sl - 1)}
            style={{
              ...buttonBase(vp),
              padding: vp.isMobile ? "12px 18px" : "11px 28px",
              fontSize: 8.5,
              opacity: 0.65,
              width: vp.isMobile ? "calc(50% - 6px)" : undefined,
              minWidth: vp.isMobile ? undefined : 90,
            }}
          >
            Back
          </button>
        ) : (
          <div
            style={vp.isMobile ? { width: "calc(50% - 6px)" } : { width: 90 }}
          />
        )}

        {sl < tot - 1 ? (
          <button
            type="button"
            onClick={() => go(sl + 1)}
            style={{
              ...buttonBase(vp),
              padding: vp.isMobile ? "12px 18px" : "11px 28px",
              fontSize: 8.5,
              width: vp.isMobile ? "calc(50% - 6px)" : undefined,
              minWidth: vp.isMobile ? undefined : 90,
              marginLeft: vp.isMobile ? "auto" : undefined,
            }}
          >
            Continue
          </button>
        ) : (
          <div
            style={vp.isMobile ? { width: "calc(50% - 6px)" } : { width: 90 }}
          />
        )}
      </div>
    </div>
  );
}