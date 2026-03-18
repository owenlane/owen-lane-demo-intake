"use client";

import { useEffect, useRef, useState } from "react";

const SHOTS = {
  intake: "/images/intake.png",
  dashboard: "/images/dashboard.png",
  submission: "/images/submission.png",
  confirmation: "/images/confirmation.png",
  login: "/images/login.png",
};

const EMERALD = "#2DD4A0";
const BG = "#040404";
const BORDER = "rgba(255,255,255,0.07)";
const SURFACE = "rgba(255,255,255,0.02)";
const SURFACE_HOVER = "rgba(255,255,255,0.035)";
const MUTED = "rgba(255,255,255,0.46)";
const SOFT = "rgba(255,255,255,0.22)";

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(24px)",
        transition: `opacity 0.9s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.9s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative py-24 md:py-32 ${className}`}
      style={{ background: BG }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">{children}</div>
    </section>
  );
}

function Divider() {
  return (
    <div className="max-w-[1200px] mx-auto px-8">
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.06) 50%, transparent 95%)",
        }}
      />
    </div>
  );
}

function Eyebrow({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 mb-6 ${center ? "justify-center" : ""}`}
    >
      <div
        className="w-10 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${EMERALD})` }}
      />
      <span
        className="text-[10px] tracking-[0.28em] uppercase font-medium"
        style={{ color: EMERALD, fontFamily: "var(--font-sans)" }}
      >
        {children}
      </span>
      {center && (
        <div
          className="w-10 h-px"
          style={{ background: `linear-gradient(90deg, ${EMERALD}, transparent)` }}
        />
      )}
    </div>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[12.5px] font-medium tracking-[0.03em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: EMERALD,
        color: BG,
        fontFamily: "var(--font-sans)",
        boxShadow: "0 0 24px rgba(45,212,160,0.10)",
      }}
    >
      {children}
    </a>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[12.5px] font-medium tracking-[0.03em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        color: "rgba(255,255,255,0.78)",
        border: `1px solid ${BORDER}`,
        fontFamily: "var(--font-sans)",
        background: "transparent",
      }}
    >
      {children}
    </a>
  );
}

function Card({
  children,
  emerald = false,
}: {
  children: React.ReactNode;
  emerald?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-6 h-full transition-all duration-500"
      style={{
        background: SURFACE,
        border: `1px solid ${emerald ? "rgba(45,212,160,0.10)" : BORDER}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = SURFACE_HOVER;
        e.currentTarget.style.borderColor = emerald
          ? "rgba(45,212,160,0.22)"
          : "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = SURFACE;
        e.currentTarget.style.borderColor = emerald
          ? "rgba(45,212,160,0.10)"
          : BORDER;
      }}
    >
      {children}
    </div>
  );
}

function Shot({
  src,
  label,
  badge,
  caption,
  hero = false,
}: {
  src: string;
  label: string;
  badge?: string;
  caption?: string;
  hero?: boolean;
}) {
  return (
    <div className="group relative">
      <div
        className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(45,212,160,0.07), transparent 70%)",
        }}
      />
      <div
        className={`relative overflow-hidden ${hero ? "rounded-2xl" : "rounded-xl"} transition-all duration-500 group-hover:translate-y-[-2px]`}
        style={{
          border: `1px solid ${BORDER}`,
          background: "linear-gradient(170deg,#0a0a0a 0%, #040404 100%)",
          boxShadow:
            "0 8px 60px rgba(0,0,0,0.6), 0 2px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.015) inset",
        }}
      >
        <div
          className={`${hero ? "px-6 py-3.5" : "px-4 py-2.5"} flex items-center justify-between`}
          style={{
            borderBottom: `1px solid ${BORDER}`,
            background: "rgba(255,255,255,0.006)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-[5px]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`${hero ? "w-[9px] h-[9px]" : "w-[7px] h-[7px]"} rounded-full`}
                  style={{ background: "rgba(255,255,255,0.055)" }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 ml-2">
              <div
                className="w-[5px] h-[5px] rounded-full"
                style={{ background: EMERALD, opacity: 0.7 }}
              />
              <span
                className={`${hero ? "text-[10px]" : "text-[9px]"} tracking-[0.18em] uppercase font-medium`}
                style={{ color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-sans)" }}
              >
                {label}
              </span>
            </div>
          </div>

          {badge && (
            <div
              className="px-2.5 py-1 rounded-md"
              style={{
                background: "rgba(45,212,160,0.06)",
                border: "1px solid rgba(45,212,160,0.14)",
              }}
            >
              <span
                className="text-[9px] tracking-[0.12em] uppercase font-medium"
                style={{ color: EMERALD, fontFamily: "var(--font-sans)" }}
              >
                {badge}
              </span>
            </div>
          )}
        </div>

        <div className="relative bg-white">
          <img src={src} alt={label} className="w-full h-auto block" />
          <div
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(4,4,4,0.18), transparent)",
            }}
          />
        </div>
      </div>

      {caption && (
        <p
          className={`${hero ? "mt-5" : "mt-3"} text-[10.5px] tracking-[0.05em] text-center`}
          style={{ color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-sans)" }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

function DemoForm({ compact = false }: { compact?: boolean }) {
  const [form, setForm] = useState({
    name: "",
    practice: "",
    email: "",
    phone: "",
    intake: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.022)",
    border: `1px solid ${BORDER}`,
    color: "white",
    fontFamily: "var(--font-sans)",
    fontWeight: 300,
    fontSize: "13px",
    letterSpacing: "0.01em",
  };

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.practice || !form.email || !form.phone || !form.intake) {
      alert("Fill out all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send demo request.");
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Your request did not send.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        className={`${compact ? "p-8" : "p-10 md:p-12"} rounded-2xl text-center`}
        style={{
          background: "rgba(45,212,160,0.06)",
          border: "1px solid rgba(45,212,160,0.14)",
        }}
      >
        <div
          className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center text-black text-xl font-semibold"
          style={{ background: EMERALD }}
        >
          ✓
        </div>
        <h3
          className="text-white text-xl mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Demo Requested
        </h3>
        <p
          className="text-[14px] leading-[1.7]"
          style={{ color: MUTED, fontFamily: "var(--font-sans)" }}
        >
          We&apos;ll reach out within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${compact ? "p-6 md:p-8" : "p-7 md:p-10"} rounded-2xl`}
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
      }}
    >
      <h3
        className="text-white text-lg mb-1.5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Book a Private Demo
      </h3>
      <p
        className="text-[11.5px] mb-6"
        style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)" }}
      >
        20-minute walkthrough · No commitment
      </p>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Practice Name"
          value={form.practice}
          onChange={(e) => updateField("practice", e.target.value)}
          className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
          style={inputStyle}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
          style={inputStyle}
        />
        <select
          value={form.intake}
          onChange={(e) => updateField("intake", e.target.value)}
          className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
          style={{
            ...inputStyle,
            appearance: "none",
            color: form.intake ? "white" : "rgba(255,255,255,0.25)",
          }}
        >
          <option value="" disabled>
            Current Intake Setup
          </option>
          <option value="paper">Paper Forms</option>
          <option value="pdf">Downloadable PDFs</option>
          <option value="third-party">Third-Party Platform</option>
          <option value="mixed">Mixed Methods</option>
          <option value="none">No Formal Process</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-[12.5px] font-medium tracking-[0.03em] transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] mt-1 disabled:opacity-60"
          style={{
            background: EMERALD,
            color: BG,
            fontFamily: "var(--font-sans)",
            boxShadow: "0 0 24px rgba(45,212,160,0.10)",
          }}
        >
          {loading ? "Sending..." : "Request Private Demo"}
        </button>
      </div>
    </form>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Problem", href: "#problem" },
    { label: "Solution", href: "#solution" },
    { label: "Platform", href: "#platform" },
    { label: "Why LCG", href: "#why" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          background: scrolled ? "rgba(4,4,4,0.92)" : "rgba(4,4,4,0.45)",
          backdropFilter: "blur(28px) saturate(1.3)",
          borderBottom: `1px solid ${scrolled ? BORDER : "transparent"}`,
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-[68px] flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: EMERALD }}
            >
              <span
                className="text-[9px] font-semibold tracking-tight"
                style={{ color: BG, fontFamily: "var(--font-sans)" }}
              >
                LCG
              </span>
            </div>
            <span
              className="text-white text-[13px] font-medium hidden sm:block"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Lane Campos Group
            </span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium tracking-[0.05em] transition-colors duration-300 hover:text-white"
                style={{
                  color: "rgba(255,255,255,0.34)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {link.label}
              </a>
            ))}
            <PrimaryButton href="#demo">Book Demo</PrimaryButton>
          </div>

          <button
            type="button"
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <div
              className="w-5 h-px bg-white/50 transition-all duration-300"
              style={{
                transform: mobileOpen
                  ? "rotate(45deg) translate(1.5px,3px)"
                  : "none",
              }}
            />
            <div
              className="w-5 h-px bg-white/50 transition-all duration-300"
              style={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <div
              className="w-5 h-px bg-white/50 transition-all duration-300"
              style={{
                transform: mobileOpen
                  ? "rotate(-45deg) translate(1.5px,-3px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 pt-[68px] md:hidden"
          style={{ background: "rgba(4,4,4,0.98)" }}
        >
          <div className="p-8 space-y-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-2xl"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "white",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#demo"
              onClick={() => setMobileOpen(false)}
              className="block mt-6 px-6 py-3 rounded-xl text-center text-[13px] font-medium"
              style={{
                background: EMERALD,
                color: BG,
                fontFamily: "var(--font-sans)",
              }}
            >
              Book a Private Demo
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer
      className="py-14"
      style={{ borderTop: `1px solid ${BORDER}`, background: BG }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: EMERALD }}
              >
                <span
                  className="text-[8.5px] font-semibold"
                  style={{ color: BG, fontFamily: "var(--font-sans)" }}
                >
                  LCG
                </span>
              </div>
              <span
                className="text-white text-[13px] font-medium"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Lane Campos Group
              </span>
            </div>
            <p
              className="text-[11.5px] leading-[1.7]"
              style={{ color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-sans)" }}
            >
              Digital intake infrastructure
              <br />
              for private practices.
            </p>
          </div>

          <div className="md:col-span-3">
            <p
              className="text-[9.5px] tracking-[0.22em] uppercase font-medium mb-4"
              style={{ color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-sans)" }}
            >
              Navigation
            </p>
            {[
              { label: "Home", href: "#" },
              { label: "System", href: "#platform" },
              { label: "Demo", href: "#demo" },
              { label: "About", href: "#why" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-[11.5px] mb-2 transition-colors hover:text-white/35"
                style={{ color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-sans)" }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="md:col-span-5 md:text-right">
            <p
              className="text-[9.5px] tracking-[0.22em] uppercase font-medium mb-4"
              style={{ color: "rgba(255,255,255,0.18)", fontFamily: "var(--font-sans)" }}
            >
              Contact
            </p>
            <a
              href="mailto:contact@lanecamposgroup.com"
              className="text-[12px] transition-colors hover:text-white/35 block mb-5"
              style={{ color: "rgba(255,255,255,0.22)", fontFamily: "var(--font-sans)" }}
            >
              contact@lanecamposgroup.com
            </a>
            <p
              className="text-[10px]"
              style={{ color: "rgba(255,255,255,0.08)", fontFamily: "var(--font-sans)" }}
            >
              © {new Date().getFullYear()} Lane Campos Group
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen antialiased" style={{ background: BG, color: "white" }}>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: ${BG};
        }

        ::selection {
          background: rgba(45, 212, 160, 0.2);
          color: white;
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.25);
          font-family: var(--font-sans);
          font-weight: 300;
        }

        select option {
          background: #0a0a0a;
          color: white;
        }

        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          background: #040404;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 999px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }

        .pulse-glow {
          animation: pulseGlow 2.5s ease-in-out infinite;
        }
      `}</style>

      <Navbar />

      <section className="relative overflow-hidden pt-16" style={{ background: BG }}>
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
              backgroundSize: "180px",
            }}
          />
          <div
            className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1100px] h-[900px] opacity-[0.05]"
            style={{
              background: `radial-gradient(ellipse, ${EMERALD}, transparent 60%)`,
            }}
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative pt-20 pb-8 md:pt-28 md:pb-12">
          <Reveal>
            <Eyebrow>Digital Intake Infrastructure</Eyebrow>
          </Reveal>

          <Reveal delay={0.05}>
            <h1
              className="text-[clamp(2.4rem,6.2vw,5rem)] leading-[1.04] tracking-[-0.025em] text-white max-w-[860px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Replace outdated patient intake with{" "}
              <span style={{ color: EMERALD }}>digital infrastructure.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.09}>
            <p
              className="mt-3 text-[1.05rem] italic"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(255,255,255,0.24)",
              }}
            >
              Built for private practices.
            </p>
          </Reveal>

          <Reveal delay={0.13}>
            <p
              className="mt-6 max-w-[560px] text-[14px] leading-[1.8]"
              style={{ color: MUTED, fontFamily: "var(--font-sans)" }}
            >
              Lane Campos Group installs HIPAA-aware digital intake infrastructure
              that reduces front-desk processing, eliminates manual form handling,
              and modernizes patient onboarding for private practices.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap gap-4">
              <PrimaryButton href="#demo">Book a Private Demo</PrimaryButton>
              <SecondaryButton href="#platform">View System Walkthrough</SecondaryButton>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-20 md:mt-24 relative">
              <div
                className="absolute -inset-10 rounded-3xl opacity-[0.04]"
                style={{
                  background: `radial-gradient(ellipse at top center, ${EMERALD}, transparent 50%)`,
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-[7px] h-[7px] rounded-full pulse-glow"
                    style={{
                      background: EMERALD,
                      boxShadow: `0 0 8px rgba(45,212,160,0.22)`,
                    }}
                  />
                  <span
                    className="text-[9.5px] tracking-[0.25em] uppercase font-medium"
                    style={{ color: EMERALD, fontFamily: "var(--font-sans)" }}
                  >
                    Live System Preview
                  </span>
                </div>

                <Shot
                  src={SHOTS.dashboard}
                  label="Submission Command Center"
                  badge="System Live"
                  caption="Patient intake and office workflow interface."
                  hero
                />
              </div>
            </div>
          </Reveal>
        </div>

        <div
          className="relative mt-8 md:mt-12 pb-12"
          style={{ borderTop: `1px solid ${BORDER}` }}
        >
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            <Reveal delay={0.4}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
                {[
                  { n: "100%", l: "Digital Intake" },
                  { n: "<2 Min", l: "Average Completion" },
                  { n: "Instant", l: "Office Notification" },
                  { n: "0", l: "Manual Re-Entry" },
                ].map((metric) => (
                  <div key={metric.l} className="text-center">
                    <p
                      className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {metric.n}
                    </p>
                    <p
                      className="text-[10.5px] tracking-[0.1em] uppercase"
                      style={{
                        color: "rgba(255,255,255,0.2)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {metric.l}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Divider />

      <Section id="problem">
        <div className="max-w-[600px]">
          <Reveal>
            <Eyebrow>The Problem</Eyebrow>
          </Reveal>
          <Reveal delay={0.04}>
            <h2
              className="text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.08] tracking-[-0.015em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-white">Most practices still run intake </span>
              <span className="italic" style={{ color: "rgba(255,255,255,0.18)" }}>
                like it&apos;s 2005.
              </span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { title: "Paper Forms", desc: "Clipboards in the lobby. Every patient. Every visit." },
            { title: "Downloadable PDFs", desc: "Website PDFs patients rarely complete." },
            { title: "Manual Re-Entry", desc: "Staff re-types form data. Errors multiply." },
            { title: "Wasted Time", desc: "15–20 minutes per patient at the desk." },
            { title: "Scattered Records", desc: "Data across paper, email, and fax." },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.04}>
              <Card>
                <div
                  className="mb-3.5 w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(45,212,160,0.06)" }}
                >
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: EMERALD, fontFamily: "var(--font-sans)" }}
                  >
                    0{index + 1}
                  </span>
                </div>
                <h4
                  className="text-white text-[13px] font-medium mb-1"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {item.title}
                </h4>
                <p
                  className="text-[12px] leading-[1.6]"
                  style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)" }}
                >
                  {item.desc}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Divider />

      <Section id="solution">
        <div
          className="absolute inset-0 opacity-[0.008]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(45,212,160,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(45,212,160,0.6) 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>The Solution</Eyebrow>
            </Reveal>
            <Reveal delay={0.04}>
              <h2
                className="text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.08] tracking-[-0.015em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="text-white">A modern intake workflow.</span>
                <br />
                <span className="italic" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Installed for you.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p
                className="mt-5 max-w-[360px] text-[14px] leading-[1.8]"
                style={{ color: MUTED, fontFamily: "var(--font-sans)" }}
              >
                LCG replaces your entire intake process with structured digital
                infrastructure — branded to your practice, operational from day one.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <div
                className="p-6 md:p-8 rounded-2xl"
                style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
              >
                {[
                  "Patient scans QR or receives a secure link.",
                  "Completes branded digital intake on their device.",
                  "Office receives structured submission instantly.",
                  "Staff reviews in the dashboard — zero re-entry.",
                  "Record is printable, exportable, workflow-ready.",
                  "Office receives instant email notification.",
                ].map((step, index) => (
                  <div key={step} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10.5px] font-medium"
                        style={{
                          background: "rgba(45,212,160,0.06)",
                          color: EMERALD,
                          fontFamily: "var(--font-sans)",
                          border: "1px solid rgba(45,212,160,0.08)",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      {index < 5 && (
                        <div
                          className="w-px flex-1 min-h-[16px] my-1"
                          style={{ background: BORDER }}
                        />
                      )}
                    </div>
                    <div className={`pt-1.5 ${index < 5 ? "pb-4" : ""}`}>
                      <p
                        className="text-[12.5px] leading-[1.7]"
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Divider />

      <Section>
        <div className="text-center max-w-[540px] mx-auto">
          <Reveal>
            <Eyebrow center>What&apos;s Included</Eyebrow>
          </Reveal>
          <Reveal delay={0.04}>
            <h2
              className="text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.08] tracking-[-0.015em] text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-white">Everything your practice needs.</span>
              <br />
              <span className="italic" style={{ color: "rgba(255,255,255,0.18)" }}>
                Nothing it doesn&apos;t.
              </span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-16">
          {[
            "Branded Digital Intake",
            "Secure Submission Workflow",
            "Internal Office Dashboard",
            "Submission Status Tracking",
            "QR Patient Access",
            "Exportable Intake Data",
            "Printable Patient Records",
            "Installation & Configuration",
            "Instant Office Notifications",
          ].map((title, index) => (
            <Reveal key={title} delay={index * 0.03}>
              <Card emerald>
                <div
                  className="mb-3.5 w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(45,212,160,0.06)" }}
                >
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: EMERALD, fontFamily: "var(--font-sans)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h4
                  className="text-white text-[13px] font-medium mb-1"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {title}
                </h4>
                <p
                  className="text-[12px] leading-[1.6]"
                  style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)" }}
                >
                  Installed, branded, and configured for real private practice workflow.
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Divider />

      <Section id="platform">
        <div className="max-w-[540px] mx-auto text-center mb-14">
          <Reveal>
            <Eyebrow center>The Platform</Eyebrow>
          </Reveal>
          <Reveal delay={0.04}>
            <h2
              className="text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.08] tracking-[-0.015em] text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              See the system in use.
            </h2>
          </Reveal>
          <Reveal delay={0.07}>
            <p
              className="mt-4 text-center text-[14px] leading-[1.8]"
              style={{ color: MUTED, fontFamily: "var(--font-sans)" }}
            >
              Real screenshots from a live installed system — patient intake, office
              dashboard, submission review, and confirmation.
            </p>
          </Reveal>
        </div>

        <div className="space-y-4">
          <Reveal delay={0.05}>
            <Shot
              src={SHOTS.dashboard}
              label="Office Dashboard"
              badge="Command Center"
              caption="Practice overview with real metrics, patient access QR, and intake workflow visibility."
              hero
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Reveal delay={0.1}>
              <Shot
                src={SHOTS.intake}
                label="Patient Intake Experience"
                badge="Step 1 of 4"
                caption="Branded multi-step intake form built for mobile completion."
              />
            </Reveal>
            <Reveal delay={0.14}>
              <Shot
                src={SHOTS.submission}
                label="Submission Review Workflow"
                badge="New"
                caption="Structured patient review, workflow status, and print access."
              />
            </Reveal>
            <Reveal delay={0.18}>
              <Shot
                src={SHOTS.confirmation}
                label="Printable Patient Record"
                caption="Secure confirmation and office-ready intake record flow."
              />
            </Reveal>
          </div>
        </div>
      </Section>

      <Divider />

      <Section id="why">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.025]"
          style={{
            background: `radial-gradient(ellipse, ${EMERALD}, transparent 60%)`,
          }}
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>Why LCG</Eyebrow>
            </Reveal>
            <Reveal delay={0.04}>
              <h2
                className="text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.08] tracking-[-0.015em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="text-white">Why practices choose </span>
                <span className="italic" style={{ color: EMERALD }}>
                  Lane Campos Group.
                </span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 space-y-3">
            {[
              {
                title: "Built for private practice",
                desc: "Designed around front-desk teams and practice staff — not adapted from enterprise.",
              },
              {
                title: "Branded to your practice",
                desc: "Patients see your name and identity. Not a third-party portal.",
              },
              {
                title: "No feature bloat",
                desc: "Focused infrastructure. Patient intake — nothing more.",
              },
              {
                title: "Installed for your office",
                desc: "Configured, deployed, and handed to your team as a working system.",
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.04}>
                <div
                  className="flex gap-5 p-5 rounded-2xl transition-all duration-500"
                  style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.background = SURFACE_HOVER;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = BORDER;
                    e.currentTarget.style.background = SURFACE;
                  }}
                >
                  <div
                    className="shrink-0 mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(45,212,160,0.06)" }}
                  >
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: EMERALD, fontFamily: "var(--font-sans)" }}
                    >
                      0{index + 1}
                    </span>
                  </div>
                  <div>
                    <h4
                      className="text-white text-[13.5px] font-medium mb-0.5"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-[12.5px] leading-[1.6]"
                      style={{ color: "rgba(255,255,255,0.33)", fontFamily: "var(--font-sans)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      <Section id="demo">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse, ${EMERALD}, transparent 60%)`,
          }}
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Get Started</Eyebrow>
            </Reveal>
            <Reveal delay={0.04}>
              <h2
                className="text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.08] tracking-[-0.015em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="text-white">See it running</span>
                <br />
                <span className="italic" style={{ color: "rgba(255,255,255,0.2)" }}>
                  for your practice.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p
                className="mt-5 max-w-[340px] text-[14px] leading-[1.8]"
                style={{ color: MUTED, fontFamily: "var(--font-sans)" }}
              >
                Request a private demo. We&apos;ll walk through the system customized
                to your specialty.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-9 space-y-3.5">
                {[
                  "Live system walkthrough",
                  "Current workflow review",
                  "Custom implementation plan",
                  "Notification workflow demo",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(45,212,160,0.06)" }}
                    >
                      <span
                        className="text-[11px]"
                        style={{ color: EMERALD, fontFamily: "var(--font-sans)" }}
                      >
                        ✓
                      </span>
                    </div>
                    <span
                      className="text-[12.5px]"
                      style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-sans)" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <DemoForm />
            </Reveal>
          </div>
        </div>
      </Section>

      <Divider />

      <Section id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Contact</Eyebrow>
            </Reveal>
            <Reveal delay={0.04}>
              <h2
                className="text-[clamp(1.9rem,4.8vw,3.4rem)] leading-[1.08] tracking-[-0.015em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Let&apos;s discuss your practice.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p
                className="mt-5 max-w-[400px] text-[14px] leading-[1.8]"
                style={{ color: MUTED, fontFamily: "var(--font-sans)" }}
              >
                Ready for a demo or have questions — we respond within one business day.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-10 space-y-8">
                <div>
                  <p
                    className="text-[9.5px] tracking-[0.22em] uppercase font-medium mb-2"
                    style={{ color: EMERALD, fontFamily: "var(--font-sans)" }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:contact@lanecamposgroup.com"
                    className="text-white text-[14.5px] hover:underline underline-offset-4 decoration-white/20"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    contact@lanecamposgroup.com
                  </a>
                </div>

                <div>
                  <p
                    className="text-[9.5px] tracking-[0.22em] uppercase font-medium mb-2"
                    style={{ color: EMERALD, fontFamily: "var(--font-sans)" }}
                  >
                    Company
                  </p>
                  <p
                    className="text-white text-[13.5px] mb-0.5"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Lane Campos Group
                  </p>
                  <p
                    className="text-[12px]"
                    style={{ color: "rgba(255,255,255,0.28)", fontFamily: "var(--font-sans)" }}
                  >
                    Digital Intake Infrastructure for Private Practices
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <DemoForm compact />
            </Reveal>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}