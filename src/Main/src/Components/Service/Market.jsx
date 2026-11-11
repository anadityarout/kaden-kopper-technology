import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Market.css";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
  FaEnvelope,
  FaSearch,
  FaFileAlt,
  FaBullhorn,
  FaArrowRight,
  FaChartBar,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaRocket,
  FaChevronDown,
  FaChevronRight,
  FaLightbulb,
  FaTrophy,
  FaSearchPlus,
  FaUserTie,
  FaSlidersH,
  FaCoins,
  FaPlay,
  FaPenNib,
} from "react-icons/fa";

/* =====================================================
   DIGITAL MARKETING API
===================================================== */

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/digitalmarketing";

/* =====================================================
   HELPERS
===================================================== */

const getImageUrl = (item) =>
  item.image || item.imageUrl || item.fileUrl || item.preview || "";

const getMobileImageUrl = (item) =>
  item.mobileImage || item.mobileImageUrl || "";

/* =====================================================
   BANNER TITLE
   Highlights "Digital Marketing" with the gradient
===================================================== */

const HIGHLIGHT_TEXT = "Digital Marketing";

const renderBannerTitle = (name) => {
  const index = name.indexOf(HIGHLIGHT_TEXT);

  if (index === -1) return name;

  const before = name.slice(0, index).trim();
  const after = name.slice(index + HIGHLIGHT_TEXT.length).trim();

  return (
    <>
      {before && (
        <>
          {before}
          <br />
        </>
      )}
      <span className="kk-banner-highlight">{HIGHLIGHT_TEXT}</span>
      {after && (
        <>
          <br />
          {after}
        </>
      )}
    </>
  );
};

const TRUST_AVATARS = ["A", "R", "S", "M"];

/* =====================================================
   SERVICES
===================================================== */

const SERVICES = [
  {
    title: "Social Media Marketing",
    text: "Engage your audience and build a strong brand presence across all platforms.",
    icon: "social",
  },
  {
    title: "Google Ads (PPC)",
    text: "Get instant traffic and high-quality leads with targeted ads.",
    icon: "google",
  },
  {
    title: "Search Engine Marketing",
    text: "Increase visibility and drive relevant traffic to your websites.",
    icon: "search",
  },
  {
    title: "Content Marketing",
    text: "Create valuable content that builds trust and drives results.",
    icon: "content",
  },
  {
    title: "Email Marketing",
    text: "Reach your customers with personalized email campaigns.",
    icon: "email",
  },
  {
    title: "Brand Marketing",
    text: "Build a strong brand identity and increase market presence.",
    icon: "brand",
  },
];

const TILE_ICONS = {
  search: [FaSearch, "blue"],
  content: [FaFileAlt, "purple"],
  email: [FaEnvelope, "purple"],
  brand: [FaBullhorn, "blue"],
};

function ServiceIcon({ type }) {
  if (type === "social") {
    return (
      <div className="kk-svc-social" aria-hidden="true">
        <span className="s-fb">
          <FaFacebookF />
        </span>
        <span className="s-in">
          <FaLinkedinIn />
        </span>
        <span className="s-ig">
          <FaInstagram />
        </span>
        <span className="s-tw">
          <FaTwitter />
        </span>
      </div>
    );
  }

  if (type === "google") {
    return (
      <div className="kk-svc-icon kk-svc-icon-google" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="46" height="46">
          <line
            x1="22"
            y1="46"
            x2="35"
            y2="16"
            stroke="#fbbc04"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <line
            x1="35"
            y1="16"
            x2="50"
            y2="46"
            stroke="#4285f4"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <circle cx="16" cy="48" r="8" fill="#34a853" />
        </svg>
      </div>
    );
  }

  const [Icon, tone] = TILE_ICONS[type] || TILE_ICONS.search;

  return (
    <div className={`kk-svc-icon kk-svc-icon-${tone}`} aria-hidden="true">
      <Icon />
    </div>
  );
}

/* =====================================================
   IMPACT IN NUMBERS
===================================================== */

const IMPACT = [
  {
    value: "250+",
    label: "Projects Completed",
    tone: "blue",
    icon: FaChartBar,
    bars: [22, 28, 34, 40, 62, 46, 66, 56, 80, 70, 88, 100],
  },
  {
    value: "98%",
    label: "Client Satisfaction",
    tone: "purple",
    icon: FaShieldAlt,
    bars: [20, 26, 32, 40, 58, 44, 62, 54, 78, 68, 90, 100],
  },
  {
    value: "450%",
    label: "Avg. Traffic Increase",
    tone: "teal",
    icon: FaChartLine,
    bars: [18, 30, 24, 34, 40, 52, 44, 62, 58, 72, 82, 100],
  },
  {
    value: "320%",
    label: "Lead Generation",
    tone: "pink",
    icon: FaUsers,
    bars: [24, 20, 30, 42, 36, 60, 50, 66, 58, 80, 72, 100],
  },
  {
    value: "28%",
    label: "Conversion Rate",
    tone: "orange",
    icon: FaRocket,
    bars: [16, 24, 22, 38, 46, 40, 58, 52, 70, 64, 84, 100],
  },
];

/* =====================================================
   PROCESS
===================================================== */

const PROCESS = [
  {
    title: "Research & Analysis",
    text: "We analyze your business, industry, and target audience.",
    icon: FaSearch,
    tone: "blue",
  },
  {
    title: "Strategy & Planning",
    text: "Create a customized marketing plan with clear goals and timelines.",
    icon: FaLightbulb,
    tone: "purple",
  },
  {
    title: "Campaign Execution",
    text: "We implement high-performing campaigns across multiple platforms.",
    icon: FaRocket,
    tone: "teal",
  },
  {
    title: "Monitor & Optimize",
    text: "We track performance and optimize campaigns for better results.",
    icon: FaChartLine,
    tone: "purple",
  },
  {
    title: "Deliver Growth",
    text: "We provide detailed reports and ensure continuous growth for your business.",
    icon: FaTrophy,
    tone: "blue",
  },
];

/* =====================================================
   WHY CHOOSE US
===================================================== */

const WHY_US = [
  {
    icon: FaSearchPlus,
    title: "Data-Driven Strategies",
    text: "We use analytics to make informed decisions.",
  },
  {
    icon: FaUserTie,
    title: "Experienced Marketing Team",
    text: "Skilled professionals with proven expertise.",
  },
  {
    icon: FaSlidersH,
    title: "Customized Solutions",
    text: "Tailored strategies for your business goals.",
  },
  {
    icon: FaFileAlt,
    title: "Transparent Reporting",
    text: "Clear reports to track progress and results.",
  },
  {
    icon: FaCoins,
    title: "Proven ROI",
    text: "Focused on delivering measurable growth.",
  },
];

/* =====================================================
   PERFORMANCE
===================================================== */

const PERFORMANCE_STATS = [
  { label: "Total Visitors", value: "348K", change: "32%", tone: "blue" },
  { label: "Leads Generated", value: "85.6K", change: "24%", tone: "blue" },
  { label: "Conversions", value: "4.2K", change: "18%", tone: "pink" },
  { label: "Revenue", value: "$20K", change: "20%", tone: "blue" },
];

/* ---------- LINE CHART (values are in thousands) ---------- */

const CHART_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const CHART_MAX = 50;

const CHART_Y_LABELS = ["50K", "40K", "30K", "20K", "10K", "0K"];

const CHART_SERIES = [
  {
    key: "visitors",
    label: "Visitors",
    color: "#19b5f0",
    values: [15, 20, 26, 38, 39, 46],
  },
  {
    key: "leads",
    label: "Leads",
    color: "#5b63f0",
    values: [6, 15, 17, 27, 27, 35],
  },
  {
    key: "conversions",
    label: "Conversions",
    color: "#d62fe6",
    values: [4, 9, 8, 16, 15, 21],
  },
];

/* Point position in % of the plot area (so dots never stretch) */

const chartX = (index) => 5 + (index * 90) / (CHART_MONTHS.length - 1);

const chartY = (value) => 100 - (value / CHART_MAX) * 100;

const buildSmoothPath = (values) => {
  const points = values.map((value, index) => [chartX(index), chartY(value)]);

  let d = `M ${points[0][0]} ${points[0][1]}`;

  for (let i = 1; i < points.length; i += 1) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const cx = (x0 + x1) / 2;

    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }

  return d;
};

/* ---------- TRAFFIC SOURCES (donut is built from this list) ---------- */

const TRAFFIC_SOURCES = [
  { label: "Organic Search", value: 45, color: "#19c6e6" },
  { label: "Social Media", value: 25, color: "#ffab2e" },
  { label: "Paid Ads", value: 15, color: "#e8329f" },
  { label: "Direct", value: 10, color: "#6a4df0" },
  { label: "Referral", value: 5, color: "#8a93a8" },
];

const DONUT_BACKGROUND = (() => {
  const total = TRAFFIC_SOURCES.reduce((sum, item) => sum + item.value, 0);

  let start = 0;

  const stops = TRAFFIC_SOURCES.map((item) => {
    const end = start + (item.value / total) * 100;
    const stop = `${item.color} ${start}% ${end}%`;

    start = end;

    return stop;
  });

  return `conic-gradient(${stops.join(", ")})`;
})();

/* =====================================================
   CAMPAIGNS
===================================================== */

const CAMPAIGNS = [
  {
    title: "E-commerce Brand",
    growth: "+185%",
    label: "Website Traffic",
    tone: "blue",
  },
  {
    title: "Real Estate Business",
    growth: "+330%",
    label: "Lead Generation",
    tone: "purple",
  },
  {
    title: "Education Platform",
    growth: "+320%",
    label: "Enquiries",
    tone: "pink",
  },
  {
    title: "Healthcare Brand",
    growth: "+160%",
    label: "Social Media Reach",
    tone: "orange",
  },
];

/* heights (in %) of the 9 rising bars inside every campaign card */

const CAMPAIGN_BARS = [8, 14, 20, 26, 36, 47, 62, 80, 100];

/* =====================================================
   TOOLS & TECHNOLOGIES
===================================================== */

const TOOLS = [
  { type: "analytics", title: "Google Analytics" },
  { type: "googleads", title: "Google Ads" },
  { type: "meta", title: "Meta Ads" },
  { type: "semrush", title: "SEMrush" },
  { type: "ahrefs", title: "Ahrefs" },
  { type: "moz", title: "Moz" },
  { type: "mailchimp", title: "Mailchimp" },
  { type: "hubspot", title: "HubSpot" },
  { type: "canva", title: "Canva" },
  { type: "hootsuite", title: "Hootsuite" },
];

function ToolIcon({ type }) {
  switch (type) {
    case "analytics":
      return (
        <svg className="kk-tl-svg" viewBox="0 0 48 48" aria-hidden="true">
          <rect x="30" y="6" width="10" height="36" rx="5" fill="#f9ab00" />
          <rect x="18" y="20" width="10" height="22" rx="5" fill="#f9ab00" />
          <circle cx="11" cy="37" r="5" fill="#e37400" />
        </svg>
      );

    case "googleads":
      return (
        <svg className="kk-tl-svg" viewBox="0 0 64 64" aria-hidden="true">
          <line
            x1="22"
            y1="46"
            x2="35"
            y2="16"
            stroke="#fbbc04"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <line
            x1="35"
            y1="16"
            x2="50"
            y2="46"
            stroke="#4285f4"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <circle cx="16" cy="48" r="8" fill="#34a853" />
        </svg>
      );

    case "meta":
      return (
        <svg
          className="kk-tl-svg kk-tl-svg-wide"
          viewBox="0 0 64 40"
          aria-hidden="true"
        >
          <path
            d="M32 20 C26 9 20 6 14 6 C7 6 3 12 3 20 C3 28 7 34 14 34 C20 34 26 31 32 20 C38 9 44 6 50 6 C57 6 61 12 61 20 C61 28 57 34 50 34 C44 34 38 31 32 20 Z"
            fill="none"
            stroke="#0866ff"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "semrush":
      return (
        <svg className="kk-tl-svg" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24 10a15 15 0 1 0 15 15"
            fill="none"
            stroke="#ff642d"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M29 5c8 0 15 5 15 13-5-3-10-2-13 2 0-5-1-10-2-15z"
            fill="#ff642d"
          />
          <path
            d="M3 22h8M5 30h7"
            stroke="#ff642d"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );

    case "ahrefs":
      return (
        <span className="kk-tl-text kk-tl-ahrefs">
          <i>a</i>
          hrefs
        </span>
      );

    case "moz":
      return <span className="kk-tl-text kk-tl-moz">MOZ</span>;

    case "mailchimp":
      return (
        <svg className="kk-tl-svg" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="27" r="17" fill="#ffe01b" />
          <path
            d="M17 11c3-5 9-6 14-2"
            fill="none"
            stroke="#241c15"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="18" cy="25" r="3" fill="#241c15" />
          <circle cx="30" cy="25" r="3" fill="#241c15" />
          <path
            d="M17 34c4 3 10 3 14 0"
            fill="none"
            stroke="#241c15"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "hubspot":
      return (
        <svg className="kk-tl-svg" viewBox="0 0 48 48" aria-hidden="true">
          <circle
            cx="29"
            cy="29"
            r="9"
            fill="none"
            stroke="#ff7a59"
            strokeWidth="5"
          />
          <circle cx="29" cy="8" r="4.5" fill="#ff7a59" />
          <path d="M29 12v8" stroke="#ff7a59" strokeWidth="4" />
          <circle cx="8" cy="15" r="4.5" fill="#ff7a59" />
          <path d="M11 17l11 7" stroke="#ff7a59" strokeWidth="4" />
          <circle cx="12" cy="41" r="4" fill="#ff7a59" />
          <path d="M15 38l8-5" stroke="#ff7a59" strokeWidth="4" />
        </svg>
      );

    case "canva":
      return <span className="kk-tl-canva">Canva</span>;

    case "hootsuite":
      return (
        <svg className="kk-tl-svg" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M8 6h32v24c0 8-8 12-16 14C16 42 8 38 8 30z"
            fill="#1c6fc4"
          />
          <circle cx="17" cy="20" r="6" fill="#ffffff" />
          <circle cx="31" cy="20" r="6" fill="#ffffff" />
          <circle cx="17" cy="20" r="2.4" fill="#0e2f55" />
          <circle cx="31" cy="20" r="2.4" fill="#0e2f55" />
          <path d="M24 25l-3.5 6h7z" fill="#f5a623" />
        </svg>
      );

    default:
      return null;
  }
}

/* =====================================================
   FAQ
===================================================== */

const FAQS = [
  {
    question: "What digital marketing services do you offer?",
    answer:
      "We provide SEO, social media marketing, PPC advertising, content marketing, email marketing, branding, influencer marketing, analytics, and performance optimization.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "The timeline depends on the service and business goals. Paid campaigns can generate results quickly, while SEO and content marketing generally require consistent long-term optimization.",
  },
  {
    question: "Which channels are best for my business?",
    answer:
      "We analyze your audience, industry, competitors, and goals before selecting the channels that are most likely to generate meaningful results.",
  },
  {
    question: "How do you measure campaign success?",
    answer:
      "We track important KPIs such as traffic, engagement, leads, conversions, customer acquisition cost, revenue, and return on investment.",
  },
  {
    question: "Can you work with our existing marketing team?",
    answer:
      "Yes. We can work as an extension of your existing team or manage the complete digital marketing strategy depending on your requirements.",
  },
  {
    question: "Do you provide monthly reports?",
    answer:
      "Yes. We provide clear performance reports with important metrics, campaign insights, recommendations, and next-step strategies.",
  },
];

/* =====================================================
   MARKETING CHANNELS
===================================================== */

const MARKETING_CHANNELS = [
  { type: "google", title: "Google Ads" },
  { type: "facebook", title: "Facebook Ads" },
  { type: "instagram", title: "Instagram Marketing" },
  { type: "linkedin", title: "LinkedIn Marketing" },
  { type: "youtube", title: "YouTube Marketing" },
  { type: "x", title: "Twitter (X) Marketing" },
  { type: "email", title: "Email Marketing" },
  { type: "content", title: "Content Marketing" },
];

function ChannelIcon({ type }) {
  if (type === "google") {
    return (
      <svg
        className="kk-ch-google"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <line
          x1="22"
          y1="46"
          x2="35"
          y2="16"
          stroke="#fbbc04"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <line
          x1="35"
          y1="16"
          x2="50"
          y2="46"
          stroke="#4285f4"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle cx="16" cy="48" r="8" fill="#34a853" />
      </svg>
    );
  }

  if (type === "x") {
    return (
      <svg className="kk-ch-x" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </svg>
    );
  }

  const tiles = {
    facebook: <FaFacebookF />,
    instagram: <FaInstagram />,
    linkedin: <FaLinkedinIn />,
    youtube: <FaPlay />,
    email: <FaEnvelope />,
    content: <FaPenNib />,
  };

  return (
    <span className={`kk-ch-tile kk-ch-tile-${type}`} aria-hidden="true">
      {tiles[type]}
    </span>
  );
}

/* =====================================================
   MARKET COMPONENT
===================================================== */

function Market() {
  const [marketItems, setMarketItems] = useState([]);
  const [marketLoading, setMarketLoading] = useState(true);

  /* =====================================================
     LOAD DIGITAL MARKETING DATA FROM BACKEND
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadMarketData = async () => {
      try {
        setMarketLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Digital Marketing API error: ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          setMarketItems(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Digital Marketing loading error:", error);

        if (!cancelled) {
          setMarketItems([]);
        }
      } finally {
        if (!cancelled) {
          setMarketLoading(false);
        }
      }
    };

    loadMarketData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     BACKEND CATEGORIES
  ===================================================== */

  const marketBannerItems = marketItems.filter(
    (item) => item.category === "Banner" && getImageUrl(item)
  );

  const marketDigitalItems = marketItems.filter(
    (item) => item.category === "Digital Marketing"
  );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="kk-market-page">
      {/* =====================================================
          MARKET BANNER
          Image, name, subtitle and description come from admin.
      ===================================================== */}

      <section className="kk-market-banner">
        {marketLoading ? (
          <div className="kk-market-banner-placeholder"></div>
        ) : marketBannerItems.length > 0 ? (
          (() => {
            const banner = marketBannerItems[0];
            const imageUrl = getImageUrl(banner);
            const mobileImageUrl = getMobileImageUrl(banner);

            return (
              <div className="kk-market-banner-content">
                <div className="kk-market-banner-copy">
                  <span className="kk-banner-badge">
                    DIGITAL MARKETING SERVICES
                  </span>

                  {banner.name && <h1>{renderBannerTitle(banner.name)}</h1>}

                  {banner.subtitle && <h2>{banner.subtitle}</h2>}

                  {banner.description && <p>{banner.description}</p>}

                  <div className="kk-banner-actions">
                    <Link
                      to="/start-a-project"
                      className="kk-banner-btn kk-banner-btn-primary"
                    >
                      Start Your Project Now <span>+</span>
                    </Link>

                    <a
                      href="#case-studies"
                      className="kk-banner-btn kk-banner-btn-outline"
                    >
                      <span className="kk-banner-play">▶</span>
                      View Our Work
                    </a>
                  </div>

                  <div className="kk-banner-trust">
                    <div className="kk-banner-avatars">
                      {TRUST_AVATARS.map((letter) => (
                        <i key={letter}>{letter}</i>
                      ))}
                    </div>

                    <div className="kk-banner-trust-text">
                      <strong>500+ Brands Trust Us</strong>
                      <span>for Digital Marketing</span>
                    </div>
                  </div>
                </div>

                <div className="kk-market-banner-media">
                  <picture>
                    {mobileImageUrl && (
                      <source
                        media="(max-width: 900px)"
                        srcSet={mobileImageUrl}
                      />
                    )}

                    <img
                      src={imageUrl}
                      alt={banner.name || "Digital Marketing Banner"}
                      className="kk-market-banner-image"
                      loading="eager"
                      decoding="async"
                    />
                  </picture>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="kk-market-banner-placeholder"></div>
        )}
      </section>

      {/* =====================================================
          OUR SERVICES
      ===================================================== */}

      <section className="kk-svc-section" id="services">
        <div className="kk-market-container">
          <div className="kk-svc-header">
            <span className="kk-svc-label">OUR SERVICES</span>

            <h2>Complete Digital Marketing Solutions</h2>

            <p>
              We provide end-to-end digital marketing services to help your
              brand grow, generate leads, and achieve measurable results.
            </p>
          </div>

          <div className="kk-svc-grid">
            {SERVICES.map((service) => (
              <article className="kk-svc-card" key={service.title}>
                <ServiceIcon type={service.icon} />

                <div className="kk-svc-text">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>

                <Link
                  to="/services"
                  className="kk-svc-arrow"
                  aria-label={`Learn more about ${service.title}`}
                >
                  <FaArrowRight />
                </Link>
              </article>
            ))}
          </div>

          <div className="kk-svc-more">
            <Link to="/services">
              View All Services <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR IMPACT IN NUMBERS
      ===================================================== */}

      <section className="kk-imp-section">
        <div className="kk-market-container">
          <div className="kk-imp-header">
            <span className="kk-imp-label">OUR IMPACT IN NUMBERS</span>

            <h2>Real Results. Real Growth.</h2>

            <p>
              We help businesses achieve measurable growth with proven digital
              marketing strategies.
            </p>
          </div>

          <div className="kk-imp-grid">
            {IMPACT.map(({ icon: Icon, value, label, tone, bars }) => (
              <article className={`kk-imp-card kk-imp-${tone}`} key={label}>
                <div className="kk-imp-top">
                  <div className="kk-imp-iconwrap">
                    <span className="kk-imp-icon">
                      <Icon />
                    </span>

                    <FaChevronDown className="kk-imp-chevron" />
                  </div>

                  <div className="kk-imp-text">
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                </div>

                <div className="kk-imp-bars" aria-hidden="true">
                  {bars.map((height, index) => (
                    <i key={index} style={{ height: `${height}%` }}></i>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          DIGITAL MARKETING CONTENT FROM ADMIN
      ===================================================== */}

      {marketDigitalItems.length > 0 && (
        <section className="kk-market-api-content">
          <div className="kk-market-container">
            <div className="kk-market-heading">
              <span>DIGITAL MARKETING</span>
              <h2>Our Digital Marketing</h2>
            </div>

            <div className="kk-market-api-grid">
              {marketDigitalItems.map((item) => {
                const imageUrl = getImageUrl(item);

                return (
                  <article className="kk-market-api-card" key={item.id}>
                    {imageUrl && (
                      <div className="kk-market-api-image-wrapper">
                        <img
                          src={imageUrl}
                          alt={item.name || "Digital Marketing"}
                          className="kk-market-api-image"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="kk-market-api-card-content">
                      {item.name && <h3>{item.name}</h3>}
                      {item.description && <p>{item.description}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          OUR PROCESS
      ===================================================== */}

      <section className="kk-proc-section">
        <div className="kk-market-container">
          <div className="kk-proc-header">
            <span className="kk-proc-label">OUR PROCESS</span>

            <h2>A Transparent Process to Deliver Results</h2>

            <p>
              We follow a proven and data-driven process to ensure consistent
              growth and maximum ROI.
            </p>
          </div>

          <div className="kk-proc-steps">
            {PROCESS.map(({ icon: Icon, title, text, tone }, index) => (
              <div className={`kk-proc-step kk-proc-${tone}`} key={title}>
                <span className="kk-proc-icon">
                  <Icon />
                </span>

                <h3>{title}</h3>

                <p>{text}</p>

                {index !== PROCESS.length - 1 && (
                  <span className="kk-proc-dot"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US + PERFORMANCE
      ===================================================== */}

      <section className="kk-an-section">
        <div className="kk-market-container">
          <div className="kk-an-grid">
            {/* ---------- WHY CHOOSE US ---------- */}

            <div className="kk-an-card kk-an-why">
              <span className="kk-an-label">
                WHY CHOOSE KADEN KOPPER TECHNOLOGY
              </span>

              <h2 className="kk-an-title">
                More Than Just Marketing.
                <br />
                We Create Real Business Value.
              </h2>

              <ul className="kk-an-why-list">
                {WHY_US.map(({ icon: Icon, title, text }) => (
                  <li className="kk-an-why-row" key={title}>
                    <span className="kk-an-why-icon">
                      <Icon />
                    </span>

                    <FaChevronRight className="kk-an-why-chevron" />

                    <div className="kk-an-why-text">
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---------- PERFORMANCE ---------- */}

            <div className="kk-an-card kk-an-perf">
              <span className="kk-an-label">MARKETING PERFORMANCE OVERVIEW</span>

              <h2 className="kk-an-title">Track Growth. Measure Success.</h2>

              {/* STAT BOXES */}

              <div className="kk-an-stats">
                {PERFORMANCE_STATS.map((stat) => (
                  <div className="kk-an-stat" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <small>{stat.label}</small>
                    <em className={`kk-an-change kk-an-change-${stat.tone}`}>
                      <span aria-hidden="true">↑</span> {stat.change}
                    </em>
                  </div>
                ))}
              </div>

              <div className="kk-an-bottom">
                {/* LINE CHART */}

                <div className="kk-an-chart">
                  <div className="kk-an-legend">
                    {CHART_SERIES.map((series) => (
                      <span key={series.key}>
                        <i style={{ background: series.color }}></i>
                        {series.label}
                      </span>
                    ))}
                  </div>

                  <div className="kk-an-plot">
                    <div className="kk-an-yaxis" aria-hidden="true">
                      {CHART_Y_LABELS.map((label, index) => (
                        <span key={label} style={{ top: `${index * 20}%` }}>
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="kk-an-plot-main">
                      <div className="kk-an-area">
                        {CHART_Y_LABELS.map((label, index) => (
                          <span
                            className="kk-an-gridline"
                            key={label}
                            style={{ top: `${index * 20}%` }}
                          ></span>
                        ))}

                        <svg
                          className="kk-an-svg"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                          role="img"
                          aria-label="Marketing performance chart"
                        >
                          {CHART_SERIES.map((series) => (
                            <path
                              key={series.key}
                              d={buildSmoothPath(series.values)}
                              stroke={series.color}
                            />
                          ))}
                        </svg>

                        {CHART_SERIES.map((series) =>
                          series.values.map((value, index) => (
                            <span
                              className="kk-an-dot"
                              key={`${series.key}-${index}`}
                              style={{
                                left: `${chartX(index)}%`,
                                top: `${chartY(value)}%`,
                                borderColor: series.color,
                              }}
                            ></span>
                          ))
                        )}
                      </div>

                      <div className="kk-an-xaxis" aria-hidden="true">
                        {CHART_MONTHS.map((month, index) => (
                          <span
                            key={month}
                            style={{ left: `${chartX(index)}%` }}
                          >
                            {month}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* TRAFFIC SOURCES */}

                <div className="kk-an-traffic">
                  <h3>Traffic Sources</h3>

                  <div className="kk-an-traffic-body">
                    <div
                      className="kk-an-donut"
                      style={{ background: DONUT_BACKGROUND }}
                      role="img"
                      aria-label="Traffic sources donut chart"
                    >
                      <span className="kk-an-donut-hole"></span>
                    </div>

                    <ul className="kk-an-traffic-legend">
                      {TRAFFIC_SOURCES.map((source) => (
                        <li key={source.label}>
                          <i style={{ background: source.color }}></i>
                          <span>{source.label}</span>
                          <strong>{source.value}%</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MARKETING CHANNELS
      ===================================================== */}

      <section className="kk-ch-section">
        <div className="kk-market-container">
          <div className="kk-ch-header">
            <span className="kk-ch-label">DIGITAL MARKETING CHANNELS</span>

            <h2>Platforms We Work On</h2>

            <p>
              We use multiple platforms to maximize your brand&apos;s reach
              and engagement.
            </p>
          </div>

          <div className="kk-ch-grid">
            {MARKETING_CHANNELS.map(({ type, title }) => (
              <div className="kk-ch-card" key={title}>
                <div className="kk-ch-icon">
                  <ChannelIcon type={type} />
                </div>

                <span>{title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CAMPAIGNS
      ===================================================== */}

      <section className="kk-cs-section" id="case-studies">
        <div className="kk-market-container">
          <div className="kk-cs-header">
            <div className="kk-cs-heading">
              <span className="kk-cs-label">OUR SUCCESSFUL CAMPAIGNS</span>

              <h2>Campaigns That Deliver Real Results</h2>

              <p>Here are some of our latest achievements.</p>
            </div>

            <a href="#contact" className="kk-cs-btn">
              View All Campaigns <span>+</span>
            </a>
          </div>

          <div className="kk-cs-grid">
            {CAMPAIGNS.map((campaign) => (
              <article
                className={`kk-cs-card kk-cs-${campaign.tone}`}
                key={campaign.title}
              >
                <div className="kk-cs-text">
                  <h3>{campaign.title}</h3>

                  <strong>{campaign.growth}</strong>

                  <span>{campaign.label}</span>
                </div>

                <div className="kk-cs-bars" aria-hidden="true">
                  {CAMPAIGN_BARS.map((height, index) => (
                    <i key={index} style={{ height: `${height}%` }}></i>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          TOOLS & TECHNOLOGIES
      ===================================================== */}

      <section className="kk-tl-section">
        <div className="kk-market-container">
          <div className="kk-tl-header">
            <span className="kk-tl-label">TOOLS &amp; TECHNOLOGIES WE USE</span>

            <h2>Industry-Leading Tools for Better Results</h2>

            <p>
              We use the best tools and technologies to deliver accurate
              insights and better performance.
            </p>
          </div>

          <div className="kk-tl-grid">
            {TOOLS.map(({ type, title }) => (
              <div className="kk-tl-card" key={title}>
                <div className="kk-tl-icon">
                  <ToolIcon type={type} />
                </div>

                <span>{title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="kk-market-faq">
        <div className="kk-market-container">
          <div className="kk-market-heading">
            <span>FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p>
              Find answers to common questions about our digital marketing
              services.
            </p>
          </div>

          <div className="kk-faq-grid">
            {FAQS.map((faq) => (
              <details key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <b>+</b>
                </summary>

                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="kk-market-final-cta" id="contact">
        <div className="kk-market-container">
          <div className="kk-final-cta-box">
            <div className="kk-final-visual">🎯</div>

            <div className="kk-final-content">
              <span>READY TO GROW YOUR BUSINESS ONLINE?</span>

              <h2>
                Let's Create a Digital Marketing Strategy That Drives Growth
              </h2>

              <p>
                Tell us about your business and let's build a strategy that
                delivers real results.
              </p>
            </div>

            <Link to="/start-a-project" className="kk-market-btn">
              Start Your Project Now →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Market;
