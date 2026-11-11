import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import kkLogo from "../../assets/KKlogo.png";

// =====================================================
// SERVICE ICONS
// =====================================================

const SERVICE_ICONS = {
  web: (
    <>
      <polyline points="8 6 2 12 8 18" />
      <polyline points="16 6 22 12 16 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </>
  ),
  app: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18.01" />
    </>
  ),
  seo: (
    <>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </>
  ),
  video: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16" />
    </>
  ),
  design: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  marketing: (
    <>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </>
  ),
};

// =====================================================
// NAVIGATION LINKS
// =====================================================

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  {
    label: "Services",
    href: "/services",
    dropdown: true,
    grid: true,
    items: [
      {
        label: "Web Development",
        icon: "web",
        href: "/services/web-development",
      },
      {
        label: "App Development",
        icon: "app",
        href: "/services/app-development",
      },
      {
        label: "SEO",
        icon: "seo",
        href: "/services/seo",
      },
      {
        label: "Video Editor",
        icon: "video",
        href: "/services/video-editor",
      },
      {
        label: "Graphic Designer",
        icon: "design",
        href: "/services/graphic-designer",
      },
      {
        label: "Marketing",
        icon: "marketing",
        href: "/services/marketing",
      },
    ],
  },
  { label: "Industries", href: "/industries" },
  { label: "Project", href: "/project" },
  { label: "Career", href: "/career" },
  { label: "Contact us", href: "/contact" },
];

// =====================================================
// SERVICE ICON COMPONENT
// =====================================================

function ServiceIcon({ icon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {SERVICE_ICONS[icon]}
    </svg>
  );
}

// =====================================================
// NAVBAR
// =====================================================

function Navbar({ onBookConsultation }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdown = (label) => {
    setActiveDropdown((current) => (current === label ? null : label));
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleBookConsultation = () => {
    closeMenu();
    onBookConsultation?.();
  };

  return (
    <header className="kk-navbar">
      <div className="kk-navbar-container">
        {/* LOGO */}
        <Link
          to="/"
          className="kk-logo"
          onClick={closeMenu}
          aria-label="Kaden Koppers Technology Home"
        >
          <img
            src={kkLogo}
            alt="Kaden Koppers Technology"
            className="kk-logo-image"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="kk-nav" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <div
              key={link.label}
              className={`kk-nav-item ${link.dropdown ? "has-dropdown" : ""}`}
              onMouseEnter={() => {
                if (link.dropdown) setActiveDropdown(link.label);
              }}
              onMouseLeave={() => {
                if (link.dropdown) setActiveDropdown(null);
              }}
            >
              <Link to={link.href} className="kk-nav-link">
                <span>{link.label}</span>
                {link.dropdown && (
                  <span
                    className={`kk-arrow ${
                      activeDropdown === link.label ? "active" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ⌄
                  </span>
                )}
              </Link>

              {link.dropdown &&
                activeDropdown === link.label &&
                link.grid && (
                  <div className="kk-dropdown kk-dropdown-grid">
                    {link.items.map((item) => (
                      <Link
                        to={item.href}
                        key={item.label}
                        className="kk-dropdown-grid-link"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="kk-dropdown-icon">
                          <ServiceIcon icon={item.icon} />
                        </span>
                        <span className="kk-dropdown-grid-text">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="kk-actions">
          <button
            type="button"
            className="kk-cta"
            onClick={handleBookConsultation}
          >
            <span>Book Consultation</span>
            <svg
              viewBox="0 0 20 20"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 10h12" />
              <path d="M11 5l5 5-5 5" />
            </svg>
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className={`kk-menu-button ${menuOpen ? "open" : ""}`}
            onClick={() => {
              setMenuOpen((current) => !current);
              if (menuOpen) setActiveDropdown(null);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="kk-mobile-navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <div
        id="kk-mobile-navigation"
        className={`kk-mobile-menu ${menuOpen ? "show" : ""}`}
      >
        {NAV_LINKS.map((link) => (
          <div key={link.label} className="kk-mobile-item">
            {link.dropdown ? (
              <>
                {/* SERVICES TEXT AND ARROW HAVE SEPARATE ACTIONS */}
                <div className="kk-mobile-link-row">
                  <Link
                    to={link.href}
                    className="kk-mobile-link kk-mobile-main-link"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>

                  <button
                    type="button"
                    className="kk-mobile-dropdown-toggle"
                    onClick={() => handleDropdown(link.label)}
                    aria-label={`Toggle ${link.label} submenu`}
                    aria-expanded={activeDropdown === link.label}
                    aria-controls="kk-mobile-services-submenu"
                  >
                    <span
                      className={`kk-mobile-arrow ${
                        activeDropdown === link.label ? "active" : ""
                      }`}
                      aria-hidden="true"
                    >
                      ⌄
                    </span>
                  </button>
                </div>

                {/* SERVICES SUBMENU */}
                <div
                  id="kk-mobile-services-submenu"
                  className={`kk-mobile-submenu ${
                    activeDropdown === link.label ? "show" : ""
                  }`}
                >
                  {link.items.map((item) => (
                    <Link
                      to={item.href}
                      key={item.label}
                      onClick={closeMenu}
                    >
                      <span className="kk-mobile-submenu-icon">
                        <ServiceIcon icon={item.icon} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Link
                to={link.href}
                className="kk-mobile-link"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            )}
          </div>
        ))}

        {/* MOBILE BOOK CONSULTATION BUTTON */}
        <button
          type="button"
          className="kk-mobile-cta"
          onClick={handleBookConsultation}
        >
          <span>Book Consultation</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
