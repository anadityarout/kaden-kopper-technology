import { useEffect, useRef, useState } from "react";
import {
  Lightbulb,
  ShieldCheck,
  Users,
  Target,
  Eye,
  Briefcase,
  Star,
  Clock,
  User,
  ArrowRight,
} from "lucide-react";
import "./About.css";

/* ==========================================
   SETTINGS
========================================== */

// Home About API (the admin-uploaded description is read from here)
const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/homeabout";

// Where the "Learn More About Us" button goes. Set to "" to hide it.
const LEARN_MORE_URL = "/about";

const DEFAULT_DESCRIPTION =
  "We are a creative team of developers, designers, editors, and marketers who help brands grow in the digital era. We combine creativity, strategy, and technology to deliver impactful and result-driven solutions.";

const STATS_ANIMATION_DURATION_MS = 2000;

/* ==========================================
   ICONS
========================================== */

function BarsIcon({ size = 24, strokeWidth = 1.7 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="14" width="4" height="6" rx="1" />
      <rect x="10" y="9" width="4" height="11" rx="1" />
      <rect x="17" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

/* ==========================================
   DATA
========================================== */

const FEATURES = [
  {
    Icon: Lightbulb,
    title: "Creative Ideas",
    text: "Unique ideas that make your brand stand out.",
  },
  {
    Icon: ShieldCheck,
    title: "Quality Work",
    text: "We deliver top-notch work on time.",
  },
  {
    Icon: Users,
    title: "Client Focused",
    text: "Our clients' success is always our priority.",
  },
  {
    Icon: BarsIcon,
    title: "Result Driven",
    text: "We focus on real results and long term growth.",
  },
];

const PILLARS = [
  {
    Icon: Target,
    title: "Our Mission",
    text: "To empower businesses with innovative digital solutions that create long-term value and help them achieve their goals.",
  },
  {
    Icon: Eye,
    title: "Our Vision",
    text: "To be a trusted technology partner, known for creativity, quality, and a commitment to building a smarter digital future.",
  },
];

const STATS = [
  { Icon: Users, value: 50, suffix: "+", label: "Happy Clients" },
  { Icon: Briefcase, value: 120, suffix: "+", label: "Projects Completed" },
  { Icon: Star, value: 98, suffix: "%", label: "Client Satisfaction" },
  { Icon: Clock, value: 5, suffix: "+", label: "Years Experience" },
  { Icon: User, value: 15, suffix: "+", label: "Team Members" },
];

/* ==========================================
   COUNT UP
========================================== */

function useCountUp(target, start, durationMs) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(eased * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [start, target, durationMs]);

  return value;
}

/* ==========================================
   STAT ITEM
========================================== */

function StatItem({ stat, start }) {
  const value = useCountUp(stat.value, start, STATS_ANIMATION_DURATION_MS);
  const { Icon } = stat;

  return (
    <div className="kk-stats__item">
      <span className="kk-stats__icon">
        <Icon size={26} strokeWidth={1.7} />
      </span>

      <div className="kk-stats__info">
        <span className="kk-stats__value">
          {value}
          {stat.suffix}
        </span>
        <span className="kk-stats__label">{stat.label}</span>
      </div>
    </div>
  );
}

/* ==========================================
   ABOUT COMPONENT
========================================== */

function About() {
  const statsRef = useRef(null);
  const [statsStart, setStatsStart] = useState(false);
  const [description, setDescription] = useState("");

  /* Load the latest admin-uploaded description */
  useEffect(() => {
    const controller = new AbortController();

    const loadHomeAbout = async () => {
      try {
        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error("Failed to load Home About data.");
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          // Last item = latest uploaded item
          const latestItem = data[data.length - 1];
          setDescription(String(latestItem?.description || "").trim());
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Home About API Error:", error);
        }
      }
    };

    loadHomeAbout();

    return () => controller.abort();
  }, []);

  /* Start the count-up when the stats bar scrolls into view */
  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="kk-about-wrap" id="about">
      {/* Decorative background shapes */}
      <span className="kk-decor kk-decor--ring" aria-hidden="true" />
      <span className="kk-decor kk-decor--dots-top" aria-hidden="true" />
      <span className="kk-decor kk-decor--dots-left" aria-hidden="true" />
      <span className="kk-decor kk-decor--dots-right" aria-hidden="true" />
      <span className="kk-decor kk-decor--orb" aria-hidden="true" />

      <div className="kk-about">
        {/* ============ LEFT ============ */}
        <div className="kk-about__content">
          <span className="kk-about__eyebrow">ABOUT US</span>

          <h2 className="kk-about__heading">
            <span className="kk-about__heading-top">We Are</span>
            <span className="kk-about__highlight">Kaden Kopper</span>{" "}
            Technology
          </h2>

          <p className="kk-about__text">
            {description || DEFAULT_DESCRIPTION}
          </p>

          <div className="kk-about__features">
            {FEATURES.map(({ Icon, title, text }) => (
              <div className="kk-about__feature" key={title}>
                <span className="kk-about__feature-icon">
                  <Icon size={24} strokeWidth={1.7} />
                </span>

                <div className="kk-about__feature-body">
                  <h3 className="kk-about__feature-title">{title}</h3>
                  <p className="kk-about__feature-text">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {LEARN_MORE_URL && (
            <a href={LEARN_MORE_URL} className="kk-about__btn">
              Learn More About Us <ArrowRight size={18} />
            </a>
          )}
        </div>

        {/* ============ RIGHT ============ */}
        <div className="kk-about__pillars">
          {PILLARS.map(({ Icon, title, text }) => (
            <div className="kk-about__pillar" key={title}>
              <span className="kk-about__pillar-icon">
                <Icon size={32} strokeWidth={1.7} />
              </span>

              <div className="kk-about__pillar-body">
                <h3 className="kk-about__pillar-title">{title}</h3>
                <p className="kk-about__pillar-text">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ STATS BAR ============ */}
      <div className="kk-stats" ref={statsRef}>
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} start={statsStart} />
        ))}
      </div>
    </section>
  );
}

export default About;
