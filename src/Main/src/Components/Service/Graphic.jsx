import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Graphic.css";

import {
  PenTool,
  Image as ImageIcon,
  Printer,
  Package,
  MonitorSmartphone,
  BarChart3,
  Users,
  Search,
  Pencil,
  RefreshCw,
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowUp,
  Plus,
  Minus,
  Play,
  Star,
  Headphones,
  Sparkles,
  Palette,
  Layers,
  Share2,
  Camera,
  ThumbsUp,
  Briefcase,
  FileText,
  BookOpen,
  Newspaper,
  Gift,
  Tag,
  Boxes,
  LayoutDashboard,
  Smartphone,
  MousePointer2,
  TrendingUp,
  Brush,
  Shapes,
  Target,
  Award,
  Clock,
  Lightbulb,
} from "lucide-react";

const GRAPHIC_DESIGN_API =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/graphicdesign";

/* =====================================================
   HERO (BANNER) - DEFAULTS + HELPERS
===================================================== */

const DEFAULT_HERO_TITLE = "Creative Designs That Build Stronger Brands";

const DEFAULT_HERO_DESCRIPTION =
  "We turn your ideas into stunning visuals that communicate your brand story, attract customers and leave a lasting impression. From logo design to social media creatives, we deliver designs that make your business stand out.";

const trustAvatars = [
  { letter: "A", bg: "linear-gradient(135deg, #2563ff, #7c3aed)" },
  { letter: "P", bg: "linear-gradient(135deg, #ec4899, #f97316)" },
  { letter: "R", bg: "linear-gradient(135deg, #14b8a6, #2563ff)" },
  { letter: "S", bg: "linear-gradient(135deg, #a855f7, #ec4899)" },
];

/*
  Splits the banner name into a white part and a gradient part.
  - If the admin name contains "|", everything after "|" is gradient:
      "Creative Designs That Build | Stronger Brands"
  - Otherwise the last 2 words are made gradient automatically.
*/
const splitHeading = (text) => {
  const clean = String(text || "").trim();

  if (!clean) {
    return { plain: "", accent: "" };
  }

  if (clean.includes("|")) {
    const [first, ...rest] = clean.split("|");

    return {
      plain: first.trim(),
      accent: rest.join(" ").trim(),
    };
  }

  const words = clean.split(/\s+/);

  if (words.length < 3) {
    return { plain: "", accent: clean };
  }

  const accentCount = words.length >= 9 ? 5 : 2;

  return {
    plain: words.slice(0, words.length - accentCount).join(" "),
    accent: words.slice(words.length - accentCount).join(" "),
  };
};

/* matches categories ignoring case and extra spaces */
const sameCategory = (value, wanted) =>
  String(value || "").trim().toLowerCase() === wanted;

/* =====================================================
   STATS
   Put the numbers, colors and chart shapes here.
===================================================== */

const stats = [
  {
    Icon: BarChart3,
    value: "500+",
    label: "Projects Completed",
    change: "18.3%",
    color: "#2563ff",
    tint: "#e0ecff",
    points: [40, 36, 38, 30, 33, 26, 28, 20, 23, 15, 17, 9, 11, 5],
  },
  {
    Icon: Users,
    value: "320+",
    label: "Happy Clients",
    change: "24.1%",
    color: "#7c3aed",
    tint: "#efe7ff",
    points: [42, 38, 40, 33, 35, 28, 30, 22, 25, 18, 19, 12, 10, 6],
  },
  {
    Icon: Star,
    value: "98%",
    label: "Client Satisfaction",
    change: "22.3%",
    color: "#06b6d4",
    tint: "#dff7fb",
    points: [38, 40, 33, 36, 28, 31, 24, 27, 19, 21, 14, 16, 8, 5],
  },
  {
    Icon: Headphones,
    value: "24/7",
    label: "Design Support",
    change: "12.6%",
    color: "#ec4899",
    tint: "#fde7f1",
    points: [40, 37, 39, 32, 34, 29, 31, 24, 26, 20, 17, 14, 9, 6],
  },
];

/* small wavy chart at the bottom of each stat card */
function Sparkline({ points, color, id }) {
  const w = 200;
  const h = 50;
  const step = w / (points.length - 1);

  const line =
    "M" + points.map((y, i) => `${(i * step).toFixed(1)},${y}`).join(" L");

  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg
      className="kk-graphic-spark"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={area} fill={`url(#${id})`} />

      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* =====================================================
   SERVICES
   Each card draws its own icon artwork (no image files needed):
   - Icon + gradient  = the big center tile
   - extras           = 3 small floating tiles around it
   - glow             = soft color behind the artwork
===================================================== */

const services = [
  {
    Icon: PenTool,
    gradient: "linear-gradient(135deg, #2563ff, #7c3aed)",
    glow: "rgba(124, 92, 255, 0.20)",
    extras: [
      { Icon: Sparkles, bg: "#ffffff", color: "#7c3aed" },
      { Icon: Palette, bg: "#ffffff", color: "#ec4899" },
      { Icon: Layers, bg: "#ffffff", color: "#2563ff" },
    ],
    title: "Logo Design & Branding",
    desc: "Unique and memorable logos that reflect your brand's values and create a strong first impression.",
  },
  {
    Icon: Share2,
    gradient: "linear-gradient(135deg, #ec4899, #f97316)",
    glow: "rgba(236, 72, 153, 0.18)",
    extras: [
      {
        Icon: Camera,
        bg: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)",
        color: "#ffffff",
      },
      { Icon: ThumbsUp, bg: "#1877f2", color: "#ffffff" },
      { Icon: Briefcase, bg: "#0a66c2", color: "#ffffff" },
    ],
    title: "Social Media Design",
    desc: "Eye-catching social media posts, stories, banners, and covers that increase engagement and reach.",
  },
  {
    Icon: Printer,
    gradient: "linear-gradient(135deg, #f97316, #ec4899)",
    glow: "rgba(249, 115, 22, 0.18)",
    extras: [
      { Icon: FileText, bg: "#ffffff", color: "#2563ff" },
      { Icon: BookOpen, bg: "#ffffff", color: "#ec4899" },
      { Icon: Newspaper, bg: "#ffffff", color: "#f97316" },
    ],
    title: "Print Design",
    desc: "Professional designs for business cards, brochures, flyers, posters, and other print materials that make your brand look credible.",
  },
  {
    Icon: Package,
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    glow: "rgba(245, 158, 11, 0.18)",
    extras: [
      { Icon: Gift, bg: "#ffffff", color: "#ec4899" },
      { Icon: Tag, bg: "#ffffff", color: "#7c3aed" },
      { Icon: Boxes, bg: "#ffffff", color: "#f59e0b" },
    ],
    title: "Packaging Design",
    desc: "Innovative packaging designs that protect your product and attract customers on the shelf.",
  },
  {
    Icon: MonitorSmartphone,
    gradient: "linear-gradient(135deg, #06b6d4, #2563ff)",
    glow: "rgba(37, 99, 255, 0.18)",
    extras: [
      { Icon: LayoutDashboard, bg: "#ffffff", color: "#2563ff" },
      { Icon: Smartphone, bg: "#ffffff", color: "#7c3aed" },
      { Icon: MousePointer2, bg: "#ffffff", color: "#06b6d4" },
    ],
    title: "UI/UX Graphics",
    desc: "Clean and intuitive interface designs for websites and mobile apps that enhance user experience.",
  },
  {
    Icon: BarChart3,
    gradient: "linear-gradient(135deg, #7c3aed, #ec4899)",
    glow: "rgba(168, 85, 247, 0.20)",
    extras: [
      { Icon: TrendingUp, bg: "#ffffff", color: "#2563ff" },
      { Icon: Brush, bg: "#ffffff", color: "#ec4899" },
      { Icon: Shapes, bg: "#ffffff", color: "#7c3aed" },
    ],
    title: "Illustration & Infographics",
    desc: "Custom illustrations and infographics that simplify complex information and make your story visually engaging.",
  },
];

/* =====================================================
   PROCESS
===================================================== */

const processSteps = [
  {
    Icon: Search,
    title: "Understand",
    desc: "We learn about your project, ideas, target audience, and design requirements.",
    gradient: "linear-gradient(135deg, #22d3ee, #2563ff)",
    rgb: "37, 99, 255",
    color: "#2563ff",
  },
  {
    Icon: Lightbulb,
    title: "Research & Concept",
    desc: "We analyze your industry, competitors, and create inspiring design concepts.",
    gradient: "linear-gradient(135deg, #a855f7, #6d28d9)",
    rgb: "124, 58, 237",
    color: "#7c3aed",
  },
  {
    Icon: Pencil,
    title: "Design & Develop",
    desc: "Our designers bring your ideas to life with creative and modern designs.",
    gradient: "linear-gradient(135deg, #38bdf8, #2563ff)",
    rgb: "14, 165, 233",
    color: "#0ea5e9",
  },
  {
    Icon: RefreshCw,
    title: "Review & Refine",
    desc: "We share drafts, gather feedback, and make revisions until it's perfect.",
    gradient: "linear-gradient(135deg, #e879f9, #c026d3)",
    rgb: "217, 70, 239",
    color: "#d946ef",
  },
  {
    Icon: Send,
    title: "Deliver",
    desc: "Final designs are delivered in high-quality formats, ready to use anywhere.",
    gradient: "linear-gradient(135deg, #38bdf8, #2563ff)",
    rgb: "37, 99, 255",
    color: "#2563ff",
  },
];

/* =====================================================
   WHY CHOOSE US
===================================================== */

const advantages = [
  {
    Icon: PenTool,
    title: "Creative & Original Designs",
    desc: "Custom designs that reflect your brand's unique identity.",
    color: "#2563ff",
    tint: "#e0ecff",
  },
  {
    Icon: Users,
    title: "Experienced Design Team",
    desc: "Skilled designers with expertise in multiple design styles.",
    color: "#7c3aed",
    tint: "#efe7ff",
  },
  {
    Icon: Target,
    title: "Brand-Focused Approach",
    desc: "Designs that align with your business goals and brand values.",
    color: "#ec4899",
    tint: "#fde7f1",
  },
  {
    Icon: Award,
    title: "High-Quality Outputs",
    desc: "Pixel-perfect, print-ready, and web-optimized designs.",
    color: "#f59e0b",
    tint: "#fef3dc",
  },
  {
    Icon: Clock,
    title: "On-Time Delivery",
    desc: "We value your time and ensure every project is delivered on schedule.",
    color: "#10b981",
    tint: "#dcf7ec",
  },
];

/* =====================================================
   CAPABILITIES
===================================================== */

const capabilities = [
  "High-resolution & print-ready files",
  "Multiple file formats (JPG, PNG, PDF, SVG, AI)",
  "Brand guidelines & style consistency",
  "Editable source files",
  "Fast turnaround time",
];

/* =====================================================
   DESIGN TOOLS
===================================================== */

const tools = [
  { name: "Adobe Photoshop", kind: "adobe", label: "Ps", bg: "#001E36", fg: "#31A8FF" },
  { name: "Adobe Illustrator", kind: "adobe", label: "Ai", bg: "#330000", fg: "#FF9A00" },
  { name: "Adobe InDesign", kind: "adobe", label: "Id", bg: "#49021F", fg: "#FF3366" },
  { name: "Figma", kind: "figma" },
  { name: "CorelDRAW", kind: "corel" },
  { name: "Canva", kind: "canva" },
  { name: "Sketch", kind: "sketch" },
  { name: "Affinity Designer", kind: "affinity" },
];

/* simple drawn marks for each tool (no image files needed) */
function ToolLogo({ tool }) {
  if (tool.kind === "adobe") {
    return (
      <span
        className="kk-graphic-tool-logo kk-graphic-tool-adobe"
        style={{
          background: tool.bg,
          color: tool.fg,
          borderColor: tool.fg,
        }}
      >
        {tool.label}
      </span>
    );
  }

  if (tool.kind === "figma") {
    return (
      <span className="kk-graphic-tool-logo kk-graphic-tool-figma">
        <svg viewBox="0 0 38 57" width="22" height="33" aria-hidden="true">
          <path d="M9.5 0H19V19H9.5A9.5 9.5 0 0 1 9.5 0Z" fill="#F24E1E" />
          <path d="M19 0H28.5A9.5 9.5 0 0 1 28.5 19H19Z" fill="#FF7262" />
          <path d="M9.5 19H19V38H9.5A9.5 9.5 0 0 1 9.5 19Z" fill="#A259FF" />
          <circle cx="28.5" cy="28.5" r="9.5" fill="#1ABCFE" />
          <path d="M9.5 38H19V47.5A9.5 9.5 0 1 1 9.5 38Z" fill="#0ACF83" />
        </svg>
      </span>
    );
  }

  if (tool.kind === "corel") {
    return (
      <span className="kk-graphic-tool-logo kk-graphic-tool-corel">
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path
            d="M3 21C3 11 10 3 21 3c0 11-7 18-18 18z"
            fill="#ffffff"
            fillOpacity="0.95"
          />
          <path
            d="M3 21L14 10"
            stroke="#0b8a3e"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  if (tool.kind === "canva") {
    return (
      <span className="kk-graphic-tool-logo kk-graphic-tool-canva">
        Canva
      </span>
    );
  }

  if (tool.kind === "sketch") {
    return (
      <span className="kk-graphic-tool-logo kk-graphic-tool-sketch">
        <svg viewBox="0 0 24 24" width="38" height="38" aria-hidden="true">
          <defs>
            <linearGradient id="kk-sketch-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDD231" />
              <stop offset="100%" stopColor="#F7A500" />
            </linearGradient>
          </defs>
          <polygon
            points="6,2 18,2 23,9 12,22 1,9"
            fill="url(#kk-sketch-grad)"
          />
          <polyline
            points="1,9 23,9 M8,9 12,2 16,9 12,22 8,9"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.7"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  /* affinity */
  return (
    <span className="kk-graphic-tool-logo kk-graphic-tool-affinity">
      <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
        <polygon points="12,3 22,21 2,21" fill="#ffffff" fillOpacity="0.92" />
        <polygon points="12,3 17,12 7,12" fill="#1b72be" fillOpacity="0.55" />
      </svg>
    </span>
  );
}

/* =====================================================
   FAQ
===================================================== */

const faqs = [
  {
    q: "What types of graphic design services do you offer?",
    a: "We offer logo design, branding, social media design, print design, packaging design, UI/UX graphics, and illustration & infographics.",
  },
  {
    q: "How long does it take to complete a design project?",
    a: "Turnaround time depends on the scope of the project, but most designs are delivered within a few business days.",
  },
  {
    q: "Do you provide revisions?",
    a: "Yes, we offer revision rounds as part of our process to make sure the final design matches your vision.",
  },
  {
    q: "Which file formats do you deliver?",
    a: "We deliver in JPG, PNG, PDF, SVG, and AI formats, along with editable source files where applicable.",
  },
  {
    q: "Can you work with our existing brand guidelines?",
    a: "Absolutely — we can design within your existing brand guidelines or help you build new ones from scratch.",
  },
  {
    q: "Do you also provide printing services?",
    a: "We prepare print-ready files and can coordinate with trusted print partners on request.",
  },
];

/* =====================================================
   GRAPHIC COMPONENT
===================================================== */

function Graphic() {
  const [openFaq, setOpenFaq] = useState(null);

  const [activeCard, setActiveCard] = useState(null);

  /* AWS DATA */

  const [graphicItems, setGraphicItems] = useState([]);

  const [bannerImage, setBannerImage] = useState("");
  const [bannerName, setBannerName] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");

  const [creativeDesignItems, setCreativeDesignItems] = useState([]);

  const [whyChooseItems, setWhyChooseItems] = useState([]);

  const [graphicLoading, setGraphicLoading] = useState(true);

  /* IMAGE URL */

  const getImageUrl = (item) => {
    return (
      item?.preview ||
      item?.image ||
      item?.imageUrl ||
      item?.fileUrl ||
      ""
    );
  };

  /* HERO TEXT (admin value, or default if admin left it empty) */

  const heroTitle = splitHeading(bannerName || DEFAULT_HERO_TITLE);
  const heroDescription = bannerDescription || DEFAULT_HERO_DESCRIPTION;

  /* SCROLL TO "OUR WORK" */

  const scrollToWork = () => {
    const node =
      document.getElementById("graphic-work") ||
      document.getElementById("graphic-services");

    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* LOAD GRAPHIC DESIGN DATA */

  useEffect(() => {
    let isMounted = true;

    const loadGraphicDesignData = async () => {
      try {
        setGraphicLoading(true);

        const response = await fetch(GRAPHIC_DESIGN_API);

        if (!response.ok) {
          throw new Error(
            `Failed to load Graphic Design data: ${response.status}`
          );
        }

        const data = await response.json();

        if (!isMounted) {
          return;
        }

        if (!Array.isArray(data)) {
          setGraphicItems([]);
          setBannerImage("");
          setBannerName("");
          setBannerDescription("");
          setCreativeDesignItems([]);
          setWhyChooseItems([]);
          return;
        }

        /* ALL ITEMS */

        setGraphicItems(data);

        /* BANNER */

        const banners = data.filter((item) =>
          sameCategory(item.category, "banner")
        );

        if (banners.length > 0) {
          const latestBanner = banners[banners.length - 1];

          setBannerImage(getImageUrl(latestBanner));

          setBannerName(
            latestBanner.name ||
              latestBanner.title ||
              latestBanner.heading ||
              ""
          );

          setBannerDescription(
            latestBanner.description ||
              latestBanner.desc ||
              latestBanner.subtitle ||
              ""
          );
        } else {
          setBannerImage("");
          setBannerName("");
          setBannerDescription("");
        }

        /* CREATIVE DESIGN */

        setCreativeDesignItems(
          data.filter((item) =>
            sameCategory(item.category, "creative design")
          )
        );

        /* WHY CHOOSE */

        setWhyChooseItems(
          data.filter((item) =>
            sameCategory(item.category, "why choose")
          )
        );
      } catch (error) {
        console.error("Graphic Design API error:", error);

        if (isMounted) {
          setGraphicItems([]);
          setBannerImage("");
          setBannerName("");
          setBannerDescription("");
          setCreativeDesignItems([]);
          setWhyChooseItems([]);
        }
      } finally {
        if (isMounted) {
          setGraphicLoading(false);
        }
      }
    };

    loadGraphicDesignData();

    return () => {
      isMounted = false;
    };
  }, []);

  /* FAQ TOGGLE */

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  /* SERVICE CARD TOGGLE */

  const toggleCard = (index) => {
    setActiveCard((prev) => (prev === index ? null : index));
  };

  return (
    <main className="kk-graphic-page">

      {/* =====================================================
          HERO BANNER
          Left: badge, name, description, buttons, trust row
          Right: banner image from admin dashboard
      ===================================================== */}

      <section
        className={`kk-graphic-banner ${
          !bannerImage ? "kk-graphic-banner-no-image" : ""
        }`}
      >
        <div className="kk-graphic-banner-glow" aria-hidden="true" />

        <div className="kk-graphic-banner-inner">

          {/* LEFT CONTENT */}

          <div className="kk-graphic-banner-content">

            {!graphicLoading && (
              <>
                <span className="kk-graphic-badge">
                  <i />
                  GRAPHIC DESIGN SERVICES
                </span>

                <h1 className="kk-graphic-heading">
                  {heroTitle.plain && (
                    <span className="kk-graphic-heading-plain">
                      {heroTitle.plain}{" "}
                    </span>
                  )}

                  <span className="kk-graphic-heading-accent">
                    {heroTitle.accent}
                  </span>
                </h1>

                <p className="kk-graphic-subtext">{heroDescription}</p>

                <div className="kk-graphic-banner-actions">
                  <Link
                    to="/contact"
                    className="kk-graphic-banner-btn kk-graphic-banner-btn-primary"
                  >
                    Start Your Project Now <ArrowRight size={18} />
                  </Link>

                  <button
                    type="button"
                    className="kk-graphic-banner-btn kk-graphic-banner-btn-outline"
                    onClick={scrollToWork}
                  >
                    <span className="kk-graphic-banner-play">
                      <Play size={12} fill="currentColor" />
                    </span>
                    View Our Work
                  </button>
                </div>

                <div className="kk-graphic-trust">
                  <div className="kk-graphic-trust-avatars">
                    {trustAvatars.map((avatar) => (
                      <span
                        className="kk-graphic-trust-avatar"
                        key={avatar.letter}
                        style={{ background: avatar.bg }}
                      >
                        {avatar.letter}
                      </span>
                    ))}
                  </div>

                  <div className="kk-graphic-trust-text">
                    <strong>500+ Brands Trust Us</strong>
                    <span>for Creative Design</span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* RIGHT IMAGE */}

          {!graphicLoading && bannerImage && (
            <div className="kk-graphic-banner-visual">
              <img
                src={bannerImage}
                alt={bannerName || "Graphic Design Banner"}
                className="kk-graphic-banner-image"
                onError={() => {
                  setBannerImage("");
                }}
              />
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="kk-graphic-stats">

        <div className="kk-graphic-stats-grid">

          {stats.map(
            ({ Icon, value, label, change, color, tint, points }, index) => (
              <div className="kk-graphic-stat" key={label}>

                <div className="kk-graphic-stat-top">
                  <span
                    className="kk-graphic-stat-icon"
                    style={{ background: tint, color }}
                  >
                    <Icon size={24} />
                  </span>

                  <div className="kk-graphic-stat-info">
                    <strong>{value}</strong>

                    <span className="kk-graphic-stat-label">{label}</span>

                    <span className="kk-graphic-stat-change">
                      <ArrowUp size={12} /> {change}
                    </span>
                  </div>
                </div>

                <Sparkline
                  points={points}
                  color={color}
                  id={`kk-graphic-spark-${index}`}
                />

              </div>
            )
          )}

        </div>

      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="kk-graphic-services" id="graphic-services">

        <div className="kk-graphic-section-head">
          <span className="kk-graphic-eyebrow">OUR SERVICES</span>

          <h2>Our Graphic Design Services</h2>

          <p>
            We offer a wide range of design solutions to help your
            brand look professional, engaging, and memorable across
            all platforms.
          </p>
        </div>

        <div className="kk-graphic-services-grid">

          {services.map(
            ({ Icon, gradient, glow, extras, title, desc }, index) => (
            <div
              className={`kk-graphic-service-card ${
                activeCard === index ? "kk-graphic-active" : ""
              }`}
              key={title}
              tabIndex={0}
              onClick={() => toggleCard(index)}
            >
              <div
                className="kk-graphic-service-media"
                style={{ "--kk-glow": glow }}
              >
                <div className="kk-graphic-service-cluster">
                  <div
                    className="kk-graphic-service-main"
                    style={{ background: gradient }}
                  >
                    <Icon size={38} />
                  </div>

                  {extras.map((extra, i) => {
                    const ExtraIcon = extra.Icon;

                    return (
                      <span
                        className={`kk-graphic-float kk-graphic-float-${i + 1}`}
                        key={i}
                        style={{ background: extra.bg, color: extra.color }}
                      >
                        <ExtraIcon size={20} />
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="kk-graphic-service-body">
                <div className="kk-graphic-service-text">
                  <h3>{title}</h3>

                  <p>{desc}</p>
                </div>

                <Link
                  to="/contact"
                  className="kk-graphic-service-arrow"
                  aria-label={`Get started with ${title}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}

        </div>

        <div className="kk-graphic-center">
          <Link
            to="/services"
            className="kk-graphic-btn kk-graphic-btn-dark"
          >
            View All Services
            <ArrowRight size={14} />
          </Link>
        </div>

      </section>

      {/* =====================================================
          CREATIVE DESIGN — ADMIN CONTENT
      ===================================================== */}

      {!graphicLoading && creativeDesignItems.length > 0 && (
        <section className="kk-graphic-admin-design" id="graphic-work">

          <div className="kk-graphic-section-head">
            <h2>Creative Design</h2>

            <p>
              Explore our latest creative design solutions created
              for modern brands and businesses.
            </p>
          </div>

          <div className="kk-graphic-admin-design-grid">

            {creativeDesignItems.map((item) => {
              const image = getImageUrl(item);

              return (
                <article
                  className="kk-graphic-admin-design-card"
                  key={item.id}
                >
                  {image && (
                    <div className="kk-graphic-admin-design-image">
                      <img
                        src={image}
                        alt={item.name || "Creative Design"}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="kk-graphic-admin-design-content">
                    <span className="kk-graphic-admin-design-category">
                      {item.category}
                    </span>

                    <h3>{item.name || "Creative Design"}</h3>

                    {item.description && <p>{item.description}</p>}
                  </div>
                </article>
              );
            })}

          </div>

        </section>
      )}

      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="kk-graphic-advantage">

        <div className="kk-graphic-section-head kk-graphic-section-head-wide">
          <span className="kk-graphic-eyebrow">OUR ADVANTAGE</span>

          <h2>
            Why Choose Kaden Kopper Technology{" "}
            <span className="kk-graphic-head-accent">
              for Graphic Design?
            </span>
          </h2>

          <p>
            We deliver more than just designs. We create stunning
            visuals that build your brand and make a lasting
            impression.
          </p>
        </div>

        <div className="kk-graphic-adv-grid">

          {advantages.map(({ Icon, title, desc, color, tint }) => (
            <div className="kk-graphic-adv-card" key={title}>
              <span
                className="kk-graphic-adv-icon"
                style={{ background: tint, color }}
              >
                <Icon size={26} />
              </span>

              <h3>{title}</h3>

              <p>{desc}</p>
            </div>
          ))}

        </div>

      </section>

      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="kk-graphic-process">

        <div className="kk-graphic-section-head">
          <span className="kk-graphic-eyebrow">OUR PROCESS</span>

          <h2>A Simple Process for Amazing Results</h2>

          <p>
            A step-by-step process to ensure creative designs
            delivered on time and beyond your expectations.
          </p>
        </div>

        <div className="kk-graphic-timeline">

          {processSteps.map(
            ({ Icon, title, desc, gradient, rgb, color }, index) => (
              <div className="kk-graphic-tl-step" key={title}>

                <div className="kk-graphic-tl-node-wrap">
                  <span
                    className="kk-graphic-tl-node"
                    style={{ background: gradient, "--kk-rgb": rgb }}
                  >
                    <Icon size={26} />
                  </span>
                </div>

                <span className="kk-graphic-tl-stem" />

                <span
                  className="kk-graphic-tl-badge"
                  style={{ background: color }}
                >
                  {index + 1}
                </span>

                <h4>{title}</h4>

                <p>{desc}</p>

              </div>
            )
          )}

        </div>

      </section>

      {/* =====================================================
          WHY CHOOSE — ADMIN CONTENT
      ===================================================== */}

      {!graphicLoading && whyChooseItems.length > 0 && (
        <section className="kk-graphic-admin-why">

          <div className="kk-graphic-section-head">
            <h2>Why Choose Us</h2>

            <p>
              Discover what makes our graphic design solutions
              different.
            </p>
          </div>

          <div className="kk-graphic-admin-why-grid">

            {whyChooseItems.map((item) => {
              const image = getImageUrl(item);

              return (
                <article
                  className="kk-graphic-admin-why-card"
                  key={item.id}
                >
                  {image && (
                    <div className="kk-graphic-admin-why-image">
                      <img
                        src={image}
                        alt={item.name || "Why Choose Us"}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="kk-graphic-admin-why-content">
                    <div className="kk-graphic-admin-why-icon">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>
                      <h3>{item.name || "Why Choose Us"}</h3>

                      {item.description && <p>{item.description}</p>}
                    </div>
                  </div>
                </article>
              );
            })}

          </div>

        </section>
      )}

      {/* =====================================================
          CAPABILITIES
      ===================================================== */}

      <section className="kk-graphic-capabilities">

        <div className="kk-graphic-section-head">
          <h2>Our Design Capabilities</h2>

          <p>
            We use the latest tools and technologies to create
            high-quality, scalable, and impactful designs.
          </p>
        </div>

        <div className="kk-graphic-capabilities-grid">

          <ul className="kk-graphic-capabilities-list-alt">

            {capabilities.map((item) => (
              <li key={item}>
                <CheckCircle2 size={16} />

                <span>{item}</span>
              </li>
            ))}

          </ul>

        </div>

      </section>

      {/* =====================================================
          DESIGN TOOLS
      ===================================================== */}

      <section className="kk-graphic-tools">

        <div className="kk-graphic-section-head">
          <span className="kk-graphic-eyebrow">TOOLS WE USE</span>

          <h2>Industry-Leading Tools for Better Results</h2>

          <p>
            We use the best design tools and technologies to deliver
            creative and professional designs.
          </p>
        </div>

        <div className="kk-graphic-tools-grid">

          {tools.map((tool) => (
            <div className="kk-graphic-tool-card" key={tool.name}>
              <ToolLogo tool={tool} />

              <span className="kk-graphic-tool-name">{tool.name}</span>
            </div>
          ))}

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="kk-graphic-cta-wrap">

        <div className="kk-graphic-cta">

          <div className="kk-graphic-cta-content">
            <h2>Ready to Turn Your Ideas Into Stunning Designs?</h2>

            <p>
              Let's create visuals that make your brand
              unforgettable. Get in touch with our team and start
              your design journey today.
            </p>
          </div>

          <Link
            to="/contact"
            className="kk-graphic-btn kk-graphic-btn-light"
          >
            Start Your Project Now
            <ArrowRight size={14} />
          </Link>

        </div>

      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="kk-graphic-faq">

        <div className="kk-graphic-section-head">
          <h2>Frequently Asked Questions</h2>

          <p>
            Find answers to common questions about our graphic
            design services.
          </p>
        </div>

        <div className="kk-graphic-faq-grid">

          {faqs.map((faq, index) => (
            <div
              className={`kk-graphic-faq-item ${
                openFaq === index ? "kk-graphic-faq-open" : ""
              }`}
              key={faq.q}
            >
              <button
                type="button"
                className="kk-graphic-faq-question"
                onClick={() => toggleFaq(index)}
                aria-expanded={openFaq === index}
              >
                <span>{faq.q}</span>

                {openFaq === index ? (
                  <Minus size={16} />
                ) : (
                  <Plus size={16} />
                )}
              </button>

              {openFaq === index && (
                <p className="kk-graphic-faq-answer">{faq.a}</p>
              )}
            </div>
          ))}

        </div>

      </section>

    </main>
  );
}

export default Graphic;
