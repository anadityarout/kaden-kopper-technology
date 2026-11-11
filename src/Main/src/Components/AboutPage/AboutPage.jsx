import React, { useState, useEffect, useRef } from "react";
import "./AboutPage.css";

const ABOUT_SLIDER_API =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/aboutslider";

// =====================================================
// ROTATING DOTTED GLOBE (canvas)
// =====================================================

function Globe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Evenly spread points on a sphere (Fibonacci sphere)
    const POINTS = 1300;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = [];

    for (let i = 0; i < POINTS; i++) {
      const y = 1 - (i / (POINTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }

    const TILT = 0.38;
    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let size = 0;
    let dpr = 1;
    let angle = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = rect.width;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    resize();

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(resize)
        : null;
    if (ro) ro.observe(canvas);

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const c = size / 2;
      const R = size * 0.46;

      // soft sphere body
      const body = ctx.createRadialGradient(
        c - R * 0.35,
        c - R * 0.35,
        R * 0.1,
        c,
        c,
        R
      );
      body.addColorStop(0, "rgba(60,140,255,0.28)");
      body.addColorStop(0.7, "rgba(15,60,190,0.14)");
      body.addColorStop(1, "rgba(5,25,100,0.04)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fill();

      // glowing rim
      ctx.strokeStyle = "rgba(90,180,255,0.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.stroke();

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const dotBase = Math.max(size / 520, 0.55);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // rotate around Y axis (spin)
        const x1 = p[0] * cosA + p[2] * sinA;
        const z1 = -p[0] * sinA + p[2] * cosA;

        // tilt around X axis
        const y2 = p[1] * cosT - z1 * sinT;
        const z2 = p[1] * sinT + z1 * cosT;

        const depth = (z2 + 1) / 2; // 0 (back) -> 1 (front)
        const alpha = 0.12 + 0.88 * depth;
        const radius = (0.7 + 1.5 * depth) * dotBase;

        ctx.fillStyle =
          depth > 0.55
            ? `rgba(120,215,255,${alpha})`
            : `rgba(70,140,255,${alpha})`;

        ctx.beginPath();
        ctx.arc(c + x1 * R, c + y2 * R, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      angle += 0.0045;

      if (!reduceMotion) {
        raf = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <div className="about-hero-globe" aria-hidden="true">
      <canvas ref={canvasRef} className="about-hero-globe-canvas" />

      <svg
        className="about-hero-orbit"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="50"
          cy="50"
          rx="49"
          ry="21"
          stroke="rgba(34,211,238,0.75)"
          strokeWidth="0.35"
        />
        <circle r="1.4" fill="#7ff3ff">
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            path="M1,50 a49,21 0 1,0 98,0 a49,21 0 1,0 -98,0"
          />
        </circle>
        <circle r="0.9" fill="#22d3ee">
          <animateMotion
            dur="9s"
            begin="-4.5s"
            repeatCount="indefinite"
            path="M1,50 a49,21 0 1,0 98,0 a49,21 0 1,0 -98,0"
          />
        </circle>
      </svg>
    </div>
  );
}

export default function AboutPage() {
  // =====================================================
  // AWS ABOUT SLIDER DATA
  // =====================================================

  const [storyImageUrl, setStoryImageUrl] = useState(null);
  const [founderImageUrl, setFounderImageUrl] = useState(null);
  const [cultureImages, setCultureImages] = useState([null, null, null, null]);

  // Team members come ONLY from Admin Dashboard
  const [teamMembers, setTeamMembers] = useState([]);

  const teamTrackRef = useRef(null);

  // =====================================================
  // GET IMAGE URL
  // =====================================================

  const getImageUrl = (item) => {
    if (!item) return null;

    return item.preview || item.imageUrl || item.image || item.fileUrl || null;
  };

  // =====================================================
  // LOAD ABOUT SLIDER FROM AWS
  // =====================================================

  useEffect(() => {
    const loadAboutSlider = async () => {
      try {
        const response = await fetch(ABOUT_SLIDER_API);

        if (!response.ok) {
          throw new Error("Failed to load About Slider data.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          return;
        }

        console.log("About Slider AWS Data:", data);

        // OUR STORY
        const storyItems = data.filter((item) => item.category === "Our Story");
        setStoryImageUrl(
          storyItems.length > 0 ? getImageUrl(storyItems[0]) : null
        );

        // FOUNDER
        const founderItems = data.filter((item) => item.category === "Founder");
        setFounderImageUrl(
          founderItems.length > 0 ? getImageUrl(founderItems[0]) : null
        );

        // LIFE AT KADEN KOPPER
        const cultureItems = data.filter(
          (item) => item.category === "Life at Kaden Kopper"
        );

        const cultureUrls = cultureItems
          .slice(0, 4)
          .map((item) => getImageUrl(item));

        while (cultureUrls.length < 4) {
          cultureUrls.push(null);
        }

        setCultureImages(cultureUrls);

        // OUR TEAM (Admin Dashboard only)
        const teamItems = data.filter((item) => item.category === "Our Team");

        setTeamMembers(
          teamItems.map((item) => ({
            image: getImageUrl(item),
            name: item.name || "",
            role: item.description || "",
          }))
        );
      } catch (error) {
        console.error("About Slider API Error:", error);

        setStoryImageUrl(null);
        setFounderImageUrl(null);
        setCultureImages([null, null, null, null]);
        setTeamMembers([]);
      }
    };

    loadAboutSlider();
  }, []);

  // =====================================================
  // HERO CARD ITEMS
  // =====================================================

  const heroItems = [
    {
      title: "People & Talent",
      text: "Empowering exceptional teams",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="3" fill="currentColor" />
          <circle cx="5.5" cy="9.5" r="2.2" fill="currentColor" />
          <circle cx="18.5" cy="9.5" r="2.2" fill="currentColor" />
          <path d="M6.5 19c0-3.2 2.5-5 5.5-5s5.5 1.8 5.5 5z" fill="currentColor" />
          <path d="M1.5 18c0-2.3 1.7-3.8 4-3.8 .8 0 1.5.2 2.1.5-1 .9-1.6 2.100-1.800 3.300zM22.500 18c0-2.300-1.700-3.800-4-3.800-.8 0-1.500.2-2.100.5 1 .9 1.600 2.100 1.800 3.300z" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: "Technology Solutions",
      text: "Innovative and scalable digital solutions",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Innovation",
      text: "Driven by ideas and excellence",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.500 4.500c2.800-1.400 5-1.300 5-1.300s.1 2.200-1.300 5l-5.200 5.200-3.700-3.700z" fill="currentColor" />
          <path d="M8.800 10.500 6 10.800 4 13.500l3.500.5M13.500 15.200l-.3 2.800-2.700 2-.5-3.500" stroke="currentColor" strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 18c-.2 1.200-.7 2-1.800 2.200C4.400 19 4.800 18.300 6 18z" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: "Partnership",
      text: "Building long-term success together",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 9l4-2 4 1.500 3-1.500 5 2 4-1v6l-3 2-3 3-3-1-2 1-3-2-4-2z" stroke="currentColor" strokeWidth="1.800" strokeLinejoin="round" />
          <path d="M9 13l2.500 2.500M12 11.500l3 3" stroke="currentColor" strokeWidth="1.800" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  // =====================================================
  // CULTURE CARDS
  // =====================================================

  const cultureCards = [
    {
      title: "Collaborative Environment",
      text: "Teamwork and open communication are at the heart of what we do.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
          <path d="M3 20c0-3 2.700-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="17" cy="9" r="2.500" stroke="currentColor" strokeWidth="2" />
          <path d="M15.500 20c.3-2.300 2-4 4.500-4.400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Learning & Growth",
      text: "We encourage continuous learning and professional development.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6c-1.800-1.300-4-2-6.500-2v13c2.500 0 4.700.7 6.500 2M12 6c1.800-1.300 4-2 6.500-2v13c-2.500 0-4.700.7-6.500 2M12 6v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Work-Life Balance",
      text: "We respect balance and celebrate life beyond the desk.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3v3M12 3l-6 3.500M12 3l6 3.500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 6.500h6M3 6.500l-2 4.500a3 3 0 0 0 6 0l-2-4.500zM15 6.500h6M15 6.500l-2 4.500a3 3 0 0 0 6 0l-2-4.500z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 19h12M9 15v4M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Fun & Togetherness",
      text: "From team outings to celebrations, we enjoy the journey together.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M8 14s1.500 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2.400" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  // =====================================================
  // ACHIEVEMENTS
  // =====================================================

  const achievementCards = [
    {
      title: "ISO 9001 Certified",
      text: "Recognized for maintaining world-class quality management standards and delivering consistent excellence.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12.500l2.500 2.500L16 9.500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Innovation Award",
      text: "Honoured for delivering innovative technology solutions that transformed business operations for our clients.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3l1.500 4.500L18 9l-4.500 1.500L12 15l-1.500-4.500L6 9l4.500-1.500L12 3z" fill="currentColor" />
          <path d="M18 15l.7 2.100L21 18l-2.300.9L18 21l-.7-2.100L15 18l2.300-.9L18 15z" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: "Best Workplace",
      text: "Recognized for building a collaborative workplace that values creativity, growth and employee well-being.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
          <path d="M3 20c0-3 2.700-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="17" cy="9" r="2.500" stroke="currentColor" strokeWidth="2" />
          <path d="M15.500 20c.3-2.300 2-4 4.500-4.400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "500+ Projects Delivered",
      text: "Successfully completed hundreds of residential, commercial and custom interior projects with outstanding client satisfaction.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 16l5-5 3 3 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 6h4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Trusted Quality",
      text: "Every project is completed with strict quality standards, premium materials and expert kraftsmanship.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3l7 3v5c0 4.500-3 8-7 10-4-2-7-5.500-7-10V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Customer Satisfaction",
      text: "Our long-term relationships and repeat customers reflect our commitment to delivering exceptional value and service.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v10M9.500 9.300c0-1.300 1.100-2.300 2.500-2.300s2.500 1 2.500 2.100c0 2.400-5 1.900-5 4.300 0 1.200 1.100 2.100 2.500 2.100s2.500-1 2.500-2.300" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  // =====================================================
  // STATS (4 items, gradient bar, no icons)
  // =====================================================

  const statsData = [
    { value: 250, suffix: "+", label: "Projects Completed" },
    { value: 120, suffix: "+", label: "Happy Clients" },
    { value: 50, suffix: "+", label: "Team Members" },
    { value: 15, suffix: "+", label: "Years Experience" },
  ];

  const [statCounts, setStatCounts] = useState(() => statsData.map(() => 0));

  const statsRef = useRef(null);
  const statsAnimated = useRef(false);

  // =====================================================
  // STATS ANIMATION
  // =====================================================

  useEffect(() => {
    const STATS_DURATION_MS = 10000;

    const node = statsRef.current;

    if (!node) return;

    const runCountUp = () => {
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / STATS_DURATION_MS, 1);

        setStatCounts(
          statsData.map((stat) => Math.round(stat.value * progress))
        );

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated.current) {
            statsAnimated.current = true;
            runCountUp();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================================
  // TEAM SCROLL
  // =====================================================

  const scrollTeam = (direction) => {
    const node = teamTrackRef.current;

    if (!node) return;

    const card = node.querySelector(".about-team-card");

    const amount = card
      ? card.getBoundingClientRect().width + 24
      : node.clientWidth * 0.8;

    node.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  };

  // =====================================================
  // SCROLL TO SECTION (hero buttons)
  // =====================================================

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="about-page">
      {/* =================================================
          ABOUT HERO
      ================================================= */}

      <section className="about-hero">
        <div className="about-hero-glow about-hero-glow-1" aria-hidden="true" />
        <div className="about-hero-glow about-hero-glow-2" aria-hidden="true" />

        <div className="about-hero-inner">
          {/* LEFT */}

          <div className="about-hero-left">
            <span className="about-hero-badge">ABOUT US</span>

            <h1 className="about-hero-title">
              <span className="about-hero-line">Building People,</span>
              <span className="about-hero-line">
                <span className="about-hero-cyan">Technology</span>{" "}
                <span className="about-hero-soft">&amp;</span>
              </span>
              <span className="about-hero-line">
                Business <span className="about-hero-violet">Success</span>
              </span>
            </h1>

            <p className="about-hero-text">
              Kaden Koppers Technology combines people, technology, and
              strategic thinking to help businesses grow, transform, and build
              for the future.
            </p>

            <div className="about-hero-actions">
              <button
                type="button"
                className="about-hero-btn about-hero-btn-primary"
                onClick={() => scrollToSection("about-story")}
              >
                Explore Our Story
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                type="button"
                className="about-hero-btn about-hero-btn-outline"
                onClick={() => scrollToSection("about-team")}
              >
                Meet Our Team
              </button>
            </div>
          </div>

          {/* RIGHT */}

          <div className="about-hero-right">
            <Globe />

            <div className="about-hero-card">
              <div className="about-hero-brand">
                <svg
                  className="about-hero-logo"
                  viewBox="0 0 48 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 2l19 11v26L24 50 5 39V13L24 2z" fill="url(#hexg)" />
                  <path d="M24 12l11 6.500v13L24 38l-11-6.500v-13L24 12z" fill="#0a2a7a" />
                  <path d="M24 18l6 3.500v7L24 32l-6-3.500v-7L24 18z" fill="#22d3ee" />
                  <defs>
                    <linearGradient id="hexg" x1="5" y1="2" x2="43" y2="50">
                      <stop stopColor="#22d3ee" />
                      <stop offset="1" stopColor="#2b5cff" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="about-hero-brand-text">
                  <span className="about-hero-brand-name">KADEN KOPPERS</span>
                  <span className="about-hero-brand-sub">TECHNOLOGY</span>
                </div>
              </div>

              <div className="about-hero-list">
                {heroItems.map((item) => (
                  <div className="about-hero-item" key={item.title}>
                    <span className="about-hero-item-icon" aria-hidden="true">
                      {item.icon}
                    </span>

                    <div className="about-hero-item-text">
                      <span className="about-hero-item-title">{item.title}</span>
                      <span className="about-hero-item-desc">{item.text}</span>
                    </div>

                    <svg
                      className="about-hero-item-arrow"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          OUR STORY
      ================================================= */}

      <section className="about-story" id="about-story">
        <div className="about-story-heading-wrap">
          <h2 className="about-story-title">Our Story</h2>
          <span className="about-story-title-underline" aria-hidden="true" />
        </div>

        <div className="about-story-inner">
          <div className="about-story-text">
            <span className="about-story-badge">
              Transforming Businesses Since 2014
            </span>

            <h3 className="about-story-heading">
              Building Tomorrow's Solutions Today
            </h3>

            <p className="about-story-para">
              Founded with a vision to revolutionize the technology landscape,
              we've been at the forefront of digital innovation since our
              inception.
            </p>

            <p className="about-story-para">
              Our journey has been marked by continuous learning, adaptation,
              and an unwavering commitment to excellence.
            </p>

            <p className="about-story-para">
              Today, we stand as a trusted partner for businesses seeking to
              leverage technology for growth and innovation.
            </p>

            <ul className="about-story-checklist">
              <li>Proven Track Record</li>
              <li>Global Reach</li>
              <li>Innovation Driven</li>
            </ul>
          </div>

          <div className="about-story-media">
            <div className="about-story-media-shadow" aria-hidden="true" />

            {storyImageUrl ? (
              <img src={storyImageUrl} alt="Our Story" className="about-story-img" />
            ) : (
              <div className="about-story-img-fallback">
                <span>Image will appear here once uploaded</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          MISSION & VISION
      ================================================= */}

      <section className="about-mv">
        <div className="about-mv-heading-wrap">
          <h2 className="about-mv-title">Our Mission &amp; Vision</h2>
          <span className="about-mv-title-underline" aria-hidden="true" />
        </div>

        <div className="about-mv-grid">
          <div className="about-mv-card about-mv-card-mission">
            <span className="about-mv-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
              </svg>
            </span>

            <h3 className="about-mv-card-title">Our Mission</h3>
            <span className="about-mv-card-underline" aria-hidden="true" />

            <p className="about-mv-card-text">
              To empower businesses with innovative technology solutions that
              drive growth, efficiency, and competitive advantage. We strive to
              be a catalyst for digital transformation, enabling our clients to
              thrive in the modern business landscape through cutting-edge
              software, strategic consulting, and exceptional service.
            </p>
          </div>

          <div className="about-mv-card about-mv-card-vision">
            <span className="about-mv-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>

            <h3 className="about-mv-card-title">Our Vision</h3>
            <span className="about-mv-card-underline" aria-hidden="true" />

            <p className="about-mv-card-text">
              To be a global leader in technology solutions, recognized for our
              innovation, reliability, and customer-centric approach. We
              envision a future where every business can harness the power of
              technology to achieve sustainable growth.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          CORE VALUES
      ================================================= */}

      <section className="about-values">
        <div className="about-values-heading-wrap">
          <h2 className="about-values-title">Core Values</h2>
          <span className="about-values-title-underline" aria-hidden="true" />
        </div>

        <div className="about-values-grid">
          <div className="about-values-card">
            <span className="about-values-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12.500l2.500 2.500L16 9.500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="about-values-card-title">Integrity</h3>
            <p className="about-values-card-text">
              We operate with transparency, honesty and ethical principles in
              everything we do.
            </p>
          </div>

          <div className="about-values-card">
            <span className="about-values-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.500 10.900c.5.4.8.9.8 1.600h5.400c0-.7.3-1.200.8-1.600A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="about-values-card-title">Innovation</h3>
            <p className="about-values-card-text">
              We continuously explore new technologies and creative solutions to
              solve complex business challenges.
            </p>
          </div>

          <div className="about-values-card">
            <span className="about-values-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
                <path d="M3 20c0-3 2.700-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="17" cy="9" r="2.500" stroke="currentColor" strokeWidth="2" />
                <path d="M15.500 20c.3-2.300 2-4 4.500-4.400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <h3 className="about-values-card-title">Collaboration</h3>
            <p className="about-values-card-text">
              We believe in teamwork and building long-term partnerships with
              our clients.
            </p>
          </div>

          <div className="about-values-card">
            <span className="about-values-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
              </svg>
            </span>
            <h3 className="about-values-card-title">Excellence</h3>
            <p className="about-values-card-text">
              We are committed to delivering the highest quality services with
              complete customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          FOUNDER'S VISION
      ================================================= */}

      <section className="about-founder">
        <h2 className="about-founder-title">Founder's Vision</h2>

        <div className="about-founder-inner">
          <div className="about-founder-media">
            {founderImageUrl ? (
              <img src={founderImageUrl} alt="Founder" className="about-founder-img" />
            ) : (
              <div className="about-founder-img-fallback">
                <span>Image will appear here once uploaded</span>
              </div>
            )}

            <div className="about-founder-badge">
              <span className="about-founder-badge-name">Vinay Gupta</span>
              <span className="about-founder-badge-role">Founder &amp; CEO</span>
            </div>
          </div>

          <div className="about-founder-text">
            <span className="about-founder-pill">
              15+ Years of Innovation Leadership
            </span>

            <h3 className="about-founder-heading">
              Pioneering Digital Transformation Through Visionary Leadership
            </h3>

            <p className="about-founder-para">
              Vinay Gupta, Founder &amp; CEO of Kaden Kopper Technology, leads the
              company with a vision to transform ordinary spaces into remarkable
              destinations. With extensive experience in construction,
              architecture and project execution, he has built Kaden Kopper technology
              around innovation, quality craftsmanship and customer-focused
              design.
            </p>

            <p className="about-founder-para">
              Under his leadership, Kaden Kopper Technology has developed expertise in
              fiber-based banquet halls, wedding resorts, architectural
              structures, interiors, exteriors and customized spaces. The
              company combines creative design with advanced fiber solutions and
              professional construction expertise to deliver distinctive
              projects.
            </p>

            <p className="about-founder-para">
              His vision is to create spaces that are not only visually
              impressive but also functional, durable and memorable. With a
              strong focus on quality, innovation and client satisfaction, Vinay
              Gupta and his team continue to turn unique ideas into beautifully
              crafted spaces.
            </p>

            <div className="about-founder-mini-grid">
              <div className="about-founder-mini-card">
                <h4 className="about-founder-mini-title">Leadership Philosophy</h4>
                <p className="about-founder-mini-text">
                  Innovation, Integrity &amp; Impact
                </p>
              </div>

              <div className="about-founder-mini-card">
                <h4 className="about-founder-mini-title">Core Focus</h4>
                <p className="about-founder-mini-text">
                  Client Success &amp; Technology Excellence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CULTURE
      ================================================= */}

      <section className="about-culture">
        <span className="about-culture-label">
          Life at Kaden Kopper Technology
        </span>

        <h2 className="about-culture-title">
          More Than a Workplace, It's a Culture
        </h2>

        <p className="about-culture-subtext">
          We believe in creating an environment where ideas flow, people grow,
          and innovation thrives. Here, every voice matters and every
          contribution counts.
        </p>

        <div className="about-culture-grid">
          {cultureCards.map((card, index) => (
            <div className="about-culture-card" key={card.title}>
              <div className="about-culture-media">
                {cultureImages[index] ? (
                  <img
                    src={cultureImages[index]}
                    alt={card.title}
                    className="about-culture-img"
                  />
                ) : (
                  <div className="about-culture-img-fallback">
                    <span>Image will appear here once uploaded</span>
                  </div>
                )}

                <span className="about-culture-icon" aria-hidden="true">
                  {card.icon}
                </span>
              </div>

              <h3 className="about-culture-card-title">{card.title}</h3>
              <p className="about-culture-card-text">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          ACHIEVEMENTS
      ================================================= */}

      <section className="about-achievements">
        <h2 className="about-achievements-title">Our Achievements</h2>

        <div className="about-achievements-grid">
          {achievementCards.map((card) => (
            <div className="about-achievements-card" key={card.title}>
              <span className="about-achievements-icon" aria-hidden="true">
                {card.icon}
              </span>

              <h3 className="about-achievements-card-title">{card.title}</h3>
              <p className="about-achievements-card-text">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          STATS BAR (gradient, 4 items, no icons)
      ================================================= */}

      <section className="about-stats-wrap">
        <div className="about-stats-bar" ref={statsRef}>
          {statsData.map((stat, index) => (
            <div className="about-stats-item" key={stat.label}>
              <span className="about-stats-value">
                {statCounts[index]}
                {stat.suffix}
              </span>

              <span className="about-stats-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      
      {/* =================================================
          CTA
      ================================================= */}

      <section className="about-cta-wrap">
        <div className="about-cta-card">
          <h2 className="about-cta-title">
            Build Your Dream Space with Kaden Kopper Technology
          </h2>

          <p className="about-cta-subtext">
            Whether you're planning a modern home, elegant office, commercial
            workspace, or custom interiors, our experienced team is ready to
            bring your vision to life with exceptional craftsmanship and premium
            quality.
          </p>

          <div className="about-cta-pills">
            <span className="about-cta-pill">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3l7 3v5c0 4.500-3 8-7 10-4-2-7-5.500-7-10V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              Premium Quality Materials
            </span>

            <span className="about-cta-pill">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              On-Time Project Delivery
            </span>
          </div>

          <div className="about-cta-buttons">
            <button type="button" className="about-cta-btn about-cta-btn-dark">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Book a Free Consultation
            </button>

            <button type="button" className="about-cta-btn about-cta-btn-blue">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
              </svg>
              Request a Quote
            </button>

            <button type="button" className="about-cta-btn about-cta-btn-blue">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3h7l4 4v14H7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Contact Our Team
            </button>
          </div>

          <div className="about-cta-footnote">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>

            <span>
              Every project includes professional planning, dedicated project
              management, transparent communication, and complete customer
              support from start to finish.
            </span>
          </div>
        </div>
      </section>

      {/* =================================================
          REST OF ABOUT PAGE CONTENT
      ================================================= */}

      <section className="about-content">
        {/* Additional About page content can remain here */}
      </section>
    </div>
  );
}
