import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  FileText,
  Settings2,
  Pencil,
  Link2,
  MapPin,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  ChevronDown,
  ShieldCheck,
  ClipboardCheck,
  HeartPulse,
  Landmark,
  GraduationCap,
  Rocket,
  Play,
  Award,
  Headphones,
} from "lucide-react";
import "./Seo.css";

/* =====================================================
   API CONFIGURATION
===================================================== */

const SEO_ENDPOINT =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/seodevelop";

/* =====================================================
   HERO (BANNER) - DEFAULTS + HELPERS
===================================================== */

const DEFAULT_HERO_TITLE =
  "Grow Your Visibility Drive More Organic Traffic & Real Business Growth";

const DEFAULT_HERO_DESCRIPTION =
  "We create data-driven SEO strategies that improve search rankings, attract qualified traffic and turn organic visibility into measurable business growth.";

const heroFeatures = [
  { icon: BarChart3, label: "Data-Driven Strategy" },
  { icon: ShieldCheck, label: "White-Hat Practices" },
  { icon: ClipboardCheck, label: "Transparent Reporting" },
  { icon: TrendingUp, label: "Long-Term Growth" },
];

/*
  Splits the banner name into a white part and a gradient part.
  - If the admin name contains "|", everything after "|" is gradient.
  - Otherwise the last words are made gradient automatically.
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

  if (words.length < 4) {
    return { plain: "", accent: clean };
  }

  const accentCount =
    words.length >= 9 ? 5 : Math.ceil(words.length / 2);

  return {
    plain: words.slice(0, words.length - accentCount).join(" "),
    accent: words.slice(words.length - accentCount).join(" "),
  };
};

/* =====================================================
   PERFORMANCE STATS (4 cards with area charts)
===================================================== */

const performanceStats = [
  {
    label: "Organic Traffic",
    value: "84,625",
    change: "18.4%",
    up: true,
    icon: BarChart3,
    tint: "blue",
    color: "#2563ff",
    data: [20, 26, 22, 30, 27, 34, 30, 38, 35, 42, 40, 48],
  },
  {
    label: "Keyword Rankings",
    value: "64,320",
    change: "24.1%",
    up: true,
    icon: Search,
    tint: "purple",
    color: "#8b5cf6",
    data: [18, 22, 20, 26, 24, 30, 28, 34, 32, 38, 36, 44],
  },
  {
    label: "Monthly Leads",
    value: "52,870",
    change: "32.4%",
    up: true,
    icon: Users,
    tint: "teal",
    color: "#14b8a6",
    data: [16, 19, 22, 20, 25, 28, 26, 32, 30, 35, 38, 42],
  },
  {
    label: "Conversions",
    value: "28,430",
    change: "21.3%",
    up: false,
    icon: Target,
    tint: "pink",
    color: "#ef4444",
    data: [42, 38, 40, 34, 36, 30, 32, 26, 28, 22, 24, 18],
  },
];

/* =====================================================
   SEO SERVICES
===================================================== */

const services = [
  {
    title: "Keyword Research",
    desc: "Discover high-value keywords to target the right audience.",
    icon: Search,
    tint: "blue",
  },
  {
    title: "On-Page SEO",
    desc: "Optimize your website for search engines and users.",
    icon: FileText,
    tint: "purple",
  },
  {
    title: "Technical SEO",
    desc: "Improve site speed, crawlability and technical performance.",
    icon: Settings2,
    tint: "sky",
  },
  {
    title: "Content Optimization",
    desc: "Create SEO-friendly content that ranks and engages.",
    icon: Pencil,
    tint: "orange",
  },
  {
    title: "Link Building",
    desc: "Build high-quality backlinks for long-term growth.",
    icon: Link2,
    tint: "teal",
  },
  {
    title: "Local SEO",
    desc: "Get found in local searches and attract nearby customers.",
    icon: MapPin,
    tint: "pink",
  },
  {
    title: "E-Commerce SEO",
    desc: "Increase product visibility and drive more sales.",
    icon: ShoppingCart,
    tint: "teal",
  },
  {
    title: "SEO Analytics & Reporting",
    desc: "Track progress with detailed insights and reports.",
    icon: BarChart3,
    tint: "indigo",
  },
];

/* =====================================================
   GROWTH SECTION (bar chart + stats)
===================================================== */

const growthMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const growthBars = [16, 24, 36, 48, 62, 80];

const growthLinePoints = growthBars
  .map((height, index) => {
    const x = ((index + 0.5) / growthBars.length) * 100;
    const y = 100 - height - 8;
    return `${x},${y}`;
  })
  .join(" ");

const growthStats = [
  { icon: BarChart3, tint: "blue", value: "+320%", label: "Organic Traffic" },
  { icon: Search, tint: "sky", value: "+185%", label: "Keyword Visibility" },
  { icon: Users, tint: "teal", value: "+92%", label: "Qualified Leads" },
  { icon: Target, tint: "pink", value: "+68%", label: "Conversion Growth" },
];

/* =====================================================
   INSIGHTS (analytics cards)
===================================================== */

const insightTraffic = {
  label: "Organic Traffic",
  value: "84,625",
  change: "↑ 18.4%",
  tone: "up",
  color: "#2563ff",
  data: [20, 24, 22, 28, 25, 31, 28, 35, 32, 38, 36, 44],
};

const insightKeywords = {
  label: "Keyword Rankings",
  value: "64,320",
  change: "↑ 24.1%",
  tone: "up",
  color: "#8b5cf6",
  data: [18, 22, 19, 26, 23, 29, 26, 33, 30, 36, 34, 42],
};

const insightConversion = {
  label: "Conversion Growth",
  value: "28,430",
  change: "+ 21.5%",
  tone: "pink",
  color: "#ec4899",
  data: [16, 20, 18, 24, 21, 27, 25, 31, 29, 35, 33, 40],
};

const trafficSources = [
  { label: "Organic Search", value: 52, color: "#2563ff" },
  { label: "Direct", value: 18, color: "#8b5cf6" },
  { label: "Referral", value: 15, color: "#ec4899" },
  { label: "Social Media", value: 10, color: "#f59e0b" },
  { label: "Other", value: 5, color: "#14b8a6" },
];

/* =====================================================
   AREA CHART (sparkline with gradient fill)
===================================================== */

const AreaChart = ({ data, color, id }) => {
  const W = 200;
  const H = 60;
  const pad = 5;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * W;
    const y = pad + (H - pad * 2) - ((value - min) / range) * (H - pad * 2);
    return [x, y];
  });

  const line = points.map((point) => point.join(",")).join(" ");

  const area = `M0,${H} L${points
    .map((point) => point.join(","))
    .join(" L")} L${W},${H} Z`;

  return (
    <svg
      className="kk-seo-area"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={area} fill={`url(#${id})`} />

      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

/* =====================================================
   DONUT HELPER
===================================================== */

const renderDonutSegments = (segments) => {
  let cumulative = 0;

  return segments.map((seg) => {
    const dash = `${seg.value} ${100 - seg.value}`;
    const offset = 25 - cumulative;
    cumulative += seg.value;

    return (
      <circle
        key={seg.label}
        cx="21"
        cy="21"
        r="15.9155"
        fill="transparent"
        stroke={seg.color}
        strokeWidth="5"
        strokeDasharray={dash}
        strokeDashoffset={offset}
      />
    );
  });
};

/* =====================================================
   PROCESS
===================================================== */

const processSteps = [
  {
    title: "SEO Audit",
    desc: "Analyze your current performance and opportunities.",
    color: "#2563ff",
    ring: "rgba(37, 99, 255, 0.16)",
  },
  {
    title: "Strategy Planning",
    desc: "Create a customized SEO roadmap.",
    color: "#8b5cf6",
    ring: "rgba(139, 92, 246, 0.16)",
  },
  {
    title: "Keyword Research",
    desc: "Identify high-value keywords.",
    color: "#14b8a6",
    ring: "rgba(20, 184, 166, 0.16)",
  },
  {
    title: "Optimization",
    desc: "Implement on-page, technical and content improvements.",
    color: "#f59e0b",
    ring: "rgba(245, 158, 11, 0.18)",
  },
  {
    title: "Content & Authority",
    desc: "Build high-quality content and backlinks.",
    color: "#ec4899",
    ring: "rgba(236, 72, 153, 0.16)",
  },
  {
    title: "Measure & Grow",
    desc: "Track results and continuously improve.",
    color: "#0ea5e9",
    ring: "rgba(14, 165, 233, 0.16)",
  },
];

/* =====================================================
   SEO TOOLS
===================================================== */

const toolLogos = [
  { name: "G", sub: "Search Console", color: "#4285f4", big: true },
  { name: "GA", sub: "Google Analytics", color: "#f9ab00", big: true },
  { name: "SEMRUSH", color: "#ff642d" },
  { name: "ahrefs", color: "#2563ff" },
  { name: "SF", sub: "Screaming Frog", color: "#3aa757", big: true },
  { name: "MOZ", color: "#1fa0e6" },
  { name: "Ubersuggest", color: "#ff7a1a" },
  { name: "yoast", color: "#a30071" },
  { name: "GT", sub: "Google Trends", color: "#34a853", big: true },
];

/* =====================================================
   INDUSTRIES
===================================================== */

const industries = [
  { icon: ShoppingCart, tint: "blue", title: "E-Commerce", sub: "Shopping Apps" },
  { icon: HeartPulse, tint: "pink", title: "Healthcare", sub: "Healthcare Apps" },
  { icon: Landmark, tint: "indigo", title: "Finance & FinTech", sub: "Banking Apps" },
  { icon: GraduationCap, tint: "sky", title: "Education", sub: "Learning Apps" },
  { icon: Rocket, tint: "purple", title: "SaaS & Startups", sub: "Business Apps" },
  { icon: Play, tint: "indigo", title: "Media & Entertainment", sub: "Media Apps" },
];

/* =====================================================
   WHY CHOOSE (default cards - replaced by admin data)
===================================================== */

const defaultWhyChoose = [
  {
    icon: Award,
    tint: "blue",
    title: "Proven Results",
    desc: "Data driven strategies that deliver real growth.",
  },
  {
    icon: ShieldCheck,
    tint: "sky",
    title: "White-Hat SEO",
    desc: "Ethical and sustainable SEO practices.",
  },
  {
    icon: Target,
    tint: "indigo",
    title: "Customized Strategy",
    desc: "Tailored SEO plans for your business goals.",
  },
  {
    icon: ClipboardCheck,
    tint: "blue",
    title: "Transparent Reporting",
    desc: "Clear insights and regular reports.",
  },
  {
    icon: Users,
    tint: "sky",
    title: "Dedicated Team",
    desc: "SEO experts focused on your success.",
  },
  {
    icon: Headphones,
    tint: "indigo",
    title: "Ongoing Support",
    desc: "Continuous optimization and long-term support.",
  },
];

/* =====================================================
   TESTIMONIALS
===================================================== */

const testimonials = [
  {
    quote:
      "Kaden Koppers significantly improved our organic traffic. Highly professional and great results!",
    name: "Rahul Mehta",
    role: "E-Commerce Business",
    color: "#2563ff",
  },
  {
    quote:
      "Excellent SEO strategies and transparent reporting. We saw a huge increase in leads.",
    name: "Priya Sharma",
    role: "Healthcare Business",
    color: "#2563ff",
  },
  {
    quote:
      "Great experience working with their SEO team. Our rankings and revenue both improved!",
    name: "Amit Verma",
    role: "Real Estate Business",
    color: "#14b8a6",
  },
];

/* =====================================================
   FAQ
===================================================== */

const faqs = [
  {
    q: "How long does it take to see SEO results?",
    a: "Most clients start seeing meaningful movement in rankings and traffic within 3-6 months, depending on competition and starting point.",
  },
  {
    q: "What SEO services do you provide?",
    a: "We offer SEO audits, keyword research, on-page and technical SEO, content SEO, link building, local SEO, and analytics & reporting.",
  },
  {
    q: "How do you measure SEO success?",
    a: "We track organic traffic, keyword rankings, backlinks, conversion rate, and lead generation, and share it in clear, regular reports.",
  },
  {
    q: "Will you guarantee page-one rankings?",
    a: "No ethical SEO agency can guarantee a specific ranking, but we guarantee data-driven strategies aimed at consistent, measurable growth.",
  },
  {
    q: "How can you improve our organic traffic?",
    a: "We combine keyword research, on-page and technical fixes, quality content and link building, then track results and keep optimizing every month.",
  },
];

/* =====================================================
   SEO COMPONENT
===================================================== */

function Seo() {
  /* FAQ */

  const [openFaq, setOpenFaq] = useState(0);

  /* SEO BACKEND DATA */

  const [seoItems, setSeoItems] = useState([]);

  /* BANNER DATA (from admin dashboard) */

  const [bannerImage, setBannerImage] = useState("");
  const [bannerName, setBannerName] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");

  /* SEO DEVELOPMENT DATA */

  const [seoDevelopmentItems, setSeoDevelopmentItems] = useState([]);

  /* WHY CHOOSE DATA */

  const [whyChooseItems, setWhyChooseItems] = useState([]);

  const [bannerLoading, setBannerLoading] = useState(true);

  /* GET IMAGE URL */

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

  /* SCROLL TO RESULTS */

  const scrollToResults = () => {
    const node = document.getElementById("seo-results");

    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* WHY CHOOSE CARDS: admin data if present, otherwise defaults */

  const whyCards =
    whyChooseItems.length > 0
      ? whyChooseItems.map((item) => ({
          key: item.id || item.key || `${item.name}-${item.category}`,
          title: item.name,
          desc: item.description,
          image: getImageUrl(item),
          Icon: Award,
          tint: "blue",
        }))
      : defaultWhyChoose.map((item) => ({
          key: item.title,
          title: item.title,
          desc: item.desc,
          image: "",
          Icon: item.icon,
          tint: item.tint,
        }));

  /* =====================================================
     LOAD SEO DATA FROM AWS
  ===================================================== */

  useEffect(() => {
    let isMounted = true;

    const loadSeoData = async () => {
      try {
        setBannerLoading(true);

        const response = await fetch(SEO_ENDPOINT, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`SEO API Error: ${response.status}`);
        }

        const result = await response.json();

        /* NORMALIZE API RESPONSE */

        let data = [];

        if (Array.isArray(result)) {
          data = result;
        } else if (Array.isArray(result?.items)) {
          data = result.items;
        } else if (Array.isArray(result?.data)) {
          data = result.data;
        }

        if (!isMounted) {
          return;
        }

        setSeoItems(data);

        /* BANNER */

        const bannerItems = data.filter(
          (item) =>
            String(item?.category || "")
              .trim()
              .toLowerCase() === "banner"
        );

        const latestBanner =
          bannerItems.length > 0
            ? bannerItems[bannerItems.length - 1]
            : null;

        setBannerImage(getImageUrl(latestBanner));
        setBannerName(latestBanner?.name || "");
        setBannerDescription(latestBanner?.description || "");

        /* SEO DEVELOPMENT */

        const seoDevelopment = data.filter(
          (item) =>
            String(item?.category || "")
              .trim()
              .toLowerCase() === "seo development"
        );

        setSeoDevelopmentItems(seoDevelopment);

        /* WHY CHOOSE */

        const whyChooseData = data.filter(
          (item) =>
            String(item?.category || "")
              .trim()
              .toLowerCase() === "why choose"
        );

        setWhyChooseItems(whyChooseData);
      } catch (error) {
        console.error("Failed to load SEO data:", error);

        if (isMounted) {
          setSeoItems([]);
          setBannerImage("");
          setBannerName("");
          setBannerDescription("");
          setSeoDevelopmentItems([]);
          setWhyChooseItems([]);
        }
      } finally {
        if (isMounted) {
          setBannerLoading(false);
        }
      }
    };

    loadSeoData();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="kk-seo-page">

      {/* =================================================
          SEO HERO
      ================================================= */}

      <section
        className={`kk-seo-hero ${
          !bannerImage ? "kk-seo-hero-no-image" : ""
        }`}
      >
        <div className="kk-seo-hero-glow" aria-hidden="true" />

        <div className="kk-seo-hero-inner">

          {/* LEFT CONTENT */}

          <div className="kk-seo-hero-content">

            {!bannerLoading && (
              <>
                <span className="kk-seo-hero-badge">
                  SEO &amp; DIGITAL GROWTH
                </span>

                <h1 className="kk-seo-hero-title">
                  {heroTitle.plain && (
                    <span className="kk-seo-hero-title-plain">
                      {heroTitle.plain}{" "}
                    </span>
                  )}

                  <span className="kk-seo-hero-title-accent">
                    {heroTitle.accent}
                  </span>
                </h1>

                <p className="kk-seo-hero-description">
                  {heroDescription}
                </p>

                <div className="kk-seo-hero-actions">
                  <Link
                    to="/contact"
                    className="kk-seo-hero-btn kk-seo-hero-btn-primary"
                  >
                    Start Your SEO Project <span>→</span>
                  </Link>

                  <button
                    type="button"
                    className="kk-seo-hero-btn kk-seo-hero-btn-outline"
                    onClick={scrollToResults}
                  >
                    View Our Results
                  </button>
                </div>

                <div className="kk-seo-hero-features">
                  {heroFeatures.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <div
                        className="kk-seo-hero-feature"
                        key={feature.label}
                      >
                        <span className="kk-seo-hero-feature-icon">
                          <Icon size={16} strokeWidth={2} />
                        </span>

                        <span className="kk-seo-hero-feature-label">
                          {feature.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </div>

          {/* RIGHT IMAGE */}

          {!bannerLoading && bannerImage && (
            <div className="kk-seo-hero-visual">
              <img
                src={bannerImage}
                alt={bannerName || "SEO Banner"}
                className="kk-seo-banner-image"
                onError={() => {
                  setBannerImage("");
                }}
              />
            </div>
          )}

        </div>
      </section>

      {/* =================================================
          SEO PERFORMANCE AT SCALE
          (target of the "View Our Results" button)
      ================================================= */}

      <section className="kk-seo-sec" id="seo-results">
        <div className="kk-seo-sec-inner">

          <div className="kk-seo-sec-head">
            <div className="kk-seo-sec-head-text">
              <span className="kk-seo-sec-eyebrow">
                SEO Performance at Scale
              </span>

              <h2 className="kk-seo-sec-title">
                Real Results. Real Growth. Measurable Impact.
              </h2>

              <p className="kk-seo-sec-sub">
                We help businesses rank higher, attract quality traffic
                and grow faster with proven SEO strategies.
              </p>
            </div>

            <span className="kk-seo-sec-action kk-seo-sec-action-static">
              Last 6 Months
              <ChevronDown size={15} />
            </span>
          </div>

          <div className="kk-seo-perf-grid">
            {performanceStats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div className="kk-seo-perf-card" key={stat.label}>

                  <div className="kk-seo-perf-top">
                    <span className={`kk-seo-tile kk-seo-tint-${stat.tint}`}>
                      <Icon size={22} strokeWidth={2} />
                    </span>

                    <div className="kk-seo-perf-info">
                      <span className="kk-seo-perf-label">{stat.label}</span>

                      <strong className="kk-seo-perf-value">
                        {stat.value}
                      </strong>

                      <span
                        className={`kk-seo-perf-change ${
                          stat.up ? "up" : "down"
                        }`}
                      >
                        {stat.up ? "↑" : "↓"} {stat.change}
                      </span>
                    </div>
                  </div>

                  <AreaChart
                    data={stat.data}
                    color={stat.color}
                    id={`kk-perf-${index}`}
                  />

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =================================================
          OUR SEO SERVICES
      ================================================= */}

      <section className="kk-seo-sec">
        <div className="kk-seo-sec-inner">

          <div className="kk-seo-sec-head">
            <div className="kk-seo-sec-head-text">
              <span className="kk-seo-sec-eyebrow">Our SEO Services</span>

              <h2 className="kk-seo-sec-title">
                Complete SEO Solutions for Higher Rankings
              </h2>

              <p className="kk-seo-sec-sub">
                We provide end-to-end SEO services to help your business
                get more visibility, traffic and customers.
              </p>
            </div>

            <Link to="/services" className="kk-seo-sec-action">
              View All Services <span>→</span>
            </Link>
          </div>

          <div className="kk-seo-services-grid">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div className="kk-seo-service-card" key={service.title}>

                  <span className={`kk-seo-tile kk-seo-tint-${service.tint}`}>
                    <Icon size={22} strokeWidth={2} />
                  </span>

                  <div className="kk-seo-service-text">
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =================================================
          TURN SEARCHES INTO REAL GROWTH
      ================================================= */}

      <section className="kk-seo-sec">
        <div className="kk-seo-sec-inner">

          <div className="kk-seo-growth">

            {/* LEFT TEXT */}

            <div className="kk-seo-growth-text">

              <span className="kk-seo-sec-eyebrow">
                Turn Searches Into Real Growth
              </span>

              <h2 className="kk-seo-sec-title kk-seo-growth-title">
                From Search Visibility to{" "}
                <span>Business Success</span>
              </h2>

              <p className="kk-seo-sec-sub">
                We help your business rank higher, get more traffic and
                convert visitors into customers.
              </p>

              <Link to="/contact" className="kk-seo-btn-blue">
                Start Growing Now <span>→</span>
              </Link>

            </div>

            {/* CENTER CHART */}

            <div className="kk-seo-growth-chart">

              <div className="kk-seo-growth-plot">

                {growthBars.map((height, index) => (
                  <div className="kk-seo-growth-col" key={growthMonths[index]}>
                    <div
                      className="kk-seo-growth-bar"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}

                <svg
                  className="kk-seo-growth-line"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <polyline
                    points={growthLinePoints}
                    fill="none"
                    stroke="#4f8dff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <div
                  className="kk-seo-growth-tooltip"
                  style={{ bottom: `calc(${growthBars[growthBars.length - 1]}% + 14px)` }}
                >
                  <strong>+320%</strong>
                  <span>Organic Traffic</span>
                </div>

              </div>

              <div className="kk-seo-growth-months">
                {growthMonths.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>

            </div>

            {/* RIGHT STATS */}

            <div className="kk-seo-growth-stats">
              {growthStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div className="kk-seo-growth-stat" key={stat.label}>

                    <span className={`kk-seo-tile kk-seo-tint-${stat.tint}`}>
                      <Icon size={22} strokeWidth={2} />
                    </span>

                    <strong>{stat.value}</strong>

                    <span className="kk-seo-growth-stat-label">
                      {stat.label}
                    </span>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          SEO DEVELOPMENT - ADMIN DATA
      ================================================= */}

      {seoDevelopmentItems.length > 0 && (
        <section className="kk-seo-sec">
          <div className="kk-seo-sec-inner">

            <div className="kk-seo-sec-head kk-seo-sec-head-center">
              <div className="kk-seo-sec-head-text">
                <span className="kk-seo-sec-eyebrow">SEO Development</span>

                <h2 className="kk-seo-sec-title">
                  Our SEO Development Expertise
                </h2>

                <p className="kk-seo-sec-sub">
                  Our SEO development solutions and expertise.
                </p>
              </div>
            </div>

            <div className="kk-seo-admin-grid">

              {seoDevelopmentItems.map((item) => {
                const imageUrl = getImageUrl(item);

                return (
                  <div
                    className="kk-seo-admin-card"
                    key={item.id || item.key || `${item.name}-${item.category}`}
                  >

                    {imageUrl && (
                      <div className="kk-seo-admin-card-image">
                        <img
                          src={imageUrl}
                          alt={item.name || "SEO Development"}
                          loading="lazy"
                        />
                      </div>
                    )}

                    {item.name && <h3>{item.name}</h3>}

                    {item.description && <p>{item.description}</p>}

                  </div>
                );
              })}

            </div>

          </div>
        </section>
      )}

      {/* =================================================
          SEO INTELLIGENCE
      ================================================= */}

      <section className="kk-seo-sec">
        <div className="kk-seo-sec-inner">

          <div className="kk-seo-sec-head">
            <div className="kk-seo-sec-head-text">
              <span className="kk-seo-sec-eyebrow">SEO Intelligence</span>

              <h2 className="kk-seo-sec-title">
                Data-Driven Insights for Smarter Decisions
              </h2>

              <p className="kk-seo-sec-sub">
                Track performance, analyze growth and measure the real
                impact of SEO.
              </p>
            </div>

            <Link to="/projects" className="kk-seo-sec-action">
              View Full Analytics <span>→</span>
            </Link>
          </div>

          <div className="kk-seo-insights-grid">

            {/* ORGANIC TRAFFIC */}

            <div className="kk-seo-insight-card">
              <span className="kk-seo-insight-label">
                {insightTraffic.label}
              </span>

              <div className="kk-seo-insight-row">
                <strong>{insightTraffic.value}</strong>
                <span className={`kk-seo-insight-change ${insightTraffic.tone}`}>
                  {insightTraffic.change}
                </span>
              </div>

              <AreaChart
                data={insightTraffic.data}
                color={insightTraffic.color}
                id="kk-insight-traffic"
              />
            </div>

            {/* KEYWORD RANKINGS */}

            <div className="kk-seo-insight-card">
              <span className="kk-seo-insight-label">
                {insightKeywords.label}
              </span>

              <div className="kk-seo-insight-row">
                <strong>{insightKeywords.value}</strong>
                <span className={`kk-seo-insight-change ${insightKeywords.tone}`}>
                  {insightKeywords.change}
                </span>
              </div>

              <AreaChart
                data={insightKeywords.data}
                color={insightKeywords.color}
                id="kk-insight-keywords"
              />
            </div>

            {/* TRAFFIC SOURCES */}

            <div className="kk-seo-insight-card kk-seo-insight-sources">
              <span className="kk-seo-insight-label">Traffic Sources</span>

              <div className="kk-seo-sources-body">

                <div className="kk-seo-donut">
                  <svg viewBox="0 0 42 42">
                    <circle
                      cx="21"
                      cy="21"
                      r="15.9155"
                      fill="transparent"
                      stroke="#eef1f8"
                      strokeWidth="5"
                    />
                    {renderDonutSegments(trafficSources)}
                  </svg>

                  <div className="kk-seo-donut-center">
                    <strong>84,625</strong>
                    <span>Total Visits</span>
                  </div>
                </div>

                <div className="kk-seo-sources-legend">
                  {trafficSources.map((seg) => (
                    <span key={seg.label}>
                      <i style={{ background: seg.color }} />
                      {seg.label}
                      <em>{seg.value}%</em>
                    </span>
                  ))}
                </div>

              </div>
            </div>

            {/* CONVERSION GROWTH */}

            <div className="kk-seo-insight-card">
              <span className="kk-seo-insight-label">
                {insightConversion.label}
              </span>

              <div className="kk-seo-insight-row">
                <strong>{insightConversion.value}</strong>
                <span className={`kk-seo-insight-change ${insightConversion.tone}`}>
                  {insightConversion.change}
                </span>
              </div>

              <AreaChart
                data={insightConversion.data}
                color={insightConversion.color}
                id="kk-insight-conversion"
              />
            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          OUR SEO PROCESS
      ================================================= */}

      <section className="kk-seo-sec">
        <div className="kk-seo-sec-inner">

          <div className="kk-seo-sec-head kk-seo-sec-head-center">
            <div className="kk-seo-sec-head-text">
              <span className="kk-seo-sec-eyebrow">Our SEO Process</span>

              <h2 className="kk-seo-sec-title">
                A Transparent Process to Build Long-Term Results
              </h2>

              <p className="kk-seo-sec-sub">
                We follow a proven and data-driven process to improve
                your search visibility and growth.
              </p>
            </div>
          </div>

          <div className="kk-seo-process-track">

            {processSteps.map((step, index) => (
              <div className="kk-seo-process-step" key={step.title}>

                <div
                  className="kk-seo-process-circle"
                  style={{ "--c": step.color, "--ring": step.ring }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="kk-seo-process-text">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =================================================
          SEO TOOLS & TECHNOLOGIES
      ================================================= */}

      <section className="kk-seo-sec">
        <div className="kk-seo-sec-inner">

          <div className="kk-seo-sec-head kk-seo-sec-head-center">
            <div className="kk-seo-sec-head-text">
              <span className="kk-seo-sec-eyebrow">
                SEO Tools &amp; Technologies We Use
              </span>

              <h2 className="kk-seo-sec-title">
                Industry-Leading Tools for Better Results
              </h2>

              <p className="kk-seo-sec-sub">
                We use the best SEO tools and technologies to deliver
                accurate insights and better performance.
              </p>
            </div>
          </div>

          <div className="kk-seo-tools-grid">

            {toolLogos.map((tool) => (
              <div className="kk-seo-tool-badge" key={tool.name + (tool.sub || "")}>

                <strong
                  className={tool.big ? "is-big" : ""}
                  style={{ color: tool.color }}
                >
                  {tool.name}
                </strong>

                {tool.sub && <span>{tool.sub}</span>}

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =================================================
          SEO SOLUTIONS FOR EVERY INDUSTRY
      ================================================= */}

      <section className="kk-seo-sec">
        <div className="kk-seo-sec-inner">

          <div className="kk-seo-sec-head kk-seo-sec-head-center">
            <div className="kk-seo-sec-head-text">
              <span className="kk-seo-sec-eyebrow">
                SEO Solutions for Every Industry
              </span>

              <h2 className="kk-seo-sec-title">
                Tailored SEO Strategies for Unique Business Needs
              </h2>

              <p className="kk-seo-sec-sub">
                We deliver industry-specific SEO solutions that drive
                measurable results.
              </p>
            </div>
          </div>

          <div className="kk-seo-industry-grid">

            {industries.map((industry) => {
              const Icon = industry.icon;

              return (
                <div className="kk-seo-industry-card" key={industry.title}>

                  <span className={`kk-seo-tile kk-seo-tint-${industry.tint}`}>
                    <Icon size={22} strokeWidth={2} />
                  </span>

                  <h3>{industry.title}</h3>
                  <p>{industry.sub}</p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* =================================================
          WHY CHOOSE KADEN KOPPERS TECHNOLOGY
          (uses admin "why choose" data when available)
      ================================================= */}

      <section className="kk-seo-sec">
        <div className="kk-seo-sec-inner">

          <div className="kk-seo-sec-head kk-seo-sec-head-center">
            <div className="kk-seo-sec-head-text">
              <span className="kk-seo-sec-eyebrow">
                Why Choose Kaden Koppers Technology
              </span>

              <h2 className="kk-seo-sec-title">
                More Than SEO, We Create Real Business Value.
              </h2>

              <p className="kk-seo-sec-sub">
                We deliver data-driven strategies, transparent process
                and measurable results.
              </p>
            </div>
          </div>

          <div className="kk-seo-why-grid">

            {whyCards.map((card) => {
              const Icon = card.Icon;

              return (
                <div className="kk-seo-why-card" key={card.key}>

                  <span className={`kk-seo-tile kk-seo-tile-sm kk-seo-tint-${card.tint}`}>
                    {card.image ? (
                      <img src={card.image} alt={card.title || "Why Choose Us"} loading="lazy" />
                    ) : (
                      <Icon size={18} strokeWidth={2} />
                    )}
                  </span>

                  <div className="kk-seo-why-text">
                    {card.title && <h3>{card.title}</h3>}
                    {card.desc && <p>{card.desc}</p>}
                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* =================================================
          TESTIMONIALS
      ================================================= */}

      <section className="kk-seo-sec">
        <div className="kk-seo-sec-inner">

          <div className="kk-seo-sec-head kk-seo-sec-head-center">
            <div className="kk-seo-sec-head-text">
              <span className="kk-seo-sec-eyebrow">What Our Clients Say</span>

              <h2 className="kk-seo-sec-title">
                Trusted by Businesses Across Industries
              </h2>
            </div>
          </div>

          <div className="kk-seo-testimonials-grid">

            {testimonials.map((testimonial) => (
              <div className="kk-seo-testimonial-card" key={testimonial.name}>

                <div className="kk-seo-testimonial-stars">★★★★★</div>

                <p>"{testimonial.quote}"</p>

                <div className="kk-seo-testimonial-author">

                  <div
                    className="kk-seo-testimonial-avatar"
                    style={{ background: testimonial.color }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>

                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =================================================
          FAQ + CTA
      ================================================= */}

      <section className="kk-seo-sec">
        <div className="kk-seo-sec-inner">

          <div className="kk-seo-bottom">

            {/* FAQ */}

            <div className="kk-seo-faq">

              <span className="kk-seo-sec-eyebrow">
                Frequently Asked Questions
              </span>

              <h2 className="kk-seo-sec-title">
                Get Answers to Common Questions
              </h2>

              <div className="kk-seo-faq-list">

                {faqs.map((faq, index) => (
                  <div
                    className={`kk-seo-faq-item ${
                      openFaq === index ? "is-open" : ""
                    }`}
                    key={faq.q}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(openFaq === index ? -1 : index)
                      }
                    >
                      {faq.q}

                      <span>{openFaq === index ? "−" : "+"}</span>
                    </button>

                    {openFaq === index && <p>{faq.a}</p>}

                  </div>
                ))}

              </div>

            </div>

            {/* CTA */}

            <div className="kk-seo-cta">

              <div className="kk-seo-cta-text">

                <span className="kk-seo-cta-eyebrow">
                  Ready to Rank Higher?
                </span>

                <h3>Rank Higher &amp; Grow Your Business Today!</h3>

                <p>
                  Let's build a powerful SEO strategy that drives real
                  traffic, leads and revenue.
                </p>

                <Link to="/contact" className="kk-seo-btn-blue">
                  Start Your SEO Project <span>→</span>
                </Link>

              </div>

              <svg
                className="kk-seo-cta-chart"
                viewBox="0 0 200 140"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="kk-cta-bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f8dff" />
                    <stop offset="100%" stopColor="#2563ff" />
                  </linearGradient>
                </defs>

                <rect x="20" y="105" width="22" height="30" rx="3" fill="url(#kk-cta-bar)" opacity="0.55" />
                <rect x="60" y="85" width="22" height="50" rx="3" fill="url(#kk-cta-bar)" opacity="0.7" />
                <rect x="100" y="62" width="22" height="73" rx="3" fill="url(#kk-cta-bar)" opacity="0.85" />
                <rect x="140" y="35" width="22" height="100" rx="3" fill="url(#kk-cta-bar)" />

                <polyline
                  points="10,92 55,70 95,54 150,20"
                  fill="none"
                  stroke="#2563ff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <polygon points="148,8 176,12 160,34" fill="#2563ff" />
              </svg>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Seo;
