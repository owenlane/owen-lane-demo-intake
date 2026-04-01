"use client";
import { useState, useEffect, useRef } from "react";

// ─── COLOR SYSTEM ───────────────────────────────────────────────
const C = {
  white: "#FFFFFF",
  offWhite: "#F8F9FB",
  bg: "#F1F3F7",
  navy: "#1B2A4A",
  navyLight: "#2C3E6B",
  navyMuted: "#3D5280",
  gold: "#C6A55C",
  goldLight: "#D4B978",
  goldSubtle: "rgba(198,165,92,0.08)",
  goldBorder: "rgba(198,165,92,0.25)",
  silver: "#8A92A6",
  silverLight: "#B0B7C8",
  silverBorder: "#D8DCE6",
  silverBg: "#ECEEF3",
  text: "#1B2A4A",
  textSecondary: "#5A6478",
  textMuted: "#8A92A6",
  success: "#2D8F5E",
  successBg: "#E8F5EE",
  warning: "#C6873E",
  warningBg: "#FDF3E7",
  danger: "#C0392B",
  dangerBg: "#FDECEA",
  info: "#2980B9",
  infoBg: "#E8F0FA",
};

// ─── TYPOGRAPHY ────────────────────────────────────────────────
const font = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', monospace",
};

// ─── SPACING ───────────────────────────────────────────────────
const sp = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48 };
const radius = { sm: 4, md: 6, lg: 8, xl: 12 };

// ─── ICON COMPONENTS ───────────────────────────────────────────
const Icon = ({ name, size = 18, color = C.silver }) => {
  const icons = {
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    patients: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    tooth: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 2C8 2 5 5 5 8c0 2 .5 3.5 1 5 .8 2.5 1.5 5 2 7 .3 1 1.2 1 1.5 0 .5-1.5 1-3 2.5-3s2 1.5 2.5 3c.3 1 1.2 1 1.5 0 .5-2 1.2-4.5 2-7 .5-1.5 1-3 1-5 0-3-3-6-7-6z"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-9-11h2m18 0h2m-3.3-6.7l-1.4 1.4M6.7 17.3l-1.4 1.4m0-11.4l1.4 1.4m10.6 10.6l1.4 1.4"/></svg>,
    billing: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
    imaging: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
    rx: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M4 4h6a4 4 0 010 8H4V4zm0 8l6 8m-2-4l4 4"/></svg>,
    lab: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M9 3v7.2L4.8 18.4A2 2 0 006.5 21h11a2 2 0 001.7-2.6L15 10.2V3"/><path d="M7 3h10"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    file: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>,
    clip: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
    dots: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    arrowRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
    printer: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
    map: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  };
  return icons[name] || null;
};

// ─── STYLES ────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${font.body}; color: ${C.text}; background: ${C.bg}; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.silverBorder}; border-radius: 10px; }
  ::selection { background: ${C.goldSubtle}; color: ${C.navy}; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
`;

// ─── SIDEBAR NAV ITEMS ─────────────────────────────────────────
const navSections = [
  { label: "MAIN", items: [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "patients", icon: "patients", label: "Patients" },
    { id: "scheduling", icon: "calendar", label: "Scheduling" },
    { id: "clinical", icon: "tooth", label: "Clinical" },
  ]},
  { label: "RECORDS", items: [
    { id: "imaging", icon: "imaging", label: "Imaging" },
    { id: "treatment", icon: "rx", label: "Treatment Plans" },
    { id: "prescriptions", icon: "lab", label: "Prescriptions" },
    { id: "lab_orders", icon: "lab", label: "Lab Orders" },
  ]},
  { label: "OPERATIONS", items: [
    { id: "billing", icon: "billing", label: "Billing" },
    { id: "insurance", icon: "shield", label: "Insurance" },
    { id: "reports", icon: "chart", label: "Reports" },
    { id: "communications", icon: "mail", label: "Communications" },
  ]},
  { label: "SYSTEM", items: [
    { id: "staff", icon: "user", label: "Staff" },
    { id: "settings", icon: "settings", label: "Settings" },
    { id: "compliance", icon: "lock", label: "Compliance" },
  ]},
];

// ─── MOCK DATA ─────────────────────────────────────────────────
const todayPatients = [
  { id: "P-10482", name: "Sarah Mitchell", time: "9:00 AM", type: "Crown Prep", status: "In Chair", chair: 3 },
  { id: "P-10291", name: "James Rodriguez", time: "9:30 AM", type: "Root Canal", status: "Waiting", chair: null },
  { id: "P-10855", name: "Emily Chen", time: "10:00 AM", type: "Cleaning", status: "Checked In", chair: null },
  { id: "P-10103", name: "Robert Williams", time: "10:30 AM", type: "Implant Consult", status: "Confirmed", chair: null },
  { id: "P-10672", name: "Maria Santos", time: "11:00 AM", type: "Veneer Fitting", status: "Confirmed", chair: null },
  { id: "P-10945", name: "David Kim", time: "11:30 AM", type: "Extraction", status: "Confirmed", chair: null },
  { id: "P-10334", name: "Lisa Thompson", time: "1:00 PM", type: "Whitening", status: "Confirmed", chair: null },
  { id: "P-10567", name: "Michael Brown", time: "1:30 PM", type: "Bridge Work", status: "Confirmed", chair: null },
];

const revenueData = [
  { month: "Oct", value: 142000 }, { month: "Nov", value: 158000 }, { month: "Dec", value: 134000 },
  { month: "Jan", value: 167000 }, { month: "Feb", value: 178000 }, { month: "Mar", value: 192000 },
];

const allPatients = [
  { id: "P-10482", name: "Sarah Mitchell", dob: "03/15/1987", phone: "(702) 555-0142", lastVisit: "03/28/2026", nextVisit: "04/15/2026", balance: 450, insurance: "Delta Dental PPO" },
  { id: "P-10291", name: "James Rodriguez", dob: "07/22/1975", phone: "(702) 555-0198", lastVisit: "03/25/2026", nextVisit: "03/31/2026", balance: 0, insurance: "Cigna DHMO" },
  { id: "P-10855", name: "Emily Chen", dob: "11/03/1992", phone: "(702) 555-0267", lastVisit: "02/10/2026", nextVisit: "03/31/2026", balance: 125, insurance: "MetLife" },
  { id: "P-10103", name: "Robert Williams", dob: "05/30/1968", phone: "(702) 555-0311", lastVisit: "03/01/2026", nextVisit: "03/31/2026", balance: 2300, insurance: "Aetna PPO" },
  { id: "P-10672", name: "Maria Santos", dob: "09/18/1990", phone: "(702) 555-0455", lastVisit: "03/20/2026", nextVisit: "03/31/2026", balance: 780, insurance: "Guardian" },
  { id: "P-10945", name: "David Kim", dob: "01/12/1983", phone: "(702) 555-0523", lastVisit: "03/15/2026", nextVisit: "03/31/2026", balance: 0, insurance: "Delta Dental PPO" },
  { id: "P-10334", name: "Lisa Thompson", dob: "06/25/1995", phone: "(702) 555-0677", lastVisit: "01/22/2026", nextVisit: "03/31/2026", balance: 0, insurance: "United Concordia" },
  { id: "P-10567", name: "Michael Brown", dob: "12/08/1979", phone: "(702) 555-0744", lastVisit: "03/10/2026", nextVisit: "03/31/2026", balance: 1650, insurance: "Cigna DPPO" },
  { id: "P-10789", name: "Jennifer Adams", dob: "04/17/1988", phone: "(702) 555-0891", lastVisit: "02/28/2026", nextVisit: "04/05/2026", balance: 350, insurance: "Delta Dental PPO" },
  { id: "P-10234", name: "Thomas Garcia", dob: "08/09/1972", phone: "(702) 555-0935", lastVisit: "03/22/2026", nextVisit: "04/10/2026", balance: 0, insurance: "Aetna PPO" },
];

// ─── REUSABLE COMPONENTS ───────────────────────────────────────

const Card = ({ children, style, padding = sp.xl, hover = false }) => (
  <div style={{
    background: C.white, borderRadius: radius.xl, padding,
    border: `1px solid ${C.silverBorder}`,
    transition: "box-shadow 0.2s, border-color 0.2s",
    ...(hover ? { cursor: "pointer" } : {}),
    ...style
  }}
    onMouseEnter={e => { if (hover) { e.currentTarget.style.boxShadow = "0 4px 16px rgba(27,42,74,0.06)"; e.currentTarget.style.borderColor = C.silverLight; } }}
    onMouseLeave={e => { if (hover) { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.silverBorder; } }}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: { bg: C.silverBg, color: C.textSecondary, border: C.silverBorder },
    success: { bg: C.successBg, color: C.success, border: "transparent" },
    warning: { bg: C.warningBg, color: C.warning, border: "transparent" },
    danger: { bg: C.dangerBg, color: C.danger, border: "transparent" },
    info: { bg: C.infoBg, color: C.info, border: "transparent" },
    gold: { bg: C.goldSubtle, color: C.gold, border: C.goldBorder },
    navy: { bg: C.navy, color: C.white, border: "transparent" },
  };
  const v = variants[variant] || variants.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 10px",
      borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
      background: v.bg, color: v.color, border: `1px solid ${v.border}`,
      fontFamily: font.body, lineHeight: "16px", whiteSpace: "nowrap"
    }}>{children}</span>
  );
};

const StatusDot = ({ status }) => {
  const colors = { "In Chair": C.success, "Waiting": C.warning, "Checked In": C.info, "Confirmed": C.silverLight, "Completed": C.success };
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors[status] || C.silver, display: "inline-block", marginRight: 6 }} />;
};

const Button = ({ children, variant = "primary", size = "md", icon, onClick, style: customStyle }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6, border: "none", cursor: "pointer",
    fontFamily: font.body, fontWeight: 500, borderRadius: radius.md, transition: "all 0.15s",
    lineHeight: 1, whiteSpace: "nowrap",
  };
  const sizes = {
    sm: { padding: "7px 12px", fontSize: 12 },
    md: { padding: "9px 16px", fontSize: 13 },
    lg: { padding: "11px 20px", fontSize: 14 },
  };
  const variants = {
    primary: { background: C.navy, color: C.white },
    gold: { background: C.gold, color: C.white },
    outline: { background: "transparent", color: C.navy, border: `1px solid ${C.silverBorder}` },
    ghost: { background: "transparent", color: C.textSecondary },
    danger: { background: C.danger, color: C.white },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...customStyle }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    >
      {icon && <Icon name={icon} size={sizes[size].fontSize} color={variants[variant].color} />}
      {children}
    </button>
  );
};

const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.lg }}>
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: C.navy, fontFamily: font.body, letterSpacing: -0.3 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const StatCard = ({ label, value, change, icon, accent = false }) => (
  <Card style={accent ? { borderLeft: `3px solid ${C.gold}` } : {}}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 700, color: C.navy, marginTop: 6, fontFamily: font.body, letterSpacing: -0.5 }}>{value}</p>
        {change && (
          <p style={{ fontSize: 12, color: change.startsWith("+") ? C.success : C.danger, marginTop: 4, fontWeight: 500 }}>
            {change} <span style={{ color: C.textMuted, fontWeight: 400 }}>vs last month</span>
          </p>
        )}
      </div>
      <div style={{ width: 40, height: 40, borderRadius: radius.lg, background: accent ? C.goldSubtle : C.offWhite, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={18} color={accent ? C.gold : C.silver} />
      </div>
    </div>
  </Card>
);

const MiniChart = ({ data, color = C.navy, height = 60 }) => {
  const max = Math.max(...data.map(d => d.value));
  const w = 100 / data.length;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", maxWidth: 32, borderRadius: 3,
            background: i === data.length - 1 ? C.gold : color,
            opacity: i === data.length - 1 ? 1 : 0.15 + (0.85 * d.value / max),
            height: `${(d.value / max) * 100}%`, minHeight: 4,
            transition: "height 0.4s ease"
          }} />
          <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 500 }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
};

const Table = ({ columns, rows, onRowClick }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: `2px solid ${C.silverBorder}` }}>
          {columns.map((col, i) => (
            <th key={i} style={{
              textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600,
              color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap"
            }}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}
            onClick={() => onRowClick?.(row)}
            style={{
              borderBottom: `1px solid ${C.silverBorder}`, cursor: onRowClick ? "pointer" : "default",
              transition: "background 0.1s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.offWhite; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            {columns.map((col, ci) => (
              <td key={ci} style={{ padding: "11px 12px", color: C.text, whiteSpace: "nowrap" }}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${C.silverBorder}`, marginBottom: sp.xl }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        padding: "10px 18px", fontSize: 13, fontWeight: active === t.id ? 600 : 400,
        color: active === t.id ? C.navy : C.textMuted, background: "transparent", border: "none",
        borderBottom: `2px solid ${active === t.id ? C.gold : "transparent"}`, cursor: "pointer",
        fontFamily: font.body, transition: "all 0.15s", marginBottom: -2
      }}>{t.label}</button>
    ))}
  </div>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <div style={{ textAlign: "center", padding: "48px 24px" }}>
    <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.offWhite, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
      <Icon name={icon} size={24} color={C.silverLight} />
    </div>
    <p style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{title}</p>
    <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{subtitle}</p>
  </div>
);

const ProgressBar = ({ value, max = 100, color = C.navy }) => (
  <div style={{ height: 6, background: C.silverBg, borderRadius: 3, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
  </div>
);

const Avatar = ({ name, size = 32 }) => {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: C.navy, color: C.white,
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38,
      fontWeight: 600, fontFamily: font.body, letterSpacing: 0.5, flexShrink: 0
    }}>{initials}</div>
  );
};

const InputField = ({ label, placeholder, value, onChange, type = "text", style: s }) => (
  <div style={{ marginBottom: sp.lg, ...s }}>
    {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textSecondary, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</label>}
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{
      width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${C.silverBorder}`,
      borderRadius: radius.md, color: C.text, fontFamily: font.body, outline: "none",
      transition: "border-color 0.15s", background: C.white
    }}
      onFocus={e => { e.target.style.borderColor = C.navyMuted; }}
      onBlur={e => { e.target.style.borderColor = C.silverBorder; }}
    />
  </div>
);

// ─── SCREEN COMPONENTS ─────────────────────────────────────────

// SCREEN 1: Dashboard
const DashboardScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy, fontFamily: font.body }}>Good morning, Dr. Persky</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Monday, March 31, 2026 · 8 patients scheduled today</p>
      </div>
      <Button variant="gold" icon="plus">New Appointment</Button>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: sp.lg, marginBottom: sp.xxl }}>
      <StatCard label="Today's Patients" value="8" change="+2" icon="patients" accent />
      <StatCard label="Monthly Revenue" value="$192,340" change="+8.2%" icon="chart" />
      <StatCard label="Pending Claims" value="14" change="-3" icon="shield" />
      <StatCard label="Completion Rate" value="94%" change="+2.1%" icon="check" />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: sp.lg }}>
      <Card>
        <SectionHeader title="Today's Schedule" subtitle="Dr. Persky · Chair 1-4" action={<Button variant="outline" size="sm">View Full Schedule</Button>} />
        <Table
          columns={[
            { label: "Time", key: "time" },
            { label: "Patient", render: r => <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={r.name} size={26} /><span style={{ fontWeight: 500 }}>{r.name}</span></div> },
            { label: "Procedure", key: "type" },
            { label: "Status", render: r => <span style={{ display: "flex", alignItems: "center" }}><StatusDot status={r.status} />{r.status}</span> },
            { label: "Chair", render: r => r.chair ? <Badge variant="navy">Chair {r.chair}</Badge> : <span style={{ color: C.textMuted }}>—</span> },
          ]}
          rows={todayPatients}
        />
      </Card>
      <div style={{ display: "flex", flexDirection: "column", gap: sp.lg }}>
        <Card>
          <SectionHeader title="Revenue Trend" subtitle="Last 6 months" />
          <MiniChart data={revenueData} height={80} />
        </Card>
        <Card>
          <SectionHeader title="Alerts" />
          <div style={{ display: "flex", flexDirection: "column", gap: sp.sm }}>
            {[
              { text: "Lab case ready — Sarah Mitchell (Crown #14)", variant: "success" },
              { text: "Insurance pre-auth expiring — Robert Williams", variant: "warning" },
              { text: "Overdue balance — Michael Brown ($1,650)", variant: "danger" },
            ].map((a, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: radius.md, background: a.variant === "success" ? C.successBg : a.variant === "warning" ? C.warningBg : C.dangerBg, fontSize: 12, color: a.variant === "success" ? C.success : a.variant === "warning" ? C.warning : C.danger, fontWeight: 500 }}>
                {a.text}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Quick Actions" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp.sm }}>
            {[
              { icon: "plus", label: "New Patient" },
              { icon: "calendar", label: "Schedule" },
              { icon: "rx", label: "Prescribe" },
              { icon: "billing", label: "Charge" },
            ].map((a, i) => (
              <button key={i} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", border: `1px solid ${C.silverBorder}`,
                borderRadius: radius.md, background: C.white, cursor: "pointer", fontFamily: font.body, fontSize: 12,
                fontWeight: 500, color: C.textSecondary, transition: "all 0.15s"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.goldSubtle; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.silverBorder; e.currentTarget.style.background = C.white; }}
              >
                <Icon name={a.icon} size={14} color={C.navy} />{a.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
);

// SCREEN 2: Patient List
const PatientListScreen = ({ onSelectPatient }) => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const filtered = allPatients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Patient Management</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{allPatients.length} active patients · Dr. Persky's practice</p>
        </div>
        <div style={{ display: "flex", gap: sp.sm }}>
          <Button variant="outline" icon="download" size="sm">Export</Button>
          <Button variant="gold" icon="plus">Add Patient</Button>
        </div>
      </div>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.lg }}>
          <div style={{ position: "relative", width: 300 }}>
            <Icon name="search" size={15} color={C.silverLight} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients by name or ID…"
              style={{
                width: "100%", padding: "8px 12px 8px 32px", fontSize: 13, border: `1px solid ${C.silverBorder}`,
                borderRadius: radius.md, color: C.text, fontFamily: font.body, outline: "none", background: C.white, position: "relative"
              }}
            />
            <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <Icon name="search" size={14} color={C.silverLight} />
            </div>
          </div>
          <TabBar tabs={[{ id: "all", label: "All Patients" }, { id: "scheduled", label: "Scheduled Today" }, { id: "balance", label: "Outstanding Balance" }]} active={tab} onChange={setTab} />
        </div>
        <Table
          columns={[
            { label: "ID", render: r => <span style={{ fontFamily: font.mono, fontSize: 11, color: C.textMuted }}>{r.id}</span> },
            { label: "Patient", render: r => <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={r.name} size={28} /><div><p style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</p><p style={{ fontSize: 11, color: C.textMuted }}>{r.dob}</p></div></div> },
            { label: "Phone", key: "phone" },
            { label: "Insurance", key: "insurance" },
            { label: "Last Visit", key: "lastVisit" },
            { label: "Next Visit", key: "nextVisit" },
            { label: "Balance", render: r => <span style={{ fontWeight: 600, color: r.balance > 0 ? C.danger : C.success }}>{r.balance > 0 ? `$${r.balance.toLocaleString()}` : "Paid"}</span> },
          ]}
          rows={tab === "balance" ? filtered.filter(p => p.balance > 0) : tab === "scheduled" ? filtered.slice(0, 6) : filtered}
          onRowClick={onSelectPatient}
        />
      </Card>
    </div>
  );
};

// SCREEN 3: Patient Detail / Chart
const PatientDetailScreen = ({ patient }) => {
  const p = patient || allPatients[0];
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <Card style={{ marginBottom: sp.lg }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: sp.lg, alignItems: "center" }}>
            <Avatar name={p.name} size={52} />
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>{p.name}</h1>
              <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{p.id} · DOB: {p.dob} · Provider: Dr. Persky</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: sp.sm }}>
            <Button variant="outline" size="sm" icon="printer">Print Chart</Button>
            <Button variant="outline" size="sm" icon="mail">Message</Button>
            <Button variant="gold" size="sm" icon="calendar">Schedule</Button>
          </div>
        </div>
      </Card>

      <TabBar tabs={[
        { id: "overview", label: "Overview" }, { id: "clinical", label: "Clinical Notes" },
        { id: "treatment", label: "Treatment Plan" }, { id: "imaging", label: "Imaging" },
        { id: "billing", label: "Billing" }, { id: "documents", label: "Documents" },
      ]} active={tab} onChange={setTab} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: sp.lg, marginBottom: sp.lg }}>
        <Card>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: sp.md }}>Contact</p>
          <div style={{ display: "flex", flexDirection: "column", gap: sp.sm, fontSize: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="phone" size={14} color={C.silver} />{p.phone}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="mail" size={14} color={C.silver} />patient@email.com</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="map" size={14} color={C.silver} />Las Vegas, NV 89101</div>
          </div>
        </Card>
        <Card>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: sp.md }}>Insurance</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{p.insurance}</p>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Group: GRP-44218 · Member: {p.id}</p>
          <div style={{ marginTop: sp.md }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: C.textMuted }}>Annual Max Used</span>
              <span style={{ fontWeight: 600 }}>$1,250 / $2,000</span>
            </div>
            <ProgressBar value={62.5} color={C.navy} />
          </div>
        </Card>
        <Card>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: sp.md }}>Account</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: p.balance > 0 ? C.danger : C.success }}>{p.balance > 0 ? `$${p.balance} Outstanding` : "Paid in Full"}</p>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Last payment: 03/15/2026</p>
          <div style={{ marginTop: sp.md, display: "flex", gap: sp.sm }}>
            <Button variant="outline" size="sm">View Ledger</Button>
            {p.balance > 0 && <Button variant="gold" size="sm">Collect</Button>}
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: sp.lg }}>
        <Card>
          <SectionHeader title="Treatment History" action={<Button variant="outline" size="sm" icon="plus">Add Entry</Button>} />
          <Table columns={[
            { label: "Date", key: "date" },
            { label: "Procedure", key: "proc" },
            { label: "Tooth", key: "tooth" },
            { label: "Provider", key: "provider" },
            { label: "Status", render: r => <Badge variant={r.status === "Completed" ? "success" : "warning"}>{r.status}</Badge> },
          ]} rows={[
            { date: "03/28/2026", proc: "Crown Prep D2740", tooth: "#14", provider: "Dr. Persky", status: "Completed" },
            { date: "03/15/2026", proc: "Core Buildup D2950", tooth: "#14", provider: "Dr. Persky", status: "Completed" },
            { date: "02/10/2026", proc: "Root Canal D3330", tooth: "#14", provider: "Dr. Persky", status: "Completed" },
            { date: "01/22/2026", proc: "Periodic Exam D0120", tooth: "—", provider: "Dr. Persky", status: "Completed" },
            { date: "01/22/2026", proc: "Prophylaxis D1110", tooth: "—", provider: "Dr. Persky", status: "Completed" },
          ]} />
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: sp.lg }}>
          <Card>
            <SectionHeader title="Alerts & Notes" />
            <div style={{ display: "flex", flexDirection: "column", gap: sp.sm }}>
              <div style={{ padding: 10, borderRadius: radius.md, background: C.warningBg, fontSize: 12, color: C.warning, fontWeight: 500 }}>Penicillin Allergy</div>
              <div style={{ padding: 10, borderRadius: radius.md, background: C.infoBg, fontSize: 12, color: C.info, fontWeight: 500 }}>Pre-med required (Mitral Valve)</div>
              <div style={{ padding: 10, borderRadius: radius.md, background: C.silverBg, fontSize: 12, color: C.textSecondary }}>Patient prefers morning appointments</div>
            </div>
          </Card>
          <Card>
            <SectionHeader title="Upcoming" />
            <div style={{ display: "flex", flexDirection: "column", gap: sp.md }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.silverBorder}` }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>Crown Seat #14</p>
                  <p style={{ fontSize: 11, color: C.textMuted }}>Dr. Persky · Chair 3</p>
                </div>
                <Badge variant="gold">Apr 15</Badge>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>6-Month Recall</p>
                  <p style={{ fontSize: 11, color: C.textMuted }}>Dr. Persky · Hygiene</p>
                </div>
                <Badge>Jul 22</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// SCREEN 4: Scheduling
const SchedulingScreen = () => {
  const hours = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
  const chairs = ["Chair 1", "Chair 2", "Chair 3", "Chair 4"];
  const appts = [
    { chair: 0, start: 1, dur: 2, name: "Sarah Mitchell", proc: "Crown Prep", color: C.navy },
    { chair: 1, start: 1, dur: 1, name: "James Rodriguez", proc: "Root Canal", color: C.navyLight },
    { chair: 2, start: 2, dur: 1, name: "Emily Chen", proc: "Cleaning", color: C.navyMuted },
    { chair: 0, start: 4, dur: 1, name: "Maria Santos", proc: "Veneer Fitting", color: C.navy },
    { chair: 3, start: 3, dur: 2, name: "David Kim", proc: "Extraction", color: C.navyLight },
    { chair: 1, start: 5, dur: 1, name: "Lisa Thompson", proc: "Whitening", color: C.navyMuted },
    { chair: 2, start: 5, dur: 2, name: "Michael Brown", proc: "Bridge Work", color: C.navy },
  ];
  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Schedule</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Monday, March 31, 2026 · Dr. Persky</p>
        </div>
        <div style={{ display: "flex", gap: sp.sm }}>
          <Button variant="outline" size="sm">Week View</Button>
          <Button variant="gold" icon="plus">New Appointment</Button>
        </div>
      </div>
      <Card padding={0}>
        <div style={{ display: "grid", gridTemplateColumns: "80px repeat(4, 1fr)", minHeight: 500 }}>
          <div style={{ borderRight: `1px solid ${C.silverBorder}` }}>
            <div style={{ height: 44, borderBottom: `1px solid ${C.silverBorder}` }} />
            {hours.map((h, i) => (
              <div key={i} style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 12, fontSize: 11, color: C.textMuted, fontWeight: 500, borderBottom: `1px solid ${C.silverBorder}` }}>
                {h}
              </div>
            ))}
          </div>
          {chairs.map((chair, ci) => (
            <div key={ci} style={{ borderRight: ci < 3 ? `1px solid ${C.silverBorder}` : "none", position: "relative" }}>
              <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.navy, borderBottom: `1px solid ${C.silverBorder}`, background: C.offWhite }}>
                {chair}
              </div>
              {hours.map((_, hi) => (
                <div key={hi} style={{ height: 56, borderBottom: `1px solid ${C.silverBorder}` }} />
              ))}
              {appts.filter(a => a.chair === ci).map((a, ai) => (
                <div key={ai} style={{
                  position: "absolute", top: 44 + (a.start * 56) + 3, left: 3, right: 3,
                  height: a.dur * 56 - 6, background: a.color, borderRadius: radius.md,
                  padding: "6px 8px", cursor: "pointer", overflow: "hidden",
                  display: "flex", flexDirection: "column", justifyContent: "center"
                }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: C.white, lineHeight: 1.3 }}>{a.name}</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>{a.proc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// SCREEN 5: Clinical Notes
const ClinicalScreen = () => {
  const [tab, setTab] = useState("active");
  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Clinical Notes</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Dr. Persky · Today's encounters</p>
        </div>
        <Button variant="gold" icon="plus">New Note</Button>
      </div>
      <TabBar tabs={[{ id: "active", label: "In Progress" }, { id: "completed", label: "Completed Today" }, { id: "unsigned", label: "Unsigned (3)" }]} active={tab} onChange={setTab} />
      <div style={{ display: "flex", flexDirection: "column", gap: sp.lg }}>
        {[
          { patient: "Sarah Mitchell", id: "P-10482", proc: "Crown Prep D2740 #14", time: "9:00 AM", status: "In Progress", note: "Tooth prepared for PFM crown. Impression taken with digital scanner. Temp crown placed with TempBond. Patient tolerated well." },
          { patient: "James Rodriguez", id: "P-10291", proc: "Root Canal D3330 #19", time: "9:30 AM", status: "Waiting", note: "" },
          { patient: "Emily Chen", id: "P-10855", proc: "Prophylaxis D1110", time: "10:00 AM", status: "Checked In", note: "" },
        ].map((n, i) => (
          <Card key={i} hover>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: sp.md, alignItems: "flex-start" }}>
                <Avatar name={n.patient} size={36} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: sp.sm }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{n.patient}</p>
                    <Badge variant={n.status === "In Progress" ? "gold" : n.status === "Waiting" ? "warning" : "info"}>{n.status}</Badge>
                  </div>
                  <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{n.id} · {n.proc} · {n.time}</p>
                  {n.note && <p style={{ fontSize: 13, color: C.textSecondary, marginTop: sp.md, lineHeight: 1.6, maxWidth: 600 }}>{n.note}</p>}
                  {!n.note && <p style={{ fontSize: 12, color: C.textMuted, marginTop: sp.sm, fontStyle: "italic" }}>No clinical notes entered</p>}
                </div>
              </div>
              <div style={{ display: "flex", gap: sp.sm }}>
                <Button variant="outline" size="sm">Open Chart</Button>
                <Button variant="primary" size="sm">Write Note</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// SCREEN 6: Imaging
const ImagingScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Imaging Center</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Digital radiography & intraoral imaging · Dr. Persky</p>
      </div>
      <div style={{ display: "flex", gap: sp.sm }}>
        <Button variant="outline" size="sm" icon="filter">Filter</Button>
        <Button variant="gold" icon="plus">Capture Image</Button>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: sp.lg }}>
      <Card>
        <SectionHeader title="Recent Patients" />
        {["Sarah Mitchell", "James Rodriguez", "Emily Chen", "Robert Williams", "Maria Santos"].map((name, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: sp.md, padding: "10px 8px", borderRadius: radius.md,
            cursor: "pointer", transition: "background 0.1s",
            background: i === 0 ? C.goldSubtle : "transparent",
            borderLeft: i === 0 ? `3px solid ${C.gold}` : "3px solid transparent"
          }}>
            <Avatar name={name} size={28} />
            <div>
              <p style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: C.navy }}>{name}</p>
              <p style={{ fontSize: 11, color: C.textMuted }}>{8 - i} images</p>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <SectionHeader title="Sarah Mitchell — Imaging" subtitle="8 images on file" action={<Button variant="outline" size="sm" icon="download">Export</Button>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: sp.md }}>
          {["FMX Pano", "PA #14", "PA #19", "BW Right", "BW Left", "PA #30", "Periapical #3", "CBCT Slice"].map((label, i) => (
            <div key={i} style={{
              aspectRatio: "4/3", background: C.navy, borderRadius: radius.lg, display: "flex",
              flexDirection: "column", justifyContent: "flex-end", padding: sp.md, cursor: "pointer",
              position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(27,42,74,0.9))", zIndex: 1 }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.15 }}>
                <Icon name="imaging" size={40} color={C.white} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.white, position: "relative", zIndex: 2 }}>{label}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", position: "relative", zIndex: 2 }}>03/{28 - i}/2026</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// SCREEN 7: Treatment Plans
const TreatmentScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Treatment Plans</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Active treatment plans · Dr. Persky</p>
      </div>
      <Button variant="gold" icon="plus">New Plan</Button>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: sp.lg }}>
      {[
        { patient: "Sarah Mitchell", plan: "Posterior Crown Restoration", phases: 3, completed: 2, total: 4850, remaining: 1200, urgency: "Active" },
        { patient: "Robert Williams", plan: "Full Mouth Implant Rehabilitation", phases: 5, completed: 1, total: 28500, remaining: 22800, urgency: "Active" },
        { patient: "Maria Santos", plan: "Anterior Veneer Set (6 units)", phases: 3, completed: 1, total: 9600, remaining: 7200, urgency: "Scheduled" },
        { patient: "Michael Brown", plan: "Fixed Bridge #18-20", phases: 4, completed: 0, total: 5200, remaining: 5200, urgency: "Pending Approval" },
      ].map((tp, i) => (
        <Card key={i} hover>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: sp.md, alignItems: "flex-start" }}>
              <Avatar name={tp.patient} size={40} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: sp.sm }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{tp.patient}</p>
                  <Badge variant={tp.urgency === "Active" ? "gold" : tp.urgency === "Scheduled" ? "info" : "default"}>{tp.urgency}</Badge>
                </div>
                <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>{tp.plan}</p>
                <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Provider: Dr. Persky · {tp.phases} phases</p>
                <div style={{ marginTop: sp.md, width: 300 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4, color: C.textMuted }}>
                    <span>Phase {tp.completed}/{tp.phases}</span>
                    <span>{Math.round((tp.completed / tp.phases) * 100)}% complete</span>
                  </div>
                  <ProgressBar value={tp.completed} max={tp.phases} color={C.gold} />
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>${tp.total.toLocaleString()}</p>
              <p style={{ fontSize: 12, color: C.textMuted }}>Remaining: ${tp.remaining.toLocaleString()}</p>
              <div style={{ marginTop: sp.md, display: "flex", gap: sp.sm, justifyContent: "flex-end" }}>
                <Button variant="outline" size="sm">View Plan</Button>
                <Button variant="primary" size="sm">Update</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// SCREEN 8: Prescriptions
const PrescriptionsScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Prescriptions</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>E-Prescribe · Dr. Persky, DDS</p>
      </div>
      <Button variant="gold" icon="plus">New Prescription</Button>
    </div>
    <Card>
      <Table columns={[
        { label: "Date", key: "date" },
        { label: "Patient", render: r => <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={r.patient} size={26} /><span style={{ fontWeight: 500 }}>{r.patient}</span></div> },
        { label: "Medication", render: r => <div><p style={{ fontWeight: 500 }}>{r.med}</p><p style={{ fontSize: 11, color: C.textMuted }}>{r.dosage}</p></div> },
        { label: "Quantity", key: "qty" },
        { label: "Pharmacy", key: "pharmacy" },
        { label: "Status", render: r => <Badge variant={r.status === "Sent" ? "success" : r.status === "Pending" ? "warning" : "default"}>{r.status}</Badge> },
      ]} rows={[
        { date: "03/31/2026", patient: "Sarah Mitchell", med: "Amoxicillin 500mg", dosage: "TID x 7 days", qty: "21", pharmacy: "CVS — Sahara Ave", status: "Sent" },
        { date: "03/31/2026", patient: "James Rodriguez", med: "Ibuprofen 600mg", dosage: "Q6H PRN pain", qty: "20", pharmacy: "Walgreens — Eastern", status: "Sent" },
        { date: "03/31/2026", patient: "David Kim", med: "Clindamycin 300mg", dosage: "QID x 7 days", qty: "28", pharmacy: "CVS — Sahara Ave", status: "Pending" },
        { date: "03/28/2026", patient: "Michael Brown", med: "Hydrocodone/APAP 5/325", dosage: "Q6H PRN pain", qty: "12", pharmacy: "Walgreens — Eastern", status: "Sent" },
        { date: "03/28/2026", patient: "Maria Santos", med: "Chlorhexidine Rinse 0.12%", dosage: "BID x 14 days", qty: "1", pharmacy: "CVS — Sahara Ave", status: "Sent" },
      ]} />
    </Card>
  </div>
);

// SCREEN 9: Lab Orders
const LabOrdersScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Lab Orders</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Dr. Persky · Prosthetics & restorations</p>
      </div>
      <Button variant="gold" icon="plus">New Lab Order</Button>
    </div>
    <Card>
      <Table columns={[
        { label: "Order #", render: r => <span style={{ fontFamily: font.mono, fontSize: 11 }}>{r.order}</span> },
        { label: "Patient", render: r => <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={r.patient} size={26} /><span style={{ fontWeight: 500 }}>{r.patient}</span></div> },
        { label: "Lab", key: "lab" },
        { label: "Item", key: "item" },
        { label: "Shade", key: "shade" },
        { label: "Sent", key: "sent" },
        { label: "Due", key: "due" },
        { label: "Status", render: r => <Badge variant={r.status === "Ready" ? "success" : r.status === "In Fabrication" ? "gold" : r.status === "Shipped" ? "info" : "default"}>{r.status}</Badge> },
      ]} rows={[
        { order: "LAB-4821", patient: "Sarah Mitchell", lab: "Glidewell", item: "PFM Crown #14", shade: "A2", sent: "03/28", due: "04/11", status: "Ready" },
        { order: "LAB-4820", patient: "Robert Williams", lab: "Ivoclar", item: "Custom Abutment #8", shade: "BL2", sent: "03/25", due: "04/08", status: "In Fabrication" },
        { order: "LAB-4819", patient: "Maria Santos", lab: "Glidewell", item: "Veneer x6 (#6-11)", shade: "BL1", sent: "03/22", due: "04/05", status: "Shipped" },
        { order: "LAB-4818", patient: "Michael Brown", lab: "Burbank Dental", item: "3-Unit Bridge #18-20", shade: "A3", sent: "03/20", due: "04/03", status: "In Fabrication" },
      ]} />
    </Card>
  </div>
);

// SCREEN 10: Billing
const BillingScreen = () => {
  const [tab, setTab] = useState("ledger");
  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Billing & Payments</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Dr. Persky's practice · Financial management</p>
        </div>
        <div style={{ display: "flex", gap: sp.sm }}>
          <Button variant="outline" size="sm" icon="download">Export</Button>
          <Button variant="gold" icon="plus">New Charge</Button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: sp.lg, marginBottom: sp.xxl }}>
        <StatCard label="Today's Production" value="$8,420" change="+12%" icon="chart" accent />
        <StatCard label="Collections MTD" value="$178,250" icon="billing" />
        <StatCard label="A/R Outstanding" value="$34,800" icon="clock" />
        <StatCard label="Claim Pending" value="$12,450" icon="shield" />
      </div>
      <Card>
        <TabBar tabs={[{ id: "ledger", label: "Ledger" }, { id: "claims", label: "Insurance Claims" }, { id: "aging", label: "Aging Report" }, { id: "payments", label: "Recent Payments" }]} active={tab} onChange={setTab} />
        <Table columns={[
          { label: "Date", key: "date" },
          { label: "Patient", render: r => <span style={{ fontWeight: 500 }}>{r.patient}</span> },
          { label: "Procedure", key: "proc" },
          { label: "Fee", render: r => <span style={{ fontWeight: 600 }}>${r.fee.toLocaleString()}</span> },
          { label: "Insurance", render: r => <span style={{ color: C.success }}>${r.ins.toLocaleString()}</span> },
          { label: "Patient Due", render: r => <span style={{ fontWeight: 600, color: r.due > 0 ? C.danger : C.textMuted }}>{r.due > 0 ? `$${r.due}` : "—"}</span> },
          { label: "Status", render: r => <Badge variant={r.status === "Paid" ? "success" : r.status === "Claim Sent" ? "info" : "warning"}>{r.status}</Badge> },
        ]} rows={[
          { date: "03/31", patient: "Sarah Mitchell", proc: "Crown Prep D2740", fee: 1200, ins: 840, due: 360, status: "Claim Sent" },
          { date: "03/31", patient: "James Rodriguez", proc: "Root Canal D3330", fee: 950, ins: 760, due: 190, status: "Claim Sent" },
          { date: "03/31", patient: "Emily Chen", proc: "Prophylaxis D1110", fee: 145, ins: 145, due: 0, status: "Paid" },
          { date: "03/28", patient: "David Kim", proc: "Extraction D7210", fee: 350, ins: 280, due: 70, status: "Paid" },
          { date: "03/28", patient: "Maria Santos", proc: "Veneer Prep D2962", fee: 1600, ins: 0, due: 1600, status: "Pending" },
        ]} />
      </Card>
    </div>
  );
};

// SCREEN 11: Insurance
const InsuranceScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Insurance Management</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Claims, eligibility & pre-authorizations · Dr. Persky</p>
      </div>
      <div style={{ display: "flex", gap: sp.sm }}>
        <Button variant="outline" size="sm">Verify Eligibility</Button>
        <Button variant="gold" icon="plus">New Claim</Button>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: sp.lg, marginBottom: sp.xxl }}>
      <StatCard label="Pending Claims" value="14" icon="clock" accent />
      <StatCard label="Approved This Month" value="38" icon="check" />
      <StatCard label="Denial Rate" value="4.2%" icon="shield" />
    </div>
    <Card>
      <SectionHeader title="Recent Claims" action={<Button variant="outline" size="sm" icon="filter">Filter</Button>} />
      <Table columns={[
        { label: "Claim #", render: r => <span style={{ fontFamily: font.mono, fontSize: 11 }}>{r.claim}</span> },
        { label: "Patient", render: r => <span style={{ fontWeight: 500 }}>{r.patient}</span> },
        { label: "Carrier", key: "carrier" },
        { label: "Submitted", key: "submitted" },
        { label: "Amount", render: r => <span style={{ fontWeight: 600 }}>${r.amount.toLocaleString()}</span> },
        { label: "Status", render: r => <Badge variant={r.status === "Paid" ? "success" : r.status === "Pending" ? "warning" : r.status === "Pre-Auth Required" ? "gold" : "danger"}>{r.status}</Badge> },
      ]} rows={[
        { claim: "CLM-89421", patient: "Sarah Mitchell", carrier: "Delta Dental PPO", submitted: "03/31", amount: 840, status: "Pending" },
        { claim: "CLM-89420", patient: "James Rodriguez", carrier: "Cigna DHMO", submitted: "03/31", amount: 760, status: "Pending" },
        { claim: "CLM-89419", patient: "Emily Chen", carrier: "MetLife", submitted: "03/31", amount: 145, status: "Paid" },
        { claim: "CLM-89418", patient: "Robert Williams", carrier: "Aetna PPO", submitted: "03/28", amount: 2800, status: "Pre-Auth Required" },
        { claim: "CLM-89417", patient: "David Kim", carrier: "Delta Dental PPO", submitted: "03/28", amount: 280, status: "Paid" },
        { claim: "CLM-89416", patient: "Lisa Thompson", carrier: "United Concordia", submitted: "03/25", amount: 350, status: "Denied" },
      ]} />
    </Card>
  </div>
);

// SCREEN 12: Reports / Analytics
const ReportsScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Reports & Analytics</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Practice performance · Dr. Persky</p>
      </div>
      <div style={{ display: "flex", gap: sp.sm }}>
        <Button variant="outline" size="sm">This Month</Button>
        <Button variant="outline" size="sm" icon="download">Export All</Button>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: sp.lg, marginBottom: sp.xxl }}>
      <StatCard label="Monthly Revenue" value="$192,340" change="+8.2%" icon="chart" accent />
      <StatCard label="New Patients" value="24" change="+6" icon="patients" />
      <StatCard label="Case Acceptance" value="78%" change="+3.2%" icon="check" />
      <StatCard label="Avg Production/Day" value="$9,617" change="+$540" icon="billing" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp.lg, marginBottom: sp.lg }}>
      <Card>
        <SectionHeader title="Revenue by Month" />
        <MiniChart data={revenueData} height={120} />
      </Card>
      <Card>
        <SectionHeader title="Production by Category" />
        <div style={{ display: "flex", flexDirection: "column", gap: sp.md }}>
          {[
            { label: "Restorative", value: 68400, pct: 35, color: C.navy },
            { label: "Prosthodontics", value: 52200, pct: 27, color: C.navyLight },
            { label: "Endodontics", value: 31800, pct: 17, color: C.navyMuted },
            { label: "Preventive", value: 24600, pct: 13, color: C.gold },
            { label: "Other", value: 15340, pct: 8, color: C.silverLight },
          ].map((cat, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ fontWeight: 500, color: C.text }}>{cat.label}</span>
                <span style={{ color: C.textMuted }}>${cat.value.toLocaleString()} ({cat.pct}%)</span>
              </div>
              <ProgressBar value={cat.pct} color={cat.color} />
            </div>
          ))}
        </div>
      </Card>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: sp.lg }}>
      {[
        { title: "Top Procedures", items: ["Crown D2740 — $38,400", "Root Canal D3330 — $22,800", "Implant D6010 — $19,200", "Prophylaxis D1110 — $14,500", "Veneer D2962 — $12,800"] },
        { title: "Referral Sources", items: ["Google Search — 34%", "Patient Referral — 28%", "Insurance Dir — 18%", "Yelp — 12%", "Other — 8%"] },
        { title: "Chair Utilization", items: ["Chair 1 — 94%", "Chair 2 — 88%", "Chair 3 — 82%", "Chair 4 — 71%", "Average — 84%"] },
      ].map((sec, si) => (
        <Card key={si}>
          <SectionHeader title={sec.title} />
          <div style={{ display: "flex", flexDirection: "column", gap: sp.sm }}>
            {sec.items.map((item, ii) => (
              <div key={ii} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: ii < sec.items.length - 1 ? `1px solid ${C.silverBorder}` : "none", fontSize: 13 }}>
                <span style={{ color: C.text }}>{item.split(" — ")[0]}</span>
                <span style={{ fontWeight: 600, color: C.navy }}>{item.split(" — ")[1]}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// SCREEN 13: Communications
const CommunicationsScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Communications</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Patient messaging, recalls & campaigns · Dr. Persky</p>
      </div>
      <Button variant="gold" icon="mail">New Message</Button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: sp.lg, marginBottom: sp.xxl }}>
      <StatCard label="Sent Today" value="34" icon="mail" accent />
      <StatCard label="Pending Recalls" value="18" icon="bell" />
      <StatCard label="Open Rate" value="68%" icon="chart" />
    </div>
    <Card>
      <SectionHeader title="Recent Messages" action={<Button variant="outline" size="sm" icon="filter">Filter</Button>} />
      <Table columns={[
        { label: "Date", key: "date" },
        { label: "Patient", render: r => <span style={{ fontWeight: 500 }}>{r.patient}</span> },
        { label: "Type", render: r => <Badge variant={r.type === "Reminder" ? "info" : r.type === "Recall" ? "gold" : "default"}>{r.type}</Badge> },
        { label: "Channel", key: "channel" },
        { label: "Subject", key: "subject" },
        { label: "Status", render: r => <Badge variant={r.status === "Delivered" ? "success" : r.status === "Opened" ? "gold" : "default"}>{r.status}</Badge> },
      ]} rows={[
        { date: "03/31", patient: "Sarah Mitchell", type: "Reminder", channel: "SMS", subject: "Appointment tomorrow at 9:00 AM", status: "Delivered" },
        { date: "03/31", patient: "Lisa Thompson", type: "Recall", channel: "Email", subject: "6-month cleaning due", status: "Opened" },
        { date: "03/31", patient: "Thomas Garcia", type: "Reminder", channel: "SMS", subject: "Upcoming appointment Apr 10", status: "Delivered" },
        { date: "03/30", patient: "Jennifer Adams", type: "Follow-up", channel: "Email", subject: "Post-treatment care instructions", status: "Opened" },
        { date: "03/30", patient: "Robert Williams", type: "Billing", channel: "Email", subject: "Statement — balance due $2,300", status: "Delivered" },
      ]} />
    </Card>
  </div>
);

// SCREEN 14: Staff Management
const StaffScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Staff Management</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Team directory & scheduling</p>
      </div>
      <Button variant="gold" icon="plus">Add Staff</Button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: sp.lg }}>
      {[
        { name: "Dr. Persky", role: "Lead Dentist / Owner", status: "Active", schedule: "Mon–Fri 8AM–5PM", specialties: "Restorative, Implants, Cosmetic" },
        { name: "Rachel Torres, RDH", role: "Dental Hygienist", status: "Active", schedule: "Mon–Thu 8AM–4PM", specialties: "Prophylaxis, Periodontal Therapy" },
        { name: "Amanda Liu", role: "Office Manager", status: "Active", schedule: "Mon–Fri 7:30AM–5PM", specialties: "Billing, Insurance, Scheduling" },
        { name: "Kevin Park, DA", role: "Dental Assistant", status: "Active", schedule: "Mon–Fri 8AM–5PM", specialties: "Chairside, Impressions, X-rays" },
        { name: "Nicole Rivera, DA", role: "Dental Assistant", status: "Active", schedule: "Mon–Wed 8AM–5PM", specialties: "Chairside, Sterilization" },
        { name: "Brian Walsh", role: "Front Desk", status: "Active", schedule: "Mon–Fri 7:30AM–5PM", specialties: "Check-in, Phone, Scheduling" },
      ].map((s, i) => (
        <Card key={i} hover>
          <div style={{ display: "flex", gap: sp.md, alignItems: "flex-start" }}>
            <Avatar name={s.name} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{s.name}</p>
                <Badge variant="success">{s.status}</Badge>
              </div>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{s.role}</p>
              <div style={{ marginTop: sp.md, fontSize: 12, color: C.textSecondary }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><Icon name="clock" size={12} color={C.silver} />{s.schedule}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="star" size={12} color={C.silver} />{s.specialties}</div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// SCREEN 15: Settings
const SettingsScreen = () => {
  const [tab, setTab] = useState("practice");
  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ marginBottom: sp.xxl }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Settings</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Practice configuration · Dr. Persky</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: sp.lg }}>
        <Card padding={sp.sm}>
          {["Practice Info", "Schedule", "Fee Schedule", "Templates", "Integrations", "Notifications", "Security", "Backup"].map((item, i) => (
            <button key={i} onClick={() => setTab(item.toLowerCase().replace(/ /g, "_"))} style={{
              display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 13,
              color: i === 0 ? C.navy : C.textSecondary, fontWeight: i === 0 ? 600 : 400,
              background: i === 0 ? C.goldSubtle : "transparent", borderRadius: radius.md,
              border: "none", cursor: "pointer", fontFamily: font.body, transition: "background 0.1s"
            }}>{item}</button>
          ))}
        </Card>
        <Card>
          <SectionHeader title="Practice Information" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp.lg }}>
            <InputField label="Practice Name" value="SmileSketch Vegas" />
            <InputField label="Provider" value="Dr. Persky" />
            <InputField label="License #" value="NV-DDS-44218" />
            <InputField label="NPI" value="1234567890" />
            <InputField label="Phone" value="(702) 555-0100" />
            <InputField label="Email" value="office@smilesketchvegas.com" />
            <div style={{ gridColumn: "1 / -1" }}>
              <InputField label="Address" value="2840 S Jones Blvd, Suite 110, Las Vegas, NV 89146" />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: sp.sm, marginTop: sp.xl }}>
            <Button variant="outline">Cancel</Button>
            <Button variant="gold">Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// SCREEN 16: Compliance / HIPAA
const ComplianceScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Compliance & Security</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>HIPAA, audit logs & access control · Dr. Persky</p>
      </div>
      <Button variant="outline" size="sm" icon="download">Export Audit Log</Button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: sp.lg, marginBottom: sp.xxl }}>
      <StatCard label="HIPAA Score" value="96%" icon="shield" accent />
      <StatCard label="Last Audit" value="Mar 15" icon="check" />
      <StatCard label="Active Users" value="6" icon="user" />
      <StatCard label="Incidents (YTD)" value="0" icon="lock" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp.lg }}>
      <Card>
        <SectionHeader title="Compliance Checklist" />
        {[
          { label: "BAA with all vendors", done: true },
          { label: "Annual HIPAA training", done: true },
          { label: "Encryption at rest & in transit", done: true },
          { label: "Access logging enabled", done: true },
          { label: "Disaster recovery plan", done: true },
          { label: "Q2 risk assessment", done: false },
          { label: "Penetration test (annual)", done: false },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: sp.md, padding: "10px 0", borderBottom: `1px solid ${C.silverBorder}` }}>
            <div style={{
              width: 22, height: 22, borderRadius: radius.sm, display: "flex", alignItems: "center", justifyContent: "center",
              background: item.done ? C.success : C.silverBg, border: item.done ? "none" : `1px solid ${C.silverBorder}`
            }}>
              {item.done && <Icon name="check" size={14} color={C.white} />}
            </div>
            <span style={{ fontSize: 13, color: item.done ? C.text : C.textMuted, textDecoration: item.done ? "none" : "none" }}>{item.label}</span>
            {!item.done && <Badge variant="warning" >Due</Badge>}
          </div>
        ))}
      </Card>
      <Card>
        <SectionHeader title="Recent Audit Log" />
        <div style={{ display: "flex", flexDirection: "column", gap: sp.sm }}>
          {[
            { time: "10:42 AM", user: "Dr. Persky", action: "Viewed chart — Sarah Mitchell", type: "Access" },
            { time: "10:38 AM", user: "Amanda Liu", action: "Submitted claim CLM-89421", type: "Billing" },
            { time: "10:15 AM", user: "Kevin Park", action: "Captured X-ray — Sarah Mitchell", type: "Clinical" },
            { time: "9:55 AM", user: "Dr. Persky", action: "Signed note — James Rodriguez", type: "Clinical" },
            { time: "9:30 AM", user: "Brian Walsh", action: "Checked in — James Rodriguez", type: "Access" },
            { time: "9:15 AM", user: "Dr. Persky", action: "Login from 10.0.1.42", type: "Security" },
            { time: "8:45 AM", user: "Rachel Torres", action: "Checked in — Sarah Mitchell", type: "Access" },
          ].map((log, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: sp.md, padding: "8px 0", borderBottom: `1px solid ${C.silverBorder}`, fontSize: 12 }}>
              <span style={{ fontFamily: font.mono, color: C.textMuted, fontSize: 11, whiteSpace: "nowrap", minWidth: 60 }}>{log.time}</span>
              <div>
                <span style={{ fontWeight: 600, color: C.navy }}>{log.user}</span>
                <span style={{ color: C.textSecondary }}> — {log.action}</span>
              </div>
              <Badge variant={log.type === "Security" ? "gold" : log.type === "Clinical" ? "info" : "default"}>{log.type}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// ─── ADDITIONAL SCREENS (17-28) ────────────────────────────────

const PerioChartScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ marginBottom: sp.xxl }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Periodontal Chart</h1>
      <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Sarah Mitchell · Dr. Persky · 03/31/2026</p>
    </div>
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.lg }}>
        <div style={{ display: "flex", gap: sp.md }}>
          <Badge variant="navy">Full Perio</Badge>
          <Badge variant="gold">PSR Screening</Badge>
        </div>
        <div style={{ display: "flex", gap: sp.sm }}>
          <Button variant="outline" size="sm" icon="printer">Print</Button>
          <Button variant="gold" size="sm">Save Chart</Button>
        </div>
      </div>
      <div style={{ marginBottom: sp.xl }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: sp.md }}>Maxillary — Buccal</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 2 }}>
          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(t => (
            <div key={t} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>#{t}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 1, marginBottom: 2 }}>
                {[3,2,3].map((d, di) => (
                  <div key={di} style={{ width: 14, height: 18, background: d > 3 ? C.dangerBg : C.offWhite, border: `1px solid ${d > 3 ? C.danger : C.silverBorder}`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontFamily: font.mono, color: d > 3 ? C.danger : C.textSecondary }}>
                    {d}
                  </div>
                ))}
              </div>
              <div style={{ width: "100%", height: 20, background: t === 14 ? C.goldSubtle : C.offWhite, border: `1px solid ${t === 14 ? C.gold : C.silverBorder}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: t === 14 ? C.gold : C.textMuted }}>{t === 14 ? "CR" : ""}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: sp.md }}>Mandibular — Buccal</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 2 }}>
          {[17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32].map(t => (
            <div key={t} style={{ textAlign: "center" }}>
              <div style={{ width: "100%", height: 20, background: C.offWhite, border: `1px solid ${C.silverBorder}`, borderRadius: 3, marginBottom: 2 }} />
              <div style={{ display: "flex", justifyContent: "center", gap: 1, marginBottom: 2 }}>
                {[2,3,2].map((d, di) => (
                  <div key={di} style={{ width: 14, height: 18, background: C.offWhite, border: `1px solid ${C.silverBorder}`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontFamily: font.mono, color: C.textSecondary }}>
                    {d}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: C.textMuted }}>#{t}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);

const ToothChartScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ marginBottom: sp.xxl }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Odontogram</h1>
      <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Sarah Mitchell · Charting by Dr. Persky</p>
    </div>
    <Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 4, marginBottom: sp.xxl }}>
        {Array.from({ length: 16 }, (_, i) => i + 1).map(t => (
          <div key={t} style={{ textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>#{t}</div>
            <div style={{
              width: "100%", aspectRatio: "1", borderRadius: radius.md, display: "flex", alignItems: "center", justifyContent: "center",
              background: t === 14 ? C.goldSubtle : t === 8 ? C.dangerBg : C.offWhite,
              border: `1.5px solid ${t === 14 ? C.gold : t === 8 ? C.danger : C.silverBorder}`,
              transition: "all 0.15s"
            }}>
              <Icon name="tooth" size={16} color={t === 14 ? C.gold : t === 8 ? C.danger : C.silverLight} />
            </div>
            {t === 14 && <div style={{ fontSize: 8, color: C.gold, fontWeight: 600, marginTop: 2 }}>CROWN</div>}
            {t === 8 && <div style={{ fontSize: 8, color: C.danger, fontWeight: 600, marginTop: 2 }}>MISSING</div>}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 4 }}>
        {Array.from({ length: 16 }, (_, i) => i + 17).map(t => (
          <div key={t} style={{ textAlign: "center", cursor: "pointer" }}>
            <div style={{
              width: "100%", aspectRatio: "1", borderRadius: radius.md, display: "flex", alignItems: "center", justifyContent: "center",
              background: C.offWhite, border: `1.5px solid ${C.silverBorder}`
            }}>
              <Icon name="tooth" size={16} color={C.silverLight} />
            </div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>#{t}</div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const ConsentFormsScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Consent Forms</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Digital consent management · Dr. Persky</p>
      </div>
      <Button variant="gold" icon="plus">Create Form</Button>
    </div>
    <Card>
      <Table columns={[
        { label: "Form", render: r => <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="file" size={16} color={C.navy} /><span style={{ fontWeight: 500 }}>{r.form}</span></div> },
        { label: "Patient", render: r => <span>{r.patient}</span> },
        { label: "Procedure", key: "proc" },
        { label: "Date", key: "date" },
        { label: "Signed By", key: "signedBy" },
        { label: "Status", render: r => <Badge variant={r.signed ? "success" : "warning"}>{r.signed ? "Signed" : "Pending"}</Badge> },
      ]} rows={[
        { form: "Informed Consent — Crown", patient: "Sarah Mitchell", proc: "Crown Prep #14", date: "03/31/2026", signedBy: "Patient", signed: true },
        { form: "Surgical Consent — Extraction", patient: "David Kim", proc: "Extraction #32", date: "03/31/2026", signedBy: "Patient", signed: true },
        { form: "Implant Treatment Consent", patient: "Robert Williams", proc: "Implant #8", date: "03/28/2026", signedBy: "—", signed: false },
        { form: "Veneer Consent (6 units)", patient: "Maria Santos", proc: "Veneers #6-11", date: "03/22/2026", signedBy: "Patient", signed: true },
        { form: "Sedation Consent", patient: "Michael Brown", proc: "Bridge #18-20", date: "03/20/2026", signedBy: "—", signed: false },
      ]} />
    </Card>
  </div>
);

const ReferralsScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Referrals</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Incoming & outgoing referrals · Dr. Persky</p>
      </div>
      <Button variant="gold" icon="plus">New Referral</Button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp.lg }}>
      <Card>
        <SectionHeader title="Outgoing Referrals" />
        <Table columns={[
          { label: "Patient", render: r => <span style={{ fontWeight: 500 }}>{r.patient}</span> },
          { label: "Referred To", key: "to" },
          { label: "Specialty", key: "spec" },
          { label: "Status", render: r => <Badge variant={r.status === "Completed" ? "success" : "warning"}>{r.status}</Badge> },
        ]} rows={[
          { patient: "Robert Williams", to: "Dr. Tanaka", spec: "Oral Surgery", status: "In Progress" },
          { patient: "Lisa Thompson", to: "Dr. Patel", spec: "Orthodontics", status: "Sent" },
          { patient: "Thomas Garcia", to: "Dr. Nakamura", spec: "Periodontics", status: "Completed" },
        ]} />
      </Card>
      <Card>
        <SectionHeader title="Incoming Referrals" />
        <Table columns={[
          { label: "Patient", render: r => <span style={{ fontWeight: 500 }}>{r.patient}</span> },
          { label: "From", key: "from" },
          { label: "Reason", key: "reason" },
          { label: "Status", render: r => <Badge variant={r.status === "Scheduled" ? "success" : "gold"}>{r.status}</Badge> },
        ]} rows={[
          { patient: "Anna Cooper", from: "Dr. Hansen (GP)", reason: "Crown evaluation", status: "Scheduled" },
          { patient: "Mark Stevens", from: "Dr. Lee (Ortho)", reason: "Restorative consult", status: "Pending" },
        ]} />
      </Card>
    </div>
  </div>
);

const InventoryScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp.xxl }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Inventory</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Supply management · Dr. Persky's practice</p>
      </div>
      <div style={{ display: "flex", gap: sp.sm }}>
        <Button variant="outline" size="sm" icon="download">Export</Button>
        <Button variant="gold" icon="plus">Add Item</Button>
      </div>
    </div>
    <Card>
      <Table columns={[
        { label: "Item", render: r => <span style={{ fontWeight: 500 }}>{r.item}</span> },
        { label: "Category", key: "cat" },
        { label: "In Stock", render: r => <span style={{ fontWeight: 600, color: r.stock < r.min ? C.danger : C.text }}>{r.stock}</span> },
        { label: "Min Level", key: "min" },
        { label: "Supplier", key: "supplier" },
        { label: "Status", render: r => <Badge variant={r.stock < r.min ? "danger" : r.stock < r.min * 1.5 ? "warning" : "success"}>{r.stock < r.min ? "Reorder" : r.stock < r.min * 1.5 ? "Low" : "OK"}</Badge> },
      ]} rows={[
        { item: "Composite Resin A2", cat: "Restorative", stock: 8, min: 10, supplier: "Henry Schein" },
        { item: "Nitrile Gloves (M)", cat: "PPE", stock: 45, min: 20, supplier: "Henry Schein" },
        { item: "Anesthetic Carpules", cat: "Anesthesia", stock: 120, min: 50, supplier: "Patterson" },
        { item: "Impression Material", cat: "Prosthodontics", stock: 3, min: 5, supplier: "3M" },
        { item: "Suture 4-0 Chromic", cat: "Surgical", stock: 18, min: 10, supplier: "Patterson" },
        { item: "Temporary Crown Material", cat: "Restorative", stock: 6, min: 8, supplier: "Ivoclar" },
        { item: "Bonding Agent", cat: "Restorative", stock: 12, min: 5, supplier: "3M" },
      ]} />
    </Card>
  </div>
);

const PaymentPortalScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ marginBottom: sp.xxl }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Payment Processing</h1>
      <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Collect payment · Dr. Persky's practice</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp.lg }}>
      <Card>
        <SectionHeader title="Collect Payment" />
        <InputField label="Patient" placeholder="Search patient…" />
        <InputField label="Amount" placeholder="$0.00" />
        <div style={{ marginBottom: sp.lg }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textSecondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.6 }}>Payment Method</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: sp.sm }}>
            {["Credit Card", "Cash", "Check", "ACH"].map((m, i) => (
              <button key={i} style={{
                padding: "10px 8px", fontSize: 12, fontWeight: i === 0 ? 600 : 400,
                border: `1px solid ${i === 0 ? C.gold : C.silverBorder}`, borderRadius: radius.md,
                background: i === 0 ? C.goldSubtle : C.white, color: i === 0 ? C.navy : C.textSecondary,
                cursor: "pointer", fontFamily: font.body
              }}>{m}</button>
            ))}
          </div>
        </div>
        <InputField label="Card Number" placeholder="•••• •••• •••• ••••" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp.lg }}>
          <InputField label="Expiry" placeholder="MM/YY" />
          <InputField label="CVV" placeholder="•••" />
        </div>
        <Button variant="gold" style={{ width: "100%", justifyContent: "center", marginTop: sp.sm }}>Process Payment</Button>
      </Card>
      <Card>
        <SectionHeader title="Recent Transactions" />
        <div style={{ display: "flex", flexDirection: "column", gap: sp.sm }}>
          {[
            { patient: "Emily Chen", amount: "$145.00", method: "Credit Card", time: "10:22 AM", status: "Approved" },
            { patient: "David Kim", amount: "$70.00", method: "Cash", time: "9:45 AM", status: "Recorded" },
            { patient: "Lisa Thompson", amount: "$250.00", method: "Credit Card", time: "Yesterday", status: "Approved" },
            { patient: "James Rodriguez", amount: "$190.00", method: "ACH", time: "Yesterday", status: "Pending" },
          ].map((tx, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.silverBorder}` }}>
              <div style={{ display: "flex", gap: sp.md, alignItems: "center" }}>
                <Avatar name={tx.patient} size={28} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{tx.patient}</p>
                  <p style={{ fontSize: 11, color: C.textMuted }}>{tx.method} · {tx.time}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{tx.amount}</p>
                <Badge variant={tx.status === "Approved" ? "success" : tx.status === "Pending" ? "warning" : "default"}>{tx.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const EmergencyScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ marginBottom: sp.xxl }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Emergency Protocols</h1>
      <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Quick reference · Dr. Persky's practice</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: sp.lg, marginBottom: sp.lg }}>
      {[
        { title: "Anaphylaxis", items: ["Administer Epi-Pen", "Call 911", "Monitor vitals", "Position supine, elevate legs"], color: C.danger },
        { title: "Syncope", items: ["Position supine", "Elevate legs", "Apply cold compress", "Monitor vitals"], color: C.warning },
        { title: "Cardiac Arrest", items: ["Call 911", "Begin CPR", "Use AED", "Administer oxygen"], color: C.danger },
      ].map((p, i) => (
        <Card key={i} style={{ borderTop: `3px solid ${p.color}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: sp.md }}>{p.title}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: sp.sm }}>
            {p.items.map((item, ii) => (
              <div key={ii} style={{ display: "flex", alignItems: "center", gap: sp.sm, fontSize: 13 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: p.color, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{ii + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
    <Card>
      <SectionHeader title="Emergency Equipment Checklist" subtitle="Last verified: 03/28/2026 by Dr. Persky" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: sp.lg }}>
        {[
          { item: "AED Device", status: "Ready", expiry: "N/A" },
          { item: "Epinephrine 1:1000", status: "Stocked", expiry: "09/2026" },
          { item: "Oxygen Tank", status: "Full", expiry: "N/A" },
          { item: "Nitroglycerin", status: "Stocked", expiry: "11/2026" },
          { item: "Diphenhydramine 50mg", status: "Stocked", expiry: "12/2026" },
          { item: "Glucose Gel", status: "Stocked", expiry: "06/2027" },
        ].map((eq, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.silverBorder}` }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500 }}>{eq.item}</p>
              <p style={{ fontSize: 11, color: C.textMuted }}>Exp: {eq.expiry}</p>
            </div>
            <Badge variant="success">{eq.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const PatientPortalScreen = () => (
  <div style={{ animation: "fadeIn 0.35s ease" }}>
    <div style={{ marginBottom: sp.xxl }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy }}>Patient Portal Settings</h1>
      <p style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>Online booking & forms · Dr. Persky's practice</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp.lg }}>
      <Card>
        <SectionHeader title="Portal Features" />
        {[
          { label: "Online Booking", desc: "Patients can request appointments", enabled: true },
          { label: "Secure Messaging", desc: "Two-way patient-practice messaging", enabled: true },
          { label: "Online Forms", desc: "New patient intake & health history", enabled: true },
          { label: "Bill Pay", desc: "View statements & pay online", enabled: true },
          { label: "Treatment Plans", desc: "View & accept treatment plans", enabled: false },
          { label: "Records Request", desc: "Request medical records", enabled: false },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.silverBorder}` }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</p>
              <p style={{ fontSize: 11, color: C.textMuted }}>{f.desc}</p>
            </div>
            <div style={{
              width: 40, height: 22, borderRadius: 11, background: f.enabled ? C.success : C.silverBg,
              position: "relative", cursor: "pointer", transition: "background 0.2s"
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%", background: C.white,
                position: "absolute", top: 2, left: f.enabled ? 20 : 2, transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
              }} />
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <SectionHeader title="Portal Activity" subtitle="Last 7 days" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp.lg, marginBottom: sp.xl }}>
          <div style={{ textAlign: "center", padding: sp.lg, background: C.offWhite, borderRadius: radius.lg }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: C.navy }}>142</p>
            <p style={{ fontSize: 12, color: C.textMuted }}>Portal Logins</p>
          </div>
          <div style={{ textAlign: "center", padding: sp.lg, background: C.offWhite, borderRadius: radius.lg }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: C.gold }}>18</p>
            <p style={{ fontSize: 12, color: C.textMuted }}>Online Bookings</p>
          </div>
        </div>
        <SectionHeader title="Recent Activity" />
        {[
          { action: "Booked appointment", patient: "Jennifer Adams", time: "2 hours ago" },
          { action: "Submitted intake form", patient: "New Patient — S. Collins", time: "4 hours ago" },
          { action: "Paid balance ($350)", patient: "Jennifer Adams", time: "5 hours ago" },
          { action: "Viewed treatment plan", patient: "Robert Williams", time: "Yesterday" },
          { action: "Sent message", patient: "Maria Santos", time: "Yesterday" },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.silverBorder}`, fontSize: 12 }}>
            <div>
              <span style={{ fontWeight: 500, color: C.text }}>{a.action}</span>
              <span style={{ color: C.textMuted }}> — {a.patient}</span>
            </div>
            <span style={{ color: C.textMuted }}>{a.time}</span>
          </div>
        ))}
      </Card>
    </div>
  </div>
);

// ─── SCREEN MAP ────────────────────────────────────────────────
const screenMap = {
  dashboard: DashboardScreen,
  patients: PatientListScreen,
  scheduling: SchedulingScreen,
  clinical: ClinicalScreen,
  imaging: ImagingScreen,
  treatment: TreatmentScreen,
  prescriptions: PrescriptionsScreen,
  lab_orders: LabOrdersScreen,
  billing: BillingScreen,
  insurance: InsuranceScreen,
  reports: ReportsScreen,
  communications: CommunicationsScreen,
  staff: StaffScreen,
  settings: SettingsScreen,
  compliance: ComplianceScreen,
  perio_chart: PerioChartScreen,
  tooth_chart: ToothChartScreen,
  consent_forms: ConsentFormsScreen,
  referrals: ReferralsScreen,
  inventory: InventoryScreen,
  payment_portal: PaymentPortalScreen,
  emergency: EmergencyScreen,
  patient_portal: PatientPortalScreen,
  patient_detail: PatientDetailScreen,
};

// ─── MAIN APP ──────────────────────────────────────────────────
export default function SmileSketchVegas() {
  const [screen, setScreen] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const allScreenItems = navSections.flatMap(s => s.items);
  const additionalItems = [
    { id: "perio_chart", icon: "tooth", label: "Perio Chart" },
    { id: "tooth_chart", icon: "tooth", label: "Odontogram" },
    { id: "consent_forms", icon: "file", label: "Consent Forms" },
    { id: "referrals", icon: "arrowRight", label: "Referrals" },
    { id: "inventory", icon: "lab", label: "Inventory" },
    { id: "payment_portal", icon: "billing", label: "Payment Portal" },
    { id: "emergency", icon: "shield", label: "Emergency" },
    { id: "patient_portal", icon: "user", label: "Patient Portal" },
  ];

  const allItems = [...allScreenItems, ...additionalItems];
  const searchResults = searchQuery.length > 0
    ? allItems.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setScreen("patient_detail");
  };

  const ActiveScreen = screenMap[screen] || DashboardScreen;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: font.body, background: C.bg }}>
      <style>{globalStyle}</style>

      {/* ─── SIDEBAR ─── */}
      <div style={{
        width: sidebarCollapsed ? 64 : 232, background: C.navy, display: "flex", flexDirection: "column",
        transition: "width 0.25s ease", flexShrink: 0, overflow: "hidden"
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarCollapsed ? "20px 12px" : "20px 20px", display: "flex", alignItems: "center", gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.08)", minHeight: 64, cursor: "pointer"
        }} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <div style={{
            width: 32, height: 32, borderRadius: radius.md, background: C.gold,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <Icon name="tooth" size={16} color={C.white} />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: 0.5, whiteSpace: "nowrap" }}>SMILESKETCH</p>
              <p style={{ fontSize: 9, color: C.goldLight, letterSpacing: 2, whiteSpace: "nowrap" }}>VEGAS</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: `${sp.md}px 0` }}>
          {navSections.map((section, si) => (
            <div key={si} style={{ marginBottom: sp.lg }}>
              {!sidebarCollapsed && (
                <p style={{
                  fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5,
                  padding: `0 ${sp.xl}px`, marginBottom: sp.sm
                }}>{section.label}</p>
              )}
              {section.items.map(item => {
                const isActive = screen === item.id;
                return (
                  <button key={item.id} onClick={() => setScreen(item.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%",
                      padding: sidebarCollapsed ? "10px 0" : "9px 20px",
                      justifyContent: sidebarCollapsed ? "center" : "flex-start",
                      background: isActive ? "rgba(198,165,92,0.12)" : "transparent",
                      border: "none", cursor: "pointer", fontFamily: font.body,
                      fontSize: 13, fontWeight: isActive ? 600 : 400,
                      color: isActive ? C.goldLight : "rgba(255,255,255,0.55)",
                      borderLeft: isActive ? `3px solid ${C.gold}` : "3px solid transparent",
                      transition: "all 0.15s", whiteSpace: "nowrap"
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                  >
                    <Icon name={item.icon} size={16} color={isActive ? C.goldLight : "rgba(255,255,255,0.4)"} />
                    {!sidebarCollapsed && item.label}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Additional screens */}
          {!sidebarCollapsed && (
            <div style={{ marginBottom: sp.lg }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, padding: `0 ${sp.xl}px`, marginBottom: sp.sm }}>MORE</p>
              {additionalItems.map(item => {
                const isActive = screen === item.id;
                return (
                  <button key={item.id} onClick={() => setScreen(item.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%",
                      padding: "9px 20px", background: isActive ? "rgba(198,165,92,0.12)" : "transparent",
                      border: "none", cursor: "pointer", fontFamily: font.body,
                      fontSize: 13, fontWeight: isActive ? 600 : 400,
                      color: isActive ? C.goldLight : "rgba(255,255,255,0.55)",
                      borderLeft: isActive ? `3px solid ${C.gold}` : "3px solid transparent",
                      transition: "all 0.15s", whiteSpace: "nowrap"
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                  >
                    <Icon name={item.icon} size={16} color={isActive ? C.goldLight : "rgba(255,255,255,0.4)"} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User */}
        <div style={{
          padding: sidebarCollapsed ? "16px 12px" : "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <Icon name="user" size={14} color="rgba(255,255,255,0.6)" />
          </div>
          {!sidebarCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.white, whiteSpace: "nowrap" }}>Dr. Persky</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>Lead Dentist</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* ─── TOP SEARCH BAR ─── */}
        <div style={{
          height: 56, background: C.white, borderBottom: `1px solid ${C.silverBorder}`,
          display: "flex", alignItems: "center", padding: "0 24px", gap: sp.lg, flexShrink: 0,
          position: "relative", zIndex: 100
        }}>
          <div style={{ flex: 1, position: "relative", maxWidth: 560 }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 2, pointerEvents: "none" }}>
              <Icon name="search" size={15} color={searchFocused ? C.navy : C.silverLight} />
            </div>
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => { setSearchFocused(true); setShowSearch(true); }}
              onBlur={() => { setSearchFocused(false); setTimeout(() => setShowSearch(false), 200); }}
              placeholder="Search patients, records, appointments…"
              style={{
                width: "100%", padding: "9px 12px 9px 36px", fontSize: 13, fontFamily: font.body,
                border: `1px solid ${searchFocused ? C.navyMuted : C.silverBorder}`,
                borderRadius: radius.lg, color: C.text, outline: "none", background: C.offWhite,
                transition: "all 0.2s"
              }}
            />
            {/* Search dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                background: C.white, border: `1px solid ${C.silverBorder}`, borderRadius: radius.lg,
                boxShadow: "0 8px 32px rgba(27,42,74,0.12)", overflow: "hidden", zIndex: 200
              }}>
                {searchResults.slice(0, 6).map((r, i) => (
                  <button key={i}
                    onMouseDown={() => { setScreen(r.id); setSearchQuery(""); setShowSearch(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px",
                      border: "none", background: "transparent", cursor: "pointer", fontFamily: font.body,
                      fontSize: 13, color: C.text, transition: "background 0.1s", textAlign: "left"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.offWhite; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon name={r.icon} size={14} color={C.silver} />
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: sp.md, marginLeft: "auto" }}>
            <button style={{ width: 36, height: 36, borderRadius: radius.md, border: `1px solid ${C.silverBorder}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              <Icon name="bell" size={16} color={C.silver} />
              <div style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: C.danger, border: `2px solid ${C.white}` }} />
            </button>
            <button style={{ width: 36, height: 36, borderRadius: radius.md, border: `1px solid ${C.silverBorder}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="refresh" size={16} color={C.silver} />
            </button>
            <div style={{ width: 1, height: 24, background: C.silverBorder }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name="Dr Persky" size={30} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Dr. Persky</p>
                <p style={{ fontSize: 10, color: C.textMuted }}>SmileSketch Vegas</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CONTENT AREA ─── */}
        <div style={{ flex: 1, overflowY: "auto", padding: sp.xxl }}>
          <ActiveScreen
            onSelectPatient={screen === "patients" ? handlePatientSelect : undefined}
            patient={screen === "patient_detail" ? selectedPatient : undefined}
          />
        </div>
      </div>
    </div>
  );
}
