import { useEffect, useState, useCallback, useRef } from "react";
import "./HeroSlider.css";

const BANNER_API =
  "https://66ou0fp7m1.execute-api.ap-south-1.amazonaws.com/prod/banner";

// Shown when a banner has no title / description (or when the API is empty)
const DEFAULT_TITLE = "Build the *Future* of Your Business";
const DEFAULT_DESCRIPTION =
  "Kaden Koppers Technology engineers AI platforms, SaaS products, automation systems, and custom digital solutions that transform how modern businesses operate and scale.";

const CHIPS = [
  { label: "AI Automation", icon: "🤖", pos: "top" },
  { label: "Cloud Infra", icon: "☁️", pos: "left" },
  { label: "SaaS Build", icon: "⚡", pos: "right" },
  { label: "Mobile Apps", icon: "📱", pos: "bottom" },
];

const AVATARS = ["A", "B", "C", "D"];

// Title highlight:
// - write "Build the *Future* of Your Business" to choose the blue word
// - without asterisks, the 3rd word is highlighted (or the last word if shorter)
function renderTitle(text) {
  const t = (text || "").trim();

  if (t.includes("*")) {
    return t
      .split(/(\*[^*]+\*)/g)
      .filter(Boolean)
      .map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className="kk-hero__highlight">
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        )
      );
  }

  const words = t.split(/\s+/);
  if (words.length < 2) return t;

  const idx = words.length >= 3 ? 2 : words.length - 1;
  const before = words.slice(0, idx).join(" ");
  const after = words.slice(idx + 1).join(" ");

  return (
    <>
      {before}{" "}
      <span className="kk-hero__highlight">{words[idx]}</span>
      {after ? ` ${after}` : ""}
    </>
  );
}

function HomeSlider({
  images = [],
  autoPlay = true,
  intervalMs = 5000,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [apiBanners, setApiBanners] = useState([]);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  // =====================================================
  // LOAD BANNERS FROM API
  // =====================================================

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await fetch(`${BANNER_API}?t=${Date.now()}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load banners");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          setApiBanners([]);
          return;
        }

        const banners = data
          .map((banner) => ({
            id: banner.id || "",
            image: banner.imageUrl || banner.image || "",
            imageName: banner.imageName || "",
            description: banner.description || "",
          }))
          .filter((banner) => banner.image);

        setApiBanners(banners);
      } catch (error) {
        console.error("Home banner API error:", error);
        setApiBanners([]);
      }
    };

    loadBanners();
  }, []);

  // =====================================================
  // FALLBACK (images prop)
  // =====================================================

  const fallbackBanners = images
    .map((image, index) => ({
      id: `fallback-${index}`,
      image:
        typeof image === "string"
          ? image
          : image?.image || image?.imageUrl || "",
      imageName: typeof image === "object" ? image?.imageName || "" : "",
      description: typeof image === "object" ? image?.description || "" : "",
    }))
    .filter((banner) => banner.image);

  // =====================================================
  // FINAL SLIDES (never empty, so the hero always shows)
  // =====================================================

  const realSlides =
    apiBanners.length > 0 ? apiBanners : fallbackBanners;

  const slides =
    realSlides.length > 0
      ? realSlides
      : [
          {
            id: "default",
            image: "",
            imageName: "",
            description: "",
          },
        ];

  const total = slides.length;

  // =====================================================
  // RESET INDEX
  // =====================================================

  useEffect(() => {
    if (activeIndex >= total) {
      setActiveIndex(0);
    }
  }, [total, activeIndex]);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goToSlide = useCallback(
    (index) => {
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const goToPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  // =====================================================
  // AUTOPLAY (resets on manual click, pauses on hover)
  // =====================================================

  useEffect(() => {
    if (!autoPlay || total <= 1 || paused) return;

    const timer = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [autoPlay, intervalMs, total, paused, activeIndex]);

  // =====================================================
  // SWIPE (mobile)
  // =====================================================

  const handleTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchX.current === null) return;

    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;

    if (Math.abs(dx) > 50) {
      if (dx < 0) goToNext();
      else goToPrev();
    }
  };

  // =====================================================
  // CURRENT SLIDE CONTENT
  // =====================================================

  const slide = slides[activeIndex] || slides[0];
  const title = slide.imageName || DEFAULT_TITLE;
  const description = slide.description || DEFAULT_DESCRIPTION;
  const altText = title.replace(/\*/g, "");

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <section
      className="kk-hero"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="kk-hero__bg" aria-hidden="true" />

      <div className="kk-hero__inner" key={slide.id || activeIndex}>

        {/* ================= LEFT: TEXT ================= */}

        <div className="kk-hero__text">

          <div className="kk-hero__badge">
            <span className="kk-hero__badge-dot" />
            AI-Powered Digital Solutions
          </div>

          <h1 className="kk-hero__title">{renderTitle(title)}</h1>

          <p className="kk-hero__description">{description}</p>

          <div className="kk-hero__actions">
            <a href="/contact" className="kk-hero__btn kk-hero__btn--primary">
              Start Your Project <span aria-hidden="true">→</span>
            </a>

            <a href="/work" className="kk-hero__btn kk-hero__btn--outline">
              View Our Work
            </a>
          </div>

          <div className="kk-hero__trust">
            <div className="kk-hero__avatars" aria-hidden="true">
              {AVATARS.map((letter) => (
                <span key={letter} className="kk-hero__avatar">
                  {letter}
                </span>
              ))}
            </div>

            <div className="kk-hero__trust-text">
              <span className="kk-hero__stars" aria-label="5 star rating">
                ★★★★★
              </span>
              <span>Trusted by 50+ businesses</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT: VISUAL ================= */}

        <div className="kk-hero__visual">
          <div className="kk-hero__ring" aria-hidden="true" />

          <div className="kk-hero__frame">
            <div className="kk-hero__frame-inner">
              {slide.image && (
                <img
                  src={slide.image}
                  alt={altText}
                  className="kk-hero__image"
                />
              )}
            </div>
          </div>

          {CHIPS.map((chip) => (
            <span
              key={chip.label}
              className={`kk-hero__chip kk-hero__chip--${chip.pos}`}
            >
              <span aria-hidden="true">{chip.icon}</span>
              {chip.label}
            </span>
          ))}
        </div>

      </div>

      {/* ================= ARROWS + DOTS ================= */}

      {total > 1 && (
        <>
          <button
            type="button"
            className="kk-hero__arrow kk-hero__arrow--prev"
            aria-label="Previous slide"
            onClick={goToPrev}
          >
            <svg viewBox="0 0 8 14" width="10" height="16" aria-hidden="true">
              <path
                d="M7 1L1 7L7 13"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="kk-hero__arrow kk-hero__arrow--next"
            aria-label="Next slide"
            onClick={goToNext}
          >
            <svg viewBox="0 0 8 14" width="10" height="16" aria-hidden="true">
              <path
                d="M1 1L7 7L1 13"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="kk-hero__dots">
            {slides.map((s, index) => (
              <button
                key={s.id || `${s.image}-dot-${index}`}
                type="button"
                className={`kk-hero__dot ${
                  index === activeIndex ? "kk-hero__dot--active" : ""
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default HomeSlider;