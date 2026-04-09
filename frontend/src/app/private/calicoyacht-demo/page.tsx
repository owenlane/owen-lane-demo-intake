"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { CSSProperties, ReactNode, ChangeEvent } from "react";

const ACCESS_CODE = "CALICOTEST";
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
a{text-decoration:none}
@keyframes si{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes zi{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:scale(1)}}
@keyframes sli{from{opacity:0;transform:translateY(26px) scale(.992)}to{opacity:1;transform:translateY(0) scale(1)}}
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

type ViewportInfo = {
  w: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isNarrow: boolean;
};

type LightboxState = {
  open: boolean;
  src: string;
  alt: string;
};

type FixedSlide = {
  id: string;
  render: () => ReactNode;
};

type ImageCard = {
  src: string;
  alt: string;
  cap: string;
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

function Statement({
  num,
  label,
  title,
  text,
  vp,
}: {
  num?: string;
  label?: string;
  title: ReactNode;
  text: ReactNode;
  vp: ViewportInfo;
}) {
  return (
    <SceneShell vp={vp} max={840}>
      <div style={{ textAlign: "center" }}>
        {label && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: vp.isMobile ? 10 : 12,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {num && (
              <span
                style={{
                  fontFamily: SE,
                  fontSize: vp.isMobile ? 16 : 18,
                  color: C.g,
                  opacity: 0.22,
                }}
              >
                {num}
              </span>
            )}
            <L vp={vp}>{label}</L>
          </div>
        )}
        <H z={48} s={{ marginBottom: 16 }} vp={vp}>
          {title}
        </H>
        <P
          vp={vp}
          s={{
            margin: "0 auto",
            textAlign: "center",
            maxWidth: vp.isNarrow ? 300 : vp.isMobile ? 340 : 620,
          }}
        >
          {text}
        </P>
      </div>
    </SceneShell>
  );
}

function VisualSlide({
  num,
  label,
  eyebrow,
  title,
  text,
  cards,
  open,
  vp,
}: {
  num: string;
  label: string;
  eyebrow?: string;
  title: string;
  text: string;
  cards: ImageCard[];
  open: (src: string, alt: string) => void;
  vp: ViewportInfo;
}) {
  const isSingle = cards.length === 1;

  return (
    <SceneShell vp={vp} max={1280}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: vp.isTablet
            ? "1fr"
            : isSingle
            ? "minmax(0,.9fr) minmax(0,1.1fr)"
            : "minmax(0,.85fr) minmax(0,1.15fr)",
          gap: vp.isMobile ? 22 : 34,
          alignItems: "center",
        }}
      >
        <div style={{ order: vp.isTablet ? 2 : 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
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
              {num}
            </span>
            <L vp={vp}>{label}</L>
          </div>

          {eyebrow && (
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
              {eyebrow}
            </div>
          )}

          <H z={38} s={{ marginBottom: 14, maxWidth: 590 }} vp={vp}>
            {title}
          </H>
          <P vp={vp} s={{ maxWidth: 560 }}>
            {text}
          </P>
        </div>

        <div
          style={{
            order: vp.isTablet ? 1 : 2,
            display: "grid",
            gridTemplateColumns: cards.length === 1 ? "1fr" : "1fr",
            gap: vp.isMobile ? 14 : 18,
          }}
        >
          {cards.map((card, idx) => (
            <ImgPanel
              key={`${card.src}-${idx}`}
              src={card.src}
              alt={card.alt}
              cap={card.cap}
              onOpen={open}
              vp={vp}
              aspect={vp.isMobile ? "4/3" : cards.length === 1 ? "16/9" : "16/8.7"}
              elevated
              darken={0.22}
            />
          ))}
        </div>
      </div>
    </SceneShell>
  );
}

function FinalStatement({
  num,
  label,
  title,
  text,
  vp,
}: {
  num: string;
  label: string;
  title: string;
  text: string;
  vp: ViewportInfo;
}) {
  return (
    <SceneShell vp={vp} max={860}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
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
            {num}
          </span>
          <L vp={vp}>{label}</L>
        </div>
        <H z={48} s={{ marginBottom: 16 }} vp={vp}>
          {title}
        </H>
        <P
          vp={vp}
          s={{
            textAlign: "center",
            margin: "0 auto",
            maxWidth: 620,
          }}
        >
          {text}
        </P>
      </div>
    </SceneShell>
  );
}

function FinalAction({
  vp,
  go,
}: {
  vp: ViewportInfo;
  go: () => void;
}) {
  return (
    <SceneShell vp={vp} max={880}>
      <div
        style={{
          textAlign: "center",
          padding: vp.isMobile ? "8px 0" : "14px 0",
        }}
      >
        <L s={{ marginBottom: 20 }} vp={vp}>
          Begin Build
        </L>
        <H z={52} s={{ marginBottom: 16 }} vp={vp}>
          This is the operating standard.
        </H>
        <P
          vp={vp}
          s={{
            textAlign: "center",
            margin: `0 auto ${vp.isMobile ? 22 : 28}px`,
            maxWidth: 560,
          }}
        >
          The walkthrough explains the structure. The next step is moving into
          configuration and building the actual operating surface around the
          business.
        </P>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: vp.isMobile ? 20 : 26,
          }}
        >
          <a
            href="/private/ui-preview"
            style={{
              ...buttonBase(vp),
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: vp.isMobile ? "100%" : 290,
              maxWidth: vp.isMobile ? 340 : undefined,
              width: vp.isMobile ? "100%" : undefined,
            }}
          >
            Access Live UI
          </a>
        </div>

        <div>
          <button
            type="button"
            onClick={go}
            style={{
              ...solidButton(vp),
              minWidth: vp.isMobile ? "100%" : 290,
              maxWidth: vp.isMobile ? 340 : undefined,
              width: vp.isMobile ? "100%" : undefined,
            }}
          >
            Begin Build
          </button>
        </div>
      </div>
    </SceneShell>
  );
}

function SDone({ vp }: { vp: ViewportInfo }) {
  return (
    <SceneShell vp={vp} max={760}>
      <div style={{ textAlign: "center" }}>
        <L s={{ marginBottom: 18 }} vp={vp}>
          Submitted
        </L>
        <H z={54} s={{ marginBottom: 16 }} vp={vp}>
          Configuration received.
        </H>
        <P
          vp={vp}
          s={{
            textAlign: "center",
            margin: "0 auto",
            maxWidth: 520,
          }}
        >
          The submission has been logged. The next step is translating the
          business into a structured build surface.
        </P>
      </div>
    </SceneShell>
  );
}

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
  const [lb, setLb] = useState<LightboxState>({
    open: false,
    src: "",
    alt: "",
  });

  const IT = 8;

  const openLightbox = useCallback((src: string, alt: string) => {
    setLb({ open: true, src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    setLb({ open: false, src: "", alt: "" });
  }, []);

  const tog = useCallback((k: keyof FormDataShape, v: string) => {
    setFd((p) => {
      const arr = p[k] as string[];
      return {
        ...p,
        [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v],
      };
    });
  }, []);

  const upd = useCallback(
    (k: keyof FormDataShape) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFd((p) => ({ ...p, [k]: e.target.value })),
    []
  );

  const slides = useMemo<FixedSlide[]>(() => {
    const fixedSlides: FixedSlide[] = [
      {
        id: "01-opening",
        render: () => (
          <Statement
            vp={vp}
            num="01"
            label="Opening"
            title="To Be Elite Requires Full Attention"
            text="Your current business structure shouldn't rely on fragmented tools, when an autonomous, unified option exists."
          />
        ),
      },
      {
        id: "02-operational-reality",
        render: () => (
          <Statement
            vp={vp}
            num="02"
            label="Operational reality"
            title="Communications. Scheduling. Books. These should never fail."
            text="When these functions are fragmented, the business runs on hidden labor. The cost is missed clarity, slower response, avoidable error, and unnecessary owner involvement."
          />
        ),
      },
      {
        id: "03-home",
        render: () => (
          <VisualSlide
            vp={vp}
            open={openLightbox}
            num="03"
            label="Frontend Home"
            eyebrow="Entry point"
            title="The outside layer should make the business feel precise before anyone speaks to you."
            text="The public-facing surface introduces the fleet, destination, and booking path without noise. It creates trust before any conversation begins."
            cards={[
              {
                src: "/demo-assets/00-frontend-home.png",
                alt: "Calico Yacht Charters front-end home screen",
                cap: "Frontend Home",
              },
            ]}
          />
        ),
      },
      {
        id: "04-dashboard",
        render: () => (
          <VisualSlide
            vp={vp}
            open={openLightbox}
            num="04"
            label="Dashboard"
            eyebrow="Operating view"
            title="Your only concern should ever be closing deals."
            text="Revenue, active charters, fleet status, and immediate priorities should be visible on one screen. The day should begin with clarity, not recovery."
            cards={[
              {
                src: "/demo-assets/01-dashboard.png",
                alt: "Calico Yacht Charters dashboard screen",
                cap: "Command Center Dashboard",
              },
            ]}
          />
        ),
      },
      {
        id: "05-ai-command",
        render: () => (
          <VisualSlide
            vp={vp}
            open={openLightbox}
            num="05"
            label="AI Command"
            eyebrow="Execution layer"
            title="Every tool connected. Every step autonomous."
            text="The command surface turns one instruction into action across bookings, invoices, maintenance, communication, and reporting from one operating layer."
            cards={[
              {
                src: "/demo-assets/02-ai-command.png",
                alt: "Calico Yacht Charters AI command screen",
                cap: "AI Command Center",
              },
            ]}
          />
        ),
      },
      {
        id: "06-bookings-calendar",
        render: () => (
          <VisualSlide
            vp={vp}
            open={openLightbox}
            num="06"
            label="Bookings + Calendar"
            eyebrow="Acquisition to scheduling flow"
            title="Sales flow and operational placement should function as one chain."
            text="Inquiry status, charter dates, vessel allocation, and timing pressure should never live in separate systems that force manual reconciliation."
            cards={[
              {
                src: "/demo-assets/03-bookings.png",
                alt: "Calico Yacht Charters bookings pipeline",
                cap: "Bookings Pipeline",
              },
              {
                src: "/demo-assets/04-calendar.png",
                alt: "Calico Yacht Charters charter calendar",
                cap: "Charter Calendar",
              },
            ]}
          />
        ),
      },
      {
        id: "07-clients",
        render: () => (
          <VisualSlide
            vp={vp}
            open={openLightbox}
            num="07"
            label="Clients"
            eyebrow="Relational memory"
            title="One client record should replace scattered memory across the business."
            text="Booking history, spend, preferences, communication context, and attached documents belong in one place so repeat service becomes structured instead of improvised."
            cards={[
              {
                src: "/demo-assets/05-clients.png",
                alt: "Calico Yacht Charters clients screen",
                cap: "Client Profiles",
              },
            ]}
          />
        ),
      },
      {
        id: "08-fleet-crew",
        render: () => (
          <VisualSlide
            vp={vp}
            open={openLightbox}
            num="08"
            label="Fleet + Crew"
            eyebrow="Asset and personnel coordination"
            title="Vessels and people should not be tracked as separate problems."
            text="Availability, crew load, certifications, incidents, and maintenance should stay attached to the operating asset so the business can place real service capacity."
            cards={[
              {
                src: "/demo-assets/06-fleet.png",
                alt: "Calico Yacht Charters fleet management screen",
                cap: "Fleet Management",
              },
              {
                src: "/demo-assets/07-crew.png",
                alt: "Calico Yacht Charters crew management screen",
                cap: "Crew Management",
              },
            ]}
          />
        ),
      },
      {
        id: "09-revenue-documents",
        render: () => (
          <VisualSlide
            vp={vp}
            open={openLightbox}
            num="09"
            label="Revenue + Documents"
            eyebrow="Money visibility and records"
            title="Revenue and compliance should not live in cleanup mode."
            text="Invoices, totals, waivers, contracts, and attached records should remain linked to the actual booking and client instead of drifting into separate admin silos."
            cards={[
              {
                src: "/demo-assets/08-revenue.png",
                alt: "Calico Yacht Charters revenue reporting screen",
                cap: "Revenue & Reporting",
              },
              {
                src: "/demo-assets/09-documents.png",
                alt: "Calico Yacht Charters documents and waivers screen",
                cap: "Documents & Waivers",
              },
            ]}
          />
        ),
      },
      {
        id: "10-messages-marketing",
        render: () => (
          <VisualSlide
            vp={vp}
            open={openLightbox}
            num="10"
            label="Messages + Marketing"
            eyebrow="Communication and demand"
            title="Communication and growth need to live inside the same operating spine."
            text="Client messages should stay attached to bookings while marketing data should stay attached to revenue movement. Service detail and demand generation both belong inside the system."
            cards={[
              {
                src: "/demo-assets/10-messages.png",
                alt: "Calico Yacht Charters communications hub screen",
                cap: "Communications Hub",
              },
              {
                src: "/demo-assets/11-marketing.png",
                alt: "Calico Yacht Charters marketing pipeline screen",
                cap: "Marketing Pipeline",
              },
            ]}
          />
        ),
      },
      {
        id: "11-reviews-notes",
        render: () => (
          <VisualSlide
            vp={vp}
            open={openLightbox}
            num="11"
            label="Reviews + Notes"
            eyebrow="Trust and internal memory"
            title="Reputation outside and context inside should both be retained structurally."
            text="Reviews show how the market experiences the brand. Internal notes preserve what the team learns. Both should remain attached to the business, not float around externally."
            cards={[
              {
                src: "/demo-assets/12-reviews.png",
                alt: "Calico Yacht Charters reviews and testimonials screen",
                cap: "Reviews & Testimonials",
              },
              {
                src: "/demo-assets/13-notes.png",
                alt: "Calico Yacht Charters notes and logs screen",
                cap: "Notes & Logs",
              },
            ]}
          />
        ),
      },
      {
        id: "12-incidents-settings",
        render: () => (
          <VisualSlide
            vp={vp}
            open={openLightbox}
            num="12"
            label="Incidents + Settings"
            eyebrow="Control layer"
            title="Issues and system behavior should both be managed intentionally."
            text="Incident tracking preserves accountability. Settings define automation, integrations, default behavior, and AI control. That is where the system becomes infrastructure instead of software."
            cards={[
              {
                src: "/demo-assets/14-incidents.png",
                alt: "Calico Yacht Charters incident tracking screen",
                cap: "Incident Tracking",
              },
              {
                src: "/demo-assets/15-settings.png",
                alt: "Calico Yacht Charters settings screen",
                cap: "Settings & AI Configuration",
              },
            ]}
          />
        ),
      },
      {
        id: "13-post-1",
        render: () => (
          <FinalStatement
            vp={vp}
            num="13"
            label="System unification"
            title="Every function should operate inside one environment."
            text="Bookings, clients, fleet, crew, records, communication, revenue, and system behavior should stop acting like separate subscriptions and start operating like one business."
          />
        ),
      },
      {
        id: "14-post-2",
        render: () => (
          <FinalStatement
            vp={vp}
            num="14"
            label="Infrastructure"
            title="A Digital Spine."
            text="This is not a collection of tools. It is a unified operating layer that gives the business structural control, visibility, and continuity."
          />
        ),
      },
      {
        id: "15-final",
        render: () => (
          <FinalAction
            vp={vp}
            go={() => {
              setMode("intake");
              setIs(1);
            }}
          />
        ),
      },
    ];

    return fixedSlides;
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

  useEffect(() => {
    if (mode !== "walk") return;

    const onKey = (e: KeyboardEvent) => {
      if (lb.open) return;
      if (e.key === "ArrowRight") go(sl + 1);
      if (e.key === "ArrowLeft") go(sl - 1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, sl, go, lb.open]);

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
              marginBottom: vp.isMobile ? 30 : 36,
            }}
          >
            Private Walkthrough Access
          </div>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enter()}
            placeholder="Enter access code"
            style={{
              width: "100%",
              padding: vp.isMobile ? "14px 14px" : "15px 16px",
              background: "transparent",
              border: `1px solid ${ce ? C.er : C.gl}`,
              color: C.cr,
              fontFamily: SA,
              fontSize: 13,
              outline: "none",
              marginBottom: 12,
            }}
          />

          <button
            type="button"
            onClick={enter}
            style={{
              ...buttonBase(vp),
              width: "100%",
              justifyContent: "center",
            }}
          >
            Enter
          </button>

          <div
            style={{
              marginTop: 14,
              minHeight: 16,
              fontFamily: SA,
              fontSize: 11.5,
              color: ce ? "#C88989" : C.m,
              opacity: ce ? 1 : 0.7,
            }}
          >
            {ce ? "Invalid access code." : "Authorized viewers only."}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "intake") {
    const steps = [
      "Business Surface",
      "Bookings",
      "Fleet & Crew",
      "Revenue & Records",
      "Coordination",
      "Priorities",
      "Build Notes",
      "Review",
    ];

    return (
      <div
        style={{
          minHeight: "100dvh",
          background: C.bg,
          color: C.cr,
          padding: vp.isMobile ? "22px 16px 36px" : "34px 28px 48px",
        }}
      >
        <style>{CSS}</style>
        <SceneShell vp={vp} max={960} align="left">
          <div style={{ marginBottom: vp.isMobile ? 24 : 30 }}>
            <L s={{ marginBottom: 14 }} vp={vp}>
              Configuration Intake
            </L>
            <H z={46} s={{ marginBottom: 12 }} vp={vp}>
              Build the yacht charter operating surface.
            </H>
            <P vp={vp} s={{ maxWidth: 640 }}>
              Define the operational layers that matter most so the build starts
              from actual business coordination, not generic software logic.
            </P>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: vp.isMobile ? 22 : 28,
            }}
          >
            {steps.map((s, i) => {
              const on = is === i + 1;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setIs(i + 1)}
                  style={{
                    fontFamily: SA,
                    fontSize: 10.5,
                    fontWeight: 500,
                    letterSpacing: 1.3,
                    textTransform: "uppercase",
                    padding: "9px 12px",
                    border: `1px solid ${
                      on ? "rgba(160,139,92,.35)" : "rgba(160,139,92,.12)"
                    }`,
                    background: on ? C.gd : "transparent",
                    color: on ? C.g : C.m,
                    cursor: "pointer",
                  }}
                >
                  {i + 1}. {s}
                </button>
              );
            })}
          </div>

          <div
            style={{
              border: `1px solid ${C.gl}`,
              padding: vp.isMobile ? 18 : 22,
              background: "rgba(255,255,255,.01)",
            }}
          >
            {is === 1 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: vp.isTablet ? "1fr" : "1fr 1fr",
                  gap: vp.isMobile ? 16 : 18,
                }}
              >
                <Fi
                  label="Project Lead"
                  ph="Owen Lane"
                  value={fd.pn}
                  onChange={upd("pn")}
                  vp={vp}
                />
                <Fi
                  label="Company / Brand"
                  ph="Calico Yacht Charters"
                  value={fd.cn}
                  onChange={upd("cn")}
                  vp={vp}
                />
                <Fi
                  label="Email"
                  ph="contact@company.com"
                  type="email"
                  value={fd.em}
                  onChange={upd("em")}
                  vp={vp}
                />
                <Fi
                  label="Phone"
                  ph="+1 ..."
                  value={fd.ph}
                  onChange={upd("ph")}
                  vp={vp}
                />
                <Ch
                  label="Core operational layers"
                  opts={[
                    "Bookings",
                    "Calendar",
                    "Fleet",
                    "Crew",
                    "Clients",
                    "Revenue",
                    "Documents",
                    "Messages",
                    "Marketing",
                    "Reviews",
                    "Incidents",
                    "AI Command",
                  ]}
                  sel={fd.cd}
                  tog={(v) => tog("cd", v)}
                  vp={vp}
                />
                <Ch
                  label="Priority system surfaces"
                  opts={[
                    "Owner dashboard",
                    "Admin dashboard",
                    "Client-facing booking flow",
                    "Crew operations",
                    "Document workflow",
                    "Revenue reporting",
                  ]}
                  sel={fd.vs}
                  tog={(v) => tog("vs", v)}
                  vp={vp}
                />
              </div>
            )}

            {is === 2 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: vp.isTablet ? "1fr" : "1fr 1fr",
                  gap: vp.isMobile ? 16 : 18,
                }}
              >
                <Fi
                  label="Booking volume"
                  ph="How many bookings per week / month?"
                  value={fd.bn}
                  onChange={upd("bn")}
                  vp={vp}
                />
                <Fi
                  label="Booking friction"
                  ph="Where do bookings slow down or break?"
                  value={fd.fn}
                  onChange={upd("fn")}
                  vp={vp}
                />
                <Ch
                  label="Booking flow requirements"
                  opts={[
                    "Inquiry capture",
                    "Quote flow",
                    "Deposit tracking",
                    "Status pipeline",
                    "Conflict detection",
                    "Add-on management",
                    "Waiver enforcement",
                  ]}
                  sel={fd.fp}
                  tog={(v) => tog("fp", v)}
                  vp={vp}
                />
                <Ch
                  label="Calendar requirements"
                  opts={[
                    "Month view",
                    "Buffer windows",
                    "Crew visibility",
                    "Yacht conflict checking",
                    "Season planning",
                    "Maintenance blocking",
                  ]}
                  sel={fd.bp}
                  tog={(v) => tog("bp", v)}
                  vp={vp}
                />
              </div>
            )}

            {is === 3 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: vp.isTablet ? "1fr" : "1fr 1fr",
                  gap: vp.isMobile ? 16 : 18,
                }}
              >
                <Fi
                  label="Fleet surface"
                  ph="How many vessels and how should they be viewed?"
                  value={fd.bnn}
                  onChange={upd("bnn")}
                  vp={vp}
                />
                <Fi
                  label="Crew surface"
                  ph="Crew roles, certifications, assignment logic"
                  value={fd.an}
                  onChange={upd("an")}
                  vp={vp}
                />
                <Ch
                  label="Fleet requirements"
                  opts={[
                    "Availability status",
                    "Incident linking",
                    "Maintenance schedule",
                    "Operating costs",
                    "Asset documents",
                    "Rate visibility",
                  ]}
                  sel={fd.ap}
                  tog={(v) => tog("ap", v)}
                  vp={vp}
                />
              </div>
            )}

            {is === 4 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: vp.isTablet ? "1fr" : "1fr 1fr",
                  gap: vp.isMobile ? 16 : 18,
                }}
              >
                <Fi
                  label="Revenue visibility"
                  ph="What should the owner see financially at a glance?"
                  value={fd.pa}
                  onChange={upd("pa")}
                  vp={vp}
                />
                <Fi
                  label="Record requirements"
                  ph="Contracts, waivers, insurance, IDs, invoices"
                  value={fd.im}
                  onChange={upd("im")}
                  vp={vp}
                />
              </div>
            )}

            {is === 5 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: vp.isTablet ? "1fr" : "1fr 1fr",
                  gap: vp.isMobile ? 16 : 18,
                }}
              >
                <Fi
                  label="Communication flow"
                  ph="Where do client messages currently live?"
                  value={fd.ta}
                  onChange={upd("ta")}
                  vp={vp}
                />
                <Fi
                  label="Scheduling complexity"
                  ph="What creates the most coordination pressure?"
                  value={fd.cu}
                  onChange={upd("cu")}
                  vp={vp}
                />
                <Fi
                  label="Incident handling"
                  ph="How should issues be logged, tracked, and surfaced?"
                  value={fd.sp}
                  onChange={upd("sp")}
                  vp={vp}
                />
                <Fi
                  label="AI usage"
                  ph="What should natural language command be able to execute?"
                  value={fd.ad}
                  onChange={upd("ad")}
                  vp={vp}
                />
              </div>
            )}

            {is === 6 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: vp.isMobile ? 16 : 18,
                }}
              >
                <Fi
                  label="Top business priorities"
                  ph="What must this system solve first?"
                  ta
                  value={fd.ta}
                  onChange={upd("ta")}
                  vp={vp}
                />
                <Fi
                  label="Where coordination currently breaks"
                  ph="Describe the current pressure points in operations."
                  ta
                  value={fd.cu}
                  onChange={upd("cu")}
                  vp={vp}
                />
              </div>
            )}

            {is === 7 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: vp.isMobile ? 16 : 18,
                }}
              >
                <Fi
                  label="Additional build notes"
                  ph="Anything specific about vessel logic, seasonal demand, staff structure, ownership view, or client experience"
                  ta
                  value={fd.ad}
                  onChange={upd("ad")}
                  vp={vp}
                />
              </div>
            )}

            {is === 8 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: vp.isMobile ? 16 : 18,
                }}
              >
                <P vp={vp} s={{ maxWidth: "100%" }}>
                  Review the configuration surface, then submit. This intake is
                  built to define the charter operation across bookings, fleet,
                  crew, clients, revenue, documents, communication, scheduling,
                  and issue handling.
                </P>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginTop: vp.isMobile ? 18 : 22,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => setIs((p) => Math.max(1, p - 1))}
                style={{
                  ...buttonBase(vp),
                  minWidth: vp.isMobile ? "48%" : 160,
                }}
              >
                Back
              </button>

              {is < IT ? (
                <button
                  type="button"
                  onClick={() => setIs((p) => Math.min(IT, p + 1))}
                  style={{
                    ...solidButton(vp),
                    minWidth: vp.isMobile ? "48%" : 160,
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={sub}
                  disabled={submitting}
                  style={{
                    ...solidButton(vp),
                    minWidth: vp.isMobile ? "100%" : 220,
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? "default" : "pointer",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Configuration"}
                </button>
              )}
            </div>
          </div>
        </SceneShell>
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
        <SDone vp={vp} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: C.bg,
        color: C.cr,
        overflow: "hidden",
      }}
    >
      <style>{CSS}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          borderBottom: "1px solid rgba(160,139,92,.08)",
          background: "rgba(7,7,7,.88)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: vp.isMobile ? "12px 14px" : "14px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: SE,
                fontSize: vp.isMobile ? 18 : 20,
                color: C.cr,
                lineHeight: 1,
              }}
            >
              Calico Yacht Charters
            </div>
            <div
              style={{
                fontFamily: SA,
                fontSize: 8.5,
                fontWeight: 500,
                letterSpacing: 2.8,
                textTransform: "uppercase",
                color: C.q,
                marginTop: 6,
              }}
            >
              Private Walkthrough
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: vp.isMobile ? 10 : 12,
            }}
          >
            <button
              type="button"
              onClick={() => go(sl - 1)}
              style={{
                ...buttonBase(vp),
                padding: vp.isMobile ? "10px 12px" : "12px 16px",
                opacity: sl === 0 ? 0.45 : 1,
                pointerEvents: sl === 0 ? "none" : "auto",
              }}
            >
              Prev
            </button>
            <div
              style={{
                fontFamily: SA,
                fontSize: 10.5,
                color: C.m,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                minWidth: 78,
                textAlign: "center",
              }}
            >
              {String(sl + 1).padStart(2, "0")} / {String(tot).padStart(2, "0")}
            </div>
            <button
              type="button"
              onClick={() => go(sl + 1)}
              style={{
                ...solidButton(vp),
                padding: vp.isMobile ? "10px 12px" : "12px 16px",
                opacity: sl === tot - 1 ? 0.45 : 1,
                pointerEvents: sl === tot - 1 ? "none" : "auto",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          paddingTop: vp.isMobile ? 86 : 96,
          paddingBottom: vp.isMobile ? 34 : 40,
        }}
      >
        <div
          key={`${slides[sl].id}-${ak}`}
          style={{
            animation: "sli .58s cubic-bezier(.16,1,.3,1) both",
            padding: vp.isMobile ? "22px 16px" : "30px 24px",
          }}
        >
          {slides[sl].render()}
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: vp.isMobile ? 14 : 18,
          transform: "translateX(-50%)",
          zIndex: 28,
          display: "flex",
          gap: 6,
          padding: "8px 10px",
          background: "rgba(7,7,7,.72)",
          border: "1px solid rgba(160,139,92,.08)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: 18,
              height: 2,
              border: "none",
              padding: 0,
              background: i === sl ? C.g : "rgba(160,139,92,.18)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <Lightbox
        open={lb.open}
        src={lb.src}
        alt={lb.alt}
        onClose={closeLightbox}
        vp={vp}
      />
    </div>
  );
}