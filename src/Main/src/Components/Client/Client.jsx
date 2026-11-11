import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight, Plus, Star, Users } from "lucide-react";
import "./Client.css";

// `role` is optional per testimonial (defaults to "Business Owner").
// Add `avatarUrl` to any item to use a real photo instead of the stock one.
// `gender` picks which stock photo set (men/women) is used.
const testimonials = [
  { name: "ARVIND GARG", company: "REALTIA REALTY", gender: "male", text: "Choosing 88gravity was one of the best decisions I made for my business. Comprehensive approach, unparalleled expertise, completely transformed my online presence." },
  { name: "DINESH KUROOP", company: "THE BAAGH", gender: "male", text: "88gravity is the best place to promote my business. Their team is highly professional and understands the essence of business." },
  { name: "PANKAJ ARYA", company: "CIRCLE", gender: "male", text: "A great team of talented and creative folks. Delivering the services to their client exceptionally well. The bunch of creative heads will amaze you with their innovative work." },
  { name: "SURINDER SEHRAWAT", company: "OEM AUTOMATIC", gender: "male", text: "88gravity is the best digital marketing agency in Gurgaon. They give good results in a good package compared to others." },
  { name: "MANJEET SEHRAWAT", company: "MUSCLETRAIL", gender: "male", text: "Thorough professional people, good 2 years with them and done a fantastic job on brand building and platform development. Good people and trust worthy." },
  { name: "ROHIT MEHRA", company: "URBAN NEST", gender: "male", text: "From strategy to execution, everything was handled with care. Our leads doubled within two months." },
  { name: "KAVYA IYER", company: "PLATTER & CO.", gender: "female", text: "They understood our brand voice instantly. The social campaigns felt authentic, not templated." },
  { name: "SAHIL VERMA", company: "GRIDTECH", gender: "male", text: "Responsive team, clean deliverables, and they actually listen to feedback. Rare combination." },
  { name: "NEHA KAPOOR", company: "LUMIÈRE JEWELS", gender: "female", text: "Our website redesign brought a 40% jump in conversions. Couldn't be happier with the outcome." },
  { name: "AMAN TRIPATHI", company: "FORGE FITNESS", gender: "male", text: "The SEO work took us from page 3 to page 1 in under a quarter. Real, measurable results." },
  { name: "RIYA MALHOTRA", company: "PETAL & VINE", gender: "female", text: "Every deadline met, every revision handled gracefully. A genuinely dependable creative partner." },
  { name: "VIKRAM RATHORE", company: "IRONCLAD LOGISTICS", gender: "male", text: "They simplified a messy brand identity into something clean and memorable. Highly recommended." },
  { name: "ANANYA DESAI", company: "SAFFRON TABLE", gender: "female", text: "Our Instagram engagement tripled after they took over content. The visuals speak for themselves." },
  { name: "KARAN BHATIA", company: "NIMBUS CLOUD", gender: "male", text: "Technical and creative — a hard combination to find. They nailed our product launch video." },
  { name: "ISHA NAIR", company: "TERRA & CO.", gender: "female", text: "Patient, communicative, and genuinely invested in our growth. Our go-to agency now." },
  { name: "YASH AGARWAL", company: "PIXEL FORGE", gender: "male", text: "The app redesign was smooth from wireframe to launch. Zero surprises, all good ones." },
  { name: "TANVI SHETTY", company: "BLOOM & BASIL", gender: "female", text: "They took our vague ideas and turned them into a cohesive, beautiful brand story." },
  { name: "ADITYA RANA", company: "SUMMIT GEAR", gender: "male", text: "Sales grew 25% after the funnel rebuild. The team clearly knows performance marketing." },
  { name: "MEERA PILLAI", company: "CANVAS STUDIO", gender: "female", text: "Every project comes back better than we imagined. Consistently thoughtful work." },
  { name: "DEV KHANNA", company: "APEX MOTORS", gender: "male", text: "Straightforward communication, sharp execution. Our showroom traffic is up noticeably." },
  { name: "SIMRAN CHAWLA", company: "WILLOW & OAK", gender: "female", text: "Our rebrand finally feels like us. They really took the time to understand our story." },
  { name: "ARJUN NAIDU", company: "VERTEX LABS", gender: "male", text: "The website loads instantly now and looks fantastic on mobile. Exactly what we needed." },
  { name: "POOJA SINGH", company: "SPICE ROUTE", gender: "female", text: "Their content calendar keeps us consistent, and the results show in our footfall." },
  { name: "HARSH VARDHAN", company: "STONECRAFT", gender: "male", text: "They handled our product photography and catalog end to end. Zero back and forth needed." },
  { name: "DIVYA MENON", company: "AURORA WELLNESS", gender: "female", text: "Warm, professional, and always ahead of deadlines. A pleasure to work with." },
  { name: "NIKHIL SHARMA", company: "TRAILBLAZE TOURS", gender: "male", text: "Bookings picked up right after the new landing page went live. Great ROI." },
  { name: "SNEHA RAO", company: "ATELIER LUXE", gender: "female", text: "Every touchpoint of our brand now feels premium and consistent. Exactly the upgrade we needed." },
  { name: "GAURAV JOSHI", company: "CIRCUIT WORKS", gender: "male", text: "Fast turnarounds without cutting corners. Our go-to for anything digital now." },
  { name: "AAROHI SETH", company: "MOSAIC HOMES", gender: "female", text: "They made a complex real estate portfolio feel simple and inviting online." },
  { name: "RAHUL DUTTA", company: "NORTHSTAR FINANCE", gender: "male", text: "Clear reporting, honest advice, and campaigns that actually convert. Solid team." },
];

const AUTOPLAY_MS = 5000;
const DRAG_THRESHOLD = 50;
const DOTS = 5;
const ACRONYMS = ["OEM"];

// "ARVIND GARG" -> "Arvind Garg"
const toTitleCase = (str = "") =>
  str
    .split(" ")
    .map((w) => (ACRONYMS.includes(w) ? w : w.charAt(0) + w.slice(1).toLowerCase()))
    .join(" ");

function getAvatarUrl(item, index) {
  if (item.avatarUrl) return item.avatarUrl;
  const set = item.gender === "female" ? "women" : "men";
  return `https://randomuser.me/api/portraits/${set}/${index % 100}.jpg`;
}

// Small avatar stack in the intro panel (first 5 testimonials)
const stackAvatars = testimonials.slice(0, 5);

export default function Client() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dragState = useRef({ startX: 0, dragging: false, moved: 0 });
  const total = testimonials.length;
  const groupSize = Math.ceil(total / DOTS);
  const activeDot = Math.min(DOTS - 1, Math.floor(current / groupSize));

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, goNext]);

  const handleDragStart = (clientX) => {
    dragState.current = { startX: clientX, dragging: true, moved: 0 };
    setIsPaused(true);
  };

  const handleDragMove = (clientX) => {
    if (!dragState.current.dragging) return;
    dragState.current.moved = clientX - dragState.current.startX;
  };

  const handleDragEnd = () => {
    if (!dragState.current.dragging) return;
    const { moved } = dragState.current;
    if (moved > DRAG_THRESHOLD) goPrev();
    else if (moved < -DRAG_THRESHOLD) goNext();
    dragState.current = { startX: 0, dragging: false, moved: 0 };
    setIsPaused(false);
  };

  const getOffset = (index) => {
    let offset = index - current;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  };

  return (
    <section className="rk-client-section">
      <div className="rk-client-inner">
        {/* ---------- Left: intro panel ---------- */}
        <div className="rk-client-left">
          <span className="rk-client-badge">
            <Users size={18} />
            Client Testimonials
          </span>

          <h2 className="rk-client-title">
            <span className="rk-client-title-line">Our Clients</span>
            <span className="rk-client-title-line rk-client-title-accent">Love Working</span>
            <span className="rk-client-title-line">
              With Us
              <svg className="rk-client-swoosh" viewBox="0 0 110 24" aria-hidden="true">
                <path d="M2 18 C 30 6, 62 6, 108 10" />
                <path d="M22 21 C 52 13, 82 13, 100 15" />
              </svg>
            </span>
          </h2>

          <p className="rk-client-subtitle">
            We’re proud to partner with amazing businesses and individuals who trust us to bring their ideas to life.
          </p>

          {/* Edit these numbers to your real figures */}
          <div className="rk-client-stats">
            <div className="rk-client-stat">
              <span className="rk-client-stat-value">100+</span>
              <span className="rk-client-stat-label">Happy Clients<br />Worldwide</span>
            </div>
            <div className="rk-client-stat">
              <span className="rk-client-stat-value rk-client-stat-value--navy">4.8/5</span>
              <span className="rk-client-stat-stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className="rk-client-stat-label">Average Rating</span>
            </div>
            <div className="rk-client-stat">
              <span className="rk-client-stat-value">150+</span>
              <span className="rk-client-stat-label">Projects<br />Completed</span>
            </div>
          </div>

          <div className="rk-client-trusted">
            <div className="rk-client-stack">
              {stackAvatars.map((item, i) => (
                <img
                  key={item.name}
                  className="rk-client-stack-img"
                  src={getAvatarUrl(item, i)}
                  alt=""
                  draggable={false}
                  loading="lazy"
                />
              ))}
              <span className="rk-client-stack-plus">
                <Plus size={18} />
              </span>
            </div>
            <span className="rk-client-trusted-divider" />
            <p className="rk-client-trusted-text">
              Trusted by
              <strong>businesses worldwide</strong>
            </p>
          </div>
        </div>

        {/* ---------- Right: carousel ---------- */}
        <div
          className="rk-client-right"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            handleDragEnd();
          }}
        >
          <div
            className="rk-client-carousel"
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            <div className="rk-client-track">
              {testimonials.map((item, index) => {
                const offset = getOffset(index);
                if (Math.abs(offset) > 2) return null;
                const isCenter = offset === 0;

                return (
                  <article
                    key={index}
                    className={`rk-client-card ${isCenter ? "rk-client-card--center" : "rk-client-card--side"}`}
                    data-offset={offset}
                    style={{ "--offset": offset }}
                    aria-hidden={!isCenter}
                  >
                    <div className="rk-client-card-top">
                      <span className="rk-client-quote rk-client-quote--open">“</span>
                      <span className="rk-client-stars" aria-label="5 out of 5 stars">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                        ))}
                      </span>
                    </div>

                    <p className="rk-client-text">{item.text}</p>

                    <div className="rk-client-divider" />

                    <div className="rk-client-footer">
                      <img
                        className="rk-client-avatar"
                        src={getAvatarUrl(item, index)}
                        alt={toTitleCase(item.name)}
                        draggable={false}
                        loading="lazy"
                      />
                      <div className="rk-client-person">
                        <p className="rk-client-name">{toTitleCase(item.name)}</p>
                        <p className="rk-client-role">{item.role || "Business Owner"}</p>
                        <p className="rk-client-company">{toTitleCase(item.company)}</p>
                      </div>
                      <span className="rk-client-quote rk-client-quote--close">”</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rk-client-controls">
            <button className="rk-client-arrow" onClick={goPrev} aria-label="Previous testimonial">
              <ArrowLeft size={22} />
            </button>

            <div className="rk-client-dots">
              {Array.from({ length: DOTS }).map((_, i) => (
                <button
                  key={i}
                  className={`rk-client-dot ${i === activeDot ? "rk-client-dot--active" : ""}`}
                  onClick={() => setCurrent(i * groupSize)}
                  aria-label={`Go to testimonial group ${i + 1}`}
                />
              ))}
            </div>

            <button className="rk-client-arrow" onClick={goNext} aria-label="Next testimonial">
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
