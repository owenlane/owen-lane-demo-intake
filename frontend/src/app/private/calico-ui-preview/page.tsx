"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Anchor, Ship, Calendar, Users, MessageSquare, TrendingUp, ChevronRight, ChevronLeft, Star, MapPin, Clock, Check, Menu, X, Bell, Search, Settings, Home, LayoutDashboard, BookOpen, UserCircle, Sailboat, DollarSign, Mail, Filter, Plus, ArrowRight, ArrowLeft, ChevronDown, Eye, MoreHorizontal, Phone, Send, Waves, Navigation, Compass, Sun, Wind, Globe, Award, Shield, Heart, Zap, BarChart3, PieChart as PieChartIcon, CalendarDays, FileText, LogOut, RefreshCw, AlertCircle, CheckCircle2, XCircle, MinusCircle, ExternalLink, ArrowUpRight, Activity, Target } from "lucide-react";

/* ═══════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════ */
const C = {
  navy: "#0C1B2A",
  navyDeep: "#070F18",
  navyMid: "#12253A",
  blue: "#1F6FFF",
  blueSoft: "rgba(31,111,255,0.08)",
  blueGlow: "rgba(31,111,255,0.12)",
  emerald: "#0FA38A",
  bg: "#F7F9FB",
  bgWarm: "#F4F6F8",
  text: "#0E1114",
  textSec: "#5B6470",
  textTert: "#8D95A0",
  card: "#FFFFFF",
  cardHover: "#FCFCFD",
  border: "#ECEEF1",
  borderLight: "#F2F3F5",
  shadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04)",
  shadowMd: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
  shadowLg: "0 4px 12px rgba(0,0,0,0.05), 0 16px 48px rgba(0,0,0,0.08)",
  shadowXl: "0 8px 24px rgba(0,0,0,0.06), 0 24px 64px rgba(0,0,0,0.1)",
};

const font = {
  display: "'Playfair Display', serif",
  body: "'DM Sans', sans-serif",
};

/* ═══════════════════════════════════════════
   LOCAL IMAGE PATHS
   ═══════════════════════════════════════════ */
const img = {
  yachts: [
    "/calico-assets/yachts/sovereign-hero.png",
    "/calico-assets/yachts/azuremeridian.png",
    "/calico-assets/yachts/velvethorizon.png",
    "/calico-assets/yachts/celestialdawn.png",
    "/calico-assets/yachts/pacificempress.png",
    "/calico-assets/yachts/sapphirewinds.png",
  ],
  detail: [
    "/calico-assets/yachts/sovereign-hero.png",
    "/calico-assets/yachts/sovereign-interior1.png",
    "/calico-assets/yachts/sovereignaerial.png",
    "/calico-assets/yachts/sovereigndeck.png",
    "/calico-assets/yachts/sovereignsuite.png",
  ],
  destinations: [
    "/calico-assets/destinations/mediterranean.png",
    "/calico-assets/destinations/caribbean.png",
    "/calico-assets/destinations/southeast-asia.png",
    "/calico-assets/destinations/mediterranean.png",
  ],
  hero: "/calico-assets/hero/main-hero.png",
  heroAlt: "/calico-assets/hero/experience-hero.png",
  fleet: "/calico-assets/hero/fleet-header.png",
};

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const fleetData = [
  { name: "Calico Sovereign", length: "164 ft", guests: 12, crew: 15, price: "$185,000", priceNum: 185000, status: "Available", type: "Motor Yacht", img: img.yachts[0], rating: 4.9, builder: "Lürssen", year: 2019 },
  { name: "Azure Meridian", length: "142 ft", guests: 10, crew: 12, price: "$145,000", priceNum: 145000, status: "On Charter", type: "Motor Yacht", img: img.yachts[1], rating: 4.8, builder: "Feadship", year: 2021 },
  { name: "Velvet Horizon", length: "128 ft", guests: 10, crew: 11, price: "$125,000", priceNum: 125000, status: "Available", type: "Sailing Yacht", img: img.yachts[2], rating: 5.0, builder: "Perini Navi", year: 2020 },
  { name: "Celestial Dawn", length: "198 ft", guests: 14, crew: 18, price: "$275,000", priceNum: 275000, status: "Maintenance", type: "Explorer Yacht", img: img.yachts[3], rating: 4.9, builder: "Damen", year: 2022 },
  { name: "Pacific Empress", length: "156 ft", guests: 12, crew: 14, price: "$165,000", priceNum: 165000, status: "Available", type: "Motor Yacht", img: img.yachts[4], rating: 4.7, builder: "Benetti", year: 2018 },
  { name: "Sapphire Winds", length: "112 ft", guests: 8, crew: 9, price: "$95,000", priceNum: 95000, status: "Available", type: "Sailing Yacht", img: img.yachts[5], rating: 4.8, builder: "Oyster", year: 2023 },
];

const revenueData = [
  { month: "Jan", revenue: 420000, bookings: 3 },
  { month: "Feb", revenue: 580000, bookings: 4 },
  { month: "Mar", revenue: 750000, bookings: 5 },
  { month: "Apr", revenue: 890000, bookings: 6 },
  { month: "May", revenue: 1100000, bookings: 8 },
  { month: "Jun", revenue: 1450000, bookings: 10 },
  { month: "Jul", revenue: 1680000, bookings: 12 },
  { month: "Aug", revenue: 1520000, bookings: 11 },
  { month: "Sep", revenue: 980000, bookings: 7 },
  { month: "Oct", revenue: 720000, bookings: 5 },
  { month: "Nov", revenue: 540000, bookings: 4 },
  { month: "Dec", revenue: 680000, bookings: 5 },
];

const bookingsData = [
  { id: "CYC-2847", client: "Harrison Wells", yacht: "Calico Sovereign", dates: "Apr 12 – Apr 19", guests: 8, total: "$185,000", status: "Confirmed", avatar: "HW" },
  { id: "CYC-2848", client: "Elena Vasquez", yacht: "Velvet Horizon", dates: "Apr 15 – Apr 22", guests: 6, total: "$125,000", status: "New", avatar: "EV" },
  { id: "CYC-2849", client: "James Chen", yacht: "Pacific Empress", dates: "Apr 20 – Apr 27", guests: 10, total: "$165,000", status: "Confirmed", avatar: "JC" },
  { id: "CYC-2850", client: "Sophia Laurent", yacht: "Celestial Dawn", dates: "May 1 – May 8", guests: 12, total: "$275,000", status: "Pending", avatar: "SL" },
  { id: "CYC-2851", client: "Marcus Reid", yacht: "Sapphire Winds", dates: "May 5 – May 12", guests: 6, total: "$95,000", status: "Confirmed", avatar: "MR" },
  { id: "CYC-2852", client: "Olivia Park", yacht: "Azure Meridian", dates: "May 10 – May 17", guests: 8, total: "$145,000", status: "Completed", avatar: "OP" },
];

const msgData = [
  { from: "Harrison Wells", msg: "Can we arrange a helicopter transfer from Nice?", time: "2h ago", unread: true },
  { from: "Elena Vasquez", msg: "Could you confirm the wine selection?", time: "4h ago", unread: true },
  { from: "James Chen", msg: "Itinerary looks perfect. Thank you.", time: "1d ago", unread: false },
  { from: "Sophia Laurent", msg: "We'd like to add a diving instructor.", time: "1d ago", unread: false },
];

const calendarEvents = [
  { day: 5, yacht: "Sovereign", type: "charter" }, { day: 6, yacht: "Sovereign", type: "charter" }, { day: 7, yacht: "Sovereign", type: "charter" },
  { day: 10, yacht: "Velvet", type: "charter" }, { day: 11, yacht: "Velvet", type: "charter" }, { day: 12, yacht: "Velvet", type: "charter" },
  { day: 15, yacht: "Pacific", type: "maintenance" },
  { day: 18, yacht: "Azure", type: "charter" }, { day: 19, yacht: "Azure", type: "charter" }, { day: 20, yacht: "Azure", type: "charter" },
  { day: 22, yacht: "Sapphire", type: "charter" }, { day: 23, yacht: "Sapphire", type: "charter" },
  { day: 25, yacht: "Celestial", type: "blocked" }, { day: 26, yacht: "Celestial", type: "blocked" },
];

const pieData = [
  { name: "Motor Yacht", value: 62, color: C.blue },
  { name: "Sailing Yacht", value: 24, color: C.emerald },
  { name: "Explorer", value: 14, color: C.navyMid },
];

/* ═══════════════════════════════════════════
   SHARED UI ATOMS
   ═══════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: ${C.bg}; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #C8CDD3; border-radius: 10px; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleReveal { from { opacity: 0; transform: scale(1.08); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
    input:focus { outline: 2px solid ${C.blue}; outline-offset: -1px; }
  `}</style>
);

const ImgBg = ({ src, style, children, overlay, ...props }) => {
  return (
    <div
      style={{
        position: "relative",
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: C.navy,
        overflow: "hidden",
        ...style,
      }}
      {...props}
    >
      {overlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: overlay,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 2, height: "100%" }}>
        {children}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    Available: { bg: "rgba(15,163,138,0.1)", text: C.emerald, dot: C.emerald },
    "On Charter": { bg: C.blueSoft, text: C.blue, dot: C.blue },
    Maintenance: { bg: "rgba(230,126,34,0.08)", text: "#D4781A", dot: "#D4781A" },
    Confirmed: { bg: "rgba(15,163,138,0.1)", text: C.emerald, dot: C.emerald },
    New: { bg: C.blueSoft, text: C.blue, dot: C.blue },
    Pending: { bg: "rgba(230,126,34,0.08)", text: "#D4781A", dot: "#D4781A" },
    Completed: { bg: "#F0F1F3", text: C.textSec, dot: "#A0A5AB" },
  };
  const c = colors[status] || colors.Available;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, background: c.bg, color: c.text, fontSize: 11, fontWeight: 600, letterSpacing: 0.4, fontFamily: font.body }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
      {status}
    </span>
  );
};

const Logo = ({ light, size = "default" }) => {
  const s = size === "small" ? 0.8 : 1;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 * s, cursor: "pointer" }}>
      <Compass size={32 * s} color={light ? "#fff" : C.navy} strokeWidth={1} />
      <div>
        <div style={{ fontSize: 14 * s, fontWeight: 700, letterSpacing: 4 * s, color: light ? "#fff" : C.navy, fontFamily: font.body }}> CALICO</div>
        <div style={{ fontSize: 7 * s, fontWeight: 500, letterSpacing: 4.5 * s, color: light ? "rgba(255,255,255,0.4)" : C.textTert, marginTop: -1 }}>YACHT CHARTERS</div>
      </div>
    </div>
  );
};

const SectionLabel = ({ children, light }) => (
  <div style={{ fontSize: 10, letterSpacing: 5, color: light ? "rgba(255,255,255,0.35)" : C.textTert, fontWeight: 600, marginBottom: 14, fontFamily: font.body }}>{children}</div>
);

const Heading = ({ children, light, size = 52, style: s }) => (
  <h2 style={{ fontSize: size, fontWeight: 300, color: light ? "#fff" : C.navy, fontFamily: font.display, lineHeight: 1.1, letterSpacing: -0.5, ...s }}>{children}</h2>
);

/* ═══════════════════════════════════════════════
   FRONTEND: HOME
   ═══════════════════════════════════════════════ */
const HomePage = ({ onNavigate }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  return (
    <div style={{ background: "#000", fontFamily: font.body }}>
      <GlobalStyles />

      {/* HERO: Full viewport immersive */}
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <ImgBg src={img.hero} style={{ position: "absolute", inset: 0 }}
          overlay="linear-gradient(180deg, rgba(7,15,24,0.25) 0%, rgba(7,15,24,0.55) 60%, rgba(7,15,24,0.85) 100%)">
          <div style={{ position: "absolute", inset: 0, animation: loaded ? "scaleReveal 2s ease-out forwards" : "none", transform: "scale(1.08)", opacity: 0 }} />
        </ImgBg>

        <nav style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "32px 56px",
          animation: loaded ? "fadeIn 0.8s ease-out 0.4s both" : "none",
        }}>
          <Logo light />
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            {["Fleet", "Destinations", "Experience"].map(t => (
              <span key={t} onClick={t === "Fleet" ? () => onNavigate("fleet") : undefined}
                style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: 2.5, fontWeight: 500, cursor: "pointer", transition: "color 0.3s", fontFamily: font.body }}
                onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}>
                {t.toUpperCase()}
              </span>
            ))}
            <button onClick={() => onNavigate("booking")} style={{
              padding: "11px 32px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4,
              fontSize: 11, letterSpacing: 2.5, fontWeight: 600, cursor: "pointer", fontFamily: font.body, transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.background = "#fff"; e.target.style.color = C.navy; }}
              onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "#fff"; }}>
              BOOK NOW
            </button>
          </div>
        </nav>

        <div style={{ position: "absolute", bottom: "14%", left: 56, maxWidth: 640, zIndex: 5 }}>
          <div style={{ animation: loaded ? "fadeUp 1.2s ease-out 0.6s both" : "none" }}>
            <SectionLabel light>PRIVATE YACHT CHARTERS</SectionLabel>
            <h1 style={{ fontSize: 76, fontWeight: 300, color: "#fff", lineHeight: 1.04, fontFamily: font.display, letterSpacing: -2 }}>
              Beyond the<br />Horizon
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginTop: 28, maxWidth: 440, lineHeight: 1.8, fontFamily: font.body }}>
              Bespoke voyages for the world's most discerning travelers.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 44, animation: loaded ? "fadeUp 1.2s ease-out 0.9s both" : "none" }}>
            <button onClick={() => onNavigate("fleet")} style={{
              padding: "18px 44px", background: "#fff", color: C.navy, border: "none", borderRadius: 4,
              fontSize: 11, letterSpacing: 2.5, fontWeight: 700, cursor: "pointer", fontFamily: font.body,
            }}>EXPLORE FLEET</button>
            <button style={{
              padding: "18px 44px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 4,
              fontSize: 11, letterSpacing: 2.5, fontWeight: 600, cursor: "pointer", fontFamily: font.body,
            }}>WATCH FILM</button>
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          animation: loaded ? "fadeIn 1s ease-out 1.2s both" : "none",
        }}>
          {[
            { v: "6", l: "VESSELS" }, { v: "40+", l: "DESTINATIONS" },
            { v: "18", l: "YEARS" }, { v: "4.9", l: "GUEST RATING" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "32px 56px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", background: "rgba(7,15,24,0.5)" }}>
              <div style={{ fontSize: 32, fontWeight: 300, color: "#fff", fontFamily: font.display }}>{s.v}</div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,0.3)", marginTop: 6, fontFamily: font.body }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FLEET PREVIEW */}
      <div style={{ background: C.bg, padding: "120px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64 }}>
          <div>
            <SectionLabel>THE FLEET</SectionLabel>
            <Heading size={48}>Our Vessels</Heading>
          </div>
          <span onClick={() => onNavigate("fleet")} style={{ display: "flex", alignItems: "center", gap: 8, color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 1, fontFamily: font.body }}>
            VIEW ALL <ArrowRight size={14} />
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28 }}>
          {fleetData.slice(0, 3).map((y, i) => (
            <div key={i} onClick={() => onNavigate("yacht-detail")} style={{ cursor: "pointer", borderRadius: 10, overflow: "hidden", background: C.card, boxShadow: C.shadow, transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = C.shadowXl; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = C.shadow; }}>
              <ImgBg src={y.img} style={{ height: 320, borderRadius: "10px 10px 0 0" }}
                overlay="linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 50%)">
                <div style={{ position: "absolute", top: 20, right: 20, zIndex: 3 }}><StatusBadge status={y.status} /></div>
                <div style={{ position: "absolute", bottom: 20, left: 24, zIndex: 3 }}>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.5)", fontWeight: 600, fontFamily: font.body }}>{y.type.toUpperCase()}</div>
                </div>
              </ImgBg>
              <div style={{ padding: "24px 28px 28px" }}>
                <h3 style={{ fontSize: 24, fontWeight: 400, color: C.navy, fontFamily: font.display, marginBottom: 16 }}>{y.name}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: C.textSec, fontFamily: font.body }}>
                  <span>{y.length} · {y.guests} guests</span>
                  <span style={{ color: C.navy, fontWeight: 700, fontSize: 16 }}>{y.price}<span style={{ fontWeight: 400, color: C.textTert, fontSize: 12 }}>/wk</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPERIENCE: Full-bleed split */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 680 }}>
        <ImgBg src={img.heroAlt} style={{ minHeight: 680 }} overlay="linear-gradient(135deg, rgba(7,15,24,0.2) 0%, rgba(7,15,24,0.1) 100%)" />
        <div style={{ background: C.navy, display: "flex", alignItems: "center", padding: "80px 72px" }}>
          <div>
            <SectionLabel light>THE EXPERIENCE</SectionLabel>
            <Heading light size={46} style={{ marginBottom: 28 }}>Every Detail,{"\n"}Curated</Heading>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.9, maxWidth: 400, fontFamily: font.body, marginBottom: 48 }}>
              Private chefs, expert dive instructors, bespoke itineraries — every element orchestrated with precision.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              {[
                { icon: <Award size={18} />, label: "Private Chef" },
                { icon: <Shield size={18} />, label: "24/7 Concierge" },
                { icon: <Navigation size={18} />, label: "Custom Routes" },
                { icon: <Star size={18} />, label: "5-Star Service" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(31,111,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: C.blue }}>{f.icon}</div>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: font.body, fontWeight: 500 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DESTINATIONS */}
      <div style={{ background: C.bg, padding: "120px 56px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel>DESTINATIONS</SectionLabel>
          <Heading size={48}>Where We Sail</Heading>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gridTemplateRows: "340px 340px", gap: 16 }}>
          <ImgBg src={img.destinations[0]} style={{ borderRadius: 10, gridRow: "1 / 3", cursor: "pointer" }}
            overlay="linear-gradient(0deg, rgba(0,0,0,0.65) 0%, transparent 50%)">
            <div style={{ position: "absolute", bottom: 36, left: 36 }}>
              <h3 style={{ color: "#fff", fontSize: 32, fontWeight: 400, fontFamily: font.display }}>Mediterranean</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 6, fontFamily: font.body, letterSpacing: 0.5 }}>French Riviera · Amalfi · Greek Islands</p>
            </div>
          </ImgBg>
          <ImgBg src={img.destinations[1]} style={{ borderRadius: 10, cursor: "pointer" }}
            overlay="linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)">
            <div style={{ position: "absolute", bottom: 28, left: 28 }}>
              <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 400, fontFamily: font.display }}>Caribbean</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 4, fontFamily: font.body }}>St. Barts · BVI · Bahamas</p>
            </div>
          </ImgBg>
          <ImgBg src={img.destinations[2]} style={{ borderRadius: 10, cursor: "pointer" }}
            overlay="linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)">
            <div style={{ position: "absolute", bottom: 28, left: 28 }}>
              <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 400, fontFamily: font.display }}>Southeast Asia</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 4, fontFamily: font.body }}>Thailand · Indonesia · Maldives</p>
            </div>
          </ImgBg>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
        <ImgBg src={img.destinations[3]} style={{ position: "absolute", inset: 0 }}
          overlay="linear-gradient(180deg, rgba(7,15,24,0.7) 0%, rgba(7,15,24,0.85) 100%)" />
        <div style={{ position: "relative", zIndex: 3, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Heading light size={44} style={{ textAlign: "center", marginBottom: 16 }}>Begin Your Voyage</Heading>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 40, fontFamily: font.body }}>Speak with our charter advisors</p>
          <button onClick={() => onNavigate("booking")} style={{ padding: "18px 52px", background: C.blue, color: "#fff", border: "none", borderRadius: 4, fontSize: 11, letterSpacing: 2.5, fontWeight: 700, cursor: "pointer", fontFamily: font.body }}>
            REQUEST A CHARTER
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   FRONTEND: FLEET
   ═══════════════════════════════════════════════ */
const FleetPage = ({ onNavigate }) => (
  <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font.body }}>
    <GlobalStyles />
    <ImgBg src={img.fleet} style={{ height: 480, position: "relative" }}
      overlay="linear-gradient(180deg, rgba(7,15,24,0.35) 0%, rgba(7,15,24,0.8) 100%)">
      <nav style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "32px 56px" }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}><Logo light /></div>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Fleet", "Destinations", "Experience"].map(t => (
            <span key={t} style={{ color: t === "Fleet" ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: 2.5, fontWeight: t === "Fleet" ? 700 : 500, cursor: "pointer", fontFamily: font.body }}>{t.toUpperCase()}</span>
          ))}
        </div>
      </nav>
      <div style={{ position: "absolute", bottom: 72, left: 56, zIndex: 5 }}>
        <SectionLabel light>THE COLLECTION</SectionLabel>
        <h1 style={{ fontSize: 64, fontWeight: 300, color: "#fff", fontFamily: font.display, letterSpacing: -1 }}>Our Fleet</h1>
      </div>
    </ImgBg>

    <div style={{ padding: "36px 56px 0", display: "flex", gap: 10 }}>
      {["All Vessels", "Motor Yacht", "Sailing Yacht", "Explorer"].map((f, i) => (
        <button key={f} style={{
          padding: "9px 22px", border: i === 0 ? "none" : `1px solid ${C.border}`, borderRadius: 100,
          background: i === 0 ? C.navy : "transparent", color: i === 0 ? "#fff" : C.textSec,
          fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, fontFamily: font.body,
        }}>{f}</button>
      ))}
    </div>

    <div style={{ padding: "36px 56px 100px", display: "flex", flexDirection: "column", gap: 28 }}>
      {fleetData.map((y, i) => (
        <div key={i} onClick={() => onNavigate("yacht-detail")} style={{
          display: "flex", flexDirection: i % 2 === 0 ? "row" : "row-reverse",
          borderRadius: 12, overflow: "hidden", background: C.card, boxShadow: C.shadow, cursor: "pointer",
          transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s", minHeight: 280,
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = C.shadowLg; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = C.shadow; }}>
          <ImgBg src={y.img} style={{ width: "60%", minHeight: 280 }} overlay="linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 40%)" />
          <div style={{ flex: 1, padding: "36px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: C.textTert, fontWeight: 600 }}>{y.type.toUpperCase()}</div>
                <StatusBadge status={y.status} />
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 400, color: C.navy, fontFamily: font.display, marginBottom: 20 }}>{y.name}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[{ l: "Length", v: y.length }, { l: "Guests", v: y.guests }, { l: "Crew", v: y.crew }, { l: "Rating", v: `${y.rating} ★` }].map((s, j) => (
                  <div key={j}>
                    <div style={{ fontSize: 9, color: C.textTert, letterSpacing: 1.5, fontWeight: 600 }}>{s.l.toUpperCase()}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginTop: 3 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 26, fontWeight: 700, color: C.navy }}>{y.price}</span>
                <span style={{ fontSize: 12, color: C.textTert, marginLeft: 4 }}>/week</span>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: C.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowRight size={16} color={C.blue} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   FRONTEND: YACHT DETAIL
   ═══════════════════════════════════════════════ */
const YachtDetailPage = ({ onNavigate }) => {
  const y = fleetData[0];
  const [activeImg, setActiveImg] = useState(0);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font.body }}>
      <GlobalStyles />
      <ImgBg src={img.detail[activeImg]} style={{ height: "75vh", position: "relative", transition: "all 0.6s" }}
        overlay="linear-gradient(0deg, rgba(7,15,24,0.85) 0%, rgba(7,15,24,0.15) 40%, rgba(7,15,24,0.25) 100%)">
        <nav style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "32px 56px" }}>
          <div onClick={() => onNavigate("fleet")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 500, letterSpacing: 1 }}>
            <ArrowLeft size={16} /> BACK TO FLEET
          </div>
          <div onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}><Logo light /></div>
        </nav>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 5, padding: "0 56px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.35)", fontWeight: 600, marginBottom: 10 }}>MOTOR YACHT · {y.builder} · {y.year}</div>
            <h1 style={{ fontSize: 60, fontWeight: 300, color: "#fff", fontFamily: font.display, letterSpacing: -1 }}>{y.name}</h1>
            <div style={{ display: "flex", gap: 36, marginTop: 20 }}>
              {[{ l: y.length, i: <Ship size={13} /> }, { l: `${y.guests} Guests`, i: <Users size={13} /> }, { l: `${y.crew} Crew`, i: <Star size={13} /> }, { l: `${y.rating} Rating`, i: <Award size={13} /> }].map((s, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{s.i} {s.l}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {img.detail.map((src, i) => (
              <div key={i} onClick={() => setActiveImg(i)} style={{
                width: 80, height: 56, borderRadius: 6, overflow: "hidden", cursor: "pointer",
                border: i === activeImg ? "2px solid #fff" : "2px solid rgba(255,255,255,0.15)",
                opacity: i === activeImg ? 1 : 0.5, transition: "all 0.3s",
              }}>
                <ImgBg src={src} style={{ width: "100%", height: "100%" }} />
              </div>
            ))}
          </div>
        </div>
      </ImgBg>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 56, padding: "72px 56px 100px" }}>
        <div>
          <Heading size={32} style={{ marginBottom: 20 }}>About This Vessel</Heading>
          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.85, marginBottom: 40, maxWidth: 560 }}>
            Built in 2019 by Lürssen with interiors by Reymond Langton Design. Five expansive staterooms with panoramic ocean views.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0, marginBottom: 56, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
            {[
              { label: "Built", value: "2019" }, { label: "Builder", value: "Lürssen" }, { label: "Beam", value: "32 ft" },
              { label: "Draft", value: "11.5 ft" }, { label: "Speed", value: "16 kn" }, { label: "Range", value: "5,000 nm" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "22px 20px", background: C.card, borderRight: i < 5 ? `1px solid ${C.borderLight}` : "none", textAlign: "center" }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: C.textTert, fontWeight: 600 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginTop: 8 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 22, fontWeight: 400, color: C.navy, fontFamily: font.display, marginBottom: 20 }}>Amenities</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            {["Infinity Pool", "Beach Club", "Cinema", "Helipad", "Spa & Sauna", "Water Toys", "Gym", "Jacuzzi"].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", background: C.card, borderRadius: 8, border: `1px solid ${C.borderLight}` }}>
                <Check size={13} color={C.emerald} strokeWidth={3} />
                <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "sticky", top: 32, alignSelf: "start" }}>
          <div style={{ background: C.card, borderRadius: 14, boxShadow: C.shadowLg, padding: 40, border: `1px solid ${C.borderLight}` }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: C.textTert, fontWeight: 600, marginBottom: 10 }}>STARTING FROM</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.navy, lineHeight: 1, fontFamily: font.display }}>{y.price}</div>
            <div style={{ fontSize: 13, color: C.textTert, marginBottom: 32, marginTop: 4 }}>per week · all inclusive</div>

            {[{ l: "DATES", v: "Apr 12 – Apr 19, 2026" }, { l: "GUESTS", v: "8 guests" }, { l: "DESTINATION", v: "French Riviera" }].map((f, i) => (
              <div key={i} style={{ padding: "14px 18px", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 10 }}>
                <div style={{ fontSize: 9, letterSpacing: 1.5, color: C.textTert, fontWeight: 600 }}>{f.l}</div>
                <div style={{ fontSize: 14, color: C.text, marginTop: 4, fontWeight: 500 }}>{f.v}</div>
              </div>
            ))}

            <button onClick={() => onNavigate("booking")} style={{
              width: "100%", padding: "17px", background: C.blue, color: "#fff", border: "none", borderRadius: 8,
              fontSize: 12, fontWeight: 700, letterSpacing: 2, cursor: "pointer", marginTop: 20, fontFamily: font.body,
            }}>REQUEST CHARTER</button>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: C.textTert }}>No commitment · Free consultation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   FRONTEND: BOOKING FLOW
   ═══════════════════════════════════════════════ */
const BookingPage = ({ onNavigate }) => {
  const [step, setStep] = useState(0);
  const [guests, setGuests] = useState(8);
  const [selectedYacht, setSelectedYacht] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([0, 2]);
  const steps = ["Dates & Destination", "Vessel", "Packages", "Confirmation"];
  const addons = [
    { name: "Private Chef", price: "$12,000", desc: "Michelin-trained culinary team" },
    { name: "Dive Instructor", price: "$4,500", desc: "PADI certified" },
    { name: "Helicopter Transfers", price: "$18,000", desc: "Door-to-yacht luxury transit" },
    { name: "Onboard Spa", price: "$8,000", desc: "Full treatment menu" },
  ];
  const availableYachts = fleetData.filter(y => y.status === "Available");

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font.body }}>
      <GlobalStyles />
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 56px", borderBottom: `1px solid ${C.border}`, background: "#fff" }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}><Logo /></div>
        <div style={{ fontSize: 12, color: C.textTert }}>
          Need help? <span style={{ color: C.blue, fontWeight: 600, cursor: "pointer" }}>+1 (888) 555-SAIL</span>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 64 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: i <= step ? C.navy : C.border, color: i <= step ? "#fff" : C.textTert,
                  fontSize: 12, fontWeight: 700, transition: "all 0.3s",
                }}>
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: i === step ? 700 : 400, color: i <= step ? C.navy : C.textTert, letterSpacing: 0.3 }}>{s}</span>
              </div>
              {i < 3 && <div style={{ width: 48, height: 1, background: i < step ? C.navy : C.border, margin: "0 16px", transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <Heading size={36}>When & Where</Heading>
              <p style={{ color: C.textTert, fontSize: 14, marginTop: 8 }}>Select your charter dates and destination</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[{ l: "EMBARKATION", v: "April 12, 2026" }, { l: "DISEMBARKATION", v: "April 19, 2026" }].map((d, i) => (
                <div key={i} style={{ padding: 28, background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: C.textTert, fontWeight: 600, marginBottom: 12 }}>{d.l}</div>
                  <div style={{ padding: "12px 16px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.text, fontWeight: 500 }}>{d.v}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 28, background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.textTert, fontWeight: 600, marginBottom: 14 }}>DESTINATION</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {["French Riviera", "Greek Islands", "Caribbean"].map((d, i) => (
                  <div key={d} style={{
                    padding: 18, borderRadius: 8, textAlign: "center", cursor: "pointer",
                    border: i === 0 ? `2px solid ${C.blue}` : `1px solid ${C.border}`,
                    background: i === 0 ? C.blueSoft : "transparent",
                    fontSize: 14, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.blue : C.text, transition: "all 0.2s",
                  }}>{d}</div>
                ))}
              </div>
            </div>
            <div style={{ padding: 28, background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: C.textTert, fontWeight: 600, marginBottom: 14 }}>GUESTS</div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <button onClick={() => setGuests(Math.max(1, guests - 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${C.border}`, background: "transparent", fontSize: 20, cursor: "pointer", color: C.text }}>−</button>
                <span style={{ fontSize: 32, fontWeight: 700, color: C.navy, minWidth: 48, textAlign: "center", fontFamily: font.display }}>{guests}</span>
                <button onClick={() => setGuests(Math.min(14, guests + 1))} style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${C.border}`, background: "transparent", fontSize: 20, cursor: "pointer", color: C.text }}>+</button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <Heading size={36}>Select Your Vessel</Heading>
              <p style={{ color: C.textTert, fontSize: 14, marginTop: 8 }}>Available for your selected dates</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {availableYachts.map((y, i) => (
                <div key={i} onClick={() => setSelectedYacht(i)} style={{
                  display: "flex", borderRadius: 12, overflow: "hidden", background: C.card, cursor: "pointer",
                  border: i === selectedYacht ? `2px solid ${C.blue}` : `1px solid ${C.border}`, transition: "all 0.25s",
                }}>
                  <ImgBg src={y.img} style={{ width: 240, minHeight: 150, flexShrink: 0 }} />
                  <div style={{ flex: 1, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: 22, fontWeight: 400, color: C.navy, fontFamily: font.display }}>{y.name}</h3>
                      <div style={{ fontSize: 12, color: C.textTert, marginTop: 4 }}>{y.length} · {y.guests} guests · {y.crew} crew</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: C.navy }}>{y.price}</div>
                      <div style={{ fontSize: 11, color: C.textTert }}>per week</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <Heading size={36}>Enhance Your Voyage</Heading>
              <p style={{ color: C.textTert, fontSize: 14, marginTop: 8 }}>Premium add-ons</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {addons.map((a, i) => (
                <div key={i} onClick={() => setSelectedAddons(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])} style={{
                  padding: 28, borderRadius: 12, background: C.card, cursor: "pointer",
                  border: selectedAddons.includes(i) ? `2px solid ${C.blue}` : `1px solid ${C.border}`, transition: "all 0.25s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>{a.name}</h3>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: selectedAddons.includes(i) ? C.blue : C.border, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
                      {selectedAddons.includes(i) && <Check size={13} color="#fff" strokeWidth={3} />}
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: C.textTert, marginBottom: 14 }}>{a.desc}</p>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>{a.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(15,163,138,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <CheckCircle2 size={36} color={C.emerald} strokeWidth={1.5} />
            </div>
            <Heading size={36}>Charter Request Submitted</Heading>
            <p style={{ color: C.textTert, fontSize: 14, marginTop: 10, marginBottom: 40 }}>Our advisor will contact you within 2 hours</p>
            <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 32, textAlign: "left" }}>
              <div style={{ fontSize: 9, letterSpacing: 2.5, color: C.textTert, fontWeight: 600, marginBottom: 18 }}>SUMMARY</div>
              {[
                { l: "Vessel", v: "Calico Sovereign" }, { l: "Dates", v: "Apr 12 – 19, 2026" },
                { l: "Guests", v: `${guests}` }, { l: "Destination", v: "French Riviera" },
                { l: "Add-ons", v: selectedAddons.map(i => addons[i].name).join(", ") },
                { l: "Estimated Total", v: "$215,000" },
              ].map((r, i, a) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "13px 0", borderBottom: i < a.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
                  <span style={{ fontSize: 13, color: C.textSec }}>{r.l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{r.v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate("home")} style={{ marginTop: 36, padding: "15px 40px", background: C.navy, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 1.5, fontFamily: font.body }}>RETURN HOME</button>
          </div>
        )}

        {step < 3 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 52 }}>
            <button onClick={() => step > 0 ? setStep(step - 1) : onNavigate("home")} style={{
              padding: "15px 36px", background: "transparent", color: C.textSec, border: `1px solid ${C.border}`,
              borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font.body,
            }}>{step === 0 ? "Cancel" : "Back"}</button>
            <button onClick={() => setStep(step + 1)} style={{
              padding: "15px 44px", background: C.navy, color: "#fff", border: "none",
              borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1.5, fontFamily: font.body,
            }}>{step === 2 ? "Submit Request" : "Continue"}</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   BACKEND SHARED LAYOUT
   ═══════════════════════════════════════════════════════════ */
const SidebarNav = ({ active, onNavigate }) => {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
    { id: "bookings", label: "Bookings", icon: <BookOpen size={17} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays size={17} /> },
    { id: "clients", label: "Clients", icon: <Users size={17} /> },
    { id: "fleet-mgmt", label: "Fleet", icon: <Sailboat size={17} /> },
    { id: "messages", label: "Messages", icon: <Mail size={17} />, badge: 2 },
    { id: "revenue", label: "Revenue", icon: <DollarSign size={17} /> },
  ];
  return (
    <div style={{ width: 240, background: C.navyDeep, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: font.body, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ padding: "28px 24px 36px" }}><Logo light size="small" /></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, padding: "0 8px" }}>
        {items.map(item => (
          <div key={item.id} onClick={() => onNavigate(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", cursor: "pointer", borderRadius: 8,
            background: active === item.id ? "rgba(31,111,255,0.12)" : "transparent",
            color: active === item.id ? "#fff" : "rgba(255,255,255,0.38)",
            transition: "all 0.2s",
          }}>
            {item.icon}
            <span style={{ fontSize: 13, fontWeight: active === item.id ? 600 : 400, flex: 1 }}>{item.label}</span>
            {item.badge && <span style={{ background: C.blue, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>{item.badge}</span>}
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div onClick={() => onNavigate("home")} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.28)", fontSize: 12, cursor: "pointer", padding: "8px 0" }}>
          <ExternalLink size={14} /> View Website
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.28)", fontSize: 12, cursor: "pointer", padding: "8px 0" }}>
          <Settings size={14} /> Settings
        </div>
      </div>
    </div>
  );
};

const TopBar = ({ title, subtitle }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", borderBottom: `1px solid ${C.border}`, background: "#fff" }}>
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, fontFamily: font.body, letterSpacing: -0.3 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 12, color: C.textTert, marginTop: 2 }}>{subtitle}</p>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bgWarm, borderRadius: 8, padding: "8px 14px", width: 260 }}>
        <Search size={14} color={C.textTert} />
        <input placeholder="Search..." style={{ border: "none", background: "transparent", fontSize: 12, outline: "none", width: "100%", color: C.text, fontFamily: font.body }} />
      </div>
      <div style={{ position: "relative", cursor: "pointer", padding: 6 }}>
        <Bell size={17} color={C.textSec} />
        <div style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: C.blue, border: "2px solid #fff" }} />
      </div>
      <div style={{ width: 1, height: 24, background: C.border }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>CA</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Charter Admin</div>
          <div style={{ fontSize: 10, color: C.textTert }}>Operations</div>
        </div>
      </div>
    </div>
  </div>
);

const BackendLayout = ({ active, onNavigate, title, subtitle, children }) => (
  <div style={{ display: "flex", minHeight: "100vh", fontFamily: font.body }}>
    <GlobalStyles />
    <SidebarNav active={active} onNavigate={onNavigate} />
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <TopBar title={title} subtitle={subtitle} />
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
    </div>
  </div>
);

const MetricCard = ({ label, value, sub, icon, trend }) => (
  <div style={{ background: C.card, borderRadius: 12, padding: "26px 28px", boxShadow: C.shadow, border: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
    <div>
      <div style={{ fontSize: 10, color: C.textTert, fontWeight: 600, letterSpacing: 1.5, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: C.navy, lineHeight: 1, letterSpacing: -0.5 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: trend === "up" ? C.emerald : C.textTert, marginTop: 8, fontWeight: 600 }}>{sub}</div>}
    </div>
    <div style={{ width: 44, height: 44, borderRadius: 10, background: C.blueSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.blue }}>{icon}</div>
  </div>
);

/* ═══════════════════════════════════════════════
   BACKEND: DASHBOARD
   ═══════════════════════════════════════════════ */
const DashboardPage = ({ onNavigate }) => (
  <BackendLayout active="dashboard" onNavigate={onNavigate} title="Operations Overview" subtitle="Real-time charter command center">
    <div style={{ padding: "32px 40px 60px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 18, marginBottom: 28 }}>
        <MetricCard label="MONTHLY REVENUE" value="$1.45M" sub="↑ 18% vs last month" icon={<DollarSign size={20} />} trend="up" />
        <MetricCard label="ACTIVE CHARTERS" value="3" sub="2 departing this week" icon={<Ship size={20} />} />
        <MetricCard label="UPCOMING" value="8" sub="Next: Apr 12" icon={<Calendar size={20} />} />
        <MetricCard label="FLEET UTILIZATION" value="72%" sub="4 of 6 active" icon={<Activity size={20} />} trend="up" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "5fr 3fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: C.card, borderRadius: 14, padding: "28px 28px 16px", boxShadow: C.shadow, border: `1px solid ${C.borderLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Revenue Overview</h3>
              <p style={{ fontSize: 11, color: C.textTert, marginTop: 3 }}>Monthly charter revenue</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["1M", "6M", "1Y"].map((p, i) => (
                <button key={p} style={{ padding: "5px 14px", borderRadius: 6, border: "none", background: i === 2 ? C.navy : C.bgWarm, color: i === 2 ? "#fff" : C.textTert, fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 }}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.blue} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: C.textTert }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: C.textTert }} tickFormatter={v => `$${v / 1000}k`} dx={-4} />
              <Tooltip formatter={v => [`$${(v / 1000).toFixed(0)}k`, "Revenue"]} contentStyle={{ borderRadius: 8, border: "none", boxShadow: C.shadowMd, fontSize: 11, fontFamily: font.body }} />
              <Area type="monotone" dataKey="revenue" stroke={C.blue} strokeWidth={2.5} fill="url(#rg)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, borderRadius: 14, padding: 28, boxShadow: C.shadow, border: `1px solid ${C.borderLight}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 24 }}>Recent Bookings</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {bookingsData.slice(0, 4).map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{b.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{b.client}</div>
                  <div style={{ fontSize: 11, color: C.textTert }}>{b.yacht}</div>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: C.card, borderRadius: 14, padding: 28, boxShadow: C.shadow, border: `1px solid ${C.borderLight}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 24 }}>Fleet Status</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {fleetData.slice(0, 4).map((y, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.borderLight}` : "none" }}>
                <ImgBg src={y.img} style={{ width: 48, height: 34, borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{y.name}</div>
                  <div style={{ fontSize: 10, color: C.textTert }}>{y.type}</div>
                </div>
                <StatusBadge status={y.status} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: C.card, borderRadius: 14, padding: 28, boxShadow: C.shadow, border: `1px solid ${C.borderLight}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 24 }}>Charter by Type</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={4} strokeWidth={0}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                  <span style={{ fontSize: 12, color: C.textSec }}>{d.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginLeft: 8 }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </BackendLayout>
);

/* ═══════════════════════════════════════════════
   BACKEND: BOOKINGS
   ═══════════════════════════════════════════════ */
const BookingsPage = ({ onNavigate }) => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? bookingsData : bookingsData.filter(b => b.status === filter);
  return (
    <BackendLayout active="bookings" onNavigate={onNavigate} title="Bookings Pipeline" subtitle="Manage all charter reservations">
      <div style={{ padding: "32px 40px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["All", "New", "Confirmed", "Pending", "Completed"].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: "7px 18px", borderRadius: 100, border: filter === s ? "none" : `1px solid ${C.border}`,
                background: filter === s ? C.navy : "transparent", color: filter === s ? "#fff" : C.textSec,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>{s}</button>
            ))}
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <Plus size={15} /> New Booking
          </button>
        </div>

        <div style={{ background: C.card, borderRadius: 14, boxShadow: C.shadow, border: `1px solid ${C.borderLight}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                {["ID", "Client", "Yacht", "Dates", "Guests", "Total", "Status", ""].map((h, i) => (
                  <th key={i} style={{ padding: "13px 20px", textAlign: "left", fontSize: 10, letterSpacing: 1.5, color: C.textTert, fontWeight: 600, background: C.bgWarm }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}`, cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.cardHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "15px 20px", fontSize: 12, fontWeight: 700, color: C.blue, letterSpacing: 0.3 }}>{b.id}</td>
                  <td style={{ padding: "15px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 700 }}>{b.avatar}</div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{b.client}</span>
                    </div>
                  </td>
                  <td style={{ padding: "15px 20px", fontSize: 13, color: C.text }}>{b.yacht}</td>
                  <td style={{ padding: "15px 20px", fontSize: 12, color: C.textTert }}>{b.dates}</td>
                  <td style={{ padding: "15px 20px", fontSize: 13, color: C.text }}>{b.guests}</td>
                  <td style={{ padding: "15px 20px", fontSize: 13, fontWeight: 700, color: C.navy }}>{b.total}</td>
                  <td style={{ padding: "15px 20px" }}><StatusBadge status={b.status} /></td>
                  <td style={{ padding: "15px 20px" }}><MoreHorizontal size={15} color={C.textTert} style={{ cursor: "pointer" }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BackendLayout>
  );
};

/* ═══════════════════════════════════════════════
   BACKEND: CALENDAR
   ═══════════════════════════════════════════════ */
const CalendarPage = ({ onNavigate }) => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <BackendLayout active="calendar" onNavigate={onNavigate} title="Charter Calendar" subtitle="Scheduling & availability">
      <div style={{ padding: "32px 40px 60px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <ChevronLeft size={17} color={C.textSec} style={{ cursor: "pointer" }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: C.navy, minWidth: 120, textAlign: "center" }}>April 2026</span>
          <ChevronRight size={17} color={C.textSec} style={{ cursor: "pointer" }} />
        </div>
        <div style={{ background: C.card, borderRadius: 14, boxShadow: C.shadow, border: `1px solid ${C.borderLight}`, padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <div key={d} style={{ padding: 8, textAlign: "center", fontSize: 10, fontWeight: 700, color: C.textTert, letterSpacing: 1.5 }}>{d.toUpperCase()}</div>
            ))}
            <div />
            {days.map(d => {
              const ev = calendarEvents.filter(e => e.day === d);
              const isToday = d === 4;
              return (
                <div key={d} style={{
                  minHeight: 88, padding: 8, borderRadius: 6,
                  border: `1px solid ${isToday ? C.blue : C.borderLight}`,
                  background: isToday ? C.blueSoft : "transparent",
                  cursor: "pointer", transition: "background 0.15s",
                }}
                  onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = C.cardHover; }}
                  onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = "transparent"; }}>
                  <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? C.blue : C.text, marginBottom: 4 }}>{d}</div>
                  {ev.map((e, j) => (
                    <div key={j} style={{
                      fontSize: 9, padding: "3px 6px", borderRadius: 4, marginBottom: 2, fontWeight: 600, letterSpacing: 0.3,
                      background: e.type === "charter" ? C.blueSoft : e.type === "maintenance" ? "rgba(212,120,26,0.08)" : "#F0F1F3",
                      color: e.type === "charter" ? C.blue : e.type === "maintenance" ? "#D4781A" : C.textTert,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{e.yacht}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
          {[{ l: "Charter", c: C.blue, b: C.blueSoft }, { l: "Maintenance", c: "#D4781A", b: "rgba(212,120,26,0.08)" }, { l: "Blocked", c: C.textTert, b: "#F0F1F3" }].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: l.b, border: `1px solid ${l.c}20` }} />
              <span style={{ fontSize: 11, color: C.textTert, fontWeight: 500 }}>{l.l}</span>
            </div>
          ))}
        </div>
      </div>
    </BackendLayout>
  );
};

/* ═══════════════════════════════════════════════
   BACKEND: CLIENTS
   ═══════════════════════════════════════════════ */
const ClientsPage = ({ onNavigate }) => {
  const clients = [
    { name: "Harrison Wells", email: "h.wells@email.com", charters: 5, spent: "$925K", since: "2021", avatar: "HW", pref: "French Riviera" },
    { name: "Elena Vasquez", email: "elena.v@email.com", charters: 3, spent: "$375K", since: "2023", avatar: "EV", pref: "Caribbean" },
    { name: "James Chen", email: "j.chen@email.com", charters: 7, spent: "$1.15M", since: "2019", avatar: "JC", pref: "Mediterranean" },
    { name: "Sophia Laurent", email: "s.laurent@email.com", charters: 4, spent: "$680K", since: "2022", avatar: "SL", pref: "Greek Islands" },
    { name: "Marcus Reid", email: "marcus.r@email.com", charters: 2, spent: "$190K", since: "2024", avatar: "MR", pref: "Bahamas" },
  ];
  return (
    <BackendLayout active="clients" onNavigate={onNavigate} title="Client Profiles" subtitle="Relationship management">
      <div style={{ padding: "32px 40px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {clients.map((c, i) => (
            <div key={i} style={{ background: C.card, borderRadius: 14, padding: 28, boxShadow: C.shadow, border: `1px solid ${C.borderLight}`, cursor: "pointer", transition: "box-shadow 0.3s, transform 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = C.shadowMd; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.transform = ""; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{ width: 46, height: 46, borderRadius: 10, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>{c.avatar}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.textTert }}>{c.email}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                {[{ l: "Charters", v: c.charters }, { l: "Spent", v: c.spent }, { l: "Since", v: c.since }, { l: "Preferred", v: c.pref }].map((s, j) => (
                  <div key={j}>
                    <div style={{ fontSize: 9, color: C.textTert, letterSpacing: 1.5, fontWeight: 600 }}>{s.l.toUpperCase()}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginTop: 5 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BackendLayout>
  );
};

/* ═══════════════════════════════════════════════
   BACKEND: FLEET MANAGEMENT
   ═══════════════════════════════════════════════ */
const FleetMgmtPage = ({ onNavigate }) => (
  <BackendLayout active="fleet-mgmt" onNavigate={onNavigate} title="Fleet Management" subtitle="Vessel operations & status">
    <div style={{ padding: "32px 40px 60px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={15} /> Add Vessel
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {fleetData.map((y, i) => (
          <div key={i} style={{ display: "flex", background: C.card, borderRadius: 14, boxShadow: C.shadow, border: `1px solid ${C.borderLight}`, overflow: "hidden", transition: "box-shadow 0.3s", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = C.shadowMd} onMouseLeave={e => e.currentTarget.style.boxShadow = C.shadow}>
            <ImgBg src={y.img} style={{ width: 220, minHeight: 130, flexShrink: 0 }} />
            <div style={{ flex: 1, padding: "20px 28px", display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr auto", alignItems: "center", gap: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>{y.name}</div>
                <div style={{ fontSize: 11, color: C.textTert, marginTop: 3 }}>{y.type} · {y.length}</div>
              </div>
              <div><div style={{ fontSize: 9, color: C.textTert, letterSpacing: 1.5, fontWeight: 600 }}>GUESTS</div><div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginTop: 3 }}>{y.guests}</div></div>
              <div><div style={{ fontSize: 9, color: C.textTert, letterSpacing: 1.5, fontWeight: 600 }}>CREW</div><div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginTop: 3 }}>{y.crew}</div></div>
              <div><div style={{ fontSize: 9, color: C.textTert, letterSpacing: 1.5, fontWeight: 600 }}>RATE</div><div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginTop: 3 }}>{y.price}/wk</div></div>
              <StatusBadge status={y.status} />
              <MoreHorizontal size={16} color={C.textTert} style={{ cursor: "pointer" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </BackendLayout>
);

/* ═══════════════════════════════════════════════
   BACKEND: MESSAGES
   ═══════════════════════════════════════════════ */
const MessagesPage = ({ onNavigate }) => {
  const [activeMsg, setActiveMsg] = useState(0);
  return (
    <BackendLayout active="messages" onNavigate={onNavigate} title="Communications" subtitle="Client messaging">
      <div style={{ display: "flex", height: "calc(100vh - 73px)" }}>
        <div style={{ width: 340, borderRight: `1px solid ${C.border}`, background: "#fff", overflowY: "auto" }}>
          <div style={{ padding: "16px 20px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bgWarm, borderRadius: 8, padding: "8px 12px" }}>
              <Search size={13} color={C.textTert} />
              <input placeholder="Search messages..." style={{ border: "none", background: "transparent", fontSize: 12, outline: "none", width: "100%", fontFamily: font.body }} />
            </div>
          </div>
          {msgData.map((m, i) => (
            <div key={i} onClick={() => setActiveMsg(i)} style={{
              display: "flex", gap: 12, padding: "16px 20px", cursor: "pointer",
              background: i === activeMsg ? C.blueSoft : "transparent",
              borderLeft: i === activeMsg ? `3px solid ${C.blue}` : "3px solid transparent",
              transition: "all 0.15s",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                {m.from.split(" ").map(w => w[0]).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: m.unread ? 700 : 500, color: C.navy }}>{m.from}</span>
                  <span style={{ fontSize: 10, color: C.textTert }}>{m.time}</span>
                </div>
                <p style={{ fontSize: 11, color: C.textTert, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.msg}</p>
              </div>
              {m.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.blue, marginTop: 6, flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, background: "#fff" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>
              {msgData[activeMsg].from.split(" ").map(w => w[0]).join("")}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{msgData[activeMsg].from}</div>
              <div style={{ fontSize: 10, color: C.emerald, fontWeight: 600 }}>● Online</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
              <Phone size={15} color={C.textTert} style={{ cursor: "pointer" }} />
              <MoreHorizontal size={15} color={C.textTert} style={{ cursor: "pointer" }} />
            </div>
          </div>

          <div style={{ flex: 1, padding: 32, overflowY: "auto", background: C.bgWarm }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ alignSelf: "flex-start", maxWidth: "60%", background: "#fff", borderRadius: "14px 14px 14px 4px", padding: "14px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.65 }}>{msgData[activeMsg].msg}</p>
                <span style={{ fontSize: 10, color: C.textTert, marginTop: 6, display: "block" }}>{msgData[activeMsg].time}</span>
              </div>
              <div style={{ alignSelf: "flex-end", maxWidth: "60%", background: C.blue, borderRadius: "14px 14px 4px 14px", padding: "14px 20px" }}>
                <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.65 }}>I'll arrange the helicopter transfer and send the updated itinerary shortly.</p>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 6, display: "block" }}>Just now</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "14px 28px", borderTop: `1px solid ${C.border}`, background: "#fff", display: "flex", gap: 12, alignItems: "center" }}>
            <input placeholder="Type a message..." style={{ flex: 1, padding: "12px 16px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, outline: "none", fontFamily: font.body }} />
            <button style={{ width: 40, height: 40, borderRadius: 10, background: C.blue, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Send size={15} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </BackendLayout>
  );
};

/* ═══════════════════════════════════════════════
   BACKEND: REVENUE
   ═══════════════════════════════════════════════ */
const RevenuePage = ({ onNavigate }) => (
  <BackendLayout active="revenue" onNavigate={onNavigate} title="Revenue & Reporting" subtitle="Financial overview for 2026">
    <div style={{ padding: "32px 40px 60px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 24 }}>
        <MetricCard label="YTD REVENUE" value="$11.3M" sub="↑ 24% vs 2025" icon={<TrendingUp size={20} />} trend="up" />
        <MetricCard label="AVG CHARTER VALUE" value="$165K" sub="↑ 8% vs 2025" icon={<Target size={20} />} trend="up" />
        <MetricCard label="TOTAL CHARTERS" value="80" sub="12 this quarter" icon={<Ship size={20} />} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "5fr 3fr", gap: 20 }}>
        <div style={{ background: C.card, borderRadius: 14, padding: 28, boxShadow: C.shadow, border: `1px solid ${C.borderLight}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 28 }}>Revenue vs Bookings</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData} barGap={4}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: C.textTert }} dy={8} />
              <YAxis yAxisId="rev" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: C.textTert }} tickFormatter={v => `$${v / 1000}k`} dx={-4} />
              <YAxis yAxisId="bk" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: C.textTert }} dx={4} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: C.shadowMd, fontSize: 11, fontFamily: font.body }} />
              <Bar yAxisId="rev" dataKey="revenue" fill={C.blue} radius={[4, 4, 0, 0]} barSize={24} />
              <Line yAxisId="bk" type="monotone" dataKey="bookings" stroke={C.emerald} strokeWidth={2.5} dot={{ fill: C.emerald, r: 3.5, strokeWidth: 0 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, borderRadius: 14, padding: 28, boxShadow: C.shadow, border: `1px solid ${C.borderLight}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 24 }}>Top Vessels by Revenue</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[...fleetData].sort((a, b) => b.priceNum - a.priceNum).slice(0, 5).map((y, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{y.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>${(y.priceNum * (5 - i) / 1000).toFixed(0)}k</span>
                </div>
                <div style={{ height: 5, borderRadius: 10, background: C.bgWarm, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${100 - i * 16}%`, borderRadius: 10, background: i === 0 ? C.blue : i === 1 ? C.emerald : C.navyMid, transition: "width 0.6s ease-out" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </BackendLayout>
);

/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */
export default function CalicoYachtCharters() {
  const [page, setPage] = useState("home");

  const pages = {
    home: <HomePage onNavigate={setPage} />,
    fleet: <FleetPage onNavigate={setPage} />,
    "yacht-detail": <YachtDetailPage onNavigate={setPage} />,
    booking: <BookingPage onNavigate={setPage} />,
    dashboard: <DashboardPage onNavigate={setPage} />,
    bookings: <BookingsPage onNavigate={setPage} />,
    calendar: <CalendarPage onNavigate={setPage} />,
    clients: <ClientsPage onNavigate={setPage} />,
    "fleet-mgmt": <FleetMgmtPage onNavigate={setPage} />,
    messages: <MessagesPage onNavigate={setPage} />,
    revenue: <RevenuePage onNavigate={setPage} />,
  };

  const pageOrder = ["home", "fleet", "yacht-detail", "booking", "dashboard", "bookings", "calendar", "clients", "fleet-mgmt", "messages", "revenue"];
  useEffect(() => {
    const handler = (e) => {
      const idx = pageOrder.indexOf(page);
      if (e.key === "ArrowRight" && idx < pageOrder.length - 1) setPage(pageOrder[idx + 1]);
      if (e.key === "ArrowLeft" && idx > 0) setPage(pageOrder[idx - 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [page]);

  return (
    <div style={{ fontFamily: font.body, WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}>
      <GlobalStyles />
      {pages[page]}
    </div>
  );
}
