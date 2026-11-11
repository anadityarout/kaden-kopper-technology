import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Industry.css";

const INDUSTRY_BANNER_API =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/industrybanner";

/* =====================================================
   INDUSTRIES DATA
===================================================== */

const INDUSTRIES = [
  {
    title: "Real Estate",
    art: "realestate",
    tags: ["Marketplaces", "CRM", "Investment"],
    meta: "Property platforms",
    description:
      "We build property marketplaces, brokerage CRMs, investment platforms, and management systems. AI built in from day one.",
  },
  {
    title: "Healthcare",
    art: "healthcare",
    tags: ["Security", "Compliance", "Accessibility"],
    meta: "Secure & compliant",
    description:
      "Our custom website development solutions for the healthcare industry are designed with a strong focus on security, compliance, and user accessibility.",
  },
  {
    title: "Retail & E-Commerce",
    art: "retail",
    tags: ["Storefronts", "Conversion", "Custom"],
    meta: "Conversion-focused",
    description:
      "We build custom e-commerce websites that go beyond standard online stores by delivering highly optimized, conversion-focused platforms tailored to your business model.",
  },
  {
    title: "SaaS & Startups",
    art: "saas",
    tags: ["Scalable", "Flexible", "Growth"],
    meta: "Built to scale",
    description:
      "For SaaS businesses and startups, we create scalable and flexible custom websites that support rapid growth and evolving product needs.",
  },
  {
    title: "Finance & Fintech",
    art: "finance",
    tags: ["Secure", "Performance", "Workflows"],
    meta: "Secure by design",
    description:
      "In the finance and fintech sector, we develop secure and high-performance custom websites that handle complex workflows and sensitive data with precision.",
  },
  {
    title: "Travel & Hospitality",
    art: "travel",
    tags: ["OTA", "Booking", "AI Personalisation"],
    meta: "Booking systems",
    description:
      "We build OTA platforms, hotel management systems, booking engines, and AI-powered travel personalisation tools.",
  },
  {
    title: "Education & E-Learning",
    art: "education",
    tags: ["LMS", "eLearning", "Adaptive AI"],
    meta: "LMS & learning apps",
    description:
      "We build LMS platforms, eLearning apps, and AI-powered adaptive learning tools for EdTech startups and schools.",
  },
  {
    title: "Media & Entertainment",
    art: "media",
    tags: ["Content", "Engagement", "Performance"],
    meta: "Content delivery",
    description:
      "For media and entertainment businesses, we create dynamic and scalable custom websites that support content delivery, user interaction, and performance optimization.",
  },
];




/* =====================================================
   SCROLL REVEAL HOOK
===================================================== */

function useScrollReveal(options = {}) {
  const {
    threshold = 0.12,
    rootMargin = "0px 0px -60px 0px",
  } = options;

  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    if (
      window.matchMedia &&
      window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return [ref, visible];
}

/* =====================================================
   STAT ICON
===================================================== */

function StatIcon({ type }) {
  if (type === "star") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" />
      </svg>
    );
  }

  if (type === "users") {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="9" cy="7" r="4" />
        <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
        <path d="M16 3.5a4 4 0 0 1 0 7.5" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.8" />
      </svg>
    );
  }

  if (type === "briefcase") {
    return (
      <svg viewBox="0 0 24 24">
        <rect
          x="3"
          y="7"
          width="18"
          height="13"
          rx="2"
        />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24">
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
      />
      <path d="M8 21v-6h8v6" />
      <path d="M8 7h2" />
      <path d="M14 7h2" />
      <path d="M8 11h2" />
      <path d="M14 11h2" />
    </svg>
  );
}

/* =====================================================
   FOCUS ICON
===================================================== */

function FocusIcon({ type }) {
  if (type === "user") {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3-7 8-7s8 3 8 7" />
      </svg>
    );
  }

  if (type === "layers") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="m12 3 9 5-9 5-9-5 9-5z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3l8 4v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V7l8-4z" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}



/* =====================================================
   ANIMATED STAT
===================================================== */

function AnimatedStat({ stat, index }) {
  const [value, setValue] = useState(0);

  const [ref, visible] = useScrollReveal({
    threshold: 0.25,
    rootMargin: "0px 0px -40px 0px",
  });

  useEffect(() => {
    if (!visible) {
      setValue(0);
      return;
    }

    const duration = 3000;
    const start = performance.now();

    let frame;

    const animate = (time) => {
      const progress = Math.min(
        (time - start) / duration,
        1
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      const current = stat.target * eased;

      if (stat.decimal) {
        setValue(
          Number(current.toFixed(1))
        );
      } else {
        setValue(Math.floor(current));
      }

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [visible, stat]);

  return (
    <div
      ref={ref}
      className={`kk-industry-stat kk-reveal ${
        visible ? "is-visible" : ""
      }`}
      style={{
        "--reveal-delay": `${index * 120}ms`,
      }}
    >
      <div className="kk-stat-icon">
        <StatIcon type={stat.icon} />
      </div>

      <div className="kk-stat-content">
        <strong>
          {value}
          {stat.suffix}
        </strong>

        <span>
          {stat.label}
        </span>

        <small>
          {stat.description}
        </small>
      </div>
    </div>
  );
}

/* =====================================================
   INDUSTRY CARD ILLUSTRATIONS
===================================================== */

function IndustryDefs() {
  const grads = [
    ["kk-ind-g1", "#4f46e5", "#2d8bff"],
    ["kk-ind-g2", "#1d9bd8", "#22c7b5"],
    ["kk-ind-g3", "#f0707a", "#3aa5a8"],
    ["kk-ind-g4", "#f2b134", "#7c6cff"],
  ];

  return (
    <svg
      className="kk-industry-defs"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {grads.map(([id, from, to]) => (
          <linearGradient
            key={id}
            id={id}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="120"
            y2="110"
          >
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

function IndustryIllustration({ type }) {
  const g1 = "url(#kk-ind-g1)";
  const g2 = "url(#kk-ind-g2)";
  const g3 = "url(#kk-ind-g3)";
  const g4 = "url(#kk-ind-g4)";

  let shapes = null;

  if (type === "realestate") {
    shapes = (
      <>
        <path d="M12 54 60 16l48 38" stroke={g1} />
        <rect x="24" y="50" width="72" height="48" rx="5" fill="#eceefe" stroke={g1} />
        <rect x="52" y="68" width="16" height="30" rx="2" fill={g1} stroke="none" />
        <rect x="33" y="62" width="12" height="12" rx="2" fill="#cfd5fb" stroke="none" />
        <rect x="75" y="62" width="12" height="12" rx="2" fill="#cfd5fb" stroke="none" />
      </>
    );
  } else if (type === "healthcare") {
    shapes = (
      <>
        <path
          d="M60 94C20 66 12 44 26 28c12-13 28-8 34 6 6-14 22-19 34-6 14 16 6 38-34 66z"
          fill={g3}
          stroke="none"
        />
        <path d="M60 44v24M48 56h24" stroke="#ffffff" strokeWidth="5" />
      </>
    );
  } else if (type === "retail") {
    shapes = (
      <>
        <path d="M28 42h64l5 50a5 5 0 0 1-5 5H28a5 5 0 0 1-5-5z" fill="#e3f6f8" stroke={g2} />
        <path d="M44 42v-8a16 16 0 0 1 32 0v8" stroke={g2} />
        <path d="M48 64a12 12 0 0 0 24 0" stroke={g2} />
      </>
    );
  } else if (type === "saas") {
    shapes = (
      <>
        <path d="M60 8c15 15 18 38 11 66H49c-7-28-4-51 11-66z" fill="#f6f1e4" stroke={g4} />
        <circle cx="60" cy="38" r="7" fill="#ddd9ff" stroke={g4} />
        <path d="M49 62 34 80l15-4M71 62l15 18-15-4" stroke={g4} />
        <path d="M54 84v12M60 84v18M66 84v12" stroke={g4} />
      </>
    );
  } else if (type === "finance") {
    shapes = (
      <>
        <path d="M14 42 60 14l46 28z" fill="#eceefe" stroke={g1} />
        <rect x="24" y="50" width="10" height="36" rx="2" fill="#cfd5fb" stroke={g1} />
        <rect x="45" y="50" width="10" height="36" rx="2" fill="#cfd5fb" stroke={g1} />
        <rect x="65" y="50" width="10" height="36" rx="2" fill="#cfd5fb" stroke={g1} />
        <rect x="86" y="50" width="10" height="36" rx="2" fill="#cfd5fb" stroke={g1} />
        <rect x="14" y="90" width="92" height="9" rx="3" fill={g1} stroke="none" />
      </>
    );
  } else if (type === "travel") {
    shapes = (
      <>
        <path d="M104 14 14 48l32 14 12 34 14-24 26 18z" fill="#e3f6f8" stroke={g2} />
        <path d="M46 62 104 14" stroke={g2} />
      </>
    );
  } else if (type === "education") {
    shapes = (
      <>
        <path d="M60 22 108 46 60 70 12 46z" fill="#eceefe" stroke={g1} />
        <path d="M32 58v20c0 9 56 9 56 0V58" stroke={g1} />
        <path d="M108 46v24" stroke={g4} />
        <circle cx="108" cy="74" r="4" fill={g4} stroke="none" />
      </>
    );
  } else {
    shapes = (
      <>
        <rect x="12" y="22" width="96" height="64" rx="10" fill="#fdecef" stroke={g3} />
        <path d="M52 38v32l26-16z" fill={g3} stroke={g3} />
        <path d="M42 98h36" stroke={g3} />
      </>
    );
  }

  return (
    <svg
      className="kk-industry-art-svg"
      viewBox="0 0 120 110"
      fill="none"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes}
    </svg>
  );
}

/* =====================================================
   INDUSTRY CARD
===================================================== */

function IndustryCard({ industry, index }) {
  const [ref, visible] = useScrollReveal({
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px",
  });

  return (
    <Link
      ref={ref}
      to="/start-a-project"
      className={`kk-industry-card kk-reveal ${
        visible ? "is-visible" : ""
      }`}
      style={{
        "--reveal-delay": `${(index % 2) * 120}ms`,
      }}
    >
      <div
        className="kk-industry-card-art"
        aria-hidden="true"
      >
        <IndustryIllustration type={industry.art} />
      </div>

      <h3>
        {industry.title}
      </h3>

      <p>
        {industry.description}
      </p>

      <div className="kk-industry-card-tags">
        {industry.tags.map((tag) => (
          <span key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="kk-industry-card-footer">
        <span className="kk-industry-card-meta">
          {industry.meta}
        </span>

        <span className="kk-industry-card-more">
          <span>Learn More</span>

          <span className="kk-industry-card-arrow">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}


/* =====================================================
   BANNER DATA
===================================================== */

const BANNER_DEFAULT_DESCRIPTION =
  "We deliver technology solutions tailored to the unique needs of every industry, helping businesses overcome challenges and achieve sustainable growth.";

/* set to true to show the description coming from the AWS banner API */
const USE_BANNER_API_DESCRIPTION = false;

const BANNER_POINTS = [
  {
    title: "Industry Analysis",
    description: "Deep market insights & trends",
    icon: "chart",
  },
  {
    title: "Rapid Deployment",
    description: "Quick setup & implementation",
    icon: "gear",
  },
  {
    title: "Expert Matching",
    description: "Industry-specific talent & solutions",
    icon: "users",
  },
];

/* =====================================================
   ROTATING GLOBE ENGINE
===================================================== */

const GLOBE_MASK_W = 288;
const GLOBE_MASK_H = 144;

/* land mask: 1 bit per 1.25 degree cell, base64 */
const GLOBE_MASK_B64 = [
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO+AAAf/+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB",
  "///x/+//9BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAff/8f/////+AAAAAgAA+AAAAAPgAAAAAAAAAAAAAAAAAAAAAH7/Af",
  "/////4AAAH8AAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAFgH+f//////wAAAD5gAAAAAAAAAMAAAAAAAAAAAAAAAAAB4AA4/8H/////",
  "/wAAAAwAAAAAAgAAAHwAAAAAAAAAAAAAAAAAPmPDjgAAf////wAAAAAAAAAD4AAA///gAAPwAAAAAAAAAAAGAAAAAAAAP////wAA",
  "AAAAAAAOAAAH//8AAAAAAAAAAAAAAAAP2HHe7uAAD///+AAAAAAAAAAYAAD////+HgAAAAAAAAAAAAAff7Dg//AAD////AAAAAAA",
  "AABwAdf//////gD/AAAAAAD8AAAAP/gcf/+AD///9AAAAAAfAAAAB8///////////wAAAAf//4//H/zvDh/ABf//8AAAAAH/4AAA",
  "49////////////7+wB//////8HBvnBfgB//+AAAAAA///xh//+///////////////gP//////////Af8B//4AAAAAB///5v//9//",
  "////////////fj//////////8AfMA/+AB/AAAD/P8P//////////////////BAH/////////3jfwA/4AAfAAAP+f8///////////",
  "///////8AIv////////+AAHQAfwAAAAAA/5////////////////////+AB/////////4ADwAAPwAAAAAD/x/////////////////",
  "/9/wAA/9n//////wAD8AABwAAAAAD/x/////////////////8D+AAAP5AP/////wAD8YAAAAAAAAD/4f///////////////+cOAA",
  "AAA4AAf////8AD/8AAAAAAAIAHgP//////////////8AAcAAAABAAAP/////gB/+AAAAAAAcATh///////////////4AB8AAAAMA",
  "AAP/////4D//AAAAAAAOA2B///////////////gAD4AAAAAAAAD//////P//wAAAAABnAYf///////////////wABwAAAAAAAAB/",
  "/////H//4AAAAABvD//////////////////gBwAAAAAAAAA//////n//4AAAAADPn//////////////////gBAAAAAAAAABf////",
  "////IAAAAAAOf/////////////////8gAAAAAAAAAAAX///////EeAAAAAAB//////////////////8wAAAAAAAAAAAL//////9w",
  "fAAAAAAP//////////////////8AAAAAAAAAAAAH///////xBAAAAAAD/////f////////////4gAAAAAAAAAAAH////////AAAA",
  "AAAB/9//M/w///////////wAAAAAAAAAAAAH///////YAAAAAAAB/8/+Afz///////////hgAAAAAAAAAAAP//////8AAAAAAAB/",
  "4OP8APx//////////+DwAAAAAAAAAAAH//////8AAAAAAAB/wXj8MH4f/////////wCAAAAAAAAAAAAH//////gAAAAAAAB/gQ3l",
  "//8/////////vgCAAAAAAAAAAAAH//////AAAAAAAAD/AQTn//8f///////+TADAAAAAAAAAAAAD//////AAAAAAAAB/AABn//4f",
  "///////8DgGAAAAAAAAAAAAD/////+AAAAAAAAAcB4BD//+f////////xweAAAAAAAAAAAAB/////+AAAAAAAAAR/4AAB///////",
  "////BxcAAAAAAAAAAAAA/////8AAAAAAAAAf/wAAB///////////AGwAAAAAAAAAAAAAP////4AAAAAAAAB//4AAD///////////",
  "gOAAAAAAAAAAAAAAH////gAAAAAAAAD///DwD///////////gIAAAAAAAAAAAAAAE////gAAAAAAAAD///7/////////////gAAA",
  "AAAAAAAAAAAAC//xhgAAAAAAAAD///////z/////////wAAAAAAAAAAAAAAABf/gAwAAAAAAAAP/////z/5/////////gAAAAAAA",
  "AAAAAAAABP/AAwAAAAAAAAf/////5/8T////////AAAAAAAAAAAAAAAAAn/AAQAAAAAAAA//////8/8B////////AAAAAAAAAAAA",
  "AAAAAD/AAEAAAAAAAA//////8/+YA//////+gAAAAAAAAAAAAAAAAB/AAgAAAAAAAB//////8f/+Af/////4gAAAAAAAAAAAAAAA",
  "AA/ACMAAAAAAAD///////f//AP/+P//AAAAAAAAAAAAAAAAAAA/AwDAAAAAAAB///////P/+AD/8P/gAAAAAAAAAAAAQAAAAAA/h",
  "wAMAAAAAAB///////H/8AD/wH/mAAAAAAAAAAAAAAAAAAAP/wGIgAAAAAB///////n/4AD/gH/gAwAAAAAAAAAAAAAAAAAD/gAAA",
  "AAAAAB///////j/gAB/AD/wAwAAAAAAAAAAAAAAAAAAH+AAAAAAAAB///////z/AAB8AA/4AgAAAAAAAAAAAAAAAAAAD+AAAAAAA",
  "AD///////74AAA8AA/4AAAAAAAAAAAAAAAAAAAAAOAAAAAAAAB///////9AAAA8AAX4AgAAAAAAAAAAAAAAAAAAAGAIAAAAAAB//",
  "/////8CAAA8AAT4AAAAAAAAAAAAAAAAAAAAAGA+EAAAAAA///////++AAAcAARwBIAAAAAAAAAAAAAAAAAAABJ/+AAAAAAf/////",
  "//8AAAaAAAgCKAAAAAAAAAAAAAAAAAAAAX//gAAAAAP///////8AAACAAQAAOAAAAAAAAAAAAAAAAAAAAD//gAAAAAH///////8A",
  "AACAAIAEEAAAAAAAAAAAAAAAAAAAAD//+AAAAAD/D/////4AAAAAAMAGAAAAAAAAAAAAAAAAAAAAAD///gAAAAAABf////wAAAAA",
  "BuAeAAAAAAAAAAAAAAAAAAAAAD///gAAAAAAAP////gAAAAAA2A8AAAAAAAAAAAAAAAAAAAAAH///wAAAAAAAP////AAAAAAAeB8",
  "AAAAAAAAAAAAAAAAAAAAAP///wAAAAAAAP///+AAAAAAAcH88gAAAAAAAAAAAAAAAAAAAP///4AAAAAAAf///8AAAAAAAOH8AiAA",
  "AAAAAAAAAAAAAAAAAf////AAAAAAAf///4AAAAAAAHD5gCIAAAAAAAAAAAAAAAAAAP////8AAAAAAP///wAAAAAAAHh5QzfAQAAA",
  "AAAAAAAAAAAAAf/////AAAAAAH///wAAAAAAADgAQA/wQAAAAAAAAAAAAAAAAf/////wAAAAAD///gAAAAAAAAgAAAP5gAAAAAAA",
  "AAAAAAAAAP/////wAAAAAD///wAAAAAAAAfAAAH8DAAAAAAAAAAAAAAAAH/////wAAAAAD///gAAAAAAAADwAAPmAQAAAAAAAAAA",
  "AAAAAH/////wAAAAAD///wAAAAAAAAAAEAACAAAAAAAAAAAAAAAAAD/////gAAAAAB///wAAAAAAAAAAAAAAAEAAAAAAAAAAAAAA",
  "AD/////AAAAAAB///wAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAB////+AAAAAAD///wEAAAAAAAAAAPhgAAAAAAAAAAAAAAAAAB//",
  "//+AAAAAAD///4MAAAAAAAAABPhwAAAAAAAAAAAAAAAAAA////+AAAAAAH///wcAAAAAAAAAH/hwAAQAAAAAAAAAAAAAAAP///+A",
  "AAAAAH///h8AAAAAAAAAP/54AAAAAAAAAAAAAAAAAAH///8AAAAAAH//+B8AAAAAAAAAP//4AAACAAAAAAAAAAAAAAD///8AAAAA",
  "AD//8A4AAAAAAAAAf//8AAAAAAAAAAAAAAAAAAD///8AAAAAAB//8B4AAAAAAAAD///+ABAAAAAAAAAAAAAAAAD///4AAAAAAB//",
  "8BwAAAAAAAAP////AAAAAAAAAAAAAAAAAAD///gAAAAAAA//8BwAAAAAAAAf////gAAAAAAAAAAAAAAAAAD//8AAAAAAAA//8BwA",
  "AAAAAAAf////wAAAAAAAAAAAAAAAAAH//4AAAAAAAA//wAAAAAAAAAAf////wAAAAAAAAAAAAAAAAAH//4AAAAAAAA//wAAAAAAA",
  "AAAf////4AAAAAAAAAAAAAAAAAH//4AAAAAAAAf/wAAAAAAAAAAf////4AAAAAAAAAAAAAAAAAH//wAAAAAAAAf/gAAAAAAAAAAP",
  "////4AAAAAAAAAAAAAAAAAH//wAAAAAAAAP/AAAAAAAAAAAP////wAAAAAAAAAAAAAAAAAH//gAAAAAAAAH+AAAAAAAAAAAH/j//",
  "wAAAAAAAAAAAAAAAAAH//AAAAAAAAAH8AAAAAAAAAAAH4A//gAAAAAAAAAAAAAAAAAP/uAAAAAAAAAGAAAAAAAAAAAAPAAv/gAAA",
  "AAAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAAAAAAAAH/AAAQAAAAAAAAAAAAAAP/4AAAAAAAAAAAAAAAAAAAAAAAAAD/AAAIAAAA",
  "AAAAAAAAAAf/wAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAOAAAAAAAAAAAAAAf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAA",
  "AAAAAAf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAfwAAAAAAAAAAAAAAAAAAAAAAAAAAAOAABgAAAAAAAAAAAA",
  "AAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAEAADAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAA/A",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gAAAA",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/AAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAA",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaAAAAAAAAAAAAA",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAA",
  "AAAAAAAAAAAAAAA4AAAAAAAAAAAAAAB8AAACAPn8f/zwAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAA///gD////////8AAAAAAAA",
  "AAAAAAAAAAF8AAAAAAAAAAAAPP///wP/////////+AAAAAAAAAAAAAAAAAG8AAAAAAAADz///////B///////////8AAAAAAAAAA",
  "AAMAAA++AAAAAAH//////////H////////////+AAAAAAAAAAAeAwAD+AAAAAA////////////////////////8AAAAAAApAfAH/",
  "///+AAAAAA////////////////////////gAAAAAH//////////gAAAAAP///////////////////////+AAAAAAf////////8AA",
  "AAAAf////////////////////////+AAAAA///////////AAAHAP//////////////////////////AAAAOA/////////8AAAfgc",
  "/////////////////////////4AAAAAAP/////////wPB+AA/////////////////////////wAAAAAH///////////8AfP/////",
  "/////////////////////8AAAAAH////////////v/////////////////////////////wA98AAf///////////////////////",
  "///////////////////c////////////////////////////////////////////////////////////////////////////////",
  "////////////////////////////////////////////////////////////////////////////////////////////////////",
  "////////////",
].join("");

const GLOBE_CITIES = [
  [-74.0, 40.7],
  [-0.1, 51.5],
  [77.2, 28.6],
  [103.8, 1.35],
  [139.7, 35.7],
  [151.2, -33.9],
  [-46.6, -23.5],
  [55.3, 25.2],
  [18.4, -33.9],
  [-122.4, 37.8],
];

const GLOBE_ROUTES = [
  [0, 1],
  [1, 7],
  [7, 2],
  [2, 3],
  [3, 4],
  [3, 5],
  [0, 6],
  [9, 0],
  [1, 8],
  [4, 9],
];

const GLOBE_ARC_STEPS = 40;
const GLOBE_TILT = 0.38;
const GLOBE_START_ROT = (-77.2 * Math.PI) / 180;
const GLOBE_SPEED = 0.0001;

let globeDataCache = null;

function globeVec(lonDeg, latDeg) {
  const lon = (lonDeg * Math.PI) / 180;
  const lat = (latDeg * Math.PI) / 180;

  return [
    Math.cos(lat) * Math.sin(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.cos(lon),
  ];
}

function getGlobeData() {
  if (globeDataCache) return globeDataCache;

  const bin = atob(GLOBE_MASK_B64);
  const pts = [];

  for (let j = 0; j < GLOBE_MASK_H; j++) {
    const lat = 90 - ((j + 0.5) * 180) / GLOBE_MASK_H;

    const step = Math.max(
      1,
      Math.round(
        1 / Math.max(Math.cos((lat * Math.PI) / 180), 0.05)
      )
    );

    for (let i = 0; i < GLOBE_MASK_W; i += step) {
      const k = j * GLOBE_MASK_W + i;

      if ((bin.charCodeAt(k >> 3) >> (7 - (k & 7))) & 1) {
        const lon = -180 + ((i + 0.5) * 360) / GLOBE_MASK_W;
        const v = globeVec(lon, lat);

        pts.push(v[0], v[1], v[2]);
      }
    }
  }

  const cities = GLOBE_CITIES.map((c) => globeVec(c[0], c[1]));

  const routes = GLOBE_ROUTES.map(([a, b]) => {
    const va = cities[a];
    const vb = cities[b];

    const dot = Math.max(
      -1,
      Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2])
    );

    const omega = Math.acos(dot);
    const sinO = Math.sin(omega) || 1;

    const line = [];

    for (let s = 0; s <= GLOBE_ARC_STEPS; s++) {
      const t = s / GLOBE_ARC_STEPS;
      const k1 = Math.sin((1 - t) * omega) / sinO;
      const k2 = Math.sin(t * omega) / sinO;
      const lift = 1 + 0.1 * Math.sin(Math.PI * t) * omega;

      line.push([
        (va[0] * k1 + vb[0] * k2) * lift,
        (va[1] * k1 + vb[1] * k2) * lift,
        (va[2] * k1 + vb[2] * k2) * lift,
      ]);
    }

    return line;
  });

  const grid = [];

  for (let lon = -180; lon < 180; lon += 30) {
    const line = [];

    for (let lat = -90; lat <= 90; lat += 6) {
      line.push(globeVec(lon, lat));
    }

    grid.push(line);
  }

  for (let lat = -60; lat <= 60; lat += 30) {
    const line = [];

    for (let lon = -180; lon <= 180; lon += 5) {
      line.push(globeVec(lon, lat));
    }

    grid.push(line);
  }

  globeDataCache = {
    land: new Float32Array(pts),
    cities,
    routes,
    grid,
  };

  return globeDataCache;
}

function globeRotate(v, cr, sr, ct, st) {
  const x = v[0] * cr + v[2] * sr;
  const z0 = v[2] * cr - v[0] * sr;

  return [x, v[1] * ct - z0 * st, v[1] * st + z0 * ct];
}

function drawGlobe(ctx, size, dpr, rotY, time) {
  const data = getGlobeData();

  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.43;

  const cr = Math.cos(rotY);
  const sr = Math.sin(rotY);
  const ct = Math.cos(GLOBE_TILT);
  const st = Math.sin(GLOBE_TILT);

  const TWO_PI = Math.PI * 2;

  ctx.clearRect(0, 0, size, size);

  /* ATMOSPHERE */

  let g = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.24);
  g.addColorStop(0, "rgba(80, 150, 255, 0.24)");
  g.addColorStop(1, "rgba(80, 150, 255, 0)");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.24, 0, TWO_PI);
  ctx.fill();

  /* OCEAN SPHERE */

  g = ctx.createRadialGradient(
    cx - R * 0.35,
    cy - R * 0.35,
    R * 0.1,
    cx,
    cy,
    R
  );
  g.addColorStop(0, "rgba(50, 120, 255, 0.55)");
  g.addColorStop(0.5, "rgba(18, 60, 190, 0.42)");
  g.addColorStop(1, "rgba(6, 22, 100, 0.65)");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, TWO_PI);
  ctx.fill();

  ctx.strokeStyle = "rgba(120, 180, 255, 0.45)";
  ctx.lineWidth = dpr * 1.2;
  ctx.stroke();

  /* GRATICULE */

  const strokeLine = (line) => {
    let pen = false;

    ctx.beginPath();

    for (let n = 0; n < line.length; n++) {
      const p = globeRotate(line[n], cr, sr, ct, st);

      if (p[2] > 0.01) {
        const sx = cx + p[0] * R;
        const sy = cy - p[1] * R;

        if (pen) {
          ctx.lineTo(sx, sy);
        } else {
          ctx.moveTo(sx, sy);
          pen = true;
        }
      } else {
        pen = false;
      }
    }

    ctx.stroke();
  };

  ctx.strokeStyle = "rgba(120, 170, 255, 0.13)";
  ctx.lineWidth = dpr * 0.8;

  for (let n = 0; n < data.grid.length; n++) {
    strokeLine(data.grid[n]);
  }

  /* LAND DOTS */

  const land = data.land;

  ctx.fillStyle = "rgb(135, 198, 255)";

  for (let n = 0; n < land.length; n += 3) {
    const x0 = land[n];
    const y0 = land[n + 1];
    const z0 = land[n + 2];

    const x = x0 * cr + z0 * sr;
    const zr = z0 * cr - x0 * sr;
    const z = y0 * st + zr * ct;

    if (z <= 0.04) continue;

    const y = y0 * ct - zr * st;
    const d = dpr * (1.0 + 1.1 * z);

    ctx.globalAlpha = 0.16 + 0.84 * z;
    ctx.fillRect(cx + x * R - d / 2, cy - y * R - d / 2, d, d);
  }

  ctx.globalAlpha = 1;

  /* CONNECTION ARCS */

  ctx.strokeStyle = "rgba(110, 215, 255, 0.55)";
  ctx.lineWidth = dpr * 1.1;

  for (let r = 0; r < data.routes.length; r++) {
    strokeLine(data.routes[r]);
  }

  /* TRAVELLING PULSES */

  for (let r = 0; r < data.routes.length; r++) {
    const line = data.routes[r];
    const p = (time / 4200 + r * 0.17) % 1;
    const f = p * GLOBE_ARC_STEPS;
    const i0 = Math.floor(f);
    const i1 = Math.min(i0 + 1, GLOBE_ARC_STEPS);
    const w = f - i0;

    const a = line[i0];
    const b = line[i1];

    const v = [
      a[0] + (b[0] - a[0]) * w,
      a[1] + (b[1] - a[1]) * w,
      a[2] + (b[2] - a[2]) * w,
    ];

    const q = globeRotate(v, cr, sr, ct, st);

    if (q[2] > 0.04) {
      const sx = cx + q[0] * R;
      const sy = cy - q[1] * R;

      ctx.fillStyle = "rgba(120, 225, 255, 0.28)";
      ctx.beginPath();
      ctx.arc(sx, sy, dpr * 5, 0, TWO_PI);
      ctx.fill();

      ctx.fillStyle = "#e6fbff";
      ctx.beginPath();
      ctx.arc(sx, sy, dpr * 1.9, 0, TWO_PI);
      ctx.fill();
    }
  }

  /* CITY NODES */

  for (let c = 0; c < data.cities.length; c++) {
    const q = globeRotate(data.cities[c], cr, sr, ct, st);

    if (q[2] <= 0.05) continue;

    const sx = cx + q[0] * R;
    const sy = cy - q[1] * R;

    const ph = (time / 1800 + c * 0.31) % 1;

    ctx.strokeStyle = `rgba(120, 225, 255, ${0.5 * (1 - ph)})`;
    ctx.lineWidth = dpr * 1.2;
    ctx.beginPath();
    ctx.arc(sx, sy, dpr * (3 + 9 * ph), 0, TWO_PI);
    ctx.stroke();

    ctx.fillStyle = "rgba(120, 225, 255, 0.35)";
    ctx.beginPath();
    ctx.arc(sx, sy, dpr * 4.5, 0, TWO_PI);
    ctx.fill();

    ctx.fillStyle = "#b8f3ff";
    ctx.beginPath();
    ctx.arc(sx, sy, dpr * 2.3, 0, TWO_PI);
    ctx.fill();
  }
}


/* =====================================================
   BANNER GLOBE (CANVAS)
===================================================== */

function BannerGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");

    if (!ctx) return undefined;

    const reduceMotion =
      window.matchMedia &&
      window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .matches;

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    let rotation = GLOBE_START_ROT;
    let last = 0;
    let frame = 0;
    let running = false;

    const paint = (now) => {
      const px = Math.round(canvas.clientWidth * dpr);

      if (px <= 0) return;

      if (canvas.width !== px) {
        canvas.width = px;
        canvas.height = px;
      }

      drawGlobe(ctx, px, dpr, rotation, now);
    };

    const tick = (now) => {
      if (!last) last = now;

      rotation += (now - last) * GLOBE_SPEED;
      last = now;

      paint(now);

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduceMotion) return;

      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    paint(0);

    let observer = null;

    if (!reduceMotion && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            start();
          } else {
            stop();
          }
        },
        { threshold: 0 }
      );

      observer.observe(canvas);
    } else {
      start();
    }

    const onResize = () => paint(performance.now());

    window.addEventListener("resize", onResize);

    return () => {
      stop();

      if (observer) observer.disconnect();

      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="kk-banner-globe-canvas"
      aria-hidden="true"
    />
  );
}

/* =====================================================
   BANNER ICON
===================================================== */

function BannerIcon({ type }) {
  const svgProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "cube") {
    return (
      <svg {...svgProps}>
        <path d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5z" />
        <path d="M4 7l8 4.5L20 7" />
        <path d="M12 11.5v10" />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg {...svgProps}>
        <path d="M4 20V12" />
        <path d="M10 20V5" />
        <path d="M16 20V9" />
        <path d="M21 20H3" />
      </svg>
    );
  }

  if (type === "gear") {
    return (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }

  return (
    <svg {...svgProps}>
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      <path d="M16 3.5a4 4 0 0 1 0 7.5" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.8" />
    </svg>
  );
}

/* =====================================================
   INDUSTRY PAGE
===================================================== */

function Industry() {
  const [bannerRef, bannerVisible] =
    useScrollReveal({
      threshold: 0.08,
      rootMargin: "0px",
    });

  const [headingRef, headingVisible] =
    useScrollReveal({
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    });

  const [
    focusContentRef,
    focusContentVisible,
  ] = useScrollReveal({
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px",
  });

  const [
    focusVisualRef,
    focusVisualVisible,
  ] = useScrollReveal({
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px",
  });

 

  /* =====================================================
     INDUSTRY BANNER DATA
  ===================================================== */

  const [industryBanner, setIndustryBanner] =
    useState(null);

  /* =====================================================
     FETCH INDUSTRY BANNER FROM AWS
  ===================================================== */

  useEffect(() => {
    if (!USE_BANNER_API_DESCRIPTION) return;

    const fetchIndustryBanner = async () => {
      try {
        const response = await fetch(
          INDUSTRY_BANNER_API
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch Industry Banner: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "Industry Banner API:",
          data
        );

        const banner = Array.isArray(data)
          ? data.find(
              (item) =>
                item.category === "Banner"
            )
          : null;

        setIndustryBanner(
          banner || null
        );
      } catch (error) {
        console.error(
          "Industry Banner Error:",
          error
        );

        setIndustryBanner(null);
      }
    };

    fetchIndustryBanner();
  }, []);

  const bannerDescription =
    USE_BANNER_API_DESCRIPTION &&
    industryBanner?.description
      ? industryBanner.description
      : BANNER_DEFAULT_DESCRIPTION;

  return (
    <main className="kk-industry-page">

      {/* =================================================
          BANNER
      ================================================= */}

      <section
        ref={bannerRef}
        className={`kk-industry-banner ${
          bannerVisible
            ? "is-visible"
            : ""
        }`}
      >

        {/* BACKGROUND DECORATION */}

        <div
          className="kk-banner-bg"
          aria-hidden="true"
        >
          <div className="kk-banner-grid"></div>
          <div className="kk-banner-glow"></div>
          <div className="kk-banner-globe">
            <BannerGlobe />
          </div>
        </div>


        <div className="kk-industry-container">

          <div className="kk-industry-banner-inner">

            {/* LEFT CONTENT */}

            <div className="kk-industry-content">

              <div className="kk-industry-banner-badge">
                Our Industries
              </div>

              <h1>
                Solutions for Every{" "}
                <span>Industry</span>{" "}
                &amp; Every{" "}
                <span>Challenge</span>
              </h1>

              <p>
                {bannerDescription}
              </p>

              <Link
                to="/start-a-project"
                className="kk-industry-banner-button"
              >
                <span>
                  Explore Industries
                </span>

                <span className="kk-banner-arrow">
                  →
                </span>
              </Link>

            </div>


            {/* RIGHT GLASS CARD */}

            <div className="kk-banner-card">

              <div className="kk-banner-card-header">

                <div className="kk-banner-card-logo">
                  <BannerIcon type="cube" />
                </div>

                <div className="kk-banner-card-heading">
                  <h2>
                    Industry Solutions
                  </h2>

                  <p>
                    Built for Real Business Impact
                  </p>
                </div>

              </div>


              {BANNER_POINTS.map(
                (point) => (
                  <div
                    key={point.title}
                    className="kk-banner-point"
                  >
                    <div className="kk-banner-point-icon">
                      <BannerIcon type={point.icon} />
                    </div>

                    <div className="kk-banner-point-text">
                      <h3>
                        {point.title}
                      </h3>

                      <p>
                        {point.description}
                      </p>
                    </div>

                    <span className="kk-banner-point-arrow">
                      ›
                    </span>
                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </section>



      {/* =================================================
          INDUSTRIES
      ================================================= */}

      <section className="kk-industries-section">

        <div className="kk-industries-container">

          <IndustryDefs />

          <div
            ref={headingRef}
            className={`kk-industries-heading kk-reveal ${
              headingVisible
                ? "is-visible"
                : ""
            }`}
          >

            <div className="kk-industries-badge">
              Industries We Serve
            </div>

            <h2>
              The Industries{" "}
              <span>We Build For</span>
            </h2>

            <div className="kk-industries-divider">
              <span></span>
            </div>

            <p>
              Deep domain knowledge, production-grade
              engineering, and teams that scale with
              your delivery timeline.
            </p>

          </div>


          <div className="kk-industries-grid">

            {INDUSTRIES.map(
              (industry, index) => (
                <IndustryCard
                  key={industry.title}
                  industry={industry}
                  index={index}
                />
              )
            )}

          </div>

        </div>

      </section>


      {/* =================================================
          INDUSTRY FOCUSED TECHNOLOGY  (BUSINESS IMPACT)
      ================================================= */}

      <section className="kk-industry-focus">

        <div className="kk-industry-focus-container">

          {/* LEFT */}

          <div
            ref={focusContentRef}
            className={`kk-focus-content kk-reveal ${
              focusContentVisible
                ? "is-visible"
                : ""
            }`}
          >

            <div className="kk-focus-badge">
              Business Impact
            </div>

            <h2>
              What A Well-Built Industry Platform
              Actually Does For{" "}
              <span>Your Business</span>
            </h2>

            <div className="kk-focus-intro">
              Every industry has its own workflows,
              challenges, compliance requirements, and
              customer expectations. At Kaden Kopper
              Technology, we build industry-focused
              solutions that align with your processes,
              integrate with your ecosystem, and deliver
              measurable business impact.
            </div>

            <p>
              Our industry expertise helps you launch
              faster, reduce costs, improve user adoption,
              and achieve long-term growth.
            </p>

            {/* CLIENT ENGAGEMENT */}

            <div className="kk-project-stat">

              <div className="kk-project-icon">
                <BannerIcon type="users" />
              </div>

              <div className="kk-project-stat-content">
                <strong>180+</strong>

                <h3>Client Engagements</h3>

                <p>
                  Delivering industry-focused software
                  and digital solutions across multiple
                  industries.
                </p>
              </div>

            </div>

          </div>


          {/* RIGHT CARD */}

          <div
            ref={focusVisualRef}
            className={`kk-focus-visual kk-reveal ${
              focusVisualVisible
                ? "is-visible"
                : ""
            }`}
          >

            <h3 className="kk-focus-visual-title">
              What A Well-Built Industry Platform
              Actually Does For{" "}
              <span>Your Business</span>
            </h3>

            <div className="kk-fd">

              {/* TOP LEFT */}

              <div className="kk-fd-point kk-fd-point--tl">
                <div className="kk-fd-icon">
                  <FocusIcon type="shield" />
                </div>
                <h4>Fewer architecture reworks</h4>
                <p>
                  Compliance, scalability, and data
                  requirements are considered from the
                  beginning.
                </p>
              </div>

              {/* TOP RIGHT */}

              <div className="kk-fd-point kk-fd-point--tr">
                <div className="kk-fd-icon">
                  <FocusIcon type="user" />
                </div>
                <h4>Faster user adoption</h4>
                <p>
                  Solutions are designed around the
                  workflows your teams already
                  understand.
                </p>
              </div>

              {/* BOTTOM LEFT */}

              <div className="kk-fd-point kk-fd-point--bl">
                <div className="kk-fd-icon">
                  <FocusIcon type="layers" />
                </div>
                <h4>Lower integration costs</h4>
                <p>
                  Third-party systems and
                  industry-specific integrations are
                  considered during planning.
                </p>
              </div>

              {/* BOTTOM RIGHT */}

              <div className="kk-fd-point kk-fd-point--br">
                <div className="kk-fd-icon">
                  <FocusIcon type="shield" />
                </div>
                <h4>Fewer surprises in QA</h4>
                <p>
                  Industry-specific requirements are
                  identified before development reaches
                  production.
                </p>
              </div>

              {/* CENTER STACK + CONNECTORS */}

              <div
                className="kk-fd-center"
                aria-hidden="true"
              >

                <span className="kk-fd-line kk-fd-line--tl"></span>
                <span className="kk-fd-line kk-fd-line--tr"></span>
                <span className="kk-fd-line kk-fd-line--bl"></span>
                <span className="kk-fd-line kk-fd-line--br"></span>

                <div className="kk-fd-stack">
                  <span className="kk-fd-layer kk-fd-layer--bottom"></span>
                  <span className="kk-fd-layer kk-fd-layer--middle"></span>
                  <span className="kk-fd-layer kk-fd-layer--top"></span>

                  <div className="kk-fd-hub">
                    <BannerIcon type="gear" />
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


    </main>
  );
}

export default Industry;