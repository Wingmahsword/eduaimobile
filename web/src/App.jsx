import { useState, useRef, useEffect } from "react";
import {
  Search, Play, Pause, ChevronRight, ChevronLeft, Home, BookOpen,
  User, Bell, Bookmark, BookmarkCheck, Clock, Star, Award,
  TrendingUp, Sparkles, Code2, Palette, Briefcase, Camera,
  PenTool, BarChart3, Volume2, VolumeX, Maximize2, SkipBack, SkipForward,
  Check, Lock, Flame, Trophy, Target, Settings, ArrowRight,
  Heart, Share2, Download, X, Plus, Zap, Send,
  Film, Wand2, Mic, Lightbulb, GraduationCap, Compass, Layers, Globe, ChevronDown,
  MessageCircle, Eye, ThumbsUp, RotateCcw, Brain,
  Music2, MoreVertical, BadgeCheck, Camera as CameraIcon
} from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "all",      label: "All",      icon: Sparkles,  color: "#FF6B9D", tint: "rgba(255,107,157,0.12)" },
  { id: "code",     label: "Coding",   icon: Code2,     color: "#5B8DEF", tint: "rgba(91,141,239,0.12)"  },
  { id: "design",   label: "Design",   icon: Palette,   color: "#E879A6", tint: "rgba(232,121,166,0.12)" },
  { id: "business", label: "Business", icon: Briefcase, color: "#5BB89A", tint: "rgba(91,184,154,0.12)"  },
  { id: "photo",    label: "Photo",    icon: Camera,    color: "#9F8AE8", tint: "rgba(159,138,232,0.12)" },
  { id: "writing",  label: "Writing",  icon: PenTool,   color: "#E5A24E", tint: "rgba(229,162,78,0.12)"  },
  { id: "data",     label: "Data",     icon: BarChart3, color: "#5BB3A5", tint: "rgba(91,179,165,0.12)"  },
];

const COURSES = [
  {
    id: 1, cat: "code",
    title: "Modern React & Next.js 14",
    instructor: "Aanya Mehra", instructorRole: "Staff Eng @ Stripe",
    rating: 4.9, students: 24800, duration: "12h 40m", lessons: 48, level: "Intermediate",
    price: "₹2,499", originalPrice: "₹4,999",
    gradient: "linear-gradient(135deg,#A8C5F2 0%,#C9A8F2 50%,#F2A8C5 100%)",
    accent: "#7B7CF0", accentSoft: "#B8B9F5",
    desc: "Build production-grade React apps with hooks, server components, and Next.js 14. Hands-on projects from auth to deployment.",
    skills: ["React 18", "Next.js 14", "Server Components", "TypeScript", "Tailwind"],
    chapters: [
      { title: "Foundations", lessons: ["Why React still wins in 2026", "JSX, components, props in depth", "State, effects & the mental model"] },
      { title: "Advanced Patterns", lessons: ["Custom hooks that scale", "Context vs Zustand vs Redux", "Suspense & concurrent UI"] },
      { title: "Next.js Production", lessons: ["App router & server components", "Auth, middleware & edge", "Deploy to Vercel like a pro"] },
    ],
    featured: true,
  },
  {
    id: 2, cat: "design",
    title: "Product Design Mastery",
    instructor: "Liam Park", instructorRole: "Design Lead @ Linear",
    rating: 4.8, students: 18200, duration: "9h 15m", lessons: 36, level: "All levels",
    price: "₹1,999", originalPrice: "₹3,999",
    gradient: "linear-gradient(135deg,#FFB8C8 0%,#FFC9D9 50%,#FFE0E8 100%)",
    accent: "#E5739B", accentSoft: "#F5B8C9",
    desc: "From research to handoff. Master Figma, design systems, and the craft of shipping interfaces people love.",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    chapters: [
      { title: "Visual Foundations", lessons: ["Type, color & hierarchy", "Layout & composition", "Building a system"] },
      { title: "Interaction Craft", lessons: ["Microinteractions that matter", "Prototyping in Figma", "Motion principles"] },
    ],
    featured: true,
  },
  {
    id: 3, cat: "business",
    title: "Startup Fundraising 101",
    instructor: "Priya Iyer", instructorRole: "Partner @ Sequoia India",
    rating: 4.7, students: 9400, duration: "6h 50m", lessons: 22, level: "Beginner",
    price: "₹1,499", originalPrice: "₹2,999",
    gradient: "linear-gradient(135deg,#C8E6B8 0%,#A8DDC0 50%,#88D4C8 100%)",
    accent: "#4FA876", accentSoft: "#A8DDB8",
    desc: "Pitch decks, term sheets, valuations. Real teardowns from founders who raised $1M–$50M.",
    skills: ["Pitch Decks", "Valuation", "Term Sheets", "Investor Relations"],
    chapters: [{ title: "The Pitch", lessons: ["Storytelling for founders", "The 10-slide deck", "Practice runs"] }],
  },
  {
    id: 4, cat: "code",
    title: "Python for Data & ML",
    instructor: "Rohan Das", instructorRole: "ML Engineer @ Google",
    rating: 4.9, students: 31200, duration: "15h 20m", lessons: 62, level: "Beginner",
    price: "₹2,799", originalPrice: "₹5,499",
    gradient: "linear-gradient(135deg,#B8D4F0 0%,#A8E0E6 50%,#A8E6D4 100%)",
    accent: "#4DA1B8", accentSoft: "#B8DDE0",
    desc: "Pandas, NumPy, scikit-learn, and PyTorch. Build real ML pipelines, not toy notebooks.",
    skills: ["Python", "Pandas", "PyTorch", "scikit-learn"],
    chapters: [{ title: "Python Core", lessons: ["Setup & syntax", "Data structures", "Functions & modules"] }],
    featured: true,
  },
  {
    id: 5, cat: "photo",
    title: "iPhone Photography",
    instructor: "Sara Khan", instructorRole: "Editorial Photographer",
    rating: 4.8, students: 7800, duration: "4h 30m", lessons: 18, level: "All levels",
    price: "₹999", originalPrice: "₹1,999",
    gradient: "linear-gradient(135deg,#E0D4F7 0%,#D8C8F0 50%,#F4C4E8 100%)",
    accent: "#9879D0", accentSoft: "#C9B8E5",
    desc: "Take editorial-grade photos with the camera in your pocket. Composition, light, and post-processing.",
    skills: ["Composition", "Lightroom Mobile", "Color Grading"],
    chapters: [{ title: "Seeing Light", lessons: ["The golden hour", "Reading shadows", "Indoor light"] }],
  },
  {
    id: 6, cat: "writing",
    title: "Writing That Sells",
    instructor: "Maya Sloan", instructorRole: "Brand Writer",
    rating: 4.6, students: 5600, duration: "3h 45m", lessons: 14, level: "Beginner",
    price: "₹799", originalPrice: "₹1,799",
    gradient: "linear-gradient(135deg,#FFE4B8 0%,#FFD8A8 50%,#FFC8B0 100%)",
    accent: "#D9803E", accentSoft: "#F0C896",
    desc: "Headlines, hooks, and landing copy that convert. Frameworks used by Apple, Stripe, and Notion.",
    skills: ["Copywriting", "Brand Voice", "Landing Pages"],
    chapters: [{ title: "Hooks", lessons: ["The 3-second test", "Headline formulas", "Rewriting clichés"] }],
  },
  {
    id: 7, cat: "data",
    title: "SQL for Analysts",
    instructor: "Devon Walsh", instructorRole: "Analytics @ Notion",
    rating: 4.7, students: 11300, duration: "7h 10m", lessons: 28, level: "Intermediate",
    price: "₹1,799", originalPrice: "₹3,499",
    gradient: "linear-gradient(135deg,#A8E0D4 0%,#A8E6D4 50%,#C8E6C0 100%)",
    accent: "#3FA088", accentSoft: "#A8DDC9",
    desc: "Stop being scared of joins. Window functions, CTEs, query optimization — taught with real datasets.",
    skills: ["SQL", "PostgreSQL", "Window Functions"],
    chapters: [{ title: "Foundations", lessons: ["SELECT in depth", "Joins demystified", "Aggregation"] }],
  },
  {
    id: 8, cat: "design",
    title: "Motion for Interfaces",
    instructor: "Noor Ali", instructorRole: "Motion Designer @ Apple",
    rating: 4.9, students: 6200, duration: "5h 30m", lessons: 20, level: "Intermediate",
    price: "₹1,699", originalPrice: "₹3,299",
    gradient: "linear-gradient(135deg,#F4C4D4 0%,#E8B8E0 50%,#D4B8F0 100%)",
    accent: "#B66ABA", accentSoft: "#E0B8D0",
    desc: "Easing, choreography, spring physics. Make interfaces feel alive with Framer Motion and CSS.",
    skills: ["Framer Motion", "CSS Animation", "Choreography"],
    chapters: [{ title: "Principles", lessons: ["Easing curves", "Timing & duration", "Stagger & sequence"] }],
  },
];

const REELS = [
  { id: "r1", title: "1 useEffect mistake everyone makes", creator: "aanya.codes", displayName: "Aanya Mehra", verified: true, topic: "React",
    likes: 12400, comments: 287, shares: 1820, views: 184000,
    gradient: "linear-gradient(180deg,#7B7CF0 0%,#5B5DE8 60%,#2A2F8F 100%)",
    avatarGradient: "linear-gradient(135deg,#7B7CF0,#5B5DE8)", accent: "#7B7CF0",
    caption: "If you're putting fetch inside useEffect with no deps array, this one is for you 👀",
    hashtags: ["#react", "#javascript", "#webdev"], song: "Original audio · aanya.codes" },
  { id: "r2", title: "Figma auto-layout in 60s", creator: "liam.designs", displayName: "Liam Park", verified: true, topic: "Design",
    likes: 8900, comments: 142, shares: 612, views: 96400,
    gradient: "linear-gradient(180deg,#E5739B 0%,#D45580 60%,#7A1F4F 100%)",
    avatarGradient: "linear-gradient(135deg,#E5739B,#D45580)", accent: "#E5739B",
    caption: "Stop nudging pixels. Master auto-layout once and your prototypes get 10x faster.",
    hashtags: ["#figma", "#design", "#ui"], song: "Lo-fi beats · @studio.tape" },
  { id: "r3", title: "The pandas trick that saved my job", creator: "rohan.ml", displayName: "Rohan Das", verified: true, topic: "Python",
    likes: 21200, comments: 489, shares: 3104, views: 412000,
    gradient: "linear-gradient(180deg,#4DA1B8 0%,#2D7D9A 60%,#103C4F 100%)",
    avatarGradient: "linear-gradient(135deg,#4DA1B8,#2D7D9A)", accent: "#4DA1B8",
    caption: "groupby + agg + reset_index. Three lines of code, hours saved every week.",
    hashtags: ["#python", "#pandas", "#dataanalysis"], song: "Original audio · rohan.ml" },
  { id: "r4", title: "Why your pitch deck flops", creator: "priya.fund", displayName: "Priya Iyer", verified: false, topic: "Startup",
    likes: 5400, comments: 92, shares: 488, views: 62300,
    gradient: "linear-gradient(180deg,#4FA876 0%,#2D8855 60%,#0F4528 100%)",
    avatarGradient: "linear-gradient(135deg,#4FA876,#2D8855)", accent: "#4FA876",
    caption: "Slide 3 is where every founder loses the room. Here's what to put there instead.",
    hashtags: ["#startup", "#fundraising", "#founder"], song: "Boardroom Beat · @synth.lab" },
  { id: "r5", title: "Color theory in 30 seconds", creator: "noor.motion", displayName: "Noor Ali", verified: true, topic: "Design",
    likes: 14800, comments: 326, shares: 1247, views: 218500,
    gradient: "linear-gradient(180deg,#B66ABA 0%,#9444A0 60%,#4A1F55 100%)",
    avatarGradient: "linear-gradient(135deg,#B66ABA,#9444A0)", accent: "#B66ABA",
    caption: "Triadic, analogous, complementary — pick one, ship faster, look more pro.",
    hashtags: ["#colortheory", "#design", "#tutorial"], song: "Pastel Dreams · @melodic.kid" },
];

const AI_SUGGESTIONS = [
  { icon: Lightbulb,     label: "Explain a concept",       prompt: "Explain async/await in JavaScript like I'm 5",      color: "#FFB547" },
  { icon: Wand2,         label: "Generate a quiz",          prompt: "Make me a 5-question quiz on React hooks",            color: "#9F8AE8" },
  { icon: GraduationCap, label: "Plan my learning",         prompt: "Plan a 30-day roadmap to learn data analysis",        color: "#5B8DEF" },
  { icon: Brain,         label: "Solve this for me",        prompt: "Help me debug why my useEffect runs infinitely",      color: "#E879A6" },
  { icon: Compass,       label: "What should I learn next?",prompt: "I know HTML/CSS/JS basics. What's next?",             color: "#5BB89A" },
  { icon: Layers,        label: "Compare two things",       prompt: "Next.js vs Remix in 2026 — which should I pick?",    color: "#E5A24E" },
];

const ENROLLED_IDS = [1, 4];
const PROGRESS = { 1: 0.34, 4: 0.12 };

/* ─── PRIMITIVES ────────────────────────────────────────────────────────────── */
const Glass = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    background: "rgba(255,255,255,0.62)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.85)",
    boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 24px -12px rgba(60,40,90,0.18)",
    ...style,
  }}>{children}</div>
);

const Pill = ({ active, onClick, icon: Icon, label, color, tint }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "9px 14px", borderRadius: 999,
    background: active ? color : tint,
    color: active ? "#fff" : "#3a2f4a",
    border: active ? "none" : "1px solid rgba(255,255,255,0.7)",
    fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", cursor: "pointer",
    transition: "all 220ms cubic-bezier(.34,1.56,.64,1)",
    boxShadow: active ? `0 6px 18px -6px ${color}88, 0 0 0 4px ${color}1f` : "0 1px 0 rgba(255,255,255,0.8) inset",
    transform: active ? "scale(1.04)" : "scale(1)",
  }}>
    {Icon && <Icon size={14} strokeWidth={2.4} />}{label}
  </button>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
    <div>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.4, fontFamily: "'Fraunces', Georgia, serif" }}>{title}</h3>
      {subtitle && <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#8a7d9c" }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

/* ─── HOME ──────────────────────────────────────────────────────────────────── */
function HomeScreen({ go, query, setQuery, cat, setCat, saved, toggleSave }) {
  const filtered = COURSES.filter(c =>
    (cat === "all" || c.cat === cat) &&
    (query === "" || c.title.toLowerCase().includes(query.toLowerCase()) || c.instructor.toLowerCase().includes(query.toLowerCase()))
  );
  const featured = COURSES.filter(c => c.featured);
  const enrolled = COURSES.filter(c => ENROLLED_IDS.includes(c.id));

  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: "20px 22px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div className="fade-up">
            <p style={{ fontSize: 13, color: "#8a7d9c", margin: 0, fontWeight: 500 }}>Good morning ☀️</p>
            <h1 style={{ margin: "2px 0 0", fontSize: 26, fontWeight: 700, letterSpacing: -0.8, color: "#2a1f3d", fontFamily: "'Fraunces', Georgia, serif" }}>
              Hi, Aarav <span style={{ display: "inline-block" }}>👋</span>
            </h1>
          </div>
          <Glass style={{ width: 42, height: 42, borderRadius: 14, display: "grid", placeItems: "center", cursor: "pointer", position: "relative" }}>
            <Bell size={18} strokeWidth={2} color="#5a4a72" />
            <span style={{ position: "absolute", top: 9, right: 10, width: 7, height: 7, borderRadius: "50%", background: "#FF6B9D", boxShadow: "0 0 0 2px rgba(255,255,255,0.9)" }} />
          </Glass>
        </div>
        {/* Search */}
        <Glass style={{ borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <Search size={17} color="#8a7d9c" strokeWidth={2.2} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search courses, reels, instructors..."
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14, color: "#2a1f3d", fontFamily: "inherit" }} />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 20, height: 20, display: "grid", placeItems: "center", cursor: "pointer" }}>
              <X size={12} color="#5a4a72" strokeWidth={2.5} />
            </button>
          )}
        </Glass>
      </div>

      {/* AI Playground CTA */}
      <div style={{ padding: "0 22px 14px" }}>
        <button onClick={() => go({ name: "ai" })} style={{ width: "100%", border: "none", padding: 0, background: "transparent", cursor: "pointer", borderRadius: 24 }}>
          <div style={{
            borderRadius: 24, padding: "16px 18px",
            background: "linear-gradient(120deg,#7B7CF0 0%,#B66ABA 50%,#E5739B 100%)",
            boxShadow: "0 16px 40px -12px rgba(123,124,240,0.5)",
            display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.18) 50%,transparent 70%)", animation: "shimmer 3s ease-in-out infinite" }} />
            <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Wand2 size={22} color="#fff" strokeWidth={2.2} />
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: 1 }}>AI Playground</span>
                <span style={{ padding: "2px 7px", borderRadius: 6, background: "rgba(255,255,255,0.25)", fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>LIVE</span>
              </div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: -0.3, fontFamily: "'Fraunces', serif" }}>Ask, learn, generate — instantly</p>
            </div>
            <ArrowRight size={20} color="#fff" strokeWidth={2.4} />
          </div>
        </button>
      </div>

      {/* Streak */}
      <div style={{ padding: "0 22px 18px" }}>
        <Glass style={{ borderRadius: 22, padding: 16, background: "linear-gradient(135deg,rgba(255,180,160,0.5) 0%,rgba(255,160,200,0.5) 100%)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: 15, background: "linear-gradient(135deg,#FF9F7F,#FF5B8A)", display: "grid", placeItems: "center", boxShadow: "0 8px 20px -8px rgba(255,91,138,0.6)", animation: "flameGlow 2.4s ease-in-out infinite" }}>
            <Flame size={24} color="#fff" strokeWidth={2.4} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.5, fontFamily: "'Fraunces', serif" }}>12</span>
              <span style={{ fontSize: 13, color: "#5a4a72", fontWeight: 600 }}>day streak</span>
            </div>
            <p style={{ margin: "1px 0 0", fontSize: 12, color: "#6e5d85" }}>20 mins today keeps it alive</p>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[1,1,1,1,1,1,0].map((d,i) => (
              <div key={i} style={{ width: 6, height: 22, borderRadius: 3, background: d ? "linear-gradient(180deg,#FF9F7F,#FF5B8A)" : "rgba(255,255,255,0.7)" }} />
            ))}
          </div>
        </Glass>
      </div>

      {/* Categories */}
      <div style={{ padding: "0 22px 6px" }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 14, scrollbarWidth: "none" }}>
          {CATEGORIES.map(c => <Pill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} icon={c.icon} label={c.label} color={c.color} tint={c.tint} />)}
        </div>
      </div>

      {/* Reels rail */}
      {cat === "all" && query === "" && (
        <div style={{ padding: "8px 0 0" }}>
          <div style={{ padding: "0 22px" }}>
            <SectionHeader title="Trending reels" subtitle="60-sec skill bites"
              action={<button onClick={() => go({ name: "reels" })} style={{ background: "transparent", border: "none", color: "#7B7CF0", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }}>See all <ChevronRight size={14} /></button>}
            />
          </div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 22px 8px", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
            {REELS.map(r => (
              <button key={r.id} onClick={() => go({ name: "reels", id: r.id })} style={{
                flexShrink: 0, width: 140, height: 220, borderRadius: 20, background: r.gradient,
                border: "none", padding: 14, cursor: "pointer", position: "relative", overflow: "hidden",
                scrollSnapAlign: "start", boxShadow: `0 14px 30px -12px ${r.accent}88`, textAlign: "left"
              }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%,rgba(255,255,255,0.18),transparent 60%)" }} />
                <div style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: 10, background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)", display: "grid", placeItems: "center" }}>
                  <Play size={11} color="#fff" fill="#fff" strokeWidth={0} style={{ marginLeft: 1 }} />
                </div>
                <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                  <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 6, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)", fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{r.topic}</span>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.25, letterSpacing: -0.2, textShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>{r.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Continue learning */}
      {enrolled.length > 0 && cat === "all" && query === "" && (
        <div style={{ padding: "20px 22px 0" }}>
          <SectionHeader title="Continue learning" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {enrolled.map(c => (
              <Glass key={c.id} onClick={() => go({ name: "course", id: c.id })} style={{ borderRadius: 22, padding: 14, display: "flex", gap: 14, cursor: "pointer", alignItems: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: c.gradient, display: "grid", placeItems: "center", flexShrink: 0, boxShadow: `0 8px 20px -10px ${c.accent}aa` }}>
                  <Play size={22} color="#fff" fill="#fff" strokeWidth={0} style={{ marginLeft: 2 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 11, color: c.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>{CATEGORIES.find(x => x.id === c.cat)?.label}</p>
                  <h4 style={{ margin: "2px 0 8px", fontSize: 14.5, fontWeight: 600, color: "#2a1f3d", letterSpacing: -0.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</h4>
                  <div style={{ height: 5, background: "rgba(0,0,0,0.06)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${PROGRESS[c.id]*100}%`, height: "100%", background: `linear-gradient(90deg,${c.accent},${c.accent}cc)`, borderRadius: 999 }} />
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "#8a7d9c" }}>{Math.round(PROGRESS[c.id] * c.lessons)} of {c.lessons} lessons</p>
                </div>
              </Glass>
            ))}
          </div>
        </div>
      )}

      {/* Featured */}
      {cat === "all" && query === "" && (
        <div style={{ padding: "26px 0 0" }}>
          <div style={{ padding: "0 22px" }}><SectionHeader title="Featured this week" subtitle="Hand-picked by our team" /></div>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "0 22px 8px", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
            {featured.map(c => (
              <FeatureCard key={c.id} course={c} onClick={() => go({ name: "course", id: c.id })} saved={saved.includes(c.id)} toggleSave={e => { e.stopPropagation(); toggleSave(c.id); }} />
            ))}
          </div>
        </div>
      )}

      {/* All courses */}
      <div style={{ padding: "26px 22px 0" }}>
        <SectionHeader title={cat === "all" && !query ? "Popular right now" : `${filtered.length} ${filtered.length === 1 ? "course" : "courses"}`} />
        {filtered.length === 0
          ? <Glass style={{ borderRadius: 20, padding: 32, textAlign: "center" }}><p style={{ margin: 0, color: "#5a4a72", fontSize: 14 }}>No courses match. Try another search.</p></Glass>
          : <div style={{ display: "grid", gap: 14 }}>{filtered.map(c => <CourseRow key={c.id} course={c} onClick={() => go({ name: "course", id: c.id })} saved={saved.includes(c.id)} toggleSave={e => { e.stopPropagation(); toggleSave(c.id); }} />)}</div>
        }
      </div>
    </div>
  );
}

const FeatureCard = ({ course: c, onClick, saved, toggleSave }) => (
  <div onClick={onClick} style={{ flex: "0 0 78%", maxWidth: 340, scrollSnapAlign: "start", borderRadius: 26, overflow: "hidden", cursor: "pointer", position: "relative", background: c.gradient, height: 220, boxShadow: `0 18px 42px -16px ${c.accent}aa` }}>
    <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.35)", filter: "blur(30px)" }} />
    <button onClick={toggleSave} style={{ position: "absolute", top: 14, right: 14, width: 36, height: 36, borderRadius: 12, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)", display: "grid", placeItems: "center", cursor: "pointer", zIndex: 2 }}>
      {saved ? <BookmarkCheck size={16} color={c.accent} strokeWidth={2.4} fill={c.accent} /> : <Bookmark size={16} color="#3a2f4a" strokeWidth={2.2} />}
    </button>
    <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <span style={{ display: "inline-block", padding: "5px 11px", borderRadius: 999, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", fontSize: 10.5, fontWeight: 700, color: "#3a2f4a", letterSpacing: 0.4, textTransform: "uppercase" }}>✨ Featured</span>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(58,47,74,0.75)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>{CATEGORIES.find(x => x.id === c.cat)?.label}</p>
        <h3 style={{ margin: "4px 0 8px", fontSize: 22, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.5, lineHeight: 1.15, fontFamily: "'Fraunces', Georgia, serif" }}>{c.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#3a2f4a", fontWeight: 500 }}>
          <span>{c.instructor}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#3a2f4a", opacity: 0.4 }} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Star size={11} fill="#3a2f4a" strokeWidth={0} /> {c.rating}</span>
        </div>
      </div>
    </div>
  </div>
);

const CourseRow = ({ course: c, onClick, saved, toggleSave }) => (
  <Glass onClick={onClick} style={{ borderRadius: 22, padding: 14, display: "flex", gap: 14, cursor: "pointer", alignItems: "stretch" }}>
    <div style={{ width: 90, height: 90, borderRadius: 16, background: c.gradient, flexShrink: 0, position: "relative", overflow: "hidden", boxShadow: `0 8px 18px -8px ${c.accent}77` }}>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <Play size={22} color="#fff" fill="#fff" strokeWidth={0} style={{ marginLeft: 2 }} />
      </div>
    </div>
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 10.5, color: c.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>{CATEGORIES.find(x => x.id === c.cat)?.label}</p>
          <button onClick={toggleSave} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", marginTop: -2 }}>
            {saved ? <BookmarkCheck size={16} color={c.accent} strokeWidth={2.4} fill={c.accent} /> : <Bookmark size={16} color="#a89bbf" strokeWidth={2} />}
          </button>
        </div>
        <h4 style={{ margin: "3px 0 4px", fontSize: 15, fontWeight: 600, color: "#2a1f3d", letterSpacing: -0.2, lineHeight: 1.25 }}>{c.title}</h4>
        <p style={{ margin: 0, fontSize: 12, color: "#8a7d9c" }}>{c.instructor}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, color: "#5a4a72", fontWeight: 500 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Star size={11} fill="#FFB547" strokeWidth={0} /> {c.rating}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Clock size={11} strokeWidth={2.2} /> {c.duration}</span>
        <span style={{ marginLeft: "auto", color: c.accent, fontWeight: 700 }}>{c.price}</span>
      </div>
    </div>
  </Glass>
);

/* ─── COURSE DETAIL ─────────────────────────────────────────────────────────── */
function CourseDetail({ course: c, go, saved, toggleSave }) {
  const [openChapter, setOpenChapter] = useState(0);
  const enrolled = ENROLLED_IDS.includes(c.id);
  const progress = PROGRESS[c.id] || 0;

  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 130 }}>
      <div style={{ position: "relative", height: 300, background: c.gradient, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.3)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
          <button onClick={() => go({ name: "home" })} style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.7)", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <ChevronLeft size={20} color="#3a2f4a" strokeWidth={2.4} />
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => toggleSave(c.id)} style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.7)", display: "grid", placeItems: "center", cursor: "pointer" }}>
              {saved ? <BookmarkCheck size={17} color={c.accent} fill={c.accent} strokeWidth={2.4} /> : <Bookmark size={17} color="#3a2f4a" strokeWidth={2.2} />}
            </button>
            <button style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.7)", display: "grid", placeItems: "center", cursor: "pointer" }}>
              <Share2 size={17} color="#3a2f4a" strokeWidth={2.2} />
            </button>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
          <span style={{ display: "inline-block", padding: "5px 11px", borderRadius: 999, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", fontSize: 10.5, fontWeight: 700, color: "#3a2f4a", letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 12 }}>{CATEGORIES.find(x => x.id === c.cat)?.label} · {c.level}</span>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.8, lineHeight: 1.12, fontFamily: "'Fraunces', Georgia, serif" }}>{c.title}</h1>
        </div>
      </div>

      <div style={{ padding: "20px 22px 0" }}>
        <Glass style={{ borderRadius: 20, padding: "14px 6px", display: "flex", justifyContent: "space-around" }}>
          {[
            { icon: Star, label: c.rating, sub: `(${(c.students/1000).toFixed(1)}k)`, color: "#FFB547", filled: true },
            { icon: Clock, label: c.duration, sub: "total", color: c.accent },
            { icon: BookOpen, label: c.lessons, sub: "lessons", color: c.accent },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", flex: 1, position: "relative" }}>
              {i > 0 && <div style={{ position: "absolute", left: 0, top: "20%", height: "60%", width: 1, background: "rgba(0,0,0,0.06)" }} />}
              <s.icon size={15} color={s.color} strokeWidth={2.2} fill={s.filled ? s.color : "none"} />
              <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.2 }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 10.5, color: "#8a7d9c" }}>{s.sub}</p>
            </div>
          ))}
        </Glass>
      </div>

      <div style={{ padding: "18px 22px 0" }}>
        <Glass style={{ borderRadius: 20, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: c.gradient, display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "'Fraunces', serif" }}>
            {c.instructor.split(" ").map(n => n[0]).join("")}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#2a1f3d", letterSpacing: -0.2 }}>{c.instructor}</p>
            <p style={{ margin: "1px 0 0", fontSize: 12, color: "#8a7d9c" }}>{c.instructorRole}</p>
          </div>
          <button style={{ padding: "7px 13px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: c.accent, border: "none", color: "#fff", cursor: "pointer" }}>Follow</button>
        </Glass>
      </div>

      <div style={{ padding: "22px 22px 0" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.3, fontFamily: "'Fraunces', Georgia, serif" }}>About this course</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "#5a4a72" }}>{c.desc}</p>
      </div>

      <div style={{ padding: "20px 22px 0" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.3, fontFamily: "'Fraunces', Georgia, serif" }}>What you'll learn</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {c.skills.map(s => <span key={s} style={{ padding: "8px 13px", borderRadius: 12, background: `${c.accent}1a`, color: c.accent, fontWeight: 600, fontSize: 12.5, border: `1px solid ${c.accent}26` }}>{s}</span>)}
        </div>
      </div>

      <div style={{ padding: "26px 22px 0" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.3, fontFamily: "'Fraunces', Georgia, serif" }}>Curriculum</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {c.chapters.map((ch, ci) => (
            <Glass key={ci} style={{ borderRadius: 18, overflow: "hidden" }}>
              <button onClick={() => setOpenChapter(openChapter === ci ? -1 : ci)} style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: `${c.accent}1f`, color: c.accent, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{ci + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#2a1f3d", letterSpacing: -0.2 }}>{ch.title}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#8a7d9c" }}>{ch.lessons.length} lessons</p>
                </div>
                <ChevronRight size={17} color="#a89bbf" strokeWidth={2.2} style={{ transition: "transform 250ms", transform: openChapter === ci ? "rotate(90deg)" : "none" }} />
              </button>
              {openChapter === ci && (
                <div style={{ padding: "0 16px 12px" }}>
                  {ch.lessons.map((lesson, li) => {
                    const completed = enrolled && (ci * 4 + li) < (c.lessons * progress);
                    const locked = !enrolled && (ci > 0 || li > 0);
                    return (
                      <button key={li} onClick={() => !locked && go({ name: "player", id: c.id, chapter: ci, lesson: li })} disabled={locked}
                        style={{ width: "100%", padding: "10px 8px", display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", cursor: locked ? "not-allowed" : "pointer", textAlign: "left", opacity: locked ? 0.5 : 1 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 8, background: completed ? c.accent : `${c.accent}14`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                          {completed ? <Check size={14} color="#fff" strokeWidth={3} /> : locked ? <Lock size={11} color={c.accent} strokeWidth={2.2} /> : <Play size={10} color={c.accent} fill={c.accent} strokeWidth={0} style={{ marginLeft: 1 }} />}
                        </div>
                        <span style={{ flex: 1, fontSize: 13, color: "#3a2f4a", fontWeight: 500 }}>{lesson}</span>
                        <span style={{ fontSize: 11, color: "#a89bbf" }}>8:32</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </Glass>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, padding: "14px 22px", background: "linear-gradient(to top,rgba(247,243,253,1) 60%,rgba(247,243,253,0))", zIndex: 50 }}>
        <Glass style={{ borderRadius: 22, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#8a7d9c", textDecoration: "line-through", fontWeight: 500 }}>{c.originalPrice}</p>
            <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.4, fontFamily: "'Fraunces', serif" }}>{c.price}</p>
          </div>
          <button onClick={() => go({ name: "player", id: c.id, chapter: 0, lesson: 0 })}
            style={{ flex: 1, padding: "14px 18px", borderRadius: 16, border: "none", background: `linear-gradient(135deg,${c.accent},${c.accent}dd)`, color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: -0.2, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: `0 10px 26px -10px ${c.accent}` }}>
            {enrolled ? "Continue learning" : "Enroll & start"}<ArrowRight size={16} strokeWidth={2.4} />
          </button>
        </Glass>
      </div>
    </div>
  );
}

/* ─── PLAYER ────────────────────────────────────────────────────────────────── */
function PlayerScreen({ course: c, chapterIdx, lessonIdx, go }) {
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(124);
  const [duration] = useState(512);
  const [showControls, setShowControls] = useState(true);
  const [tab, setTab] = useState("overview");
  const ch = c.chapters[chapterIdx];
  const lesson = ch.lessons[lessonIdx];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setCurrentTime(ct => Math.min(ct + 1, duration)), 1000);
    return () => clearInterval(t);
  }, [playing, duration]);

  useEffect(() => {
    if (!showControls) return;
    const t = setTimeout(() => setShowControls(false), 3500);
    return () => clearTimeout(t);
  }, [showControls, currentTime]);

  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const pct = (currentTime / duration) * 100;

  const nextLesson = () => {
    if (lessonIdx < ch.lessons.length - 1) go({ name: "player", id: c.id, chapter: chapterIdx, lesson: lessonIdx + 1 });
    else if (chapterIdx < c.chapters.length - 1) go({ name: "player", id: c.id, chapter: chapterIdx + 1, lesson: 0 });
  };
  const prevLesson = () => {
    if (lessonIdx > 0) go({ name: "player", id: c.id, chapter: chapterIdx, lesson: lessonIdx - 1 });
    else if (chapterIdx > 0) { const pc = c.chapters[chapterIdx - 1]; go({ name: "player", id: c.id, chapter: chapterIdx - 1, lesson: pc.lessons.length - 1 }); }
  };

  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 40 }}>
      <div onClick={() => setShowControls(s => !s)} style={{ position: "relative", width: "100%", aspectRatio: "16/10", background: c.gradient, overflow: "hidden", cursor: "pointer" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.3)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div style={{ textAlign: "center", color: "#2a1f3d", padding: 24 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", opacity: 0.65 }}>Lesson {lessonIdx + 1}</p>
            <h2 style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 700, letterSpacing: -0.5, fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.2, maxWidth: 320 }}>{lesson}</h2>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: showControls ? "linear-gradient(180deg,rgba(40,30,55,0.4) 0%,rgba(40,30,55,0) 25%,rgba(40,30,55,0) 60%,rgba(40,30,55,0.6) 100%)" : "transparent", opacity: showControls ? 1 : 0, transition: "opacity 250ms" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "16px 18px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={e => { e.stopPropagation(); go({ name: "course", id: c.id }); }} style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.25)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.3)", display: "grid", placeItems: "center", cursor: "pointer" }}><ChevronLeft size={18} color="#fff" strokeWidth={2.4} /></button>
            <button style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.25)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.3)", display: "grid", placeItems: "center", cursor: "pointer" }}><Maximize2 size={16} color="#fff" strokeWidth={2.2} /></button>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 28 }}>
            <button onClick={e => { e.stopPropagation(); prevLesson(); }} style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.3)", display: "grid", placeItems: "center", cursor: "pointer" }}><SkipBack size={20} color="#fff" strokeWidth={2.2} fill="#fff" /></button>
            <button onClick={e => { e.stopPropagation(); setPlaying(p => !p); }} style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 12px 30px -8px rgba(0,0,0,0.3)" }}>
              {playing ? <Pause size={26} color="#2a1f3d" fill="#2a1f3d" strokeWidth={0} /> : <Play size={26} color="#2a1f3d" fill="#2a1f3d" strokeWidth={0} style={{ marginLeft: 3 }} />}
            </button>
            <button onClick={e => { e.stopPropagation(); nextLesson(); }} style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.3)", display: "grid", placeItems: "center", cursor: "pointer" }}><SkipForward size={20} color="#fff" strokeWidth={2.2} fill="#fff" /></button>
          </div>
          <div style={{ position: "absolute", bottom: 14, left: 18, right: 18 }}>
            <div style={{ height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 999, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "#fff", borderRadius: 999 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#fff", fontWeight: 600 }}>
              <span>{fmt(currentTime)}</span><span style={{ opacity: 0.75 }}>{fmt(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 22px 0" }}>
        <p style={{ margin: 0, fontSize: 11, color: c.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>Chapter {chapterIdx + 1} · {ch.title}</p>
        <h2 style={{ margin: "4px 0 14px", fontSize: 21, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.5, fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.2 }}>{lesson}</h2>

        <Glass style={{ borderRadius: 14, padding: 4, display: "inline-flex", gap: 4, marginBottom: 16 }}>
          {["overview","notes","ai tutor"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 14px", borderRadius: 11, border: "none",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#2a1f3d" : "#8a7d9c",
              fontWeight: 600, fontSize: 12.5, cursor: "pointer", textTransform: "capitalize",
              boxShadow: tab === t ? "0 4px 12px -4px rgba(60,40,90,0.15)" : "none"
            }}>{t}</button>
          ))}
        </Glass>

        {tab === "overview" && (
          <div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#5a4a72" }}>In this lesson, you'll dive into the core concept and walk through a hands-on example. We'll cover key principles, common pitfalls, and best practices used in production codebases.</p>
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[{ icon: Heart, label: "1.2k" }, { icon: Download, label: "Save offline" }, { icon: Share2, label: "Share" }].map((b, i) => (
                <Glass key={i} style={{ borderRadius: 14, padding: "10px 14px", display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <b.icon size={14} color={c.accent} strokeWidth={2.2} /><span style={{ fontSize: 13, fontWeight: 600, color: "#3a2f4a" }}>{b.label}</span>
                </Glass>
              ))}
            </div>
          </div>
        )}
        {tab === "notes" && (
          <Glass style={{ borderRadius: 18, padding: 16 }}>
            <textarea placeholder="Add your notes for this lesson..." style={{ width: "100%", minHeight: 120, border: "none", background: "transparent", outline: "none", resize: "none", fontSize: 14, color: "#2a1f3d", fontFamily: "inherit", lineHeight: 1.6 }} />
          </Glass>
        )}
        {tab === "ai tutor" && (
          <Glass style={{ borderRadius: 18, padding: 16, background: "linear-gradient(135deg,rgba(123,124,240,0.08),rgba(229,115,155,0.08))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#7B7CF0,#E5739B)", display: "grid", placeItems: "center" }}><Wand2 size={16} color="#fff" strokeWidth={2.2} /></div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#2a1f3d" }}>Ask anything about this lesson</p>
                <p style={{ margin: 0, fontSize: 11.5, color: "#8a7d9c" }}>Powered by EduAI tutor</p>
              </div>
            </div>
            <button onClick={() => go({ name: "ai", prompt: `Help me understand: ${lesson}` })} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px dashed rgba(123,124,240,0.4)", background: "rgba(255,255,255,0.5)", color: "#5a4a72", fontWeight: 500, fontSize: 13, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Open AI Playground for this topic →</span><ArrowRight size={14} color="#7B7CF0" />
            </button>
          </Glass>
        )}

        <div style={{ marginTop: 26 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.3, fontFamily: "'Fraunces', Georgia, serif" }}>Up next</h3>
          <Glass onClick={nextLesson} style={{ borderRadius: 18, padding: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: c.gradient, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Play size={18} color="#fff" fill="#fff" strokeWidth={0} style={{ marginLeft: 2 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 11, color: c.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Next lesson</p>
              <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: "#2a1f3d", letterSpacing: -0.2 }}>
                {lessonIdx < ch.lessons.length - 1 ? ch.lessons[lessonIdx + 1] : chapterIdx < c.chapters.length - 1 ? c.chapters[chapterIdx + 1].lessons[0] : "You've reached the end!"}
              </p>
            </div>
            <ArrowRight size={18} color={c.accent} strokeWidth={2.2} />
          </Glass>
        </div>
      </div>
    </div>
  );
}

/* ─── REELS ─────────────────────────────────────────────────────────────────── */
function ReelsScreen({ go, initialId }) {
  const [idx, setIdx] = useState(() => { const i = REELS.findIndex(r => r.id === initialId); return i >= 0 ? i : 0; });
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [following, setFollowing] = useState({});
  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [expandedCaption, setExpandedCaption] = useState(false);

  useEffect(() => {
    if (!playing) return;
    setProgress(0);
    const t = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(t); setIdx(i => (i + 1) % REELS.length); return 0; } return p + 0.4; });
    }, 60);
    return () => clearInterval(t);
  }, [idx, playing]);

  useEffect(() => { setExpandedCaption(false); }, [idx]);

  const reel = REELS[idx];
  const next = () => setIdx(i => Math.min(i + 1, REELS.length - 1));
  const prev = () => setIdx(i => Math.max(i - 1, 0));
  const fmtCount = n => n >= 1000 ? `${(n/1000).toFixed(n >= 10000 ? 0 : 1)}K` : n;

  const lastTap = useRef(0);
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) { if (!liked[reel.id]) setLiked(l => ({ ...l, [reel.id]: true })); setShowHeart(true); setTimeout(() => setShowHeart(false), 800); }
    else setPlaying(p => !p);
    lastTap.current = now;
  };

  const touchStart = useRef(null);
  const onTouchStart = e => { touchStart.current = e.touches[0].clientY; };
  const onTouchEnd = e => {
    if (touchStart.current == null) return;
    const dy = e.changedTouches[0].clientY - touchStart.current;
    if (dy < -50) next(); else if (dy > 50) prev();
    touchStart.current = null;
  };
  const wheelLock = useRef(false);
  const onWheel = e => {
    if (wheelLock.current || Math.abs(e.deltaY) < 30) return;
    wheelLock.current = true;
    if (e.deltaY > 0) next(); else prev();
    setTimeout(() => { wheelLock.current = false; }, 500);
  };

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onWheel={onWheel}
      style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden", touchAction: "pan-y", fontFamily: "'Inter', sans-serif", color: "#E7E9EA" }}>

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 30, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(to bottom,rgba(0,0,0,0.6),rgba(0,0,0,0))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => go({ name: "home" })} style={{ width: 32, height: 32, background: "transparent", border: "none", display: "grid", placeItems: "center", cursor: "pointer", color: "#E7E9EA" }}><ChevronLeft size={26} strokeWidth={2.4} /></button>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#E7E9EA", letterSpacing: -0.5 }}>Reels</h1>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", border: "none", display: "grid", placeItems: "center", cursor: "pointer", color: "#E7E9EA" }}><CameraIcon size={20} strokeWidth={2} /></button>
          <button onClick={() => setMuted(m => !m)} style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", border: "none", display: "grid", placeItems: "center", cursor: "pointer", color: "#E7E9EA" }}>
            {muted ? <VolumeX size={20} strokeWidth={2} /> : <Volume2 size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Video surface */}
      <div onClick={handleTap} style={{ position: "absolute", inset: 0, cursor: "pointer", overflow: "hidden" }}>
        <div key={reel.id} style={{ position: "absolute", inset: 0, background: reel.gradient, overflow: "hidden", animation: "reelFade 280ms ease-out" }}>
          <div style={{ position: "absolute", top: "8%", left: "-15%", width: "55%", height: "35%", borderRadius: "50%", background: "rgba(255,255,255,0.10)", filter: "blur(60px)", animation: "floatSlow 12s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "20%", right: "-15%", width: "55%", height: "35%", borderRadius: "50%", background: "rgba(255,255,255,0.08)", filter: "blur(50px)", animation: "floatSlow2 14s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 32px", pointerEvents: "none" }}>
            <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: 999, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", fontSize: 10.5, fontWeight: 700, color: "#fff", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 16, border: "1px solid rgba(255,255,255,0.15)" }}>{reel.topic}</span>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: -0.7, lineHeight: 1.12, textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>{reel.title}</h2>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "55%", background: "linear-gradient(to bottom,transparent 0%,rgba(0,0,0,0.55) 70%,rgba(0,0,0,0.85) 100%)", pointerEvents: "none" }} />
        </div>
        {!playing && (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
            <div style={{ width: 76, height: 76, borderRadius: "50%", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", display: "grid", placeItems: "center", border: "1px solid rgba(255,255,255,0.1)", animation: "pausePop 220ms cubic-bezier(.34,1.56,.64,1)" }}>
              <Play size={34} color="#fff" fill="#fff" strokeWidth={0} style={{ marginLeft: 4 }} />
            </div>
          </div>
        )}
        {showHeart && (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
            <Heart size={110} color="#F91880" fill="#F91880" strokeWidth={0} style={{ animation: "dblHeart 800ms cubic-bezier(.34,1.56,.64,1)", filter: "drop-shadow(0 4px 16px rgba(249,24,128,0.6))" }} />
          </div>
        )}
      </div>

      {/* Right action rail */}
      <div style={{ position: "absolute", right: 10, bottom: 200, zIndex: 20, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
        <button onClick={e => { e.stopPropagation(); setLiked(l => ({ ...l, [reel.id]: !l[reel.id] })); }} style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "center", padding: 0 }}>
          <Heart size={30} color={liked[reel.id] ? "#F91880" : "#E7E9EA"} fill={liked[reel.id] ? "#F91880" : "none"} strokeWidth={liked[reel.id] ? 0 : 1.8} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))", transition: "all 200ms" }} />
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#E7E9EA", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>{fmtCount(reel.likes + (liked[reel.id] ? 1 : 0))}</p>
        </button>
        <button onClick={e => { e.stopPropagation(); setShowComments(true); }} style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "center", padding: 0 }}>
          <MessageCircle size={30} color="#E7E9EA" strokeWidth={1.8} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))", transform: "scaleX(-1)" }} />
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#E7E9EA", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>{fmtCount(reel.comments)}</p>
        </button>
        <button style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "center", padding: 0 }}>
          <Send size={28} color="#E7E9EA" strokeWidth={1.8} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))", transform: "rotate(20deg)" }} />
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#E7E9EA", fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>{fmtCount(reel.shares)}</p>
        </button>
        <button onClick={e => { e.stopPropagation(); setSaved(s => ({ ...s, [reel.id]: !s[reel.id] })); }} style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "center", padding: 0 }}>
          <Bookmark size={28} color="#E7E9EA" fill={saved[reel.id] ? "#E7E9EA" : "none"} strokeWidth={1.8} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }} />
        </button>
        <button style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "center", padding: 0 }}>
          <MoreVertical size={26} color="#E7E9EA" strokeWidth={1.8} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }} />
        </button>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: reel.avatarGradient, border: "2px solid #E7E9EA", marginTop: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.6)", display: "grid", placeItems: "center", animation: "spinSlow 6s linear infinite" }}>
          <Music2 size={12} color="#fff" strokeWidth={2.4} />
        </div>
      </div>

      {/* Bottom meta */}
      <div style={{ position: "absolute", bottom: 90, left: 14, right: 78, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: reel.avatarGradient, padding: 2, display: "grid", placeItems: "center" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#000", display: "grid", placeItems: "center", color: "#E7E9EA", fontWeight: 700, fontSize: 13 }}>
              {reel.displayName.split(" ").map(n => n[0]).join("")}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#E7E9EA", letterSpacing: -0.2 }}>{reel.creator}</span>
            {reel.verified && <BadgeCheck size={14} color="#1D9BF0" fill="#1D9BF0" strokeWidth={2.4} />}
            <span style={{ color: "#71767B", fontSize: 13 }}>·</span>
            <button onClick={e => { e.stopPropagation(); setFollowing(f => ({ ...f, [reel.creator]: !f[reel.creator] })); }} style={{ padding: 0, background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: following[reel.creator] ? "#71767B" : "#E7E9EA" }}>
              {following[reel.creator] ? "Following" : "Follow"}
            </button>
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 13.5, color: "#E7E9EA", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: expandedCaption ? "unset" : 2, WebkitBoxOrient: "vertical", overflow: "hidden", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            {reel.caption} {reel.hashtags.map((h,i) => <span key={i} style={{ color: "#1D9BF0", fontWeight: 500 }}>{h} </span>)}
          </p>
          {!expandedCaption && reel.caption.length > 80 && (
            <button onClick={e => { e.stopPropagation(); setExpandedCaption(true); }} style={{ padding: 0, background: "transparent", border: "none", cursor: "pointer", fontSize: 12.5, color: "#71767B", fontWeight: 500, marginTop: 2 }}>more</button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Music2 size={13} color="#E7E9EA" strokeWidth={2.2} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap" }}>
            <span style={{ display: "inline-block", fontSize: 12.5, color: "#E7E9EA", fontWeight: 500, animation: "ticker 14s linear infinite" }}>
              {reel.song} &nbsp;·&nbsp; {reel.song} &nbsp;·&nbsp;
            </span>
          </div>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#71767B", fontWeight: 500 }}>
          <Eye size={11} strokeWidth={2.2} style={{ verticalAlign: "-1px", marginRight: 4 }} />{fmtCount(reel.views)} views
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 76, zIndex: 25, height: 2, background: "rgba(255,255,255,0.15)" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "#1D9BF0", boxShadow: "0 0 6px rgba(29,155,240,0.6)", transition: "width 60ms linear" }} />
      </div>

      {/* Reel dots */}
      <div style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", zIndex: 15, display: "flex", flexDirection: "column", gap: 5, padding: 4 }}>
        {REELS.map((r,i) => (
          <div key={r.id} style={{ width: 3, height: i === idx ? 18 : 3, borderRadius: 999, background: i === idx ? "#1D9BF0" : "rgba(231,233,234,0.35)", transition: "all 280ms cubic-bezier(.34,1.56,.64,1)", boxShadow: i === idx ? "0 0 8px rgba(29,155,240,0.6)" : "none" }} />
        ))}
      </div>

      {/* Comments sheet */}
      {showComments && (
        <>
          <div onClick={() => setShowComments(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 50, animation: "fadeIn 200ms ease-out" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 60, maxHeight: "75%", background: "#000", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTop: "1px solid #2F3336", display: "flex", flexDirection: "column", boxShadow: "0 -10px 40px rgba(0,0,0,0.6)", animation: "sheetUp 280ms cubic-bezier(.34,1.4,.64,1)" }}>
            <div style={{ padding: "10px 0 0", display: "grid", placeItems: "center" }}><div style={{ width: 38, height: 4, borderRadius: 999, background: "#2F3336" }} /></div>
            <div style={{ padding: "14px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2F3336" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#E7E9EA" }}>Comments <span style={{ color: "#71767B", fontWeight: 500 }}>· {reel.comments}</span></h3>
              <button onClick={() => setShowComments(false)} style={{ width: 30, height: 30, borderRadius: "50%", background: "transparent", border: "none", display: "grid", placeItems: "center", cursor: "pointer", color: "#E7E9EA" }}><X size={20} strokeWidth={2.2} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
              {["this just unlocked something 🧠 — dev.maya","wait does this work with useReducer? — nikhil.codes","saving this for tomorrow's standup lol — tara.builds","you make this look so easy — arjun.tech","more like this please 🙏 — sana.r"].map((c,i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 4 ? "1px solid #16181C" : "none" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#16181C", border: "1px solid #2F3336", display: "grid", placeItems: "center", flexShrink: 0, color: "#E7E9EA", fontWeight: 700, fontSize: 13 }}>{c.split(" — ")[1]?.[0]?.toUpperCase() || "U"}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#E7E9EA", lineHeight: 1.4 }}>{c.split(" — ")[0]}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#71767B" }}>{c.split(" — ")[1]}</p>
                  </div>
                  <Heart size={14} strokeWidth={2} color="#71767B" style={{ alignSelf: "flex-start", marginTop: 4 }} />
                </div>
              ))}
            </div>
            <div style={{ padding: "10px 14px 24px", borderTop: "1px solid #2F3336", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#7B7CF0,#E5739B)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>A</div>
              <div style={{ flex: 1, padding: "9px 14px", borderRadius: 999, background: "#16181C", border: "1px solid #2F3336", display: "flex", alignItems: "center", gap: 10 }}>
                <input placeholder={`Add a comment...`} style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 13.5, color: "#E7E9EA", fontFamily: "inherit" }} />
                <button style={{ padding: 0, background: "transparent", border: "none", cursor: "pointer", fontSize: 13.5, color: "#1D9BF0", fontWeight: 700 }}>Post</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── AI PLAYGROUND ─────────────────────────────────────────────────────────── */
function AiPlayground({ go, initialPrompt }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { if (initialPrompt) send(initialPrompt); }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, thinking]);

  const fakeReply = q => {
    const l = q.toLowerCase();
    if (l.includes("react")) return "Great question. **React hooks** let you use state and lifecycle from function components.\n\nKey hooks:\n\n1. `useState` — adds local state\n2. `useEffect` — runs side effects after render\n3. `useMemo` / `useCallback` — memoize expensive work\n\nWant a real example you can run?";
    if (l.includes("python") || l.includes("data")) return "Solid path. Focus on **pandas**, **matplotlib**, and **scikit-learn** first.\n\n30-day plan:\n\n• Week 1 — pandas DataFrames, indexing, groupby\n• Week 2 — cleaning, joining, reshaping\n• Week 3 — visualization\n• Week 4 — your first ML model\n\nShall I generate a daily checklist?";
    if (l.includes("quiz")) return "Here's a 5-question quiz on React hooks 🎯\n\n**Q1.** What does `useState` return?\n**Q2.** When does `useEffect` with no deps run?\n**Q3.** Why use `useCallback`?\n**Q4.** What are the rules of hooks?\n**Q5.** Difference between `useMemo` and `useCallback`?\n\nReply with your answers and I'll grade them!";
    return "Got it. Let me think step by step…\n\nThis is a great topic. I'd recommend starting with the fundamentals, then moving into hands-on practice. Want me to break this into a learning plan, or jump straight into examples?";
  };

  const send = text => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages(m => [...m, { role: "user", content: t }]);
    setInput("");
    setThinking(true);
    setTimeout(() => { setMessages(m => [...m, { role: "assistant", content: fakeReply(t) }]); setThinking(false); }, 1100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "16px 16px 12px", background: "rgba(247,243,253,0.95)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={() => go({ name: "home" })} style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.8)", display: "grid", placeItems: "center", cursor: "pointer" }}><ChevronLeft size={20} color="#3a2f4a" strokeWidth={2.4} /></button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.5, fontFamily: "'Fraunces', Georgia, serif" }}>AI Playground</h1>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5BB89A", animation: "pulseDot 1.6s ease-in-out infinite" }} />
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#7B7CF0", fontWeight: 600 }}>EduAI Tutor · Live</p>
        </div>
        <button onClick={() => setMessages([])} style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.8)", display: "grid", placeItems: "center", cursor: "pointer" }}><RotateCcw size={16} color="#5a4a72" strokeWidth={2.2} /></button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: messages.length === 0 ? "0 16px" : "8px 16px 120px" }}>
        {messages.length === 0 ? (
          <div style={{ paddingTop: 8 }}>
            <div style={{ textAlign: "center", padding: "10px 8px 22px" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", margin: "0 auto 14px", background: "conic-gradient(from 0deg,#7B7CF0,#B66ABA,#E5739B,#FFB547,#5BB89A,#7B7CF0)", display: "grid", placeItems: "center", boxShadow: "0 18px 40px -10px rgba(123,124,240,0.5)", animation: "orbPulse 8s linear infinite" }}>
                <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center" }}><Wand2 size={30} color="#7B7CF0" strokeWidth={2.2} /></div>
              </div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.6, fontFamily: "'Fraunces', Georgia, serif" }}>How can I help you learn?</h2>
              <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#8a7d9c", lineHeight: 1.5 }}>Ask anything. Get instant explanations,<br/>quizzes, plans, and code reviews.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {AI_SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s.prompt)} style={{ padding: 14, borderRadius: 18, border: "1px solid rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.62)", backdropFilter: "blur(20px)", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 24px -16px rgba(60,40,90,0.15)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${s.color}1f`, display: "grid", placeItems: "center" }}><s.icon size={15} color={s.color} strokeWidth={2.2} /></div>
                  <div>
                    <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.2 }}>{s.label}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#8a7d9c", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{s.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "8px 0" }}>
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const lines = m.content.split("\n");
              return (
                <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  {!isUser && <div style={{ width: 30, height: 30, borderRadius: 10, background: "linear-gradient(135deg,#7B7CF0,#E5739B)", display: "grid", placeItems: "center", flexShrink: 0, marginRight: 8, marginTop: 2 }}><Wand2 size={13} color="#fff" strokeWidth={2.4} /></div>}
                  <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: isUser ? "20px 20px 6px 20px" : "20px 20px 20px 6px", background: isUser ? "linear-gradient(135deg,#7B7CF0,#9B6BE8)" : "rgba(255,255,255,0.85)", color: isUser ? "#fff" : "#2a1f3d", backdropFilter: "blur(20px)", border: isUser ? "none" : "1px solid rgba(255,255,255,0.85)", boxShadow: isUser ? "0 6px 16px -8px rgba(123,124,240,0.4)" : "0 4px 14px -8px rgba(60,40,90,0.12)", fontSize: 13.5, lineHeight: 1.55 }}>
                    {lines.map((line, li) => { const parts = line.split(/\*\*(.+?)\*\*/); return <p key={li} style={{ margin: li === 0 ? 0 : "8px 0 0" }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}</p>; })}
                    {!isUser && (
                      <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                        <button style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#8a7d9c", fontWeight: 500 }}><ThumbsUp size={11} strokeWidth={2.2} /> Helpful</button>
                        <button onClick={() => { setMessages([] ); send(messages.find((_, mi) => mi === i - 1)?.content || ""); }} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#8a7d9c", fontWeight: 500 }}><RotateCcw size={11} strokeWidth={2.2} /> Retry</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {thinking && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: "linear-gradient(135deg,#7B7CF0,#E5739B)", display: "grid", placeItems: "center", flexShrink: 0, marginRight: 8, marginTop: 2 }}><Wand2 size={13} color="#fff" strokeWidth={2.4} /></div>
                <div style={{ padding: "12px 16px", borderRadius: "20px 20px 20px 6px", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.85)", display: "flex", gap: 5 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#7B7CF0", display: "inline-block", animation: `dotBounce 1.2s ease-in-out infinite`, animationDelay: `${i*150}ms` }} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div style={{ padding: "10px 16px 20px", background: "linear-gradient(to top,rgba(247,243,253,1) 65%,rgba(247,243,253,0))", flexShrink: 0 }}>
        <Glass style={{ borderRadius: 22, padding: 8, display: "flex", alignItems: "flex-end", gap: 6 }}>
          <button style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(123,124,240,0.1)", border: "none", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}><Plus size={17} color="#7B7CF0" strokeWidth={2.4} /></button>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Ask anything..." rows={1}
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14, color: "#2a1f3d", fontFamily: "inherit", lineHeight: 1.4, resize: "none", maxHeight: 100, padding: "8px 4px" }} />
          <button style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(123,124,240,0.1)", border: "none", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}><Mic size={16} color="#7B7CF0" strokeWidth={2.2} /></button>
          <button onClick={() => send()} disabled={!input.trim()} style={{ width: 38, height: 38, borderRadius: 12, background: input.trim() ? "linear-gradient(135deg,#7B7CF0,#E5739B)" : "rgba(0,0,0,0.06)", border: "none", display: "grid", placeItems: "center", cursor: input.trim() ? "pointer" : "not-allowed", flexShrink: 0, boxShadow: input.trim() ? "0 8px 20px -8px rgba(123,124,240,0.6)" : "none", transition: "all 250ms" }}>
            <Send size={15} color={input.trim() ? "#fff" : "#a89bbf"} strokeWidth={2.2} />
          </button>
        </Glass>
        <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 10.5, color: "#a89bbf" }}>EduAI can make mistakes — verify important info.</p>
      </div>
    </div>
  );
}

/* ─── LIBRARY ────────────────────────────────────────────────────────────────── */
function LibraryScreen({ go, saved }) {
  const [filter, setFilter] = useState("learning");
  const enrolled = COURSES.filter(c => ENROLLED_IDS.includes(c.id));
  const savedCourses = COURSES.filter(c => saved.includes(c.id));
  const showing = filter === "learning" ? enrolled : filter === "saved" ? savedCourses : [];

  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 100 }}>
      <div style={{ padding: "22px 22px 14px" }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.8, fontFamily: "'Fraunces', Georgia, serif" }}>My Library</h1>
        <p style={{ margin: "2px 0 0", fontSize: 13.5, color: "#8a7d9c" }}>Pick up where you left off</p>
      </div>
      <div style={{ padding: "0 22px 16px", display: "flex", gap: 8 }}>
        {[{ id: "learning", label: "Learning", count: enrolled.length }, { id: "saved", label: "Saved", count: savedCourses.length }, { id: "completed", label: "Completed", count: 0 }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex: 1, padding: "11px 8px", borderRadius: 14, background: filter === f.id ? "linear-gradient(135deg,#2a1f3d,#3d2f54)" : "rgba(255,255,255,0.6)", color: filter === f.id ? "#fff" : "#3a2f4a", border: filter === f.id ? "none" : "1px solid rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 13, cursor: "pointer", backdropFilter: "blur(20px)", boxShadow: filter === f.id ? "0 8px 18px -8px rgba(42,31,61,0.5)" : "none" }}>
            {f.label} <span style={{ opacity: 0.6, marginLeft: 4 }}>{f.count}</span>
          </button>
        ))}
      </div>
      <div style={{ padding: "0 22px" }}>
        {showing.length === 0 ? (
          <Glass style={{ borderRadius: 22, padding: 36, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(167,154,200,0.15)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}><BookOpen size={24} color="#a89bbf" strokeWidth={2} /></div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#2a1f3d", fontFamily: "'Fraunces', serif" }}>Nothing here yet</h3>
            <p style={{ margin: "6px 0 16px", fontSize: 13, color: "#8a7d9c" }}>{filter === "completed" ? "Finish a course to see it here." : filter === "saved" ? "Tap the bookmark on any course." : "Browse the catalog to start."}</p>
            <button onClick={() => go({ name: "home" })} style={{ padding: "10px 18px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#7B7CF0,#E5739B)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Explore courses</button>
          </Glass>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {showing.map(c => {
              const p = PROGRESS[c.id] || 0;
              return (
                <Glass key={c.id} onClick={() => go({ name: "course", id: c.id })} style={{ borderRadius: 22, padding: 14, cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 14, marginBottom: filter === "learning" ? 12 : 0 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 16, background: c.gradient, flexShrink: 0, display: "grid", placeItems: "center" }}><Play size={20} color="#fff" fill="#fff" strokeWidth={0} style={{ marginLeft: 2 }} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 10.5, color: c.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>{CATEGORIES.find(x => x.id === c.cat)?.label}</p>
                      <h4 style={{ margin: "3px 0 4px", fontSize: 15, fontWeight: 600, color: "#2a1f3d", letterSpacing: -0.2 }}>{c.title}</h4>
                      <p style={{ margin: 0, fontSize: 12, color: "#8a7d9c" }}>{c.instructor}</p>
                    </div>
                  </div>
                  {filter === "learning" && (
                    <div>
                      <div style={{ height: 5, background: "rgba(0,0,0,0.06)", borderRadius: 999, overflow: "hidden" }}><div style={{ width: `${p*100}%`, height: "100%", background: `linear-gradient(90deg,${c.accent},${c.accent}cc)`, borderRadius: 999 }} /></div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11.5, color: "#5a4a72", fontWeight: 500 }}>
                        <span>{Math.round(p * c.lessons)} of {c.lessons} lessons</span>
                        <span style={{ color: c.accent, fontWeight: 700 }}>{Math.round(p * 100)}%</span>
                      </div>
                    </div>
                  )}
                </Glass>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PROFILE ────────────────────────────────────────────────────────────────── */
function ProfileScreen({ go }) {
  const stats = [
    { label: "Courses", value: 2, icon: BookOpen, color: "#7B7CF0" },
    { label: "Streak", value: 12, icon: Flame, color: "#FF6B9D" },
    { label: "Hours", value: 47, icon: Clock, color: "#5BB89A" },
    { label: "Trophies", value: 8, icon: Trophy, color: "#E5A24E" },
  ];
  const menu = [
    { icon: TrendingUp, label: "Learning insights", color: "#5B8DEF" },
    { icon: Wand2, label: "AI Playground history", color: "#7B7CF0" },
    { icon: Film, label: "Saved reels", color: "#E5739B" },
    { icon: Bell, label: "Notifications", color: "#FFB547" },
    { icon: Download, label: "Downloads", color: "#5BB89A" },
    { icon: Globe, label: "Language & region", color: "#9F8AE8" },
    { icon: Settings, label: "Settings", color: "#8a7d9c" },
  ];
  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 100 }}>
      <div style={{ padding: "22px 22px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.8, fontFamily: "'Fraunces', Georgia, serif" }}>Profile</h1>
          <Glass style={{ width: 42, height: 42, borderRadius: 14, display: "grid", placeItems: "center", cursor: "pointer" }}><Settings size={18} color="#5a4a72" strokeWidth={2} /></Glass>
        </div>
        <Glass style={{ borderRadius: 26, padding: 20, textAlign: "center", background: "linear-gradient(135deg,rgba(184,200,247,0.55) 0%,rgba(220,200,250,0.55) 50%,rgba(245,200,225,0.55) 100%)" }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: "linear-gradient(135deg,#7B7CF0,#E5739B)", display: "grid", placeItems: "center", margin: "0 auto 12px", color: "#fff", fontWeight: 700, fontSize: 28, fontFamily: "'Fraunces', serif", boxShadow: "0 12px 30px -10px rgba(123,124,240,0.6)", border: "3px solid rgba(255,255,255,0.7)" }}>A</div>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.4, fontFamily: "'Fraunces', serif" }}>Aarav Sharma</h2>
          <p style={{ margin: "2px 0 12px", fontSize: 13, color: "#5a4a72" }}>Learning · Joined March 2025</p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 999, background: "linear-gradient(135deg,#FFD89B,#FFA56B)", fontSize: 11.5, fontWeight: 700, color: "#553520", letterSpacing: 0.3, textTransform: "uppercase" }}><Sparkles size={11} strokeWidth={2.4} /> Pro Member</span>
        </Glass>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
          {stats.map(s => (
            <Glass key={s.label} style={{ borderRadius: 18, padding: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${s.color}1f`, display: "grid", placeItems: "center", marginBottom: 10 }}><s.icon size={16} color={s.color} strokeWidth={2.2} /></div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#2a1f3d", letterSpacing: -0.5, fontFamily: "'Fraunces', serif" }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#8a7d9c", fontWeight: 500 }}>{s.label}</p>
            </Glass>
          ))}
        </div>
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 8 }}>
          {menu.map(m => (
            <Glass key={m.label} style={{ borderRadius: 16, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${m.color}1f`, display: "grid", placeItems: "center" }}><m.icon size={15} color={m.color} strokeWidth={2.2} /></div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#2a1f3d" }}>{m.label}</span>
              <ChevronRight size={16} color="#a89bbf" strokeWidth={2.2} />
            </Glass>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── BOTTOM NAV ─────────────────────────────────────────────────────────────── */
function BottomNav({ tab, setTab, reelsMode }) {
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "reels", icon: Film, label: "Reels" },
    { id: "ai", icon: Wand2, label: "AI", special: true },
    { id: "library", icon: BookOpen, label: "Library" },
    { id: "profile", icon: User, label: "Profile" },
  ];
  if (reelsMode) {
    return (
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(18px)", borderTop: "1px solid #2F3336", padding: "8px 4px 20px", display: "flex", justifyContent: "space-around" }}>
        {items.map(i => {
          const active = tab === i.id;
          if (i.special) return (
            <button key={i.id} onClick={() => setTab(i.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: 12, background: active ? "linear-gradient(135deg,#1D9BF0,#7B7CF0)" : "linear-gradient(135deg,rgba(29,155,240,0.18),rgba(123,124,240,0.18))", border: active ? "none" : "1px solid rgba(29,155,240,0.3)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", color: active ? "#fff" : "#1D9BF0", margin: "2px 4px" }}>
              <i.icon size={20} strokeWidth={active ? 2.4 : 2.2} /><span style={{ fontSize: 10.5, fontWeight: 700 }}>{i.label}</span>
            </button>
          );
          return (
            <button key={i.id} onClick={() => setTab(i.id)} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", color: active ? "#E7E9EA" : "#71767B" }}>
              <i.icon size={22} strokeWidth={active ? 2.6 : 1.8} /><span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{i.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 20px", zIndex: 100, pointerEvents: "none" }}>
      <Glass style={{ borderRadius: 22, padding: 8, display: "flex", justifyContent: "space-around", boxShadow: "0 12px 36px -10px rgba(60,40,90,0.3)", pointerEvents: "auto" }}>
        {items.map(i => {
          const active = tab === i.id;
          if (i.special) return (
            <button key={i.id} onClick={() => setTab(i.id)} style={{ flex: 1, padding: "8px 6px", borderRadius: 14, background: active ? "linear-gradient(135deg,#7B7CF0,#E5739B)" : "linear-gradient(135deg,rgba(123,124,240,0.15),rgba(229,115,155,0.15))", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", color: active ? "#fff" : "#7B7CF0", boxShadow: active ? "0 8px 20px -6px rgba(123,124,240,0.6)" : "none" }}>
              <i.icon size={18} strokeWidth={active ? 2.4 : 2.2} /><span style={{ fontSize: 10.5, fontWeight: 700 }}>{i.label}</span>
            </button>
          );
          return (
            <button key={i.id} onClick={() => setTab(i.id)} style={{ flex: 1, padding: "10px 6px", borderRadius: 14, background: active ? "rgba(42,31,61,0.95)" : "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", color: active ? "#fff" : "#5a4a72" }}>
              <i.icon size={18} strokeWidth={active ? 2.4 : 2} /><span style={{ fontSize: 10.5, fontWeight: 600 }}>{i.label}</span>
            </button>
          );
        })}
      </Glass>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [route, setRoute] = useState({ name: "home" });
  const [tab, setTab] = useState("home");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [saved, setSaved] = useState([2, 8]);

  const go = r => {
    setRoute(r);
    if (["home","library","profile","reels","ai"].includes(r.name)) setTab(r.name);
    if (r.name !== "reels") window.scrollTo?.({ top: 0, behavior: "instant" });
  };
  const onTabChange = t => { setTab(t); setRoute({ name: t }); };
  const toggleSave = id => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const isReels = route.name === "reels";
  const isAi = route.name === "ai";
  const isPlayer = route.name === "player";
  const course = (route.name === "course" || route.name === "player") ? COURSES.find(c => c.id === route.id) : null;

  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes flameGlow { 0%,100% { box-shadow:0 8px 20px -8px rgba(255,91,138,0.6); } 50% { box-shadow:0 8px 30px -6px rgba(255,91,138,0.9); } }
        @keyframes orbPulse { 0%,100% { transform:scale(1) rotate(0deg); } 50% { transform:scale(1.05) rotate(180deg); } }
        @keyframes dotBounce { 0%,60%,100% { transform:translateY(0); opacity:0.5; } 30% { transform:translateY(-6px); opacity:1; } }
        @keyframes reelFade { from { opacity:0; } to { opacity:1; } }
        @keyframes floatSlow { 0%,100% { transform:translate(0,0); } 50% { transform:translate(30px,-20px); } }
        @keyframes floatSlow2 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(-25px,30px); } }
        @keyframes pausePop { 0% { transform:scale(0.6); opacity:0; } 60% { transform:scale(1.08); opacity:1; } 100% { transform:scale(1); opacity:1; } }
        @keyframes dblHeart { 0% { transform:scale(0); opacity:0; } 15% { transform:scale(1.3); opacity:1; } 60% { transform:scale(1); opacity:1; } 100% { transform:scale(1.4); opacity:0; } }
        @keyframes spinSlow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes sheetUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.2); } }
        .fade-up { animation: fadeUp 400ms cubic-bezier(.34,1.56,.64,1) backwards; }
      `}</style>

      <div style={{
        position: "fixed", inset: 0, display: "flex", justifyContent: "center",
        background: isReels ? "#000" : "#e8e0f5",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        {/* Ambient background (non-reels) */}
        {!isReels && (
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-10%", left: "-15%", width: "70%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle,rgba(255,200,220,0.55),transparent 65%)", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", top: "20%", right: "-20%", width: "75%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle,rgba(180,210,255,0.5),transparent 65%)", filter: "blur(70px)" }} />
            <div style={{ position: "absolute", bottom: "-15%", left: "10%", width: "85%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle,rgba(220,200,250,0.45),transparent 65%)", filter: "blur(70px)" }} />
          </div>
        )}

        {/* App shell — max 480px, full height */}
        <div style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: 480,
          height: "100%",
          background: isReels ? "#000" : "#f7f3fd",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 0 80px rgba(0,0,0,0.15)",
        }}>
          {/* Scrollable content area */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}
            key={`${route.name}-${route.id ?? ""}-${route.chapter ?? ""}-${route.lesson ?? ""}`}>
            {route.name === "home" && tab === "home" && <HomeScreen go={go} query={query} setQuery={setQuery} cat={cat} setCat={setCat} saved={saved} toggleSave={toggleSave} />}
            {tab === "library" && route.name !== "course" && route.name !== "player" && <LibraryScreen go={go} saved={saved} />}
            {tab === "profile" && route.name !== "course" && route.name !== "player" && <ProfileScreen go={go} />}
            {route.name === "course" && course && <CourseDetail course={course} go={go} saved={saved.includes(course.id)} toggleSave={toggleSave} />}
            {route.name === "player" && course && <PlayerScreen course={course} chapterIdx={route.chapter} lessonIdx={route.lesson} go={go} />}
            {isReels && <ReelsScreen go={go} initialId={route.id} />}
            {isAi && <AiPlayground go={go} initialPrompt={route.prompt} />}
          </div>

          {/* Bottom nav */}
          {!isPlayer && <BottomNav tab={tab} setTab={onTabChange} reelsMode={isReels} />}
        </div>
      </div>
    </>
  );
}
