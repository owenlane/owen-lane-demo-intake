"use client";

import { useEffect, useRef, useState } from "react";

/* ─── DESIGN TOKENS ─── */
const IVORY = "#E8E4DE";
const CHALK = "#D4CFC8";
const SMOKE = "#9B958C";
const STONE = "#6B655D";
const DEEP = "#0A0A09";
const SURFACE = "#111110";
const SURFACE_2 = "#161615";
const SURFACE_3 = "#1C1C1A";
const BORDER = "rgba(232,228,222,0.06)";
const BORDER_HOVER = "rgba(232,228,222,0.12)";
const ACCENT = "#C8B89A";
const ACCENT_DIM = "rgba(200,184,154,0.08)";
const ACCENT_GLOW = "rgba(200,184,154,0.05)";
const ACCENT_LINE = "rgba(200,184,154,0.16)";
const DANGER = "rgba(255,130,110,0.58)";

/* ─── HOOKS ─── */
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─── PRIMITIVES ─── */
function Reveal({
  children,
  delay = 0,
  className = "",
  y = 26,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.95s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.95s cubic-bezier(.16,1,.3,1) ${delay}s`,
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
  noPad = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
}) {
  return (
    <section id={id} className={`relative ${noPad ? "" : "py-32 md:py-44"} ${className}`} style={{ background: DEEP }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">{children}</div>
    </section>
  );
}

function SectionLine() {
  return (
    <div className="max-w-[1200px] mx-auto px-10">
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(232,228,222,0.04) 15%, rgba(232,228,222,0.07) 50%, rgba(232,228,222,0.04) 85%, transparent 100%)",
        }}
      />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <div className="w-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT})` }} />
      <span
        className="text-[9.5px] tracking-[0.38em] uppercase font-medium"
        style={{ color: ACCENT, fontFamily: "var(--font-sans)" }}
      >
        {children}
      </span>
    </div>
  );
}

function LabelCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-7">
      <div className="w-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT})` }} />
      <span
        className="text-[9.5px] tracking-[0.38em] uppercase font-medium"
        style={{ color: ACCENT, fontFamily: "var(--font-sans)" }}
      >
        {children}
      </span>
      <div className="w-8 h-px" style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
    </div>
  );
}

function Panel({
  children,
  accent = false,
  className = "",
}: {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  const borderColor = accent ? ACCENT_LINE : BORDER;
  const borderHover = accent ? "rgba(200,184,154,0.24)" : BORDER_HOVER;
  return (
    <div
      className={`rounded-xl transition-all duration-500 ${className}`}
      style={{ background: SURFACE, border: `1px solid ${borderColor}` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = borderHover;
        e.currentTarget.style.background = SURFACE_2;
        e.currentTarget.style.boxShadow = `0 0 44px ${ACCENT_GLOW}`;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.background = SURFACE;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </div>
  );
}

function SignatureFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${ACCENT_LINE}` }}>
      <div className="absolute inset-0 opacity-[0.035]" style={{ background: `radial-gradient(circle at 50% 0%, ${ACCENT}, transparent 52%)` }} />
      <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: `linear-gradient(180deg, transparent, ${ACCENT_LINE}, transparent)` }} />
      <div className="absolute right-0 top-0 bottom-0 w-px" style={{ background: `linear-gradient(180deg, transparent, ${ACCENT_LINE}, transparent)` }} />
      <div className="absolute left-8 right-8 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_LINE}, transparent)` }} />
      <div className="absolute left-8 right-8 bottom-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_LINE}, transparent)` }} />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ─── NAV ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Diagnosis", href: "#diagnosis" },
    { label: "System", href: "#system" },
    { label: "Execution", href: "#execution" },
    { label: "Domains", href: "#domains" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          background: scrolled ? "rgba(10,10,9,0.96)" : "rgba(10,10,9,0.34)",
          backdropFilter: "blur(38px) saturate(1.18)",
          borderBottom: `1px solid ${scrolled ? BORDER : "transparent"}`,
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-[70px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-3.5 group">
            <div
              className="w-[30px] h-[30px] rounded-[6px] flex items-center justify-center transition-all duration-500"
              style={{ border: `1px solid rgba(200,184,154,0.35)` }}
            >
              <span className="text-[8.5px] font-semibold tracking-[0.03em]" style={{ color: ACCENT, fontFamily: "var(--font-sans)" }}>
                LCG
              </span>
            </div>
            <span className="hidden sm:block text-[12.5px] font-medium tracking-[0.03em]" style={{ color: IVORY, fontFamily: "var(--font-sans)" }}>
              Lane Campos Group
            </span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[10.5px] font-medium tracking-[0.08em] uppercase transition-colors duration-300 hover:text-white/80"
                style={{ color: STONE, fontFamily: "var(--font-sans)" }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#engage"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-[6px] text-[10.5px] font-semibold tracking-[0.08em] uppercase transition-all duration-400 hover:shadow-[0_0_20px_rgba(200,184,154,0.08)]"
              style={{ color: DEEP, background: ACCENT, fontFamily: "var(--font-sans)" }}
            >
              Request Access
            </a>
          </div>

          <button type="button" className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px]" onClick={() => setMobileOpen((p) => !p)}>
            <div className="w-[18px] h-px transition-all duration-300" style={{ background: SMOKE, transform: mobileOpen ? "rotate(45deg) translate(1.5px,3px)" : "none" }} />
            <div className="w-[18px] h-px transition-all duration-300" style={{ background: SMOKE, opacity: mobileOpen ? 0 : 1 }} />
            <div className="w-[18px] h-px transition-all duration-300" style={{ background: SMOKE, transform: mobileOpen ? "rotate(-45deg) translate(1.5px,-3px)" : "none" }} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-[70px] md:hidden" style={{ background: "rgba(10,10,9,0.98)" }}>
          <div className="p-8 space-y-7">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block text-[22px] tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-display)", color: IVORY }}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#engage"
              onClick={() => setMobileOpen(false)}
              className="block mt-8 px-6 py-3.5 rounded-[6px] text-center text-[11px] font-semibold tracking-[0.08em] uppercase"
              style={{ background: ACCENT, color: DEEP, fontFamily: "var(--font-sans)" }}
            >
              Request Access
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: DEEP }}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.84\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: "200px",
          }}
        />
        <div className="absolute top-[4%] left-[8%] w-[760px] h-[760px] opacity-[0.022]" style={{ background: `radial-gradient(circle, ${ACCENT}, transparent 58%)` }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[540px] h-[540px] opacity-[0.015]" style={{ background: `radial-gradient(circle, ${ACCENT}, transparent 55%)` }} />
        <div className="absolute top-0 bottom-0 left-[calc(50%-360px)] w-px opacity-[0.04]" style={{ background: `linear-gradient(180deg, transparent, ${IVORY} 18%, ${IVORY} 82%, transparent)` }} />
        <div className="absolute top-0 bottom-0 right-[calc(50%-360px)] w-px opacity-[0.02]" style={{ background: `linear-gradient(180deg, transparent 30%, ${IVORY} 50%, transparent 70%)` }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative pt-48 md:pt-60 pb-36 md:pb-48">
        <Reveal y={20}>
          <Label>Private Operating Infrastructure</Label>
        </Reveal>

        <Reveal delay={0.05} y={24}>
          <h1 className="text-[clamp(2.8rem,7.3vw,6.3rem)] leading-[0.96] tracking-[-0.045em] max-w-[980px]" style={{ fontFamily: "var(--font-display)" }}>
            <span style={{ color: IVORY }}>If your operation runs on rented tools,</span>
            <br />
            <span style={{ color: ACCENT }}>you do not control your business.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.11} y={20}>
          <p className="mt-9 max-w-[540px] text-[14.5px] leading-[1.95]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
            Lane Campos Group engineers private operating infrastructure for serious operators — replacing fragmented platforms, manual re-entry, and permanent vendor dependency with one custom system built to your specification and transferred to your ownership.
          </p>
        </Reveal>

        <Reveal delay={0.17} y={18}>
          <div className="mt-11 flex flex-wrap items-center gap-4">
            <a
              href="#engage"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-[6px] text-[11px] font-semibold tracking-[0.08em] uppercase transition-all duration-400 hover:shadow-[0_0_28px_rgba(200,184,154,0.1)]"
              style={{ background: ACCENT, color: DEEP, fontFamily: "var(--font-sans)" }}
            >
              <span>Request Access</span>
              <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#diagnosis"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[6px] text-[11px] font-medium tracking-[0.08em] uppercase transition-all duration-400 hover:border-[rgba(232,228,222,0.14)]"
              style={{ color: SMOKE, border: `1px solid ${BORDER}`, fontFamily: "var(--font-sans)" }}
            >
              See The Diagnosis
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.25} y={22}>
          <SignatureFrame>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: BORDER }}>
              {[
                { n: "Custom", l: "Every system built from zero" },
                { n: "Owned", l: "No licenses. No recurring control" },
                { n: "20 Days", l: "Specification to deployment" },
                { n: "One System", l: "No bridges. No fragmentation" },
              ].map((m, i) => (
                <div key={m.l} className="px-5 py-8 md:py-9 text-center relative" style={{ background: i % 2 === 0 ? SURFACE : SURFACE_2 }}>
                  <div className="absolute inset-0 opacity-[0.012]" style={{ background: `radial-gradient(circle at center, ${ACCENT}, transparent 70%)` }} />
                  <p className="text-[24px] md:text-[28px] font-medium tracking-[-0.02em] mb-1.5 relative" style={{ color: IVORY, fontFamily: "var(--font-display)" }}>
                    {m.n}
                  </p>
                  <p className="text-[9.5px] tracking-[0.14em] uppercase relative" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                    {m.l}
                  </p>
                </div>
              ))}
            </div>
          </SignatureFrame>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── DIAGNOSIS ─── */
function Diagnosis() {
  return (
    <Section id="diagnosis">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Label>The Diagnosis</Label>
          </Reveal>
          <Reveal delay={0.04}>
            <h2 className="text-[clamp(2.1rem,5.2vw,3.8rem)] leading-[1.02] tracking-[-0.025em]" style={{ fontFamily: "var(--font-display)" }}>
              <span style={{ color: IVORY }}>What most businesses call a system</span>
              <br />
              <span style={{ color: STONE }}>is usually staff improvisation between broken tools.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 text-[14px] leading-[1.95] max-w-[420px]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              Scheduling in one platform. Records in another. Intake on paper. Billing through a third portal. Internal communication in email. Critical information retyped across systems that were never designed to operate as one.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 text-[14px] leading-[1.95] max-w-[420px]" style={{ color: ACCENT, fontFamily: "var(--font-sans)", fontWeight: 500 }}>
              The visible problem is friction. The real problem is that your business does not own its operating layer.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { title: "Fragmented Stack", desc: "Five platforms holding data hostage in isolated silos. Your team becomes the integration layer." },
                { title: "Manual Redundancy", desc: "Every transfer point creates delay, error risk, and operational drag that compounds daily." },
                { title: "False Visibility", desc: "You can open dashboards all day and still have no single source of operational truth." },
                { title: "Rented Control", desc: "Pricing, features, access, and product direction remain in someone else’s hands." },
              ].map((item) => (
                <Panel key={item.title} className="p-5">
                  <p className="text-[12.5px] font-semibold mb-1.5 tracking-[0.01em]" style={{ color: IVORY, fontFamily: "var(--font-sans)" }}>
                    {item.title}
                  </p>
                  <p className="text-[11.5px] leading-[1.68]" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                    {item.desc}
                  </p>
                </Panel>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <SignatureFrame>
              <div className="p-6 md:p-7">
                <div className="flex items-center justify-between gap-6 flex-wrap mb-4">
                  <span className="text-[9px] tracking-[0.28em] uppercase font-semibold" style={{ color: ACCENT, fontFamily: "var(--font-sans)" }}>
                    Cost of Fragmentation
                  </span>
                  <span className="text-[24px] tracking-[-0.03em]" style={{ color: IVORY, fontFamily: "var(--font-display)" }}>
                    Six figures / year
                  </span>
                </div>
                <p className="text-[12px] leading-[1.75]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                  Manual re-entry, missed follow-up, scheduling leakage, staff time spent reconciling conflicting systems, delayed billing, and degraded client experience create real financial drag. Most operators never see the number because the waste is spread across people, platforms, and time.
                </p>
                <div className="mt-5 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ borderTop: `1px solid ${ACCENT_LINE}` }}>
                  {[
                    "Labor waste hides inside payroll.",
                    "Revenue leakage hides inside friction.",
                    "Control loss hides inside subscriptions.",
                  ].map((line) => (
                    <div key={line} className="text-[10.5px] leading-[1.6]" style={{ color: CHALK, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </SignatureFrame>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ─── SYSTEM ─── */
function SystemLayers() {
  return (
    <Section id="system">
      <div className="text-center max-w-[700px] mx-auto mb-20">
        <Reveal>
          <LabelCenter>The System</LabelCenter>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="text-[clamp(2.1rem,5.2vw,3.8rem)] leading-[1.02] tracking-[-0.025em]" style={{ fontFamily: "var(--font-display)" }}>
            <span style={{ color: IVORY }}>This is not software you add.</span>
            <br />
            <span style={{ color: STONE }}>It becomes how the operation runs.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-7 text-[14px] leading-[1.95] mx-auto max-w-[560px]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
            We replace the operational stack with one privately owned infrastructure layer. Every workflow, record, trigger, permission, and decision path exists inside a single architecture instead of being scattered across disconnected vendors.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {[
          { n: "01", title: "Command Layer", desc: "Executive control across status, workflow, operational load, and system health from one environment." },
          { n: "02", title: "Record Intelligence", desc: "Unified profiles, documents, timelines, and interaction history in one structured data model." },
          { n: "03", title: "Scheduling Engine", desc: "Real-time capacity logic, sequencing, conflict prevention, and operational flow control." },
          { n: "04", title: "Financial Layer", desc: "Billing visibility, revenue events, invoicing states, and payment progression without platform hopping." },
          { n: "05", title: "Onboarding Layer", desc: "Branded intake and structured submission paths that capture data once and route it everywhere." },
          { n: "06", title: "Document Vault", desc: "Permanent storage, retrieval, imaging, and file-level visibility built directly into the system." },
          { n: "07", title: "Communication Bus", desc: "Messages, notifications, reminders, and internal handoffs triggered by events instead of people remembering." },
          { n: "08", title: "Analytics Core", desc: "Computed operational intelligence derived from real system events, not isolated vanity dashboards." },
          { n: "09", title: "Lifecycle Tracking", desc: "Every client, patient, vessel, deal, or campaign tracked through its full operating lifecycle." },
          { n: "10", title: "Administrative Control", desc: "Role-based permissions, access rules, team oversight, and configuration authority controlled by architecture." },
        ].map((item, i) => (
          <Reveal key={item.n} delay={i * 0.025}>
            <Panel accent className="p-5 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] tracking-[0.2em] font-semibold" style={{ color: ACCENT, fontFamily: "var(--font-sans)" }}>
                  {item.n}
                </span>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${ACCENT_LINE}, transparent)` }} />
              </div>
              <p className="text-[12.5px] font-semibold mb-1 tracking-[0.005em]" style={{ color: IVORY, fontFamily: "var(--font-sans)" }}>
                {item.title}
              </p>
              <p className="text-[11px] leading-[1.62]" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                {item.desc}
              </p>
            </Panel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <SignatureFrame>
          <div className="p-8 md:p-10 text-center">
            <p className="text-[14px] leading-[1.9] max-w-[640px] mx-auto" style={{ color: CHALK, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              These are not add-ons. They are <span style={{ color: ACCENT, fontWeight: 500 }}>interdependent operating layers</span>. One action updates the whole environment. One record informs the whole business. One system replaces the chaos of five.
            </p>
          </div>
        </SignatureFrame>
      </Reveal>
    </Section>
  );
}

/* ─── ENGINEERING ─── */
function Engineering() {
  return (
    <Section id="architecture">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Label>Engineering</Label>
          </Reveal>
          <Reveal delay={0.04}>
            <h2 className="text-[clamp(2.1rem,5.2vw,3.8rem)] leading-[1.02] tracking-[-0.025em]" style={{ fontFamily: "var(--font-display)" }}>
              <span style={{ color: IVORY }}>Built to your operating logic.</span>
              <br />
              <span style={{ color: STONE }}>Then transferred to you.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 text-[14px] leading-[1.95] max-w-[420px]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              No templates. No theme layer pretending to be customization. No vendor product forcing your operation to adapt to its limitations. The system is specified against your workflows, team structure, control requirements, and domain realities.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-8 p-5 rounded-lg" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
              <p className="text-[11px] leading-[1.75]" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                <span style={{ color: IVORY, fontWeight: 500 }}>Ownership model:</span> codebase, data structure, workflow rules, branded interfaces, and deployment environment are built for your business and transferred to your control. No recurring license. No vendor hostage dynamic.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 space-y-2.5">
          {[
            { n: "I", title: "Custom Frontend Layer", desc: "Client-facing interfaces designed to your identity and your process. The user experiences your operation — not a third-party product." },
            { n: "II", title: "Authenticated Admin Layer", desc: "Secure role-based control over status, workflow, access, records, and operational oversight in one internal environment." },
            { n: "III", title: "Unified Data Architecture", desc: "One structured data model across records, documents, timestamps, workflows, and metrics. No exports. No sync bridges. No split truth." },
            { n: "IV", title: "Automation & Event Engine", desc: "Status changes, notifications, routing logic, reminders, and operational actions driven by system events instead of manual memory." },
            { n: "V", title: "Deployment & Security Layer", desc: "Encrypted transport, permission controls, backups, environment isolation, monitoring, and infrastructure-grade reliability from day one." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.04}>
              <Panel className="flex gap-5 p-5">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-[3px] h-full min-h-[48px] rounded-full" style={{ background: `linear-gradient(180deg, ${ACCENT}, rgba(200,184,154,0.04))` }} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-[9px] tracking-[0.18em] font-semibold" style={{ color: ACCENT, fontFamily: "var(--font-sans)" }}>
                      {item.n}
                    </span>
                    <p className="text-[13px] font-semibold tracking-[0.005em]" style={{ color: IVORY, fontFamily: "var(--font-sans)" }}>
                      {item.title}
                    </p>
                  </div>
                  <p className="text-[12px] leading-[1.72]" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                    {item.desc}
                  </p>
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── REALITY CHECK ─── */
function RealityCheck() {
  return (
    <Section>
      <div className="text-center max-w-[640px] mx-auto mb-16">
        <Reveal>
          <LabelCenter>Reality Check</LabelCenter>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="text-[clamp(2.1rem,5.2vw,3.6rem)] leading-[1.02] tracking-[-0.025em]" style={{ fontFamily: "var(--font-display)" }}>
            <span style={{ color: IVORY }}>Three models exist.</span>
            <br />
            <span style={{ color: STONE }}>Only one leaves you in control.</span>
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-16">
          <div className="p-6 md:p-7 rounded-xl relative overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "rgba(255,100,80,0.16)" }} />
            <p className="text-[9.5px] tracking-[0.28em] uppercase font-semibold mb-6" style={{ color: DANGER, fontFamily: "var(--font-sans)" }}>
              Fragmented Stack
            </p>
            <div className="space-y-3">
              {[
                "Multiple disconnected platforms pretending to be one workflow",
                "Staff manually reconciles every operational gap",
                "Data quality degrades at each handoff",
                "No single source of operational truth",
                "Costs spread everywhere, so nobody sees the real number",
                "Outcome arrives as drag, error, delay, and leakage",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2.5">
                  <span className="text-[10px] mt-[3px] shrink-0" style={{ color: "rgba(255,120,100,0.48)" }}>
                    ✕
                  </span>
                  <span className="text-[11.5px] leading-[1.58]" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
              <p className="text-[10px] tracking-[0.1em] uppercase" style={{ color: "rgba(255,120,100,0.38)", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                Outcome: your team absorbs the system failure
              </p>
            </div>
          </div>

          <div className="p-6 md:p-7 rounded-xl relative overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "rgba(255,190,100,0.15)" }} />
            <p className="text-[9.5px] tracking-[0.28em] uppercase font-semibold mb-6" style={{ color: "rgba(255,190,100,0.52)", fontFamily: "var(--font-sans)" }}>
              Generic SaaS
            </p>
            <div className="space-y-3">
              {[
                "Architecture designed for the vendor, not your operation",
                "Feature set determined by someone else’s roadmap",
                "Your clients still feel the product underneath your brand",
                "Subscription dependency never ends",
                "Customization remains cosmetic, not structural",
                "You pay forever and still never own the operating layer",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2.5">
                  <span className="text-[10px] mt-[3px] shrink-0" style={{ color: "rgba(255,190,100,0.42)" }}>
                    —
                  </span>
                  <span className="text-[11.5px] leading-[1.58]" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
              <p className="text-[10px] tracking-[0.1em] uppercase" style={{ color: "rgba(255,190,100,0.36)", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                Outcome: permanent dependency disguised as convenience
              </p>
            </div>
          </div>

          <div className="p-6 md:p-7 rounded-xl relative overflow-hidden" style={{ background: SURFACE_2, border: `1px solid ${ACCENT_LINE}` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }} />
            <div className="absolute inset-0 opacity-[0.025]" style={{ background: `radial-gradient(circle at top, ${ACCENT}, transparent 60%)` }} />
            <p className="text-[9.5px] tracking-[0.28em] uppercase font-semibold mb-6 relative" style={{ color: ACCENT, fontFamily: "var(--font-sans)" }}>
              Private Operating Infrastructure
            </p>
            <div className="space-y-3 relative">
              {[
                "One architecture replacing the stack underneath the business",
                "Every surface branded to the operator, not the vendor",
                "Features built to specification — nothing rented, nothing bloated",
                "Workflow logic lives inside the system, not inside staff memory",
                "Control, visibility, and data integrity all rise together",
                "The result is a transferable operational asset"
              ].map((t) => (
                <div key={t} className="flex items-start gap-2.5">
                  <span className="text-[10px] mt-[3px] shrink-0" style={{ color: ACCENT }}>
                    ✓
                  </span>
                  <span className="text-[11.5px] leading-[1.58]" style={{ color: CHALK, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 relative" style={{ borderTop: `1px solid ${ACCENT_LINE}` }}>
              <p className="text-[10px] tracking-[0.1em] uppercase" style={{ color: ACCENT, fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                Outcome: operational sovereignty
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ─── EXECUTION ─── */
function Execution() {
  return (
    <Section id="execution">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Label>Execution</Label>
          </Reveal>
          <Reveal delay={0.04}>
            <h2 className="text-[clamp(2.1rem,5.2vw,3.8rem)] leading-[1.02] tracking-[-0.025em]" style={{ fontFamily: "var(--font-display)" }}>
              <span style={{ color: IVORY }}>A controlled build.</span>
              <br />
              <span style={{ color: STONE }}>Not a chaotic transition.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 text-[14px] leading-[1.95] max-w-[420px]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              Your current operation stays live while the new system is architected, engineered, configured, and reviewed. Cutover only happens when the infrastructure is tested, approved, and ready to carry the operation.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <SignatureFrame>
              <div className="p-5 md:p-6">
                <p className="text-[11.5px] leading-[1.75]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                  <span style={{ color: ACCENT, fontWeight: 500 }}>The system is already figured out before it goes live.</span> This is not experimentation on your business. It is controlled infrastructure deployment with clear ownership transfer at the end.
                </p>
              </div>
            </SignatureFrame>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <div className="space-y-0">
              {[
                { phase: "01", title: "Discovery & Specification", desc: "Operational layers, workflow requirements, role logic, control points, and failure points are mapped into a full specification.", time: "Days 1–3" },
                { phase: "02", title: "System Engineering", desc: "Interfaces, admin environment, data model, workflow engine, notifications, and infrastructure are built against the approved specification.", time: "Days 4–16" },
                { phase: "03", title: "Calibration & Review", desc: "System behavior is verified with the client. Rules are tuned, states are reviewed, and operational fit is finalized before go-live.", time: "Days 17–19" },
                { phase: "04", title: "Deployment & Transfer", desc: "Infrastructure is deployed, system is activated, and the full operating layer transfers into the client’s control.", time: "Day 20" },
              ].map((step, i) => (
                <div key={step.phase} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0 relative" style={{ background: "transparent", border: `1px solid ${ACCENT_LINE}` }}>
                      <div className="absolute inset-0 rounded-[6px] opacity-[0.06]" style={{ background: `radial-gradient(circle, ${ACCENT}, transparent)` }} />
                      <span className="text-[10.5px] font-semibold relative" style={{ color: ACCENT, fontFamily: "var(--font-sans)" }}>
                        {step.phase}
                      </span>
                    </div>
                    {i < 3 && <div className="w-px flex-1 min-h-[20px] my-1.5" style={{ background: `linear-gradient(180deg, ${ACCENT_LINE}, transparent)` }} />}
                  </div>
                  <div className={`pt-2 ${i < 3 ? "pb-8" : ""}`}>
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <p className="text-[13px] font-semibold tracking-[0.005em]" style={{ color: IVORY, fontFamily: "var(--font-sans)" }}>
                        {step.title}
                      </p>
                      <span
                        className="text-[8.5px] tracking-[0.12em] uppercase px-2 py-[3px] rounded-[4px] shrink-0"
                        style={{ color: ACCENT, background: ACCENT_DIM, fontFamily: "var(--font-sans)", fontWeight: 600, border: `1px solid rgba(200,184,154,0.06)` }}
                      >
                        {step.time}
                      </span>
                    </div>
                    <p className="text-[12px] leading-[1.72]" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ─── VALUE ─── */
function StrategicValue() {
  return (
    <Section>
      <div className="relative">
        <div className="absolute inset-0 opacity-[0.028] pointer-events-none rounded-2xl" style={{ background: `radial-gradient(ellipse at center top, ${ACCENT}, transparent 55%)` }} />
        <SignatureFrame>
          <div className="p-10 md:p-16 lg:p-20" style={{ boxShadow: `0 0 84px ${ACCENT_GLOW}` }}>
            <div className="max-w-[720px] mx-auto text-center">
              <Reveal>
                <LabelCenter>Strategic Value</LabelCenter>
              </Reveal>
              <Reveal delay={0.04}>
                <h2 className="text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] tracking-[-0.025em]" style={{ fontFamily: "var(--font-display)" }}>
                  <span style={{ color: IVORY }}>The market undervalues infrastructure</span>
                  <br />
                  <span style={{ color: ACCENT }}>until acquisition forces the math.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-8 text-[14px] leading-[1.95] max-w-[560px] mx-auto" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                  Buyers, partners, and operators do not just assess revenue. They assess whether the business can actually run cleanly, scale cleanly, and transfer cleanly. Structured infrastructure increases confidence because it lowers operational risk and raises control.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.14}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-16">
                {[
                  { n: "Efficiency", title: "Reclaimed Capacity", desc: "Remove weekly manual waste, reduce operational friction, and release your best people from your worst processes." },
                  { n: "Revenue", title: "Recovered Throughput", desc: "Faster intake, tighter scheduling, cleaner follow-through, and less leakage can create $100K+ annual upside in the right operation." },
                  { n: "Valuation", title: "Structural Premium", desc: "A business with unified infrastructure presents as mature, controlled, and easier to diligence, operate, and transfer." },
                ].map((item) => (
                  <div key={item.title} className="p-6 rounded-xl relative" style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}>
                    <span className="text-[9px] tracking-[0.25em] uppercase font-semibold block mb-3" style={{ color: ACCENT, fontFamily: "var(--font-sans)" }}>
                      {item.n}
                    </span>
                    <p className="text-[13px] font-semibold mb-2 tracking-[0.005em]" style={{ color: IVORY, fontFamily: "var(--font-sans)" }}>
                      {item.title}
                    </p>
                    <p className="text-[11.5px] leading-[1.68]" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 text-center">
                <p className="text-[15px] leading-[1.86] max-w-[620px] mx-auto" style={{ color: CHALK, fontFamily: "var(--font-display)", fontWeight: 300 }}>
                  Tools depreciate. Infrastructure compounds. The operating layer we build becomes a permanent component of enterprise value.
                </p>
              </div>
            </Reveal>
          </div>
        </SignatureFrame>
      </div>
    </Section>
  );
}

/* ─── DOMAINS ─── */
function Domains() {
  return (
    <Section id="domains">
      <div className="text-center max-w-[620px] mx-auto mb-16">
        <Reveal>
          <LabelCenter>Application</LabelCenter>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="text-[clamp(2.1rem,5.2vw,3.6rem)] leading-[1.02] tracking-[-0.025em]" style={{ fontFamily: "var(--font-display)" }}>
            <span style={{ color: IVORY }}>One infrastructure model.</span>
            <br />
            <span style={{ color: STONE }}>Configured to high-value domains.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-7 text-[14px] leading-[1.95] mx-auto max-w-[480px]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
            The architecture transfers. The configuration changes. We deploy the same level of control across operations where privacy, visibility, precision, and ownership matter.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { title: "Medical & Dental", desc: "Records, intake, scheduling, billing, treatment tracking, imaging, and compliance under one privately owned operating system." },
          { title: "Maritime & Operations", desc: "Vessel workflows, bookings, crew coordination, maintenance cycles, compliance control, and logistical visibility." },
          { title: "Political & Campaign", desc: "Donor systems, field operations, communications infrastructure, volunteer coordination, and real-time campaign control." },
          { title: "Private Equity & Finance", desc: "Deal flow, portfolio operations, reporting infrastructure, compliance workflows, and investment lifecycle control." },
        ].map((item, i) => (
          <Reveal key={item.title} delay={i * 0.04}>
            <Panel accent className="p-6 h-full">
              <p className="text-[13px] font-semibold mb-2 tracking-[0.005em]" style={{ color: IVORY, fontFamily: "var(--font-sans)" }}>
                {item.title}
              </p>
              <p className="text-[11.5px] leading-[1.68]" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                {item.desc}
              </p>
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── ENGAGE ─── */
function EngageForm() {
  const [form, setForm] = useState({ name: "", org: "", email: "", phone: "", context: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const inputBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.018)",
    border: `1px solid ${BORDER}`,
    color: IVORY,
    fontFamily: "var(--font-sans)",
    fontWeight: 300,
    fontSize: "12.5px",
    letterSpacing: "0.015em",
  };

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.org || !form.email || !form.phone || !form.context) {
      alert("All fields required.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Request failed.");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-10 md:p-14 rounded-xl text-center" style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT_LINE}` }}>
        <div className="w-12 h-12 mx-auto mb-5 rounded-[6px] flex items-center justify-center text-base font-semibold" style={{ background: ACCENT, color: DEEP }}>
          ✓
        </div>
        <h3 className="text-lg mb-2" style={{ color: IVORY, fontFamily: "var(--font-display)" }}>
          Request Received
        </h3>
        <p className="text-[13px] leading-[1.7]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
          We will respond within one business day.
        </p>
      </div>
    );
  }

  const fields = [
    { key: "name" as const, placeholder: "Full Name", type: "text" },
    { key: "org" as const, placeholder: "Organization", type: "text" },
    { key: "email" as const, placeholder: "Email", type: "email" },
    { key: "phone" as const, placeholder: "Phone", type: "tel" },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-7 md:p-9 rounded-xl relative" style={{ background: SURFACE, border: `1px solid ${BORDER}`, boxShadow: `0 16px 80px rgba(0,0,0,0.35), 0 0 0 1px ${BORDER}` }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(200,184,154,0.08), transparent)` }} />
      <h3 className="text-[17px] tracking-[-0.01em] mb-1" style={{ color: IVORY, fontFamily: "var(--font-display)" }}>
        Request Access
      </h3>
      <p className="text-[10.5px] tracking-[0.05em] mb-7" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 400 }}>
        Selective engagement · Limited availability
      </p>
      <div className="space-y-2.5">
        {fields.map((f) => (
          <input
            key={f.key}
            type={f.type}
            placeholder={f.placeholder}
            value={form[f.key]}
            onChange={(e) => update(f.key, e.target.value)}
            onFocus={() => setFocused(f.key)}
            onBlur={() => setFocused(null)}
            className="w-full px-4 py-3.5 rounded-[6px] outline-none transition-all duration-400"
            style={{ ...inputBase, borderColor: focused === f.key ? ACCENT_LINE : BORDER }}
          />
        ))}
        <select
          value={form.context}
          onChange={(e) => update("context", e.target.value)}
          onFocus={() => setFocused("context")}
          onBlur={() => setFocused(null)}
          className="w-full px-4 py-3.5 rounded-[6px] outline-none transition-all duration-400"
          style={{ ...inputBase, appearance: "none", color: form.context ? IVORY : STONE, borderColor: focused === "context" ? ACCENT_LINE : BORDER }}
        >
          <option value="" disabled>
            Current Operating Condition
          </option>
          <option value="fragmented">Multiple Disconnected Platforms</option>
          <option value="legacy">Legacy / Paper-Based Systems</option>
          <option value="partial">Partial Digital Infrastructure</option>
          <option value="rebuilding">Rebuilding from Scratch</option>
          <option value="scaling">Scaling Existing Operations</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-[6px] text-[11px] font-semibold tracking-[0.08em] uppercase transition-all duration-400 hover:shadow-[0_0_24px_rgba(200,184,154,0.08)] active:scale-[0.99] mt-1 disabled:opacity-50"
          style={{ background: ACCENT, color: DEEP, fontFamily: "var(--font-sans)" }}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
}

function Engage() {
  return (
    <Section id="engage">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[820px] h-[420px] opacity-[0.018] pointer-events-none" style={{ background: `radial-gradient(ellipse, ${ACCENT}, transparent 55%)` }} />
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Label>Engage</Label>
          </Reveal>
          <Reveal delay={0.04}>
            <h2 className="text-[clamp(2.1rem,5.2vw,3.8rem)] leading-[1.02] tracking-[-0.025em]" style={{ fontFamily: "var(--font-display)" }}>
              <span style={{ color: IVORY }}>This is where we determine</span>
              <br />
              <span style={{ color: STONE }}>whether your operation should own its infrastructure.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[390px] text-[14px] leading-[1.95]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              We do not sell a generic product. We assess operational fit, infrastructure need, and control requirements. If the business should not be running on rented tools, we define the replacement architecture.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-10 space-y-3.5">
              {[
                "Private operational assessment",
                "Infrastructure gap diagnosis",
                "Custom system scope and timeline",
                "Ownership model and deployment review",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-[3px] h-[3px] rounded-full" style={{ background: ACCENT }} />
                  <span className="text-[12px]" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <EngageForm />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ─── CLOSING ─── */
function ClosingStatement() {
  return (
    <Section noPad>
      <div className="py-32 md:py-40 text-center relative">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${ACCENT}, transparent 50%)` }} />
        <Reveal>
          <p className="text-[clamp(1.3rem,3.2vw,2rem)] leading-[1.45] tracking-[-0.01em] max-w-[640px] mx-auto relative" style={{ color: STONE, fontFamily: "var(--font-display)", fontWeight: 300 }}>
            The market tolerates rented tools until scale, diligence, or failure exposes the weakness.
            <br />
            <span style={{ color: ACCENT }}>Infrastructure is what serious operators own.</span>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="py-16" style={{ borderTop: `1px solid ${BORDER}`, background: DEEP }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-[26px] h-[26px] rounded-[5px] flex items-center justify-center" style={{ border: `1px solid rgba(200,184,154,0.3)` }}>
                <span className="text-[7.5px] font-semibold" style={{ color: ACCENT, fontFamily: "var(--font-sans)" }}>
                  LCG
                </span>
              </div>
              <span className="text-[12.5px] font-medium tracking-[0.02em]" style={{ color: IVORY, fontFamily: "var(--font-sans)" }}>
                Lane Campos Group
              </span>
            </div>
            <p className="text-[11px] leading-[1.72]" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              Private Operating Infrastructure
              <br />for serious operators.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[9px] tracking-[0.25em] uppercase font-semibold mb-4" style={{ color: STONE, fontFamily: "var(--font-sans)" }}>
              Navigation
            </p>
            {[
              { label: "Diagnosis", href: "#diagnosis" },
              { label: "System", href: "#system" },
              { label: "Architecture", href: "#architecture" },
              { label: "Execution", href: "#execution" },
              { label: "Engage", href: "#engage" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="block text-[11px] mb-2.5 transition-colors duration-300 hover:text-white/35" style={{ color: STONE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="md:col-span-5 md:text-right">
            <p className="text-[9px] tracking-[0.25em] uppercase font-semibold mb-4" style={{ color: STONE, fontFamily: "var(--font-sans)" }}>
              Contact
            </p>
            <a href="mailto:contact@lanecamposgroup.com" className="text-[11.5px] transition-colors duration-300 hover:text-white/35 block mb-6" style={{ color: SMOKE, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              contact@lanecamposgroup.com
            </a>
            <p className="text-[9.5px]" style={{ color: "rgba(255,255,255,0.06)", fontFamily: "var(--font-sans)", fontWeight: 300 }}>
              © {new Date().getFullYear()} Lane Campos Group
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ─── */
export default function Page() {
  return (
    <div className="min-h-screen antialiased" style={{ background: DEEP, color: IVORY }}>
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        body { background: ${DEEP}; }

        ::selection {
          background: rgba(200,184,154,0.16);
          color: white;
        }

        input::placeholder, textarea::placeholder {
          color: ${STONE};
          font-family: var(--font-sans);
          font-weight: 300;
        }

        select option {
          background: ${SURFACE};
          color: ${IVORY};
        }

        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: ${DEEP}; }
        ::-webkit-scrollbar-thumb { background: rgba(200,184,154,0.06); border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(200,184,154,0.12); }

        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>

      <Navbar />
      <Hero />
      <SectionLine />
      <Diagnosis />
      <SectionLine />
      <SystemLayers />
      <SectionLine />
      <Engineering />
      <SectionLine />
      <RealityCheck />
      <SectionLine />
      <Execution />
      <SectionLine />
      <StrategicValue />
      <SectionLine />
      <Domains />
      <SectionLine />
      <Engage />
      <SectionLine />
      <ClosingStatement />
      <Footer />
    </div>
  );
}
