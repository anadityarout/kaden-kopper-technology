import React, { useState } from "react";
import { LayoutGrid, ArrowRight } from "lucide-react";
import "./Service.css";

/* ---------- Illustrations (inline SVG, no image files needed) ---------- */
const WebArt = () => (
  <svg viewBox="0 0 160 120" aria-hidden="true">
    <defs>
      <linearGradient id="gWeb" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4f8cff" />
        <stop offset="1" stopColor="#1e3fd8" />
      </linearGradient>
    </defs>
    <rect x="34" y="28" width="92" height="60" rx="7" fill="url(#gWeb)" />
    <rect x="40" y="34" width="80" height="48" rx="4" fill="#1b2fbf" opacity=".55" />
    <path
      d="M70 48 L60 58 L70 68 M90 48 L100 58 L90 68 M83 44 L77 72"
      stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"
    />
    <path d="M22 92 H138 L130 100 H30 Z" fill="#c9d6f5" />
    <rect x="108" y="16" width="24" height="20" rx="6" fill="#7fb0fb" />
    <rect x="114" y="22" width="12" height="8" rx="2" fill="#fff" opacity=".9" />
  </svg>
);

const AppArt = () => (
  <svg viewBox="0 0 160 120" aria-hidden="true">
    <defs>
      <linearGradient id="gApp" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8b5cf6" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <rect x="36" y="26" width="44" height="82" rx="9" fill="#cdbdf7" transform="rotate(-10 58 67)" />
    <rect x="72" y="12" width="48" height="92" rx="10" fill="url(#gApp)" />
    <rect x="78" y="20" width="36" height="76" rx="6" fill="#fff" opacity=".15" />
    <circle cx="96" cy="40" r="9" fill="#fff" opacity=".9" />
    <rect x="82" y="58" width="28" height="6" rx="3" fill="#fff" opacity=".8" />
    <rect x="82" y="70" width="28" height="6" rx="3" fill="#fff" opacity=".5" />
    <rect x="110" y="70" width="28" height="28" rx="8" fill="#b79cf5" />
    <circle cx="124" cy="84" r="7" fill="none" stroke="#fff" strokeWidth="3" />
  </svg>
);

const VideoArt = () => (
  <svg viewBox="0 0 160 120" aria-hidden="true">
    <defs>
      <linearGradient id="gVid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3b4a6b" />
        <stop offset="1" stopColor="#1c2438" />
      </linearGradient>
    </defs>
    <rect x="22" y="30" width="116" height="70" rx="8" fill="url(#gVid)" />
    <rect x="30" y="38" width="14" height="38" rx="3" fill="#56627f" />
    <rect x="50" y="38" width="80" height="38" rx="4" fill="#0f1524" />
    <circle cx="90" cy="57" r="13" fill="#2f7bf5" />
    <path d="M86 50 L98 57 L86 64 Z" fill="#fff" />
    <rect x="50" y="82" width="46" height="5" rx="2.5" fill="#8b5cf6" />
    <rect x="100" y="82" width="30" height="5" rx="2.5" fill="#3b82f6" />
    <rect x="50" y="90" width="64" height="4" rx="2" fill="#56627f" />
    <rect x="108" y="16" width="30" height="24" rx="7" fill="#3b82f6" />
    <rect x="114" y="23" width="13" height="10" rx="2" fill="none" stroke="#fff" strokeWidth="2.5" />
  </svg>
);

const GraphicArt = () => (
  <svg viewBox="0 0 160 120" aria-hidden="true">
    <defs>
      <linearGradient id="gGra" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4f7cff" />
        <stop offset="1" stopColor="#6d3df0" />
      </linearGradient>
    </defs>
    <path d="M52 30 L92 30 L104 60 L74 100 L40 62 Z" fill="url(#gGra)" />
    <path d="M52 30 L92 30 L98 46 L58 46 Z" fill="#fff" opacity=".25" />
    <circle cx="74" cy="64" r="6" fill="#fff" />
    <path d="M74 70 L74 98" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    <circle cx="72" cy="20" r="4" fill="#8b5cf6" />
    <path d="M72 24 L72 30" stroke="#8b5cf6" strokeWidth="2" />
    <rect x="108" y="40" width="12" height="40" rx="3" fill="#fbbf24" transform="rotate(20 114 60)" />
    <rect x="118" y="44" width="12" height="40" rx="3" fill="#f43f5e" transform="rotate(20 124 64)" />
    <rect x="128" y="48" width="12" height="36" rx="3" fill="#a855f7" transform="rotate(20 134 66)" />
  </svg>
);

const SeoArt = () => (
  <svg viewBox="0 0 160 120" aria-hidden="true">
    <defs>
      <linearGradient id="gSeo" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#3b3f9e" />
        <stop offset="1" stopColor="#1e2a6e" />
      </linearGradient>
    </defs>
    <rect x="22" y="26" width="104" height="72" rx="8" fill="#f4f7ff" stroke="#d6e0f7" />
    <path d="M22 34 a8 8 0 0 1 8 -8 h88 a8 8 0 0 1 8 8 v8 h-104 Z" fill="url(#gSeo)" />
    <circle cx="32" cy="34" r="2.5" fill="#fbbf24" />
    <circle cx="40" cy="34" r="2.5" fill="#f87171" />
    <rect x="32" y="82" width="9" height="10" rx="2" fill="#93b4f5" />
    <rect x="46" y="74" width="9" height="18" rx="2" fill="#6b97f0" />
    <rect x="60" y="64" width="9" height="28" rx="2" fill="#3b82f6" />
    <rect x="80" y="50" width="34" height="5" rx="2.5" fill="#dbe5fb" />
    <circle cx="106" cy="68" r="17" fill="#fff" fillOpacity=".55" stroke="#2f7bf5" strokeWidth="6" />
    <path d="M118 80 L134 96" stroke="#2f7bf5" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

const MarketingArt = () => (
  <svg viewBox="0 0 160 120" aria-hidden="true">
    <defs>
      <linearGradient id="gMkt" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8b5cf6" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <path d="M60 52 L108 26 L108 90 L60 70 Z" fill="url(#gMkt)" />
    <rect x="44" y="50" width="24" height="22" rx="6" fill="#6d4ee8" />
    <path d="M58 72 L66 96 L78 96 L72 74 Z" fill="#c4b5fd" />
    <ellipse cx="108" cy="58" rx="8" ry="32" fill="#a78bfa" />
    <rect x="22" y="40" width="22" height="22" rx="7" fill="#f43f5e" />
    <circle cx="33" cy="51" r="5" fill="none" stroke="#fff" strokeWidth="2.5" />
    <rect x="118" y="24" width="24" height="24" rx="7" fill="#7c3aed" />
    <text x="130" y="43" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff">f</text>
    <rect x="124" y="74" width="22" height="22" rx="6" fill="#2f7bf5" />
    <text x="135" y="90" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">in</text>
  </svg>
);

/* ---------- Data ---------- */
/* ---------- Data ---------- */
const services = [
  {
    id: "web",
    number: "01",
    title: "Web Development",
    text: "Modern & responsive websites that convert visitors into customers.",
    Art: WebArt,
    href: "/services/web-development",
  },
  {
    id: "app",
    number: "02",
    title: "App Developer",
    text: "Powerful & scalable mobile applications for your business.",
    Art: AppArt,
    href: "/services/app-development",
  },
  {
    id: "video",
    number: "03",
    title: "Video Editor",
    text: "Engaging videos that tell your story and boost your brand.",
    Art: VideoArt,
    href: "/services/video-editor",
  },
  {
    id: "graphic",
    number: "04",
    title: "Graphic Designer",
    text: "Creative designs that build your brand identity.",
    Art: GraphicArt,
    href: "/services/graphic-designer",
  },
  {
    id: "seo",
    number: "05",
    title: "SEO",
    text: "Search Engine Optimization to rank higher. Get found.",
    Art: SeoArt,
    href: "/services/seo",
  },
  {
    id: "marketing",
    number: "06",
    title: "Marketing",
    text: "Smart marketing strategies that work and drive real results.",
    Art: MarketingArt,
    href: "/services/marketing",
  },
];

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section className="kk-services" aria-labelledby="kk-services-heading">
      <div className="kk-services__head">
        <span className="kk-services__badge">
          <LayoutGrid size={16} strokeWidth={2.2} aria-hidden="true" />
          OUR SERVICES
        </span>

        <h2 id="kk-services-heading" className="kk-services__heading">
          Solutions Designed for <span>Your Growth</span>
        </h2>

        <p className="kk-services__sub">
          From development to marketing, we provide end-to-end digital
          solutions to help your business succeed.
        </p>
      </div>

      <div className="kk-services__grid">
        {services.map(({ id, number, title, text, Art, href }, i) => (
          <article
            key={id}
            className={`kk-card ${i % 2 === 0 ? "kk-card--blue" : "kk-card--purple"} ${
              active === i ? "is-active" : ""
            }`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <span className="kk-card__num">{number}</span>

            <div className="kk-card__img">
              <Art />
            </div>

            <h3 className="kk-card__title">{title}</h3>
            <p className="kk-card__text">{text}</p>

            <a className="kk-card__foot" href={href}>
              <span className="kk-card__more">Learn More</span>
              <span className="kk-card__arrow">
                <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
              </span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}     