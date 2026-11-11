import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Web.css";

/* ---------- SERVICE IMAGES (your files in the assets folder) ----------
   Change the file names / path so they match your project. */
import serviceWebApplications from "../../assets/service-web-applications.png";
import serviceBusinessWebsites from "../../assets/service-business-websites.png";
import serviceEcommerce from "../../assets/service-ecommerce-solutions.png";
import serviceCustomPlatforms from "../../assets/service-custom-web-platforms.png";

/* ---------- INDUSTRY IMAGES (web1.png ... web6.png in the assets folder) ---------- */
import industryEcommerce from "../../assets/web1.png";
import industryHealthcare from "../../assets/web2.png";
import industrySaas from "../../assets/web3.png";
import industryFinance from "../../assets/web4.png";
import industryEducation from "../../assets/web5.png";
import industryMedia from "../../assets/web6.png";

/* =====================================================
   WEB DEVELOPMENT API
===================================================== */

const WEB_DEVELOPMENT_API =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/webdevelopment";

/* =====================================================
   HERO
   Title, description and image all come from the
   "Banner" items in the Admin Dashboard.
===================================================== */

const Svg = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const HERO_FEATURES = [
  {
    id: "scalable",
    strong: "Scalable",
    span: "Architecture",
    icon: (
      <Svg>
        <path d="M4 18 10 12l4 4 6-8" />
        <path d="M14 8h6v6" />
      </Svg>
    ),
  },
  {
    id: "secure",
    strong: "Secure",
    span: "Development",
    icon: (
      <Svg>
        <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </Svg>
    ),
  },
  {
    id: "performance",
    strong: "High",
    span: "Performance",
    icon: (
      <Svg>
        <path d="M4 16a8 8 0 1 1 16 0" />
        <path d="m12 16 3.5-4.5" />
        <circle cx="12" cy="16" r="1" />
      </Svg>
    ),
  },
  {
    id: "uiux",
    strong: "Modern",
    span: "UI/UX",
    icon: (
      <Svg>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M9 9v11" />
      </Svg>
    ),
  },
];

/* Last half of the title (max 4 words) gets the gradient */
function renderHeroTitle(text) {
  const words = String(text).trim().split(/\s+/);

  if (words.length < 3) {
    return text;
  }

  const highlightCount = Math.min(4, Math.ceil(words.length / 2));
  const lead = words.slice(0, words.length - highlightCount).join(" ");
  const highlight = words.slice(-highlightCount).join(" ");

  return (
    <>
      {lead}
      <br />
      <span className="kk-web-hero-highlight">{highlight}</span>
    </>
  );
}

/* =====================================================
   SERVICES — WHAT WE BUILD
===================================================== */

const SERVICES = [
  {
    id: "web-applications",
    title: "Web Applications",
    text: "Scalable web applications for businesses of all sizes.",
    image: serviceWebApplications,
  },
  {
    id: "business-websites",
    title: "Business Websites",
    text: "High-converting, modern and responsive websites.",
    image: serviceBusinessWebsites,
  },
  {
    id: "ecommerce-solutions",
    title: "E-Commerce Solutions",
    text: "Secure and feature-rich online stores.",
    image: serviceEcommerce,
  },
  {
    id: "custom-web-platforms",
    title: "Custom Web Platforms",
    text: "Tailored solutions for unique business needs.",
    image: serviceCustomPlatforms,
  },
];

/* =====================================================
   INDUSTRIES — BUILT FOR EVERY INDUSTRY
===================================================== */

const INDUSTRIES = [
  { id: "ecommerce", title: "E-Commerce & Retail", image: industryEcommerce },
  { id: "healthcare", title: "Healthcare", image: industryHealthcare },
  { id: "saas", title: "SaaS & Startups", image: industrySaas },
  { id: "finance", title: "Finance & FinTech", image: industryFinance },
  { id: "education", title: "Education & E-Learning", image: industryEducation },
  { id: "media", title: "Media & Entertainment", image: industryMedia },
];

/* =====================================================
   TECHNOLOGY STACK
===================================================== */

const TECHNOLOGY_STACK = {
  Frontend: [
    { name: "React", short: "⚛", className: "react" },
    { name: "Next.js", short: "N", className: "next" },
    { name: "TypeScript", short: "TS", className: "typescript" },
    { name: "JavaScript", short: "JS", className: "javascript" },
    { name: "HTML5", short: "5", className: "html" },
    { name: "CSS3", short: "3", className: "css" },
    { name: "Tailwind CSS", short: "≈", className: "tailwind" },
  ],

  Backend: [
    { name: "Node.js", short: "JS", className: "node" },
    { name: "Express.js", short: "E", className: "express" },
    { name: "Python", short: "Py", className: "python" },
    { name: "Django", short: "Dj", className: "django" },
    { name: "REST API", short: "API", className: "api" },
    { name: "GraphQL", short: "GQL", className: "graphql" },
    { name: "PHP", short: "PHP", className: "php" },
  ],

  Database: [
    { name: "MongoDB", short: "M", className: "mongodb" },
    { name: "MySQL", short: "SQL", className: "mysql" },
    { name: "PostgreSQL", short: "PG", className: "postgresql" },
    { name: "Redis", short: "R", className: "redis" },
    { name: "Firebase", short: "F", className: "firebase" },
    { name: "DynamoDB", short: "DDB", className: "dynamodb" },
  ],

  "Cloud & DevOps": [
    { name: "AWS", short: "AWS", className: "aws" },
    { name: "Amazon S3", short: "S3", className: "s3" },
    { name: "AWS Lambda", short: "λ", className: "lambda" },
    { name: "API Gateway", short: "API", className: "gateway" },
    { name: "Docker", short: "D", className: "docker" },
    { name: "GitHub Actions", short: "GH", className: "github" },
  ],

  "Tools & Others": [
    { name: "Git", short: "G", className: "git" },
    { name: "GitHub", short: "GH", className: "github" },
    { name: "VS Code", short: "VS", className: "vscode" },
    { name: "Figma", short: "F", className: "figma" },
    { name: "Postman", short: "P", className: "postman" },
    { name: "Jira", short: "J", className: "jira" },
  ],

  Security: [
    { name: "OAuth", short: "O", className: "oauth" },
    { name: "JWT", short: "JWT", className: "jwt" },
    { name: "HTTPS", short: "S", className: "https" },
    { name: "AWS IAM", short: "IAM", className: "iam" },
    { name: "SSL/TLS", short: "SSL", className: "ssl" },
    { name: "API Security", short: "API", className: "api-security" },
  ],
};

const TECHNOLOGY_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud & DevOps",
  "Tools & Others",
  "Security",
];

/* =====================================================
   TECHNOLOGY LAYERS — 3D TOWER VISUAL
   Each layer = one glossy slab (left) + one label (right).
   topA/topB = top face gradient, left/right = side faces.
===================================================== */

const TECH_LAYERS = [
  {
    id: "frontend",
    label: "Frontend",
    topA: "#7fcbff",
    topB: "#2f8cff",
    left: "#1a58d6",
    right: "#2a76ee",
    icon: (
      <Svg>
        <path d="m8 8-4 4 4 4" />
        <path d="m16 8 4 4-4 4" />
        <path d="m13.5 6-3 12" />
      </Svg>
    ),
  },
  {
    id: "backend",
    label: "Backend",
    topA: "#5aa7ff",
    topB: "#2866e4",
    left: "#153fae",
    right: "#2259d4",
    icon: (
      <Svg>
        <rect x="4" y="4" width="16" height="6" rx="1.5" />
        <rect x="4" y="14" width="16" height="6" rx="1.5" />
        <path d="M8 7h.01M8 17h.01" />
      </Svg>
    ),
  },
  {
    id: "database",
    label: "Database",
    topA: "#b79cff",
    topB: "#7a55ee",
    left: "#4a2fb8",
    right: "#6540d6",
    icon: (
      <Svg>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </Svg>
    ),
  },
  {
    id: "cloud",
    label: "Cloud",
    topA: "#62b0ff",
    topB: "#2a78ec",
    left: "#164cc0",
    right: "#2766de",
    icon: (
      <Svg>
        <path d="M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8.5 4.5 4.5 0 0 1 17.5 18H7Z" />
      </Svg>
    ),
  },
  {
    id: "security",
    label: "Security",
    topA: "#3b78f0",
    topB: "#1b45b8",
    left: "#0f2f86",
    right: "#1a43ae",
    icon: (
      <Svg>
        <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </Svg>
    ),
  },
];

/* Slab geometry (must match the CSS label height + gap):
   slab spacing = 56px  ->  label height 46px + gap 10px */
const SLAB_STEP = 56;

/* =====================================================
   TECHNOLOGY EXPERTISE DATA
===================================================== */

const EXPERTISE_METRICS = [
  {
    id: "website",
    title: "Website Development",
    value: "84,625",
    change: "+12.5%",
    trend: "up",
    icon: "▣",
    iconClass: "blue",
    lineColor: "#2563eb",
    points: "0,70 20,55 40,68 60,52 80,65 100,48 120,42 140,38 160,32 180,25 200,48 220,35 240,22 260,30 280,15",
  },
  {
    id: "applications",
    title: "Web Applications",
    value: "64,320",
    change: "+8.4%",
    trend: "up",
    icon: "▯",
    iconClass: "purple",
    lineColor: "#6d4aff",
    points: "0,72 20,58 40,70 60,55 80,62 100,50 120,58 140,42 160,35 180,42 200,18 220,48 240,30 260,42 280,28",
  },
  {
    id: "ecommerce",
    title: "E-Commerce Solutions",
    value: "52,870",
    change: "+14.2%",
    trend: "up",
    icon: "▣",
    iconClass: "green",
    lineColor: "#17bd91",
    points: "0,72 20,55 40,68 60,52 80,48 100,30 120,42 140,32 160,48 180,28 200,18 220,52 240,34 260,48 280,30",
  },
  {
    id: "api",
    title: "API Integrations",
    value: "28,430",
    change: "-3.8%",
    trend: "down",
    icon: "⌘",
    iconClass: "red",
    lineColor: "#ef4444",
    points: "0,70 20,58 40,68 60,48 80,46 100,50 120,62 140,48 160,40 180,38 200,50 220,34 240,48 260,32 280,15",
  },
];

const PROJECT_DISTRIBUTION = [
  { label: "Corporate Websites", value: 25, color: "blue" },
  { label: "E-Commerce", value: 20, color: "purple" },
  { label: "Web Applications", value: 18, color: "red" },
  { label: "CMS Development", value: 12, color: "yellow" },
  { label: "API Integrations", value: 10, color: "green" },
  { label: "Cloud Solutions", value: 8, color: "cyan" },
  { label: "Maintenance & Support", value: 7, color: "violet" },
];

/* Same colors as the .kk-web-project-dot.* classes in Web.css */
const DONUT_COLORS = {
  blue: "#2563eb",
  purple: "#6d4aff",
  red: "#f05245",
  yellow: "#f6b83f",
  green: "#17bd91",
  cyan: "#1598df",
  violet: "#4b4de0",
};

/* Donut gradient is generated from PROJECT_DISTRIBUTION so they never drift apart */
const DONUT_TOTAL = PROJECT_DISTRIBUTION.reduce((sum, item) => sum + item.value, 0);

const PROJECT_DONUT_GRADIENT = (() => {
  let start = 0;

  const stops = PROJECT_DISTRIBUTION.map((item) => {
    const end = start + (item.value / DONUT_TOTAL) * 360;
    const stop = `${DONUT_COLORS[item.color]} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`;
    start = end;
    return stop;
  });

  return `conic-gradient(${stops.join(", ")})`;
})();

const SATISFACTION_METRICS = [
  { value: 98, label: "Quality", color: "blue" },
  { value: 96, label: "Communication", color: "purple" },
  { value: 92, label: "On-Time Delivery", color: "yellow" },
  { value: 94, label: "Technical Expertise", color: "red" },
  { value: 90, label: "Support", color: "green" },
  { value: 95, label: "Value for Money", color: "cyan" },
];

/* =====================================================
   WEB DEVELOPMENT PROCESS
===================================================== */

const WEB_PROCESS = [
  {
    id: "analysis",
    number: "01",
    title: "Requirement Analysis",
    text: "Understand your goals and requirements.",
    color: "#2563eb",
    light: "#5b9bff",
    glow: "rgba(37, 99, 235, 0.35)",
  },
  {
    id: "design",
    number: "02",
    title: "UI/UX Design",
    text: "Create user-centered modern designs.",
    color: "#7c3aed",
    light: "#a78bfa",
    glow: "rgba(124, 58, 237, 0.35)",
  },
  {
    id: "frontend",
    number: "03",
    title: "Front-End Development",
    text: "Build responsive and interactive interfaces.",
    color: "#12a594",
    light: "#3fd4c0",
    glow: "rgba(18, 165, 148, 0.35)",
  },
  {
    id: "backend",
    number: "04",
    title: "Back-End Development",
    text: "Develop powerful server-side logic.",
    color: "#f97316",
    light: "#ffa04d",
    glow: "rgba(249, 115, 22, 0.35)",
  },
  {
    id: "testing",
    number: "05",
    title: "Testing & Optimization",
    text: "Ensure quality, security and performance.",
    color: "#e11d48",
    light: "#ff5c85",
    glow: "rgba(225, 29, 72, 0.35)",
  },
  {
    id: "deployment",
    number: "06",
    title: "Deployment & Support",
    text: "Launch and provide ongoing support.",
    color: "#2563eb",
    light: "#5b9bff",
    glow: "rgba(37, 99, 235, 0.35)",
  },
];

/* =====================================================
   WHY CHOOSE KADEN KOPPER TECHNOLOGY
===================================================== */

const WEB_ADVANTAGES = [
  {
    id: "performance",
    title: "High Performance",
    text: "Fast-loading and optimized web apps.",
    icon: (
      <Svg>
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </Svg>
    ),
  },

  {
    id: "mobile",
    title: "Mobile-First Design",
    text: "Seamless experience across all devices.",
    icon: (
      <Svg>
        <rect x="6" y="2.5" width="12" height="19" rx="2" />
        <path d="M9 5h6" />
        <circle
          cx="12"
          cy="18.5"
          r="0.7"
          fill="currentColor"
          stroke="none"
        />
      </Svg>
    ),
  },

  {
    id: "security",
    title: "Secure Development",
    text: "Built with security best practices.",
    icon: (
      <Svg>
        <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </Svg>
    ),
  },

  {
    id: "uiux",
    title: "Modern UI/UX",
    text: "Beautiful and user-friendly designs.",
    icon: (
      <Svg>
        <path d="m12 3 2.7 5.5L21 9.4l-4.5 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L3 9.4l6.3-.9L12 3Z" />
      </Svg>
    ),
  },

  {
    id: "scalable",
    title: "Scalable Solutions",
    text: "Built to grow with your business.",
    icon: (
      <Svg>
        <path d="M5 7h14" />
        <path d="M5 12h14" />
        <path d="M5 17h14" />
        <path d="M7 4h10" />
        <path d="M7 20h10" />
      </Svg>
    ),
  },

  {
    id: "support",
    title: "Expert Support",
    text: "Ongoing maintenance and technical support.",
    icon: (
      <Svg>
        <path d="M4 13a8 8 0 0 1 16 0" />
        <path d="M4 13v4a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2Z" />
        <path d="M20 13v4a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2Z" />
        <path d="M16 19c0 1.2-1.8 2-4 2" />
      </Svg>
    ),
  },
];

/* =====================================================
   CIRCULAR PROGRESS COMPONENT
===================================================== */

function ExpertiseCircle({ value, label, color }) {
  return (
    <div className="kk-web-expertise-circle-wrap">
      <div
        className={`kk-web-expertise-circle ${color}`}
        style={{ "--progress": `${value * 3.6}deg` }}
      >
        <div className="kk-web-expertise-circle-inner">
          <strong>{value}%</strong>
        </div>
      </div>

      <span className="kk-web-expertise-circle-label">{label}</span>
    </div>
  );
}

/* =====================================================
   3D TECH TOWER (glossy stacked slabs)
   Slab: 240 wide, top face 110 tall, 14 thick.
   Bottom slab is drawn first so upper slabs overlap it.
===================================================== */

function TechTower() {
  const lastIndex = TECH_LAYERS.length - 1;

  return (
    <svg
      className="kk-web-tech-slabs"
      viewBox="0 0 240 350"
      aria-hidden="true"
    >
      <defs>
        {TECH_LAYERS.map((layer) => (
          <g key={layer.id}>
            <linearGradient
              id={`kk-slab-top-${layer.id}`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor={layer.topA} />
              <stop offset="100%" stopColor={layer.topB} />
            </linearGradient>

            <linearGradient
              id={`kk-slab-left-${layer.id}`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor={layer.left} />
              <stop offset="100%" stopColor={layer.right} />
            </linearGradient>
          </g>
        ))}

        <radialGradient id="kk-slab-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.45)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </radialGradient>
      </defs>

      {/* glow under the tower */}
      <ellipse cx="120" cy="318" rx="120" ry="30" fill="url(#kk-slab-floor)" />

      {[...TECH_LAYERS].reverse().map((layer, reversedIndex) => {
        const index = lastIndex - reversedIndex;
        const y = index * SLAB_STEP;

        return (
          <g key={layer.id}>
            {/* left side */}
            <polygon
              points={`0,${y + 55} 120,${y + 110} 120,${y + 124} 0,${y + 69}`}
              fill={layer.left}
            />

            {/* right side */}
            <polygon
              points={`120,${y + 110} 240,${y + 55} 240,${y + 69} 120,${y + 124}`}
              fill={layer.right}
            />

            {/* top face */}
            <polygon
              points={`120,${y} 240,${y + 55} 120,${y + 110} 0,${y + 55}`}
              fill={`url(#kk-slab-top-${layer.id})`}
            />

            {/* glossy glowing edge */}
            <polyline
              points={`0,${y + 55} 120,${y + 110} 240,${y + 55}`}
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />

            {/* inner outline */}
            <polygon
              points={`120,${y + 10} 218,${y + 55} 120,${y + 100} 22,${y + 55}`}
              fill="none"
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="1"
            />

            {/* top highlight */}
            <polygon
              points={`120,${y} 240,${y + 55} 228,${y + 55} 120,${y + 6} 12,${y + 55} 0,${y + 55}`}
              fill="rgba(255,255,255,0.18)"
            />
          </g>
        );
      })}

      {/* UI / dashboard glyph lying flat on the top slab */}
      <g
        transform="matrix(0.55 0.25 -0.55 0.25 120 55)"
        fill="none"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="3"
        strokeLinejoin="round"
      >
        <rect x="-58" y="-48" width="52" height="40" rx="4" fill="rgba(255,255,255,0.18)" />
        <rect x="2" y="-48" width="56" height="24" rx="4" />
        <rect x="2" y="-18" width="56" height="26" rx="4" fill="rgba(255,255,255,0.18)" />
        <rect x="-58" y="-2" width="52" height="40" rx="4" />
        <path d="M-50 12h36M-50 24h24" strokeLinecap="round" />
        <path d="M10 -36h40M10 -8h40M10 2h26" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* faint circuit lines behind the tower */
function TechCircuit() {
  return (
    <svg
      className="kk-web-tech-circuit"
      viewBox="0 0 440 390"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="rgba(37, 99, 235, 0.16)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 70H58L88 100H150" />
        <path d="M0 130H34L60 156H110" />
        <path d="M0 300H72L104 268H170" />
        <path d="M20 360H96L120 336H190" />
        <path d="M290 0V40L320 70H380" />
        <path d="M360 390V350L392 318H440" />
        <path d="M440 110H402L378 134H330" />
        <path d="M150 0V30L176 56" />
      </g>

      <g fill="rgba(37, 99, 235, 0.28)">
        <circle cx="150" cy="100" r="3" />
        <circle cx="110" cy="156" r="3" />
        <circle cx="170" cy="268" r="3" />
        <circle cx="190" cy="336" r="3" />
        <circle cx="380" cy="70" r="3" />
        <circle cx="440" cy="318" r="3" />
        <circle cx="330" cy="134" r="3" />
        <circle cx="176" cy="56" r="3" />
      </g>
    </svg>
  );
}

/* =====================================================
   WEB COMPONENT
===================================================== */

function Web() {
  const [current, setCurrent] = useState(0);

  const [activeTechCategory, setActiveTechCategory] =
    useState("Frontend");

  const [webItems, setWebItems] = useState([]);
  const [webLoading, setWebLoading] = useState(true);

  /* ---------- LOAD DATA FROM AWS ---------- */

  useEffect(() => {
    let cancelled = false;

    const loadWebDevelopment = async () => {
      try {
        setWebLoading(true);

        const response = await fetch(WEB_DEVELOPMENT_API);

        if (!response.ok) {
          throw new Error(`Failed to load Web Development data: ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          setWebItems(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Web Development API error:", error);

        if (!cancelled) {
          setWebItems([]);
        }
      } finally {
        if (!cancelled) {
          setWebLoading(false);
        }
      }
    };

    loadWebDevelopment();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- HELPERS ---------- */

  const getImageUrl = (item) =>
    item?.image || item?.imageUrl || item?.fileUrl || item?.preview || "";

  const bannerItems = webItems.filter(
    (item) => item.category === "Banner" && getImageUrl(item)
  );

  /* ---------- HERO SLIDES ---------- */

  const heroSlides = webLoading
    ? []
    : bannerItems.map((item) => ({
        id: item.id,
        name: item.name || "",
        description: item.description || "",
        image: getImageUrl(item),
      }));

  const heroIsEmpty = !webLoading && heroSlides.length === 0;

  /* ---------- HERO AUTO SLIDER ---------- */

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (current >= heroSlides.length) {
      setCurrent(0);
    }
  }, [current, heroSlides.length]);

  /* ===================================================
     RETURN
  =================================================== */

  return (
    <main className="kk-web-page">
      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className={`kk-web-hero ${heroIsEmpty ? "is-empty" : ""}`}
        aria-label="Web Development"
      >
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`kk-web-slide ${index === current ? "active" : ""}`}
          >
            <div
              className={`kk-web-hero-container ${
                slide.image ? "" : "no-image"
              }`}
            >
              {/* LEFT — CONTENT */}
              <div className="kk-web-hero-content">
                <span className="kk-web-hero-category">Web Development</span>

                {slide.name && (
                  <h1 className="kk-web-hero-title">
                    {renderHeroTitle(slide.name)}
                  </h1>
                )}

                {slide.description && (
                  <p className="kk-web-hero-description">{slide.description}</p>
                )}

                <div className="kk-web-hero-actions">
                  <Link to="/contact" className="kk-web-start-btn">
                    <span>Start a Project</span>
                    <span className="kk-web-btn-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>

                  <Link to="/project" className="kk-web-work-btn">
                    Explore Our Work
                  </Link>
                </div>

                <div className="kk-web-hero-features">
                  {HERO_FEATURES.map((feature) => (
                    <div className="kk-web-feature-item" key={feature.id}>
                      <div className="kk-web-feature-icon">{feature.icon}</div>

                      <div className="kk-web-feature-text">
                        <strong>{feature.strong}</strong>
                        <span>{feature.span}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — IMAGE */}
              {slide.image && (
                <div className="kk-web-hero-image-wrapper">
                  <img
                    src={slide.image}
                    alt={slide.name || "Web Development"}
                    className="kk-web-hero-image"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {heroSlides.length > 1 && (
          <div className="kk-web-hero-dots">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`kk-web-hero-dot ${index === current ? "active" : ""}`}
                onClick={() => setCurrent(index)}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ==================================================
          SERVICES — WHAT WE BUILD
      ================================================== */}

      <section className="kk-web-services" aria-labelledby="kk-web-services-title">
        <div className="kk-web-services-container">
          <div className="kk-web-services-header">
            <span className="kk-web-services-eyebrow">Our Services</span>

            <h2 id="kk-web-services-title">What We Build</h2>

            <p>
              Digital products designed around your business to solve
              real-world problems.
            </p>
          </div>

          <div className="kk-web-services-grid">
            {SERVICES.map((service) => (
              <article className="kk-web-service-card" key={service.id}>
                <div className="kk-web-service-image">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="kk-web-service-body">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          INDUSTRIES — BUILT FOR EVERY INDUSTRY
      ================================================== */}

      <section
        className="kk-web-industries"
        aria-labelledby="kk-web-industries-title"
      >
        <div className="kk-web-industries-container">
          <div className="kk-web-industries-header">
            <span className="kk-web-industries-eyebrow">Industries</span>

            <h2 id="kk-web-industries-title">Built for Every Industry</h2>

            <p>
              We deliver industry-specific solutions tailored to unique
              business challenges.
            </p>
          </div>

          <ul className="kk-web-industries-grid">
            {INDUSTRIES.map((industry) => (
              <li className="kk-web-industry-card" key={industry.id}>
                <div className="kk-web-industry-image">
                  <img
                    src={industry.image}
                    alt={industry.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <h3 className="kk-web-industry-name">{industry.title}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==================================================
          TECHNOLOGY STACK
      ================================================== */}

      <section
        className="kk-web-tech-stack"
        aria-labelledby="kk-web-tech-stack-title"
      >
        <div className="kk-web-tech-stack-container">
          {/* LEFT CONTENT */}
          <div className="kk-web-tech-content">
            <div className="kk-web-tech-heading">
              <span className="kk-web-tech-eyebrow">TECHNOLOGIES WE USE</span>

              <h2 id="kk-web-tech-stack-title">
                Our Web Development Technology Stack
              </h2>

              <p>
                We work with modern and reliable technologies to build
                powerful digital solutions.
              </p>
            </div>

            {/* CATEGORY TABS */}
            <div
              className="kk-web-tech-tabs"
              role="tablist"
              aria-label="Technology categories"
            >
              {TECHNOLOGY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={activeTechCategory === category}
                  className={`kk-web-tech-tab ${
                    activeTechCategory === category ? "active" : ""
                  }`}
                  onClick={() => setActiveTechCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* TECHNOLOGY DATA */}
            <div className="kk-web-tech-list">
              {TECHNOLOGY_STACK[activeTechCategory].map((technology) => (
                <div className="kk-web-tech-item" key={technology.name}>
                  <div className={`kk-web-tech-icon ${technology.className}`}>
                    {technology.short}
                  </div>

                  <span>{technology.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE VISUAL — 3D TOWER */}
          <div className="kk-web-tech-visual">
            <TechCircuit />

            <div className="kk-web-tech-diagram">
              <TechTower />

              <ol className="kk-web-tech-labels">
                {TECH_LAYERS.map((layer) => (
                  <li className="kk-web-tech-label" key={layer.id}>
                    <span className="kk-web-tech-label-icon">{layer.icon}</span>
                    <span className="kk-web-tech-label-text">{layer.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          TECHNOLOGY EXPERTISE OVERVIEW
      ================================================== */}

      <section className="kk-web-expertise">
        <div className="kk-web-expertise-container">
          <div className="kk-web-expertise-header">
            <div className="kk-web-expertise-header-content">
              <span className="kk-web-expertise-eyebrow">
                TECHNOLOGY PERFORMANCE
              </span>

              <h2>Technology Expertise Overview</h2>

              <p>
                Our web development expertise combines modern technologies,
                scalable architecture, and proven delivery capabilities to
                create reliable digital experiences.
              </p>
            </div>

            <button className="kk-web-expertise-filter" type="button">
              <span>Last 6 Months</span>
              <b>⌄</b>
            </button>
          </div>

          <div className="kk-web-expertise-metrics">
            {EXPERTISE_METRICS.map((metric) => (
              <div className="kk-web-expertise-metric-card" key={metric.id}>
                <div className="kk-web-expertise-metric-top">
                  <div
                    className={`kk-web-expertise-metric-icon ${metric.iconClass}`}
                  >
                    {metric.icon}
                  </div>

                  <div className="kk-web-expertise-metric-title">
                    <span>{metric.title}</span>
                    <strong>{metric.value}</strong>
                  </div>

                  <span className={`kk-web-expertise-change ${metric.trend}`}>
                    {metric.trend === "up" ? "↑" : "↓"} {metric.change}
                  </span>
                </div>

                <div className="kk-web-mini-chart">
                  <svg viewBox="0 0 280 90" preserveAspectRatio="none">
                    <defs>
                      <linearGradient
                        id={`expertise-gradient-${metric.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={metric.lineColor}
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor={metric.lineColor}
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <polygon
                      points={`0,90 ${metric.points} 280,90`}
                      fill={`url(#expertise-gradient-${metric.id})`}
                    />

                    <polyline
                      points={metric.points}
                      fill="none"
                      stroke={metric.lineColor}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="kk-web-expertise-dashboard">
            {/* SUCCESS */}
            <div className="kk-web-expertise-success">
              <h3>Project Success &amp; Insights</h3>

              <div className="kk-web-success-circle">
                <div className="kk-web-success-circle-inner">
                  <strong>95%</strong>
                  <span>Success Rate</span>
                </div>
              </div>

              <p>Delivering high-quality web solutions that create real value.</p>
            </div>

            {/* PROJECT DISTRIBUTION */}
            <div className="kk-web-expertise-projects">
              <div
                className="kk-web-project-donut"
                style={{ background: PROJECT_DONUT_GRADIENT }}
              >
                <div className="kk-web-project-donut-inner">
                  <strong>100+</strong>
                  <span>Projects</span>
                </div>
              </div>

              <div className="kk-web-project-legend">
                {PROJECT_DISTRIBUTION.map((item) => (
                  <div className="kk-web-project-legend-item" key={item.label}>
                    <span className={`kk-web-project-dot ${item.color}`} />
                    <span className="kk-web-project-name">{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* SATISFACTION */}
            <div className="kk-web-expertise-satisfaction">
              <h3>Client Satisfaction</h3>

              <div className="kk-web-satisfaction-grid">
                {SATISFACTION_METRICS.map((item) => (
                  <ExpertiseCircle
                    key={item.label}
                    value={item.value}
                    label={item.label}
                    color={item.color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          OUR WEB DEVELOPMENT PROCESS
      ================================================== */}

      <section className="kk-web-process">
        <div className="kk-web-process-container">
          <div className="kk-web-process-header">
            <h2>Our Web Development Process</h2>

            <p>
              A structured and transparent process to deliver high-quality web
              solutions.
            </p>
          </div>

          <ol className="kk-web-process-timeline">
            {WEB_PROCESS.map((step, index) => {
              const next = WEB_PROCESS[index + 1];

              return (
                <li
                  className="kk-web-process-step"
                  key={step.id}
                  style={{
                    "--step-color": step.color,
                    "--step-light": step.light,
                    "--step-glow": step.glow,
                    "--next-color": next ? next.color : step.color,
                  }}
                >
                  {next && (
                    <div className="kk-web-process-line" aria-hidden="true">
                      <span />
                    </div>
                  )}

                  <div className="kk-web-process-circle">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ==================================================
          WHY CHOOSE KADEN KOPPER TECHNOLOGY
      ================================================== */}

      <section
        className="kk-web-advantages"
        aria-labelledby="kk-web-advantages-title"
      >
        <div className="kk-web-advantages-container">
          {/* SECTION HEADER */}
          <div className="kk-web-advantages-header">
            <span className="kk-web-advantages-eyebrow">OUR ADVANTAGE</span>

            <h2 id="kk-web-advantages-title">
              Why Choose Kaden Kopper Technology
            </h2>

            <p>
              We deliver more than just websites. We create digital
              experiences that create value.
            </p>
          </div>

          {/* ADVANTAGE CARDS */}
          <div className="kk-web-advantages-grid">
            {WEB_ADVANTAGES.map((advantage) => (
              <article className="kk-web-advantage-card" key={advantage.id}>
                <div className="kk-web-advantage-icon">{advantage.icon}</div>

                <h3>{advantage.title}</h3>

                <p>{advantage.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Web;
