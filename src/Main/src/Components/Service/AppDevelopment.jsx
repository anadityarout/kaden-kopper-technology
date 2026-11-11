import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AppDevelopment.css";

/* SERVICE CARD IMAGES
   If this file is directly inside src/ use "./assets/..."
   If it is inside src/pages or src/components use "../assets/..." */
import app1 from "../../assets/App1.png";
import app2 from "../../assets/App2.png";
import app3 from "../../assets/App3.png";
import app4 from "../../assets/App4.png";

/* =====================================================
   APP DEVELOPMENT API
===================================================== */

const APP_DEVELOPMENT_API =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/appdevelopment";

/* =====================================================
   BANNER
   Text comes from the admin dashboard:
   - Name        -> headline (last words get the blue/purple gradient)
   - Description -> paragraph under the headline
   - Image       -> artwork on the right
   Category must be "Banner".

   Banner styles are in AppDevelopment.css (section BANNER).
   All classes use the unique prefix "kk-ab-".
===================================================== */

const BANNER_BADGE_TEXT = "MOBILE APP DEVELOPMENT";
const BANNER_SLIDE_INTERVAL = 5000;

/* shown only if the admin Name / Description are empty */
const BANNER_DEFAULT_TITLE =
  "Build Powerful Mobile Experiences That Drive Real Growth";

const BANNER_DEFAULT_DESCRIPTION =
  "We design and develop fast, secure, and scalable mobile applications for iOS and Android that turn your ideas into successful digital products.";

const bannerFeatures = [
  {
    title: "Scalable",
    text: "Architecture",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3L3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M3 12.5l9 5 9-5M3 17l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Secure",
    text: "Development",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l7 3v5.5c0 4.4-2.9 8.2-7 9.5-4.1-1.3-7-5.1-7-9.5V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="11.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: "High",
    text: "Performance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 6.5a8 8 0 1 0 10 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Modern",
    text: "UI/UX",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 9.5h17M9 9.5v10" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
];

const getBannerImageSrc = (item) =>
  item?.image || item?.imageUrl || item?.fileUrl || item?.preview || "";

/* last words of the name get the blue-purple gradient */
const splitBannerTitle = (title) => {
  const words = title.trim().split(/\s+/);

  let count = 0;
  if (words.length > 4) count = 4;
  else if (words.length >= 3) count = 2;

  if (!count) {
    return { main: words.join(" "), highlight: "" };
  }

  return {
    main: words.slice(0, -count).join(" "),
    highlight: words.slice(-count).join(" "),
  };
};

function AppBanner({ banners = [] }) {

  const [index, setIndex] = useState(0);

  const count = banners.length;

  useEffect(() => {
    setIndex(0);
  }, [count]);

  useEffect(() => {

    if (count <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, BANNER_SLIDE_INTERVAL);

    return () => clearInterval(timer);

  }, [count, index]);

  const safeIndex = count > 0 ? Math.min(index, count - 1) : 0;

  const active = banners[safeIndex] || null;

  const image = getBannerImageSrc(active);

  const title =
    (active?.name || active?.title || "").trim() ||
    BANNER_DEFAULT_TITLE;

  const description =
    (active?.description || "").trim() ||
    BANNER_DEFAULT_DESCRIPTION;

  const { main, highlight } = splitBannerTitle(title);

  return (
    <section className="kk-ab" aria-label="Mobile app development">

      <div className="kk-ab-inner">

        {/* LEFT : TEXT (from admin Name + Description) */}

        <div className="kk-ab-text" key={`text-${safeIndex}`}>

          <span className="kk-ab-badge">{BANNER_BADGE_TEXT}</span>

          <h1 className="kk-ab-title">
            <span className="kk-ab-title-main">{main}</span>

            {highlight && (
              <span className="kk-ab-title-highlight">{highlight}</span>
            )}
          </h1>

          <p className="kk-ab-desc">{description}</p>

          <div className="kk-ab-buttons">

            <Link to="/contact" className="kk-ab-btn kk-ab-btn--primary">
              Start Your App
              <span aria-hidden="true">→</span>
            </Link>

            <Link to="/portfolio" className="kk-ab-btn kk-ab-btn--ghost">
              Explore Our Work
            </Link>

          </div>

          <div className="kk-ab-features">

            {bannerFeatures.map((feature) => (

              <div className="kk-ab-feature" key={feature.title}>

                <div className="kk-ab-feature-icon">{feature.icon}</div>

                <div className="kk-ab-feature-text">
                  <strong>{feature.title}</strong>
                  <span>{feature.text}</span>
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT : ARTWORK (the uploaded admin image) */}

        <div className="kk-ab-visual">

          {image && (
            <img
              key={image}
              src={image}
              alt="Mobile app development illustration"
              className="kk-ab-art"
            />
          )}

        </div>

      </div>

      {count > 1 && (
        <div className="kk-ab-dots">

          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`kk-ab-dot ${i === safeIndex ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}

        </div>
      )}

    </section>
  );
}

/* =====================================================
   SATISFACTION CIRCLE
===================================================== */

function SatisfactionCircle({ value, label, type }) {
  return (
    <div className="kk-app-satisfaction-item">
      <div className={`kk-app-satisfaction-circle kk-app-circle-${type}`}>
        <span>{value}</span>
      </div>

      <p>{label}</p>
    </div>
  );
}

/* =====================================================
   PERFORMANCE CARD
===================================================== */

function PerformanceCard({ title, value, growth, type, points }) {

  const colors = {
    blue: "#2585ed",
    purple: "#7545e8",
    green: "#20b58d",
    red: "#ef4b4b",
  };

  const color = colors[type];

  return (
    <div className="kk-app-performance-card">

      <div className="kk-app-performance-top">

        <div className="kk-app-performance-name">

          <div className={`kk-app-mini-icon kk-app-mini-${type}`}>
            ▣
          </div>

          <div>
            <span>{title}</span>
            <strong>{value}</strong>
          </div>

        </div>

        <span
          className={`kk-app-growth ${
            type === "red" ? "kk-app-growth-red" : "kk-app-growth-green"
          }`}
        >
          {growth}
        </span>

      </div>

      <div className="kk-app-line-chart">

        <svg viewBox="0 0 320 80" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

      </div>

    </div>
  );
}

/* =====================================================
   LEGEND
===================================================== */

function Legend({ color, name, value }) {
  return (
    <div>
      <span className={`legend-dot ${color}`} />
      <span>{name}</span>
      <strong>{value}</strong>
    </div>
  );
}

/* =====================================================
   TECHNOLOGY STACK (tabs + layered illustration)
   Tab data is in techTabs at the bottom of this file.
   Each item: name, mark (short text), bg / fg colours.
   To use a real logo, add  logo: "/images/tech/swift.png"
   to the item and it replaces the text mark.
===================================================== */

const STACK_LAYERS = [
  { name: "Mobile",   top: "#5aaeff", left: "#1d5fd8", right: "#2a76f0" },
  { name: "Backend",  top: "#3a85f2", left: "#1646b8", right: "#2160d8" },
  { name: "Database", top: "#9576f2", left: "#5a3fc0", right: "#7050dc" },
  { name: "Cloud",    top: "#4a94f6", left: "#1a52c4", right: "#276be0" },
  { name: "Security", top: "#2d6bea", left: "#153aa0", right: "#1d4fc4" },
];

const STACK_CX = 170;
const STACK_HW = 115;
const STACK_HH = 48;
const STACK_T = 14;
const STACK_GAP = 62;
const STACK_TOP = 60;

function StackIllustration() {

  const [activeLayer, setActiveLayer] = useState(null);

  /* draw bottom layer first so the top layer overlaps it */
  const order = STACK_LAYERS.map((layer, i) => i).reverse();

  return (
    <svg
      className="kk-app-stack-art"
      viewBox="0 0 490 400"
      role="img"
      aria-label="Mobile, backend, database, cloud and security layers"
    >

      {order.map((i) => {

        const layer = STACK_LAYERS[i];
        const cy = STACK_TOP + i * STACK_GAP;
        const pillY = cy + 6 - 21;

        const top = `${STACK_CX},${cy - STACK_HH} ${STACK_CX + STACK_HW},${cy} ${STACK_CX},${cy + STACK_HH} ${STACK_CX - STACK_HW},${cy}`;
        const left = `${STACK_CX - STACK_HW},${cy} ${STACK_CX},${cy + STACK_HH} ${STACK_CX},${cy + STACK_HH + STACK_T} ${STACK_CX - STACK_HW},${cy + STACK_T}`;
        const right = `${STACK_CX + STACK_HW},${cy} ${STACK_CX},${cy + STACK_HH} ${STACK_CX},${cy + STACK_HH + STACK_T} ${STACK_CX + STACK_HW},${cy + STACK_T}`;

        const isActive = activeLayer === i;

        return (
          <g
            key={layer.name}
            className={`kk-app-stack-layer ${isActive ? "is-active" : ""}`}
            onMouseEnter={() => setActiveLayer(i)}
            onMouseLeave={() => setActiveLayer(null)}
          >

            {/* dotted connector */}
            <line
              className="kk-app-stack-line"
              x1={STACK_CX + STACK_HW * 0.55}
              y1={cy + STACK_HH * 0.45}
              x2="352"
              y2={pillY + 21}
            />

            {/* slab */}
            <g className="kk-app-stack-slab">
              <polygon points={left} fill={layer.left} />
              <polygon points={right} fill={layer.right} />
              <polygon points={top} fill={layer.top} />
              <polygon
                points={`${STACK_CX},${cy - STACK_HH + 8} ${STACK_CX + STACK_HW - 22},${cy} ${STACK_CX},${cy + STACK_HH - 8} ${STACK_CX - STACK_HW + 22},${cy}`}
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.2"
              />
            </g>

            {/* label pill */}
            <g className="kk-app-stack-pill">
              <rect x="352" y={pillY} width="130" height="42" rx="10" />
              <rect
                className="kk-app-stack-pill-icon"
                x="362"
                y={pillY + 9}
                width="24"
                height="24"
                rx="7"
              />
              <circle cx="374" cy={pillY + 21} r="4.2" fill="#ffffff" />
              <text x="396" y={pillY + 26}>{layer.name}</text>
            </g>

          </g>
        );
      })}

    </svg>
  );
}

function TechStack() {

  const [activeTab, setActiveTab] = useState(0);

  const tab = techTabs[activeTab];

  return (
    <section className="kk-app-stack" aria-label="Technology stack">

      <div className="kk-app-stack-inner">

        {/* LEFT */}

        <div className="kk-app-stack-left">

          <span className="kk-app-stack-label">TECHNOLOGIES WE USE</span>

          <h2>Our Mobile App Development Technology Stack</h2>

          <p>
            We work with modern and reliable technologies to build
            powerful mobile applications.
          </p>

          <div
            className="kk-app-stack-tabs"
            role="tablist"
            aria-label="Technology categories"
          >

            {techTabs.map((item, index) => (

              <button
                key={item.title}
                type="button"
                role="tab"
                id={`kk-stack-tab-${index}`}
                aria-selected={index === activeTab}
                aria-controls="kk-stack-panel"
                className={`kk-app-stack-tab ${
                  index === activeTab ? "kk-app-stack-tab--active" : ""
                }`}
                onClick={() => setActiveTab(index)}
              >
                {item.title}
              </button>

            ))}

          </div>

          <div
            className="kk-app-stack-panel"
            id="kk-stack-panel"
            role="tabpanel"
            aria-labelledby={`kk-stack-tab-${activeTab}`}
            key={tab.title}
          >

            {tab.items.map((item) => (

              <div className="kk-app-stack-item" key={item.name}>

                <div
                  className="kk-app-stack-tile"
                  style={{ "--tile-bg": item.bg, "--tile-fg": item.fg }}
                >

                  {item.logo ? (
                    <img src={item.logo} alt="" />
                  ) : (
                    <span>{item.mark}</span>
                  )}

                </div>

                <span className="kk-app-stack-name">{item.name}</span>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT */}

        <div className="kk-app-stack-right">
          <StackIllustration />
        </div>

      </div>

    </section>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

function AppDevelopment() {

  /* AWS APP DEVELOPMENT DATA (banner only) */

  const [appImages, setAppImages] = useState([]);

  /* LOAD APP DEVELOPMENT IMAGES FROM AWS */

  useEffect(() => {

    const loadAppImages = async () => {

      try {

        const response = await fetch(APP_DEVELOPMENT_API);

        if (!response.ok) {
          throw new Error(
            `Failed to load App Development data: ${response.status}`
          );
        }

        const data = await response.json();

        setAppImages(Array.isArray(data) ? data : []);

      } catch (error) {

        console.error("App Development API error:", error);

        setAppImages([]);

      }

    };

    loadAppImages();

  }, []);

  /* GET ALL ITEMS BY CATEGORY */

  const getAppImages = (category) =>
    appImages.filter(
      (image) =>
        image.category?.toLowerCase() === category.toLowerCase()
    );

  const bannerImages = getAppImages("Banner");

  return (
    <main className="kk-app-development-page">

      {/* BANNER */}

      <AppBanner banners={bannerImages} />

      {/* STATS */}

      <section className="kk-app-stats">

        <div className="kk-app-stats-wrapper">

          {appStats.map((stat) => (

            <div className="kk-app-stat-card" key={stat.value}>

              <div className={`kk-app-stat-icon kk-app-stat-icon-${stat.color}`}>
                {stat.icon}
              </div>

              <div className="kk-app-stat-content">

                <strong>{stat.value}</strong>

                <h3>{stat.title}</h3>

                <p>
                  {stat.line1}
                  <br />
                  {stat.line2}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* WHAT WE BUILD */}

      <section className="kk-app-svc" aria-label="Our services">

        <div className="kk-app-svc-header">

          <span className="kk-app-svc-label">OUR SERVICES</span>

          <h2>What We Build</h2>

          <p>
            End-to-end mobile app development solutions tailored to
            your business needs.
          </p>

        </div>

        <div className="kk-app-svc-grid">

          {appServices.map((service) => (

            <Link to="/contact" className="kk-app-svc-card" key={service.title}>

              <div className="kk-app-svc-media">
                <img src={service.image} alt={service.title} loading="lazy" />
              </div>

              <div className="kk-app-svc-icon">{service.icon}</div>

              <div className="kk-app-svc-body">

                <h3>{service.title}</h3>

                <p>{service.description}</p>

              </div>

              <span className="kk-app-svc-arrow" aria-hidden="true">→</span>

            </Link>

          ))}

        </div>

      </section>

      {/* POWERFUL FEATURES */}

      <section className="kk-app-features">

        <div className="kk-app-features-header">

          <h2>Powerful Features We Build</h2>

          <p>
            Modern Android apps with advanced features to deliver
            exceptional user experiences.
          </p>

        </div>

        <div className="kk-app-features-grid">

          {appFeatures.map((feature) => (

            <div className="kk-app-feature-item" key={feature.title}>

              <div
                className={`kk-app-feature-icon kk-app-feature-icon-${feature.color}`}
              >
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

            </div>

          ))}

        </div>

      </section>

      {/* PROCESS */}

      <section className="kk-app-process">

        <div className="kk-app-process-header">

          <h2>Our Android App Development Process</h2>

          <p>
            A streamlined process to turn your idea into a
            successful Android application.
          </p>

        </div>

        <div className="kk-app-process-timeline">

          {appProcessSteps.map((step, index) => (

            <div className="kk-app-process-step" key={step.title}>

              {index < appProcessSteps.length - 1 && (
                <div className="kk-app-process-line" />
              )}

              <div
                className={`kk-app-process-icon kk-app-process-icon-${index + 1}`}
              >
                {step.icon}
              </div>

              <div className="kk-app-process-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3>{step.title}</h3>

              <p>{step.shortDescription}</p>

            </div>

          ))}

        </div>

      </section>

      {/* TECHNOLOGY STACK */}

      <TechStack />

      {/* TECHNOLOGY EXPERTISE */}

      <section className="kk-app-expertise">

        <div className="kk-app-expertise-header">

          <div className="kk-app-expertise-title">

            <span className="kk-app-expertise-label">
              TECHNOLOGY PERFORMANCE
            </span>

            <h2>Technology Expertise Overview</h2>

            <p>
              Our Android app development expertise combines modern
              technologies, scalable architecture, and proven delivery
              capabilities to create reliable digital experiences.
            </p>

          </div>

          <button type="button" className="kk-app-expertise-filter">

            <span>Last 6 Months</span>

            <span className="kk-app-filter-arrow">⌄</span>

          </button>

        </div>

        {/* TOP GRAPH CARDS */}

        <div className="kk-app-performance-grid">

          <PerformanceCard
            title="Android App Development"
            value="84,625"
            growth="↑ 12.3%"
            type="blue"
            points="0,65 25,50 50,61 75,45 100,58 125,37 150,35 175,28 200,20 220,40 245,25 270,32 290,14 320,24"
          />

          <PerformanceCard
            title="Mobile Applications"
            value="64,320"
            growth="↑ 14.8%"
            type="purple"
            points="0,65 25,52 45,62 65,48 90,55 110,43 130,51 155,35 180,40 205,27 225,35 245,15 265,38 285,22 305,35 320,20"
          />

          <PerformanceCard
            title="E-Commerce Apps"
            value="52,870"
            growth="↑ 11.2%"
            type="green"
            points="0,65 20,52 40,62 60,48 85,44 105,30 125,40 145,34 165,45 185,27 205,22 225,42 245,30 265,16 285,47 305,30 320,42"
          />

          <PerformanceCard
            title="API Integrations"
            value="28,430"
            growth="↓ 3.2%"
            type="red"
            points="0,65 25,52 45,63 65,45 90,47 115,55 135,45 160,40 180,45 205,34 225,32 245,48 265,30 285,40 305,25 320,10"
          />

        </div>

        {/* BOTTOM GRAPH AREA */}

        <div className="kk-app-insights-grid">

          {/* SUCCESS */}

          <div className="kk-app-insight-card kk-app-success-card">

            <h3>Project Success &amp; Insights</h3>

            <div className="kk-app-big-circle">

              <div className="kk-app-big-circle-inner">

                <strong>95%</strong>

                <span>Success Rate</span>

              </div>

            </div>

            <p>
              Delivering high-quality Android apps
              <br />
              that create real value.
            </p>

          </div>

          {/* PROJECT DISTRIBUTION */}

          <div className="kk-app-insight-card">

            <h3>Project Distribution</h3>

            <div className="kk-app-projects-content">

              <div className="kk-app-project-donut">

                <div className="kk-app-project-donut-inner">

                  <strong>100+</strong>

                  <span>Projects</span>

                </div>

              </div>

              <div className="kk-app-industry-legend">

                <Legend color="blue" name="Business Apps" value="25%" />
                <Legend color="purple" name="E-Commerce" value="20%" />
                <Legend color="red" name="On-Demand Apps" value="18%" />
                <Legend color="yellow" name="Education" value="12%" />
                <Legend color="green" name="Healthcare" value="10%" />
                <Legend color="cyan" name="Travel & Hospitality" value="8%" />
                <Legend color="violet" name="Others" value="7%" />

              </div>

            </div>

          </div>

          {/* CLIENT SATISFACTION */}

          <div className="kk-app-insight-card kk-app-satisfaction-card">

            <h3>Client Satisfaction</h3>

            <div className="kk-app-satisfaction-grid">

              <SatisfactionCircle value="98%" label="Quality" type="blue" />
              <SatisfactionCircle value="96%" label="Communication" type="purple" />
              <SatisfactionCircle value="92%" label="On-Time Delivery" type="yellow" />
              <SatisfactionCircle value="94%" label="Technical Expertise" type="red" />
              <SatisfactionCircle value="90%" label="Support" type="green" />
              <SatisfactionCircle value="95%" label="Value for Money" type="cyan" />

            </div>

          </div>

        </div>

      </section>

      {/* INDUSTRIES */}

      <section className="kk-app-ind" aria-label="Industries we serve">

        <div className="kk-app-ind-header">

          <span className="kk-app-ind-label">INDUSTRIES</span>

          <h2>Mobile Solutions for Every Industry</h2>

          <p>
            We deliver industry-specific mobile solutions tailored to
            unique business challenges.
          </p>

        </div>

        <div className="kk-app-ind-grid">

          {appIndustries.map((industry) => (

            <div
              className="kk-app-ind-card"
              key={industry.title}
              style={{ "--ind-color": industry.color }}
            >

              <div className="kk-app-ind-icon">{industry.icon}</div>

              <h3>{industry.title}</h3>

              <p>{industry.subtitle}</p>

            </div>

          ))}

        </div>

      </section>

      {/* WHY CHOOSE US */}

      <section className="kk-app-adv" aria-label="Why choose us">

        <div className="kk-app-adv-header">

          <span className="kk-app-adv-label">OUR ADVANTAGE</span>

          <h2>Why Choose Kaden Koppers Technology</h2>

          <p>
            We deliver more than just apps. We create digital
            experiences that create value.
          </p>

        </div>

        <div className="kk-app-adv-grid">

          {appAdvantages.map((item) => (

            <div className="kk-app-adv-card" key={item.title}>

              <div className="kk-app-adv-icon">{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}

/* =====================================================
   STATS
===================================================== */

const appStats = [
  {
    value: "50+",
    title: "Apps Delivered",
    line1: "Successful Android apps",
    line2: "across industries",
    color: "blue",
    icon: (
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="18" cy="32" r="8" fill="currentColor" />
        <path d="M26 31L42 15L49 22L33 38L26 31Z" fill="currentColor" />
        <circle cx="45" cy="15" r="6" fill="currentColor" />
        <path d="M29 40L40 29L48 37L37 48L29 40Z" fill="currentColor" />
      </svg>
    ),
  },

  {
    value: "30+",
    title: "Happy Clients",
    line1: "Businesses trust",
    line2: "our expertise",
    color: "green",
    icon: (
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="22" cy="23" r="8" fill="currentColor" />
        <circle cx="42" cy="23" r="8" fill="currentColor" />
        <circle cx="32" cy="18" r="9" fill="currentColor" />
        <path d="M7 49C7 41 13 35 21 35C29 35 35 41 35 49V52H7V49Z" fill="currentColor" />
        <path d="M29 49C29 41 35 35 43 35C51 35 57 41 57 49V52H29V49Z" fill="currentColor" />
      </svg>
    ),
  },

  {
    value: "95%",
    title: "Client Satisfaction",
    line1: "We build long-term",
    line2: "partnerships",
    color: "blue",
    icon: (
      <svg viewBox="0 0 64 64" fill="none">
        <path
          d="M32 5L39 11L48 10L50 19L58 25L53 33L55 42L46 45L41 54L32 50L23 55L18 46L9 43L11 34L6 26L14 20L15 11L25 12L32 5Z"
          fill="currentColor"
        />
        <circle cx="32" cy="30" r="10" stroke="white" strokeWidth="4" />
        <path
          d="M27 30L31 34L38 26"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    value: "24/7",
    title: "Support & Maintenance",
    line1: "Always here for",
    line2: "your success",
    color: "purple",
    icon: (
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="28" cy="28" r="17" stroke="currentColor" strokeWidth="6" />
        <path d="M28 18V28L35 34" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M42 42L52 52" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* =====================================================
   PROCESS
===================================================== */

const appProcessSteps = [
  {
    title: "Discovery",
    shortDescription:
      "Understand your business goals and project requirements.",
    description:
      "We understand your business goals, target audience, technical requirements, and project objectives to create a clear development direction.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V18.5C20 19.33 19.33 20 18.5 20H5.5C4.67 20 4 19.33 4 18.5V5.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M8 12L10.5 14.5L16 9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    title: "Planning & Strategy",
    shortDescription:
      "Define features, technology, architecture, and roadmap.",
    description:
      "We define the application features, technology stack, architecture, integrations, timeline, and development roadmap.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 8H16M8 12H16M8 16H13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },

  {
    title: "UI/UX Design",
    shortDescription:
      "Create intuitive and engaging mobile experiences.",
    description:
      "Our designers create intuitive interfaces following Android design principles while focusing on usability, accessibility, and engagement.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M8 15L10.5 12.5L13 15L16 11"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    title: "Development",
    shortDescription:
      "Build scalable Android applications using best practices.",
    description:
      "Our developers build the application using modern Android technologies while integrating APIs, backend systems, and required third-party services.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="5" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M9 3L7 6M15 3L17 6M9 11L11 13L9 15M15 11L13 13L15 15"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  {
    title: "Testing & QA",
    shortDescription:
      "Ensure quality, security, stability, and performance.",
    description:
      "We test the application across different devices, Android versions, screen sizes, network conditions, and real-world scenarios.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L19 6V11C19 15.5 16.1 19.2 12 21C7.9 19.2 5 15.5 5 11V6L12 3Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 12L10.8 14.3L15.5 9.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    title: "Launch & Support",
    shortDescription:
      "Deploy to Play Store and provide ongoing support.",
    description:
      "We handle deployment, Play Store submission, launch support, monitoring, updates, maintenance, and continuous optimization.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M8 12L10.5 14.5L16 9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/* =====================================================
   POWERFUL FEATURES
===================================================== */

const appFeatures = [
  {
    title: "Secure Authentication",
    description: "OTP, social login, biometric security",
    color: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" />
      </svg>
    ),
  },

  {
    title: "Push Notifications",
    description: "Real-time updates and alerts",
    color: "orange",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M18 9C18 5.69 15.31 3 12 3C8.69 3 6 5.69 6 9V13L4 16H20L18 13V9Z"
          fill="currentColor"
        />
        <path
          d="M9 19C9.7 20 10.75 21 12 21C13.25 21 14.3 20 15 19"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  {
    title: "Payment Integration",
    description: "Multiple payment gateways",
    color: "green",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 9H21" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 14H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 14H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },

  {
    title: "GPS & Location",
    description: "Maps, tracking and geolocation",
    color: "purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 21C12 21 19 14.5 19 9C19 5.13 15.87 2 12 2C8.13 2 5 5.13 5 9C5 14.5 12 21 12 21Z"
          fill="currentColor"
        />
        <circle cx="12" cy="9" r="2.5" fill="white" />
      </svg>
    ),
  },

  {
    title: "Cloud Integration",
    description: "Firebase, AWS and scalable cloud",
    color: "sky",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M7 18H18C20.21 18 22 16.21 22 14C22 11.9 20.38 10.18 18.32 10.02C17.72 6.58 14.7 4 11.1 4C7.35 4 4.28 6.8 4 10.43C2.28 10.86 1 12.4 1 14.25C1 16.32 2.68 18 4.75 18H7Z"
          fill="currentColor"
        />
      </svg>
    ),
  },

  {
    title: "Analytics",
    description: "Track users and app performance",
    color: "teal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="4" y="12" width="4" height="8" rx="1" fill="currentColor" />
        <rect x="10" y="8" width="4" height="12" rx="1" fill="currentColor" />
        <rect x="16" y="4" width="4" height="16" rx="1" fill="currentColor" />
      </svg>
    ),
  },

  {
    title: "Camera & Media",
    description: "Camera, image, video and document features",
    color: "pink",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 7H8L10 4H14L16 7H20C21.1 7 22 7.9 22 9V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V9C2 7.9 2.9 7 4 7Z"
          fill="currentColor"
        />
        <circle cx="12" cy="13.5" r="4" fill="white" />
        <circle cx="12" cy="13.5" r="2.2" fill="currentColor" />
      </svg>
    ),
  },

  {
    title: "AI Integration",
    description: "AI-powered features and automation",
    color: "indigo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 3L14 8L19 10L14 12L12 17L10 12L5 10L10 8L12 3Z" fill="currentColor" />
        <path d="M19 15L20 18L23 19L20 20L19 23L18 20L15 19L18 18L19 15Z" fill="currentColor" />
        <circle cx="6" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
  },
];

/* =====================================================
   TECHNOLOGY STACK TABS
   Change names / add items here. 6 to 8 items per tab fits well.
===================================================== */

const techTabs = [
  {
    title: "iOS",
    items: [
      { name: "Swift", mark: "Sw", bg: "#fff0e8", fg: "#f05a28" },
      { name: "SwiftUI", mark: "Ui", bg: "#e3f4fb", fg: "#0f8fc7" },
      { name: "Objective-C", mark: "Oc", bg: "#e8eefc", fg: "#3b5bdb" },
      { name: "UIKit", mark: "UK", bg: "#eee8ff", fg: "#6d4ae0" },
      { name: "Xcode", mark: "Xc", bg: "#e6f0ff", fg: "#1c6fe0" },
      { name: "Core Data", mark: "CD", bg: "#e8f7f1", fg: "#1a9b6c" },
      { name: "TestFlight", mark: "TF", bg: "#e5f4fd", fg: "#1790d0" },
      { name: "Combine", mark: "Cb", bg: "#fdeaf1", fg: "#d6336c" },
    ],
  },

  {
    title: "Android",
    items: [
      { name: "Kotlin", mark: "Kt", bg: "#f1e9ff", fg: "#7f52ff" },
      { name: "Java", mark: "Jv", bg: "#fdeeea", fg: "#e0492b" },
      { name: "Jetpack Compose", mark: "Jc", bg: "#e6f8ee", fg: "#2fa866" },
      { name: "Android Studio", mark: "AS", bg: "#e8f7e6", fg: "#2a9d4f" },
      { name: "Room", mark: "Rm", bg: "#e9f0ff", fg: "#3b6fe0" },
      { name: "Retrofit", mark: "Rf", bg: "#fff1e0", fg: "#e8890c" },
      { name: "Firebase", mark: "Fb", bg: "#fff4d6", fg: "#f5a000" },
      { name: "Gradle", mark: "Gr", bg: "#e4f2f5", fg: "#0e7c86" },
    ],
  },

  {
    title: "Cross-Platform",
    items: [
      { name: "React Native", mark: "RN", bg: "#e1f6fd", fg: "#0fa6d6" },
      { name: "Flutter", mark: "Fl", bg: "#e4f3ff", fg: "#1f8fe8" },
      { name: "Dart", mark: "Dt", bg: "#e0f4f7", fg: "#0c9fb5" },
      { name: "Expo", mark: "Ex", bg: "#ececf4", fg: "#1c1f33" },
      { name: "Ionic", mark: "Io", bg: "#e6efff", fg: "#3880ff" },
      { name: "Capacitor", mark: "Cp", bg: "#e8f0ff", fg: "#2f6fed" },
    ],
  },

  {
    title: "Backend & Cloud",
    items: [
      { name: "Node.js", mark: "Nd", bg: "#e8f6e6", fg: "#3c873a" },
      { name: "TypeScript", mark: "TS", bg: "#e3edfb", fg: "#3178c6" },
      { name: "AWS Lambda", mark: "λ", bg: "#fff1df", fg: "#f08a00" },
      { name: "API Gateway", mark: "API", bg: "#f2e9fd", fg: "#8a4fe0" },
      { name: "DynamoDB", mark: "Db", bg: "#e6eefc", fg: "#2f5bd8" },
      { name: "Amazon S3", mark: "S3", bg: "#e9f7ec", fg: "#2d9b4e" },
      { name: "DigitalOcean", mark: "DO", bg: "#e3f1ff", fg: "#0080ff" },
    ],
  },

  {
    title: "Tools & Others",
    items: [
      { name: "Git", mark: "Gt", bg: "#fdece7", fg: "#e4472b" },
      { name: "GitHub", mark: "GH", bg: "#ececf0", fg: "#24292f" },
      { name: "Figma", mark: "Fg", bg: "#f6e9fd", fg: "#a259ff" },
      { name: "Postman", mark: "Pm", bg: "#fff0e8", fg: "#ff6c37" },
      { name: "Jira", mark: "Ji", bg: "#e5efff", fg: "#2563eb" },
      { name: "Docker", mark: "Dk", bg: "#e3f2fd", fg: "#1d8fe0" },
      { name: "CI/CD", mark: "CI", bg: "#e8f6f0", fg: "#1a9b6c" },
    ],
  },
];

/* =====================================================
   INDUSTRIES
   color = icon colour of the card
===================================================== */

const appIndustries = [
  {
    title: "E-Commerce",
    subtitle: "Shopping Apps",
    color: "#1a73f5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 4h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.45-1.1L20 8H6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.5" cy="19.5" r="1.4" fill="currentColor" />
        <circle cx="17" cy="19.5" r="1.4" fill="currentColor" />
      </svg>
    ),
  },

  {
    title: "Healthcare",
    subtitle: "Healthcare Apps",
    color: "#2f86ff",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M12 9v4M10 11h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },

  {
    title: "Finance & FinTech",
    subtitle: "Banking Apps",
    color: "#1a73f5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 9l9-5 9 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },

  {
    title: "Education",
    subtitle: "Learning Apps",
    color: "#1a73f5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M2 9l10-5 10 5-10 5-10-5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5M22 9v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },

  {
    title: "SaaS & Startups",
    subtitle: "Business Apps",
    color: "#2f6fed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3c3 1.5 5 4.5 5 8l-2.5 3h-5L7 11c0-3.5 2-6.5 5-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <circle cx="12" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 14L7 17.5l3-.5M14.5 14l2.5 3.5-3-.5M12 17v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },

  {
    title: "Media & Entertainment",
    subtitle: "Media Apps",
    color: "#7c4dff",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="currentColor" />
      </svg>
    ),
  },
];

/* =====================================================
   WHY CHOOSE US
===================================================== */

const appAdvantages = [
  {
    title: "High Performance",
    description: "Fast, scalable and optimized apps.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 3L5 13.5h6L10 21l8-10.5h-6L13 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },

  {
    title: "Mobile-First Design",
    description: "Seamless experience across all devices.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },

  {
    title: "Secure Development",
    description: "Built with security best practices.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l7 3v5.5c0 4.4-2.9 8.2-7 9.5-4.1-1.3-7-5.1-7-9.5V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="11.5" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },

  {
    title: "Modern UI/UX",
    description: "Beautiful and user-centric designs.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 9.5h17M9 9.5v10" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },

  {
    title: "Scalable Solutions",
    description: "Built to grow with your business.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3L3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M3 12.5l9 5 9-5M3 17l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },

  {
    title: "Expert Support",
    description: "Ongoing maintenance and technical support.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="3.5" y="13.5" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="16.5" y="13.5" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M20.5 19.5c0 1.5-2 2-5 2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* =====================================================
   WHAT WE BUILD (service cards)
   image = file imported at the top of this file
===================================================== */

const appServices = [
  {
    title: "iOS App Development",
    description: "High-performance iOS applications tailored for Apple devices.",
    image: app1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },

  {
    title: "Android App Development",
    description: "Scalable and secure Android applications for all devices.",
    image: app2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 10a6 6 0 0 1 12 0v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 17v-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8.5 5L7 3M15.5 5L17 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="9.7" cy="9.5" r="0.9" fill="currentColor" />
        <circle cx="14.3" cy="9.5" r="0.9" fill="currentColor" />
      </svg>
    ),
  },

  {
    title: "Cross-Platform Development",
    description: "Build powerful apps using React Native or Flutter.",
    image: app3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="9" ry="3.8" stroke="currentColor" strokeWidth="1.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" stroke="currentColor" strokeWidth="1.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      </svg>
    ),
  },

  {
    title: "Custom Mobile Solutions",
    description: "Tailored solutions for unique business needs.",
    image: app4,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default AppDevelopment;
