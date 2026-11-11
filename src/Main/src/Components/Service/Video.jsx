import React, { useEffect, useMemo, useState } from "react";

import "./Video.css";

// =====================================================
// AWS API
// =====================================================

const VIDEO_EDITOR_API =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/videoeditor";

// =====================================================
// HELPERS
// =====================================================

function getImageUrl(item) {
  return (
    item?.preview ||
    item?.image ||
    item?.imageUrl ||
    item?.fileUrl ||
    ""
  );
}

// Colors the last two words of the banner name with the gradient
function renderTitle(name) {
  const text = String(name || "").trim();
  const words = text.split(/\s+/);

  if (words.length < 3) {
    return <span className="kk-hero-gradient">{text}</span>;
  }

  const split = words.length - 2;

  return (
    <>
      <span className="kk-hero-lead">{words.slice(0, split).join(" ")}</span>
      <span className="kk-hero-gradient">{words.slice(split).join(" ")}</span>
    </>
  );
}

// =====================================================
// STATS (edit the numbers to your real figures)
// =====================================================

const stats = [
  { icon: "play", tone: "blue", value: "800+", change: "+18.3%", label: "Video Projects Completed", points: [34, 50, 38, 58, 44, 72, 50, 80, 62, 92] },
  { icon: "users", tone: "purple", value: "620+", change: "+24.1%", label: "Happy Clients", points: [40, 30, 52, 38, 62, 46, 70, 54, 84, 66] },
  { icon: "star", tone: "sky", value: "95%", change: "+22.3%", label: "Client Satisfaction", points: [36, 54, 40, 66, 46, 58, 70, 52, 84, 76] },
  { icon: "clock", tone: "magenta", value: "98%", change: "+12.6%", label: "On-Time Delivery", points: [44, 34, 58, 42, 66, 50, 78, 58, 74, 90] },
];

// =====================================================
// SERVICES (fallback when admin has no "Video Editing" items)
// =====================================================

const fallbackServices = [
  { icon: "smartphone", title: "Social Media Video Editing", desc: "Short-form, high-engagement videos for Instagram, TikTok, YouTube and more." },
  { icon: "play", title: "YouTube Video Editing", desc: "Professional editing for YouTube channels, vlogs, tutorials and commercials." },
  { icon: "clapper", title: "Corporate Video Editing", desc: "Clean, professional videos for your brand, business and presentations." },
  { icon: "sparkles", title: "Motion Graphics & VFX", desc: "Add stunning effects, animations and motion graphics to your videos." },
  { icon: "reel", title: "Reels & Short Video Editing", desc: "Engaging reels and short videos for maximum reach and engagement." },
];

// =====================================================
// TECHNOLOGY STACK
// =====================================================

const tools = [
  { name: "Premiere Pro", short: "Pr", className: "premiere", logo: "/images/tools/premiere.png" },
  { name: "After Effects", short: "Ae", className: "after-effects", logo: "/images/tools/after-effects.png" },
  { name: "DaVinci Resolve", short: "Da", className: "davinci", logo: "/images/tools/davinci.png" },
  { name: "CapCut", short: "CC", className: "capcut", logo: "/images/tools/capcut.png" },
  { name: "Filmora", short: "Fi", className: "filmora", logo: "/images/tools/filmora.png" },
  { name: "Adobe Audition", short: "Au", className: "audition", logo: "/images/tools/audition.png" },
  { name: "Blender", short: "Bl", className: "blender", logo: "/images/tools/blender.png" },
];

const stackFeatures = [
  { icon: "scissors", label: "Editing" },
  { icon: "palette", label: "Color Grading" },
  { icon: "sparkles", label: "Effects" },
  { icon: "music", label: "Sound Design" },
  { icon: "monitor", label: "Rendering" },
];

// Put your 3D stack picture here (see notes). Falls back to the drawn stack.
const STACK_IMAGE = "/images/video-stack.png";

// =====================================================
// PROCESS
// =====================================================

const processSteps = [
  { icon: "upload", title: "Share Your Vision", desc: "Tell us about your project, ideas and requirements." },
  { icon: "sliders", title: "Edit & Enhance", desc: "We craft your video with precision and creativity." },
  { icon: "edit", title: "Review & Feedback", desc: "You review the draft and share your feedback." },
  { icon: "rocket", title: "Final Delivery", desc: "Get your high-quality video on time, ready to publish." },
  { icon: "headset", title: "Ongoing Support", desc: "We're here for updates and future editing needs." },
];

// =====================================================
// INDUSTRIES
// =====================================================

const industries = [
  { icon: "cart", label: "E-commerce & Retail" },
  { icon: "heart", label: "Healthcare" },
  { icon: "home", label: "Real Estate" },
  { icon: "cap", label: "Education & E-learning" },
  { icon: "plane", label: "Travel & Hospitality" },
  { icon: "building", label: "Corporate & Business" },
  { icon: "play", label: "Media & Entertainment" },
  { icon: "rocket", label: "Startups & IT Companies" },
];

// =====================================================
// FAQ
// =====================================================

const faqs = [
  {
    q: "What types of videos do you edit?",
    a: "We edit YouTube videos, reels, ads, corporate videos, events, weddings, and more.",
  },
  {
    q: "How long does it take to edit a video?",
    a: "Turnaround typically ranges from 24 hours to a few days, depending on video length and complexity.",
  },
  {
    q: "Can you add subtitles and captions?",
    a: "Yes, we offer subtitle and caption services in multiple languages and styles.",
  },
  {
    q: "What file formats do you deliver?",
    a: "We deliver in MP4, MOV, and any other format you require for your platform.",
  },
  {
    q: "Can you work with raw footage from any device?",
    a: "Absolutely — just share your raw footage and references and we'll take it from there.",
  },
  {
    q: "Do you provide revisions?",
    a: "Yes, revisions are included so the final video matches your vision.",
  },
];

// =====================================================
// ICON PATHS
// =====================================================

const ICON_PATHS = {
  scissors: "M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM20 4L8.5 12M8.5 12L20 20M6 9l6 3",
  reel: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 3v6M12 15v6M3 12h6M15 12h6",
  megaphone: "M3 11v2a1 1 0 001 1h2l7 4V6l-7 4H4a1 1 0 00-1 1zM16 8a4 4 0 010 8",
  briefcase: "M3 8h18v11H3V8zM8 8V6a2 2 0 012-2h4a2 2 0 012 2v2",
  clapper: "M3 8l14-4 2 4-14 4-2-4zM3 8h18v12H3V8z",
  palette: "M12 3a9 9 0 100 18c1 0 1.5-.6 1.5-1.5S13 18 13 17a1.5 1.5 0 011.5-1.5H16a4 4 0 004-4c0-4.4-3.6-8.5-8-8.5zM7 12a1 1 0 100-2 1 1 0 000 2zM9 8a1 1 0 100-2 1 1 0 000 2zM14 7a1 1 0 100-2 1 1 0 000 2zM16.5 11a1 1 0 100-2 1 1 0 000 2z",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  monitor: "M4 4h16v11H4V4zM9 20h6M12 15v5",
  check: "M5 12l5 5L20 7",
  arrow: "M5 12h14M13 6l6 6-6 6",
  play: "M7 4l13 8-13 8V4z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1L12 2z",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2",
  smartphone: "M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zM12 18h.01",
  sparkles: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z",
  music: "M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z",
  sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  rocket: "M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 00-2.9-.1zM12 15l-3-3a22 22 0 012-4A13 13 0 0122 2c0 2.7-.8 7.5-6 11a22 22 0 01-4 2zM9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5",
  headset: "M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z",
  cart: "M9 22a1 1 0 100-2 1 1 0 000 2zM20 22a1 1 0 100-2 1 1 0 000 2zM1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6",
  heart: "M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 000-7.8z",
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM9 22V12h6v10",
  cap: "M22 10L12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5",
  plane: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  building: "M4 22V4a1 1 0 011-1h9a1 1 0 011 1v18M15 9h4a1 1 0 011 1v12M9 7h2M9 11h2M9 15h2M2 22h20",
};

function Icon({ type }) {
  const path = ICON_PATHS[type];

  if (!path) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill={type === "play" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

// Smooth sparkline for the stat cards
function Sparkline({ points }) {
  const w = 120;
  const h = 34;
  const pad = 3;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(
    (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
  );

  let line = `M${xs[0]},${ys[0]}`;
  for (let i = 1; i < points.length; i += 1) {
    const cx = (xs[i - 1] + xs[i]) / 2;
    line += ` C${cx},${ys[i - 1]} ${cx},${ys[i]} ${xs[i]},${ys[i]}`;
  }

  return (
    <svg
      className="kv-spark"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={`${line} L${w},${h} L0,${h} Z`} fill="currentColor" fillOpacity="0.1" />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Isometric layered "stack" illustration
function StackArt() {
  const layers = [160, 118, 76, 34];

  return (
    <svg viewBox="0 0 220 250" aria-hidden="true">
      <defs>
        <linearGradient id="kkStackTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="kkStackLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="kkStackRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d4ed8" />
          <stop offset="1" stopColor="#172554" />
        </linearGradient>
        <radialGradient id="kkStackGlow">
          <stop offset="0" stopColor="#60a5fa" stopOpacity="0.55" />
          <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="110" cy="236" rx="100" ry="14" fill="url(#kkStackGlow)" />

      {layers.map((y) => (
        <g key={y}>
          <polygon points={`110,${y + 72} 30,${y + 36} 30,${y + 52} 110,${y + 88}`} fill="url(#kkStackLeft)" />
          <polygon points={`110,${y + 72} 190,${y + 36} 190,${y + 52} 110,${y + 88}`} fill="url(#kkStackRight)" />
          <polygon
            points={`110,${y} 190,${y + 36} 110,${y + 72} 30,${y + 36}`}
            fill="url(#kkStackTop)"
            stroke="#bae6fd"
            strokeOpacity="0.7"
            strokeWidth="1"
          />
        </g>
      ))}
    </svg>
  );
}

// =====================================================
// VIDEO COMPONENT
// =====================================================

function Video() {
  const [openFaq, setOpenFaq] = useState(null);

  const [items, setItems] = useState([]);
  const [videoLoading, setVideoLoading] = useState(true);

  // tool logos / stack picture that failed to load fall back to the built-in art
  const [brokenLogos, setBrokenLogos] = useState({});
  const [stackImageFailed, setStackImageFailed] = useState(false);

  // =====================================================
  // LOAD DATA FROM AWS
  // =====================================================

  useEffect(() => {
    const controller = new AbortController();

    const loadVideoEditorData = async () => {
      try {
        setVideoLoading(true);

        const response = await fetch(VIDEO_EDITOR_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load Video Editor data: ${response.status}`
          );
        }

        const data = await response.json();

        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Video Editor API error:", error);
        setItems([]);
      } finally {
        if (!controller.signal.aborted) {
          setVideoLoading(false);
        }
      }
    };

    loadVideoEditorData();

    return () => controller.abort();
  }, []);

  // =====================================================
  // DERIVED DATA
  // =====================================================

  // Latest banner that has an image
  const banner = useMemo(() => {
    const banners = items.filter(
      (item) => item.category === "Banner" && getImageUrl(item)
    );
    return banners.length ? banners[banners.length - 1] : null;
  }, [items]);

  const bannerImage = banner ? getImageUrl(banner) : "";
  const bannerName = banner?.name || "";
  const bannerDescription = banner?.description || "";

  const videoEditingItems = useMemo(
    () => items.filter((item) => item.category === "Video Editing"),
    [items]
  );

  // "What We Build" cards: admin items if any, otherwise the static ones
  const serviceCards = useMemo(() => {
    if (videoEditingItems.length) {
      return videoEditingItems.map((item, index) => ({
        key: item.id ?? `${item.name}-${index}`,
        title: item.name,
        desc: item.description,
        image: getImageUrl(item),
        icon: "play",
      }));
    }

    return fallbackServices.map((service) => ({
      ...service,
      key: service.title,
      image: "",
    }));
  }, [videoEditingItems]);

  const toggleFaq = (index) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <main className="kk-video-page">

      {/* =====================================================
          HERO (image + name + description from admin dashboard)
          Upload only the right-side artwork (no text) as the image.
      ===================================================== */}

      <section className="kk-video-hero">
        {bannerImage ? (
          <div className="kk-hero-split">
            <div className="kk-hero-text">
              <span className="kk-hero-badge">Professional Video Editing</span>

              {bannerName && <h1>{renderTitle(bannerName)}</h1>}

              {bannerDescription && <p>{bannerDescription}</p>}

              <div className="kk-hero-actions">
                <a
                  href="/contact"
                  className="kk-hero-btn kk-hero-btn-primary"
                >
                  Start Your Project Now <span aria-hidden="true">→</span>
                </a>

                <a
                  href="#kk-video-services"
                  className="kk-hero-btn kk-hero-btn-outline"
                >
                  <span className="kk-play-dot" aria-hidden="true">
                    ▶
                  </span>
                  View Our Work
                </a>
              </div>
            </div>

            <div className="kk-hero-visual">
              <img src={bannerImage} alt="" />
            </div>
          </div>
        ) : (
          <div className="kk-video-hero-simple" />
        )}
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="kv-stats" aria-label="Our results">
        <div className="kv-stats-grid">
          {stats.map((stat) => (
            <div className={`kv-stat kv-tone-${stat.tone}`} key={stat.label}>
              <div className="kv-stat-top">
                <span className="kv-stat-icon">
                  <Icon type={stat.icon} />
                </span>

                <div className="kv-stat-text">
                  <div className="kv-stat-value-row">
                    <span className="kv-stat-value">{stat.value}</span>
                    <span className="kv-stat-change">↑ {stat.change}</span>
                  </div>

                  <div className="kv-stat-label">{stat.label}</div>
                </div>
              </div>

              <Sparkline points={stat.points} />
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          WHAT WE BUILD (admin "Video Editing" items)
      ===================================================== */}

      <section className="kv-sec kv-services" id="kk-video-services">
        <header className="kv-sec-head">
          <span className="kv-eyebrow">Our Services</span>
          <h2>What We Build</h2>
          <p>End-to-end video editing solutions tailored to your business needs.</p>
        </header>

        <div className="kv-svc-grid">
          {videoLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div className="kv-svc-skeleton" key={index} aria-hidden="true" />
              ))
            : serviceCards.map((card) => (
                <article className="kv-svc-card" key={card.key}>
                  <div className="kv-svc-media">
                    {card.image ? (
                      <img src={card.image} alt="" loading="lazy" />
                    ) : (
                      <span className="kv-svc-icon">
                        <Icon type={card.icon} />
                      </span>
                    )}
                  </div>

                  {card.title && <h3>{card.title}</h3>}
                  {card.desc && <p>{card.desc}</p>}

                  <a
                    className="kv-svc-go"
                    href="/contact"
                    aria-label={`Start a project: ${card.title || "video editing"}`}
                  >
                    <Icon type="arrow" />
                  </a>
                </article>
              ))}
        </div>
      </section>

      {/* =====================================================
          TECHNOLOGY STACK
      ===================================================== */}

      <section className="kv-sec kv-stack">
        <div className="kv-stack-main">
          <header className="kv-sec-head">
            <span className="kv-eyebrow">Technologies We Use</span>
            <h2>Our Video Editing Technology Stack</h2>
            <p>We work with industry-leading tools to deliver professional-quality videos.</p>
          </header>

          <div className="kv-tool-row">
            {tools.map((tool) => (
              <div className="kv-tool" key={tool.name}>
                {tool.logo && !brokenLogos[tool.name] ? (
                  <img
                    className="kv-tool-logo"
                    src={tool.logo}
                    alt=""
                    loading="lazy"
                    onError={() =>
                      setBrokenLogos((current) => ({ ...current, [tool.name]: true }))
                    }
                  />
                ) : (
                  <span className={`kv-tool-badge ${tool.className}`}>{tool.short}</span>
                )}
                <span className="kv-tool-name">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="kv-stack-visual">
          <div className="kv-stack-art">
            {stackImageFailed ? (
              <StackArt />
            ) : (
              <img
                src={STACK_IMAGE}
                alt=""
                loading="lazy"
                onError={() => setStackImageFailed(true)}
              />
            )}
          </div>

          <ul className="kv-stack-pills">
            {stackFeatures.map((feature) => (
              <li key={feature.label}>
                <span className="kv-pill-icon">
                  <Icon type={feature.icon} />
                </span>
                {feature.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="kv-sec kv-process">
        <header className="kv-sec-head">
          <span className="kv-eyebrow">Our Process</span>
          <h2>A Simple Process for Amazing Results</h2>
          <p>From concept to final cut, we make video editing easy, efficient and stress-free.</p>
        </header>

        <ol className="kv-ptrack">
          {processSteps.map((step, index) => (
            <li className="kv-pstep" key={step.title}>
              <span className="kv-pcircle">{String(index + 1).padStart(2, "0")}</span>

              <span className="kv-picon">
                <Icon type={step.icon} />
              </span>

              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* =====================================================
          INDUSTRIES
      ===================================================== */}

      <section className="kv-sec kv-industries">
        <header className="kv-sec-head">
          <span className="kv-eyebrow">Industries We Serve</span>
          <h2>Video Solutions for Every Industry</h2>
          <p>We deliver industry-specific video solutions tailored to unique business challenges.</p>
        </header>

        <div className="kv-ind-grid">
          {industries.map((industry) => (
            <div className="kv-ind" key={industry.label}>
              <Icon type={industry.icon} />
              <span>{industry.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="kk-video-faq">
        <h2>Frequently Asked Questions</h2>

        <p className="kk-section-sub">
          Find answers to common questions about our video editing services.
        </p>

        <div className="kk-faq-grid">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                className={`kk-faq-item ${isOpen ? "kk-faq-open" : ""}`}
                key={faq.q}
              >
                <button
                  type="button"
                  className="kk-faq-question"
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(index)}
                >
                  <span className="kk-faq-q-text">{faq.q}</span>

                  <span className="kk-faq-toggle" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && <p className="kk-faq-answer">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="kk-video-cta">
        <div className="kk-video-cta-inner">
          <span className="kk-cta-icon" aria-hidden="true">
            🎬
          </span>

          <div>
            <h3>Ready to Create Stunning Videos?</h3>

            <p>
              Let's turn your raw footage into powerful stories that engage
              your audience and grow your brand.
            </p>
          </div>

          <a href="/contact" className="kk-btn-primary">
            Start Your Project Now →
          </a>
        </div>
      </section>
    </main>
  );
}

export default Video;
