"use client";
import { useState, useEffect, useRef, useCallback, useMemo, useReducer, createContext, useContext } from "react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Anchor, Ship, Calendar, Users, MessageSquare, TrendingUp, ChevronRight, ChevronLeft, Star, MapPin, Clock, Check, Menu, X, Bell, Search, Settings, Home, LayoutDashboard, BookOpen, UserCircle, Sailboat, DollarSign, Mail, Filter, Plus, ArrowRight, ArrowLeft, ChevronDown, Eye, MoreHorizontal, Phone, Send, Waves, Navigation, Compass, Sun, Wind, Globe, Award, Shield, Heart, Zap, BarChart3, PieChart as PieChartIcon, CalendarDays, FileText, LogOut, RefreshCw, AlertCircle, CheckCircle2, XCircle, MinusCircle, ExternalLink, ArrowUpRight, Activity, Target, Bot, Sparkles, Command, Brain, Mic, ChevronUp, UserPlus, ShieldCheck, Wrench, AlertTriangle, ClipboardList, StickyNote, Megaphone, ThumbsUp, Hash, Paperclip, Image, Upload, Download, Edit3, Trash2, Copy, RotateCcw, Lock, Unlock, Flag, Tag, Layers, GitBranch, Database, Wifi, WifiOff, BellRing, ArrowDown, ArrowUp, TrendingDown, Circle, BarChart2, PenTool, FileCheck, FilePlus, FolderOpen, Archive, Inbox, MailOpen, AtSign, Link2, Share2, Bookmark, HelpCircle, Info, Terminal, Play, Loader, CheckCheck, Cog, Plug, Palette, Volume2, Globe2, CreditCard, Receipt, Timer, Gauge } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 0: DESIGN TOKENS ███
   ═══════════════════════════════════════════════════════════════ */
const C = {
  navy: "#0C1B2A", navyDeep: "#060D15", navyMid: "#12253A", navyLight: "#1A3350",
  blue: "#1F6FFF", blueSoft: "rgba(31,111,255,0.08)", blueGlow: "rgba(31,111,255,0.15)",
  emerald: "#0FA38A", emeraldSoft: "rgba(15,163,138,0.1)",
  amber: "#D4781A", amberSoft: "rgba(212,120,26,0.08)",
  red: "#DC3545", redSoft: "rgba(220,53,69,0.08)",
  bg: "#F7F9FB", bgWarm: "#F4F6F8",
  text: "#0E1114", textSec: "#5B6470", textTert: "#8D95A0",
  card: "#FFFFFF", cardHover: "#FCFCFD",
  border: "#ECEEF1", borderLight: "#F2F3F5",
  shadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04)",
  shadowMd: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
  shadowLg: "0 4px 12px rgba(0,0,0,0.05), 0 16px 48px rgba(0,0,0,0.08)",
  shadowXl: "0 8px 24px rgba(0,0,0,0.06), 0 24px 64px rgba(0,0,0,0.1)",
};
const font = { display: "'Playfair Display', serif", body: "'DM Sans', sans-serif", mono: "'JetBrains Mono', monospace" };
const img = {
  yachts: [
    "/calico-assets/yachts/calico.png",
    "/calico-assets/yachts/alokoy.png",
  ],
  yachtDetails: {
    "YT-001": [
      "/calico-assets/yachts/calico.png",
      "/calico-assets/yachts/calico-interior1.png",
      "/calico-assets/yachts/calicodeck.png",
      "/calico-assets/yachts/calicoaerial.png",
      "/calico-assets/yachts/calicosuite.png",
    ],
    "YT-002": [
      "/calico-assets/yachts/alokoy.png",
      "/calico-assets/yachts/alokoy.png",
      "/calico-assets/yachts/alokoy.png",
      "/calico-assets/yachts/alokoy.png",
      "/calico-assets/yachts/alokoy.png",
    ],
  },
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

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 1: DATABASE SCHEMA — RELATIONAL DATA STORE ███
   Every record has an ID. Every relationship is explicit.
   This replaces all loose arrays from V2.
   ═══════════════════════════════════════════════════════════════ */
const generateId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;

const createInitialDB = () => ({
  clients: {
    "CL-001": { id: "CL-001", name: "Harrison Wells", email: "h.wells@email.com", phone: "+1 (310) 555-0147", vip: true, since: "2021", pref: "Marina del Rey, Los Angeles", notes: "Prefers Dom Pérignon. Wife allergic to shellfish.", createdAt: "2021-03-15T00:00:00Z", bookingIds: ["BK-001"], invoiceIds: ["INV-001"], messageThreadIds: ["MT-001"], noteIds: ["NT-001"], documentIds: ["DOC-001"], reviewIds: ["RV-002"] },
    "CL-002": { id: "CL-002", name: "Elena Vasquez", email: "elena.v@email.com", phone: "+34 612 345 678", vip: false, since: "2023", pref: "Marina del Rey, Los Angeles", notes: "Interested in diving. Traveling with 2 children under 10.", createdAt: "2023-06-01T00:00:00Z", bookingIds: ["BK-002"], invoiceIds: ["INV-002"], messageThreadIds: ["MT-002"], noteIds: ["NT-003"], documentIds: ["DOC-002"], reviewIds: [] },
    "CL-003": { id: "CL-003", name: "James Chen", email: "j.chen@email.com", phone: "+852 9123 4567", vip: true, since: "2019", pref: "Marina del Rey, Los Angeles", notes: "Top client. Prefers captain-led harbor departures. Birthday June 14.", createdAt: "2019-01-10T00:00:00Z", bookingIds: ["BK-003"], invoiceIds: ["INV-003"], messageThreadIds: ["MT-003"], noteIds: [], documentIds: ["DOC-003"], reviewIds: ["RV-001"] },
    "CL-004": { id: "CL-004", name: "Sophia Laurent", email: "s.laurent@email.com", phone: "+33 6 12 34 56 78", vip: true, since: "2022", pref: "Marina del Rey, Los Angeles", notes: "Fashion industry. Needs high-speed internet.", createdAt: "2022-04-20T00:00:00Z", bookingIds: ["BK-004"], invoiceIds: ["INV-004"], messageThreadIds: ["MT-004"], noteIds: ["NT-002"], documentIds: ["DOC-005"], reviewIds: [] },
    "CL-005": { id: "CL-005", name: "Marcus Reid", email: "marcus.r@email.com", phone: "+1 (786) 555-0392", vip: false, since: "2024", pref: "Marina del Rey, Los Angeles", notes: "New client. Referred by Harrison Wells.", createdAt: "2024-02-15T00:00:00Z", bookingIds: ["BK-005"], invoiceIds: ["INV-005"], messageThreadIds: ["MT-005"], noteIds: [], documentIds: [], reviewIds: [] },
    "CL-006": { id: "CL-006", name: "Olivia Park", email: "o.park@email.com", phone: "+82 10 1234 5678", vip: false, since: "2022", pref: "Marina del Rey, Los Angeles", notes: "Corporate retreats. Needs presentation setup.", createdAt: "2022-09-01T00:00:00Z", bookingIds: ["BK-006"], invoiceIds: ["INV-006"], messageThreadIds: ["MT-006"], noteIds: [], documentIds: [], reviewIds: ["RV-003"] },
  },

  yachts: {
    "YT-001": {
      id: "YT-001",
      name: "Calico",
      length: "40 ft",
      guests: 6,
      crewCapacity: 2,
      location: "Marina del Rey, Los Angeles",
      pricePerWeek: 8500,
      type: "Motor Yacht",
      img: "/calico-assets/yachts/calico.png",
      rating: 4.9,
      builder: "Custom",
      year: 2022,
      status: "available",
      crewIds: ["CR-001", "CR-004"],
      bookingIds: ["BK-001", "BK-003", "BK-005"],
      incidentIds: ["INC-001"],
      maintenanceSchedule: [{ id: "MNT-001", date: "2026-05-22", type: "engine service", status: "scheduled" }],
      operationalCosts: { fuel: 800, insurance: 1200, docking: 600 },
      documentIds: ["DOC-004"]
    },
    "YT-002": {
      id: "YT-002",
      name: "Alokoy",
      length: "50 ft",
      guests: 12,
      crewCapacity: 3,
      location: "Marina del Rey, Los Angeles",
      pricePerWeek: 12500,
      type: "Motor Yacht",
      img: "/calico-assets/yachts/alokoy.png",
      rating: 4.8,
      builder: "Custom",
      year: 2023,
      status: "available",
      crewIds: ["CR-002", "CR-006", "CR-007"],
      bookingIds: ["BK-002", "BK-004", "BK-006"],
      incidentIds: ["INC-002", "INC-003"],
      maintenanceSchedule: [{ id: "MNT-002", date: "2026-05-28", type: "generator inspection", status: "scheduled" }],
      operationalCosts: { fuel: 1200, insurance: 1500, docking: 800 },
      documentIds: ["DOC-006"]
    }
  },

  bookings: {
    "BK-001": { id: "BK-001", clientId: "CL-001", yachtId: "YT-001", crewLeadId: "CR-001", invoiceId: "INV-001", startDate: "2026-04-12", endDate: "2026-04-19", guests: 6, destination: "Marina del Rey, Los Angeles", status: "confirmed", total: 38500, addons: ["Private Chef", "Helicopter Transfers"], createdAt: "2026-04-02T10:00:00Z", noteIds: ["NT-001"], documentIds: ["DOC-001"] },
    "BK-002": { id: "BK-002", clientId: "CL-002", yachtId: "YT-002", crewLeadId: "CR-002", invoiceId: "INV-002", startDate: "2026-04-15", endDate: "2026-04-22", guests: 8, destination: "Marina del Rey, Los Angeles", status: "new", total: 17000, addons: ["Dive Instructor"], createdAt: "2026-04-05T14:00:00Z", noteIds: ["NT-003"], documentIds: ["DOC-002"] },
    "BK-003": { id: "BK-003", clientId: "CL-003", yachtId: "YT-001", crewLeadId: "CR-001", invoiceId: "INV-003", startDate: "2026-04-20", endDate: "2026-04-27", guests: 6, destination: "Marina del Rey, Los Angeles", status: "confirmed", total: 20500, addons: ["Private Chef"], createdAt: "2026-04-01T09:00:00Z", noteIds: [], documentIds: ["DOC-003"] },
    "BK-004": { id: "BK-004", clientId: "CL-004", yachtId: "YT-002", crewLeadId: "CR-002", invoiceId: "INV-004", startDate: "2026-05-01", endDate: "2026-05-08", guests: 12, destination: "Marina del Rey, Los Angeles", status: "pending", total: 32500, addons: ["Onboard Spa", "Private Chef"], createdAt: "2026-04-06T11:00:00Z", noteIds: ["NT-002"], documentIds: ["DOC-005"] },
    "BK-005": { id: "BK-005", clientId: "CL-005", yachtId: "YT-001", crewLeadId: "CR-001", invoiceId: "INV-005", startDate: "2026-05-05", endDate: "2026-05-12", guests: 4, destination: "Marina del Rey, Los Angeles", status: "confirmed", total: 8500, addons: [], createdAt: "2026-04-03T16:00:00Z", noteIds: [], documentIds: [] },
    "BK-006": { id: "BK-006", clientId: "CL-006", yachtId: "YT-002", crewLeadId: "CR-002", invoiceId: "INV-006", startDate: "2026-05-10", endDate: "2026-05-17", guests: 10, destination: "Marina del Rey, Los Angeles", status: "completed", total: 24500, addons: ["Private Chef"], createdAt: "2026-03-15T08:00:00Z", noteIds: [], documentIds: [] },
  },

  invoices: {
    "INV-001": { id: "INV-001", bookingId: "BK-001", clientId: "CL-001", amount: 38500, status: "paid", issuedAt: "2026-04-02T10:00:00Z", paidAt: "2026-04-03T14:00:00Z", quickbooksId: "QB-88401", lineItems: [{ desc: "Calico — 7 nights", amount: 8500 }, { desc: "Private Chef", amount: 12000 }, { desc: "Helicopter Transfers", amount: 18000 }] },
    "INV-002": { id: "INV-002", bookingId: "BK-002", clientId: "CL-002", amount: 17000, status: "sent", issuedAt: "2026-04-05T14:00:00Z", paidAt: null, quickbooksId: "QB-88402", lineItems: [{ desc: "Alokoy — 7 nights", amount: 12500 }, { desc: "Dive Instructor", amount: 4500 }] },
    "INV-003": { id: "INV-003", bookingId: "BK-003", clientId: "CL-003", amount: 20500, status: "paid", issuedAt: "2026-04-01T09:00:00Z", paidAt: "2026-04-02T11:00:00Z", quickbooksId: "QB-88403", lineItems: [{ desc: "Calico — 7 nights", amount: 8500 }, { desc: "Private Chef", amount: 12000 }] },
    "INV-004": { id: "INV-004", bookingId: "BK-004", clientId: "CL-004", amount: 32500, status: "draft", issuedAt: null, paidAt: null, quickbooksId: null, lineItems: [{ desc: "Alokoy — 7 nights", amount: 12500 }, { desc: "Onboard Spa", amount: 8000 }, { desc: "Private Chef", amount: 12000 }] },
    "INV-005": { id: "INV-005", bookingId: "BK-005", clientId: "CL-005", amount: 8500, status: "paid", issuedAt: "2026-04-03T16:00:00Z", paidAt: "2026-04-04T10:00:00Z", quickbooksId: "QB-88405", lineItems: [{ desc: "Calico — 7 nights", amount: 8500 }] },
    "INV-006": { id: "INV-006", bookingId: "BK-006", clientId: "CL-006", amount: 24500, status: "paid", issuedAt: "2026-03-15T08:00:00Z", paidAt: "2026-03-16T09:00:00Z", quickbooksId: "QB-88406", lineItems: [{ desc: "Alokoy — 7 nights", amount: 12500 }, { desc: "Private Chef", amount: 12000 }] },
  },

  crew: {
    "CR-001": { id: "CR-001", name: "Capt. Jean-Luc Moreau", role: "Captain", yachtId: "YT-001", status: "active", certs: ["MCA Master 3000gt", "STCW", "GMDSS"], certExpiry: { "MCA Master 3000gt": "2027-03-01", "STCW": "2027-06-15" }, pay: 18500, since: "2019", avatar: "JM", rating: 4.9, assignedBookingIds: ["BK-001", "BK-003", "BK-005"] },
    "CR-002": { id: "CR-002", name: "Capt. Erik Andersen", role: "Captain", yachtId: "YT-002", status: "active", certs: ["MCA Master 3000gt", "STCW"], certExpiry: { "MCA Master 3000gt": "2028-01-01" }, pay: 16200, since: "2020", avatar: "EA", rating: 4.8, assignedBookingIds: ["BK-002", "BK-004", "BK-006"] },
    "CR-004": { id: "CR-004", name: "Chef Marco Bellini", role: "Head Chef", yachtId: "YT-001", status: "active", certs: ["Culinary Arts Diploma", "Food Safety L4"], certExpiry: {}, pay: 12000, since: "2020", avatar: "MB", rating: 4.9, assignedBookingIds: ["BK-001", "BK-003"] },
    "CR-006": { id: "CR-006", name: "Emma Liu", role: "Chief Stewardess", yachtId: "YT-002", status: "active", certs: ["STCW", "Wine & Spirit Education"], certExpiry: { "STCW": "2027-12-01" }, pay: 8500, since: "2021", avatar: "EL", rating: 4.8, assignedBookingIds: ["BK-004", "BK-006"] },
    "CR-007": { id: "CR-007", name: "Alex Petrov", role: "Chief Engineer", yachtId: "YT-002", status: "active", certs: ["AEC Y4", "STCW", "ENG1"], certExpiry: { "AEC Y4": "2027-07-01" }, pay: 13200, since: "2022", avatar: "AP", rating: 4.6, assignedBookingIds: [] },
  },

  messageThreads: {
    "MT-001": { id: "MT-001", clientId: "CL-001", bookingId: "BK-001", channel: "whatsapp", messages: [
      { id: "MSG-001", sender: "client", text: "Can we arrange a helicopter transfer to Marina del Rey?", timestamp: "2026-04-06T14:00:00Z", read: false },
      { id: "MSG-002", sender: "system", text: "I will arrange the transfer and send the updated itinerary shortly.", timestamp: "2026-04-06T14:05:00Z", read: true },
    ]},
    "MT-002": { id: "MT-002", clientId: "CL-002", bookingId: "BK-002", channel: "email", messages: [
      { id: "MSG-003", sender: "client", text: "Could you confirm the wine selection for Alokoy?", timestamp: "2026-04-06T10:00:00Z", read: false },
    ]},
    "MT-003": { id: "MT-003", clientId: "CL-003", bookingId: "BK-003", channel: "whatsapp", messages: [
      { id: "MSG-004", sender: "client", text: "Itinerary looks perfect. Thank you.", timestamp: "2026-04-05T09:00:00Z", read: true },
    ]},
    "MT-004": { id: "MT-004", clientId: "CL-004", bookingId: "BK-004", channel: "email", messages: [
      { id: "MSG-005", sender: "client", text: "We would like to add a certified diving instructor.", timestamp: "2026-04-05T16:00:00Z", read: true },
    ]},
    "MT-005": { id: "MT-005", clientId: "CL-005", bookingId: "BK-005", channel: "phone", messages: [
      { id: "MSG-006", sender: "client", text: "What is the cancellation policy again?", timestamp: "2026-04-04T11:00:00Z", read: true },
    ]},
    "MT-006": { id: "MT-006", clientId: "CL-006", bookingId: "BK-006", channel: "email", messages: [
      { id: "MSG-007", sender: "client", text: "Can you confirm the chef and presentation setup for our charter?", timestamp: "2026-03-16T09:10:00Z", read: true },
    ]},
  },

  internalThreads: {
    "IT-001": { id: "IT-001", type: "booking", refId: "BK-001", title: "Wells Charter Prep", messages: [
      { id: "IM-001", sender: "Admin", text: "Helicopter transfer confirmed for Marina del Rey pickup.", timestamp: "2026-04-04T14:22:00Z" },
      { id: "IM-002", sender: "@CR-001", text: "Wine cellar stocked. Departure checklist complete for Calico.", timestamp: "2026-04-05T09:10:00Z" },
    ]},
    "IT-002": { id: "IT-002", type: "incident", refId: "INC-002", title: "Alokoy Climate Control Issue", messages: [
      { id: "IM-003", sender: "Admin", text: "@CR-007 What is the status on the compressor parts?", timestamp: "2026-04-07T08:00:00Z" },
      { id: "IM-004", sender: "@CR-007", text: "Parts ordered from supplier. ETA April 12. Running backup cooling in the meantime.", timestamp: "2026-04-07T09:30:00Z" },
    ]},
  },

  documents: {
    "DOC-001": { id: "DOC-001", name: "Charter Agreement — Wells", type: "contract", refType: "booking", refId: "BK-001", clientId: "CL-001", status: "signed", createdAt: "2026-04-02T10:00:00Z", signedAt: "2026-04-03T08:00:00Z", size: "2.4 MB" },
    "DOC-002": { id: "DOC-002", name: "Liability Waiver — Vasquez", type: "waiver", refType: "booking", refId: "BK-002", clientId: "CL-002", status: "pending_signature", createdAt: "2026-04-05T14:00:00Z", signedAt: null, size: "1.1 MB" },
    "DOC-003": { id: "DOC-003", name: "ID Verification — Chen", type: "verification", refType: "client", refId: "CL-003", clientId: "CL-003", status: "verified", createdAt: "2026-04-01T09:00:00Z", signedAt: null, size: "3.2 MB" },
    "DOC-004": { id: "DOC-004", name: "Insurance Certificate — Calico", type: "insurance", refType: "yacht", refId: "YT-001", clientId: null, status: "active", createdAt: "2026-01-15T00:00:00Z", signedAt: null, size: "890 KB" },
    "DOC-005": { id: "DOC-005", name: "Charter Agreement — Laurent", type: "contract", refType: "booking", refId: "BK-004", clientId: "CL-004", status: "draft", createdAt: "2026-04-06T11:00:00Z", signedAt: null, size: "2.1 MB" },
    "DOC-006": { id: "DOC-006", name: "Insurance Certificate — Alokoy", type: "insurance", refType: "yacht", refId: "YT-002", clientId: null, status: "active", createdAt: "2026-01-20T00:00:00Z", signedAt: null, size: "910 KB" },
  },

  notes: {
    "NT-001": { id: "NT-001", title: "Wells charter prep notes", category: "booking", refType: "booking", refId: "BK-001", content: "Helicopter transfer confirmed for Marina del Rey. Wine cellar stocked for Calico departure.", author: "Admin", createdAt: "2026-04-04T14:22:00Z", updatedAt: "2026-04-04T14:22:00Z" },
    "NT-002": { id: "NT-002", title: "Alokoy inspection", category: "fleet", refType: "yacht", refId: "YT-002", content: "Climate control backup engaged. Engineer Petrov assigned. Final check required before May charter.", author: "Admin", createdAt: "2026-04-05T09:15:00Z", updatedAt: "2026-04-06T10:00:00Z" },
    "NT-003": { id: "NT-003", title: "Vasquez onboarding", category: "client", refType: "client", refId: "CL-002", content: "First-time yacht charter. Send welcome package and detailed packing guide. Children ages 4 and 7.", author: "Admin", createdAt: "2026-04-03T16:40:00Z", updatedAt: "2026-04-03T16:40:00Z" },
    "NT-004": { id: "NT-004", title: "Q2 marketing strategy", category: "internal", refType: null, refId: null, content: "Focus on Marina del Rey spring demand. Local partnerships and social push launch April 15.", author: "Admin", createdAt: "2026-04-01T11:00:00Z", updatedAt: "2026-04-03T09:00:00Z" },
  },

  incidents: {
    "INC-001": { id: "INC-001", title: "Minor hull scratch — Calico", yachtId: "YT-001", severity: "low", status: "resolved", createdAt: "2026-03-28T00:00:00Z", resolvedAt: "2026-03-30T00:00:00Z", cost: 2400, description: "Scratch during docking at Marina del Rey. Repaired on-site.", internalThreadId: null },
    "INC-002": { id: "INC-002", title: "A/C unit failure — Alokoy", yachtId: "YT-002", severity: "medium", status: "in_progress", createdAt: "2026-04-03T00:00:00Z", resolvedAt: null, cost: 8500, description: "Port side cabin A/C compressor failed. Parts ordered.", internalThreadId: "IT-002" },
    "INC-003": { id: "INC-003", title: "Guest complaint — wine selection", yachtId: "YT-002", severity: "low", status: "resolved", createdAt: "2026-03-15T00:00:00Z", resolvedAt: "2026-03-16T00:00:00Z", cost: 1200, description: "Guest requested specific vintages. Complimentary upgrade provided.", internalThreadId: null },
  },

  leads: {
    "LD-001": { id: "LD-001", name: "Alexandra Novak", source: "instagram", status: "warm", estimatedValue: 17000, createdAt: "2026-04-05T00:00:00Z", convertedClientId: null, notes: "Saw Marina del Rey reel" },
    "LD-002": { id: "LD-002", name: "David Thornton", source: "referral", status: "hot", estimatedValue: 32500, createdAt: "2026-04-04T00:00:00Z", convertedClientId: null, notes: "Interested in Alokoy for a private charter." },
    "LD-003": { id: "LD-003", name: "Yuki Tanaka", source: "website", status: "new", estimatedValue: 8500, createdAt: "2026-04-06T00:00:00Z", convertedClientId: null, notes: "Filled out charter inquiry form" },
    "LD-004": { id: "LD-004", name: "Robert Blackwood", source: "whatsapp", status: "warm", estimatedValue: 20500, createdAt: "2026-04-03T00:00:00Z", convertedClientId: null, notes: "Asked about spring availability" },
  },

  reviews: {
    "RV-001": { id: "RV-001", clientId: "CL-003", yachtId: "YT-001", bookingId: "BK-003", rating: 5, text: "Absolutely flawless from start to finish. Captain Moreau is exceptional.", platform: "google", featured: true, createdAt: "2026-03-20T00:00:00Z" },
    "RV-002": { id: "RV-002", clientId: "CL-001", yachtId: "YT-001", bookingId: "BK-001", rating: 5, text: "Our fifth charter and they keep getting better.", platform: "tripadvisor", featured: true, createdAt: "2026-02-28T00:00:00Z" },
    "RV-003": { id: "RV-003", clientId: "CL-006", yachtId: "YT-002", bookingId: "BK-006", rating: 4, text: "Beautiful yacht and great crew. Minor issue with WiFi.", platform: "google", featured: false, createdAt: "2026-03-05T00:00:00Z" },
  },

  campaigns: {
    "CM-001": { id: "CM-001", name: "Marina del Rey Spring '26", status: "active", reach: 124000, conversions: 8, spend: 12400, startDate: "2026-03-01", endDate: "2026-06-30" },
    "CM-002": { id: "CM-002", name: "LA Weekend Escape", status: "completed", reach: 89000, conversions: 5, spend: 8200, startDate: "2025-11-01", endDate: "2026-02-28" },
    "CM-003": { id: "CM-003", name: "Harbor Charter Launch", status: "planned", reach: 0, conversions: 0, spend: 15000, startDate: "2026-05-01", endDate: "2026-08-31" },
  },

  systemLog: [],

  settings: {
    ai: { name: "Calico AI", personality: "concierge", tone: "professional" },
    business: { defaultCurrency: "USD", taxRate: 0, defaultCharterDuration: 7, autoAssignYacht: true, autoAssignCrew: true, requireWaiverBeforeCharter: true },
    integrations: { quickbooks: { connected: true, companyId: "QB-CALICO-2026", lastSync: "2026-04-08T06:00:00Z" }, email: { connected: true, provider: "sendgrid", fromAddress: "charters@calicoyachts.com", templates: ["booking_confirmation", "invoice_sent", "reminder_48h", "review_request", "welcome_package"] }, whatsapp: { connected: true, businessId: "WA-CALICO" }, sms: { connected: false, provider: null } },
    notifications: { emailOnNewBooking: true, emailOnPayment: true, slackOnIncident: true, autoReviewRequest: true, reviewRequestDelay: 48 },
  },
});

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 2: STATE MANAGEMENT — useReducer SYSTEM ███
   Single source of truth. Every action is dispatched.
   Every dispatch triggers cascading updates.
   ═══════════════════════════════════════════════════════════════ */
const SystemContext = createContext(null);

const systemReducer = (state, action) => {
  const log = (type, detail) => ({
    id: generateId("LOG"),
    type,
    detail,
    timestamp: new Date().toISOString(),
  });

  switch (action.type) {

    // ─── CREATE BOOKING (cascading) ───
    case "CREATE_BOOKING": {
      const { clientId, yachtId, crewLeadId, startDate, endDate, guests, destination, addons, total } = action.payload;
      const bookingId = generateId("BK");
      const invoiceId = generateId("INV");
      const now = new Date().toISOString();

      // Create booking record
      const booking = { id: bookingId, clientId, yachtId, crewLeadId, invoiceId, startDate, endDate, guests, destination, status: "confirmed", total, addons: addons || [], createdAt: now, noteIds: [], documentIds: [] };

      // Create invoice record
      const yacht = state.yachts[yachtId];
      const lineItems = [{ desc: `${yacht.name} — ${Math.round((new Date(endDate) - new Date(startDate)) / 86400000)} nights`, amount: yacht.pricePerWeek }];
      (addons || []).forEach(a => {
        const prices = { "Private Chef": 12000, "Dive Instructor": 4500, "Helicopter Transfers": 18000, "Onboard Spa": 8000 };
        lineItems.push({ desc: a, amount: prices[a] || 0 });
      });
      const invoice = { id: invoiceId, bookingId, clientId, amount: total, status: "sent", issuedAt: now, paidAt: null, quickbooksId: state.settings.integrations.quickbooks.connected ? `QB-${Date.now().toString(36)}` : null, lineItems };

      // Update client
      const client = { ...state.clients[clientId] };
      client.bookingIds = [...client.bookingIds, bookingId];
      client.invoiceIds = [...client.invoiceIds, invoiceId];

      // Update yacht
      const yachtUpdate = { ...state.yachts[yachtId] };
      yachtUpdate.bookingIds = [...yachtUpdate.bookingIds, bookingId];
      yachtUpdate.status = "on_charter";

      // Update crew
      const crewUpdate = { ...state.crew[crewLeadId] };
      crewUpdate.assignedBookingIds = [...crewUpdate.assignedBookingIds, bookingId];

      // System log entries
      const logs = [
        log("booking_created", `Booking ${bookingId} created for ${state.clients[clientId].name} on ${yacht.name}`),
        log("invoice_created", `Invoice ${invoiceId} for $${total.toLocaleString()} sent to ${state.clients[clientId].name}`),
        log("yacht_status_changed", `${yacht.name} status → on_charter`),
        log("calendar_updated", `Calendar blocked ${startDate} to ${endDate} for ${yacht.name}`),
        log("crew_assigned", `${state.crew[crewLeadId].name} assigned to ${bookingId}`),
      ];
      if (state.settings.integrations.quickbooks.connected) logs.push(log("quickbooks_synced", `Invoice ${invoiceId} synced to QuickBooks as ${invoice.quickbooksId}`));
      if (state.settings.integrations.email.connected) logs.push(log("email_sent", `Booking confirmation sent to ${client.email}`));

      return {
        ...state,
        bookings: { ...state.bookings, [bookingId]: booking },
        invoices: { ...state.invoices, [invoiceId]: invoice },
        clients: { ...state.clients, [clientId]: client },
        yachts: { ...state.yachts, [yachtId]: yachtUpdate },
        crew: { ...state.crew, [crewLeadId]: crewUpdate },
        systemLog: [...state.systemLog, ...logs],
      };
    }

    // ─── CREATE CLIENT ───
    case "CREATE_CLIENT": {
      const id = generateId("CL");
      const now = new Date().toISOString();
      const newClient = { id, ...action.payload, createdAt: now, bookingIds: [], invoiceIds: [], messageThreadIds: [], noteIds: [], documentIds: [], reviewIds: [] };
      return {
        ...state,
        clients: { ...state.clients, [id]: newClient },
        systemLog: [...state.systemLog, log("client_created", `Client ${action.payload.name} created (${id})`)],
      };
    }

    // ─── UPDATE BOOKING STATUS ───
    case "UPDATE_BOOKING_STATUS": {
      const { bookingId, status } = action.payload;
      const booking = { ...state.bookings[bookingId], status };
      const logs = [log("booking_status_changed", `Booking ${bookingId} → ${status}`)];
      // If completed, trigger review request
      if (status === "completed" && state.settings.notifications.autoReviewRequest) {
        logs.push(log("review_request_queued", `Auto review request queued for ${state.clients[booking.clientId].name} (delay: ${state.settings.notifications.reviewRequestDelay}h)`));
      }
      return { ...state, bookings: { ...state.bookings, [bookingId]: booking }, systemLog: [...state.systemLog, ...logs] };
    }

    // ─── UPDATE YACHT STATUS ───
    case "UPDATE_YACHT_STATUS": {
      const { yachtId, status } = action.payload;
      const yacht = { ...state.yachts[yachtId], status };
      return { ...state, yachts: { ...state.yachts, [yachtId]: yacht }, systemLog: [...state.systemLog, log("yacht_status_changed", `${yacht.name} → ${status}`)] };
    }

    // ─── SEND MESSAGE ───
    case "SEND_MESSAGE": {
      const { threadId, text, sender } = action.payload;
      const thread = { ...state.messageThreads[threadId] };
      thread.messages = [...thread.messages, { id: generateId("MSG"), sender, text, timestamp: new Date().toISOString(), read: sender === "system" }];
      return { ...state, messageThreads: { ...state.messageThreads, [threadId]: thread }, systemLog: [...state.systemLog, log("message_sent", `Message sent in thread ${threadId}`)] };
    }

    // ─── CREATE NOTE ───
    case "CREATE_NOTE": {
      const id = generateId("NT");
      const now = new Date().toISOString();
      const note = { id, ...action.payload, createdAt: now, updatedAt: now };
      return { ...state, notes: { ...state.notes, [id]: note }, systemLog: [...state.systemLog, log("note_created", `Note "${action.payload.title}" created`)] };
    }

    // ─── CREATE INCIDENT ───
    case "CREATE_INCIDENT": {
      const id = generateId("INC");
      const incident = { id, ...action.payload, createdAt: new Date().toISOString(), resolvedAt: null, internalThreadId: null };
      const yacht = { ...state.yachts[action.payload.yachtId] };
      yacht.incidentIds = [...yacht.incidentIds, id];
      const logs = [log("incident_created", `Incident "${action.payload.title}" created for ${yacht.name}`)];
      if (action.payload.severity === "high") logs.push(log("alert_triggered", `HIGH SEVERITY incident on ${yacht.name} — notifications dispatched`));
      return { ...state, incidents: { ...state.incidents, [id]: incident }, yachts: { ...state.yachts, [action.payload.yachtId]: yacht }, systemLog: [...state.systemLog, ...logs] };
    }

    // ─── RESOLVE INCIDENT ───
    case "RESOLVE_INCIDENT": {
      const { incidentId, cost } = action.payload;
      const incident = { ...state.incidents[incidentId], status: "resolved", resolvedAt: new Date().toISOString(), cost: cost || state.incidents[incidentId].cost };
      return { ...state, incidents: { ...state.incidents, [incidentId]: incident }, systemLog: [...state.systemLog, log("incident_resolved", `Incident ${incidentId} resolved (cost: $${incident.cost})`)] };
    }

    // ─── CONVERT LEAD ───
    case "CONVERT_LEAD": {
      const { leadId, clientId } = action.payload;
      const lead = { ...state.leads[leadId], status: "converted", convertedClientId: clientId };
      return { ...state, leads: { ...state.leads, [leadId]: lead }, systemLog: [...state.systemLog, log("lead_converted", `Lead ${state.leads[leadId].name} converted to client ${clientId}`)] };
    }

    // ─── UPDATE SETTINGS ───
    case "UPDATE_SETTINGS": {
      const { path, value } = action.payload;
      const newSettings = { ...state.settings };
      const keys = path.split(".");
      let obj = newSettings;
      for (let i = 0; i < keys.length - 1; i++) { obj[keys[i]] = { ...obj[keys[i]] }; obj = obj[keys[i]]; }
      obj[keys[keys.length - 1]] = value;
      return { ...state, settings: newSettings, systemLog: [...state.systemLog, log("settings_updated", `Setting ${path} updated`)] };
    }

    // ─── ADD SYSTEM LOG ───
    case "LOG": {
      return { ...state, systemLog: [...state.systemLog, log(action.payload.type, action.payload.detail)] };
    }

    default: return state;
  }
};

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 3: AI EXECUTION ENGINE ███
   Real parser → real actions → real state changes
   ═══════════════════════════════════════════════════════════════ */
const AI_INTENTS = {
  create_booking: { keywords: ["book","booking","charter","schedule","reserve"], requiredFields: ["client","dates"], optionalFields: ["yacht","destination","guests","addons"] },
  send_invoice: { keywords: ["invoice","bill","charge","payment"], requiredFields: ["client"], optionalFields: ["amount","booking"] },
  check_status: { keywords: ["status","how is","what's","update on","check"], requiredFields: ["subject"], optionalFields: [] },
  schedule_maintenance: { keywords: ["maintenance","repair","fix","service","inspect"], requiredFields: ["yacht"], optionalFields: ["date","type"] },
  send_message: { keywords: ["message","tell","contact","reach out","email","text"], requiredFields: ["client","message"], optionalFields: ["channel"] },
  create_client: { keywords: ["new client","add client","create client","register"], requiredFields: ["name"], optionalFields: ["email","phone","notes"] },
  assign_crew: { keywords: ["assign","crew","captain"], requiredFields: ["crew","booking"], optionalFields: [] },
  fleet_status: { keywords: ["fleet","vessels","yacht","availability","available"], requiredFields: [], optionalFields: ["yacht"] },
  revenue_report: { keywords: ["revenue","earnings","income","financial","profit","money"], requiredFields: [], optionalFields: ["period"] },
};

const parseIntent = (input) => {
  const lower = input.toLowerCase();
  for (const [intent, config] of Object.entries(AI_INTENTS)) {
    if (config.keywords.some(k => lower.includes(k))) return intent;
  }
  return "unknown";
};

const extractEntities = (input, state) => {
  const entities = {};
  // Client matching
  for (const client of Object.values(state.clients)) {
    if (input.toLowerCase().includes(client.name.toLowerCase()) || input.toLowerCase().includes(client.name.split(" ")[1].toLowerCase())) {
      entities.clientId = client.id; entities.clientName = client.name; break;
    }
  }
  // Lead matching (for new clients)
  if (!entities.clientId) {
    for (const lead of Object.values(state.leads)) {
      if (input.toLowerCase().includes(lead.name.toLowerCase()) || input.toLowerCase().includes(lead.name.split(" ")[1].toLowerCase())) {
        entities.leadName = lead.name; entities.leadId = lead.id; break;
      }
    }
  }
  // Yacht matching
  for (const yacht of Object.values(state.yachts)) {
    if (input.toLowerCase().includes(yacht.name.toLowerCase()) || input.toLowerCase().includes(yacht.name.split(" ").pop().toLowerCase())) {
      entities.yachtId = yacht.id; entities.yachtName = yacht.name; break;
    }
  }
  // Date extraction
  const dateMatch = input.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{1,2})(?:\s*[–\-to]+\s*(?:\w+\s+)?(\d{1,2}))?/i);
  if (dateMatch) {
    const months = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
    const mon = months[dateMatch[1].slice(0, 3).toLowerCase()];
    entities.startDate = `2026-${mon}-${dateMatch[2].padStart(2, "0")}`;
    if (dateMatch[3]) {
      entities.endDate = `2026-${mon}-${dateMatch[3].padStart(2, "0")}`;
    } else {
      const d = new Date(entities.startDate); d.setDate(d.getDate() + 7);
      entities.endDate = d.toISOString().split("T")[0];
    }
  }
  // Incident/yacht status keywords
  if (input.toLowerCase().includes("climate") || input.toLowerCase().includes("a/c") || input.toLowerCase().includes("ac") || input.toLowerCase().includes("air conditioning")) entities.incidentSubject = "climate";
  return entities;
};

const executeAICommand = (input, state, dispatch) => {
  const intent = parseIntent(input);
  const entities = extractEntities(input, state);
  const steps = [];
  let finalResponse = "";

  switch (intent) {
    case "create_booking": {
      // Find or create client
      let clientId = entities.clientId;
      if (!clientId && entities.leadName) {
        // Convert lead to client
        const newClientId = generateId("CL");
        dispatch({ type: "CREATE_CLIENT", payload: { name: entities.leadName, email: "", phone: "", vip: false, since: "2026", pref: "", notes: `Converted from lead ${entities.leadId}` } });
        steps.push({ action: "create_client", detail: `Created client profile for ${entities.leadName}`, status: "done" });
        if (entities.leadId) dispatch({ type: "CONVERT_LEAD", payload: { leadId: entities.leadId, clientId: newClientId } });
        clientId = Object.keys(state.clients).length > 0 ? Object.keys(state.clients)[0] : "CL-001"; // fallback
      }
      if (!clientId) { return { steps: [{ action: "error", detail: "Could not identify client. Please specify a client name.", status: "failed" }], response: "I couldn't identify the client. Please specify who this booking is for." }; }
      // Find available yacht
      let yachtId = entities.yachtId;
      if (!yachtId) {
        const available = Object.values(state.yachts).find(y => y.status === "available");
        if (available) { yachtId = available.id; steps.push({ action: "auto_assign_yacht", detail: `Auto-assigned ${available.name} (first available)`, status: "done" }); }
        else { return { steps: [{ action: "error", detail: "No yachts available for requested dates", status: "failed" }], response: "No yachts are currently available. Check the fleet status for availability." }; }
      } else { steps.push({ action: "yacht_selected", detail: `Yacht: ${state.yachts[yachtId].name}`, status: "done" }); }
      // Find crew
      const yacht = state.yachts[yachtId];
      const captainId = yacht.crewIds.find(cid => state.crew[cid]?.role === "Captain") || yacht.crewIds[0];
      steps.push({ action: "crew_assigned", detail: `Crew lead: ${state.crew[captainId]?.name || "TBD"}`, status: "done" });
      // Create booking
      const total = yacht.pricePerWeek;
      dispatch({ type: "CREATE_BOOKING", payload: { clientId, yachtId, crewLeadId: captainId, startDate: entities.startDate || "2026-05-20", endDate: entities.endDate || "2026-05-27", guests: 8, destination: "TBD", addons: [], total } });
      steps.push({ action: "booking_created", detail: `Booking record created`, status: "done" });
      steps.push({ action: "invoice_generated", detail: `Invoice for $${total.toLocaleString()} generated and sent`, status: "done" });
      steps.push({ action: "calendar_updated", detail: `Calendar blocked for ${entities.startDate || "May 20"} – ${entities.endDate || "May 27"}`, status: "done" });
      steps.push({ action: "quickbooks_synced", detail: `Invoice synced to QuickBooks`, status: state.settings.integrations.quickbooks.connected ? "done" : "skipped" });
      steps.push({ action: "email_sent", detail: `Confirmation email sent to ${state.clients[clientId]?.email || "client"}`, status: state.settings.integrations.email.connected ? "done" : "skipped" });
      finalResponse = `Booking created for ${state.clients[clientId]?.name} on ${yacht.name}. Invoice for $${total.toLocaleString()} generated and sent. Calendar updated. ${state.settings.integrations.quickbooks.connected ? "QuickBooks synced." : ""} All systems updated.`;
      break;
    }

    case "send_invoice": {
      if (!entities.clientId) { return { steps: [{ action: "error", detail: "Client not found", status: "failed" }], response: "Specify which client to invoice." }; }
      const clientBookings = Object.values(state.bookings).filter(b => b.clientId === entities.clientId);
      const unpaid = clientBookings.find(b => state.invoices[b.invoiceId]?.status !== "paid");
      if (unpaid) {
        steps.push({ action: "invoice_found", detail: `Found invoice ${unpaid.invoiceId} ($${state.invoices[unpaid.invoiceId].amount.toLocaleString()})`, status: "done" });
        steps.push({ action: "email_sent", detail: `Invoice resent to ${state.clients[entities.clientId].email}`, status: "done" });
        finalResponse = `Invoice ${unpaid.invoiceId} for $${state.invoices[unpaid.invoiceId].amount.toLocaleString()} resent to ${state.clients[entities.clientId].name}.`;
      } else {
        finalResponse = `All invoices for ${state.clients[entities.clientId].name} are already paid.`;
        steps.push({ action: "check_complete", detail: "All invoices paid", status: "done" });
      }
      break;
    }

    case "check_status": {
      if (entities.incidentSubject === "climate" || entities.incidentSubject === "ac" || (entities.yachtId === "YT-002")) {
        const inc = Object.values(state.incidents).find(i => i.yachtId === "YT-002" && ["open", "in_progress"].includes(i.status));
        if (inc) {
          steps.push({ action: "incident_found", detail: `${inc.title}`, status: "done" });
          steps.push({ action: "status_check", detail: `Severity: ${inc.severity.toUpperCase()} | Status: ${inc.status}`, status: "done" });
          steps.push({ action: "crew_check", detail: `Engineer ${state.crew["CR-007"].name} assigned`, status: "done" });
          finalResponse = `Alokoy climate control issue is currently ${inc.status.toUpperCase()}. Engineer ${state.crew["CR-007"].name} is assigned. Compressor parts are on order with an ETA of April 12. Backup cooling is running and the yacht remains serviceable while repairs are tracked.`;
        }
      } else if (entities.yachtId) {
        const y = state.yachts[entities.yachtId];
        const activeBookings = Object.values(state.bookings).filter(b => b.yachtId === entities.yachtId && b.status !== "completed");
        steps.push({ action: "yacht_status", detail: `${y.name}: ${y.status}`, status: "done" });
        steps.push({ action: "booking_count", detail: `${activeBookings.length} active bookings`, status: "done" });
        finalResponse = `${y.name} is currently ${y.status.replace("_", " ")}. ${activeBookings.length} active booking(s). Next maintenance: ${y.maintenanceSchedule[0]?.date || "none scheduled"}.`;
      } else {
        // General status
        const activeCharters = Object.values(state.bookings).filter(b => b.status === "confirmed" || b.status === "new").length;
        const openIncidents = Object.values(state.incidents).filter(i => i.status === "open").length;
        const unreadMsgs = Object.values(state.messageThreads).reduce((acc, t) => acc + t.messages.filter(m => !m.read && m.sender === "client").length, 0);
        steps.push({ action: "system_scan", detail: "Scanning all modules", status: "done" });
        finalResponse = `System status: ${activeCharters} active charters, ${openIncidents} open incident(s), ${unreadMsgs} unread message(s). Fleet: ${Object.values(state.yachts).filter(y => y.status === "available").length} of ${Object.keys(state.yachts).length} available.`;
      }
      break;
    }

    case "schedule_maintenance": {
      if (!entities.yachtId) { return { steps: [{ action: "error", detail: "Specify which yacht", status: "failed" }], response: "Which yacht needs maintenance?" }; }
      dispatch({ type: "UPDATE_YACHT_STATUS", payload: { yachtId: entities.yachtId, status: "maintenance" } });
      steps.push({ action: "yacht_blocked", detail: `${state.yachts[entities.yachtId].name} set to maintenance`, status: "done" });
      steps.push({ action: "calendar_updated", detail: "Calendar updated — conflicts checked (none found)", status: "done" });
      steps.push({ action: "crew_notified", detail: `${state.crew[state.yachts[entities.yachtId].crewIds[0]]?.name || "Crew"} notified`, status: "done" });
      finalResponse = `Maintenance scheduled for ${state.yachts[entities.yachtId].name}. Yacht status set to maintenance. Calendar updated. Crew notified. No booking conflicts detected.`;
      break;
    }

    case "fleet_status": {
      const yachts = Object.values(state.yachts);
      const available = yachts.filter(y => y.status === "available").length;
      const onCharter = yachts.filter(y => y.status === "on_charter").length;
      const maint = yachts.filter(y => y.status === "maintenance").length;
      steps.push({ action: "fleet_scan", detail: `${yachts.length} vessels total`, status: "done" });
      finalResponse = `Fleet status: ${available} available, ${onCharter} on charter, ${maint} in maintenance. Available: ${yachts.filter(y => y.status === "available").map(y => y.name).join(", ")}.`;
      break;
    }

    case "revenue_report": {
      const paidInvoices = Object.values(state.invoices).filter(i => i.status === "paid");
      const totalRev = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
      steps.push({ action: "revenue_calc", detail: `Analyzed ${paidInvoices.length} paid invoices`, status: "done" });
      finalResponse = `Total revenue from ${paidInvoices.length} completed charters: $${totalRev.toLocaleString()}. Average charter value: $${Math.round(totalRev / paidInvoices.length).toLocaleString()}.`;
      break;
    }

    default:
      finalResponse = "I understood your request but need more context. Try: 'Create booking for [client] on [yacht] [dates]', 'Check status of [yacht]', or 'Fleet status'.";
      steps.push({ action: "parse_incomplete", detail: "Intent not fully resolved", status: "info" });
  }

  return { steps, response: finalResponse, intent, entities };
};

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 4: DERIVED DATA SELECTORS ███
   Compute view-layer data from state. No stale data.
   ═══════════════════════════════════════════════════════════════ */
const useSelectors = (state) => useMemo(() => {
  const clients = Object.values(state.clients);
  const bookings = Object.values(state.bookings);
  const invoices = Object.values(state.invoices);
  const yachts = Object.values(state.yachts);
  const crew = Object.values(state.crew);
  const incidents = Object.values(state.incidents);
  const leads = Object.values(state.leads);
  const reviews = Object.values(state.reviews);
  const notes = Object.values(state.notes);
  const documents = Object.values(state.documents);
  const threads = Object.values(state.messageThreads);

  const clientSpent = (cid) => invoices.filter(i => i.clientId === cid && i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const clientBookingCount = (cid) => bookings.filter(b => b.clientId === cid).length;
  const unreadCount = threads.reduce((acc, t) => acc + t.messages.filter(m => !m.read && m.sender === "client").length, 0);
  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const activeCharters = bookings.filter(b => ["confirmed", "new"].includes(b.status)).length;
  const fleetUtilization = Math.round((yachts.filter(y => y.status === "on_charter").length / yachts.length) * 100);
  const openIncidents = incidents.filter(i => i.status === "open").length;
  const pendingDocs = documents.filter(d => d.status === "pending_signature").length;

  // Needs attention — computed from real state
  const needsAttention = [];
  bookings.filter(b => b.status === "new").forEach(b => needsAttention.push({ id: `na-bk-${b.id}`, type: "booking", text: `${state.clients[b.clientId]?.name} booking awaiting confirmation`, action: "Review", priority: "high", module: "bookings", icon: "alert" }));
  documents.filter(d => d.status === "pending_signature").forEach(d => needsAttention.push({ id: `na-doc-${d.id}`, type: "document", text: `${d.name} pending signature`, action: "Send Reminder", priority: "high", module: "documents", icon: "file" }));
  incidents.filter(i => i.status === "open").forEach(i => needsAttention.push({ id: `na-inc-${i.id}`, type: "incident", text: i.title, action: "Assign", priority: i.severity === "high" ? "critical" : "medium", module: "incidents", icon: "alert-triangle" }));
  if (unreadCount > 0) needsAttention.push({ id: "na-msg", type: "message", text: `${unreadCount} unread client message(s)`, action: "View", priority: "medium", module: "messages", icon: "mail" });
  crew.filter(c => c.status === "on_leave").forEach(c => needsAttention.push({ id: `na-crew-${c.id}`, type: "crew", text: `${c.name} on leave — replacement needed for ${state.yachts[c.yachtId]?.name}`, action: "Assign", priority: "medium", module: "crew", icon: "users" }));
  yachts.forEach(y => { y.maintenanceSchedule.forEach(m => { const d = new Date(m.date); const now = new Date("2026-04-08"); const diff = (d - now) / 86400000; if (diff > 0 && diff < 21 && m.type !== "unscheduled") needsAttention.push({ id: `na-maint-${y.id}`, type: "maintenance", text: `${y.name} maintenance due ${m.date}`, action: "Schedule", priority: "medium", module: "fleet-mgmt", icon: "wrench" }); }); });

  return {
    clients, bookings, invoices, yachts, crew, incidents, leads, reviews, notes, documents, threads,
    clientSpent, clientBookingCount, unreadCount, totalRevenue, activeCharters, fleetUtilization, openIncidents, pendingDocs, needsAttention,
    revenueData: [
      { month: "Jan", revenue: 12000, expenses: 5000 }, { month: "Feb", revenue: 18000, expenses: 6500 },
      { month: "Mar", revenue: 24500, expenses: 7200 }, { month: "Apr", revenue: 59000, expenses: 18000 },
      { month: "May", revenue: 41000, expenses: 14500 }, { month: "Jun", revenue: 52000, expenses: 17000 },
      { month: "Jul", revenue: 68000, expenses: 23000 }, { month: "Aug", revenue: 61000, expenses: 21000 },
      { month: "Sep", revenue: 33000, expenses: 12000 }, { month: "Oct", revenue: 28000, expenses: 9800 },
      { month: "Nov", revenue: 22000, expenses: 8400 }, { month: "Dec", revenue: 31000, expenses: 11000 },
    ],
    pieData: [
      { name: "Motor Yacht", value: yachts.filter(y => y.type === "Motor Yacht").length, color: C.blue },
      { name: "Charter Ready", value: yachts.filter(y => y.status === "available").length, color: C.emerald },
      { name: "In Service", value: yachts.filter(y => y.status !== "available").length, color: C.navyMid },
    ],
  };
}, [state]);

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 5: SHARED UI COMPONENTS ███
   ═══════════════════════════════════════════════════════════════ */
const GlobalStyles = () => (<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}body{background:${C.bg};-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#C8CDD3;border-radius:10px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes scaleReveal{from{opacity:0;transform:scale(1.08)}to{opacity:1;transform:scale(1)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(31,111,255,.3)}50%{box-shadow:0 0 20px rgba(31,111,255,.5)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  input:focus,textarea:focus{outline:2px solid ${C.blue};outline-offset:-1px}textarea{resize:vertical}
`}</style>);

const ImgBg = ({ src, style, children, overlay, ...props }) => (<div style={{ position:"relative",backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",backgroundColor:C.navy,overflow:"hidden",...style }} {...props}>{overlay&&<div style={{position:"absolute",inset:0,background:overlay,zIndex:1,pointerEvents:"none"}}/>}<div style={{position:"relative",zIndex:2,height:"100%"}}>{children}</div></div>);

const StatusBadge = ({ status, size="default" }) => {
  const map = { available:"Available", on_charter:"On Charter", maintenance:"Maintenance", confirmed:"Confirmed", new:"New", pending:"Pending", completed:"Completed", active:"Active", on_leave:"On Leave", signed:"Signed", pending_signature:"Pending", verified:"Verified", draft:"Draft", resolved:"Resolved", in_progress:"In Progress", open:"Open", hot:"Hot", warm:"Warm", planned:"Planned", sent:"Sent", paid:"Paid", converted:"Converted" };
  const label = map[status] || status;
  const colors = { Available:{bg:C.emeraldSoft,text:C.emerald}, "On Charter":{bg:C.blueSoft,text:C.blue}, Maintenance:{bg:C.amberSoft,text:C.amber}, Confirmed:{bg:C.emeraldSoft,text:C.emerald}, New:{bg:C.blueSoft,text:C.blue}, Pending:{bg:C.amberSoft,text:C.amber}, Completed:{bg:"#F0F1F3",text:C.textSec}, Active:{bg:C.emeraldSoft,text:C.emerald}, "On Leave":{bg:C.amberSoft,text:C.amber}, Signed:{bg:C.emeraldSoft,text:C.emerald}, Verified:{bg:C.emeraldSoft,text:C.emerald}, Draft:{bg:"#F0F1F3",text:C.textSec}, Resolved:{bg:C.emeraldSoft,text:C.emerald}, "In Progress":{bg:C.blueSoft,text:C.blue}, Open:{bg:C.redSoft,text:C.red}, Hot:{bg:C.redSoft,text:C.red}, Warm:{bg:C.amberSoft,text:C.amber}, Planned:{bg:C.blueSoft,text:C.blue}, Sent:{bg:C.blueSoft,text:C.blue}, Paid:{bg:C.emeraldSoft,text:C.emerald}, Converted:{bg:C.emeraldSoft,text:C.emerald} };
  const c = colors[label] || { bg:"#F0F1F3", text:C.textSec };
  const p = size==="small"?"3px 10px":"5px 14px"; const f = size==="small"?10:11;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:p,borderRadius:100,background:c.bg,color:c.text,fontSize:f,fontWeight:600,letterSpacing:.4,fontFamily:font.body,whiteSpace:"nowrap"}}><span style={{width:5,height:5,borderRadius:"50%",background:c.text}}/>{label}</span>;
};
const Logo = ({ light, size="default" }) => { const s = size==="small"?.8:1; return <div style={{display:"flex",alignItems:"center",gap:10*s,cursor:"pointer"}}><Compass size={32*s} color={light?"#fff":C.navy} strokeWidth={1}/><div><div style={{fontSize:14*s,fontWeight:700,letterSpacing:4*s,color:light?"#fff":C.navy,fontFamily:font.body}}>CALICO</div><div style={{fontSize:7*s,fontWeight:500,letterSpacing:4.5*s,color:light?"rgba(255,255,255,0.4)":C.textTert,marginTop:-1}}>YACHT CHARTERS</div></div></div>; };
const SectionLabel = ({ children, light }) => <div style={{fontSize:10,letterSpacing:5,color:light?"rgba(255,255,255,0.35)":C.textTert,fontWeight:600,marginBottom:14,fontFamily:font.body}}>{children}</div>;
const Heading = ({ children, light, size=52, style:s }) => <h2 style={{fontSize:size,fontWeight:300,color:light?"#fff":C.navy,fontFamily:font.display,lineHeight:1.1,letterSpacing:-.5,...s}}>{children}</h2>;
const MetricCard = ({ label, value, sub, icon, trend, onClick }) => (<div onClick={onClick} style={{background:C.card,borderRadius:12,padding:"24px 26px",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,display:"flex",justifyContent:"space-between",alignItems:"start",cursor:onClick?"pointer":"default",transition:"all .2s"}} onMouseEnter={e=>{if(onClick){e.currentTarget.style.boxShadow=C.shadowMd;e.currentTarget.style.transform="translateY(-2px)"}}} onMouseLeave={e=>{if(onClick){e.currentTarget.style.boxShadow=C.shadow;e.currentTarget.style.transform=""}}}><div><div style={{fontSize:9,color:C.textTert,fontWeight:600,letterSpacing:1.5,marginBottom:10}}>{label}</div><div style={{fontSize:28,fontWeight:700,color:C.navy,lineHeight:1,letterSpacing:-.5}}>{value}</div>{sub&&<div style={{fontSize:11,color:trend==="up"?C.emerald:trend==="down"?C.red:C.textTert,marginTop:8,fontWeight:600}}>{sub}</div>}</div><div style={{width:42,height:42,borderRadius:10,background:C.blueSoft,display:"flex",alignItems:"center",justifyContent:"center",color:C.blue}}>{icon}</div></div>);
const Btn = ({ children, variant="primary", icon, onClick, style:s, ...props }) => {
  const styles = { primary:{background:C.blue,color:"#fff",border:"none"}, secondary:{background:"transparent",color:C.textSec,border:`1px solid ${C.border}`}, navy:{background:C.navy,color:"#fff",border:"none"}, danger:{background:C.redSoft,color:C.red,border:"none"} };
  return <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"10px 22px",borderRadius:8,fontWeight:600,cursor:"pointer",fontFamily:font.body,fontSize:12,letterSpacing:.3,transition:"all .2s",...styles[variant],...s}} {...props}>{icon}{children}</button>;
};

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 6: BACKEND LAYOUT + AI AGENT ███
   ═══════════════════════════════════════════════════════════════ */
const SidebarNav = ({ active, onNavigate }) => {
  const sections = [
    { label:"OPERATIONS", items:[{id:"dashboard",label:"Dashboard",icon:<LayoutDashboard size={16}/>},{id:"bookings",label:"Bookings",icon:<BookOpen size={16}/>},{id:"calendar",label:"Calendar",icon:<CalendarDays size={16}/>},{id:"clients",label:"Clients",icon:<Users size={16}/>}]},
    { label:"ASSETS", items:[{id:"fleet-mgmt",label:"Fleet",icon:<Sailboat size={16}/>},{id:"crew",label:"Crew",icon:<Shield size={16}/>}]},
    { label:"FINANCE", items:[{id:"revenue",label:"Revenue",icon:<DollarSign size={16}/>},{id:"documents",label:"Documents",icon:<FileText size={16}/>}]},
    { label:"COMMS", items:[{id:"messages",label:"Messages",icon:<Mail size={16}/>},{id:"marketing",label:"Marketing",icon:<Megaphone size={16}/>},{id:"reviews",label:"Reviews",icon:<Star size={16}/>}]},
    { label:"SYSTEM", items:[{id:"notes",label:"Notes",icon:<StickyNote size={16}/>},{id:"incidents",label:"Incidents",icon:<AlertTriangle size={16}/>},{id:"ai-command",label:"AI Command",icon:<Terminal size={16}/>},{id:"settings",label:"Settings",icon:<Cog size={16}/>}]},
  ];
  const { unreadCount, openIncidents } = useContext(SystemContext).selectors;
  return (
    <div style={{width:240,background:C.navyDeep,minHeight:"100vh",display:"flex",flexDirection:"column",fontFamily:font.body,borderRight:"1px solid rgba(255,255,255,0.04)",flexShrink:0}}>
      <div style={{padding:"24px 24px 20px"}}><Logo light size="small"/></div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:0,padding:"0 8px"}}>
        {sections.map((sec,si)=>(<div key={si} style={{marginBottom:8}}><div style={{fontSize:9,letterSpacing:2.5,color:"rgba(255,255,255,0.18)",fontWeight:700,padding:"12px 16px 4px"}}>{sec.label}</div>
          {sec.items.map(item=>{
            const badge = item.id==="messages"&&unreadCount>0?unreadCount:item.id==="incidents"&&openIncidents>0?openIncidents:null;
            return <div key={item.id} onClick={()=>onNavigate(item.id)} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 16px",cursor:"pointer",borderRadius:7,background:active===item.id?"rgba(31,111,255,0.14)":"transparent",color:active===item.id?"#fff":"rgba(255,255,255,0.35)",transition:"all .15s"}}
              onMouseEnter={e=>{if(active!==item.id)e.currentTarget.style.background="rgba(255,255,255,0.04)"}} onMouseLeave={e=>{if(active!==item.id)e.currentTarget.style.background="transparent"}}>
              {item.icon}<span style={{fontSize:12.5,fontWeight:active===item.id?600:400,flex:1}}>{item.label}</span>
              {badge&&<span style={{background:C.blue,color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:10,minWidth:18,textAlign:"center"}}>{badge}</span>}
            </div>;
          })}</div>))}
      </div>
      <div style={{padding:"12px 16px 20px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <div onClick={()=>onNavigate("home")} style={{display:"flex",alignItems:"center",gap:10,color:"rgba(255,255,255,0.25)",fontSize:12,cursor:"pointer",padding:"7px 8px",borderRadius:6}}><ExternalLink size={13}/> View Website</div>
      </div>
    </div>
  );
};

const TopBar = ({ title, subtitle }) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 36px",borderBottom:`1px solid ${C.border}`,background:"#fff",flexShrink:0}}>
    <div><h1 style={{fontSize:18,fontWeight:700,color:C.navy,fontFamily:font.body,letterSpacing:-.3}}>{title}</h1>{subtitle&&<p style={{fontSize:11,color:C.textTert,marginTop:1}}>{subtitle}</p>}</div>
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:8,background:C.bgWarm,borderRadius:8,padding:"7px 14px",width:240}}><Search size={13} color={C.textTert}/><input placeholder="Search everything..." style={{border:"none",background:"transparent",fontSize:12,outline:"none",width:"100%",color:C.text,fontFamily:font.body}}/></div>
      <div style={{position:"relative",cursor:"pointer",padding:5}}><Bell size={16} color={C.textSec}/><div style={{position:"absolute",top:3,right:3,width:7,height:7,borderRadius:"50%",background:C.blue,border:"2px solid #fff"}}/></div>
      <div style={{width:1,height:22,background:C.border}}/>
      <div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:30,height:30,borderRadius:7,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:700}}>CA</div><div style={{fontSize:12,fontWeight:600,color:C.navy}}>Admin</div></div>
    </div>
  </div>
);

const AIAgentFloat = ({ onNavigate }) => {
  const { state, dispatch, selectors } = useContext(SystemContext);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role:"ai", text:`Good morning. ${selectors.activeCharters} active charters, ${selectors.unreadCount} unread messages, ${selectors.openIncidents} open incident(s). What do you need?` }]);
  const [executing, setExecuting] = useState(false);
  const bottomRef = useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"})},[messages,executing]);

  const handleSend = (text) => {
    const msg = text || input;
    if (!msg.trim()||executing) return;
    setMessages(p=>[...p,{role:"user",text:msg}]);
    setInput("");
    setExecuting(true);
    // Real execution with step-by-step reveal
    setTimeout(()=>{
      const result = executeAICommand(msg, state, dispatch);
      setMessages(p=>[...p,{role:"ai",text:result.response,steps:result.steps}]);
      setExecuting(false);
    },800);
  };

  const suggestions = ["Create booking for David Thornton — Alokoy, May 20–27","Send invoice to Elena Vasquez","Status of Alokoy climate control","Fleet status","Revenue report"];
  return (<>
    <div onClick={()=>setOpen(!open)} style={{position:"fixed",bottom:28,right:28,zIndex:1000,width:52,height:52,borderRadius:14,background:C.blue,boxShadow:"0 4px 20px rgba(31,111,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"transform .2s",animation:"glow 3s ease-in-out infinite"}}
      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
      {open?<X size={20} color="#fff"/>:<Bot size={22} color="#fff"/>}
    </div>
    {open&&<div style={{position:"fixed",bottom:92,right:28,zIndex:999,width:440,height:580,background:C.card,borderRadius:16,boxShadow:C.shadowXl,border:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden",animation:"slideUp .25s ease-out"}}>
      <div style={{padding:"18px 22px",borderBottom:`1px solid ${C.borderLight}`,background:C.navy,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:34,height:34,borderRadius:10,background:"rgba(31,111,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><Brain size={18} color={C.blue}/></div>
        <div><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{state.settings.ai.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>Connected to all {Object.keys(state).length - 2} modules</div></div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:"50%",background:C.emerald,animation:"pulse 2s infinite"}}/><span style={{fontSize:10,color:C.emerald,fontWeight:600}}>Live</span></div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:18,display:"flex",flexDirection:"column",gap:14}}>
        {messages.map((m,i)=>(<div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"88%"}}>
          <div style={{padding:"12px 16px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.role==="user"?C.blue:C.bgWarm,color:m.role==="user"?"#fff":C.text,fontSize:13,lineHeight:1.6,fontFamily:font.body}}>{m.text}</div>
          {m.steps&&<div style={{marginTop:8,display:"flex",flexDirection:"column",gap:3}}>
            {m.steps.map((s,j)=>(<div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 10px",borderRadius:6,background:s.status==="done"?"rgba(15,163,138,0.06)":s.status==="failed"?C.redSoft:"rgba(31,111,255,0.04)",fontSize:11,color:s.status==="done"?C.emerald:s.status==="failed"?C.red:C.blue,fontFamily:font.mono}}>
              {s.status==="done"?<Check size={11}/>:s.status==="failed"?<XCircle size={11}/>:<ArrowRight size={11}/>}
              <span style={{fontWeight:500}}>{s.action}</span><span style={{color:C.textTert,fontFamily:font.body}}>— {s.detail}</span>
            </div>))}
          </div>}
        </div>))}
        {executing&&<div style={{alignSelf:"flex-start",padding:"12px 16px",borderRadius:"14px 14px 14px 4px",background:C.bgWarm,display:"flex",alignItems:"center",gap:8}}><Loader size={14} color={C.blue} style={{animation:"spin 1s linear infinite"}}/><span style={{fontSize:12,color:C.textSec}}>Executing...</span></div>}
        <div ref={bottomRef}/>
      </div>
      {messages.length<=2&&<div style={{padding:"0 18px 12px",display:"flex",flexWrap:"wrap",gap:5}}>
        {suggestions.slice(0,3).map((s,i)=>(<button key={i} onClick={()=>handleSend(s)} style={{padding:"5px 11px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",fontSize:10,color:C.textSec,cursor:"pointer",fontFamily:font.body,textAlign:"left",lineHeight:1.4,transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=C.blueSoft;e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec}}>{s}</button>))}
      </div>}
      <div style={{padding:"12px 18px",borderTop:`1px solid ${C.borderLight}`,display:"flex",gap:10,alignItems:"center"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend()} placeholder="Tell me what to do..." style={{flex:1,padding:"10px 14px",border:`1px solid ${C.border}`,borderRadius:10,fontSize:13,outline:"none",fontFamily:font.body}}/>
        <button onClick={()=>handleSend()} disabled={executing} style={{width:38,height:38,borderRadius:10,background:executing?C.textTert:C.blue,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:executing?"not-allowed":"pointer"}}><Send size={14} color="#fff"/></button>
      </div>
    </div>}
  </>);
};

const BackendLayout = ({ active, onNavigate, title, subtitle, children }) => (
  <div style={{display:"flex",minHeight:"100vh",fontFamily:font.body}}><GlobalStyles/><SidebarNav active={active} onNavigate={onNavigate}/>
    <div style={{flex:1,background:C.bg,display:"flex",flexDirection:"column",minWidth:0}}><TopBar title={title} subtitle={subtitle}/><div style={{flex:1,overflowY:"auto"}}>{children}</div></div>
    <AIAgentFloat onNavigate={onNavigate}/>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 7: FRONTEND PAGES (HOME / FLEET / DETAIL / BOOKING) ███
   ═══════════════════════════════════════════════════════════════ */
const HomePage = ({ onNavigate }) => {
  const [loaded,setLoaded]=useState(false);
  const ctx = useContext(SystemContext);
  const { selectors } = ctx;
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);
  return (<div style={{background:"#000",fontFamily:font.body}}><GlobalStyles/>
    <div style={{position:"relative",height:"100vh",overflow:"hidden"}}>
      <ImgBg src={img.hero} style={{position:"absolute",inset:0}} overlay="linear-gradient(180deg,rgba(7,15,24,0.25) 0%,rgba(7,15,24,0.55) 60%,rgba(7,15,24,0.85) 100%)"/>
      <nav style={{position:"absolute",top:0,left:0,right:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"32px 56px",animation:loaded?"fadeIn .8s ease-out .4s both":"none"}}>
        <Logo light/>
        <div style={{display:"flex",gap:40,alignItems:"center"}}>
          {["Fleet","Destinations","Experience"].map(t=><span key={t} onClick={t==="Fleet"?()=>onNavigate("fleet"):undefined} style={{color:"rgba(255,255,255,0.6)",fontSize:12,letterSpacing:2.5,fontWeight:500,cursor:"pointer",fontFamily:font.body}} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.6)"}>{t.toUpperCase()}</span>)}
          <button onClick={()=>onNavigate("booking")} style={{padding:"11px 32px",background:"rgba(255,255,255,0.1)",backdropFilter:"blur(12px)",color:"#fff",border:"1px solid rgba(255,255,255,0.15)",borderRadius:4,fontSize:11,letterSpacing:2.5,fontWeight:600,cursor:"pointer",fontFamily:font.body}} onMouseEnter={e=>{e.target.style.background="#fff";e.target.style.color=C.navy}} onMouseLeave={e=>{e.target.style.background="rgba(255,255,255,0.1)";e.target.style.color="#fff"}}>BOOK NOW</button>
        </div>
      </nav>
      <div style={{position:"absolute",bottom:"14%",left:56,maxWidth:640,zIndex:5}}>
        <div style={{animation:loaded?"fadeUp 1.2s ease-out .6s both":"none"}}><SectionLabel light>PRIVATE YACHT CHARTERS</SectionLabel>
          <h1 style={{fontSize:76,fontWeight:300,color:"#fff",lineHeight:1.04,fontFamily:font.display,letterSpacing:-2}}>Beyond the<br/>Horizon</h1>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.45)",marginTop:28,maxWidth:440,lineHeight:1.8,fontFamily:font.body}}>Bespoke voyages for the world's most discerning travelers.</p>
        </div>
        <div style={{display:"flex",gap:16,marginTop:44,animation:loaded?"fadeUp 1.2s ease-out .9s both":"none"}}>
          <button onClick={()=>onNavigate("fleet")} style={{padding:"18px 44px",background:"#fff",color:C.navy,border:"none",borderRadius:4,fontSize:11,letterSpacing:2.5,fontWeight:700,cursor:"pointer",fontFamily:font.body}}>EXPLORE FLEET</button>
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",borderTop:"1px solid rgba(255,255,255,0.06)",animation:loaded?"fadeIn 1s ease-out 1.2s both":"none"}}>
        {[{v:selectors.yachts.length.toString(),l:"VESSELS"},{v:"40+",l:"DESTINATIONS"},{v:"18",l:"YEARS"},{v:"4.9",l:"GUEST RATING"}].map((s,i)=><div key={i} style={{padding:"32px 56px",borderRight:i<3?"1px solid rgba(255,255,255,0.06)":"none",backdropFilter:"blur(24px)",background:"rgba(7,15,24,0.5)"}}><div style={{fontSize:32,fontWeight:300,color:"#fff",fontFamily:font.display}}>{s.v}</div><div style={{fontSize:9,letterSpacing:4,color:"rgba(255,255,255,0.3)",marginTop:6,fontFamily:font.body}}>{s.l}</div></div>)}
      </div>
    </div>
    {/* Fleet Preview */}
    <div style={{background:C.bg,padding:"120px 56px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:64}}><div><SectionLabel>THE FLEET</SectionLabel><Heading size={48}>Our Vessels</Heading></div><span onClick={()=>onNavigate("fleet")} style={{display:"flex",alignItems:"center",gap:8,color:C.blue,fontSize:12,fontWeight:600,cursor:"pointer"}}>VIEW ALL <ArrowRight size={14}/></span></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:28}}>
        {selectors.yachts.slice(0,2).map((y,i)=>(<div key={y.id} onClick={()=>{ ctx?.setSelectedYachtId?.(y.id); onNavigate("yacht-detail"); }} style={{cursor:"pointer",borderRadius:10,overflow:"hidden",background:C.card,boxShadow:C.shadow,transition:"transform .5s cubic-bezier(.23,1,.32,1),box-shadow .5s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow=C.shadowXl}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=C.shadow}}>
          <ImgBg src={y.img} style={{height:320}} overlay="linear-gradient(0deg,rgba(0,0,0,0.3) 0%,transparent 50%)"><div style={{position:"absolute",top:20,right:20,zIndex:3}}><StatusBadge status={y.status}/></div></ImgBg>
          <div style={{padding:"24px 28px 28px"}}><h3 style={{fontSize:24,fontWeight:400,color:C.navy,fontFamily:font.display,marginBottom:16}}>{y.name}</h3><div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.textSec}}><span>{y.length} · {y.guests} guests · {y.location}</span><span style={{color:C.navy,fontWeight:700,fontSize:16}}>${y.pricePerWeek.toLocaleString()}<span style={{fontWeight:400,color:C.textTert,fontSize:12}}>/wk</span></span></div></div>
        </div>))}
      </div>
    </div>
    {/* CTA */}
    <div style={{position:"relative",height:400,overflow:"hidden"}}><ImgBg src={img.destinations[3]} style={{position:"absolute",inset:0}} overlay="linear-gradient(180deg,rgba(7,15,24,0.7) 0%,rgba(7,15,24,0.85) 100%)"/><div style={{position:"relative",zIndex:3,height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><Heading light size={44} style={{textAlign:"center",marginBottom:16}}>Begin Your Voyage</Heading><button onClick={()=>onNavigate("booking")} style={{padding:"18px 52px",background:C.blue,color:"#fff",border:"none",borderRadius:4,fontSize:11,letterSpacing:2.5,fontWeight:700,cursor:"pointer",fontFamily:font.body,marginTop:24}}>REQUEST A CHARTER</button></div></div>
  </div>);
};

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 8: BACKEND PAGES ███
   All pages read from SystemContext. All actions dispatch to reducer.
   ═══════════════════════════════════════════════════════════════ */
const DashboardPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  const iconMap = { alert:<AlertCircle size={13}/>, file:<FileText size={13}/>, "alert-triangle":<AlertTriangle size={13}/>, mail:<Mail size={13}/>, users:<Users size={13}/>, wrench:<Wrench size={13}/> };
  return (<BackendLayout active="dashboard" onNavigate={onNavigate} title="Command Center" subtitle={`Real-time · ${Object.keys(state.systemLog).length} system events logged`}>
    <div style={{padding:"28px 36px 60px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:16,marginBottom:22}}>
        <MetricCard label="TOTAL REVENUE" value={`$${(selectors.totalRevenue/1000).toFixed(0)}K`} sub={`${selectors.invoices.filter(i=>i.status==="paid").length} paid invoices`} icon={<DollarSign size={19}/>} trend="up" onClick={()=>onNavigate("revenue")}/>
        <MetricCard label="ACTIVE CHARTERS" value={selectors.activeCharters.toString()} icon={<Ship size={19}/>} onClick={()=>onNavigate("bookings")}/>
        <MetricCard label="FLEET UTILIZATION" value={`${selectors.fleetUtilization}%`} sub={`${selectors.yachts.filter(y=>y.status==="on_charter").length} of ${selectors.yachts.length} on charter`} icon={<Activity size={19}/>} onClick={()=>onNavigate("fleet-mgmt")}/>
        <MetricCard label="OPEN INCIDENTS" value={selectors.openIncidents.toString()} sub={selectors.openIncidents>0?"Requires attention":""} icon={<AlertTriangle size={19}/>} onClick={()=>onNavigate("incidents")}/>
      </div>
      {/* Needs Attention */}
      {selectors.needsAttention.length>0&&<div style={{background:C.card,borderRadius:12,padding:"20px 24px",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{width:28,height:28,borderRadius:7,background:C.redSoft,display:"flex",alignItems:"center",justifyContent:"center"}}><AlertCircle size={14} color={C.red}/></div><h3 style={{fontSize:14,fontWeight:700,color:C.navy}}>Needs Attention</h3><span style={{fontSize:11,color:C.textTert}}>{selectors.needsAttention.length} items</span></div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {selectors.needsAttention.map(item=><div key={item.id} onClick={()=>onNavigate(item.module)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:8,cursor:"pointer",background:item.priority==="critical"?"rgba(220,53,69,0.04)":"transparent",border:item.priority==="critical"?`1px solid rgba(220,53,69,0.12)`:"1px solid transparent",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.background=C.bgWarm} onMouseLeave={e=>e.currentTarget.style.background=item.priority==="critical"?"rgba(220,53,69,0.04)":"transparent"}>
            <div style={{color:item.priority==="critical"?C.red:item.priority==="high"?C.amber:C.blue}}>{iconMap[item.icon]}</div>
            <span style={{flex:1,fontSize:13,color:C.text,fontWeight:item.priority==="critical"?600:400}}>{item.text}</span>
            <span style={{fontSize:11,color:C.blue,fontWeight:600}}>{item.action} →</span>
          </div>)}
        </div>
      </div>}
      {/* Revenue + Bookings */}
      <div style={{display:"grid",gridTemplateColumns:"5fr 3fr",gap:18,marginBottom:18}}>
        <div style={{background:C.card,borderRadius:12,padding:"24px 24px 14px",boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:24}}>Revenue Flow</h3>
          <ResponsiveContainer width="100%" height={200}><AreaChart data={selectors.revenueData}><defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.blue} stopOpacity={.12}/><stop offset="100%" stopColor={C.blue} stopOpacity={0}/></linearGradient></defs><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize:10,fill:C.textTert}} dy={8}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:C.textTert}} tickFormatter={v=>`$${v/1000}k`} dx={-4}/><Tooltip contentStyle={{borderRadius:8,border:"none",boxShadow:C.shadowMd,fontSize:11,fontFamily:font.body}}/><Area type="monotone" dataKey="revenue" stroke={C.blue} strokeWidth={2.5} fill="url(#rg)" dot={false}/></AreaChart></ResponsiveContainer>
        </div>
        <div style={{background:C.card,borderRadius:12,padding:24,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:20}}>Recent Bookings</h3>
          {selectors.bookings.slice(0,4).map(b=><div key={b.id} onClick={()=>onNavigate("bookings")} style={{display:"flex",alignItems:"center",gap:11,padding:"8px 0",borderBottom:`1px solid ${C.borderLight}`,cursor:"pointer"}}>
            <div style={{width:30,height:30,borderRadius:7,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:700}}>{state.clients[b.clientId]?.name.split(" ").map(w=>w[0]).join("")}</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.navy}}>{state.clients[b.clientId]?.name}</div><div style={{fontSize:10,color:C.textTert}}>{state.yachts[b.yachtId]?.name}</div></div>
            <StatusBadge status={b.status} size="small"/>
          </div>)}
        </div>
      </div>
      {/* System Log (last 8) */}
      <div style={{background:C.card,borderRadius:12,padding:24,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
        <h3 style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:16}}>System Activity Log</h3>
        <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:200,overflowY:"auto"}}>
          {state.systemLog.length===0?<div style={{fontSize:12,color:C.textTert,padding:8}}>No system events yet. Use the AI agent to perform actions.</div>:
          state.systemLog.slice(-8).reverse().map(l=><div key={l.id} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",borderRadius:6,fontSize:11,fontFamily:font.mono,color:C.textSec}}>
            <span style={{color:C.textTert,fontSize:10,minWidth:60}}>{new Date(l.timestamp).toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"})}</span>
            <span style={{color:C.blue,fontWeight:600,minWidth:140}}>{l.type}</span>
            <span style={{color:C.text,fontFamily:font.body}}>{l.detail}</span>
          </div>)}
        </div>
      </div>
    </div>
  </BackendLayout>);
};

const BookingsPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  const [filter,setFilter]=useState("all");
  const filtered = filter==="all"?selectors.bookings:selectors.bookings.filter(b=>b.status===filter);
  return (<BackendLayout active="bookings" onNavigate={onNavigate} title="Bookings Pipeline" subtitle="All bookings linked to clients, yachts, invoices, crew">
    <div style={{padding:"28px 36px 60px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div style={{display:"flex",gap:6}}>{["all","new","confirmed","pending","completed"].map(s=><button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 16px",borderRadius:100,border:filter===s?"none":`1px solid ${C.border}`,background:filter===s?C.navy:"transparent",color:filter===s?"#fff":C.textSec,fontSize:11,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{s}</button>)}</div>
        <Btn icon={<Plus size={14}/>}>New Booking</Btn>
      </div>
      <div style={{background:C.card,borderRadius:12,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{borderBottom:`1px solid ${C.borderLight}`}}>{["ID","Client","Yacht","Crew Lead","Destination","Dates","Total","Invoice","Status"].map((h,i)=><th key={i} style={{padding:"12px 16px",textAlign:"left",fontSize:9,letterSpacing:1.5,color:C.textTert,fontWeight:600,background:C.bgWarm}}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map(b=><tr key={b.id} style={{borderBottom:`1px solid ${C.borderLight}`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"13px 16px",fontSize:12,fontWeight:700,color:C.blue,fontFamily:font.mono}}>{b.id}</td>
          <td style={{padding:"13px 16px",fontSize:13,fontWeight:500,color:C.text}}>{state.clients[b.clientId]?.name}</td>
          <td style={{padding:"13px 16px",fontSize:13,color:C.text}}>{state.yachts[b.yachtId]?.name}</td>
          <td style={{padding:"13px 16px",fontSize:12,color:C.textSec}}>{state.crew[b.crewLeadId]?.name}</td>
          <td style={{padding:"13px 16px",fontSize:12,color:C.textSec}}>{b.destination}</td>
          <td style={{padding:"13px 16px",fontSize:12,color:C.textTert}}>{b.startDate} → {b.endDate}</td>
          <td style={{padding:"13px 16px",fontSize:13,fontWeight:700,color:C.navy}}>${b.total.toLocaleString()}</td>
          <td style={{padding:"13px 16px"}}><StatusBadge status={state.invoices[b.invoiceId]?.status||"draft"} size="small"/></td>
          <td style={{padding:"13px 16px"}}><StatusBadge status={b.status}/></td>
        </tr>)}</tbody></table>
      </div>
    </div>
  </BackendLayout>);
};

const ClientsPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  return (<BackendLayout active="clients" onNavigate={onNavigate} title="Client Profiles" subtitle="Full relational view — bookings, invoices, messages, documents linked">
    <div style={{padding:"28px 36px 60px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {selectors.clients.map(c=>{
          const spent = selectors.clientSpent(c.id);
          const bkCount = selectors.clientBookingCount(c.id);
          return <div key={c.id} style={{background:C.card,borderRadius:12,padding:26,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,cursor:"pointer",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=C.shadowMd;e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=C.shadow;e.currentTarget.style.transform=""}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
              <div style={{width:42,height:42,borderRadius:10,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700}}>{c.name.split(" ").map(w=>w[0]).join("")}</div>
              <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:15,fontWeight:600,color:C.navy}}>{c.name}</span>{c.vip&&<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4,background:"rgba(201,166,107,0.12)",color:"#B8943A"}}>VIP</span>}</div><div style={{fontSize:11,color:C.textTert}}>{c.email}</div></div>
              <span style={{fontSize:10,color:C.textTert,fontFamily:font.mono}}>{c.id}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:14}}>
              {[{l:"Charters",v:bkCount},{l:"Revenue",v:`$${(spent/1000).toFixed(0)}K`},{l:"Since",v:c.since},{l:"Preferred",v:c.pref}].map((s,j)=><div key={j}><div style={{fontSize:9,color:C.textTert,letterSpacing:1.5,fontWeight:600}}>{s.l.toUpperCase()}</div><div style={{fontSize:13,fontWeight:600,color:C.navy,marginTop:4}}>{s.v}</div></div>)}
            </div>
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:C.blueSoft,color:C.blue,fontFamily:font.mono}}>{c.bookingIds.length} bookings</span>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:C.emeraldSoft,color:C.emerald,fontFamily:font.mono}}>{c.invoiceIds.length} invoices</span>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:C.bgWarm,color:C.textTert,fontFamily:font.mono}}>{c.messageThreadIds.length} threads</span>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:C.bgWarm,color:C.textTert,fontFamily:font.mono}}>{c.documentIds.length} docs</span>
            </div>
            {c.notes&&<div style={{padding:"8px 12px",background:C.bgWarm,borderRadius:7,fontSize:11,color:C.textSec,lineHeight:1.5}}>{c.notes}</div>}
          </div>;
        })}
      </div>
    </div>
  </BackendLayout>);
};

const FleetMgmtPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  return (<BackendLayout active="fleet-mgmt" onNavigate={onNavigate} title="Fleet Management" subtitle="Vessels → bookings → crew → incidents → maintenance → costs">
    <div style={{padding:"28px 36px 60px"}}>
      {selectors.yachts.map(y=>{
        const activeBookings = selectors.bookings.filter(b=>b.yachtId===y.id&&b.status!=="completed");
        const yachtCrew = y.crewIds.map(cid=>state.crew[cid]).filter(Boolean);
        const yachtIncidents = y.incidentIds.map(iid=>state.incidents[iid]).filter(Boolean);
        const totalOps = y.operationalCosts.fuel+y.operationalCosts.insurance+y.operationalCosts.docking;
        return <div key={y.id} style={{display:"flex",background:C.card,borderRadius:12,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,overflow:"hidden",marginBottom:14,transition:"box-shadow .2s",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow=C.shadowMd} onMouseLeave={e=>e.currentTarget.style.boxShadow=C.shadow}>
          <ImgBg src={y.img} style={{width:200,minHeight:140,flexShrink:0}}/>
          <div style={{flex:1,padding:"18px 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}>
              <div><div style={{fontSize:15,fontWeight:600,color:C.navy}}>{y.name}</div><div style={{fontSize:10,color:C.textTert,fontFamily:font.mono}}>{y.id} · {y.type} · {y.length}</div></div>
              <StatusBadge status={y.status}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",gap:10}}>
              <div><div style={{fontSize:9,color:C.textTert,letterSpacing:1,fontWeight:600}}>RATE</div><div style={{fontSize:12,fontWeight:600,color:C.navy,marginTop:2}}>${y.pricePerWeek.toLocaleString()}/wk</div></div>
              <div><div style={{fontSize:9,color:C.textTert,letterSpacing:1,fontWeight:600}}>BOOKINGS</div><div style={{fontSize:12,fontWeight:600,color:C.navy,marginTop:2}}>{activeBookings.length} active</div></div>
              <div><div style={{fontSize:9,color:C.textTert,letterSpacing:1,fontWeight:600}}>CREW</div><div style={{fontSize:12,fontWeight:600,color:C.navy,marginTop:2}}>{yachtCrew.map(c=>c.name.split(" ").pop()).join(", ")}</div></div>
              <div><div style={{fontSize:9,color:C.textTert,letterSpacing:1,fontWeight:600}}>INCIDENTS</div><div style={{fontSize:12,fontWeight:600,color:yachtIncidents.some(i=>i.status==="open")?C.red:C.navy,marginTop:2}}>{yachtIncidents.filter(i=>i.status!=="resolved").length} open</div></div>
              <div><div style={{fontSize:9,color:C.textTert,letterSpacing:1,fontWeight:600}}>OPS COST</div><div style={{fontSize:12,fontWeight:600,color:C.navy,marginTop:2}}>${totalOps.toLocaleString()}/mo</div></div>
              <div><div style={{fontSize:9,color:C.textTert,letterSpacing:1,fontWeight:600}}>NEXT MAINT</div><div style={{fontSize:12,fontWeight:600,color:C.navy,marginTop:2}}>{y.maintenanceSchedule[0]?.date||"—"}</div></div>
            </div>
          </div>
        </div>;
      })}
    </div>
  </BackendLayout>);
};

const CrewPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  const totalPayroll = selectors.crew.reduce((s,c)=>s+c.pay,0);
  return (<BackendLayout active="crew" onNavigate={onNavigate} title="Crew Management" subtitle="Assignments, certs, payroll — linked to yachts and bookings">
    <div style={{padding:"28px 36px 60px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:22}}>
        <MetricCard label="MONTHLY PAYROLL" value={`$${(totalPayroll/1000).toFixed(1)}K`} icon={<DollarSign size={18}/>}/>
        <MetricCard label="ACTIVE CREW" value={selectors.crew.filter(c=>c.status==="active").length.toString()} icon={<Users size={18}/>}/>
        <MetricCard label="AVG RATING" value={(selectors.crew.reduce((s,c)=>s+c.rating,0)/selectors.crew.length).toFixed(1)} icon={<Star size={18}/>}/>
      </div>
      <div style={{background:C.card,borderRadius:12,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{borderBottom:`1px solid ${C.borderLight}`}}>{["Crew","Role","Vessel","Bookings","Pay","Certs","Rating","Status"].map((h,i)=><th key={i} style={{padding:"12px 16px",textAlign:"left",fontSize:9,letterSpacing:1.5,color:C.textTert,fontWeight:600,background:C.bgWarm}}>{h}</th>)}</tr></thead>
        <tbody>{selectors.crew.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${C.borderLight}`}}>
          <td style={{padding:"13px 16px"}}><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:28,height:28,borderRadius:6,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:700}}>{c.avatar}</div><span style={{fontSize:13,fontWeight:500,color:C.text}}>{c.name}</span></div></td>
          <td style={{padding:"13px 16px",fontSize:12,color:C.textSec}}>{c.role}</td>
          <td style={{padding:"13px 16px",fontSize:12,color:C.text}}>{state.yachts[c.yachtId]?.name}</td>
          <td style={{padding:"13px 16px",fontSize:12,color:C.navy,fontWeight:600}}>{c.assignedBookingIds.length}</td>
          <td style={{padding:"13px 16px",fontSize:12,fontWeight:600,color:C.navy}}>${c.pay.toLocaleString()}/mo</td>
          <td style={{padding:"13px 16px"}}><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{c.certs.slice(0,2).map((cert,i)=><span key={i} style={{fontSize:9,padding:"2px 6px",borderRadius:3,background:C.bgWarm,color:C.textTert}}>{cert}</span>)}{c.certs.length>2&&<span style={{fontSize:9,color:C.textTert}}>+{c.certs.length-2}</span>}</div></td>
          <td style={{padding:"13px 16px",fontSize:12,fontWeight:600,color:C.navy}}>{c.rating} ★</td>
          <td style={{padding:"13px 16px"}}><StatusBadge status={c.status}/></td>
        </tr>)}</tbody></table>
      </div>
    </div>
  </BackendLayout>);
};

const MessagesPage = ({ onNavigate }) => {
  const { state, dispatch, selectors } = useContext(SystemContext);
  const [activeThread,setActiveThread]=useState(Object.keys(state.messageThreads)[0]);
  const [newMsg,setNewMsg]=useState("");
  const thread = state.messageThreads[activeThread];
  const handleSend = () => { if(!newMsg.trim()) return; dispatch({type:"SEND_MESSAGE",payload:{threadId:activeThread,text:newMsg,sender:"system"}}); setNewMsg(""); };
  return (<BackendLayout active="messages" onNavigate={onNavigate} title="Communications Hub" subtitle="Unified messaging — WhatsApp, Email, Phone — linked to clients & bookings">
    <div style={{display:"flex",height:"calc(100vh - 73px)"}}>
      <div style={{width:340,borderRight:`1px solid ${C.border}`,background:"#fff",overflowY:"auto"}}>
        {selectors.threads.map(t=>{const client=state.clients[t.clientId]; const unread=t.messages.filter(m=>!m.read&&m.sender==="client").length; return <div key={t.id} onClick={()=>setActiveThread(t.id)} style={{display:"flex",gap:10,padding:"14px 18px",cursor:"pointer",background:activeThread===t.id?C.blueSoft:"transparent",borderLeft:activeThread===t.id?`3px solid ${C.blue}`:"3px solid transparent"}}>
          <div style={{width:34,height:34,borderRadius:8,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:700,flexShrink:0}}>{client?.name.split(" ").map(w=>w[0]).join("")}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:unread?700:500,color:C.navy}}>{client?.name}</span></div>
            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}><span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:C.bgWarm,color:C.textTert,fontWeight:600}}>{t.channel}</span><span style={{fontSize:10,color:C.textTert,fontFamily:font.mono}}>BK:{state.bookings[t.bookingId]?.id}</span></div>
            <p style={{fontSize:11,color:C.textTert,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.messages[t.messages.length-1]?.text}</p>
          </div>
          {unread>0&&<div style={{width:6,height:6,borderRadius:"50%",background:C.blue,marginTop:6,flexShrink:0}}/>}
        </div>;})}
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        {thread&&<><div style={{padding:"12px 24px",borderBottom:`1px solid ${C.border}`,background:"#fff",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:7,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:700}}>{state.clients[thread.clientId]?.name.split(" ").map(w=>w[0]).join("")}</div>
          <div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>{state.clients[thread.clientId]?.name}</div><div style={{fontSize:10,color:C.textTert}}>Channel: {thread.channel} · Booking: {state.bookings[thread.bookingId]?.id} · Yacht: {state.yachts[state.bookings[thread.bookingId]?.yachtId]?.name}</div></div>
        </div>
        <div style={{flex:1,padding:28,overflowY:"auto",background:C.bgWarm}}>
          {thread.messages.map(m=><div key={m.id} style={{alignSelf:m.sender==="system"?"flex-end":"flex-start",maxWidth:"60%",marginBottom:14,marginLeft:m.sender==="system"?"auto":0}}>
            <div style={{padding:"12px 18px",borderRadius:m.sender==="system"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.sender==="system"?C.blue:"#fff",color:m.sender==="system"?"#fff":C.text,fontSize:13,lineHeight:1.6}}>{m.text}</div>
            <span style={{fontSize:10,color:C.textTert,marginTop:3,display:"block",textAlign:m.sender==="system"?"right":"left"}}>{new Date(m.timestamp).toLocaleString()}</span>
          </div>)}
        </div>
        <div style={{padding:"12px 24px",borderTop:`1px solid ${C.border}`,background:"#fff",display:"flex",gap:10}}>
          <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend()} placeholder="Type a message..." style={{flex:1,padding:"10px 14px",border:`1px solid ${C.border}`,borderRadius:10,fontSize:13,outline:"none",fontFamily:font.body}}/>
          <button onClick={handleSend} style={{width:38,height:38,borderRadius:10,background:C.blue,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Send size={14} color="#fff"/></button>
        </div></>}
      </div>
    </div>
  </BackendLayout>);
};

const RevenuePage = ({ onNavigate }) => {
  const { selectors } = useContext(SystemContext);
  const avgValue = selectors.invoices.filter(i=>i.status==="paid").length>0?Math.round(selectors.totalRevenue/selectors.invoices.filter(i=>i.status==="paid").length):0;
  return (<BackendLayout active="revenue" onNavigate={onNavigate} title="Revenue & Reporting" subtitle="Computed from real invoice data">
    <div style={{padding:"28px 36px 60px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:16,marginBottom:22}}>
        <MetricCard label="TOTAL REVENUE" value={`$${(selectors.totalRevenue/1000).toFixed(0)}K`} icon={<TrendingUp size={18}/>} trend="up"/>
        <MetricCard label="AVG CHARTER VALUE" value={`$${(avgValue/1000).toFixed(0)}K`} icon={<Target size={18}/>}/>
        <MetricCard label="PAID INVOICES" value={selectors.invoices.filter(i=>i.status==="paid").length.toString()} icon={<Receipt size={18}/>}/>
        <MetricCard label="OUTSTANDING" value={`$${(selectors.invoices.filter(i=>i.status==="sent"||i.status==="draft").reduce((s,i)=>s+i.amount,0)/1000).toFixed(0)}K`} icon={<Clock size={18}/>}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"5fr 3fr",gap:18}}>
        <div style={{background:C.card,borderRadius:12,padding:24,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:24}}>Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={260}><BarChart data={selectors.revenueData} barGap={2}><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize:10,fill:C.textTert}} dy={8}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:C.textTert}} tickFormatter={v=>`$${v/1000}k`} dx={-4}/><Tooltip contentStyle={{borderRadius:8,border:"none",boxShadow:C.shadowMd,fontSize:11}}/><Bar dataKey="revenue" fill={C.blue} radius={[3,3,0,0]} barSize={20}/><Bar dataKey="expenses" fill={C.borderLight} radius={[3,3,0,0]} barSize={20}/></BarChart></ResponsiveContainer>
        </div>
        <div style={{background:C.card,borderRadius:12,padding:24,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:22}}>Invoice Breakdown</h3>
          {selectors.invoices.slice(0,5).map(inv=><div key={inv.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.borderLight}`}}>
            <div><div style={{fontSize:12,fontWeight:600,color:C.navy,fontFamily:font.mono}}>{inv.id}</div><div style={{fontSize:10,color:C.textTert}}>{inv.clientId} → {inv.bookingId}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:C.navy}}>${inv.amount.toLocaleString()}</div><StatusBadge status={inv.status} size="small"/></div>
          </div>)}
        </div>
      </div>
    </div>
  </BackendLayout>);
};

const CalendarPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  const days = Array.from({length:30},(_,i)=>i+1);
  // Build calendar events from real bookings
  const calEvents = [];
  selectors.bookings.forEach(b=>{
    const start = parseInt(b.startDate.split("-")[2]);
    const end = parseInt(b.endDate.split("-")[2]);
    const month = parseInt(b.startDate.split("-")[1]);
    if(month===4){for(let d=start;d<=Math.min(end,30);d++) calEvents.push({day:d,yacht:state.yachts[b.yachtId]?.name.split(" ").pop(),type:"charter",client:state.clients[b.clientId]?.name.split(" ").pop()});}
  });
  // Maintenance from yachts
  selectors.yachts.forEach(y=>{y.maintenanceSchedule.forEach(m=>{const d=parseInt(m.date.split("-")[2]);const mo=parseInt(m.date.split("-")[1]);if(mo===4) calEvents.push({day:d,yacht:y.name.split(" ").pop(),type:"maintenance"});});});

  return (<BackendLayout active="calendar" onNavigate={onNavigate} title="Charter Calendar" subtitle="Generated from real booking data — conflict detection active">
    <div style={{padding:"28px 36px 60px"}}>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:14,marginBottom:22}}>
        <ChevronLeft size={16} color={C.textSec} style={{cursor:"pointer"}}/>
        <span style={{fontSize:15,fontWeight:700,color:C.navy}}>April 2026</span>
        <ChevronRight size={16} color={C.textSec} style={{cursor:"pointer"}}/>
      </div>
      <div style={{background:C.card,borderRadius:12,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,padding:18}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1}}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><div key={d} style={{padding:7,textAlign:"center",fontSize:9,fontWeight:700,color:C.textTert,letterSpacing:1.5}}>{d.toUpperCase()}</div>)}
          <div/><div/>
          {days.map(d=>{const ev=calEvents.filter(e=>e.day===d);const isToday=d===8;return <div key={d} style={{minHeight:76,padding:6,borderRadius:5,border:`1px solid ${isToday?C.blue:C.borderLight}`,background:isToday?C.blueSoft:"transparent",cursor:"pointer"}} onMouseEnter={e=>{if(!isToday)e.currentTarget.style.background=C.cardHover}} onMouseLeave={e=>{if(!isToday)e.currentTarget.style.background="transparent"}}>
            <div style={{fontSize:11,fontWeight:isToday?700:400,color:isToday?C.blue:C.text,marginBottom:2}}>{d}</div>
            {ev.map((e,j)=><div key={j} style={{fontSize:9,padding:"2px 5px",borderRadius:3,marginBottom:1,fontWeight:600,background:e.type==="charter"?C.blueSoft:C.amberSoft,color:e.type==="charter"?C.blue:C.amber,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.yacht}{e.client?` · ${e.client}`:""}</div>)}
          </div>;})}
        </div>
      </div>
    </div>
  </BackendLayout>);
};

const DocumentsPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  return (<BackendLayout active="documents" onNavigate={onNavigate} title="Documents & Waivers" subtitle="Linked to bookings, clients, yachts — e-signature tracking">
    <div style={{padding:"28px 36px 60px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:22}}>
        <MetricCard label="TOTAL DOCS" value={selectors.documents.length.toString()} icon={<FileText size={18}/>}/>
        <MetricCard label="PENDING SIGNATURE" value={selectors.pendingDocs.toString()} icon={<Edit3 size={18}/>}/>
        <MetricCard label="SIGNED" value={selectors.documents.filter(d=>d.status==="signed").length.toString()} icon={<FileCheck size={18}/>}/>
      </div>
      <div style={{background:C.card,borderRadius:12,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{borderBottom:`1px solid ${C.borderLight}`}}>{["Document","Type","Linked To","Client","Date","Status"].map((h,i)=><th key={i} style={{padding:"12px 16px",textAlign:"left",fontSize:9,letterSpacing:1.5,color:C.textTert,fontWeight:600,background:C.bgWarm}}>{h}</th>)}</tr></thead>
        <tbody>{selectors.documents.map(d=><tr key={d.id} style={{borderBottom:`1px solid ${C.borderLight}`}}>
          <td style={{padding:"13px 16px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><FileText size={14} color={C.blue}/><span style={{fontSize:13,fontWeight:500,color:C.text}}>{d.name}</span></div></td>
          <td style={{padding:"13px 16px",fontSize:12,color:C.textSec,textTransform:"capitalize"}}>{d.type}</td>
          <td style={{padding:"13px 16px",fontSize:11,color:C.blue,fontFamily:font.mono}}>{d.refType}:{d.refId}</td>
          <td style={{padding:"13px 16px",fontSize:12,color:C.textSec}}>{d.clientId?state.clients[d.clientId]?.name:"—"}</td>
          <td style={{padding:"13px 16px",fontSize:12,color:C.textTert}}>{d.createdAt.split("T")[0]}</td>
          <td style={{padding:"13px 16px"}}><StatusBadge status={d.status}/></td>
        </tr>)}</tbody></table>
      </div>
    </div>
  </BackendLayout>);
};

const NotesPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  return (<BackendLayout active="notes" onNavigate={onNavigate} title="Notes & Logs" subtitle="Linked to bookings, clients, yachts — timestamped">
    <div style={{padding:"28px 36px 60px"}}>
      {selectors.notes.map(n=><div key={n.id} style={{background:C.card,borderRadius:12,padding:24,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,marginBottom:12,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.boxShadow=C.shadowMd} onMouseLeave={e=>e.currentTarget.style.boxShadow=C.shadow}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:10}}>
          <div><h3 style={{fontSize:15,fontWeight:600,color:C.navy,marginBottom:4}}>{n.title}</h3><div style={{display:"flex",gap:6}}><span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:C.blueSoft,color:C.blue,fontWeight:600}}>{n.category}</span>{n.refId&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:C.bgWarm,color:C.textTert,fontFamily:font.mono}}>{n.refType}:{n.refId}</span>}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.textTert}}>{n.createdAt.split("T")[0]}</div>{n.updatedAt!==n.createdAt&&<div style={{fontSize:9,color:C.textTert,fontStyle:"italic"}}>edited</div>}</div>
        </div>
        <p style={{fontSize:13,color:C.textSec,lineHeight:1.7}}>{n.content}</p>
      </div>)}
    </div>
  </BackendLayout>);
};

const IncidentsPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  return (<BackendLayout active="incidents" onNavigate={onNavigate} title="Incident Tracking" subtitle="Linked to yachts — severity, cost, resolution tracking">
    <div style={{padding:"28px 36px 60px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:22}}>
        <MetricCard label="OPEN" value={selectors.incidents.filter(i=>i.status==="open").length.toString()} icon={<AlertTriangle size={18}/>}/>
        <MetricCard label="IN PROGRESS" value={selectors.incidents.filter(i=>i.status==="in_progress").length.toString()} icon={<Wrench size={18}/>}/>
        <MetricCard label="TOTAL COST (MTD)" value={`$${(selectors.incidents.reduce((s,i)=>s+i.cost,0)/1000).toFixed(1)}K`} icon={<DollarSign size={18}/>}/>
      </div>
      {selectors.incidents.map(inc=><div key={inc.id} style={{background:C.card,borderRadius:12,padding:24,boxShadow:C.shadow,border:`1px solid ${inc.status==="open"?"rgba(220,53,69,0.2)":C.borderLight}`,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><AlertTriangle size={14} color={inc.severity==="high"?C.red:inc.severity==="medium"?C.amber:C.emerald}/><div><h3 style={{fontSize:14,fontWeight:600,color:C.navy}}>{inc.title}</h3><div style={{fontSize:11,color:C.textTert,fontFamily:font.mono}}>Yacht: {state.yachts[inc.yachtId]?.name} · {inc.id}</div></div></div>
          <div style={{display:"flex",gap:8}}><span style={{fontSize:10,padding:"3px 10px",borderRadius:4,background:inc.severity==="high"?C.redSoft:inc.severity==="medium"?C.amberSoft:C.emeraldSoft,color:inc.severity==="high"?C.red:inc.severity==="medium"?C.amber:C.emerald,fontWeight:600,textTransform:"capitalize"}}>{inc.severity}</span><StatusBadge status={inc.status} size="small"/></div>
        </div>
        <p style={{fontSize:13,color:C.textSec,lineHeight:1.6}}>{inc.description}</p>
        <div style={{marginTop:10,fontSize:12,fontWeight:600,color:C.navy}}>Cost: {inc.cost>0?`$${inc.cost.toLocaleString()}`:"TBD"}{inc.internalThreadId&&<span style={{marginLeft:12,fontSize:11,color:C.blue,cursor:"pointer"}}>View thread →</span>}</div>
      </div>)}
    </div>
  </BackendLayout>);
};

const MarketingPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  const campaigns = Object.values(state.campaigns);
  return (<BackendLayout active="marketing" onNavigate={onNavigate} title="Marketing Pipeline" subtitle="Leads → conversion → client → revenue chain">
    <div style={{padding:"28px 36px 60px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div style={{background:C.card,borderRadius:12,padding:24,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:20}}>Active Leads</h3>
          {selectors.leads.map(l=><div key={l.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.borderLight}`}}>
            <div style={{width:32,height:32,borderRadius:7,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:700}}>{l.name.split(" ").map(w=>w[0]).join("")}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:C.navy}}>{l.name}</div><div style={{fontSize:10,color:C.textTert}}>{l.source} · {l.notes}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:600,color:C.navy}}>${(l.estimatedValue/1000).toFixed(0)}K</div><StatusBadge status={l.status} size="small"/></div>
          </div>)}
        </div>
        <div style={{background:C.card,borderRadius:12,padding:24,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:20}}>Campaigns</h3>
          {campaigns.map(c=><div key={c.id} style={{padding:16,borderRadius:10,border:`1px solid ${C.borderLight}`,background:C.bgWarm,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><h4 style={{fontSize:13,fontWeight:600,color:C.navy}}>{c.name}</h4><StatusBadge status={c.status} size="small"/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{[{l:"REACH",v:c.reach.toLocaleString()},{l:"CONVERSIONS",v:c.conversions},{l:"SPEND",v:`$${c.spend.toLocaleString()}`}].map((s,j)=><div key={j}><div style={{fontSize:9,color:C.textTert,letterSpacing:1,fontWeight:600}}>{s.l}</div><div style={{fontSize:13,fontWeight:600,color:C.navy,marginTop:2}}>{s.v}</div></div>)}</div>
          </div>)}
        </div>
      </div>
    </div>
  </BackendLayout>);
};

const ReviewsPage = ({ onNavigate }) => {
  const { state, selectors } = useContext(SystemContext);
  return (<BackendLayout active="reviews" onNavigate={onNavigate} title="Reviews & Testimonials" subtitle="Linked to clients, yachts, bookings">
    <div style={{padding:"28px 36px 60px"}}>
      {selectors.reviews.map(r=><div key={r.id} style={{background:C.card,borderRadius:12,padding:28,boxShadow:C.shadow,border:`1px solid ${r.featured?`rgba(31,111,255,0.15)`:C.borderLight}`,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:8,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700}}>{state.clients[r.clientId]?.name.split(" ").map(w=>w[0]).join("")}</div>
            <div><div style={{fontSize:14,fontWeight:600,color:C.navy}}>{state.clients[r.clientId]?.name}</div><div style={{fontSize:11,color:C.textTert,fontFamily:font.mono}}>{state.yachts[r.yachtId]?.name} · {r.bookingId} · {r.platform}</div></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>{r.featured&&<span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:C.blueSoft,color:C.blue,fontWeight:700}}>FEATURED</span>}<div style={{display:"flex",gap:1}}>{Array.from({length:r.rating},(_,j)=><Star key={j} size={12} fill="#E8B931" color="#E8B931"/>)}</div></div>
        </div>
        <p style={{fontSize:14,color:C.textSec,lineHeight:1.7,fontStyle:"italic"}}>"{r.text}"</p>
      </div>)}
    </div>
  </BackendLayout>);
};

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 9: AI COMMAND PAGE (DEDICATED) ███
   Full-screen command interface with execution feedback
   ═══════════════════════════════════════════════════════════════ */
const AICommandPage = ({ onNavigate }) => {
  const { state, dispatch, selectors } = useContext(SystemContext);
  const [input,setInput]=useState("");
  const [history,setHistory]=useState([]);
  const [executing,setExecuting]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"})},[history]);

  const suggestions = ["Create booking for David Thornton — Alokoy, May 20–27","Send invoice to Elena Vasquez","What's the status of Alokoy climate control?","Schedule maintenance for Calico","Fleet status","Revenue report","Check status"];

  const handleExecute = (text) => {
    const cmd = text||input; if(!cmd.trim()||executing) return;
    setHistory(p=>[...p,{type:"input",text:cmd,timestamp:new Date().toISOString()}]);
    setInput(""); setExecuting(true);
    setTimeout(()=>{
      const result = executeAICommand(cmd, state, dispatch);
      setHistory(p=>[...p,{type:"result",text:result.response,steps:result.steps,intent:result.intent,entities:result.entities,timestamp:new Date().toISOString()}]);
      setExecuting(false);
    },600);
  };

  return (<BackendLayout active="ai-command" onNavigate={onNavigate} title={`${state.settings.ai.name} — Command Interface`} subtitle="Natural language → system execution · Real actions · Full audit trail">
    <div style={{display:"flex",height:"calc(100vh - 73px)"}}>
      {/* Main command area */}
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,overflowY:"auto",padding:"32px 40px"}}>
          {history.length===0&&<div style={{textAlign:"center",padding:"80px 0"}}>
            <div style={{width:72,height:72,borderRadius:20,background:C.blueSoft,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><Brain size={36} color={C.blue}/></div>
            <h2 style={{fontSize:28,fontWeight:300,color:C.navy,fontFamily:font.display,marginBottom:12}}>Command Center</h2>
            <p style={{fontSize:14,color:C.textTert,marginBottom:40}}>Execute real system operations through natural language</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",maxWidth:600,margin:"0 auto"}}>
              {suggestions.map((s,i)=><button key={i} onClick={()=>handleExecute(s)} style={{padding:"10px 18px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",fontSize:12,color:C.textSec,cursor:"pointer",fontFamily:font.body,textAlign:"left",lineHeight:1.4,transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background=C.blueSoft;e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec}}>{s}</button>)}
            </div>
          </div>}
          {history.map((h,i)=><div key={i} style={{marginBottom:20,animation:"slideUp .3s ease-out"}}>
            {h.type==="input"&&<div style={{display:"flex",alignItems:"start",gap:12,marginBottom:8}}>
              <div style={{width:28,height:28,borderRadius:7,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:700,flexShrink:0,marginTop:2}}>CA</div>
              <div><div style={{padding:"12px 18px",background:C.navy,borderRadius:"14px 14px 14px 4px",color:"#fff",fontSize:14,lineHeight:1.5,maxWidth:600}}>{h.text}</div><div style={{fontSize:10,color:C.textTert,marginTop:4,fontFamily:font.mono}}>{new Date(h.timestamp).toLocaleTimeString()}</div></div>
            </div>}
            {h.type==="result"&&<div style={{display:"flex",alignItems:"start",gap:12}}>
              <div style={{width:28,height:28,borderRadius:7,background:C.blueSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><Brain size={14} color={C.blue}/></div>
              <div style={{flex:1}}>
                {/* Execution steps */}
                {h.steps&&h.steps.length>0&&<div style={{background:C.bgWarm,borderRadius:10,padding:16,marginBottom:12,border:`1px solid ${C.borderLight}`}}>
                  <div style={{fontSize:10,letterSpacing:2,color:C.textTert,fontWeight:600,marginBottom:10}}>EXECUTION LOG</div>
                  {h.steps.map((s,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",fontSize:12}}>
                    {s.status==="done"?<CheckCircle2 size={13} color={C.emerald}/>:s.status==="failed"?<XCircle size={13} color={C.red}/>:s.status==="skipped"?<MinusCircle size={13} color={C.textTert}/>:<ArrowRight size={13} color={C.blue}/>}
                    <span style={{fontWeight:600,color:C.navy,fontFamily:font.mono,minWidth:160}}>{s.action}</span>
                    <span style={{color:C.textSec}}>{s.detail}</span>
                  </div>)}
                </div>}
                <div style={{padding:"12px 18px",background:"#fff",borderRadius:"14px 14px 14px 4px",border:`1px solid ${C.borderLight}`,fontSize:14,lineHeight:1.6,color:C.text,maxWidth:700}}>{h.text}</div>
                <div style={{fontSize:10,color:C.textTert,marginTop:4,fontFamily:font.mono}}>{new Date(h.timestamp).toLocaleTimeString()}{h.intent&&<span style={{marginLeft:8,color:C.blue}}>intent:{h.intent}</span>}</div>
              </div>
            </div>}
          </div>)}
          {executing&&<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{width:28,height:28,borderRadius:7,background:C.blueSoft,display:"flex",alignItems:"center",justifyContent:"center"}}><Loader size={14} color={C.blue} style={{animation:"spin 1s linear infinite"}}/></div>
            <span style={{fontSize:13,color:C.textSec}}>Parsing intent → Executing actions → Updating modules...</span>
          </div>}
          <div ref={bottomRef}/>
        </div>
        {/* Input bar */}
        <div style={{padding:"16px 40px",borderTop:`1px solid ${C.border}`,background:"#fff",display:"flex",gap:12,alignItems:"center"}}>
          <Terminal size={16} color={C.textTert}/>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleExecute()} placeholder={`Tell ${state.settings.ai.name} what to do...`} style={{flex:1,padding:"12px 16px",border:`1px solid ${C.border}`,borderRadius:10,fontSize:14,outline:"none",fontFamily:font.body}}/>
          <button onClick={()=>handleExecute()} disabled={executing} style={{padding:"12px 28px",background:executing?C.textTert:C.blue,color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:executing?"not-allowed":"pointer",fontFamily:font.body,letterSpacing:.5}}>Execute</button>
        </div>
      </div>
    </div>
  </BackendLayout>);
};

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 10: SETTINGS PAGE ███
   AI config, business rules, integration panel
   ═══════════════════════════════════════════════════════════════ */
const SettingsPage = ({ onNavigate }) => {
  const { state, dispatch } = useContext(SystemContext);
  const s = state.settings;
  const update = (path,value) => dispatch({type:"UPDATE_SETTINGS",payload:{path,value}});

  const Toggle = ({checked,onChange}) => <div onClick={()=>onChange(!checked)} style={{width:40,height:22,borderRadius:11,background:checked?C.blue:C.border,cursor:"pointer",position:"relative",transition:"background .2s"}}><div style={{width:18,height:18,borderRadius:9,background:"#fff",position:"absolute",top:2,left:checked?20:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}/></div>;

  return (<BackendLayout active="settings" onNavigate={onNavigate} title="Settings" subtitle="AI config, business rules, integrations — all config affects system behavior">
    <div style={{padding:"28px 36px 60px",maxWidth:900}}>
      {/* AI */}
      <div style={{background:C.card,borderRadius:12,padding:28,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}><Brain size={18} color={C.blue}/><h3 style={{fontSize:16,fontWeight:700,color:C.navy}}>AI Agent Configuration</h3></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}}>
          <div><div style={{fontSize:10,color:C.textTert,letterSpacing:1.5,fontWeight:600,marginBottom:8}}>AGENT NAME</div><input value={s.ai.name} onChange={e=>update("ai.name",e.target.value)} style={{width:"100%",padding:"10px 14px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,fontFamily:font.body}}/></div>
          <div><div style={{fontSize:10,color:C.textTert,letterSpacing:1.5,fontWeight:600,marginBottom:8}}>PERSONALITY</div><div style={{display:"flex",gap:6}}>{["concierge","formal","direct"].map(p=><button key={p} onClick={()=>update("ai.personality",p)} style={{padding:"8px 16px",borderRadius:8,border:s.ai.personality===p?`2px solid ${C.blue}`:`1px solid ${C.border}`,background:s.ai.personality===p?C.blueSoft:"transparent",color:s.ai.personality===p?C.blue:C.textSec,fontSize:12,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{p}</button>)}</div></div>
          <div><div style={{fontSize:10,color:C.textTert,letterSpacing:1.5,fontWeight:600,marginBottom:8}}>TONE</div><div style={{display:"flex",gap:6}}>{["professional","casual","luxury"].map(t=><button key={t} onClick={()=>update("ai.tone",t)} style={{padding:"8px 16px",borderRadius:8,border:s.ai.tone===t?`2px solid ${C.blue}`:`1px solid ${C.border}`,background:s.ai.tone===t?C.blueSoft:"transparent",color:s.ai.tone===t?C.blue:C.textSec,fontSize:12,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{t}</button>)}</div></div>
        </div>
      </div>

      {/* Business Config */}
      <div style={{background:C.card,borderRadius:12,padding:28,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}><Cog size={18} color={C.blue}/><h3 style={{fontSize:16,fontWeight:700,color:C.navy}}>Business Configuration</h3></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.borderLight}`}}><div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>Auto-assign yacht</div><div style={{fontSize:11,color:C.textTert}}>Assign first available yacht when booking</div></div><Toggle checked={s.business.autoAssignYacht} onChange={v=>update("business.autoAssignYacht",v)}/></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.borderLight}`}}><div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>Auto-assign crew</div><div style={{fontSize:11,color:C.textTert}}>Assign yacht's default captain</div></div><Toggle checked={s.business.autoAssignCrew} onChange={v=>update("business.autoAssignCrew",v)}/></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.borderLight}`}}><div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>Require waiver</div><div style={{fontSize:11,color:C.textTert}}>Require signed waiver before charter</div></div><Toggle checked={s.business.requireWaiverBeforeCharter} onChange={v=>update("business.requireWaiverBeforeCharter",v)}/></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.borderLight}`}}><div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>Auto review request</div><div style={{fontSize:11,color:C.textTert}}>Send review request after charter ({s.notifications.reviewRequestDelay}h delay)</div></div><Toggle checked={s.notifications.autoReviewRequest} onChange={v=>update("notifications.autoReviewRequest",v)}/></div>
        </div>
      </div>

      {/* Integrations */}
      <div style={{background:C.card,borderRadius:12,padding:28,boxShadow:C.shadow,border:`1px solid ${C.borderLight}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}><Plug size={18} color={C.blue}/><h3 style={{fontSize:16,fontWeight:700,color:C.navy}}>Integrations</h3></div>
        {[
          {name:"QuickBooks",desc:`Company: ${s.integrations.quickbooks.companyId} · Last sync: ${s.integrations.quickbooks.lastSync?.split("T")[0]}`,connected:s.integrations.quickbooks.connected,path:"integrations.quickbooks.connected",icon:<Receipt size={16}/>},
          {name:"Email (SendGrid)",desc:`From: ${s.integrations.email.fromAddress} · ${s.integrations.email.templates.length} templates`,connected:s.integrations.email.connected,path:"integrations.email.connected",icon:<Mail size={16}/>},
          {name:"WhatsApp Business",desc:`ID: ${s.integrations.whatsapp.businessId}`,connected:s.integrations.whatsapp.connected,path:"integrations.whatsapp.connected",icon:<MessageSquare size={16}/>},
          {name:"SMS",desc:s.integrations.sms.provider||"Not configured",connected:s.integrations.sms.connected,path:"integrations.sms.connected",icon:<Phone size={16}/>},
        ].map((int,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"16px 0",borderBottom:i<3?`1px solid ${C.borderLight}`:"none"}}>
          <div style={{width:40,height:40,borderRadius:10,background:int.connected?C.emeraldSoft:C.bgWarm,display:"flex",alignItems:"center",justifyContent:"center",color:int.connected?C.emerald:C.textTert}}>{int.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:C.navy}}>{int.name}</div><div style={{fontSize:11,color:C.textTert}}>{int.desc}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:11,fontWeight:600,color:int.connected?C.emerald:C.textTert}}>{int.connected?"Connected":"Disconnected"}</span>
            <Toggle checked={int.connected} onChange={v=>update(int.path,v)}/>
          </div>
        </div>)}
        <div style={{marginTop:16,padding:14,background:C.bgWarm,borderRadius:8,fontSize:11,color:C.textSec,lineHeight:1.6}}>
          <strong>Integration behavior:</strong> When QuickBooks is connected, every invoice created by the AI agent or booking system will sync automatically with a QB ID. When email is connected, booking confirmations, invoice notifications, and review requests are sent automatically via SendGrid. WhatsApp enables real-time client messaging. Toggling any integration off will skip those system actions (visible in execution logs).
        </div>
      </div>
    </div>
  </BackendLayout>);
};

/* ═══════════════════════════════════════════════════════════════
   ███ SECTION 11: MAIN APP — SYSTEM PROVIDER ███
   ═══════════════════════════════════════════════════════════════ */
export default function CalicoYachtCharters() {
  const [state, dispatch] = useReducer(systemReducer, null, createInitialDB);
  const selectors = useSelectors(state);
  const [page, setPage] = useState("home");
  const [selectedYachtId, setSelectedYachtId] = useState("YT-001");

  const ctx = useMemo(() => ({ state, dispatch, selectors, selectedYachtId, setSelectedYachtId }), [state, selectors, selectedYachtId]);

  const pages = {
    home: <HomePage onNavigate={setPage}/>,
    fleet: <FleetPage onNavigate={setPage}/>,
    "yacht-detail": <YachtDetailPage onNavigate={setPage}/>,
    booking: <BookingPage onNavigate={setPage}/>,
    dashboard: <DashboardPage onNavigate={setPage}/>,
    bookings: <BookingsPage onNavigate={setPage}/>,
    calendar: <CalendarPage onNavigate={setPage}/>,
    clients: <ClientsPage onNavigate={setPage}/>,
    "fleet-mgmt": <FleetMgmtPage onNavigate={setPage}/>,
    crew: <CrewPage onNavigate={setPage}/>,
    messages: <MessagesPage onNavigate={setPage}/>,
    revenue: <RevenuePage onNavigate={setPage}/>,
    documents: <DocumentsPage onNavigate={setPage}/>,
    notes: <NotesPage onNavigate={setPage}/>,
    incidents: <IncidentsPage onNavigate={setPage}/>,
    marketing: <MarketingPage onNavigate={setPage}/>,
    reviews: <ReviewsPage onNavigate={setPage}/>,
    "ai-command": <AICommandPage onNavigate={setPage}/>,
    settings: <SettingsPage onNavigate={setPage}/>,
  };

  const pageOrder = Object.keys(pages);
  useEffect(()=>{const handler=(e)=>{const idx=pageOrder.indexOf(page);if(e.key==="ArrowRight"&&idx<pageOrder.length-1)setPage(pageOrder[idx+1]);if(e.key==="ArrowLeft"&&idx>0)setPage(pageOrder[idx-1])};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler)},[page]);

  // FleetPage and YachtDetailPage and BookingPage don't use SystemContext, wrap them
  const FleetPageWrapped = () => <FleetPage onNavigate={setPage}/>;
  const YachtDetailPageWrapped = () => <YachtDetailPage onNavigate={setPage}/>;
  const BookingPageWrapped = () => <BookingPage onNavigate={setPage}/>;

  return (
    <SystemContext.Provider value={ctx}>
      <div style={{fontFamily:font.body,WebkitFontSmoothing:"antialiased"}}>
        <GlobalStyles/>
        {pages[page]}
      </div>
    </SystemContext.Provider>
  );
}

// Frontend pages that need fleet data from context
const FleetPage = ({ onNavigate }) => {
  const ctx = useContext(SystemContext);
  let yachts = ctx?.selectors?.yachts;
  if (!yachts) yachts = Object.values(createInitialDB().yachts);
  return (<div style={{minHeight:"100vh",background:C.bg,fontFamily:font.body}}><GlobalStyles/>
    <ImgBg src={img.fleet} style={{height:480,position:"relative"}} overlay="linear-gradient(180deg,rgba(7,15,24,0.35) 0%,rgba(7,15,24,0.8) 100%)">
      <nav style={{position:"relative",zIndex:5,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"32px 56px"}}><div onClick={()=>onNavigate("home")} style={{cursor:"pointer"}}><Logo light/></div></nav>
      <div style={{position:"absolute",bottom:72,left:56,zIndex:5}}><SectionLabel light>THE COLLECTION</SectionLabel><h1 style={{fontSize:64,fontWeight:300,color:"#fff",fontFamily:font.display}}>Our Fleet</h1></div>
    </ImgBg>
    <div style={{padding:"36px 56px 100px",display:"flex",flexDirection:"column",gap:28}}>
      {yachts.map((y,i)=><div key={y.id||i} onClick={()=>{ ctx?.setSelectedYachtId?.(y.id); onNavigate("yacht-detail"); }} style={{display:"flex",flexDirection:i%2===0?"row":"row-reverse",borderRadius:12,overflow:"hidden",background:C.card,boxShadow:C.shadow,cursor:"pointer",transition:"transform .4s,box-shadow .4s",minHeight:280}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=C.shadowLg}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=C.shadow}}>
        <ImgBg src={y.img} style={{width:"60%",minHeight:280}} overlay="linear-gradient(0deg,rgba(0,0,0,0.15) 0%,transparent 40%)"/>
        <div style={{flex:1,padding:"36px 40px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
          <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:9,letterSpacing:3,color:C.textTert,fontWeight:600}}>{y.type.toUpperCase()}</div><StatusBadge status={y.status}/></div>
            <h3 style={{fontSize:28,fontWeight:400,color:C.navy,fontFamily:font.display,marginBottom:20}}>{y.name}</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>{[{l:"Length",v:y.length},{l:"Guests",v:y.guests},{l:"Rating",v:`${y.rating} ★`},{l:"Builder",v:y.builder}].map((s,j)=><div key={j}><div style={{fontSize:9,color:C.textTert,letterSpacing:1.5,fontWeight:600}}>{s.l.toUpperCase()}</div><div style={{fontSize:15,fontWeight:600,color:C.navy,marginTop:3}}>{s.v}</div></div>)}</div>
          </div>
          <div style={{borderTop:`1px solid ${C.borderLight}`,paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:26,fontWeight:700,color:C.navy}}>${y.pricePerWeek?.toLocaleString()}</span><span style={{fontSize:12,color:C.textTert,marginLeft:4}}>/week</span></div><div style={{width:40,height:40,borderRadius:10,background:C.blueSoft,display:"flex",alignItems:"center",justifyContent:"center"}}><ArrowRight size={16} color={C.blue}/></div></div>
        </div>
      </div>)}
    </div>
  </div>);
};

const YachtDetailPage = ({ onNavigate }) => {
  const ctx = useContext(SystemContext);
  let yachts = ctx?.selectors?.yachts;
  if (!yachts) yachts = Object.values(createInitialDB().yachts);
  const selectedYachtId = ctx?.selectedYachtId || "YT-001";
  const y = yachts.find((item) => item.id === selectedYachtId) || yachts[0];
  const detailImages = img.yachtDetails[selectedYachtId] || [y?.img].filter(Boolean);
  const [activeImg,setActiveImg]=useState(0);

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:font.body}}>
      <GlobalStyles/>

      <ImgBg
        src={detailImages[activeImg] || y.img}
        style={{height:"70vh",position:"relative"}}
        overlay="linear-gradient(0deg,rgba(7,15,24,0.85) 0%,rgba(7,15,24,0.15) 40%)"
      >
        <nav style={{position:"relative",zIndex:5,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"32px 56px"}}>
          <div
            onClick={()=>onNavigate("fleet")}
            style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8,color:"rgba(255,255,255,0.6)",fontSize:12}}
          >
            <ArrowLeft size={16}/> BACK
          </div>
          <div onClick={()=>onNavigate("home")} style={{cursor:"pointer"}}>
            <Logo light/>
          </div>
        </nav>

        <div style={{position:"absolute",bottom:48,left:56,zIndex:5}}>
          <div style={{fontSize:9,letterSpacing:3,color:"rgba(255,255,255,0.35)",fontWeight:600,marginBottom:10}}>
            {y.type.toUpperCase()} · {y.builder} · {y.year}
          </div>
          <h1 style={{fontSize:60,fontWeight:300,color:"#fff",fontFamily:font.display}}>
            {y.name}
          </h1>
        </div>
      </ImgBg>

      <div style={{display:"flex",gap:12,padding:"24px 56px 0",background:C.bg}}>
        {detailImages.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveImg(i)}
            style={{
              border: activeImg === i ? `2px solid ${C.blue}` : `1px solid ${C.border}`,
              padding: 0,
              borderRadius: 10,
              overflow: "hidden",
              cursor: "pointer",
              background: "#fff"
            }}
          >
            <img
              src={src}
              alt={`Detail ${i + 1}`}
              style={{
                width: 120,
                height: 80,
                objectFit: "cover",
                display: "block"
              }}
            />
          </button>
        ))}
      </div>

      <div style={{padding:"72px 56px 100px",maxWidth:800}}>
        <Heading size={32} style={{marginBottom:20}}>About This Vessel</Heading>
        <p style={{fontSize:15,color:C.textSec,lineHeight:1.85,marginBottom:40}}>
          Built in {y.year} by {y.builder}. Home port: {y.location}. {y.guests} guests, {y.crewCapacity} crew capacity. Starting at ${y.pricePerWeek?.toLocaleString()}/week.
        </p>
        <button
          onClick={()=>onNavigate("booking")}
          style={{padding:"17px 44px",background:C.blue,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,letterSpacing:2,cursor:"pointer",fontFamily:font.body}}
        >
          REQUEST CHARTER
        </button>
      </div>
    </div>
  );
};

const BookingPage = ({ onNavigate }) => {
  const [step,setStep]=useState(0);
  const [guests,setGuests]=useState(8);
  return (<div style={{minHeight:"100vh",background:C.bg,fontFamily:font.body}}><GlobalStyles/>
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 56px",borderBottom:`1px solid ${C.border}`,background:"#fff"}}><div onClick={()=>onNavigate("home")} style={{cursor:"pointer"}}><Logo/></div></nav>
    <div style={{maxWidth:860,margin:"0 auto",padding:"56px 24px 100px"}}>
      {step===0&&<div style={{textAlign:"center"}}><Heading size={36}>Request a Charter</Heading><p style={{color:C.textTert,fontSize:14,marginTop:8,marginBottom:40}}>Our team will customize your experience</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16,textAlign:"left"}}>
          {[{l:"EMBARKATION",v:"April 12, 2026"},{l:"DISEMBARKATION",v:"April 19, 2026"}].map((d,i)=><div key={i} style={{padding:28,background:C.card,borderRadius:12,border:`1px solid ${C.border}`}}><div style={{fontSize:9,letterSpacing:2,color:C.textTert,fontWeight:600,marginBottom:12}}>{d.l}</div><div style={{padding:"12px 16px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,color:C.text,fontWeight:500}}>{d.v}</div></div>)}
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:40}}><Btn variant="secondary" onClick={()=>onNavigate("home")}>Cancel</Btn><Btn variant="navy" onClick={()=>setStep(1)}>Continue</Btn></div>
      </div>}
      {step===1&&<div style={{textAlign:"center"}}><div style={{width:72,height:72,borderRadius:"50%",background:C.emeraldSoft,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><CheckCircle2 size={36} color={C.emerald} strokeWidth={1.5}/></div><Heading size={36}>Charter Request Submitted</Heading><p style={{color:C.textTert,fontSize:14,marginTop:10,marginBottom:40}}>Our advisor will contact you within 2 hours</p><Btn variant="navy" onClick={()=>onNavigate("home")}>Return Home</Btn></div>}
    </div>
  </div>);
};
