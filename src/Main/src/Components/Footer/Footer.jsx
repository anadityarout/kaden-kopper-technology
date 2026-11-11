import { useState } from "react";
import "./Footer.css";
import KKlogo from "../../assets/KKlogo.png";

/* =====================================================
   ICON HELPER (stroke icons by default, fill for brands)
===================================================== */
const Icon = ({ children, fill = false }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={fill ? "kk-icon kk-icon-fill" : "kk-icon"}
  >
    {children}
  </svg>
);

/* =====================================================
   DATA
===================================================== */
const COMPANY_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Our Projects", href: "/projects" },
  { label: "Careers", href: "/career" },
  { label: "Contact Us", href: "/contact" },
];

const SERVICE_LINKS = [
  { label: "Web Development", href: "/services/web-development" },
  { label: "App Development", href: "/services/app-development" },
    { label: "Digital Marketing", href: "/services/marketing" },
  { label: "SEO", href: "/services/seo" },
  { label: "Graphic Design", href: "/services/graphic-designer" },
  { label: "Video Editing", href: "/services/video-editor" },
  
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <Icon fill>
        <path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3C3.65 3 3 3.75 3 4.75S3.65 6.5 4.75 6.5 6.5 5.75 6.5 4.75 5.85 3 4.75 3ZM21 13.85C21 10.15 19.03 8 16.25 8c-1.55 0-2.59.85-3.03 1.65V8.5H9.75V21h3.47v-6.18c0-1.63.31-3.2 2.32-3.2 1.98 0 2 1.85 2 3.31V21H21v-7.15Z" />
      </Icon>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <Icon>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" />
      </Icon>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <Icon fill>
        <path d="M14 8h3V4h-3c-3.3 0-5 1.8-5 5v2H6v4h3v5h4v-5h3.2l.8-4H13V9c0-.7.3-1 1-1Z" />
      </Icon>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <Icon fill>
        <path d="M21.6 7.2c-.2-1.1-1.1-2-2.2-2.2C17.8 4.7 15 4.7 12 4.7s-5.8 0-7.4.3c-1.1.2-2 1.1-2.2 2.2C2.1 8.7 2.1 12 2.1 12s0 3.3.3 4.8c.2 1.1 1.1 2 2.2 2.2 1.6.3 4.4.3 7.4.3s5.8 0 7.4-.3c1.1-.2 2-1.1 2.2-2.2.3-1.5.3-4.8.3-4.8s0-3.3-.3-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
      </Icon>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <Icon fill>
        <path d="M18.9 3H22l-6.77 7.74L23.2 21h-6.24l-4.89-6.39L6.48 21H3.37l7.24-8.28L3 3h6.4l4.42 5.84L18.9 3Zm-1.09 15.8h1.73L8.46 5.08H6.6L17.81 18.8Z" />
      </Icon>
    ),
  },
];

const PERKS = [
  {
    label: "Tech Insights",
    icon: (
      <Icon>
        <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />
      </Icon>
    ),
  },
  {
    label: "Expert Tips",
    icon: (
      <Icon>
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
      </Icon>
    ),
  },
  {
    label: "Company Updates",
    icon: (
      <Icon>
        <path d="M6 20v-6M12 20V8M18 20v-10" />
      </Icon>
    ),
  },
];

const MAIL_PATHS = (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </>
);

/* =====================================================
   DECORATIVE ENVELOPE ART (replace with a PNG if you
   have the real 3D illustration)
===================================================== */
function EnvelopeArt() {
  return (
    <svg
      className="kk-news-art"
      viewBox="0 0 240 230"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="kkEnvBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7db8ff" />
          <stop offset="1" stopColor="#2f5dff" />
        </linearGradient>
        <linearGradient id="kkEnvFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9d2ff" />
          <stop offset="1" stopColor="#4f86ff" />
        </linearGradient>
        <linearGradient id="kkBell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3ab4ff" />
          <stop offset="1" stopColor="#5a4dff" />
        </linearGradient>
      </defs>

      <path
        d="M30 120c-6-60 40-100 100-92s95 52 85 110"
        fill="none"
        stroke="rgba(120,170,255,.35)"
        strokeWidth="1.2"
      />

      {/* paper plane */}
      <path d="M170 8 226 0 196 50 184 34 170 8Z" fill="#5db6ff" />
      <path d="m184 34 12 16 4-20Z" fill="#2f86e8" />

      {/* small note tile */}
      <g transform="rotate(-14 28 100)">
        <rect
          x="8"
          y="82"
          width="40"
          height="38"
          rx="8"
          fill="rgba(30,70,160,.55)"
          stroke="#4da0ff"
          strokeWidth="1.2"
        />
        <path
          d="M18 98h20M18 106h12"
          stroke="#8fc6ff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* envelope */}
      <g transform="rotate(14 130 130)">
        <rect x="52" y="68" width="150" height="108" rx="12" fill="url(#kkEnvBody)" />
        <rect x="72" y="46" width="100" height="70" rx="6" fill="#d6e8ff" />
        <path
          d="M84 64h54M84 76h72M84 88h40"
          stroke="#8eb4f5"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M52 80 127 138 202 80V170a12 12 0 0 1-12 12H64a12 12 0 0 1-12-12Z" fill="url(#kkEnvFlap)" opacity=".92" />
        <path d="M52 176 112 128M202 176 142 128" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
      </g>

      {/* bell badge */}
      <circle cx="205" cy="70" r="22" fill="url(#kkBell)" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
      <path
        d="M197 78h16l-2-3v-6a6 6 0 0 0-12 0v6l-2 3Zm5 4a3 3 0 0 0 6 0"
        fill="#fff"
      />
    </svg>
  );
}

/* =====================================================
   LINK COLUMN
===================================================== */
function LinkColumn({ title, icon, links, divided = false }) {
  return (
    <nav
      className={`kk-footer-column${divided ? " kk-divided" : ""}`}
      aria-label={title}
    >
      <h4 className="kk-footer-heading">
        <span className="kk-footer-heading-icon">{icon}</span>
        {title}
      </h4>

      <ul>
        {links.map((item) => (
          <li key={item.label}>
            <a href={item.href}>
              <span>{item.label}</span>
              <span className="kk-chevron">
                <Icon>
                  <path d="m9 6 6 6-6 6" />
                </Icon>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* =====================================================
   FOOTER
===================================================== */
function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // "" | "error" | "success"

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus("error");
      return;
    }

    // TODO: send `email` to your API (e.g. your AWS API Gateway endpoint) here
    setStatus("success");
    setEmail("");
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="kk-footer">
      <div className="kk-footer-main">
      {/* decorative wave + globe, bottom-left */}
      <div className="kk-footer-glow" aria-hidden="true">
        <svg viewBox="0 0 600 300" preserveAspectRatio="none">
          <path
            d="M0 120C120 130 220 190 300 300"
            fill="none"
            stroke="rgba(29,161,255,.55)"
            strokeWidth="1.5"
          />
          <path
            d="M0 200C90 210 160 250 210 300"
            fill="none"
            stroke="rgba(29,161,255,.35)"
            strokeWidth="1.5"
          />
        </svg>
        <span className="kk-footer-globe" />
      </div>

      <div className="kk-footer-container">
        {/* ============ BRAND ============ */}
        <div className="kk-footer-brand">
          <img
            src={KKlogo}
            alt="Kaden Koppers Technology"
            className="kk-footer-logo-image"
          />

          <h3>
            <span>Ideas. People.</span>
            <span>
              Technology. <em>Impact.</em>
            </span>
          </h3>

          <p className="kk-footer-desc">
            We build digital solutions that help businesses grow, innovate, and
            create a better tomorrow.
          </p>

          <div className="kk-social-links">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ============ COMPANY ============ */}
        <LinkColumn
          title="Company"
          links={COMPANY_LINKS}
          icon={
            <Icon>
              <path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10M10 20v-5h4v5" />
            </Icon>
          }
        />

        {/* ============ SERVICES ============ */}
        <LinkColumn
          title="Services"
          links={SERVICE_LINKS}
          divided
          icon={
            <Icon>
              <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />
            </Icon>
          }
        />

        {/* ============ NEWSLETTER ============ */}
        <section className="kk-newsletter" aria-labelledby="kk-news-title">
          <EnvelopeArt />

          <div className="kk-news-body">
            <span className="kk-news-badge">
              <Icon>{MAIL_PATHS}</Icon>
              Stay updated
            </span>

            <h4 id="kk-news-title" className="kk-news-title">
              Get the Latest <br />
              Tech <span>Insights</span>
            </h4>

            <p className="kk-news-text">
              Subscribe to our newsletter for industry insights, company
              updates, and the latest tech trends.
            </p>

            <form className="kk-news-form" onSubmit={handleSubmit} noValidate>
              <Icon>{MAIL_PATHS}</Icon>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("");
                }}
                placeholder="Enter your email address"
                aria-label="Email address"
                autoComplete="email"
              />
              <button type="submit" aria-label="Subscribe">
                <Icon>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </Icon>
              </button>
            </form>

            <p
              className={`kk-news-status ${status}`}
              role="status"
              aria-live="polite"
            >
              {status === "error" && "Enter a valid email address."}
              {status === "success" && "Subscribed. Thank you!"}
            </p>

            <ul className="kk-news-perks">
              {PERKS.map((p) => (
                <li key={p.label}>
                  <span className="kk-perk-icon">{p.icon}</span>
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      </div>

      {/* ============ BOTTOM BAR ============ */}
      <div className="kk-footer-bottom">
        <div className="kk-footer-copyright">
          <span className="kk-shield">
            <Icon>
              <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6L12 3ZM9 12l2.2 2.2L15.5 10" />
            </Icon>
          </span>
          <span>
            © {new Date().getFullYear()} Kaden Koppers Technology. All rights
            reserved.
          </span>
        </div>

        <div className="kk-footer-bottom-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <span aria-hidden="true">|</span>
          <a href="/terms">Terms &amp; Conditions</a>
          <span aria-hidden="true">|</span>
          <a href="/sitemap">Sitemap</a>
        </div>

        <div className="kk-footer-end">
          <div className="kk-footer-built">
            <span>Built with</span>
            <span className="kk-heart">
              <Icon>
                <path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11Z" />
              </Icon>
            </span>
            <span>for a Brighter Tomorrow.</span>
          </div>

          <button type="button" className="kk-top-btn" onClick={scrollToTop}>
            <span className="kk-top-icon">
              <Icon>
                <path d="M12 19V5M6 11l6-6 6 6" />
              </Icon>
            </span>
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
