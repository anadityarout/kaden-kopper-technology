import React, { useState } from "react";
import "./TechStack.css";

import {
  FaCode,
  FaMobileAlt,
  FaVideo,
  FaPenNib,
  FaSearch,
  FaBullhorn,
  FaChevronRight,
  FaCog,
  FaReact,
  FaNodeJs,
  FaAngular,
  FaVuejs,
  FaHtml5,
  FaCss3Alt,
  FaPhp,
  FaPython,
  FaJava,
  FaAws,
  FaDocker,
  FaGithub,
  FaFigma,
  FaGitAlt,
  FaSwift,
  FaAndroid,
  FaGoogle,
  FaFacebook,
  FaYoutube,
  FaLinkedin,
  FaBootstrap,
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiTailwindcss,
  SiDotnet,
  SiFirebase,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiSqlite,
  SiPostman,
  SiTypescript,
  SiJavascript,
  SiFlutter,
  SiKotlin,
  SiDart,
  SiRedux,
  SiIonic,
} from "react-icons/si";

import { VscVscode } from "react-icons/vsc";


// ======================================================
// HELPERS
// t() = tile with a real icon, b() = tile with a text badge
// Colors are set inline, so no per-brand CSS classes needed.
// ======================================================

const t = (name, icon, color) => ({ name, icon, color });
const b = (name, short, color) => ({ name, short, color });


// ======================================================
// CATEGORIES + DATA
// ======================================================

const categories = [
  {
    id: "web",
    title: "Web Development",
    icon: FaCode,
    description:
      "We build modern, responsive, and high-performance websites using the latest technologies to give you the best digital experience.",
    groups: [
      {
        title: "Frontend Technologies",
        dot: "#1c6bff",
        items: [
          t("React", FaReact, "#00b8ed"),
          t("Next.js", SiNextdotjs, "#111111"),
          t("Angular", FaAngular, "#dd0031"),
          t("Vue.js", FaVuejs, "#42b883"),
          t("HTML5", FaHtml5, "#e44d26"),
          t("CSS3", FaCss3Alt, "#1572b6"),
          t("Tailwind CSS", SiTailwindcss, "#38bdf8"),
        ],
      },
      {
        title: "Backend Technologies",
        dot: "#8b5cf6",
        items: [
          t("Node.js", FaNodeJs, "#5fa04e"),
          t("PHP", FaPhp, "#777bb4"),
          t("Python", FaPython, "#3776ab"),
          t(".NET", SiDotnet, "#512bd4"),
          t("Java", FaJava, "#e76f00"),
          t("Firebase", SiFirebase, "#ffca28"),
          t("AWS", FaAws, "#ff9900"),
        ],
      },
      {
        title: "Databases",
        dot: "#10b981",
        items: [
          t("MongoDB", SiMongodb, "#47a248"),
          t("MySQL", SiMysql, "#00758f"),
          t("PostgreSQL", SiPostgresql, "#336791"),
          t("Firebase", SiFirebase, "#ffca28"),
          t("Redis", SiRedis, "#dc382d"),
          t("SQLite", SiSqlite, "#0f80cc"),
        ],
      },
      {
        title: "Tools & Others",
        dot: "#f97316",
        items: [
          t("Git", FaGitAlt, "#f05032"),
          t("GitHub", FaGithub, "#111111"),
          t("Docker", FaDocker, "#2496ed"),
          t("Figma", FaFigma, "#f24e1e"),
          t("VS Code", VscVscode, "#007acc"),
          t("Postman", SiPostman, "#ff6c37"),
        ],
      },
    ],
    // tiles that float around the laptop (max 7)
    floating: [
      t("React", FaReact, "#00b8ed"),
      t("Next.js", SiNextdotjs, "#111111"),
      t("Node.js", FaNodeJs, "#5fa04e"),
      t("HTML5", FaHtml5, "#e44d26"),
      t("TypeScript", SiTypescript, "#3178c6"),
      t("Bootstrap", FaBootstrap, "#7952b3"),
      t("Tailwind CSS", SiTailwindcss, "#38bdf8"),
    ],
  },

  {
    id: "mobile",
    title: "App Developer",
    icon: FaMobileAlt,
    description:
      "We build fast, reliable apps for iOS and Android, from a single codebase or fully native, with a smooth experience on every device.",
    groups: [
      {
        title: "Cross-Platform Frameworks",
        dot: "#1c6bff",
        items: [
          t("Flutter", SiFlutter, "#02569b"),
          t("React Native", FaReact, "#00b8ed"),
          b("Xamarin", "X", "#3498db"),
          t("Ionic", SiIonic, "#3880ff"),
        ],
      },
      {
        title: "Native & Languages",
        dot: "#8b5cf6",
        items: [
          t("Swift", FaSwift, "#f05138"),
          t("Kotlin", SiKotlin, "#7f52ff"),
          t("Android", FaAndroid, "#3ddc84"),
          t("Java", FaJava, "#e76f00"),
          t("Dart", SiDart, "#0175c2"),
          t("JavaScript", SiJavascript, "#f7df1e"),
        ],
      },
      {
        title: "Tools & Services",
        dot: "#f97316",
        items: [
          t("Firebase", SiFirebase, "#ffca28"),
          t("Redux", SiRedux, "#764abc"),
          t("GitHub", FaGithub, "#111111"),
          t("Figma", FaFigma, "#f24e1e"),
        ],
      },
    ],
  },

  {
    id: "video",
    title: "Video Editor",
    icon: FaVideo,
    description:
      "From reels to brand films, we cut, grade and polish video that holds attention and looks great on every screen.",
    groups: [
      {
        title: "Editing Software",
        dot: "#1c6bff",
        items: [
          b("Premiere Pro", "Pr", "#9999ff"),
          b("After Effects", "Ae", "#9999ff"),
          b("DaVinci Resolve", "DR", "#233a51"),
          b("Final Cut Pro", "FCP", "#3367d6"),
        ],
      },
      {
        title: "Motion & Audio",
        dot: "#8b5cf6",
        items: [
          b("Audition", "Au", "#00a88a"),
          b("Blender", "Bl", "#ea7600"),
          b("CapCut", "CC", "#111111"),
        ],
      },
    ],
  },

  {
    id: "design",
    title: "Graphic Designer",
    icon: FaPenNib,
    description:
      "Logos, social creatives, brand kits and UI visuals designed to look consistent and sharp across print and digital.",
    groups: [
      {
        title: "Design Software",
        dot: "#1c6bff",
        items: [
          b("Photoshop", "Ps", "#31a8ff"),
          b("Illustrator", "Ai", "#ff9a00"),
          b("InDesign", "Id", "#ff3366"),
          b("Canva", "Ca", "#00c4cc"),
        ],
      },
      {
        title: "UI & Prototyping",
        dot: "#8b5cf6",
        items: [
          t("Figma", FaFigma, "#f24e1e"),
          b("Adobe XD", "Xd", "#ff61f6"),
          b("Sketch", "Sk", "#f7b500"),
          b("Framer", "Fr", "#111111"),
        ],
      },
    ],
  },

  {
    id: "seo",
    title: "SEO",
    icon: FaSearch,
    description:
      "Search Engine Optimization that grows organic traffic with clean technical foundations, smart keywords and clear reporting.",
    groups: [
      {
        title: "Analytics & Research",
        dot: "#1c6bff",
        items: [
          t("Google Analytics", FaGoogle, "#f9ab00"),
          b("Search Console", "SC", "#4285f4"),
          b("SEMrush", "Se", "#ff642d"),
          b("Ahrefs", "Ah", "#e8590c"),
        ],
      },
      {
        title: "Technical SEO",
        dot: "#10b981",
        items: [
          b("Screaming Frog", "SF", "#4c9a2a"),
          b("Lighthouse", "Lh", "#f44b21"),
          b("Yoast", "Yo", "#a4286a"),
        ],
      },
    ],
  },

  {
    id: "marketing",
    title: "Marketing",
    icon: FaBullhorn,
    description:
      "Paid campaigns, email and CRM set up to bring in the right people and measure what actually converts.",
    groups: [
      {
        title: "Advertising",
        dot: "#1c6bff",
        items: [
          t("Google Ads", FaGoogle, "#4285f4"),
          t("Meta Ads", FaFacebook, "#0866ff"),
          t("YouTube Ads", FaYoutube, "#ff0000"),
          t("LinkedIn Ads", FaLinkedin, "#0a66c2"),
        ],
      },
      {
        title: "Email & CRM",
        dot: "#f97316",
        items: [
          b("Mailchimp", "Mc", "#d9a800"),
          b("HubSpot", "Hs", "#ff7a59"),
        ],
      },
    ],
  },
];


// ======================================================
// SMALL COMPONENTS
// ======================================================

const Glyph = ({ item, className = "" }) => {
  const Icon = item.icon;

  if (Icon) {
    return (
      <Icon
        className={`ts-glyph ${className}`}
        style={{ color: item.color }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={`ts-badge ${className}`}
      style={{ color: item.color, background: `${item.color}1a` }}
      aria-hidden="true"
    >
      {item.short}
    </span>
  );
};

const TechCard = ({ item }) => (
  <li className="ts-card">
    <Glyph item={item} />
    <span className="ts-card__name">{item.name}</span>
  </li>
);

// Simple laptop illustration (replace with your own PNG/SVG if you have one)
const Laptop = () => (
  <svg
    className="ts-laptop"
    viewBox="0 0 380 270"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ts-screen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2b2a63" />
        <stop offset="1" stopColor="#14123a" />
      </linearGradient>
      <linearGradient id="ts-base" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9def7" />
        <stop offset="1" stopColor="#b9c1ea" />
      </linearGradient>
      <linearGradient id="ts-plate" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#e9edff" />
        <stop offset="1" stopColor="#cfd6f6" />
      </linearGradient>
    </defs>

    {/* platform */}
    <ellipse cx="190" cy="238" rx="170" ry="26" fill="url(#ts-plate)" opacity="0.7" />

    {/* screen */}
    <g transform="rotate(-6 190 110)">
      <rect x="82" y="30" width="216" height="140" rx="10" fill="#1a1850" />
      <rect x="88" y="36" width="204" height="128" rx="6" fill="url(#ts-screen)" />
      <rect x="88" y="36" width="204" height="12" rx="6" fill="#3a3880" />
      <circle cx="98" cy="42" r="2" fill="#ff6b6b" />
      <circle cx="105" cy="42" r="2" fill="#ffd166" />
      <circle cx="112" cy="42" r="2" fill="#4ade80" />

      <g strokeLinecap="round" strokeWidth="4">
        <line x1="100" y1="64" x2="150" y2="64" stroke="#7c83ff" />
        <line x1="158" y1="64" x2="200" y2="64" stroke="#38bdf8" />
        <line x1="112" y1="78" x2="170" y2="78" stroke="#a78bfa" />
        <line x1="178" y1="78" x2="236" y2="78" stroke="#4ade80" />
        <line x1="112" y1="92" x2="156" y2="92" stroke="#f9a8d4" />
        <line x1="164" y1="92" x2="214" y2="92" stroke="#7c83ff" />
        <line x1="124" y1="106" x2="190" y2="106" stroke="#38bdf8" />
        <line x1="112" y1="120" x2="148" y2="120" stroke="#fbbf24" />
        <line x1="156" y1="120" x2="228" y2="120" stroke="#a78bfa" />
        <line x1="100" y1="134" x2="176" y2="134" stroke="#4ade80" />
        <line x1="184" y1="134" x2="214" y2="134" stroke="#f9a8d4" />
      </g>
    </g>

    {/* keyboard base */}
    <path d="M60 196 L290 160 L338 196 L108 236 Z" fill="url(#ts-base)" />
    <path d="M108 236 L338 196 L338 204 L108 245 Z" fill="#a9b2e0" />
    <path
      d="M118 200 L282 174 L312 196 L148 222 Z"
      fill="#2b2a63"
      opacity="0.9"
    />
    <path d="M178 214 L238 204 L250 214 L190 224 Z" fill="#c4cbf0" />
  </svg>
);


// ======================================================
// MAIN COMPONENT
// ======================================================

const Techstack = () => {
  const [activeId, setActiveId] = useState(categories[0].id);

  const current = categories.find((c) => c.id === activeId);

  // floating tiles: explicit list, or first 7 items of the category
  const floating =
    current.floating ||
    current.groups.flatMap((g) => g.items).slice(0, 7);

  return (
    <section className="ts-section" aria-labelledby="ts-heading">
      {/* HEADER */}
      <header className="ts-header">
        <div className="ts-pill">
          <FaCog className="ts-pill__icon" aria-hidden="true" />
          <span>TECHNOLOGIES WE USE</span>
        </div>

        <h2 id="ts-heading" className="ts-title">
          Leveraging Cutting-Edge Technologies
          <span className="ts-title__accent">to Power Your Vision</span>
        </h2>

        <p className="ts-lead">
          We use modern tools and technologies to deliver high-performing,
          scalable, and innovative digital solutions for your business.
        </p>
      </header>

      {/* 3 COLUMNS: menu | panel | illustration */}
      <div className="ts-layout">
        {/* LEFT MENU */}
        <nav className="ts-nav" aria-label="Technology categories">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeId;

            return (
              <button
                key={cat.id}
                type="button"
                className={`ts-nav__btn ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => setActiveId(cat.id)}
              >
                <span className="ts-nav__icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="ts-nav__label">{cat.title}</span>
                <FaChevronRight className="ts-nav__chev" aria-hidden="true" />
              </button>
            );
          })}
        </nav>

        {/* MIDDLE PANEL */}
        <div className="ts-panel" key={current.id}>
          <h3 className="ts-panel__title">{current.title}</h3>
          <p className="ts-panel__desc">{current.description}</p>

          {current.groups.map((group) => (
            <div className="ts-group" key={`${current.id}-${group.title}`}>
              <h4 className="ts-group__title">
                <span
                  className="ts-group__dot"
                  style={{ background: group.dot }}
                />
                {group.title}
              </h4>

              <ul className="ts-grid">
                {group.items.map((item) => (
                  <TechCard key={item.name} item={item} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* RIGHT ILLUSTRATION */}
        <aside className="ts-visual" aria-hidden="true" key={`v-${current.id}`}>
          <span className="ts-orbit" />
          <span className="ts-orbit ts-orbit--inner" />
          <span className="ts-dot ts-dot--1" />
          <span className="ts-dot ts-dot--2" />
          <span className="ts-dot ts-dot--3" />

          <Laptop />

          {floating.slice(0, 7).map((item, i) => (
            <div
              key={item.name}
              className={`ts-float ts-float--${i + 1}`}
            >
              <Glyph item={item} />
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
};

export default Techstack;
