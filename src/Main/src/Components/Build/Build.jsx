import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Bot,
  LayoutTemplate,
  Smartphone,
  CreditCard,
  Building2,
  Check,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Workflow,
  MonitorSmartphone,
  Search,
  Palette,
  Lock,
  FileCheck,
  Users,
  BarChart3,
} from "lucide-react";
import "./Build.css";

/* Where the "Explore ..." buttons go. Change per card with the `href` field. */
const DEFAULT_CTA_URL = "#contact";

const buildItems = [
  {
    id: "custom-software",
    tabLabel: "Custom Software",
    icon: Code2,
    art: "browser",
    iconTitle: "Custom Software",
    iconSubtitle: "Built for your business",
    chips: [
      { icon: ShieldCheck, label: "Scalable & Secure" },
      { icon: BadgeCheck, label: "Full Ownership" },
    ],
    eyebrow: "Software Solution",
    title: "Custom Software Development",
    description:
      "Full product builds from architecture to launch, engineered for your exact workflow.",
    features: [
      "Discovery and strategy",
      "Custom development",
      "Ongoing support",
      "Scalable backend systems",
      "Third-party integrations",
      "Long-term maintainability",
    ],
    cta: "Explore Custom Software",
    href: DEFAULT_CTA_URL,
    accent: "blue",
  },
  {
    id: "ai-automation",
    tabLabel: "AI & Automation",
    icon: Bot,
    art: "robot",
    iconTitle: "AI & Automation",
    iconSubtitle: "Smarter, faster workflows",
    chips: [
      { icon: Sparkles, label: "AI-Powered Solutions" },
      { icon: Workflow, label: "Process Automation" },
    ],
    eyebrow: "Intelligent Solutions",
    title: "AI & Business Automation",
    description:
      "Agentic workflows and intelligent automation designed to reduce manual work and increase productivity.",
    features: [
      "Custom AI solutions",
      "Workflow automation",
      "Data-driven insights",
      "AI agent integration",
      "Business process optimization",
      "Scalable automation systems",
    ],
    cta: "Explore AI & Automation",
    href: DEFAULT_CTA_URL,
    accent: "purple",
  },
  {
    id: "web",
    tabLabel: "Web",
    icon: LayoutTemplate,
    art: "browser",
    iconTitle: "Web Development",
    iconSubtitle: "Modern & high-performing",
    chips: [
      { icon: MonitorSmartphone, label: "Responsive Design" },
      { icon: Search, label: "SEO Friendly" },
    ],
    eyebrow: "Modern Digital Experiences",
    title: "Web Design & Development",
    description:
      "Fast, responsive and scalable websites that combine design, strategy and technology.",
    features: [
      "Custom UI/UX design",
      "Performance optimized",
      "SEO best practices",
      "Modern tech stack",
      "CMS / admin panels",
      "Ongoing support & maintenance",
    ],
    cta: "Explore Web Development",
    href: DEFAULT_CTA_URL,
    accent: "blue",
  },
  {
    id: "mobile-apps",
    tabLabel: "Mobile Apps",
    icon: Smartphone,
    art: "phone",
    iconTitle: "Mobile App Development",
    iconSubtitle: "Apps that make an impact",
    chips: [
      { icon: Smartphone, label: "Android & iOS Apps" },
      { icon: Palette, label: "User-Centric Design" },
    ],
    eyebrow: "Mobile Solutions",
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile applications with modern features and seamless user experiences.",
    features: [
      "Native & cross-platform",
      "Modern UI/UX design",
      "API integration",
      "Scalable architecture",
      "App store deployment",
      "Continuous updates",
    ],
    cta: "Explore Mobile Apps",
    href: DEFAULT_CTA_URL,
    accent: "orange",
  },
  {
    id: "fintech-platforms",
    tabLabel: "Fintech",
    icon: CreditCard,
    art: "dashboard",
    iconTitle: "Fintech Platform Engineering",
    iconSubtitle: "Secure & scalable solutions",
    chips: [
      { icon: Lock, label: "Secure Transactions" },
      { icon: FileCheck, label: "Regulatory Compliance" },
    ],
    eyebrow: "Financial Technology",
    title: "Fintech Platform Engineering",
    description:
      "Build secure and scalable fintech products with modern technology and compliance standards.",
    features: [
      "Payment solutions",
      "Secure architecture",
      "Compliance ready",
      "Transaction management",
      "Fraud detection",
      "Scalable systems",
    ],
    cta: "Explore Fintech Platforms",
    href: DEFAULT_CTA_URL,
    accent: "green",
  },
  {
    id: "industry-erp",
    tabLabel: "School & Hospital",
    icon: Building2,
    art: "building",
    iconTitle: "School & Hospital Platforms",
    iconSubtitle: "Management made simple",
    chips: [
      { icon: Users, label: "Student / Patient Management" },
      { icon: BarChart3, label: "Reports & Analytics" },
    ],
    eyebrow: "Institutional Solutions",
    title: "School & Hospital Platforms",
    description:
      "Comprehensive management systems for educational institutions and healthcare facilities.",
    features: [
      "Student / patient management",
      "Online appointments",
      "Staff & resource management",
      "Reports & analytics",
      "Secure data handling",
      "Custom modules",
    ],
    cta: "Explore Institutional App",
    href: DEFAULT_CTA_URL,
    accent: "teal",
  },
];

/* ---------- Tuning ---------- */
const TOP_OFFSET = 96; // where the first card sticks (below the sticky tabs)
const STEP = 20; // how much each stuck card peeks above the next
const FADE_DISTANCE = 240; // px over which a covered card fades/blurs
const BELOW_DISTANCE = 640; // px over which cards below the active one blur (scroll up)
const MAX_BLUR = 7; // max blur in px
const ACTIVE_REACH = 160; // how close a card must be to its sticky spot to become active
const DESKTOP_QUERY = "(min-width: 901px)";

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/* =========================================================
   Small illustrations shown at the bottom-right of each card.
   Colours come from the card's accent theme in Build.css.
========================================================= */
function CardArt({ kind }) {
  let art;

  switch (kind) {
    case "robot":
      art = (
        <>
          <circle cx="80" cy="12" r="5" className="a-accent" />
          <rect x="78" y="16" width="4" height="12" rx="2" className="a-accent" />
          <rect x="46" y="28" width="68" height="56" rx="24" className="a-white a-line" />
          <rect x="56" y="40" width="48" height="32" rx="14" className="a-accent" />
          <circle cx="71" cy="56" r="5" className="a-white" />
          <circle cx="89" cy="56" r="5" className="a-white" />
          <rect x="58" y="88" width="44" height="24" rx="12" className="a-white a-line" />
          <path d="M26 44l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" className="a-accent" />
          <path d="M132 76l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" className="a-dim" />
        </>
      );
      break;

    case "phone":
      art = (
        <>
          <g transform="rotate(10 80 60)">
            <rect x="52" y="12" width="56" height="98" rx="12" className="a-accent" />
            <rect x="57" y="18" width="46" height="86" rx="8" className="a-soft" />
            <rect x="63" y="26" width="34" height="34" rx="6" className="a-white" />
            <rect x="63" y="68" width="34" height="6" rx="3" className="a-white" />
            <rect x="63" y="80" width="22" height="6" rx="3" className="a-white" />
          </g>
          <circle cx="26" cy="92" r="11" className="a-white a-line" />
          <circle cx="140" cy="48" r="9" className="a-white a-line" />
        </>
      );
      break;

    case "dashboard":
      art = (
        <g transform="rotate(-4 80 60)">
          <rect x="20" y="24" width="120" height="76" rx="10" className="a-white a-line" />
          <rect x="32" y="36" width="56" height="9" rx="4.5" className="a-accent" />
          <rect x="32" y="52" width="26" height="6" rx="3" className="a-soft" />
          <rect x="32" y="64" width="38" height="6" rx="3" className="a-soft" />
          <rect x="98" y="70" width="8" height="18" rx="2" className="a-dim" />
          <rect x="110" y="58" width="8" height="30" rx="2" className="a-accent" />
          <rect x="122" y="48" width="8" height="40" rx="2" className="a-dim" />
        </g>
      );
      break;

    case "building":
      art = (
        <>
          <rect x="26" y="64" width="26" height="46" rx="5" className="a-soft" />
          <rect x="108" y="56" width="28" height="54" rx="5" className="a-soft" />
          <rect x="50" y="34" width="60" height="76" rx="7" className="a-accent" />
          <rect x="68" y="12" width="24" height="24" rx="6" className="a-soft" />
          <rect x="78" y="16" width="4" height="16" rx="1.5" className="a-accent" />
          <rect x="72" y="22" width="16" height="4" rx="1.5" className="a-accent" />
          {[48, 64, 80].map((y) =>
            [58, 75, 92].map((x) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="10"
                height="9"
                rx="2"
                className="a-white"
              />
            ))
          )}
          <rect x="73" y="94" width="14" height="16" rx="3" className="a-white" />
        </>
      );
      break;

    case "browser":
    default:
      art = (
        <g transform="rotate(-6 80 60)">
          <rect x="22" y="20" width="116" height="80" rx="10" className="a-white a-line" />
          <path
            d="M22 30a10 10 0 0 1 10-10h96a10 10 0 0 1 10 10v8H22z"
            className="a-soft"
          />
          <circle cx="34" cy="29" r="2.6" className="a-accent" />
          <circle cx="43" cy="29" r="2.6" className="a-dim" />
          <circle cx="52" cy="29" r="2.6" className="a-dim" />
          <rect x="32" y="46" width="36" height="42" rx="5" className="a-soft" />
          <rect x="76" y="48" width="50" height="7" rx="3.5" className="a-accent" />
          <rect x="76" y="62" width="50" height="6" rx="3" className="a-soft" />
          <rect x="76" y="74" width="34" height="6" rx="3" className="a-soft" />
        </g>
      );
  }

  return (
    <svg className="build-art" viewBox="0 0 160 120" aria-hidden="true">
      {art}
    </svg>
  );
}

function Build() {
  const [activeId, setActiveId] = useState(buildItems[0].id);

  const cardRefs = useRef({});
  const stackRef = useRef(null);
  const tabsRef = useRef(null);

  /* =========================================================
     Scroll effects (same in both directions)
     - Cards ABOVE the active one blur/fade as the next card covers them
     - Cards BELOW the active one are blurred until they settle in place
     Styles are written straight to the DOM (no React re-render
     per scroll frame), so it stays smooth.
  ========================================================= */
  useEffect(() => {
    const desktopMq = window.matchMedia(DESKTOP_QUERY);
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let ticking = false;
    let currentActive = buildItems[0].id;
    let effectsApplied = false;

    const clearEffects = () => {
      if (!effectsApplied) return;
      effectsApplied = false;
      buildItems.forEach(({ id }) => {
        const el = cardRefs.current[id];
        if (el) {
          el.style.opacity = "";
          el.style.filter = "";
          el.style.transform = "";
        }
      });
    };

    const update = () => {
      ticking = false;

      const y = window.scrollY;

      const stacked = desktopMq.matches;
      const rects = buildItems.map(
        ({ id }) => cardRefs.current[id]?.getBoundingClientRect() ?? null
      );

      /* ----- which card is active ----- */
      let activeIndex = 0;
      rects.forEach((r, i) => {
        if (!r) return;
        const line = stacked
          ? TOP_OFFSET + i * STEP + ACTIVE_REACH
          : window.innerHeight * 0.45;
        if (r.top <= line) activeIndex = i;
      });

      const lastRect = rects[rects.length - 1];
      const atBottom =
        window.innerHeight + y >= document.documentElement.scrollHeight - 4;
      if (atBottom && lastRect && lastRect.top < window.innerHeight) {
        activeIndex = buildItems.length - 1;
      }

      const nextId = buildItems[activeIndex].id;
      if (nextId !== currentActive) {
        currentActive = nextId;
        setActiveId(nextId);
      }

      /* ----- blur / fade (desktop stacking only) ----- */
      if (!stacked || reduceMq.matches) {
        clearEffects();
        return;
      }

      effectsApplied = true;

      buildItems.forEach(({ id }, i) => {
        const el = cardRefs.current[id];
        const r = rects[i];
        if (!el || !r) return;

        const sticky = TOP_OFFSET + i * STEP;
        const next = rects[i + 1];

        // how much the next card has slid over this one
        const cover = next ? clamp(1 - (next.top - sticky) / FADE_DISTANCE) : 0;

        // how far this card still is from its resting spot (cards below active)
        const below =
          i > activeIndex ? clamp((r.top - sticky) / BELOW_DISTANCE) : 0;

        // blur whichever applies: covered by the next card, or still arriving
        const isBelow = below > cover;
        const p = Math.max(cover, below);

        const opacity = 1 - p * (isBelow ? 0.5 : 0.85);
        const blur = p * MAX_BLUR;
        const scale = 1 - p * 0.04;
        const ty = isBelow ? 0 : -p * 14;

        el.style.opacity = opacity.toFixed(3);
        el.style.filter =
          p > 0.01
            ? `blur(${blur.toFixed(2)}px) brightness(${(1 - p * 0.1).toFixed(3)})`
            : "none";
        el.style.transform = `translateY(${ty.toFixed(1)}px) scale(${scale.toFixed(4)})`;
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* =========================================================
     Keep the active tab visible in the scrollable tab bar
  ========================================================= */
  useEffect(() => {
    const bar = tabsRef.current;
    if (!bar || bar.scrollWidth <= bar.clientWidth) return;

    const btn = bar.querySelector(".build-tab.active");
    if (!btn) return;

    bar.scrollTo({
      left: btn.offsetLeft - (bar.clientWidth - btn.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  /* =========================================================
     Tab click -> scroll to that card
  ========================================================= */
  const scrollToCard = (id) => {
    const index = buildItems.findIndex((item) => item.id === id);
    const stack = stackRef.current;
    if (index < 0 || !stack) return;

    const stacked = window.matchMedia(DESKTOP_QUERY).matches;

    // natural (un-stuck) top of the card = stack top + heights of cards before it
    let naturalTop = stack.getBoundingClientRect().top + window.pageYOffset;
    for (let j = 0; j < index; j++) {
      const prev = cardRefs.current[buildItems[j].id];
      if (prev) naturalTop += prev.offsetHeight;
    }

    const target = stacked
      ? naturalTop - (TOP_OFFSET + index * STEP)
      : naturalTop - 76;

    window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  };

  return (
    <section className="build-section">
      {/* Decorative background (clipped in its own layer so sticky still works) */}
      <div className="build-bg" aria-hidden="true">
        <span className="build-bg__blob build-bg__blob--left" />
        <span className="build-bg__blob build-bg__blob--right" />
        <span className="build-bg__ring build-bg__ring--top-left" />
        <span className="build-bg__ring build-bg__ring--right" />
        <span className="build-bg__dots build-bg__dots--top-right" />
        <span className="build-bg__dots build-bg__dots--mid-left" />
        <span className="build-bg__dots build-bg__dots--mid-right" />
      </div>

      {/* Header */}
      <div className="build-header">
        <span className="build-eyebrow-top">OUR EXPERTISE</span>

        <h2 className="build-heading">
          One engineering partner
          <br />
          for your entire{" "}
          <span className="build-heading-accent">digital stack</span>
        </h2>

        <p className="build-subheading">
          We deliver products, not just code. We work across each capability
          that helps you grow faster, work smarter, and stay ahead.
        </p>
      </div>

      {/* Tabs */}
      <div className="build-tabs" ref={tabsRef}>
        {buildItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`build-tab${activeId === item.id ? " active" : ""}`}
            onClick={() => scrollToCard(item.id)}
          >
            {item.tabLabel}
          </button>
        ))}
      </div>

      {/* Stacking cards */}
      <div className="build-stack" ref={stackRef}>
        {buildItems.map((item, index) => {
          const Icon = item.icon;

          const wrapperClass = [
            "build-card-wrapper",
            `accent-${item.accent}`,
            activeId === item.id ? "is-active" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={item.id}
              id={item.id}
              ref={(el) => {
                cardRefs.current[item.id] = el;
              }}
              className={wrapperClass}
              style={{ top: `${TOP_OFFSET + index * STEP}px` }}
            >
              <div className="build-card">
                {/* Left panel */}
                <div className="build-card-left">
                  <div className="build-card-icon">
                    <Icon size={28} strokeWidth={1.8} />
                  </div>

                  <div className="build-card-head">
                    <h4 className="build-card-icon-title">{item.iconTitle}</h4>
                    <p className="build-card-icon-subtitle">
                      {item.iconSubtitle}
                    </p>
                  </div>

                  <div className="build-chips">
                    {item.chips.map(({ icon: ChipIcon, label }) => (
                      <div className="build-chip" key={label}>
                        <span className="build-chip-icon">
                          <ChipIcon size={12} strokeWidth={2.2} />
                        </span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right panel */}
                <div className="build-card-right">
                  <span className="build-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="build-card-eyebrow">{item.eyebrow}</span>

                  <h3 className="build-card-title">{item.title}</h3>

                  <p className="build-card-desc">{item.description}</p>

                  <div className="build-features">
                    {item.features.map((feature) => (
                      <div className="build-feature" key={feature}>
                        <span className="build-feature-check">
                          <Check size={10} strokeWidth={3.5} />
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a href={item.href} className="build-btn-primary">
                    {item.cta}
                    <ArrowRight size={16} strokeWidth={2.4} />
                  </a>

                  <div className="build-card-art" aria-hidden="true">
                    <CardArt kind={item.art} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Build;
