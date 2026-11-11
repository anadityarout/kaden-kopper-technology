import { useState, useEffect, useCallback } from "react";
import "./ServicePage.css";

/* =====================================================
   SERVICE BANNER API
===================================================== */

const API_URL =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/servicebanner";

/* =====================================================
   HERO FEATURE PANEL (edit text here)
===================================================== */

const HERO_FEATURES = [
  { icon: "solutions", title: "Custom Solutions", text: "Tailored to your business needs" },
  { icon: "team", title: "Expert Team", text: "Skilled & experienced professionals" },
  { icon: "time", title: "On-Time Delivery", text: "Focus on quality and performance" },
  { icon: "support", title: "End-to-End Support", text: "From strategy to long-term growth" },
];

const HERO_ICONS = {
  solutions: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 5v8m-4-6l4 2 4-2",
  team: "M9 11a3 3 0 100-6 3 3 0 000 6zm7 0a2.5 2.5 0 100-5M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 14c2.8 0 5 2.2 5 5",
  time: "M12 21a9 9 0 100-18 9 9 0 000 18zm0-14v5l3 2",
  support: "M4 8h16v11H4zM8 8V5h8v3M12 12v4m-2-2h4",
};

/* fallback shown when no banner is uploaded yet */
const EMPTY_SLIDE = {
  id: "empty",
  title: "Digital Solutions to Grow Your Business",
  text: "",
  image: "",
};

/* =====================================================
   WHY CHOOSE US DATA
===================================================== */

const WHY_CHOOSE_ITEMS = [
  { icon: "experience", title: "Experienced Team", text: "Skilled professionals with industry expertise" },
  { icon: "solutions", title: "Customized Solutions", text: "Tailored to your business requirements" },
  { icon: "quality", title: "Quality Assurance", text: "Focus on performance, security and scalability" },
  { icon: "delivery", title: "On-Time Delivery", text: "We value your time and deliver on schedule" },
  { icon: "support", title: "Ongoing Support", text: "Long-term support for your business growth" },
];

const WHY_CHOOSE_ICONS = {
  experience: "M13 2L4 13h6l-1 9 9-12h-6l1-8z",
  solutions:
    "M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6L7 7m10 10l1.4 1.4M5.6 18.4L7 17m10-10l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z",
  quality: "M12 3l7 3v5c0 4.6-2.9 8.1-7 10-4.1-1.9-7-5.4-7-10V6l7-3zm-3.5 9l2.3 2.3 4.7-4.7",
  delivery:
    "M3 12h10m0 0l-4-4m4 4l-4 4M14 5h3l4 4v7h-7V5zM6 19a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z",
  support:
    "M4 13a8 8 0 0116 0M4 13v3a2 2 0 002 2h1v-6H6a2 2 0 00-2 1zm16 0v3a2 2 0 01-2 2h-1v-6h1a2 2 0 012 1zM9 19h6",
};

/* =====================================================
   ICONS
===================================================== */

function Icon({ d, size = 24, width = 1.9 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function CheckIcon() {
  return <Icon d="M5 12l4 4L19 6" size={18} width={2.5} />;
}

/* =====================================================
   SERVICE PHONE ILLUSTRATION
===================================================== */

const PHONE_SYMBOLS = { web: "WEB", app: "APP", design: "✦", seo: "SEO", video: "▶", marketing: "M" };

function ServiceMobileIcon({ type = "web" }) {
  const symbol = PHONE_SYMBOLS[type] || "WEB";

  return (
    <svg className="kk-service-mobile-icon" viewBox="0 0 220 300"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`phoneGradient-${type}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5b57ec" />
          <stop offset="100%" stopColor="#16a8b5" />
        </linearGradient>
        <linearGradient id={`screenGradient-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef8fb" />
        </linearGradient>
        <filter id={`phoneShadow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="9" stdDeviation="9" floodOpacity="0.22" />
        </filter>
      </defs>

      <circle cx="18" cy="90" r="7" fill="#625de6" />
      <circle cx="202" cy="105" r="7" fill="#18b7bc" />
      <circle cx="185" cy="194" r="5" fill="#514ed5" />

      <rect x="38" y="18" width="144" height="264" rx="38"
        fill={`url(#phoneGradient-${type})`} filter={`url(#phoneShadow-${type})`} />
      <rect x="42" y="22" width="136" height="75" rx="35" fill="#ffffff" opacity="0.06" />
      <rect x="57" y="55" width="106" height="173" rx="22" fill={`url(#screenGradient-${type})`} />
      <rect x="70" y="76" width="80" height="23" rx="8" fill="#6765e9" />
      <rect x="70" y="112" width="58" height="13" rx="6" fill="#cfd4db" />
      <rect x="70" y="137" width="68" height="13" rx="6" fill="#e0e3e7" />
      <rect x="70" y="166" width="80" height="34" rx="12" fill="#1aaabd" />
      <text x="110" y="188" textAnchor="middle" fill="#ffffff"
        fontSize={symbol.length > 2 ? "9" : "15"} fontWeight="700" fontFamily="Arial, sans-serif">
        {symbol}
      </text>
      <circle cx="110" cy="251" r="6" fill="#dceff2" />
    </svg>
  );
}

/* =====================================================
   HIGHLIGHTED BANNER TITLE
===================================================== */

function HighlightedTitle({ title }) {
  const words = String(title || "").trim().split(/\s+/).filter(Boolean);

  if (words.length < 3) return <>{title}</>;

  const cut = words.length >= 5 ? words.length - 2 : words.length - 1;

  return (
    <>
      {words.slice(0, cut).join(" ")} <span>{words.slice(cut).join(" ")}</span>
    </>
  );
}

/* =====================================================
   SERVICE DETAILS
===================================================== */

const SERVICE_DETAILS = [
  {
    id: "web-development",
    type: "web",
    title: "Web Development",
    description:
      "We build modern, responsive, and high-performance websites that help businesses establish a strong digital presence.",
    listTitle: "Our Services Include:",
    items: [
      "Custom Website Development",
      "Responsive Web Design",
      "React & Modern Web Applications",
      "Website Maintenance & Support",
    ],
  },
  {
    id: "app-development",
    type: "app",
    title: "App Development",
    description:
      "We create user-friendly and scalable mobile applications designed to deliver smooth experiences across devices.",
    listTitle: "Solutions Include:",
    items: [
      "Android App Development",
      "iOS App Development",
      "Cross-Platform Applications",
      "App Maintenance & Support",
    ],
  },
  {
    id: "graphic-design",
    type: "design",
    title: "Graphic Design",
    description:
      "We create professional and creative visual designs that help businesses build a strong and memorable brand identity.",
    listTitle: "Our Services Include:",
    items: ["Brand Identity Design", "Social Media Graphics", "Marketing Creatives", "UI & Visual Design"],
  },
  {
    id: "seo",
    type: "seo",
    title: "SEO",
    description:
      "We use data-driven SEO strategies to improve search visibility, attract relevant traffic, and support long-term online growth.",
    listTitle: "Our Services Include:",
    items: ["Technical SEO", "On-Page SEO", "Off-Page SEO", "SEO Analytics & Reporting"],
  },
  {
    id: "video-editing",
    type: "video",
    title: "Video Editing",
    description:
      "We transform your footage and ideas into engaging videos designed for websites, social media, marketing, and promotional campaigns.",
    listTitle: "Our Services Include:",
    items: ["Corporate Videos", "Social Media Videos", "Promotional Videos", "Motion Graphics"],
  },
  {
    id: "digital-marketing",
    type: "marketing",
    title: "Digital Marketing",
    description:
      "We create result-driven digital marketing strategies that help businesses reach, engage, and connect with their target audience.",
    listTitle: "Our Services Include:",
    items: ["Social Media Marketing", "Google Ads", "Content Marketing", "Lead Generation"],
  },
];

/* =====================================================
   SERVICE PAGE
===================================================== */

function ServicePage() {
  const [serviceBanners, setServiceBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  /* LOAD SERVICE BANNERS */

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Service Banner API Error: ${response.status}`);
        }

        const data = await response.json();
        setServiceBanners(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load Service Banners:", error);
        setServiceBanners([]);
      }
    };

    loadBanners();
  }, []);

  /* FORMAT API DATA (image, name and description come from the admin dashboard) */

  const slides = serviceBanners
    .filter((item) => item.image || item.imageUrl || item.fileUrl || item.preview)
    .map((item, index) => ({
      id: item.id || index,
      title: item.name || item.category || "Our Services",
      text: item.description || "",
      image: item.image || item.imageUrl || item.fileUrl || item.preview,
    }));

  const visibleSlides = slides.length > 0 ? slides : [EMPTY_SLIDE];

  /* VALIDATE CURRENT SLIDE */

  useEffect(() => {
    if (slides.length === 0) setCurrent(0);
    else if (current >= slides.length) setCurrent(0);
  }, [slides.length, current]);

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goTo = useCallback(
    (index) => {
      if (slides.length === 0) return;
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  /* AUTO SLIDER */

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  /* SCROLL TO SERVICES */

  const scrollToServices = () => {
    document
      .getElementById("kk-services")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="kk-service-page">
      {/* =================================================
          SERVICE BANNER
      ================================================= */}

      <section className="kk-slider">
        {visibleSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`kk-slide ${index === current ? "active" : ""}`}
            aria-hidden={index !== current}
          >
            {/* RIGHT IMAGE (curved on desktop, faded background on mobile) */}

            <div className="kk-slide-visual">
              <div
                className="kk-slide-visual-img"
                style={slide.image ? { backgroundImage: `url("${slide.image}")` } : undefined}
              />
            </div>

            <div className="kk-slide-overlay" />

            <div className="kk-slide-inner">
              {/* LEFT CONTENT */}

              <div className="kk-slide-content">
                <span className="kk-slide-tag">Our Services</span>

                <h1>
                  <HighlightedTitle title={slide.title} />
                </h1>

                {slide.text && <p>{slide.text}</p>}

                <div className="kk-slide-buttons">
                  <button type="button" className="kk-slide-primary" onClick={scrollToServices}>
                    Explore Our Services <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>

              {/* FEATURE PANEL */}

              <ul className="kk-hero-features">
                {HERO_FEATURES.map((feature) => (
                  <li className="kk-hero-feature" key={feature.title}>
                    <span className="kk-hero-feature-icon">
                      <Icon d={HERO_ICONS[feature.icon]} size={22} width={1.8} />
                    </span>

                    <span className="kk-hero-feature-text">
                      <strong>{feature.title}</strong>
                      <small>{feature.text}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* SLIDER CONTROLS */}

        {slides.length > 1 && (
          <>
            <button type="button" className="kk-slider-arrow prev" onClick={prev} aria-label="Previous service">
              ‹
            </button>

            <button type="button" className="kk-slider-arrow next" onClick={next} aria-label="Next service">
              ›
            </button>

            <div className="kk-slider-dots">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.id}
                  className={`kk-slider-dot ${index === current ? "active" : ""}`}
                  onClick={() => goTo(index)}
                  aria-label={`Go to service ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* =================================================
          WHY CHOOSE US
      ================================================= */}

      <section className="kk-why-choose">
        <div className="kk-why-container">
          <div className="kk-why-header">
            <span className="kk-why-label">WHY CHOOSE KADEN KOPPERS</span>

            <h2>
              Why <span>Choose Us?</span>
            </h2>

            <p>
              We combine creativity, technology, and strategy to deliver digital solutions that
              help your business grow. Our goal is to create high-quality, scalable, and
              result-driven solutions tailored to your unique needs.
            </p>
          </div>

          <div className="kk-why-grid">
            {WHY_CHOOSE_ITEMS.map((item) => (
              <div className="kk-why-card" key={item.title}>
                <div className="kk-why-icon">
                  <Icon d={WHY_CHOOSE_ICONS[item.icon]} size={26} />
                </div>

                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          SERVICE DETAILS
      ================================================= */}

      <section className="kk-service-details" id="kk-services">
        <div className="kk-service-details-container">
          <div className="kk-service-details-header">
            <span className="kk-service-details-label">OUR SERVICES</span>

            <h2>
              Digital Solutions <span>For Your Business</span>
            </h2>

            <p>
              Explore our professional digital services designed to help your business grow,
              connect with customers, and build a stronger online presence.
            </p>
          </div>

          <div className="kk-service-details-list">
            {SERVICE_DETAILS.map((service) => (
              <article className="kk-service-detail-card" key={service.id}>
                <div className="kk-service-detail-image">
                  <ServiceMobileIcon type={service.type} />
                </div>

                <div className="kk-service-detail-content">
                  <h3>{service.title}</h3>

                  <p className="kk-service-detail-description">{service.description}</p>

                  <h4>{service.listTitle}</h4>

                  <ul className="kk-service-detail-items">
                    {service.items.map((item) => (
                      <li key={item}>
                        <span className="kk-service-check">
                          <CheckIcon />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button type="button" className="kk-service-book-btn">
                    Book Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicePage;
