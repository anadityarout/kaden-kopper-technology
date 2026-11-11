import React, { useEffect, useRef, useState } from "react";

import {
  FaUsers,
  FaTrophy,
  FaChartBar,
  FaCode,
  FaArrowRight,
  FaArrowLeft,
  FaGlobe,
  FaMobileAlt,
  FaBullhorn,
  FaVideo,
  FaPalette,
  FaBriefcase,
  FaLayerGroup,
  FaSearch,
  FaLightbulb,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaBuilding,
  FaCalendarAlt,
  FaShoppingBag,
} from "react-icons/fa";

import "./Project.css";

/* =====================================================
   PROJECT API
===================================================== */

const PROJECTS_API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/projects";

/* =====================================================
   HELPERS
===================================================== */

// first non-empty value among the given keys
const pick = (obj, keys) =>
  keys.map((key) => obj?.[key]).find(Boolean) || "";

const IMAGE_KEYS = [
  "image",
  "imageUrl",
  "preview",
  "thumbnail",
  "projectImage",
  "coverImage",
];

const LINK_KEYS = ["link", "projectLink", "url", "liveUrl"];

  const SERVICE_KEYS = [
  "workCategory",
  "service",
  "projectCategory",
  "subCategory",
];

const typeOf = (project) =>
  String(project.category || "").trim().toLowerCase();

/* =====================================================
   PROJECT CATEGORIES
===================================================== */

const projectCategories = [
  { id: "all", shortLabel: "All", icon: FaLayerGroup },
  { id: "web", shortLabel: "Web Development", icon: FaGlobe },
  { id: "app", shortLabel: "App Development", icon: FaMobileAlt },
  { id: "graphic", shortLabel: "Graphic Design", icon: FaPalette },
  { id: "video", shortLabel: "Video Editor", icon: FaVideo },
  { id: "seo", shortLabel: "SEO & Marketing", icon: FaBullhorn },
  { id: "business", shortLabel: "Business Development", icon: FaBriefcase },
];

/* =====================================================
   CATEGORY NORMALIZER
===================================================== */

const categoryMap = {
  web: "web",
  website: "web",
  websites: "web",
  "web development": "web",
  "web-development": "web",

  app: "app",
  mobile: "app",
  "app development": "app",
  "app-development": "app",
  "mobile development": "app",

  graphic: "graphic",
  "graphic design": "graphic",
  "graphic-design": "graphic",
  design: "graphic",

  video: "video",
  "video editor": "video",
  "video editing": "video",
  "video-editor": "video",

  seo: "seo",
  marketing: "seo",
  "seo & marketing": "seo",
  "seo and marketing": "seo",
  "seo-marketing": "seo",

  business: "business",
  "business development": "business",
  "business-development": "business",
};

const normalizeCategory = (value) => {
  if (!value) return "";
  const category = String(value).trim().toLowerCase();
  return categoryMap[category] || category;
};

/* =====================================================
   STATIC FEATURED PROJECT FALLBACK
===================================================== */

const featuredProject = {
  title: "Wedding Mitra — Luxury Wedding Platform",
  description:
    "A complete digital wedding ecosystem for discovering venues and vendors, planning celebrations, shopping for the big day, and managing every detail in one place.",
  image: "",
  technologies: ["React", "Node.js", "MongoDB", "AWS", "Tailwind CSS"],
  projectLink: "#",
};

const featuredInfoCards = [
  {
    icon: FaBuilding,
    iconClass: "venue-icon",
    title: ["Wedding", "Venues"],
    text: "Find your perfect venue",
  },
  {
    icon: FaUsers,
    iconClass: "vendors-icon",
    title: ["Verified", "Vendors"],
    text: "Trusted professionals",
  },
  {
    icon: FaCalendarAlt,
    iconClass: "planning-icon",
    title: ["Wedding", "Planning"],
    text: "Plan with ease",
  },
  {
    icon: FaShoppingBag,
    iconClass: "shopping-icon",
    title: ["Wedding", "Shopping"],
    text: "Everything for your big day",
  },
];

/* =====================================================
   PERFORMANCE DATA
===================================================== */

const performanceData = [
  {
    id: 1,
    name: "Web Development",
    units: "84,625",
    growth: "+18.4%",
    color: "#1768ee",
    lightColor: "#eaf2ff",
    icon: FaGlobe,
    points: [
      [8, 67], [42, 67], [76, 80], [110, 69], [144, 73], [178, 65],
      [212, 55], [246, 71], [280, 67], [314, 44], [348, 48], [382, 39],
    ],
  },
  {
    id: 2,
    name: "App Development",
    units: "64,320",
    growth: "+12.6%",
    color: "#8b43e8",
    lightColor: "#f1e9ff",
    icon: FaMobileAlt,
    points: [
      [8, 74], [42, 65], [76, 78], [110, 68], [144, 52], [178, 68],
      [212, 57], [246, 72], [280, 53], [314, 49], [348, 41], [382, 29],
    ],
  },
  {
    id: 3,
    name: "SEO & Marketing",
    units: "52,870",
    growth: "+9.3%",
    color: "#12a950",
    lightColor: "#e8f8ee",
    icon: FaBullhorn,
    points: [
      [8, 78], [42, 68], [76, 80], [110, 72], [144, 62], [178, 76],
      [212, 70], [246, 72], [280, 59], [314, 69], [348, 61], [382, 45],
    ],
  },
  {
    id: 4,
    name: "Video Editor",
    units: "28,410",
    growth: "+11.2%",
    color: "#f04440",
    lightColor: "#ffe9e8",
    icon: FaVideo,
    points: [
      [8, 78], [42, 67], [76, 81], [110, 55], [144, 79], [178, 66],
      [212, 55], [246, 77], [280, 59], [314, 54], [348, 43], [382, 29],
    ],
  },
  {
    id: 5,
    name: "Graphic Designer",
    units: "36,925",
    growth: "+7.8%",
    color: "#f59e1b",
    lightColor: "#fff3df",
    icon: FaPalette,
    points: [
      [8, 78], [42, 67], [76, 81], [110, 69], [144, 55], [178, 71],
      [212, 75], [246, 66], [280, 57], [314, 68], [348, 55], [382, 42],
    ],
  },
  {
    id: 6,
    name: "Business Development",
    units: "47,250",
    growth: "+15.5%",
    color: "#13a9c4",
    lightColor: "#e5f8fc",
    icon: FaBriefcase,
    points: [
      [8, 79], [42, 68], [76, 82], [110, 61], [144, 74], [178, 63],
      [212, 72], [246, 57], [280, 69], [314, 57], [348, 60], [382, 42],
    ],
  },
];

/* =====================================================
   ANALYTICS DATA
===================================================== */

const distribution = [
  { name: "Web Development", value: "22%", color: "web-color" },
  { name: "App Development", value: "18%", color: "app-color" },
  { name: "Graphic Design", value: "16%", color: "graphic-color" },
  { name: "Video Editor", value: "14%", color: "video-color" },
  { name: "SEO & Marketing", value: "15%", color: "seo-color" },
  { name: "Business Development", value: "10%", color: "business-color" },
  { name: "Others", value: "5%", color: "others-color" },
];

const serviceRates = [
  { name: "Web Development", label: ["Web", "Development"], value: 96, className: "web-donut" },
  { name: "App Development", label: ["App", "Development"], value: 92, className: "app-donut" },
  { name: "Graphic Design", label: ["Graphic", "Design"], value: 89, className: "graphic-donut" },
  { name: "Video Editor", label: ["Video", "Editor"], value: 88, className: "video-donut" },
  { name: "SEO & Marketing", label: ["SEO &", "Marketing"], value: 93, className: "seo-donut" },
  { name: "Business Development", label: ["Business", "Development"], value: 90, className: "business-donut" },
];

/* =====================================================
   PROJECT JOURNEY
===================================================== */

const projectJourney = [
  { number: "01", title: "Discover", lines: ["Understand goals", "and requirements."], icon: FaSearch },
  { number: "02", title: "Plan & Design", lines: ["Create strategy", "and prototypes."], icon: FaLightbulb },
  { number: "03", title: "Develop", lines: ["Build and implement", "solutions."], icon: FaCode },
  { number: "04", title: "Test & Refine", lines: ["Ensure quality", "and performance."], icon: FaShieldAlt },
  { number: "05", title: "Launch", lines: ["Deliver and support", "for growth."], icon: FaRocket },
];

/* =====================================================
   PROJECT HIGHLIGHTS
===================================================== */

const projectHighlights = [
  {
    icon: FaRocket,
    title: "Faster Delivery",
    description: "On-time project delivery with efficiency.",
    className: "highlight-rocket",
  },
  {
    icon: FaLightbulb,
    title: "Innovative Solutions",
    description: "Unique and creative problem solving.",
    className: "highlight-bulb",
  },
  {
    icon: FaUsers,
    title: "Long-Term Relationships",
    description: "Building trust beyond projects.",
    className: "highlight-users",
  },
  {
    icon: FaChartLine,
    title: "Real Business Impact",
    description: "Delivering measurable results.",
    className: "highlight-chart",
  },
];

/* =====================================================
   SMALL RENDER HELPERS
===================================================== */

// two-line text with a line break between
const TwoLines = ({ lines }) => (
  <>
    {lines[0]}
    <br />
    {lines[1]}
  </>
);

/* =====================================================
   HERO BANNER (inside this file)
===================================================== */

/* ---------- animated number ---------- */
function Counter({ end, suffix = "" }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / 1600, 1);
          setN(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

/* ---------- data ---------- */
const heroStats = [
  { icon: FaLayerGroup, end: 50, suffix: "+", label: "Projects Delivered" },
  { icon: FaUsers, end: 30, suffix: "+", label: "Happy Clients" },
  { icon: FaTrophy, end: 10, suffix: "+", label: "Industries Served" },
  { icon: FaChartBar, end: 95, suffix: "%", label: "Client Satisfaction" },
];

const heroChips = [
  { icon: FaCode, lines: ["Web & App", "Development"], cls: "ph-chip-web" },
  { icon: FaChartBar, lines: ["SEO &", "Marketing"], cls: "ph-chip-seo" },
  { icon: FaLayerGroup, lines: ["Cloud", "Solutions"], cls: "ph-chip-cloud" },
  { icon: FaPalette, lines: ["Design &", "Creative"], cls: "ph-chip-design" },
];

/* ---------- CSS-built laptop + phone (used when no image is passed) ---------- */
function Mockup() {
  return (
    <>
      <div className="ph-laptop" aria-hidden="true">
        <div className="ph-screen">
          <div className="ph-nav">
            <b>LOGO</b>
            <span>Home</span>
            <span>About</span>
            <span>Services</span>
            <span>Projects</span>
            <em>Get Started</em>
          </div>
          <div className="ph-sh">
            <div>
              <h4>
                Innovative
                <br />
                Digital Solutions
              </h4>
              <div className="ph-bar" />
              <div className="ph-bar short" />
              <div className="ph-sb">
                <u />
                <u className="out" />
              </div>
            </div>
            <div className="ph-cube" />
          </div>
          <div className="ph-ss">
            <i><b>200+</b>Projects</i>
            <i><b>95%</b>Satisfaction</i>
            <i><b>10+</b>Industries</i>
          </div>
          <h5>Our Featured Projects</h5>
          <div className="ph-cards">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="ph-base" />
      </div>

      <div className="ph-phone" aria-hidden="true">
        <div className="ph-pnav">
          <b>LOGO</b>
          <span />
        </div>
        <h4>
          Innovative
          <br />
          Digital Solutions
        </h4>
        <div className="ph-bar" />
        <div className="ph-sb">
          <u />
          <u className="out" />
        </div>
        <h5>Our Featured Projects</h5>
        <div className="ph-pimg" />
      </div>
    </>
  );
}

/* =====================================================
   HERO BANNER

   Props (all optional):
   image        – admin banner image URL. If given, it replaces
                  the built-in laptop/phone mockup.
   exploreHref  – target of the primary button
   contactHref  – target of the outline button
===================================================== */
function HeroBanner({
  image,
  exploreHref = "#explore-projects",
  contactHref = "/contact",
}) {
  return (
    <section className="ph">
      <div className="ph-inner">
        {/* LEFT */}
        <div className="ph-content">
          <span className="ph-badge">
            <i /> OUR PROJECTS
          </span>

          <h1 className="ph-title">
            <span>Building Digital</span>
            <span>Experiences That</span>
            <span className="ph-grad">Create Real Impact</span>
          </h1>

          <p className="ph-text">
            Explore our portfolio of digital products, platforms, and
            technology solutions built for businesses across industries.
          </p>

          <div className="ph-btns">
            <a href={exploreHref} className="ph-btn ph-btn-primary">
              Explore Our Projects <FaArrowRight aria-hidden="true" />
            </a>
            <a href={contactHref} className="ph-btn ph-btn-outline">
              Get a Free Consultation
            </a>
          </div>

          <div className="ph-stats">
            {heroStats.map(({ icon: Icon, end, suffix, label }) => (
              <div className="ph-stat" key={label}>
                <div className="ph-stat-icon">
                  <Icon aria-hidden="true" />
                </div>
                <div className="ph-stat-text">
                  <strong>
                    <Counter end={end} suffix={suffix} />
                  </strong>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="ph-visual">
          <div className="ph-scale">
            <div className="ph-globe" />

            <svg
              className="ph-lines"
              viewBox="0 0 40 32"
              aria-hidden="true"
            >
              <path d="M24 3 Q18 4 14 9 L14 12" />
              <path d="M35 3 Q38 6 37 11" />
              <path d="M37 14 Q34 15 32 20" />
              <circle cx="24" cy="3" r=".45" />
              <circle cx="35" cy="3" r=".45" />
              <circle cx="14" cy="12" r=".45" />
              <circle cx="37" cy="11" r=".45" />
            </svg>

            {image ? (
              <img className="ph-image" src={image} alt="Our projects" />
            ) : (
              <Mockup />
            )}
          </div>

          <div className="ph-chips">
            {heroChips.map(({ icon: Icon, lines, cls }) => (
              <div className={`ph-chip ${cls}`} key={cls}>
                <div className="ph-chip-icon">
                  <Icon aria-hidden="true" />
                </div>
                <span>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   PROJECT COMPONENT
===================================================== */

function Project() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [projectStart, setProjectStart] = useState(0);

  /* ---------- fetch projects from AWS ---------- */

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        setProjectError("");

        const response = await fetch(PROJECTS_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load projects.");
        }

        const data = await response.json();

        let projectData = [];

        if (Array.isArray(data)) {
          projectData = data;
        } else if (Array.isArray(data.projects)) {
          projectData = data.projects;
        } else if (Array.isArray(data.data)) {
          projectData = data.data;
        } else if (Array.isArray(data.items)) {
          projectData = data.items;
        }

        setProjects(projectData);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Project API Error:", error);
        setProjects([]);
        setProjectError("Unable to load projects right now.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProjects(false);
        }
      }
    };

    fetchProjects();

    return () => controller.abort();
  }, []);

  /* ---------- pick items by category ---------- */

  const featuredBackendProject = projects.find(
    (project) => typeOf(project) === "featured project"
  );

  const workProjects = projects.filter(
    (project) => typeOf(project) === "work"
  );

  /* ---------- filter ---------- */

  const filteredProjects =
    activeCategory === "all"
      ? workProjects
      : workProjects.filter(
          (project) =>
            normalizeCategory(pick(project, SERVICE_KEYS)) === activeCategory
        );

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setProjectStart(0);
  };

  /* ---------- carousel ---------- */

  const projectsPerPage = 4;

  const canGoPrevious = projectStart > 0;
  const canGoNext = projectStart + projectsPerPage < filteredProjects.length;

  const handlePreviousProjects = () => {
    if (!canGoPrevious) return;
    setProjectStart(Math.max(0, projectStart - projectsPerPage));
  };

  const handleNextProjects = () => {
    if (!canGoNext) return;
    setProjectStart(projectStart + projectsPerPage);
  };

  const visibleProjects = filteredProjects.slice(
    projectStart,
    projectStart + projectsPerPage
  );

  /* ---------- featured data ---------- */

  const featuredTitle =
    pick(featuredBackendProject, ["name", "title"]) || featuredProject.title;

  const featuredDescription =
    pick(featuredBackendProject, ["description", "shortDescription"]) ||
    featuredProject.description;

  const featuredImage =
    pick(featuredBackendProject, IMAGE_KEYS) || featuredProject.image;

  const featuredTechnologies =
    Array.isArray(featuredBackendProject?.technologies) &&
    featuredBackendProject.technologies.length > 0
      ? featuredBackendProject.technologies
      : featuredProject.technologies;

  const featuredProjectLink =
    pick(featuredBackendProject, LINK_KEYS) ||
    featuredProject.projectLink ||
    "#";

  /* ===================================================
     RETURN
  =================================================== */

  return (
    <main className="project-page">
      {/* =================================================
          HERO BANNER (includes the four stat cards)
      ================================================= */}

      <HeroBanner />

      {/* =================================================
          FEATURED PROJECT
      ================================================= */}

      <section className="featured-project-section">
        <div className="featured-project-container">
          {/* LEFT CONTENT */}
          <div className="featured-project-content">
            <span className="featured-project-badge">FEATURED PROJECT</span>

            <h2 className="featured-project-title">{featuredTitle}</h2>

            <p className="featured-project-description">
              {featuredDescription}
            </p>

            <div className="featured-technologies">
              <span className="technology-title">Technologies Used</span>

              <div className="technology-list">
                {featuredTechnologies.map((technology, index) => (
                  <span
                    className="technology-tag"
                    key={`${technology}-${index}`}
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            <div className="featured-project-buttons">
              {featuredProjectLink !== "#" ? (
                <a
                  href={featuredProjectLink}
                  className="featured-case-study-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>View Project</span>
                  <FaArrowRight aria-hidden="true" />
                </a>
              ) : (
                <button type="button" className="featured-case-study-btn">
                  <span>View Project</span>
                  <FaArrowRight aria-hidden="true" />
                </button>
              )}

              <button type="button" className="featured-live-demo-btn">
                <span>Know More</span>
                <FaArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* RIGHT FEATURED AREA */}
          <div className="featured-project-right">
            <div className="featured-project-main-image">
              {featuredImage ? (
                <img
                  src={featuredImage}
                  alt={featuredTitle}
                  className="featured-project-image"
                />
              ) : (
                <div className="featured-project-no-image">Project Image</div>
              )}
            </div>

            <div className="featured-project-side-info">
              {featuredInfoCards.map(
                ({ icon: Icon, iconClass, title, text }) => (
                  <div className="featured-info-card" key={text}>
                    <div className={`featured-info-icon ${iconClass}`}>
                      <Icon aria-hidden="true" />
                    </div>

                    <div className="featured-info-text">
                      <strong>
                        <TwoLines lines={title} />
                      </strong>
                      <span>{text}</span>
                    </div>
                  </div>
                )
              )}

              <div className="featured-info-message">
                <span>
                  Together
                  <br />
                  for a Beautiful
                  <br />
                  Tomorrow!
                </span>

                <b>♡</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          PERFORMANCE
      ================================================= */}

      <section className="project-performance-section">
        <div className="project-performance-container">
          <div className="performance-header">
            <h2>Project Performance Overview</h2>

            <select
              className="performance-year-select"
              defaultValue="2024-2025"
              aria-label="Select year range"
            >
              <option value="2024-2025">2024 - 2025</option>
              <option value="2023-2024">2023 - 2024</option>
              <option value="2022-2023">2022 - 2023</option>
            </select>
          </div>

          <div className="performance-grid">
            {performanceData.map((item) => {
              const Icon = item.icon;

              const linePoints = item.points
                .map(([x, y]) => `${x},${y}`)
                .join(" ");

              const areaPoints = `${linePoints} 382,100 8,100`;

              return (
                <div
                  className="performance-card"
                  key={item.id}
                  style={{
                    "--performance-color": item.color,
                    "--performance-light": item.lightColor,
                  }}
                >
                  <div className="performance-card-top">
                    <div className="performance-icon">
                      <Icon aria-hidden="true" />
                    </div>

                    <div className="performance-info">
                      <span className="performance-name">{item.name}</span>

                      <strong className="performance-units">
                        {item.units} Units
                      </strong>
                    </div>

                    <div className="performance-growth">
                      <span>▲</span>
                      {item.growth}
                    </div>
                  </div>

                  <div className="performance-chart">
                    <svg
                      viewBox="0 0 390 100"
                      preserveAspectRatio="none"
                      className="performance-svg"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id={`performance-gradient-${item.id}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={item.color}
                            stopOpacity="0.2"
                          />
                          <stop
                            offset="100%"
                            stopColor={item.color}
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <polygon
                        points={areaPoints}
                        fill={`url(#performance-gradient-${item.id})`}
                      />

                      <polyline
                        points={linePoints}
                        fill="none"
                        stroke={item.color}
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />

                      {item.points.map(([x, y], index) => (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="3"
                          fill={item.color}
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================
          ANALYTICS
      ================================================= */}

      <section className="project-analytics-section">
        <div className="project-analytics-container">
          {/* SUCCESS RATE */}
          <div className="analytics-card success-rate-card">
            <h2 className="analytics-card-title">Project Success Rate</h2>

            <div className="main-donut success-donut">
              <div className="donut-center">
                <strong>95%</strong>
                <span>Success Rate</span>
              </div>
            </div>

            <p className="success-description">
              Delivering quality solutions
              <br />
              that create real impact.
            </p>
          </div>

          {/* DISTRIBUTION */}
          <div className="analytics-card distribution-card">
            <h2 className="analytics-card-title">Project Distribution</h2>

            <div className="distribution-content">
              <div className="distribution-donut">
                <div className="distribution-donut-center">
                  <strong>100+</strong>
                  <span>Projects</span>
                </div>
              </div>

              <div className="distribution-legend">
                {distribution.map((item) => (
                  <div className="legend-item" key={item.name}>
                    <span className={`legend-color ${item.color}`}></span>
                    <span>{item.name}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SERVICE SUCCESS */}
          <div className="analytics-card service-success-card">
            <div className="service-heading">
              <h2 className="analytics-card-title">
                Service Wise Success Rate
              </h2>

              <span className="overall-rate">Overall 95%</span>
            </div>

            <div className="service-rate-grid">
              {serviceRates.map((service) => (
                <div className="service-rate-item" key={service.name}>
                  <div className={`small-donut ${service.className}`}>
                    <span>{service.value}%</span>
                  </div>

                  <p>
                    <TwoLines lines={service.label} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          EXPLORE OUR PROJECTS
      ===================================================== */}

      <section className="explore-projects-section" id="explore-projects">
        <div className="explore-projects-container">
          {/* HEADING */}
          <div className="explore-projects-heading">
            <div className="explore-heading-text">
              <span className="explore-projects-label">OUR WORK</span>

              <h2>Explore Our Projects</h2>

              <p>Discover our recent work across different industries.</p>
            </div>

            <div className="explore-projects-arrows">
              <button
                type="button"
                className="explore-arrow-btn"
                onClick={handlePreviousProjects}
                disabled={!canGoPrevious}
                aria-label="Previous projects"
              >
                <FaArrowLeft aria-hidden="true" />
              </button>

              <button
                type="button"
                className="explore-arrow-btn"
                onClick={handleNextProjects}
                disabled={!canGoNext}
                aria-label="Next projects"
              >
                <FaArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* CATEGORY BUTTONS */}
          <div className="explore-projects-categories">
            {projectCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={`explore-category-btn ${isActive ? "active" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <Icon aria-hidden="true" />
                  <span>{category.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* PROJECT AREA */}
          <div className="explore-projects-wrapper">
            {/* LOADING */}
            {loadingProjects && (
              <div className="explore-projects-status">
                <div className="project-loading-spinner"></div>

                <h3>Loading Projects</h3>

                <p>Please wait while we load our latest projects.</p>
              </div>
            )}

            {/* ERROR */}
            {!loadingProjects && projectError && (
              <div className="explore-projects-status">
                <FaLayerGroup aria-hidden="true" />

                <h3>Projects Unavailable</h3>

                <p>{projectError}</p>
              </div>
            )}

            {/* PROJECTS */}
            {!loadingProjects && !projectError && visibleProjects.length > 0 && (
              <div className="explore-projects-grid">
                {visibleProjects.map((project, index) => {
                  const projectImage = pick(project, IMAGE_KEYS);

                  const projectName =
                    pick(project, ["name", "title", "projectName"]) ||
                    "Untitled Project";

                  const projectDescription =
                    pick(project, ["description", "shortDescription"]) ||
                    "A modern digital solution designed to create real business impact.";

                  const projectLink = pick(project, LINK_KEYS) || "#";

                  const categoryLabel =
                    pick(project, SERVICE_KEYS) || "Work";

                  return (
                    <article
                      className="explore-project-card"
                      key={project._id || project.id || `${projectName}-${index}`}
                    >
                      {/* IMAGE */}
                      <div className="explore-project-image-box">
                        {projectImage ? (
                          <img
                            src={projectImage}
                            alt={projectName}
                            className="explore-project-image"
                            loading="lazy"
                          />
                        ) : (
                          <div className="explore-project-no-image">
                            <FaLayerGroup aria-hidden="true" />
                            <span>Project Image</span>
                          </div>
                        )}

                        <span className="explore-project-badge">
                          {categoryLabel}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="explore-project-content">
                        <h3>{projectName}</h3>

                        <p>{projectDescription}</p>

                        {projectLink !== "#" ? (
                          <a
                            href={projectLink}
                            className="explore-project-button"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>View Project</span>
                            <FaArrowRight aria-hidden="true" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="explore-project-button"
                          >
                            <span>View Project</span>
                            <FaArrowRight aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* EMPTY */}
            {!loadingProjects && !projectError && visibleProjects.length === 0 && (
              <div className="explore-projects-status">
                <FaLayerGroup aria-hidden="true" />

                <h3>No Projects Found</h3>

                <p>
                  {activeCategory === "all"
                    ? "Projects added from the admin dashboard will appear here."
                    : "No projects are available in this category yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR PROJECT JOURNEY
      ===================================================== */}

      <section className="project-journey-section">
        <div className="project-journey-container">
          <div className="project-journey-header">
            <div className="project-journey-heading">
              <span className="project-journey-badge">OUR PROCESS</span>

              <h2>Our Project Journey</h2>
            </div>

            <p>From idea to impact — here's how we bring projects to life.</p>
          </div>

          <div className="project-journey">
            {projectJourney.map((step) => {
              const Icon = step.icon;

              return (
                <div className="journey-step" key={step.number}>
                  <div className="journey-icon">
                    <Icon aria-hidden="true" />
                  </div>

                  <span className="journey-number">{step.number}</span>

                  <h3>{step.title}</h3>

                  <p>
                    <TwoLines lines={step.lines} />
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECT HIGHLIGHTS
      ===================================================== */}

      <section className="project-highlights-section">
        <div className="project-highlights-container">
          <div className="project-highlights-header">
            <h2>Project Highlights</h2>

            <p>Numbers that reflect our commitment and growth.</p>
          </div>

          <div className="project-highlights-grid">
            {projectHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className={`project-highlight-card ${item.className}`}
                  key={item.title}
                >
                  <div className="project-highlight-icon">
                    <Icon aria-hidden="true" />
                  </div>

                  <div className="project-highlight-content">
                    <h3>{item.title}</h3>

                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Project;
